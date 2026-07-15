import React, { useState, useEffect } from 'react';
import { 
  Code, BookOpen, Clock, Award, Users, CheckCircle, ArrowRight, Check, 
  ChevronRight, Calendar, ShieldAlert, Sparkles, Phone, Mail, Globe, 
  Star, Briefcase, Zap, Compass, HelpCircle, ChevronDown, ChevronUp, Download,
  RefreshCw
} from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/mockDb';

const curriculumCategories = {
  frontend: {
    title: 'Frontend Development',
    description: 'Master the visual layer of the web. Learn how to design elegant layouts, implement interactive elements, and build modular components.',
    items: [
      { name: 'HTML5 & Semantics', desc: 'Construct accessible, SEO-compliant structures using semantic markup tags.' },
      { name: 'CSS3 Grid & Flexbox', desc: 'Design responsive layouts that adapt dynamically to any mobile, tablet, or desktop viewport.' },
      { name: 'JavaScript ES6+', desc: 'Write clean functional scripts, handle array mapping, and manipulate DOM hierarchies.' },
      { name: 'React Architecture', desc: 'Construct component trees, manage states with hooks, and route views declaratively.' }
    ]
  },
  backend: {
    title: 'Backend Engineering',
    description: 'Architect the engines that power web applications. Master routing, server design, user authentication, and data integrity.',
    items: [
      { name: 'Node.js Runtime', desc: 'Configure asynchronous events, manage path directories, and run package scripts.' },
      { name: 'Express Server', desc: 'Initialize listener routes, configure cors parameters, and construct REST API endpoints.' },
      { name: 'JWT Secure Auth', desc: 'Verify login claims, encrypt password strings with bcrypt, and secure middleware routes.' },
      { name: 'API Integrations', desc: 'Process third-party payment requests and manage media uploads using Cloudinary.' }
    ]
  },
  databases: {
    title: 'Databases & Storage',
    description: 'Model scalable storage solutions. Learn how to structure tables and documents to manage application data efficiently.',
    items: [
      { name: 'MongoDB Atlas', desc: 'Store unstructured documents in cloud partitions, handle indexing, and perform aggregations.' },
      { name: 'Mongoose ODM', desc: 'Define rigid schemas, apply validation rules, and run database queries.' },
      { name: 'Relational SQL', desc: 'Understand table normalization, write primary/foreign keys, and formulate join statements.' },
      { name: 'Data Security', desc: 'Grant connection permissions, secure database URIs, and prevent injection attacks.' }
    ]
  },
  tools: {
    title: 'Developer Operations',
    description: 'Work like a professional engineer. Learn standard revision workflows, API inspection utilities, and cloud deployment pipelines.',
    items: [
      { name: 'Git & GitHub', desc: 'Branch feature codes, submit Pull Requests, and resolve merge conflicts.' },
      { name: 'Postman Client', desc: 'Draft API testing requests, analyze JSON headers, and debug route payloads.' },
      { name: 'Cloud Deployments', desc: 'Host client-side assets on Vercel and compile backend routes on Render.' },
      { name: 'Dotenv Configs', desc: 'Manage sensitive API keys, database credentials, and port parameters.' }
    ]
  }
};

const roadmapSteps = [
  { name: 'HTML & CSS Layouts', desc: 'Responsive layouts, grid structures, flexbox alignments, viewport media queries, and basic web page deployment.' },
  { name: 'JS Logic & DOM', desc: 'Variable scopes, arrow functions, event listeners, promise chaining, JSON conversions, and API fetching.' },
  { name: 'React Basics', desc: 'Component structures, state hooks, props passing, mapping lists, conditional rendering, and form bindings.' },
  { name: 'React Advanced', desc: 'Context API state trees, custom hooks, dynamic routing, and third-party styling integrations.' },
  { name: 'Node & Express', desc: 'Asynchronous event loops, REST API design, router middlewares, error handles, and backend security.' },
  { name: 'Database ODM', desc: 'MongoDB connections, Mongoose validation schemas, document queries, and relation references.' },
  { name: 'Authentication', desc: 'JWT token issuance, cookie parser handling, password encryption, and dashboard security filters.' },
  { name: 'Full-Stack Integration', desc: 'Binding React frontends to Express backends, environment keys management, and local proxy configuration.' },
  { name: 'Cloud Deployments', desc: 'Compiling distribution builds, Vercel UI hosting, Render web server launch, and profile audits.' }
];

const careerOutcomes = [
  { title: 'Frontend React Developer', desc: 'Build highly responsive user interfaces, manage complex local states, and query backend API routes.' },
  { title: 'Backend Node Developer', desc: 'Architect robust REST API paths, design secure user auth controllers, and manage database queries.' },
  { title: 'Full Stack Engineer', desc: 'Own application development from frontend designs to server configurations and database scaling.' },
  { title: 'Freelance Web Developer', desc: 'Deliver custom e-commerce portals, landing grids, and client administration panels directly.' },
  { title: 'SaaS Builder / Founder', desc: 'Develop Minimum Viable Products (MVPs) rapidly using unified JavaScript libraries.' },
  { title: 'BI Data Coordinator', desc: 'Query database clusters, manage document validation, and present analytics reports.' }
];

const faqItems = [
  { q: "Is prior coding experience required?", a: "No. This program is structured to support beginners. We start with basic Conda setups, and progress step-by-step to advanced machine learning and Generative AI modules." },
  { q: "What hardware do I need?", a: "A standard laptop with at least 4GB RAM is sufficient. For training heavy models, we guide you through utilizing free cloud platforms like Google Colab and Kaggle Kernels." },
  { q: "Will I get placement support?", a: "Yes. We offer extensive career preparation, including resume audits, portfolio reviews, GitHub profile tuning, and practice mock interviews led by industry professionals." },
  { q: "Are the projects verifiable?", a: "Yes. All capstone projects are pushed to your personal GitHub repository, providing concrete proof of your coding and implementation skills to hiring teams." }
];

export default function FullStackProgram() {
  const [faqOpen, setFaqOpen] = useState({});
  const [selectedCurriculumTab, setSelectedCurriculumTab] = useState('frontend');
  const [activeStep, setActiveStep] = useState(0);
  const [codeTab, setCodeTab] = useState('react');
  const [codeEditorText, setCodeEditorText] = useState('');
  
  // Interactive Sandbox state
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileLogs, setCompileLogs] = useState([]);
  const [isCompiled, setIsCompiled] = useState(false);

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

  const startSandboxCompile = () => {
    setIsCompiling(true);
    setCompileProgress(0);
    setIsCompiled(false);
    
    let logs = [];
    if (codeTab === 'react') {
      logs = [
        "Vite v5.1.0 building client environment...",
        "transforming modules...",
        "✓ 42 modules transformed.",
        "rendering chunks...",
        "dist/index.html   1.20 kB",
        "dist/assets/index.js   140.22 kB",
        "compilation complete. Dev server listening on localhost:5173"
      ];
    } else if (codeTab === 'express') {
      logs = [
        "nodemon starting server.js...",
        "attaching body-parser middlewares...",
        "registering POST /api/enrollments endpoint...",
        "verifying database connection pool...",
        "[Node runtime]: Connection established successfully.",
        "Express server listening on port 5000."
      ];
    } else {
      logs = [
        "mongoose compiling CourseSchema...",
        "connecting to cluster Atlas0...",
        "checking validation indices...",
        "model compilation completed: Course Collection online."
      ];
    }

    setCompileLogs([logs[0]]);
    
    let currentIdx = 0;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setCompileProgress(progress);
      
      currentIdx++;
      if (currentIdx < logs.length) {
        setCompileLogs(prev => [...prev, logs[currentIdx]]);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setIsCompiling(false);
        setIsCompiled(true);
      }
    }, 450);
  };

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
    alert('BeyondSkills Program Guide downloaded! (Simulated PDF download)');
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Program Guide Sent`,
        body: `Hello,\n\nThe Full Stack Web Development program brochure & curriculum roadmap has been prepared for offline reading. Please review the detailed week-by-week guides to align your learning path.\n\nSupport: connect@beyondskills.in`
      }
    }));
  };

  return (
    <div className="font-inter text-slate-900 bg-white min-h-screen relative antialiased">
      
      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-[#2D43B8]/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[1200px] left-0 w-[500px] h-[500px] bg-[#2D43B8]/[0.02] rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* SECTION 1: HERO */}
      <section className="relative z-10 pt-12 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="inline-flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-[#2D43B8] bg-[#2D43B8]/10 border border-[#2D43B8]/20 px-3 py-1.5 rounded-full font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Full Stack Program</span>
            </span>
            <h1 className="font-manrope font-extrabold text-slate-900 text-4xl sm:text-6xl tracking-tight leading-[1.08] mt-2">
              Become a <span className="text-[#2D43B8]">Full Stack Developer</span>
            </h1>
            <p className="text-slate-650 text-sm sm:text-base leading-relaxed max-w-xl font-inter">
              Master the art of building client-facing user interfaces (Frontend), server engine controllers (Backend), and structured relational/document collections (Databases) with our MERN cohort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href="#enquiry-form-section"
                className="bg-[#2D43B8] text-white hover:brightness-110 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#2D43B8]/20 text-center cursor-pointer"
              >
                Apply Now
              </a>
              <button 
                onClick={downloadSyllabusMock}
                className="bg-slate-55 border border-slate-200 text-[#111111] hover:bg-slate-100 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 text-center flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Syllabus Guide</span>
              </button>
            </div>
          </div>

          {/* Hero Right: Interactive Code Sandbox */}
          <div className="lg:col-span-6">
            <div className="bg-[#0A0E35] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D43B8]/20 rounded-full blur-2xl z-0"></div>
              
              {/* Header Tab */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 pl-2">beyondskills_editor.js</span>
                </div>
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                  <button 
                    onClick={() => { setCodeTab('react'); setIsCompiled(false); }}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${codeTab === 'react' ? 'bg-[#2D43B8] text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    ProductCard.jsx
                  </button>
                  <button 
                    onClick={() => { setCodeTab('express'); setIsCompiled(false); }}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${codeTab === 'express' ? 'bg-[#2D43B8] text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    server.js
                  </button>
                  <button 
                    onClick={() => { setCodeTab('mongo'); setIsCompiled(false); }}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${codeTab === 'mongo' ? 'bg-[#2D43B8] text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Schema.js
                  </button>
                </div>
              </div>

              {/* Code Screen / Terminal */}
              <div className="font-mono text-xs space-y-3 min-h-[170px] bg-slate-950/80 p-4 rounded-xl border border-white/5 relative z-10 max-h-[180px] overflow-y-auto">
                <pre className="text-slate-300 text-left"><code>{codeEditorText}</code></pre>
                
                {/* Dynamic Compile Logs */}
                {compileLogs.map((log, i) => (
                  <div key={i} className="text-slate-400 text-[11px] border-t border-white/5 pt-1 mt-1 font-mono text-left">
                    {log}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-between relative z-10">
                <button 
                  onClick={startSandboxCompile}
                  disabled={isCompiling}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 ${isCompiling ? 'bg-white/10 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/10'}`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
                  <span>{isCompiling ? `Compiling ${compileProgress}%` : 'Run Local Server'}</span>
                </button>
                <div className="text-[10px] text-slate-400">
                  Click to compile and launch simulated localhost preview
                </div>
              </div>

              {/* Browser Preview simulation */}
              {isCompiled && (
                <div className="mt-4 pt-4 border-t border-white/10 relative z-10 animate-fade-in space-y-3">
                  <span className="text-[9px] font-bold text-[#0EA5E9] uppercase tracking-widest block text-left">Localhost Sandbox Preview:</span>
                  
                  {codeTab === 'react' ? (
                    <div className="bg-white p-4 border border-slate-200 rounded-xl flex items-center justify-between shadow-sm text-[#111111] font-sans">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">MERN Developer Program</h4>
                        <p className="text-[10px] text-slate-500">Live Mentor Upskilling Academy</p>
                        <p className="text-xs text-[#2D43B8] font-bold mt-1">₹15,000</p>
                      </div>
                      <button 
                        onClick={() => alert('Add to cart simulation!')}
                        className="bg-[#2D43B8] hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-[10px] uppercase tracking-wide transition-all cursor-pointer"
                      >
                        Join Course
                      </button>
                    </div>
                  ) : codeTab === 'express' ? (
                    <div className="bg-slate-950 p-3 rounded-lg border border-white/10 text-emerald-400 font-mono text-[11px] break-all text-left">
                      {`{ "success": true, "message": "Student Faisal successfully registered!", "registrationId": "REG-8094" }`}
                    </div>
                  ) : (
                    <div className="bg-slate-950 p-3 rounded-lg border border-white/10 text-slate-300 font-mono text-[11px] text-left">
                      <div>Collection: Courses</div>
                      <div className="text-[10px] text-slate-500">Indices: _id_ (Primary), title_text_ (Index)</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlights Statistics Grid */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { metric: '4 Months', label: 'Program Duration', icon: Clock },
            { metric: '40 Hours', label: 'Live Mentor Training', icon: BookOpen },
            { metric: '3 Industrial', label: 'Hands-on Projects', icon: Code },
            { metric: 'Live + Recorded', label: 'Delivery Model', icon: Users },
            { metric: 'Placement Assist', label: 'Career Support Prep', icon: Briefcase },
            { metric: 'Verifiable ID', label: 'Digital Certificate', icon: Award }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-between hover:border-[#2D43B8]/30 transition-all duration-300 group hover:shadow-lg hover:shadow-[#2D43B8]/5">
                <div className="w-8 h-8 rounded-lg bg-[#2D43B8]/5 flex items-center justify-center text-[#2D43B8] mb-4 group-hover:bg-[#2D43B8]/10 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 font-manrope text-left">{stat.metric}</div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1 text-left">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Career Opportunities & Why BeyondSkills (Combined logical layout) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Why BeyondSkills Left (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
              The BeyondSkills Advantage
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Project-Driven Learning Architecture
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-inter">
              We eliminate traditional classroom theory. Our learning systems are instructed by active industry practitioners, focusing entirely on clean code, vector models, and deployable portfolios.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Industry Expert Mentors', desc: 'Classes are taught by practicing engineers from Tietoevry, EY, and Shemaroo.' },
                { title: 'Weekly Coding Labs', desc: 'Get hands-on support in our community channels to debug React components.' },
                { title: 'Verifiable Portfolios', desc: 'Construct real models and push them to git, providing verifiable proof of skills.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-[#2D43B8]/10 text-[#2D43B8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market/Career Opportunities Right (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className="bg-[#0B0F19] text-white p-6 rounded-2xl border border-white/5 space-y-4 col-span-1 sm:col-span-2">
              <span className="text-[10px] text-[#0EA5E9] font-bold tracking-widest uppercase block font-mono">Market Growth</span>
              <h3 className="text-xl sm:text-2.5xl font-extrabold font-manrope text-white">High Global Demand</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-inter">
                Full stack developer roles are projected to grow faster than average engineering roles over the next five years. Developers who manage both UI (Frontend) and database clusters (Backend) command a substantial salary premium.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl space-y-4 text-[#111111]">
              <span className="text-[10px] text-[#2D43B8] font-bold tracking-widest uppercase block font-mono">Pay Premium</span>
              <h3 className="text-xl sm:text-2.5xl font-extrabold font-manrope text-slate-900">1.5x Premium</h3>
              <p className="text-xs text-slate-505 leading-relaxed font-inter">
                Collaborate with global startups, deploy SaaS tools from your desk, and work independently.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl space-y-4 text-[#111111]">
              <span className="text-[10px] text-[#2D43B8] font-bold tracking-widest uppercase block font-mono">Unified Library</span>
              <h3 className="text-xl sm:text-2.5xl font-extrabold font-manrope text-slate-900">MERN Stack</h3>
              <p className="text-xs text-slate-505 leading-relaxed font-inter">
                Build Minimum Viable Products (MVPs) in weeks using JavaScript across the entire stack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Animated Learning Journey Roadmap */}
      <section className="py-16 bg-[#0B0F19] text-white relative overflow-hidden z-10 border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,67,184,0.08),transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#0EA5E9] text-[10px] font-extrabold tracking-widest uppercase border border-[#0EA5E9]/20 px-3 py-1 rounded bg-[#0EA5E9]/5 font-mono">
              Learning Journey
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
              Your Professional Roadmap
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Click through the pipeline phases to preview your training timeline deliverables.
            </p>
          </div>

          {/* Interactive Timeline Controls */}
          <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-10">
            {roadmapSteps.map((step, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`py-3 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer text-center ${activeStep === idx ? 'bg-[#2D43B8] border-[#2D43B8] text-white shadow-lg shadow-[#2D43B8]/20' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
              >
                {step.name}
              </button>
            ))}
          </div>

          {/* Detailed Step Card */}
          <div className="max-w-3xl mx-auto bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#2D43B8]/20 text-white font-extrabold text-[9px] tracking-widest uppercase px-4 py-1.5 rounded-bl-xl font-mono">
              Step 0{activeStep + 1} / 09
            </div>
            <div className="flex items-start space-x-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-[#2D43B8] text-white flex items-center justify-center font-extrabold text-lg flex-shrink-0 font-mono shadow-md shadow-[#2D43B8]/25">
                0{activeStep + 1}
              </div>
              <div className="space-y-3">
                <h3 className="font-manrope font-extrabold text-white text-xl sm:text-2xl">{roadmapSteps[activeStep].name}</h3>
                <p className="text-slate-350 text-sm leading-relaxed font-inter">{roadmapSteps[activeStep].desc}</p>
                <div className="flex items-center space-x-2 text-xs text-[#0EA5E9] font-bold font-mono pt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Syllabus Milestone Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Curriculum Overview Grid */}
      <section id="curriculum" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
            Curriculum Grid
          </span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-4 tracking-tight">
            Academic Curriculum Syllabus
          </h2>
          <p className="text-slate-555 text-sm">
            Categorized into four core fields of frontend, backend, databases, and deployment.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {Object.keys(curriculumCategories).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedCurriculumTab(key)}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${selectedCurriculumTab === key ? 'bg-[#2D43B8] text-white border-[#2D43B8] shadow-lg shadow-[#2D43B8]/10' : 'bg-slate-55 text-slate-655 border-slate-200 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              {curriculumCategories[key].title}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-[#F5F7FA] border border-slate-200/60 rounded-3xl p-8 sm:p-10 shadow-sm animate-fade-in text-left">
          <div className="max-w-3xl mb-8">
            <h3 className="font-manrope font-extrabold text-[#111111] text-xl sm:text-2.5xl mb-2">
              {curriculumCategories[selectedCurriculumTab].title}
            </h3>
            <p className="text-slate-505 text-xs sm:text-sm leading-relaxed font-inter">
              {curriculumCategories[selectedCurriculumTab].description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curriculumCategories[selectedCurriculumTab].items.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl space-y-2.5 hover:shadow-md transition-shadow animate-fade-in">
                <div className="flex items-center space-x-2 text-[#2D43B8]">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{item.name}</h4>
                </div>
                <p className="text-[11px] text-slate-555 leading-relaxed font-inter pl-6">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Projects Showcase */}
      <section className="py-16 bg-[#0B0F19] text-white relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#0EA5E9] text-[10px] font-extrabold tracking-widest uppercase border border-white/10 px-3 py-1 rounded font-mono">
              Hands-On Projects
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
              Build Production-Grade Portfolios
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
              Construct e-commerce platforms, custom learning management dashboards, and responsive portfolios.
            </p>
          </div>

          {/* Dynamic Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Responsive Portfolio Website",
                desc: "Build a personal developer portfolio site featuring fully responsive layouts, dark mode toggles, contact form bindings, and CSS animations.",
                tech: ["HTML5", "CSS Grid", "JavaScript", "Vercel"]
              },
              {
                title: "MERN E-Commerce Website",
                desc: "Build a complete online storefront. Features item catalogs, shopping cart actions, secure JWT signup/login, and administrative dashboard layouts.",
                tech: ["React", "Node.js", "MongoDB", "Render"]
              },
              {
                title: "Learning Management System",
                desc: "Build a student dashboard portal enabling candidates to watch recorded modules, submit course assignments, and trace grading progress.",
                tech: ["React", "Express", "JWT Auth", "Tailwind"]
              }
            ].map((project, idx) => (
              <div key={idx} className="bg-slate-900 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-[#0EA5E9]/30 transition-all duration-300 relative group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-[#0EA5E9] uppercase border border-[#0EA5E9]/20 px-2.5 py-0.5 rounded bg-[#0EA5E9]/5 font-mono">
                      Industrial Capstone
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Verifiable Repo
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight group-hover:text-[#0EA5E9] transition-colors">{project.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-inter">{project.desc}</p>
                </div>

                <div className="border-t border-white/10 pt-4 mt-6">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t, tIdx) => (
                      <span key={tIdx} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Tools Covered Badges */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
            Modern Tech Stack
          </span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-4 tracking-tight">
            Tools & Engineering Platforms
          </h2>
          <p className="text-slate-500 text-sm font-inter">
            Work with platforms deployed at leading technology organizations.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
          {["HTML5", "CSS3", "JavaScript", "React", "Node.js", "Express.js", "MongoDB", "MySQL", "Git", "GitHub", "VS Code", "Postman", "Vercel", "Render", "Netlify"].map((tech, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/60 px-5 py-3 rounded-xl flex items-center space-x-2.5 hover:border-[#2D43B8]/20 transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
              <Code className="w-4 h-4 text-[#2D43B8]" />
              <span className="text-xs font-bold text-slate-800 tracking-wide uppercase font-mono">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Career Outcomes Roles Grid */}
      <section className="py-16 bg-[#F5F7FA] border-t border-[#E5E7EB] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
              Target Placement Roles
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] mt-4 mb-4 tracking-tight">
              Placement & Career Paths
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Equip yourself to compete for specialized developer and analytics roles in global technology pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {careerOutcomes.map((role, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 hover:border-[#2D43B8]/20 hover:shadow-lg transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-[#2D43B8]/5 flex items-center justify-center text-[#2D43B8] group-hover:bg-[#2D43B8]/10 transition-colors">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-manrope font-bold text-slate-900 text-base group-hover:text-[#2D43B8] transition-colors">{role.title}</h3>
                <p className="text-xs text-slate-555 leading-relaxed font-inter">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: Career Support & Digital Credentials (Combined Layout) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Career Support Ecosystem */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs font-bold tracking-widest text-[#2D43B8] uppercase border border-[#2D43B8]/20 px-3 py-1 rounded bg-[#2D43B8]/5 w-fit block">
              Career Support Ecosystem
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
              Placement Readiness Program
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We believe that learning code is only the first step. Our career support program focuses entirely on polishing your professional profile to match current recruiter filters.
            </p>
            
            <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
              {[
                { title: 'ATS Resume Guide', desc: 'Build structured, parsing-friendly resume sheets.' },
                { title: 'GitHub Portfolio Audits', desc: 'Optimize repository naming, readme briefs, and code structures.' },
                { title: 'LinkedIn Profile Polish', desc: 'Target keyword mapping to improve recruiter search outreach.' },
                { title: 'Mock Interviews', desc: 'Live practice drills simulating structural technical screenings.' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-left">
                  <CheckCircle className="w-5 h-5 text-[#2D43B8] flex-shrink-0 mt-0.5" />
                  <span><strong>{item.title}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right Column: Digital Credentials Certificate */}
          <div className="lg:col-span-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
              <h4 className="font-manrope font-bold text-slate-900 text-base text-left">Digital Credentials</h4>
              
              {/* Simulated Certificate Block */}
              <div className="border border-dashed border-[#2D43B8]/35 p-6 rounded-xl bg-slate-55 relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-5">
                  <Award className="w-20 h-20 text-[#2D43B8]" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <span className="logo-font text-sm font-bold text-slate-800">BeyondSkills Academy</span>
                      <p className="text-[8px] text-slate-400 font-mono">VERIFIABLE CREDENTIALS</p>
                    </div>
                    <Award className="w-8 h-8 text-[#2D43B8]" />
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Recipient Name</p>
                    <p className="text-xs font-bold text-slate-900">Student Name Placeholder</p>
                  </div>

                  <div className="space-y-1 text-left">
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
      </section>

      {/* SECTION 9: FAQ Accordion Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
            Have Questions?
          </span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Frequently Asked Queries
          </h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div key={idx} className="bg-slate-55 border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-200">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between text-slate-900 hover:text-[#2D43B8] transition-colors cursor-pointer focus:outline-none"
              >
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">{item.q}</span>
                {faqOpen[idx] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {faqOpen[idx] && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-slate-505 leading-relaxed border-t border-slate-200/40 pt-4 font-inter animate-fade-in text-left">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: FINAL CTA & ENQUIRY FORM */}
      <section id="enquiry-form-section" className="relative z-10 py-20 bg-[#F5F7FA] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: CTA Context */}
            <div className="space-y-6 text-left">
              <span className="inline-flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-[#2D43B8] bg-[#2D43B8]/10 border border-[#2D43B8]/20 px-3 py-1 rounded font-mono">
                Admissions Open
              </span>
              <h2 className="font-manrope font-extrabold text-[#111111] text-3xl sm:text-5xl leading-tight">
                Build Your Future in <span className="text-[#2D43B8]">Web Development</span>
              </h2>
              <p className="text-slate-555 text-xs sm:text-sm leading-relaxed max-w-md font-inter">
                Register details to schedule a live training counseling session. Download the syllabus models and receive detailed briefs from academy mentors.
              </p>
              
              {/* Compliance note */}
              <div className="flex items-start space-x-3 bg-white border border-slate-200 p-4 rounded-xl max-w-md">
                <ShieldAlert className="w-5 h-5 text-[#2D43B8] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-555 leading-relaxed font-inter">
                  <strong>Notice:</strong> Program registration fees are final. Class schedules are mapped dynamically to weekends to assist working professionals.
                </p>
              </div>
            </div>

            {/* Right Column: Admission Enquiry Form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl max-w-lg mx-auto w-full">
              <h3 className="font-manrope font-bold text-[#111111] text-lg sm:text-xl mb-6">Admission Enquiry Form</h3>
              
              {enquiryStatus === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl space-y-2 text-center animate-fade-in">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-sm">Enquiry Submitted Successfully!</h4>
                  <p className="text-[11px] text-emerald-600 leading-relaxed">
                    Check your email inbox (and simulated notifications) for advisor briefing schedules.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({...enquiryForm, name: e.target.value})}
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all"
                      placeholder="e.g., Faisal Shah" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({...enquiryForm, email: e.target.value})}
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all"
                      placeholder="e.g., faisal@gmail.com" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({...enquiryForm, phone: e.target.value})}
                        className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all"
                        placeholder="e.g., +91 99999 99999" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">College Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={enquiryForm.college}
                        onChange={(e) => setEnquiryForm({...enquiryForm, college: e.target.value})}
                        className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all"
                        placeholder="e.g., IIT Delhi / NIT Trichy" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Current Status *</label>
                    <select 
                      value={enquiryForm.status}
                      onChange={(e) => setEnquiryForm({...enquiryForm, status: e.target.value})}
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all"
                    >
                      <option value="Undergraduate Student">Undergraduate Student</option>
                      <option value="Final Year Student">Final Year Student</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                      <option value="Working Professional">Working Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Brief Message</label>
                    <textarea 
                      rows="3"
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all resize-none"
                      placeholder="Tell us about your career goals..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3.5 bg-[#2D43B8] text-white hover:brightness-110 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-[#2D43B8]/20 cursor-pointer"
                  >
                    Submit Enquiry
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
