import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { COURSES, getDbItem, setDbItem } from '../utils/mockDb';
import { getISTDateTimeString } from '../utils/supabaseClient';
import { ShieldCheck, ShieldAlert, ArrowLeft, Lock, CheckSquare, Square } from 'lucide-react';

// Helper to dynamically load the Razorpay checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get('courseId');
  const learningMode = searchParams.get('mode') || 'mentor-led';

  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const courseFee = course ? (learningMode === 'self-paced' ? (course.selfPacedFee || Math.round(course.fee * 0.5)) : course.fee) : 0;

  useEffect(() => {
    // If user is already logged in, pre-fill form
    const loggedInUser = getDbItem('beyondskills_current_user', null);
    if (loggedInUser) {
      setForm({
        name: loggedInUser.name || '',
        email: loggedInUser.email || '',
        phone: loggedInUser.phone || ''
      });
    }

    if (courseId) {
      const match = COURSES.find(c => c.id === courseId);
      setCourse(match);
    }
  }, [courseId]);

  const handlePaymentSuccess = (paymentId) => {
    if (!course) return;

    // 1. Create student account or fetch existing
    const users = getDbItem('beyondskills_users', []);
    let targetUser = users.find(u => u.email === form.email);
    
    const newStudentId = `BS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedPassword = `BS-${Math.floor(100000 + Math.random() * 900000)}`;

    if (!targetUser) {
      // Create new user record
      targetUser = {
        email: form.email,
        phone: form.phone,
        name: form.name,
        password: generatedPassword,
        studentId: newStudentId,
        activeCourses: [course.id]
      };
      users.push(targetUser);
      setDbItem('beyondskills_users', users);
    } else {
      // Update user record: allocate course if not already owned
      if (!targetUser.activeCourses.includes(course.id)) {
        targetUser.activeCourses.push(course.id);
      }
      if (!targetUser.password || targetUser.password === 'password') {
        targetUser.password = generatedPassword;
      }
      // Save back users
      const updatedUsers = users.map(u => u.email === form.email ? targetUser : u);
      setDbItem('beyondskills_users', updatedUsers);
    }

    // 2. Set user as current session
    setDbItem('beyondskills_current_user', targetUser);
    window.dispatchEvent(new Event('auth_change'));

    // 3. Log payment record
    const payments = getDbItem('beyondskills_payments', []);
    payments.push({
      paymentId: paymentId,
      amount: courseFee,
      studentId: targetUser.studentId || newStudentId,
      courseId: course.id,
      email: form.email,
      status: 'Success',
      date: getISTDateTimeString(),
      mode: learningMode
    });
    setDbItem('beyondskills_payments', payments);

    // 4. Trigger simulated welcome email notifications toast with login credentials
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Enrollment Success & Login Credentials`,
        body: `Hi ${form.name},\n\nPayment successful (Ref ID: ${paymentId}).\n\nYour Login Credentials are:\nEmail: ${form.email}\nPassword: ${targetUser.password || generatedPassword}\nStudent ID: ${targetUser.studentId || newStudentId}`,
      }
    }));

    // 5. Trigger admin notification
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: {
          subject: `Admin Alert: New Enrollment`,
          body: `Student ${form.name} (${form.email}) has purchased ${course.title} (${learningMode === 'self-paced' ? 'Self Paced' : 'Mentor Led'}) for ₹${courseFee.toLocaleString()}.\nAllocated Student ID: ${targetUser.studentId || newStudentId}. Onboarding SLA completed.`
        }
      }));
    }, 3000);

    setPaymentLoading(false);
    
    // Navigate to onboarding screen
    navigate(`/onboarding?courseId=${course.id}&payId=${paymentId}&studentId=${targetUser.studentId || newStudentId}`);
  };

  const handleStartPayment = async (e) => {
    e.preventDefault();
    if (!agreeDisclaimer) {
      alert('You must acknowledge the No Placement Guarantee disclaimer to proceed with payment.');
      return;
    }

    setPaymentLoading(true);

    // Load Razorpay checkout.js script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load. Please check your network connection.');
      setPaymentLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TCue3MeTa0JPao',
      amount: courseFee * 100, // amount in paise
      currency: 'INR',
      name: 'BeyondSkills - Upskilling Hub',
      description: `Enrollment fee for ${course.title} (${learningMode === 'self-paced' ? 'Self Paced' : 'Mentor Led'})`,
      image: window.location.origin + '/logo.png',
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: {
        color: '#1B2A8A',
      },
      handler: function (response) {
        // Successful payment callback
        const paymentId = response.razorpay_payment_id;
        handlePaymentSuccess(paymentId);
      },
      modal: {
        ondismiss: function () {
          setPaymentLoading(false);
          console.log('Razorpay modal closed');
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Razorpay Payment Failed event:', response.error);
        alert(`Payment Failed: ${response.error.description} (Error Code: ${response.error.code})`);
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Failed to open Razorpay payment window:', err);
      alert('Failed to initialize Razorpay checkout. Please check the console logs.');
      setPaymentLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="text-slate-900 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-brand-blue mb-4" />
        <h2 className="text-xl font-bold mb-2">No Course Selected for Checkout</h2>
        <Link to="/courses" className="bg-brand-purple text-white font-bold px-6 py-2 rounded-lg text-xs uppercase">
          Return to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="text-slate-900 min-h-screen relative pt-12 pb-24">
      {/* Background Glow */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        {/* Back Link */}
        <Link to={`/courses?id=${course.id}`} className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-brand-purple uppercase tracking-wider mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Syllabus</span>
        </Link>

        {/* Title */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-bold tracking-widest text-brand-purple uppercase">Secure Academy Checkout</span>
          <h1 className="logo-font text-3xl font-extrabold text-slate-900 mt-2">
            Complete Program Enrollment
          </h1>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* Form Details Left */}
          <div className="md:col-span-3 space-y-6">
            
            <div className="glass-panel p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-purple pl-3">
                Learner Registration
              </h3>
              
              <form onSubmit={handleStartPayment} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="Enter Full Name" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="enteremail@gmail.com" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="+91 98765 43210" />
                </div>

                {/* CRITICAL Placement Disclaimer Confirmation Checkbox */}
                <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <button type="button" onClick={() => setAgreeDisclaimer(!agreeDisclaimer)} className="text-brand-purple mt-0.5 focus:outline-none">
                      {agreeDisclaimer ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500 hover:text-slate-900" />
                      )}
                    </button>
                    <div className="text-[11px] text-slate-700 leading-relaxed text-justify">
                      <strong className="text-slate-900 uppercase font-bold block mb-1">MANDATORY PLACEMENT AGREEMENT:</strong>
                      I explicitly acknowledge that BeyondSkills Upskilling Academy provides skills development, certifications, and project reviews, and <strong>DOES NOT guarantee jobs, placements, salary packages, or internship offers</strong>. Enrollment is entirely governed by academic guidelines.
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={paymentLoading} className="w-full bg-gradient-to-r from-[#1B2A8A] to-[#2563EB] hover:brightness-110 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all mt-6 flex items-center justify-center space-x-2 disabled:opacity-50">
                  <Lock className="w-4 h-4" />
                  <span>{paymentLoading ? 'Opening Secure Checkout...' : 'Secure Razorpay Payment'}</span>
                </button>
              </form>
            </div>

          </div>

          {/* Pricing Summary Right */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Purchase Summary</h3>
              
              <div className="border-b border-slate-200/60 pb-4">
                <span className="text-[10px] text-brand-purple font-bold uppercase">{course.category} Program</span>
                <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight mt-1">{course.title}</p>
                <span className="text-xs text-slate-500 block mt-1">Duration: {course.duration}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 font-semibold border-b border-slate-100 pb-2">
                  <span>Selected Format</span>
                  <span className="text-brand-purple uppercase text-[9px] bg-brand-purple/5 border border-brand-purple/20 px-2.5 py-0.5 rounded font-bold">
                    {learningMode === 'self-paced' ? 'Self Paced' : 'Mentor Led'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>recorded lectures</span>
                  <span className="text-slate-900">Included</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Live Mentor schedules</span>
                  <span className={learningMode === 'self-paced' ? 'text-slate-400 font-bold' : 'text-slate-900'}>
                    {learningMode === 'self-paced' ? 'Excluded' : 'Included'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Certification download</span>
                  <span className="text-slate-900">Included</span>
                </div>
              </div>

              <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between font-bold">
                <span className="text-xs text-slate-700 uppercase">Total Cost</span>
                <span className="text-lg text-slate-900">₹{courseFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/60 p-4 rounded-xl flex items-center space-x-3 text-slate-500 text-xs">
              <ShieldCheck className="w-8 h-8 text-brand-purple flex-shrink-0" />
              <span>Razorpay 256-bit SSL encrypted connection. Your transactions are secure.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
