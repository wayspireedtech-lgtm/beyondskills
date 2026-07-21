import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Sparkles, Send, ArrowRight, GraduationCap, Briefcase, 
  Calendar, BookOpen, User, Phone, Mail, FileText, CheckCircle2,
  Users, Code, Monitor, Compass, Award, ShieldCheck, Clock,
  Laptop, ChevronRight, Star, GraduationCap as CertIcon, ChevronDown, ChevronUp,
  Check, HelpCircle, Layers, Target, Rocket, ArrowDown
} from 'lucide-react';
import { COURSES, setDbItem, getDbItem } from '../utils/mockDb';
import { saveLeadToSupabase, getISTDateTimeString } from '../utils/supabaseClient';
import { validateEmail, validatePhone } from '../utils/validationHelpers';
import TechIcon from '../components/TechIcon';

const floatingTools = [
  { name: 'python', top: '8%', left: '4%', delay: '0s', scale: 0.85, animationClass: 'float-animation-1' },
  { name: 'javascript', top: '18%', left: '85%', delay: '1s', scale: 0.9, animationClass: 'float-animation-2' },
  { name: 'react', top: '70%', left: '5%', delay: '2s', scale: 0.95, animationClass: 'float-animation-3' },
  { name: 'sql', top: '52%', left: '90%', delay: '1.5s', scale: 0.8, animationClass: 'float-animation-1' },
  { name: 'node.js', top: '38%', left: '3%', delay: '3s', scale: 0.9, animationClass: 'float-animation-2' },
  { name: 'mongodb', top: '82%', left: '86%', delay: '0.5s', scale: 0.95, animationClass: 'float-animation-3' },
  { name: 'aws', top: '10%', left: '78%', delay: '2.5s', scale: 0.85, animationClass: 'float-animation-2' },
  { name: 'excel', top: '88%', left: '20%', delay: '1.2s', scale: 0.8, animationClass: 'float-animation-1' },
];

// Helper Animated Counter Component utilizing Framer Motion's useInView
function AnimatedCounter({ value, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const target = parseFloat(value.replace(/,/g, ''));
    if (isNaN(target)) {
      setCount(value);
      return;
    }
    const end = target;
    if (start === end) return;

    const isFloat = value.includes('.');
    const steps = 50;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = progress * (2 - progress);
      const nextCount = start + (end - start) * easedProgress;

      if (currentStep >= steps) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(isFloat ? Math.round(nextCount * 10) / 10 : Math.round(nextCount));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  const formatCount = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return val.toString();
    }
    return val;
  };

  return <span ref={ref}>{formatCount(count)}{suffix}</span>;
}

export default function GoogleFormLandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const renderFloatingTools = () => {
    return (
      <>
        <style>{`
          @keyframes float-slow-1 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
            50% { transform: translateY(-12px) translateX(6px) rotate(3deg); }
          }
          @keyframes float-slow-2 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
            50% { transform: translateY(-16px) translateX(-5px) rotate(-2deg); }
          }
          @keyframes float-slow-3 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
            50% { transform: translateY(-10px) translateX(8px) rotate(4deg); }
          }
          .float-animation-1 { animation: float-slow-1 8s infinite ease-in-out; }
          .float-animation-2 { animation: float-slow-2 10s infinite ease-in-out; }
          .float-animation-3 { animation: float-slow-3 12s infinite ease-in-out; }
        `}</style>
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {floatingTools.map((tool, index) => (
            <div
              key={index}
              className={`absolute transition-all duration-500 hidden md:block ${tool.animationClass}`}
              style={{
                top: tool.top,
                left: tool.left,
                animationDelay: tool.delay,
                transform: `scale(${tool.scale})`,
              }}
            >
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/30 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-2.5 rounded-xl flex items-center justify-center w-12 h-12 hover:border-blue-500/30 transition-all duration-300">
                <TechIcon name={tool.name} className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'College Student',
    college: '',
    upskilling: 'ai-data-science',
    careerGoal: 'Placement Preparation',
    learningStart: 'Immediately',
    weeklyTime: '10–15'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Validate required fields
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setErrorMessage('Please fill in all required fields (Full Name, Phone Number, and Email Address).');
      setIsSubmitting(false);
      return;
    }
    if (!validateEmail(form.email)) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      setIsSubmitting(false);
      return;
    }
    if (!validatePhone(form.phone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
      setIsSubmitting(false);
      return;
    }

    try {
      // Find course name for logs
      const selectedCourse = COURSES.find(c => c.id === form.upskilling);
      const courseTitle = selectedCourse ? selectedCourse.title : form.upskilling;

      // 0. Save to Supabase (dynamic client with fallbacks)
      const leadRecord = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        status: form.status,
        type: 'Organic Leads',
        course_id: form.upskilling,
        course_title: courseTitle,
        student_details: `College/Org: ${form.college || 'N/A'} | Status: ${form.status} | Goal: ${form.careerGoal} | Start: ${form.learningStart} | Weekly Dedication: ${form.weeklyTime}`,
        job_role: form.careerGoal,
        careerGoal: form.careerGoal,
        message: `Goal: ${form.careerGoal} | Start: ${form.learningStart} | Weekly Hours: ${form.weeklyTime}`
      };
      await saveLeadToSupabase(leadRecord);

      // Construct detailed notes containing extra metadata fields
      const detailedNotes = `
Academic/Professional Status: ${form.status}
College / Organization: ${form.college || 'N/A'}
Primary Career Objective: ${form.careerGoal}
Planned Learning Start: ${form.learningStart}
Weekly Learning Dedication: ${form.weeklyTime} hours
Preferred Program: ${courseTitle}
Submitted via BeyondSkills Program Application Page
      `.trim();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        type: 'Organic Leads',
        program: form.upskilling,
        notes: detailedNotes,
        college: form.college.trim() || 'Unspecified',
        profession: form.status,
        message: detailedNotes,
        careerGoal: form.careerGoal,
        learningStart: form.learningStart,
        weeklyTime: form.weeklyTime
      };

      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? (window.location.port === '5173' ? 'http://localhost:5001' : 'http://localhost:5000')
        : window.location.origin;

      await fetch(`${apiHost}/api/webhook/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // 2. Also save to local storage for local client redundancy
      const localLeads = getDbItem('beyondskills_leads', []);
      const newLocalLead = {
        id: `LD${String(localLeads.length + 101).padStart(3, '0')}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        date: getISTDateTimeString(),
        type: payload.type,
        program: payload.program,
        assignedBDM: '',
        assignedBDA: '',
        status: 'New',
        subStatus: 'QUALIFIED',
        profession: form.status,
        college: form.college.trim() || 'Unspecified',
        message: detailedNotes,
        mentor: 'None',
        duration: 'None',
        callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
        history: [{ note: detailedNotes, date: getISTDateTimeString() }]
      };
      
      localLeads.push(newLocalLead);
      setDbItem('beyondskills_leads', localLeads);

      // Trigger Simulated SLA toast on front-end for visual feedback
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: {
          subject: `Application Received: ${courseTitle}`,
          body: `Hello ${form.name},\n\nYour application for ${courseTitle} has been logged in our admissions queue. An academic admissions officer will evaluate your details and reach out for counseling shortly.\n\nSincerely,\nBeyondSkills Admissions Team`
        }
      }));

      const programSlug = (payload.program || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      window.location.href = `/thank-you/${programSlug}?program=${encodeURIComponent(payload.program)}`;
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrorMessage('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  const snapshotItems = [
    { title: 'Duration', desc: '2–4 Months', icon: Clock },
    { title: 'Mentorship', desc: 'Live Mentor Sessions', icon: Users },
    { title: 'Practical Projects', desc: '3+ Industry Projects', icon: Code },
    { title: 'Certification', desc: 'Industry-Recognized Certificate', icon: ShieldCheck },
    { title: 'Career Guidance', desc: 'Personalized 1-on-1 Sessions', icon: Compass },
    { title: 'Learning Path', desc: 'Structured Learning Roadmap', icon: Layers }
  ];

  const whoShouldApplyList = [
    { title: 'College Students', desc: 'Building core technical capabilities alongside academic degree', icon: GraduationCap },
    { title: 'Fresh Graduates', desc: 'Seeking structured industry readiness and practical portfolio projects', icon: Award },
    { title: 'Working Professionals', desc: 'Upskilling in AI, Full Stack, Cloud & Marketing to unlock promotions', icon: Briefcase },
    { title: 'Career Switchers', desc: 'Transitioning from non-tech domains into high-growth tech roles', icon: Rocket },
    { title: 'Beginners', desc: 'Starting from fundamentals with step-by-step guided mentorship', icon: User }
  ];

  const processTimeline = [
    { step: '1', title: 'Submit Application', desc: 'Complete your application form carefully with your target career goals.' },
    { step: '2', title: 'Application Review', desc: 'Our admissions team evaluates your background & readiness.' },
    { step: '3', title: 'Career Counseling', desc: 'Participate in a 1-on-1 profile guidance session with our advisor.' },
    { step: '4', title: 'Program Recommendation', desc: 'Receive your custom program roadmap and cohort allocation.' },
    { step: '5', title: 'Enrollment', desc: 'Confirm seat allocation and unlock live batch access.' }
  ];

  const faqsList = [
    {
      q: 'Is prior coding experience required?',
      a: 'No prior coding experience is required. All BeyondSkills programs begin with core foundational concepts before moving into advanced hands-on projects, making them suitable for beginners as well as experienced learners.'
    },
    {
      q: 'Who should apply?',
      a: 'College students, fresh graduates, working professionals, career switchers, and beginners who are committed to structured upskilling and building a professional career in AI, Full Stack, Marketing, Cloud, or Cyber Security domains.'
    },
    {
      q: 'How does the admission process work?',
      a: 'Once you submit your application, our admissions team reviews your credentials and goals. Eligible applicants are invited for a one-on-one career counseling session where we recommend the most suitable program before final enrollment.'
    },
    {
      q: 'When do new cohorts begin?',
      a: 'New cohorts launch every 2 to 4 weeks with restricted cohort sizes to ensure high mentor-to-student interaction, dedicated code reviews, and individual career guidance.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative overflow-x-hidden font-sans">
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 px-4 py-3 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1 group">
            <span className="logo-font font-extrabold tracking-tight text-slate-950 text-xl">Beyond</span>
            <span className="logo-font font-extrabold tracking-tight text-[#2A4BFF] text-xl">Skills</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                const el = document.getElementById('student-app-form');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="bg-[#2A4BFF] hover:bg-[#2A4BFF]/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-[#2A4BFF]/15"
            >
              Apply for Admission →
            </button>
          </div>
        </div>
      </header>

      <div className="py-8 sm:py-12 px-4">
        {/* Floating Background Icons */}
        {renderFloatingTools()}

        {/* Background Radial Lights */}
        <div className="absolute top-[5%] left-[-10%] w-[450px] h-[450px] rounded-full blur-[140px] bg-[#2A4BFF]/5 pointer-events-none"></div>
        <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] rounded-full blur-[140px] bg-[#0EA5E9]/5 pointer-events-none"></div>
        
        {/* Custom grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>

        <motion.div 
          className="max-w-6xl mx-auto space-y-12 relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* HERO SECTION */}
          <motion.div className="flex flex-col items-center text-center space-y-5" variants={itemVariants}>
            
            {/* Above the Heading: 3 Premium Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-emerald-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm font-mono">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admissions Open</span>
              </span>

              <span className="inline-flex items-center space-x-1.5 bg-[#2A4BFF]/10 border border-[#2A4BFF]/20 px-3.5 py-1.5 rounded-full text-[#2A4BFF] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm font-mono">
                <Check className="w-3.5 h-3.5 text-[#2A4BFF]" />
                <span>Application Based Selection</span>
              </span>

              <span className="inline-flex items-center space-x-1.5 bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-full text-purple-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm font-mono">
                <Check className="w-3.5 h-3.5 text-purple-600" />
                <span>Limited Cohort Size</span>
              </span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#0A0E35] max-w-4xl">
              Apply for BeyondSkills <span className="bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] bg-clip-text text-transparent">Career Accelerator Programs</span>
            </h1>

            {/* Hero Subheading */}
            <p className="text-slate-600 text-xs sm:text-base max-w-3xl mx-auto leading-relaxed">
              Complete your application to receive a personalized program recommendation from our admissions team. Eligible applicants will be invited for a one-on-one career counseling session before enrollment.
            </p>
          </motion.div>

          {/* MAIN TWO-COLUMN SECTION: PROGRAM SNAPSHOT & APPLICATION FORM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: PROGRAM SNAPSHOT */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div 
                className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-slate-100 space-y-6"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-[#2A4BFF]">Program Snapshot</h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20">Executive Quality</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                  {snapshotItems.map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={idx} className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl flex items-center space-x-3.5 hover:border-slate-700 transition-colors">
                        <div className="p-2.5 rounded-xl bg-[#2A4BFF]/10 text-[#2A4BFF] shrink-0">
                          <ItemIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{item.title}</p>
                          <p className="text-xs sm:text-sm font-bold text-white mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-950 border border-slate-800/90 p-4 rounded-2xl flex items-start space-x-3.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Admissions Review SLA</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Applications are processed in order of submission. Eligible applicants are scheduled for counselor review within 24 hours.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: APPLICATION FORM */}
            <div className="lg:col-span-7" id="student-app-form">
              <motion.div 
                className="bg-slate-950/95 border border-white/10 p-5 sm:p-8 rounded-3xl shadow-2xl space-y-6 text-slate-100 backdrop-blur-xl relative"
                variants={itemVariants}
              >
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-2 text-[#2A4BFF] mb-1">
                    <CertIcon className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest font-mono">Admission Portal</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Student Application Form
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                    Complete your details carefully. Our admissions team reviews every application before recommending the most suitable program.
                  </p>
                </div>

                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/25 text-red-300 p-4 rounded-2xl text-xs font-medium flex items-start space-x-2">
                    <span className="text-base">⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Personal & Contact Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A4BFF] flex items-center font-mono">
                      <span className="w-2 h-2 rounded-full bg-[#2A4BFF] mr-2"></span>
                      1. Applicant Credentials
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="gf-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center font-mono">
                          <User className="w-3.5 h-3.5 mr-1.5 text-[#2A4BFF]" />
                          Full Name <span className="text-red-400 ml-1">*</span>
                        </label>
                        <input
                          id="gf-name"
                          type="text"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#2A4BFF] focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="gf-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center font-mono">
                          <Phone className="w-3.5 h-3.5 mr-1.5 text-[#2A4BFF]" />
                          Phone Number <span className="text-red-400 ml-1">*</span>
                        </label>
                        <input
                          id="gf-phone"
                          type="tel"
                          name="phone"
                          required
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#2A4BFF] focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="gf-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center font-mono">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-[#2A4BFF]" />
                        Email Address <span className="text-red-400 ml-1">*</span>
                      </label>
                      <input
                        id="gf-email"
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. yourname@example.com"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#2A4BFF] focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Academic & Professional Status */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A4BFF] flex items-center font-mono">
                      <span className="w-2 h-2 rounded-full bg-[#2A4BFF] mr-2"></span>
                      2. Academic & Professional Profile
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="gf-status" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center font-mono">
                          <Briefcase className="w-3.5 h-3.5 mr-1.5 text-[#2A4BFF]" />
                          Current Status <span className="text-red-400 ml-1">*</span>
                        </label>
                        <select
                          id="gf-status"
                          name="status"
                          value={form.status}
                          onChange={handleChange}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#2A4BFF] outline-none text-white transition-all cursor-pointer"
                        >
                          <option value="College Student">College Student</option>
                          <option value="Fresh Graduate">Fresh Graduate</option>
                          <option value="Working Professional">Working Professional</option>
                          <option value="Career Switcher">Career Switcher</option>
                          <option value="Beginner">Beginner</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="gf-college" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center font-mono">
                          <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-[#2A4BFF]" />
                          College / Organization <span className="text-red-400 ml-1">*</span>
                        </label>
                        <input
                          id="gf-college"
                          type="text"
                          name="college"
                          required
                          value={form.college}
                          onChange={handleChange}
                          placeholder="e.g. Delhi University / Wipro"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#2A4BFF] focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="gf-upskilling" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center font-mono">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#2A4BFF]" />
                        Preferred Program <span className="text-red-400 ml-1">*</span>
                      </label>
                      <select
                        id="gf-upskilling"
                        name="upskilling"
                        value={form.upskilling}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#2A4BFF] outline-none text-white transition-all cursor-pointer font-medium text-blue-200"
                      >
                        <option value="ai-data-science">Artificial Intelligence, Machine Learning & Data Science</option>
                        <option value="full-stack-web-development">Full Stack Web Development (MERN Stack)</option>
                        <option value="digital-marketing">Digital Marketing & Performance Marketing</option>
                        <option value="cloud-computing">Cloud Computing & DevOps Engineering</option>
                        <option value="cyber-security">Cyber Security & Ethical Hacking</option>
                      </select>
                    </div>
                  </div>

                  {/* QUALIFICATION QUESTIONS */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A4BFF] flex items-center font-mono">
                      <span className="w-2 h-2 rounded-full bg-[#2A4BFF] mr-2"></span>
                      3. Admission Qualification Questions
                    </h4>

                    {/* Question 1: Career Objective */}
                    <div>
                      <label htmlFor="gf-careerGoal" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center font-mono">
                        <Target className="w-3.5 h-3.5 mr-1.5 text-[#2A4BFF]" />
                        What is your primary career objective? <span className="text-red-400 ml-1">*</span>
                      </label>
                      <select
                        id="gf-careerGoal"
                        name="careerGoal"
                        value={form.careerGoal}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#2A4BFF] outline-none text-white transition-all cursor-pointer"
                      >
                        <option value="Internship Preparation">Internship Preparation</option>
                        <option value="Placement Preparation">Placement Preparation</option>
                        <option value="Upskilling">Upskilling</option>
                        <option value="Career Switch">Career Switch</option>
                        <option value="Freelancing">Freelancing</option>
                        <option value="Higher Studies">Higher Studies</option>
                        <option value="Entrepreneurship">Entrepreneurship</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Question 2: How soon */}
                      <div>
                        <label htmlFor="gf-learningStart" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center font-mono">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#2A4BFF]" />
                          How soon do you want to begin learning? <span className="text-red-400 ml-1">*</span>
                        </label>
                        <select
                          id="gf-learningStart"
                          name="learningStart"
                          value={form.learningStart}
                          onChange={handleChange}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#2A4BFF] outline-none text-white transition-all cursor-pointer"
                        >
                          <option value="Immediately">Immediately</option>
                          <option value="Within 2 Weeks">Within 2 Weeks</option>
                          <option value="Within 1 Month">Within 1 Month</option>
                          <option value="Just Exploring">Just Exploring</option>
                        </select>
                      </div>

                      {/* Question 3: Hours weekly */}
                      <div>
                        <label htmlFor="gf-weeklyTime" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center font-mono">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-[#2A4BFF]" />
                          How many hours can you dedicate weekly? <span className="text-red-400 ml-1">*</span>
                        </label>
                        <select
                          id="gf-weeklyTime"
                          name="weeklyTime"
                          value={form.weeklyTime}
                          onChange={handleChange}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#2A4BFF] outline-none text-white transition-all cursor-pointer"
                        >
                          <option value="Less than 5">Less than 5</option>
                          <option value="5–10">5–10</option>
                          <option value="10–15">10–15</option>
                          <option value="15+">15+</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* DISCLAIMER ABOVE BUTTON */}
                  <div className="pt-2">
                    <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-white/5 font-sans">
                      By submitting this application, you agree to be contacted by the BeyondSkills Admissions Team for eligibility review, career guidance and program recommendation.
                    </p>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] hover:opacity-95 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-lg shadow-blue-500/20"
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Evaluating Application Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Apply for Admission →</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>

          </div>

          {/* TRUST SECTION */}
          <motion.div 
            className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-slate-100"
            variants={itemVariants}
          >
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-[#2A4BFF]">Proven Track Record</h3>
              <h2 className="text-xl sm:text-2xl font-black text-white">Backed by Metrics of Trust</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all">
                <p className="text-4xl sm:text-5xl font-black text-white">
                  <AnimatedCounter value="10000" suffix="+" />
                </p>
                <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-mono font-bold">Learners</p>
              </div>
              
              <div className="text-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all">
                <p className="text-4xl sm:text-5xl font-black text-white">
                  <AnimatedCounter value="100" suffix="+" />
                </p>
                <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-mono font-bold">Partner Colleges</p>
              </div>

              <div className="text-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all">
                <p className="text-4xl sm:text-5xl font-black text-white flex items-center justify-center">
                  <AnimatedCounter value="4.8" />
                  <Star className="w-7 h-7 text-amber-400 fill-amber-400 ml-1 inline-block" />
                </p>
                <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-mono font-bold">Learner Rating</p>
              </div>
            </div>
          </motion.div>

          {/* WHO SHOULD APPLY SECTION */}
          <motion.div 
            className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-slate-100 space-y-6"
            variants={itemVariants}
          >
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-[#2A4BFF]">Target Applicants</h3>
              <h2 className="text-xl sm:text-2xl font-black text-white">Who Should Apply</h2>
              <p className="text-xs text-slate-400">Our structured programs are built for motivated individuals committed to career acceleration.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {whoShouldApplyList.map((target, idx) => {
                const TargetIcon = target.icon;
                return (
                  <motion.div 
                    key={idx} 
                    className="bg-slate-950/60 border border-slate-800/70 p-5 rounded-2xl space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all"
                    whileHover={{ y: -4 }}
                  >
                    <div className="p-2.5 rounded-xl bg-[#2A4BFF]/10 text-[#2A4BFF] w-fit">
                      <TargetIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{target.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{target.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* PROCESS SECTION: PREMIUM HORIZONTAL ADMISSIONS TIMELINE */}
          <motion.div 
            className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-slate-100 space-y-8"
            variants={itemVariants}
          >
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-[#2A4BFF]">Structured Selection</h3>
              <h2 className="text-xl sm:text-2xl font-black text-white">Admissions Process</h2>
              <p className="text-xs text-slate-400">Our five-step evaluation ensures structured enrollment & personalized mentorship.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {/* Desktop connection line */}
              <div className="hidden md:block absolute top-[28px] left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-blue-600/40 via-sky-500/40 to-emerald-500/40 z-0"></div>
              
              {processTimeline.map((stepItem, idx) => (
                <div 
                  key={idx} 
                  className={`relative z-10 flex flex-col items-center text-center space-y-3 p-4 bg-slate-950/70 rounded-2xl border ${idx === 4 ? 'border-emerald-500/40' : 'border-slate-800'}`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-sm font-mono shadow-md ${
                    idx === 4 
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400' 
                      : 'bg-[#2A4BFF]/15 border border-[#2A4BFF]/40 text-[#2A4BFF]'
                  }`}>
                    {stepItem.step}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${idx === 4 ? 'text-emerald-300' : 'text-white'}`}>{stepItem.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{stepItem.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ SECTION */}
          <motion.div 
            className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-slate-100 space-y-6"
            variants={itemVariants}
          >
            <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
              <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-[#2A4BFF]">Frequently Asked Questions</h3>
              <h2 className="text-xl sm:text-2xl font-black text-white">Got Questions?</h2>
            </div>

            <div className="space-y-3.5 max-w-3xl mx-auto">
              {faqsList.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 text-left flex items-center justify-between space-x-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-white flex items-center">
                      <HelpCircle className="w-4 h-4 mr-2.5 text-[#2A4BFF] shrink-0" />
                      {faq.q}
                    </span>
                    {activeFaq === index ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {activeFaq === index && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-400 border-t border-slate-800/60 leading-relaxed font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* FOOTER NAV LINK */}
          <motion.div className="text-center pt-2" variants={itemVariants}>
            <p className="text-xs text-slate-500">
              Looking to explore all training programs?{' '}
              <button
                onClick={() => navigate('/courses')}
                className="text-[#0EA5E9] hover:underline font-bold transition-all cursor-pointer inline-flex items-center space-x-0.5 ml-1"
              >
                <span>Browse Courses Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
