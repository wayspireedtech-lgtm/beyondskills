import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { COURSES, getDbItem, setDbItem } from '../utils/mockDb';
import { ShieldCheck, ShieldAlert, ArrowLeft, CreditCard, Lock, Sparkles, CheckSquare, Square } from 'lucide-react';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get('courseId');

  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, upi, netbanking

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

  const handleStartPayment = (e) => {
    e.preventDefault();
    if (!agreeDisclaimer) {
      alert('You must acknowledge the No Placement Guarantee disclaimer to proceed with payment.');
      return;
    }
    setShowRazorpay(true);
  };

  const handleCompleteMockPayment = () => {
    if (!course) return;

    setPaymentLoading(true);
    
    // Simulate transaction delay
    setTimeout(() => {
      // 1. Create student account or fetch existing
      const users = getDbItem('beyondskills_users', []);
      let targetUser = users.find(u => u.email === form.email);
      
      const newStudentId = `BS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      if (!targetUser) {
        // Create new user record
        targetUser = {
          email: form.email,
          phone: form.phone,
          name: form.name,
          password: 'password', // Default temporary password
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
        // Save back users
        const updatedUsers = users.map(u => u.email === form.email ? targetUser : u);
        setDbItem('beyondskills_users', updatedUsers);
      }

      // 2. Set user as current session
      setDbItem('beyondskills_current_user', targetUser);
      window.dispatchEvent(new Event('auth_change'));

      // 3. Log payment record
      const payments = getDbItem('beyondskills_payments', []);
      const newPayId = `pay_mock_${Math.floor(100000 + Math.random() * 900000)}`;
      payments.push({
        orderId: newPayId,
        amount: course.fee,
        studentId: targetUser.studentId || newStudentId,
        courseId: course.id,
        email: form.email,
        status: 'Success',
        date: new Date().toISOString()
      });
      setDbItem('beyondskills_payments', payments);

      // 4. Trigger simulated welcome email notifications toast SLA
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: {
          subject: `Enrollment Success & Onboarding Checklist`,
          body: `Hi ${form.name},\n\nPayment successful (Ref ID: ${newPayId}). Your student ID is ${targetUser.studentId || newStudentId}.\n\nWelcome to your learning platform! Registered login details:\nEmail: ${form.email}\nTemp Password: password\n\nYour dashboard workspace is active. Let's start!`,
        }
      }));

      // 5. Trigger admin notification
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('beyondskills_toast', {
          detail: {
            subject: `Admin Alert: New Enrollment`,
            body: `Student ${form.name} (${form.email}) has purchased ${course.title} for ₹${course.fee.toLocaleString()}.\nAllocated Student ID: ${targetUser.studentId || newStudentId}. Onboarding SLA completed.`
          }
        }));
      }, 3000);

      setPaymentLoading(false);
      setShowRazorpay(false);
      
      // Navigate to onboarding screen
      navigate(`/onboarding?courseId=${course.id}&payId=${newPayId}&studentId=${targetUser.studentId || newStudentId}`);
    }, 2000);
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
                  <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-250 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none shadow-sm focus:border-brand-purple outline-none" placeholder="Enter Full Name" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-250 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none shadow-sm focus:border-brand-purple outline-none" placeholder="enteremail@gmail.com" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-250 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none shadow-sm focus:border-brand-purple outline-none" placeholder="+91 98765 43210" />
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

                <button type="submit" className="w-full bg-gradient-to-r from-brand-purple to-brand-blue hover:brightness-110 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all mt-6 flex items-center justify-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure Razorpay Payment</span>
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
                <div className="flex justify-between text-slate-500">
                  <span>recorded lectures</span>
                  <span className="text-slate-900">Included</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Live Mentor schedules</span>
                  <span className="text-slate-900">Included</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Certification download</span>
                  <span className="text-slate-900">Included</span>
                </div>
              </div>

              <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between font-bold">
                <span className="text-xs text-slate-700 uppercase">Total Cost</span>
                <span className="text-lg text-slate-900">₹{course.fee.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/40 border border-slate-200/60 p-4 rounded-xl flex items-center space-x-3 text-slate-500 text-xs">
              <ShieldCheck className="w-8 h-8 text-brand-purple flex-shrink-0" />
              <span>Razorpay 256-bit SSL encrypted connection. Your transactions are secure.</span>
            </div>
          </div>

        </div>

      </div>

      {/* RAZORPAY MODAL SIMULATION */}
      {showRazorpay && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white/90 flex items-center justify-center p-4">
          <div className="bg-[#1C2036] border border-white/15 rounded-xl max-w-md w-full shadow-2xl overflow-hidden font-sans">
            
            {/* Header: Razorpay Styled */}
            <div className="bg-[#111425] p-5 flex items-center justify-between border-b border-slate-200/60">
              <div className="flex items-center space-x-2">
                <div className="bg-[#3399FF] text-slate-900 p-1 rounded font-extrabold text-[10px] uppercase">
                  RP
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">BeyondSkills Academy</h4>
                  <p className="text-[10px] text-slate-500">Order ID: od_bs_2026_pay</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Amount</span>
                <span className="text-sm font-extrabold text-slate-900">₹{course.fee.toLocaleString()}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              
              {paymentLoading ? (
                /* Loading Sequence */
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[#3399FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Processing Payment Transaction...</p>
                  <p className="text-[10px] text-slate-500">Contacting Razorpay Gateway (Secure Mock Portal)</p>
                </div>
              ) : (
                /* Payment Options */
                <div className="space-y-4">
                  <div className="text-[10px] font-bold text-[#3399FF] uppercase tracking-wider mb-2">Select Mock Payment Method</div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button type="button" onClick={() => setPaymentMethod('card')} className={`p-3 rounded-lg border text-center transition-all ${paymentMethod === 'card' ? 'border-[#3399FF] bg-[#3399FF]/10 text-slate-900' : 'border-slate-200/60 bg-slate-100 text-slate-500'}`}>
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-center" />
                      <span className="text-[9px] uppercase font-bold">Card</span>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('upi')} className={`p-3 rounded-lg border text-center transition-all ${paymentMethod === 'upi' ? 'border-[#3399FF] bg-[#3399FF]/10 text-slate-900' : 'border-slate-200/60 bg-slate-100 text-slate-500'}`}>
                      <Sparkles className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-[9px] uppercase font-bold">UPI / GPay</span>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('net')} className={`p-3 rounded-lg border text-center transition-all ${paymentMethod === 'net' ? 'border-[#3399FF] bg-[#3399FF]/10 text-slate-900' : 'border-slate-200/60 bg-slate-100 text-slate-500'}`}>
                      <Lock className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-[9px] uppercase font-bold">NetBank</span>
                    </button>
                  </div>

                  <div className="border border-slate-200/60 rounded-xl p-4 bg-slate-100 space-y-3 text-xs">
                    {paymentMethod === 'card' && (
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Mock Card Number</label>
                        <input type="text" readOnly className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded px-2.5 py-1.5 font-mono text-slate-700 text-xs" value="4111 2222 3333 4444" />
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Expiry</label>
                            <input type="text" readOnly className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 text-xs text-center" value="12/28" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-500 uppercase">CVV</label>
                            <input type="password" readOnly className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 text-xs text-center" value="123" />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">UPI Virtual Address</label>
                        <input type="text" readOnly className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded px-2.5 py-1.5 font-mono text-slate-700 text-xs" value="student@okhdfcbank" />
                      </div>
                    )}

                    {paymentMethod === 'net' && (
                      <div className="space-y-2 text-center py-2 text-slate-500 text-[11px]">
                        Mock NetBanking routing will initiate via HDFC Sandbox account.
                      </div>
                    )}
                  </div>

                  {/* Mandated Placement Disclaimer inside payment portal header */}
                  <div className="bg-[#EE534F]/10 border border-[#EE534F]/20 p-3 rounded-lg text-[10px] text-slate-700 leading-relaxed text-justify">
                    <strong>Placement Disclaimer:</strong> By clicking pay, you confirm understanding that enrollment provides certifications only, with no job placement guarantee.
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button type="button" onClick={() => setShowRazorpay(false)} className="w-1/3 bg-slate-100 border border-slate-200 hover:bg-white/10 text-slate-900 font-bold py-2.5 rounded-lg text-xs uppercase">
                      Cancel
                    </button>
                    <button type="button" onClick={handleCompleteMockPayment} className="w-2/3 bg-[#3399FF] hover:bg-[#2288EE] text-slate-900 font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-[#3399FF]/20">
                      Pay Mock Amount
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="bg-[#111425] p-3 text-center border-t border-slate-200/60 text-[9px] text-slate-500 uppercase tracking-widest flex items-center justify-center space-x-1">
              <Lock className="w-3 h-3 text-[#3399FF]" />
              <span>Razorpay Secure Sandbox Mode</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
