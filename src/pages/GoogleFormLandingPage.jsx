import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Sparkles, Send, ArrowRight, GraduationCap, Briefcase, 
  Calendar, BookOpen, User, Phone, Mail, FileText, CheckCircle2,
  Users, Code, Monitor, Compass, Award, ShieldCheck, Clock,
  Laptop, ChevronRight, Star, GraduationCap as CertIcon, ChevronDown, ChevronUp,
  Check, HelpCircle, Layers, Target, Rocket, ArrowDown, ExternalLink,
  Video, FileCheck, Search, Layout, Cpu, Activity, Lightbulb, PieChart, TrendingUp
} from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/mockDb';
import { COURSES_SUMMARY } from '../utils/coursesSummary';
import { saveLeadToSupabase, getISTDateTimeString } from '../utils/supabaseClient';
import { validateEmail, validatePhone } from '../utils/validationHelpers';
import TechIcon from '../components/TechIcon';

const TARGET_GOOGLE_SHEET_ID = '16TaibwOL9etC4ERNPT_VCe2TkTqKyrAylw4jcXVAHIk';
const TARGET_GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/16TaibwOL9etC4ERNPT_VCe2TkTqKyrAylw4jcXVAHIk/edit';

// Official website programs list strictly matched with site catalog
const WEBSITE_PROGRAMS = [
  { id: 'artificial-intelligence', title: 'Artificial Intelligence', icon: Cpu, category: 'AI/ML/DS', badge: 'High Demand' },
  { id: 'machine-learning', title: 'Machine Learning', icon: Cpu, category: 'AI/ML/DS', badge: 'Popular' },
  { id: 'full-stack-web', title: 'Full Stack Web Development (MERN)', icon: Code, category: 'Full Stack', badge: 'Best Seller' },
  { id: 'data-science', title: 'Data Science', icon: PieChart, category: 'AI/ML/DS', badge: 'In Demand' },
  { id: 'data-analytics', title: 'Data Analytics', icon: Activity, category: 'AI/ML/DS', badge: 'Top Rated' },
  { id: 'digital-marketing-cert', title: 'Digital Marketing', icon: Target, category: 'Marketing', badge: 'High ROI' },
  { id: 'cyber-security', title: 'Cyber Security', icon: ShieldCheck, category: 'Security', badge: 'Trending' },
  { id: 'cloud-computing', title: 'Cloud Computing', icon: Laptop, category: 'Cloud', badge: 'Essential' },
  { id: 'hr-mgmt', title: 'Human Resource Management & Operations', icon: Users, category: 'Management', badge: 'Core Role' },
  { id: 'stock-market', title: 'Stock Market & Financial Analysis', icon: TrendingUp, category: 'Finance', badge: 'Finance' }
];

const floatingTools = [
  { name: 'python', top: '6%', left: '4%', delay: '0s', scale: 0.85, animationClass: 'float-animation-1' },
  { name: 'javascript', top: '16%', left: '85%', delay: '1s', scale: 0.9, animationClass: 'float-animation-2' },
  { name: 'react', top: '68%', left: '3%', delay: '2s', scale: 0.95, animationClass: 'float-animation-3' },
  { name: 'sql', top: '48%', left: '92%', delay: '1.5s', scale: 0.8, animationClass: 'float-animation-1' },
  { name: 'node.js', top: '35%', left: '2%', delay: '3s', scale: 0.9, animationClass: 'float-animation-2' },
  { name: 'mongodb', top: '80%', left: '88%', delay: '0.5s', scale: 0.95, animationClass: 'float-animation-3' },
  { name: 'aws', top: '10%', left: '78%', delay: '2.5s', scale: 0.85, animationClass: 'float-animation-2' },
  { name: 'excel', top: '86%', left: '18%', delay: '1.2s', scale: 0.8, animationClass: 'float-animation-1' },
];

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
              <div className="bg-slate-900 border border-slate-700/30 shadow-md p-2.5 rounded-xl flex items-center justify-center w-12 h-12 hover:border-blue-500/30 transition-all duration-300">
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
    upskilling: 'artificial-intelligence',
    careerGoal: 'Placement Preparation'
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

  const scrollToForm = () => {
    const el = document.getElementById('application-form-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const nameInput = document.getElementById('hero-app-name');
      if (nameInput) nameInput.focus({ preventScroll: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Strict Field Validations
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.college.trim()) {
      setErrorMessage('Please fill in all required fields (Full Name, Mobile Number, Email, and College Name).');
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
      const selectedProgObj = WEBSITE_PROGRAMS.find(p => p.id === form.upskilling);
      const courseTitle = selectedProgObj ? selectedProgObj.title : form.upskilling;

      // Build lead record for Supabase & local DB with dedicated target Google Sheet ID
      const leadRecord = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        status: form.year,
        type: 'Meta/WA Campaign Leads',
        course_id: form.upskilling,
        course_title: courseTitle,
        student_details: `College: ${form.college.trim()} | Academic Year: ${form.year} | Goal: ${form.careerGoal}`,
        job_role: form.careerGoal,
        careerGoal: form.careerGoal,
        target_sheet_id: TARGET_GOOGLE_SHEET_ID,
        sheet_url: TARGET_GOOGLE_SHEET_URL,
        message: `College: ${form.college.trim()} | Year: ${form.year} | Goal: ${form.careerGoal}`
      };
      await saveLeadToSupabase(leadRecord);

      // Construct detailed notes containing extra metadata fields & Sheet router tag
      const detailedNotes = `
Academic Year: ${form.year}
College Name: ${form.college.trim()}
Primary Career Goal: ${form.careerGoal}
Preferred Program: ${courseTitle}
Target Google Sheet ID: ${TARGET_GOOGLE_SHEET_ID}
Target Sheet URL: ${TARGET_GOOGLE_SHEET_URL}
Submitted via BeyondSkills Program Application Landing Page
      `.trim();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        type: 'Meta/WA Campaign Leads',
        program: form.upskilling,
        notes: detailedNotes,
        college: form.college.trim(),
        profession: form.year,
        year: form.year,
        message: detailedNotes,
        careerGoal: form.careerGoal,
        targetSheetId: TARGET_GOOGLE_SHEET_ID,
        targetSheetUrl: TARGET_GOOGLE_SHEET_URL
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
      }).catch(err => console.log("Realtime backend webhook offline, proceeding with direct client sheet ingestion."));

      // 3. Direct Client-Side Google Apps Script Webhook Post (Target Sheet: admin@beyondskills.in)
      const directGoogleSheetWebhook = import.meta.env.VITE_GOOGLE_FORM_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbw4Lasp4ZzdJqG3-w4fDoxJ0ZPwsIy1l0xLmZ0WgkwnWC7z7BlgkwMPpesVPAC-Rdse/exec';
      if (directGoogleSheetWebhook) {
        const sheetParams = new URLSearchParams();
        sheetParams.append('spreadsheetId', TARGET_GOOGLE_SHEET_ID);
        sheetParams.append('targetSheetId', TARGET_GOOGLE_SHEET_ID);
        sheetParams.append('sheetId', TARGET_GOOGLE_SHEET_ID);
        sheetParams.append('name', form.name.trim());
        sheetParams.append('phone', form.phone.trim());
        sheetParams.append('email', form.email.trim());
        sheetParams.append('college', form.college.trim());
        sheetParams.append('year', form.year);
        sheetParams.append('program', courseTitle);
        sheetParams.append('careerGoal', form.careerGoal);
        sheetParams.append('date', getISTDateTimeString());
        sheetParams.append('SubmittedAt', getISTDateTimeString());

        try {
          fetch(directGoogleSheetWebhook, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: sheetParams.toString()
          }).catch(err => console.log('Direct sheet webhook post URLSearchParams:', err));

          fetch(directGoogleSheetWebhook, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain'
            },
            body: JSON.stringify({
              spreadsheetId: TARGET_GOOGLE_SHEET_ID,
              targetSheetId: TARGET_GOOGLE_SHEET_ID,
              sheetId: TARGET_GOOGLE_SHEET_ID,
              name: form.name.trim(),
              phone: form.phone.trim(),
              email: form.email.trim(),
              college: form.college.trim(),
              year: form.year,
              program: courseTitle,
              careerGoal: form.careerGoal,
              date: getISTDateTimeString()
            })
          }).catch(err => console.log('Direct sheet webhook post JSON:', err));
        } catch (e) {
          console.log('Client sheet fetch exception:', e);
        }
      }

      // Save to local DB as fallback
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
        profession: form.year,
        college: form.college.trim(),
        message: detailedNotes,
        targetSheetId: TARGET_GOOGLE_SHEET_ID,
        targetSheetUrl: TARGET_GOOGLE_SHEET_URL,
        mentor: 'None',
        duration: 'None',
        callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
        history: [{ note: detailedNotes, date: getISTDateTimeString() }]
      };
      
      localLeads.push(newLocalLead);
      setDbItem('beyondskills_leads', localLeads);

      // Trigger Simulated SLA toast
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: {
          subject: `Application Received: ${courseTitle}`,
          body: `Hello ${form.name},\n\nYour application for ${courseTitle} has been logged. Our admissions counselor will evaluate your profile and contact you for counseling & eligibility review shortly.\n\nSincerely,\nBeyondSkills Admissions Team`
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

  const programHighlights = [
    { title: 'Live Mentor-Led Training', desc: 'Interactive sessions with active industry professionals', icon: Users },
    { title: 'Internship Opportunities', desc: 'Eligibility & performance based opportunities', icon: Award },
    { title: '3+ Industry Projects', desc: 'Build practical portfolio-grade applications', icon: Code },
    { title: 'Industry-Recognized Certificate', desc: 'Verified credential for your resume & LinkedIn', icon: ShieldCheck },
    { title: 'Personalized Career Guidance', desc: '1-on-1 counseling session before enrollment', icon: Compass },
    { title: 'Resume & LinkedIn Review', desc: 'Professional optimization by talent mentors', icon: FileCheck },
    { title: 'Portfolio Building', desc: 'Showcase production code repositories to recruiters', icon: Laptop },
    { title: 'Live Doubt Support', desc: 'Real-time debugging & code review sessions', icon: HelpCircle },
    { title: 'Recorded Learning Access', desc: 'Revisit live lecture recordings anytime', icon: Video },
    { title: 'Multiple Career Programs', desc: 'Programs tailored across AI, Web, Cloud & Marketing', icon: Layers }
  ];

  const whyBeyondSkills = [
    { title: 'Learn Directly from Industry Professionals', desc: 'Instructors and mentors from leading tech & corporate organizations.', icon: Users },
    { title: 'Build 3+ Real-World Projects', desc: 'Hands-on project work designed to reflect actual industry workflows.', icon: Code },
    { title: 'Mentor-Led Practical Learning', desc: 'Interactive live classes with active query resolution and code feedback.', icon: Video },
    { title: 'Career-Focused Curriculum', desc: 'Continuously updated modules aligned with recruiter skill requirements.', icon: Target },
    { title: 'Resume & LinkedIn Optimization', desc: 'Tailored guidance to present your projects effectively to hiring teams.', icon: FileCheck },
    { title: 'Portfolio Development', desc: 'Build a tangible repository demonstrating real problem-solving capabilities.', icon: Laptop },
    { title: 'Industry-Recognized Certification', desc: 'Verified certificate validating program completion and hands-on work.', icon: ShieldCheck }
  ];

  const processSteps = [
    { step: '1', title: 'Apply Online', desc: 'Complete your application form with your college & program preference.' },
    { step: '2', title: 'Profile Review', desc: 'Our admissions team reviews your profile and academic details.' },
    { step: '3', title: 'Career Counseling', desc: 'Participate in a 1-on-1 counseling session to discuss your roadmap.' },
    { step: '4', title: 'Enrollment', desc: 'Confirm seat allocation and start learning in your chosen cohort.' }
  ];

  const faqsList = [
    {
      q: 'Who should apply?',
      a: 'College students, fresh graduates, and motivated learners who want to build practical skills, work on real projects, and prepare for career opportunities in tech, management, and digital domains.'
    },
    {
      q: 'Is prior coding experience required?',
      a: 'No prior coding experience is required. Programs start with fundamental concepts and progressively guide you through hands-on practical implementation.'
    },
    {
      q: 'How do internship opportunities work?',
      a: 'Eligible learners who maintain strong program attendance, complete mandatory project milestones, and meet eligibility criteria receive access to partner internship opportunities and recruitment referrals.'
    },
    {
      q: 'When do new batches start?',
      a: 'New cohorts launch every 2 to 4 weeks with limited batch sizes to ensure personalized mentor attention and active live doubt resolution.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative font-sans pb-20 md:pb-8">
      
      {/* 1. STICKY NAVIGATION HEADER (GUARANTEED STICKY WITH HIGH Z-INDEX & SHADOW) */}
      <header className="sticky top-0 z-[100] bg-white border-b border-slate-200/80 px-4 py-3 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1 group cursor-pointer" onClick={() => navigate('/')}>
            <span className="logo-font font-extrabold tracking-tight text-slate-950 text-xl">Beyond</span>
            <span className="logo-font font-extrabold tracking-tight text-[#2A4BFF] text-xl">Skills</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={scrollToForm}
              className="bg-[#2A4BFF] hover:bg-[#2A4BFF]/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-[#2A4BFF]/15"
            >
              Apply Now →
            </button>
          </div>
        </div>
      </header>

      <div className="py-6 sm:py-10 px-4">
        {/* Floating Background Icons */}
        {renderFloatingTools()}

        {/* Background Lights */}
        <div className="absolute top-[4%] left-[-10%] w-[450px] h-[450px] rounded-full blur-[140px] bg-[#2A4BFF]/5 pointer-events-none"></div>
        <div className="absolute top-[30%] right-[-10%] w-[450px] h-[450px] rounded-full blur-[140px] bg-[#0EA5E9]/5 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>

        <motion.div 
          className="max-w-6xl mx-auto space-y-12 sm:space-y-16 relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >

          {/* ========================================================================= */}
          {/* HERO SECTION WITH FORM INSIDE THE HERO (ABOVE THE FOLD ON DESKTOP)        */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            
            {/* HERO LEFT COLUMN: BADGES, HEADING & SUBHEADING */}
            <motion.div className="lg:col-span-6 space-y-6 text-left" variants={itemVariants}>
              
              {/* Premium Badges: REMOVED Admissions Open badge per user request */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 bg-[#2A4BFF]/10 border border-[#2A4BFF]/20 px-3.5 py-1.5 rounded-full text-[#2A4BFF] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm font-mono">
                  <Check className="w-3.5 h-3.5 text-[#2A4BFF]" />
                  <span>Limited Cohort Size</span>
                </span>

                <span className="inline-flex items-center space-x-1.5 bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-full text-purple-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm font-mono">
                  <Check className="w-3.5 h-3.5 text-purple-600" />
                  <span>Mentor-Led Learning</span>
                </span>
              </div>

              {/* Hero Headline */}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#0A0E35]">
                Apply for BeyondSkills <span className="bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] bg-clip-text text-transparent">Training & Internship Programs</span>
              </h1>

              {/* Hero Subheading */}
              <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                Join industry-focused mentor-led training programs designed for college students and fresh graduates. Learn in-demand skills, build real-world projects, receive personalized mentorship, earn industry-recognized certification and gain access to internship opportunities based on eligibility and program performance.
              </p>

              {/* Quick Trust Highlights */}
              <div className="pt-2 grid grid-cols-2 gap-3 max-w-md">
                <div className="bg-white/80 border border-slate-200 p-3 rounded-2xl flex items-center space-x-2.5 shadow-sm">
                  <div className="p-2 rounded-xl bg-[#2A4BFF]/10 text-[#2A4BFF]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Learners</p>
                    <p className="text-xs font-extrabold text-slate-900">10,000+ Enrolled</p>
                  </div>
                </div>

                <div className="bg-white/80 border border-slate-200 p-3 rounded-2xl flex items-center space-x-2.5 shadow-sm">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Rating</p>
                    <p className="text-xs font-extrabold text-slate-900">4.8 / 5 Learner Rating</p>
                  </div>
                </div>
              </div>

            </motion.div>

            {/* HERO RIGHT COLUMN: STUDENT APPLICATION FORM (VISIBLE IMMEDIATELY ON DESKTOP & TOP OF MOBILE) */}
            <motion.div className="lg:col-span-6" variants={itemVariants} id="application-form-card">
              <div className="bg-slate-950 border border-white/10 p-5 sm:p-7 rounded-3xl shadow-2xl space-y-5 text-slate-100 relative">
                
                <div className="border-b border-white/10 pb-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#2A4BFF] font-mono flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Official Application</span>
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                      Fast Track
                    </span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                    Student Application Form
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Fill out your details carefully to apply for mentor-led training & career counseling.
                  </p>
                </div>

                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/25 text-red-300 p-3.5 rounded-xl text-xs font-medium flex items-start space-x-2">
                    <span className="text-sm">⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Full Name */}
                  <div>
                    <label htmlFor="hero-app-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center font-mono">
                      <User className="w-3.5 h-3.5 mr-1 text-[#2A4BFF]" />
                      Full Name <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      id="hero-app-name"
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#2A4BFF] focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                    />
                  </div>

                  {/* Mobile & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="hero-app-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center font-mono">
                        <Phone className="w-3.5 h-3.5 mr-1 text-[#2A4BFF]" />
                        Mobile Number <span className="text-red-400 ml-1">*</span>
                      </label>
                      <input
                        id="hero-app-phone"
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#2A4BFF] focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="hero-app-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center font-mono">
                        <Mail className="w-3.5 h-3.5 mr-1 text-[#2A4BFF]" />
                        Email Address <span className="text-red-400 ml-1">*</span>
                      </label>
                      <input
                        id="hero-app-email"
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="yourname@example.com"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#2A4BFF] focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* College Name & Academic Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="hero-app-college" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center font-mono">
                        <GraduationCap className="w-3.5 h-3.5 mr-1 text-[#2A4BFF]" />
                        College Name <span className="text-red-400 ml-1">*</span>
                      </label>
                      <input
                        id="hero-app-college"
                        type="text"
                        name="college"
                        required
                        value={form.college}
                        onChange={handleChange}
                        placeholder="e.g. Delhi University / AKTU"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#2A4BFF] focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="hero-app-year" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center font-mono">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-[#2A4BFF]" />
                        Current Academic Year <span className="text-red-400 ml-1">*</span>
                      </label>
                      <select
                        id="hero-app-year"
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#2A4BFF] outline-none text-white transition-all cursor-pointer"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduated / Fresh Graduate">Graduated / Fresh Graduate</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Program: RESTRICTED STRICTLY TO OFFICIAL WEBSITE PROGRAMS */}
                  <div>
                    <label htmlFor="hero-app-upskilling" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center font-mono">
                      <BookOpen className="w-3.5 h-3.5 mr-1 text-[#2A4BFF]" />
                      Preferred Program <span className="text-red-400 ml-1">*</span>
                    </label>
                    <select
                      id="hero-app-upskilling"
                      name="upskilling"
                      value={form.upskilling}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#2A4BFF] outline-none text-white transition-all cursor-pointer font-medium text-blue-200"
                    >
                      {WEBSITE_PROGRAMS.map(prog => (
                        <option key={prog.id} value={prog.id}>
                          {prog.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Career Goal */}
                  <div>
                    <label htmlFor="hero-app-careerGoal" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center font-mono">
                      <Target className="w-3.5 h-3.5 mr-1 text-[#2A4BFF]" />
                      Career Goal <span className="text-red-400 ml-1">*</span>
                    </label>
                    <select
                      id="hero-app-careerGoal"
                      name="careerGoal"
                      value={form.careerGoal}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#2A4BFF] outline-none text-white transition-all cursor-pointer"
                    >
                      <option value="Placement Preparation">Placement Preparation</option>
                      <option value="Internship Preparation">Internship Preparation</option>
                      <option value="Upskilling">Upskilling</option>
                      <option value="Higher Studies">Higher Studies</option>
                      <option value="Career Switch">Career Switch</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                    </select>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] hover:opacity-95 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 mt-2"
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Logging Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Apply Now →</span>
                      </>
                    )}
                  </motion.button>

                </form>

              </div>
            </motion.div>

          </div>


          {/* ========================================================================= */}
          {/* PROGRAM HIGHLIGHTS FEATURE GRID                                           */}
          {/* ========================================================================= */}
          <motion.div 
            className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-slate-100 space-y-6"
            variants={itemVariants}
          >
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-[#2A4BFF]">Key Program Benefits</h3>
              <h2 className="text-xl sm:text-2xl font-black text-white">Program Highlights</h2>
              <p className="text-xs text-slate-400">Comprehensive features built to maximize your skill building and practical readiness.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
              {programHighlights.map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-2 flex flex-col justify-between hover:border-slate-700 transition-colors">
                    <div className="p-2 rounded-xl bg-[#2A4BFF]/10 text-[#2A4BFF] w-fit">
                      <FeatIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>


          {/* ========================================================================= */}
          {/* AVAILABLE PROGRAMS (STRICTLY OFFICIAL WEBSITE PROGRAMS ONLY)              */}
          {/* ========================================================================= */}
          <motion.div 
            className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-slate-100 space-y-6"
            variants={itemVariants}
          >
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-[#2A4BFF]">Official Catalog</h3>
              <h2 className="text-xl sm:text-2xl font-black text-white">Available Programs</h2>
              <p className="text-xs text-slate-400">Choose from official industry-aligned training tracks offered on BeyondSkills.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {WEBSITE_PROGRAMS.map((prog, idx) => {
                const ProgIcon = prog.icon;
                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      setForm(prev => ({ ...prev, upskilling: prog.id }));
                      scrollToForm();
                    }}
                    className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-[#2A4BFF]/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-[#2A4BFF]/10 text-[#2A4BFF] group-hover:scale-105 transition-transform">
                        <ProgIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                        {prog.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#2A4BFF] transition-colors">{prog.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Live Mentorship • Projects</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-[#2A4BFF]">
                      <span>Select Program</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>


          {/* ========================================================================= */}
          {/* WHY BEYONDSKILLS SECTION                                                  */}
          {/* ========================================================================= */}
          <motion.div 
            className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-slate-100 space-y-6"
            variants={itemVariants}
          >
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-[#2A4BFF]">Proven Value Proposition</h3>
              <h2 className="text-xl sm:text-2xl font-black text-white">Why BeyondSkills</h2>
              <p className="text-xs text-slate-400">Designed to bridge the gap between college academics and real-world corporate expectations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {whyBeyondSkills.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl space-y-2.5 hover:border-slate-700 transition-all">
                    <div className="p-2 rounded-xl bg-[#2A4BFF]/10 text-[#2A4BFF] w-fit">
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>


          {/* ========================================================================= */}
          {/* TRUST SECTION                                                             */}
          {/* ========================================================================= */}
          <motion.div 
            className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-slate-100"
            variants={itemVariants}
          >
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-[#2A4BFF]">Proven Track Record</h3>
              <h2 className="text-xl sm:text-2xl font-black text-white">Trusted by 10,000+ Learners Across India</h2>
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


          {/* ========================================================================= */}
          {/* APPLICATION PROCESS (SIMPLIFIED 4 STEPS)                                  */}
          {/* ========================================================================= */}
          <motion.div 
            className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-slate-100 space-y-8"
            variants={itemVariants}
          >
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-[#2A4BFF]">Simple Workflow</h3>
              <h2 className="text-xl sm:text-2xl font-black text-white">Application Process</h2>
              <p className="text-xs text-slate-400">Four straightforward steps to start your structured learning roadmap.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Desktop connection line */}
              <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-600/40 via-sky-500/40 to-emerald-500/40 z-0"></div>
              
              {processSteps.map((stepItem, idx) => (
                <div 
                  key={idx} 
                  className={`relative z-10 flex flex-col items-center text-center space-y-3 p-4 bg-slate-950/70 rounded-2xl border ${idx === 3 ? 'border-emerald-500/40' : 'border-slate-800'}`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-sm font-mono shadow-md ${
                    idx === 3 
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400' 
                      : 'bg-[#2A4BFF]/15 border border-[#2A4BFF]/40 text-[#2A4BFF]'
                  }`}>
                    {stepItem.step}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${idx === 3 ? 'text-emerald-300' : 'text-white'}`}>{stepItem.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{stepItem.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>


          {/* ========================================================================= */}
          {/* FREQUENTLY ASKED QUESTIONS                                                */}
          {/* ========================================================================= */}
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

      {/* FLOATING STICKY APPLY BAR ON MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950 border-t border-white/10 p-3 flex items-center justify-between shadow-2xl">
        <div>
          <p className="text-[10px] font-bold text-white uppercase tracking-wider">BeyondSkills Admissions</p>
          <p className="text-[9px] text-emerald-400 font-mono">Limited Cohort Seats Open</p>
        </div>
        <button
          onClick={scrollToForm}
          className="bg-[#2A4BFF] hover:bg-[#2A4BFF]/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          Apply Now →
        </button>
      </div>

    </div>
  );
}
