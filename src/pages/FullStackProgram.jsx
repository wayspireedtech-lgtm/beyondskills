import React, { useState, useEffect } from 'react';
import { 
  Code, BookOpen, Clock, Award, Users, CheckCircle, ArrowRight, Check, 
  ChevronRight, Calendar, ShieldAlert, Sparkles, Phone, Mail, Globe, 
  Star, Briefcase, Zap, Compass, HelpCircle, ChevronDown, ChevronUp, Download
} from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/mockDb';

export default function FullStackProgram() {
  const [faqOpen, setFaqOpen] = useState({});
  const [selectedCurriculumTab, setSelectedCurriculumTab] = useState('frontend');
  
  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    status: 'Undergraduate Student',
    message: ''
  });
  const [enquiryStatus, setEnquiryStatus] = useState(null);

  // Active step in roadmap
  const [activeStep, setActiveStep] = useState(0);

  // Interactive Code Editor state
  const [codeTab, setCodeTab] = useState('react');
  const [codeEditorText, setCodeEditorText] = useState('');

  // Curriculum tabs data
  const curriculumData = {
    frontend: {
      title: 'Frontend Development',
      description: 'Master the visual layer of the web. Learn how to design elegant layouts, implement interactive elements, and build modular components.',
      items: ['HTML5 & Semantic Elements', 'CSS3 Layouts: Flexbox & Grid', 'Responsive Media Queries', 'JavaScript ES6+ Fundamentals', 'Asynchronous JS (Promises, Async/Await)', 'React Component Architecture', 'React State Management (Hooks, Context API)', 'Tailwind CSS utility styling']
    },
    backend: {
      title: 'Backend Development',
      description: 'Architect the engines that power web applications. Master routing, server design, user authentication, and data integrity.',
      items: ['Node.js Runtime Engine', 'Express.js Server Framework', 'REST API Design Principles', 'Writing Custom Middlewares', 'JWT (JSON Web Token) Security', 'Password Hashing with Bcrypt', 'CORS Security Config', 'File Uploads with Cloudinary']
    },
    databases: {
      title: 'Databases & Storage',
      description: 'Model scalable storage solutions. Learn how to structure tables and documents to manage application data efficiently.',
      items: ['NoSQL Document Databases', 'MongoDB Atlas & Cloud Hosting', 'Mongoose ODM (Schemas & Validation)', 'Relational Databases (MySQL)', 'SQL Schema Design & Normalization', 'Complex Table Joins & Queries', 'Database Security & Access Roles', 'CRUD Operations Optimization']
    },
    tools: {
      title: 'Developer Tools & Operations',
      description: 'Work like a professional engineer. Learn standard revision workflows, API inspection utilities, and cloud deployment pipelines.',
      items: ['Git Version Control', 'GitHub Collaboration & PR Workflows', 'VS Code Configurations & Shortcuts', 'Postman API Testing Suites', 'Environment Variables Management', 'Vercel Frontend Hosting', 'Render Backend Deployments', 'Netlify Static Assets Hosting']
    }
  };

  const faqItems = [
    {
      q: "Do I need a coding or computer science background to enroll?",
      a: "No prior coding knowledge is required. We start from absolute basics—from understanding HTML tags to deploying complex MERN apps. This program is specifically designed to bridge the gap for beginners, engineering students from other branches, and non-tech graduates."
    },
    {
      q: "How will the live training sessions be scheduled?",
      a: "The program spans 4 months with 40+ hours of live training. Live interactive classes are scheduled on weekends to easily accommodate college classes or weekday jobs. During weekdays, you will work on assignments, review recorded materials, and get dedicated support in our community channels."
    },
    {
      q: "What is the certificate verification process?",
      a: "Upon completing the program deliverables (projects & assessments), you will receive a unique verifiable BeyondSkills Academy Certificate. This certificate is indexed in our database, allowing potential recruiters to instantly verify its authenticity on our /verify portal using your student ID."
    },
    {
      q: "What kind of career support do you provide?",
      a: "We offer end-to-end career guidance: we help you build an ATS-friendly resume, optimize your GitHub repositories, audit your LinkedIn profile, and conduct mock interviews led by tech professionals. We focus on enabling you to confidently navigate your own placement process and land tech roles."
    },
    {
      q: "Is there any refund policy for this program?",
      a: "No, program registration fees are non-refundable as we provision direct servers, licenses, and mentor resources upon enrollment. We encourage you to download the syllabus and read all compliance disclosures before registering."
    }
  ];

  // Auto transition code snippet based on tab
  useEffect(() => {
    if (codeTab === 'react') {
      setCodeEditorText(`// ProductCard.jsx
import React, { useState } from 'react';

export default function ProductCard({ title, price }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold text-[#111111]">{title}</h3>
      <p className="text-xl font-bold text-[#2D43B8] mt-2">₹\${price}</p>
      <button 
        onClick={() => setAdded(true)} 
        className="w-full mt-4 py-3 bg-[#2D43B8] text-white rounded-lg text-sm font-bold uppercase transition-all"
      >
        {added ? '✓ Enrolled' : 'Join Course'}
      </button>
    </div>
  );
}`);
    } else if (codeTab === 'express') {
      setCodeEditorText(`// server.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/enrollments', (req, res) => {
  const { studentName, courseId } = req.body;
  
  // Register enrollment logic...
  res.status(201).json({
    success: true,
    message: \`Student \${studentName} successfully registered!\`,
    registrationId: "REG-" + Math.floor(Math.random() * 10000)
  });
});

app.listen(5000, () => console.log('Server running on 5000'));`);
    } else if (codeTab === 'mongo') {
      setCodeEditorText(`// CourseSchema.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  techStack: [{ type: String }],
  durationWeeks: { type: Number, default: 16 },
  enrolledStudents: { type: Number, default: 0 }
});

module.exports = mongoose.model('Course', CourseSchema);`);
    }
  }, [codeTab]);

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    const leads = getDbItem('beyondskills_leads', []);
    const newLead = { 
      type: 'Academy', 
      course: 'Full Stack Web Development (MERN)',
      ...enquiryForm, 
      date: new Date().toISOString() 
    };
    leads.push(newLead);
    setDbItem('beyondskills_leads', leads);

    // Simulated email SLA trigger
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `BeyondSkills Admission Inquiry Received`,
        body: `Hello ${enquiryForm.name},\n\nThank you for reaching out about our Full Stack Web Development Certification Program. \n\nWe have logged your admission inquiry. A career advisor will contact you within 24 hours at ${enquiryForm.phone} or via email to share details on class schedules, fees structure, and student dashboard access.\n\nSincerely,\nBeyondSkills Admissions Team`
      }
    }));

    setEnquiryStatus('success');
    setEnquiryForm({
      name: '',
      email: '',
      phone: '',
      college: '',
      status: 'Undergraduate Student',
      message: ''
    });
    setTimeout(() => setEnquiryStatus(null), 5000);
  };

  const downloadSyllabusMock = () => {
    // Generate simulated download triggers
    alert('BeyondSkills Program Guide downloaded! (Simulated PDF download)');
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Program Guide Sent`,
        body: `Hello,\n\nThe Full Stack Web Development program brochure & curriculum roadmap has been prepared for offline reading. Please review the detailed week-by-week guides to align your learning path.\n\nSupport: connect@beyondskills.in`
      }
    }));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-inter text-slate-900 bg-white min-h-screen relative antialiased">
      
      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-[#2D43B8]/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[1200px] left-0 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* SECTION 1: HERO */}
      <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#E5E7EB] bg-white">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left side text column */}
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center space-x-2 bg-[#2D43B8]/5 border border-[#2D43B8]/15 px-3 py-1.5 rounded-full text-xs font-semibold text-[#2D43B8] tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premium MERN Stack Certification</span>
              </div>
              
              <h1 className="font-manrope text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#111111] leading-[1.1] tracking-tight">
                Become a <span className="bg-gradient-to-r from-[#2D43B8] to-blue-600 bg-clip-text text-transparent">Full Stack</span> Web Developer
              </h1>
              
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Master HTML, CSS, JavaScript, React, Node.js, Express.js and MongoDB through live mentor-led training, hands-on projects and real-world learning.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                <button 
                  onClick={() => scrollToSection('enquiry-form')}
                  className="flex-1 bg-[#2D43B8] hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-sm uppercase tracking-wider transition-all shadow-md shadow-blue-700/10 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Enroll Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={downloadSyllabusMock}
                  className="flex-1 border border-[#E5E7EB] hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-xl text-sm transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Syllabus</span>
                </button>
              </div>

              {/* Feature Badges list */}
              <div className="pt-4 border-t border-[#E5E7EB]">
                <p className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">Key Highlights</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                    <span>4 Months Duration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                    <span>40 Hours Live Sessions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                    <span>3 Industry Projects</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                    <span>Live + Recorded Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                    <span>Career Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                    <span>Verifiable Certificate</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side Visual (VS Code & Web browser mock) */}
            <div className="lg:col-span-6 relative">
              <div className="bg-[#111111] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden relative">
                {/* Window top bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#1c1c1c] border-b border-slate-800">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => setCodeTab('react')}
                      className={`px-3 py-1 text-xs rounded transition-all font-mono ${codeTab === 'react' ? 'bg-[#2D43B8] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      ProductCard.jsx
                    </button>
                    <button 
                      onClick={() => setCodeTab('express')}
                      className={`px-3 py-1 text-xs rounded transition-all font-mono ${codeTab === 'express' ? 'bg-[#2D43B8] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      server.js
                    </button>
                    <button 
                      onClick={() => setCodeTab('mongo')}
                      className={`px-3 py-1 text-xs rounded transition-all font-mono ${codeTab === 'mongo' ? 'bg-[#2D43B8] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      CourseSchema.js
                    </button>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="p-6 font-mono text-[11px] sm:text-xs leading-relaxed text-slate-300 overflow-x-auto h-[260px] bg-[#111111]">
                  <pre className="text-left"><code>{codeEditorText}</code></pre>
                </div>

                {/* Browser preview simulation */}
                <div className="bg-[#F5F7FA] border-t border-[#E5E7EB] p-4 text-xs font-sans text-slate-700">
                  <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-[#E5E7EB] mb-3">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] text-slate-500 select-none">localhost:5173/products</span>
                  </div>
                  
                  {/* Dynamic render block */}
                  <div className="bg-white p-4 border border-[#E5E7EB] rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-900">MERN Developer Program</h4>
                      <p className="text-[10px] text-slate-500">Live Mentor Upskilling Academy</p>
                      <p className="text-xs text-[#2D43B8] font-bold mt-1">₹15,000</p>
                    </div>
                    <button 
                      onClick={() => scrollToSection('enquiry-form')}
                      className="bg-[#2D43B8] hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-[10px] uppercase tracking-wide transition-all cursor-pointer"
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Developer stats bubble floating */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-lg flex items-center space-x-3 hidden sm:flex">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Placement Support</p>
                  <p className="text-xs font-bold text-slate-900">ATS Resumes & Mock Tests</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: YOUR FUTURE STARTS HERE */}
      <section className="relative z-10 py-20 bg-[#F5F7FA]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#2D43B8] uppercase border border-[#2D43B8]/20 px-3 py-1 rounded bg-[#2D43B8]/5">
              The Path to Independence
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
              Your Future Starts Here
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Full Stack Web Development is not just a syllabus; it is the single most valuable technology career path in the modern digital ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-[#2D43B8] rounded-xl flex items-center justify-center font-extrabold text-lg">35%</div>
              <h3 className="font-manrope font-bold text-slate-900 text-base">High Demand</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Full stack developer roles are projected to grow faster than average engineering roles over the next five years.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-[#2D43B8] rounded-xl flex items-center justify-center font-extrabold text-lg">100%</div>
              <h3 className="font-manrope font-bold text-slate-900 text-base">Remote & Freelance</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Collaborate with global startups, deploy SaaS tools from your desk, and work independently.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-[#2D43B8] rounded-xl flex items-center justify-center font-extrabold text-lg">1.5x</div>
              <h3 className="font-manrope font-bold text-slate-900 text-base">Higher Pay Grade</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Developers who manage both user interfaces (Frontend) and data engines (Backend) command a salary premium.
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-[#2D43B8] rounded-xl flex items-center justify-center font-extrabold text-lg">MERN</div>
              <h3 className="font-manrope font-bold text-slate-900 text-base">Startup Engine</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Build Minimum Viable Products (MVPs) in weeks using JavaScript across the entire stack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY BEYONDSKILLS */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#2D43B8] uppercase border border-[#2D43B8]/20 px-3 py-1 rounded bg-[#2D43B8]/5">
              Academy Features
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
              Why Choose BeyondSkills
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We design structured programs focused entirely on outcomes, direct mentorship, and live projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border border-[#E5E7EB] rounded-2xl hover:border-[#2D43B8]/30 transition-all space-y-3">
              <div className="p-2 bg-[#2D43B8]/5 text-[#2D43B8] rounded-lg w-fit">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-manrope font-bold text-[#111111] text-base">Industry-Ready Curriculum</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No filler. Learn the actual technologies used in production by tech agencies and software companies.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 border border-[#E5E7EB] rounded-2xl hover:border-[#2D43B8]/30 transition-all space-y-3">
              <div className="p-2 bg-[#2D43B8]/5 text-[#2D43B8] rounded-lg w-fit">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-manrope font-bold text-[#111111] text-base">Expert Live Mentorship</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect directly with experienced software engineers who build applications daily.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 border border-[#E5E7EB] rounded-2xl hover:border-[#2D43B8]/30 transition-all space-y-3">
              <div className="p-2 bg-[#2D43B8]/5 text-[#2D43B8] rounded-lg w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-manrope font-bold text-[#111111] text-base">Hands-On Coding</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Write code from Day 1. Learn by building real layouts and deploying live working APIs.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="p-6 border border-[#E5E7EB] rounded-2xl hover:border-[#2D43B8]/30 transition-all space-y-3">
              <div className="p-2 bg-[#2D43B8]/5 text-[#2D43B8] rounded-lg w-fit">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-manrope font-bold text-[#111111] text-base">Weekly Code Assignments</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Validate your logic with review checklists and target feedback from teaching assistants.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="p-6 border border-[#E5E7EB] rounded-2xl hover:border-[#2D43B8]/30 transition-all space-y-3">
              <div className="p-2 bg-[#2D43B8]/5 text-[#2D43B8] rounded-lg w-fit">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-manrope font-bold text-[#111111] text-base">Complete Career Support</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We assist you with resume review, GitHub portfolio audits, and mock interview mock-ups.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="p-6 border border-[#E5E7EB] rounded-2xl hover:border-[#2D43B8]/30 transition-all space-y-3">
              <div className="p-2 bg-[#2D43B8]/5 text-[#2D43B8] rounded-lg w-fit">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-manrope font-bold text-[#111111] text-base">Verifiable Digital Badges</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your credentials are secure, verifiable, and easy to share on LinkedIn or with hiring teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PROGRAM SNAPSHOT */}
      <section className="relative z-10 py-20 bg-[#F5F7FA] border-t border-b border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
              Program Snapshot
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Everything you need to know about the certification course in one glance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Duration</span>
              <p className="text-xl font-bold text-[#111111]">4 Months</p>
              <span className="text-[10px] text-slate-500 block">Structured Weeks</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Learning Mode</span>
              <p className="text-xl font-bold text-[#111111]">Live + Recorded</p>
              <span className="text-[10px] text-slate-500 block">Flexible Weekend Classes</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Projects</span>
              <p className="text-xl font-bold text-[#111111]">3 Core Projects</p>
              <span className="text-[10px] text-slate-500 block">Industry Portfolio</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Difficulty</span>
              <p className="text-xl font-bold text-[#111111]">Beginner Friendly</p>
              <span className="text-[10px] text-slate-500 block">No Coding Required</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Live Training</span>
              <p className="text-xl font-bold text-[#111111]">40 Hours</p>
              <span className="text-[10px] text-slate-500 block">Led by Mentors</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Certificate</span>
              <p className="text-xl font-bold text-[#111111]">Verifiable ID</p>
              <span className="text-[10px] text-slate-500 block">Linked to Profile</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">LMS Access</span>
              <p className="text-xl font-bold text-[#111111]">Lifetime</p>
              <span className="text-[10px] text-slate-500 block">Recorded Portals</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Support</span>
              <p className="text-xl font-bold text-[#111111]">1-on-1 Help</p>
              <span className="text-[10px] text-slate-500 block">Active Discord</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: LEARNING JOURNEY */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#2D43B8] uppercase border border-[#2D43B8]/20 px-3 py-1 rounded bg-[#2D43B8]/5">
              Step-by-Step Pathway
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
              Your Learning Journey
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We guide you from onboarding to project deployments and interview preparations. Click each stage to see details.
            </p>
          </div>

          {/* Interactive Vertical Journey Roadmap */}
          <div className="max-w-4xl mx-auto">
            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-8 py-8 space-y-12">
              
              {[
                { title: "Admission & Access", desc: "Enroll in the MERN program and receive credentials to access the BeyondSkills LMS portal instantly." },
                { title: "Live interactive Classes", desc: "Attend live weekend classes. Master key concepts, solve queries live, and review recorded files." },
                { title: "Practical Code Assignments", desc: "Complete small, weekly code exercises to practice CSS, JS functions, and REST routes." },
                { title: "Frontend Development Mastery", desc: "Learn to build modern, responsive User Interfaces in HTML5, CSS Grid, and modular React components." },
                { title: "Backend API Engineering", desc: "Design secure API routes, write server routes in Node/Express, and configure auth controllers." },
                { title: "MERN Stack Project Build", desc: "Combine React UI and Node APIs to create full-stack database-backed applications." },
                { title: "Developer Portfolio Assembly", desc: "Audit and host your best projects on GitHub, and organize code comments like a professional." },
                { title: "Assessment & Certification", desc: "Submit final capstone projects for evaluation to receive your verifiable digital certificate." },
                { title: "Resume & Career Onboarding", desc: "Conduct resume reviews, ATS optimization sessions, LinkedIn audits, and technical mock interviews." }
              ].map((step, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveStep(idx)}
                  className="relative pl-10 md:pl-16 group cursor-pointer"
                >
                  {/* Step index circle indicator */}
                  <div className={`absolute -left-[17px] md:-left-[21px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    activeStep === idx 
                      ? 'bg-[#2D43B8] border-[#2D43B8] text-white shadow-lg' 
                      : 'bg-white border-slate-300 text-slate-500 group-hover:border-[#2D43B8]/60 group-hover:text-[#2D43B8]'
                  }`}>
                    {idx + 1}
                  </div>
                  
                  {/* Step details container */}
                  <div className={`p-6 rounded-2xl border transition-all ${
                    activeStep === idx 
                      ? 'bg-slate-50 border-[#2D43B8]/30 shadow-sm' 
                      : 'bg-white border-[#E5E7EB] hover:border-slate-300'
                  }`}>
                    <h3 className="font-manrope font-bold text-[#111111] text-base group-hover:text-[#2D43B8] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CURRICULUM OVERVIEW */}
      <section className="relative z-10 py-20 bg-[#F5F7FA]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#2D43B8] uppercase border border-[#2D43B8]/20 px-3 py-1 rounded bg-[#2D43B8]/5">
              Program Modules
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
              Curriculum Overview
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              A carefully structured curriculum designed to teach production-ready full-stack tools.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-2xl mx-auto">
            {Object.keys(curriculumData).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedCurriculumTab(key)}
                className={`py-3 px-6 rounded-xl font-manrope font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCurriculumTab === key
                    ? 'bg-[#2D43B8] text-white shadow-md shadow-blue-700/10'
                    : 'bg-white border border-[#E5E7EB] text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {curriculumData[key].title}
              </button>
            ))}
          </div>

          {/* Active Tab Panel */}
          <div className="max-w-4xl mx-auto bg-white border border-[#E5E7EB] rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="space-y-6">
              <h3 className="font-manrope text-lg sm:text-xl font-bold text-[#111111]">
                {curriculumData[selectedCurriculumTab].title}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {curriculumData[selectedCurriculumTab].description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#E5E7EB]">
                {curriculumData[selectedCurriculumTab].items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 text-xs text-slate-700">
                    <CheckCircle className="w-4.5 h-4.5 text-[#2D43B8] flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PROJECTS YOU'LL BUILD */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#2D43B8] uppercase border border-[#2D43B8]/20 px-3 py-1 rounded bg-[#2D43B8]/5">
              Portfolio Work
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
              Projects You'll Build
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Build and deploy 3 real production-ready projects to showcase on your developer portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="h-44 bg-slate-100 flex items-center justify-center p-4 border-b border-[#E5E7EB] relative">
                  {/* Browser preview visual in CSS */}
                  <div className="w-full bg-white rounded-lg shadow-md border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-slate-50 px-3 py-2 border-b border-[#E5E7EB] flex items-center space-x-1.5">
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="p-4 space-y-2 text-center text-[10px]">
                      <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center font-bold text-xs text-[#2D43B8]">FS</div>
                      <p className="font-bold text-[#111111]">Faisal Shah • Portfolio</p>
                      <p className="text-[8px] text-slate-400">React Frontend Developer</p>
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono">HTML/CSS/JS</span>
                </div>
                
                <div className="p-6 space-y-3">
                  <h3 className="font-manrope font-bold text-[#111111] text-base">Responsive Portfolio Website</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Build a personal developer portfolio site featuring fully responsive layouts, dark mode toggles, contact form bindings, and CSS animations.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-[#E5E7EB] bg-slate-50/50 flex flex-wrap gap-1.5">
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">HTML5</span>
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">CSS Grid</span>
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">JavaScript</span>
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">Vercel</span>
              </div>
            </div>

            {/* Project 2 */}
            <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="h-44 bg-slate-100 flex items-center justify-center p-4 border-b border-[#E5E7EB] relative">
                  <div className="w-full bg-white rounded-lg shadow-md border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-slate-50 px-3 py-2 border-b border-[#E5E7EB] flex items-center space-x-1.5">
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="p-4 flex items-center justify-between text-[9px]">
                      <div>
                        <p className="font-bold text-[#111111]">StyleMart</p>
                        <p className="text-[8px] text-slate-400">Total: ₹2,499</p>
                      </div>
                      <button className="bg-[#2D43B8] text-white px-2 py-1 rounded text-[8px] font-bold uppercase select-none">Pay Now</button>
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono">MERN Stack</span>
                </div>
                
                <div className="p-6 space-y-3">
                  <h3 className="font-manrope font-bold text-[#111111] text-base">MERN E-Commerce Website</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Build a complete online storefront. Features item catalogs, shopping cart actions, secure JWT signup/login, and administrative dashboard layouts.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-[#E5E7EB] bg-slate-50/50 flex flex-wrap gap-1.5">
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">React</span>
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">Node.js</span>
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">MongoDB</span>
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">Render</span>
              </div>
            </div>

            {/* Project 3 */}
            <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="h-44 bg-slate-100 flex items-center justify-center p-4 border-b border-[#E5E7EB] relative">
                  <div className="w-full bg-white rounded-lg shadow-md border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-slate-50 px-3 py-2 border-b border-[#E5E7EB] flex items-center space-x-1.5">
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="p-4 space-y-1.5 text-[9px]">
                      <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                        <div className="w-[60%] h-full bg-[#2D43B8]"></div>
                      </div>
                      <div className="flex justify-between text-[7px] text-slate-400">
                        <span>Course Progress: 60%</span>
                        <span>Module 3 of 5</span>
                      </div>
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono">MERN + APIs</span>
                </div>
                
                <div className="p-6 space-y-3">
                  <h3 className="font-manrope font-bold text-[#111111] text-base">Learning Management System</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Build a student dashboard portal enabling candidates to watch recorded modules, submit course assignments, and trace grading progress.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-[#E5E7EB] bg-slate-50/50 flex flex-wrap gap-1.5">
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">React</span>
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">Express</span>
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">JWT Auth</span>
                <span className="text-[9px] bg-white border border-[#E5E7EB] text-slate-600 px-2 py-0.5 rounded font-mono">Tailwind</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: TOOLS & TECHNOLOGIES */}
      <section className="relative z-10 py-20 bg-[#F5F7FA]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
              Tools & Technologies Covered
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Learn the modern technology stack standard across the global engineering landscape.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6 max-w-5xl mx-auto">
            {[
              { name: "HTML5", desc: "Structure" },
              { name: "CSS3", desc: "Styling" },
              { name: "JavaScript", desc: "Core Logic" },
              { name: "Bootstrap", desc: "Layouts" },
              { name: "React", desc: "UI Library" },
              { name: "Node.js", desc: "Runtime" },
              { name: "Express.js", desc: "API Server" },
              { name: "MongoDB", desc: "Database" },
              { name: "MySQL", desc: "SQL DB" },
              { name: "Git", desc: "Revisions" },
              { name: "GitHub", desc: "Collaboration" },
              { name: "VS Code", desc: "Editor" },
              { name: "Postman", desc: "API Client" },
              { name: "Vercel", desc: "Deployments" },
              { name: "Render", desc: "API Deploy" },
              { name: "Netlify", desc: "Web Hosting" }
            ].map((tool, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-[#E5E7EB] text-center flex flex-col items-center justify-center space-y-2 shadow-sm hover:shadow-md transition-shadow">
                {/* SVG Mock representations of tech stacks */}
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-700">
                  <Code className="w-5 h-5 text-[#2D43B8]" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{tool.name}</p>
                  <p className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: CAREER OPPORTUNITIES */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#2D43B8] uppercase border border-[#2D43B8]/20 px-3 py-1 rounded bg-[#2D43B8]/5">
              Hiring Landscape
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
              Target Career Pathways
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Explore professional engineering roles you can confidently target after completing the program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { role: "Frontend Developer", skills: "React, CSS Grid, HTML5, Responsive UI, Git", growth: "High Demand", path: "Build and deploy scalable single-page web applications and interactive designs." },
              { role: "Backend Developer", skills: "Node.js, Express.js, MongoDB, JWT auth, APIs", growth: "High Demand", path: "Architect server frameworks, route permissions controllers, and document queries." },
              { role: "React.js Developer", skills: "React State hooks, Router-DOM, Context API, Tailwind", growth: "SaaS Startups", path: "Build modular client dashboards and interactive SaaS tool mockups." },
              { role: "Node.js Developer", skills: "Node.js runtime, Event loops, API middleware, REST", growth: "Enterprise Agencies", path: "Develop high-throughput server backends and secure authentication APIs." },
              { role: "Full Stack Developer", skills: "React, Node, Express, MongoDB, Deployment, Git", growth: "Premium Tier", path: "Deploy end-to-end database-connected web systems from frontend to database." },
              { role: "Freelance Web Engineer", skills: "Full Stack, Custom APIs, SEO, Netlify, Vercel", growth: "Independent", path: "Deliver custom client portals, landing pages, and web systems directly to businesses." }
            ].map((opp, idx) => (
              <div key={idx} className="p-8 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#2D43B8]/20 hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-manrope font-bold text-[#111111] text-base">{opp.role}</h3>
                    <span className="text-[9px] font-bold text-[#2D43B8] uppercase tracking-wider bg-[#2D43B8]/5 px-2 py-0.5 rounded border border-[#2D43B8]/10">{opp.growth}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{opp.path}</p>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Target Skills</span>
                  <p className="text-[11px] font-mono text-slate-600 truncate">{opp.skills}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: CAREER SUPPORT */}
      <section className="relative z-10 py-20 bg-[#F5F7FA]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold tracking-widest text-[#2D43B8] uppercase border border-[#2D43B8]/20 px-3 py-1 rounded bg-[#2D43B8]/5 w-fit block">
                Career Support Ecosystem
              </span>
              <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
                Placement Readiness Program
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                We believe that learning code is only the first step. Our career support program focuses entirely on polishing your professional profile to match current recruiter filters.
              </p>
              
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2D43B8] flex-shrink-0" />
                  <span><strong>ATS Resume Guide:</strong> Build structured, parsing-friendly resume sheets.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2D43B8] flex-shrink-0" />
                  <span><strong>GitHub Portfolio Audits:</strong> Optimize repository naming, readme briefs, and code structures.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2D43B8] flex-shrink-0" />
                  <span><strong>LinkedIn Profile Polish:</strong> Target keyword mapping to improve recruiter search outreach.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2D43B8] flex-shrink-0" />
                  <span><strong>Mock Interviews:</strong> Live practice drills simulating structural technical screenings.</span>
                </li>
              </ul>
            </div>
            
            {/* Right side Visual representations */}
            <div className="lg:col-span-6">
              <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-lg space-y-6">
                <h4 className="font-manrope font-bold text-slate-900 text-base">Digital Credentials</h4>
                
                {/* Simulated Certificate Block */}
                <div className="border border-dashed border-[#2D43B8]/35 p-6 rounded-xl bg-slate-50 relative overflow-hidden">
                  <div className="absolute top-2 right-2 opacity-5">
                    <Award className="w-20 h-20 text-[#2D43B8]" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="logo-font text-sm font-bold text-slate-800">BeyondSkills Academy</span>
                        <p className="text-[8px] text-slate-400 font-mono">VERIFIABLE CREDENTIALS</p>
                      </div>
                      <Award className="w-8 h-8 text-[#2D43B8]" />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Recipient Name</p>
                      <p className="text-xs font-bold text-slate-900">Student Name Placeholder</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Certification Award</p>
                      <p className="text-[10px] font-bold text-slate-800">Full Stack Web Development (MERN)</p>
                    </div>

                    <div className="flex justify-between items-end pt-2 border-t border-[#E5E7EB]">
                      <span className="text-[8px] text-slate-400 font-mono">ID: BYND-FSD-2026-XXXX</span>
                      <span className="text-[8px] text-[#2D43B8] font-bold uppercase tracking-wider">STATUS: VERIFIED</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                  *Above mockup represents the standard Digital Badge issued to students upon completing all assessment benchmarks. Verification works globally via our website database search.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 11: FREQUENTLY ASKED QUESTIONS */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#2D43B8] uppercase border border-[#2D43B8]/20 px-3 py-1 rounded bg-[#2D43B8]/5">
              Got Questions?
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Learn about program commitments, class timings, and certificate credentials.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = !!faqOpen[index];
              return (
                <div 
                  key={index}
                  className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 focus:outline-none transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4.5 h-4.5 text-[#2D43B8] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-50 bg-slate-50/30">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 12: FINAL CTA & ENQUIRY FORM */}
      <section id="enquiry-form" className="relative z-10 py-20 bg-[#F5F7FA] border-t border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: CTA & Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-widest text-[#2D43B8] uppercase border border-[#2D43B8]/20 px-3 py-1 rounded bg-[#2D43B8]/5 w-fit block">
                  Admissions Open
                </span>
                <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
                  Launch Your Career with BeyondSkills
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Join our upcoming cohort. Gain access to practical learning, week-by-week mentorship, verifiable credentials, and career readiness sessions.
                </p>
              </div>

              <div className="space-y-4 border-t border-[#E5E7EB] pt-6 text-xs text-slate-600">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4.5 h-4.5 text-[#2D43B8]" />
                  <span>+91 99999 XXXXX (Consultations Channel)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4.5 h-4.5 text-[#2D43B8]" />
                  <span>connect@beyondskills.in</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4.5 h-4.5 text-[#2D43B8]" />
                  <a href="https://www.beyondskills.in" target="_blank" rel="noreferrer" className="underline hover:text-[#2D43B8]">www.beyondskills.in</a>
                </div>
              </div>

              {/* QR Code mockup */}
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] w-fit flex items-center space-x-4 shadow-sm">
                <div className="w-16 h-16 bg-slate-100 flex items-center justify-center border border-[#E5E7EB] rounded font-mono text-[9px] text-slate-400 select-none">
                  [ QR Code ]
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-800">Scan Program QR</p>
                  <p className="text-[9px] text-slate-400 leading-normal">Instantly download syllabus<br />brochures on your smartphone.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Admission Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] shadow-lg relative overflow-hidden">
                <h3 className="font-manrope font-bold text-[#111111] text-lg sm:text-xl mb-6">Admission Enquiry Form</h3>
                
                {enquiryStatus === 'success' ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl space-y-3">
                    <h4 className="font-bold text-sm">Enquiry Submitted Successfully!</h4>
                    <p className="text-xs leading-relaxed">
                      Thank you for submitting your details. A simulated program email notification has been dispatched to your address. A career counselor will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                        <input 
                          type="text" 
                          required
                          value={enquiryForm.name}
                          onChange={(e) => setEnquiryForm({...enquiryForm, name: e.target.value})}
                          placeholder="e.g., Faisal Shah" 
                          className="w-full bg-[#F5F7FA] border border-[#E5E7EB] focus:border-[#2D43B8] focus:bg-white rounded-lg p-3 text-xs outline-none transition-all text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                        <input 
                          type="email" 
                          required
                          value={enquiryForm.email}
                          onChange={(e) => setEnquiryForm({...enquiryForm, email: e.target.value})}
                          placeholder="e.g., faisal@gmail.com" 
                          className="w-full bg-[#F5F7FA] border border-[#E5E7EB] focus:border-[#2D43B8] focus:bg-white rounded-lg p-3 text-xs outline-none transition-all text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                        <input 
                          type="tel" 
                          required
                          value={enquiryForm.phone}
                          onChange={(e) => setEnquiryForm({...enquiryForm, phone: e.target.value})}
                          placeholder="e.g., +91 99999 99999" 
                          className="w-full bg-[#F5F7FA] border border-[#E5E7EB] focus:border-[#2D43B8] focus:bg-white rounded-lg p-3 text-xs outline-none transition-all text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">College Name *</label>
                        <input 
                          type="text" 
                          required
                          value={enquiryForm.college}
                          onChange={(e) => setEnquiryForm({...enquiryForm, college: e.target.value})}
                          placeholder="e.g., IIT Delhi / NIT Trichy" 
                          className="w-full bg-[#F5F7FA] border border-[#E5E7EB] focus:border-[#2D43B8] focus:bg-white rounded-lg p-3 text-xs outline-none transition-all text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Current Status *</label>
                      <select 
                        value={enquiryForm.status}
                        onChange={(e) => setEnquiryForm({...enquiryForm, status: e.target.value})}
                        className="w-full bg-[#F5F7FA] border border-[#E5E7EB] focus:border-[#2D43B8] focus:bg-white rounded-lg p-3 text-xs outline-none transition-all text-slate-900"
                      >
                        <option value="Undergraduate Student">Undergraduate Student</option>
                        <option value="Postgraduate Student">Postgraduate Student</option>
                        <option value="Fresh Graduate">Fresh Graduate</option>
                        <option value="Beginner / Career Switcher">Beginner / Career Switcher</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Brief Message</label>
                      <textarea 
                        rows="3"
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
                        placeholder="Tell us about your career goals..." 
                        className="w-full bg-[#F5F7FA] border border-[#E5E7EB] focus:border-[#2D43B8] focus:bg-white rounded-lg p-3 text-xs outline-none transition-all text-slate-900"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#2D43B8] hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md shadow-blue-700/10 cursor-pointer"
                    >
                      Submit Enquiry
                    </button>
                    
                    <p className="text-[9px] text-slate-400 leading-normal text-center mt-2">
                      *By submitting, you agree to our educational scope policies. BeyondSkills does not guarantee placements. We will process your contact details to recommend courses.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
