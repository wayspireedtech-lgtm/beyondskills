import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Sparkles, Send, ArrowRight, GraduationCap, Briefcase, 
  Calendar, BookOpen, User, Phone, Mail, FileText, CheckCircle,
  Users, Code, Monitor, Compass, Award, ShieldCheck, Clock,
  Laptop, ChevronRight, Star, GraduationCap as CertIcon
} from 'lucide-react';
import { COURSES, setDbItem, getDbItem } from '../utils/mockDb';
import { saveLeadToSupabase } from '../utils/supabaseClient';
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
      // easeOutQuad
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
    college: '',
    year: '1st Year',
    role: 'Student',
    upskilling: 'artificial-intelligence',
    whyInterested: 'Not specified',
    batch: 'July Batch',
    projectExp: 'Not specified',
    careerGoal: 'Skill Development',
    learningStart: 'Immediately',
    weeklyTime: 'Not specified',
    hasLaptop: 'Not specified',
    completedCert: 'Not specified'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
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
      setErrorMessage('Please fill in all required fields (Name, Phone, and Email).');
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
        status: form.role,
        course_id: form.upskilling,
        course_title: courseTitle,
        student_details: `College: ${form.college || 'N/A'} | Year: ${form.year} | Batch: ${form.batch} | Start: ${form.learningStart} | Weekly Hours: ${form.weeklyTime} | Laptop: ${form.hasLaptop} | PriorCert: ${form.completedCert}`,
        job_role: form.projectExp || 'None',
        careerGoal: form.careerGoal,
        message: form.whyInterested || 'N/A'
      };
      await saveLeadToSupabase(leadRecord);

      // Construct detailed notes containing extra metadata fields
      const detailedNotes = `
College: ${form.college || 'N/A'}
Year: ${form.year}
Status: ${form.role}
Batch: ${form.batch}
Project Work Experience: ${form.projectExp || 'None'}
Primary Career Goal: ${form.careerGoal}
Planned Start: ${form.learningStart}
Weekly Time Dedication: ${form.weeklyTime}
Laptop Access: ${form.hasLaptop}
Completed Prior Certification: ${form.completedCert}
Why Interested: ${form.whyInterested || 'N/A'}
Submitted via Google Form Campaign page
      `.trim();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        type: 'Google Form Leads',
        program: form.upskilling,
        notes: detailedNotes,
        college: form.college.trim() || 'Unspecified',
        profession: form.role,
        year: form.year,
        batch: form.batch,
        projectExp: form.projectExp.trim() || 'None',
        whyInterested: form.whyInterested.trim() || 'N/A',
        message: detailedNotes,
        // Include new qualification parameters in payload
        careerGoal: form.careerGoal,
        learningStart: form.learningStart,
        weeklyTime: form.weeklyTime,
        hasLaptop: form.hasLaptop,
        completedCert: form.completedCert
      };

      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? (window.location.port === '5173' ? 'http://localhost:5001' : 'http://localhost:5000')
        : window.location.origin;

      const response = await fetch(`${apiHost}/api/webhook/leads`, {
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
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: payload.type,
        program: payload.program,
        assignedBDM: '',
        assignedBDA: '',
        status: 'New',
        subStatus: 'QUALIFIED',
        profession: form.role,
        college: form.college.trim() || 'Unspecified',
        message: detailedNotes,
        mentor: 'None',
        duration: 'None',
        callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
        history: [{ note: detailedNotes, date: new Date().toISOString() }]
      };
      
      localLeads.push(newLocalLead);
      setDbItem('beyondskills_leads', localLeads);

      // Trigger Simulated SLA toast on front-end for visual feedback
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: {
          subject: `Program Application Received`,
          body: `Hello ${form.name},\n\nWe have successfully received your admission application for the ${courseTitle} (${form.batch}) accelerator program.\nOur admissions team will review your profile details and contact eligible applicants shortly.\n\nSincerely,\nBeyondSkills Admissions Team`
        }
      }));

      window.location.href = '/thank-you';
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Failed to connect to the server. Please try again.');
      setSubmitStatus('error');
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

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col items-center justify-center p-6 relative font-sans overflow-hidden">
        {renderFloatingTools()}

        {/* Glow Effects */}
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full blur-[120px] bg-emerald-500/5 pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full blur-[120px] bg-blue-500/5 pointer-events-none"></div>

        <div className="max-w-md w-full bg-slate-950/95 border border-white/10 p-8 rounded-3xl text-center space-y-6 shadow-2xl relative z-10 text-slate-100 backdrop-blur-xl">
          <div className="flex justify-center mb-2">
            <img 
              src="/logo.png" 
              alt="Beyond Skills Logo" 
              className="h-16 w-auto object-contain mix-blend-multiply"
            />
          </div>

          <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-2xl border border-emerald-500/20 shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white">Application Submitted!</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Thank you for applying. Your profile is now under review. An admissions officer will contact you within 24 hours to schedule a profile evaluation.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-[#0EA5E9] hover:opacity-95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10"
            >
              <span>Go to Home Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => {
                setForm({
                  name: '',
                  phone: '',
                  email: '',
                  college: '',
                  year: '1st Year',
                  role: 'Student',
                  upskilling: 'artificial-intelligence',
                  whyInterested: 'Not specified',
                  batch: 'July Batch',
                  projectExp: 'Not specified',
                  careerGoal: 'Skill Development',
                  learningStart: 'Immediately',
                  weeklyTime: 'Not specified',
                  hasLaptop: 'Not specified',
                  completedCert: 'Not specified'
                });
                setSubmitStatus(null);
              }}
              className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all border border-white/10 cursor-pointer"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative overflow-x-hidden font-sans">
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 px-4 py-3 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1 group">
            <span className="logo-font font-extrabold tracking-tight text-slate-955 text-xl">Beyond</span>
            <span className="logo-font font-extrabold tracking-tight text-blue-600 text-xl">Skills</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                const el = document.getElementById('gf-name');
                if (el) {
                  el.focus({ preventScroll: false });
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow"
            >
              Apply Now
            </button>
          </div>
        </div>
      </header>

      <div className="py-10 px-4">
        {/* Floating Background Icons */}
        {renderFloatingTools()}

        {/* Decorative Lights */}
        <div className="absolute top-[5%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[130px] bg-blue-500/5 pointer-events-none"></div>
        <div className="absolute top-[35%] right-[-10%] w-[450px] h-[450px] rounded-full blur-[140px] bg-[#0EA5E9]/5 pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full blur-[130px] bg-indigo-500/5 pointer-events-none"></div>
        
        {/* Custom grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>

        <motion.div 
          className="max-w-6xl mx-auto space-y-10 relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Brand Logo & Top Info */}
          <motion.div className="flex flex-col items-center text-center space-y-4" variants={itemVariants}>
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3.5 py-1.5 rounded-full text-blue-600 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Program Application</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 max-w-3xl">
              Apply for the <span className="bg-gradient-to-r from-blue-600 to-[#0EA5E9] bg-clip-text text-transparent">Training Program</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              Complete your application to receive personalized career guidance and explore the BeyondSkills program best suited to your career goals. Our admissions team will review your application and contact eligible applicants.
            </p>
          </motion.div>

          {/* Responsive Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDEBAR: Program Details, Value Prop and Trust Metrics */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Program Snapshot Card */}
              <motion.div 
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl text-slate-100 space-y-4"
                variants={itemVariants}
              >
                <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-blue-400">Program Snapshot</h3>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Duration</p>
                      <p className="text-xs font-bold text-white">2 to 4 Months</p>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Learning Mode</p>
                      <p className="text-xs font-bold text-white">Live + Recorded</p>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                      <Code className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Industry Projects</p>
                      <p className="text-xs font-bold text-white">3+ Projects</p>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Mentorship</p>
                      <p className="text-xs font-bold text-white">Live Sessions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Certification Status</p>
                    <p className="text-xs font-bold text-white">Industry Recognized Professional Credential</p>
                  </div>
                </div>
              </motion.div>

              {/* Trust and Stats Section */}
              <motion.div 
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl text-slate-100"
                variants={itemVariants}
              >
                <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-blue-400 mb-4">Proven Outcomes</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3.5 bg-slate-950/50 rounded-xl border border-slate-800/65 hover:border-slate-700 transition-colors">
                    <p className="text-2xl sm:text-3xl font-black text-white">
                      <AnimatedCounter value="10000" suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Learners</p>
                  </div>
                  
                  <div className="text-center p-3.5 bg-slate-950/50 rounded-xl border border-slate-800/65 hover:border-slate-700 transition-colors">
                    <p className="text-2xl sm:text-3xl font-black text-white">
                      <AnimatedCounter value="50" suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Live Projects</p>
                  </div>

                  <div className="text-center p-3.5 bg-slate-950/50 rounded-xl border border-slate-800/65 hover:border-slate-700 transition-colors">
                    <p className="text-2xl sm:text-3xl font-black text-white">
                      <AnimatedCounter value="100" suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Colleges</p>
                  </div>

                  <div className="text-center p-3.5 bg-slate-950/50 rounded-xl border border-slate-800/65 hover:border-slate-700 transition-colors">
                    <p className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center">
                      <AnimatedCounter value="4.8" />
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400 ml-1 inline-block" />
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Learner Rating</p>
                  </div>
                </div>
              </motion.div>

            {/* Why Students Choose BeyondSkills */}
            <motion.div 
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl text-slate-100 space-y-4"
              variants={itemVariants}
            >
              <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-blue-400">Why Students Choose BeyondSkills</h3>
              
              <div className="space-y-3">
                <motion.div 
                  className="flex items-start space-x-3 p-2 rounded-xl hover:bg-slate-955 transition-colors"
                  whileHover={{ x: 3 }}
                >
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Industry Mentors</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Direct guidance from tech leaders working at Capgemini, Deloitte, EY, and more.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-3 p-2 rounded-xl hover:bg-slate-955 transition-colors"
                  whileHover={{ x: 3 }}
                >
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Hands-on Projects</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Build 3+ production-grade products tailored to align with active job descriptions.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-3 p-2 rounded-xl hover:bg-slate-955 transition-colors"
                  whileHover={{ x: 3 }}
                >
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Live Interactive Classes</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Engage in interactive modules, real-time code reviews, and direct query solving.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-3 p-2 rounded-xl hover:bg-slate-955 transition-colors"
                  whileHover={{ x: 3 }}
                >
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Career Guidance</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">1-on-1 profile mapping sessions to review target opportunities and skill gaps.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-3 p-2 rounded-xl hover:bg-slate-955 transition-colors"
                  whileHover={{ x: 3 }}
                >
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Resume Projects</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Build industry-grade projects that can be added to your CV and GitHub portfolio.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-3 p-2 rounded-xl hover:bg-slate-955 transition-colors"
                  whileHover={{ x: 3 }}
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-300">Industry Certification</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Earn verified credentials recognized and valued by top corporate recruiters.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Redesigned Admission Application Form */}
          <div className="lg:col-span-7">
            <motion.div 
              className="bg-slate-950/95 border border-white/10 p-5 sm:p-8 rounded-3xl shadow-2xl space-y-6 text-slate-100 backdrop-blur-xl relative"
              variants={itemVariants}
            >
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center">
                  <CertIcon className="w-5 h-5 mr-2 text-blue-400" />
                  Program Admission Application
                </h2>
                <p className="text-xs text-slate-400 mt-1">Please fill out all credentials honestly. Eligible profiles are routed directly to counselor reviews.</p>
              </div>

              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/25 text-red-300 p-4 rounded-xl text-xs font-medium">
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Field Section 1: Contact Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                    1. Contact Information
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gf-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
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
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="gf-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                        Phone Number <span className="text-red-400 ml-1">*</span>
                      </label>
                      <input
                        id="gf-phone"
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 9876543210"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="gf-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                      Email Address <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      id="gf-email"
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. john@gmail.com"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Field Section 2: Academic Profile */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                    2. Profile Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gf-role" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                        <Briefcase className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                        Current Profile
                      </label>
                      <select
                        id="gf-role"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none text-white transition-all cursor-pointer"
                      >
                        <option value="Student">Student</option>
                        <option value="Working Professional">Working Professional</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="gf-year" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                        Academic Year
                      </label>
                      <select
                        id="gf-year"
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none text-white transition-all cursor-pointer"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduated">Graduated</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="gf-college" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                      <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                      College / Institute <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      id="gf-college"
                      type="text"
                      name="college"
                      required
                      value={form.college}
                      onChange={handleChange}
                      placeholder="Enter college name or employer company"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Field Section 3: Program Preferences */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                    3. Program Preferences
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gf-upskilling" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                        Preferred Program
                      </label>
                      <select
                        id="gf-upskilling"
                        name="upskilling"
                        value={form.upskilling}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none text-white transition-all cursor-pointer"
                      >
                        {COURSES.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="gf-learningStart" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                        Planning to Begin Learning
                      </label>
                      <select
                        id="gf-learningStart"
                        name="learningStart"
                        value={form.learningStart}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none text-white transition-all cursor-pointer"
                      >
                        <option value="Immediately">Immediately</option>
                        <option value="Within 30 Days">Within 30 Days</option>
                        <option value="Within 3 Months">Within 3 Months</option>
                        <option value="Just Exploring">Just Exploring</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-[#0EA5E9] hover:opacity-95 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-lg shadow-blue-500/20"
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

        </div>

        {/* BOTTOM: Redesigned Admission Process Timeline */}
        <motion.div 
          className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-slate-100 space-y-6"
          variants={itemVariants}
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-bold text-white">Admissions & Counseling Process</h3>
            <p className="text-xs text-slate-400">Our evaluation pipeline filters applicants to ensure cohort commitment and high peer quality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connection line for desktop */}
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-600/30 via-sky-500/30 to-emerald-500/20 z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shadow-inner shadow-blue-500/10">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Submit Application</h4>
                <p className="text-[10px] text-slate-400 mt-1">Complete your student credentials and target goals.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shadow-inner shadow-blue-500/10">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Career Counseling Session</h4>
                <p className="text-[10px] text-slate-400 mt-1">Review profiles with BDA to gauge readiness.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shadow-inner shadow-blue-500/10">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Program Recommendation</h4>
                <p className="text-[10px] text-slate-400 mt-1">Unlock cohort recommendations matching your roadmap.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3 p-4 bg-slate-950/40 rounded-2xl border border-emerald-500/30">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-inner shadow-emerald-500/10">
                4
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-300">Enrollment</h4>
                <p className="text-[10px] text-slate-400 mt-1">Secure seat enrollment inside the upcoming curriculum.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Explore other courses footer links */}
        <motion.div className="text-center pt-2" variants={itemVariants}>
          <p className="text-xs text-slate-500">
            Want to see our curriculum catalog first?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-[#0EA5E9] hover:underline font-bold transition-all cursor-pointer inline-flex items-center space-x-0.5 ml-1 animate-pulse"
            >
              <span>Explore other courses</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </p>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}
