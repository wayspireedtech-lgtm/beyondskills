import React, { useState, useEffect } from 'react';
import { 
  Code, BookOpen, Clock, Award, Users, CheckCircle, ArrowRight, Check, 
  ChevronRight, Calendar, ShieldAlert, Sparkles, Phone, Mail, Globe, 
  Star, Briefcase, Zap, Compass, HelpCircle, ChevronDown, ChevronUp, Download,
  MessageCircle, Layout, Server, Database, GitBranch, ShieldCheck, Laptop, 
  TrendingUp, RefreshCw, BarChart2, Shield, Eye
} from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/mockDb';

const OUTCOMES = [
  { title: "Build 8+ Practical Projects", desc: "Construct fully functional web applications from scratch, building a tangible repository that proves your capabilities to recruiters." },
  { title: "Weekly Mentor Reviews", desc: "Receive direct code audits and performance feedback from practicing software engineers to align your code with industry standards." },
  { title: "Live Doubt Solving", desc: "Participate in interactive sessions to debug your servers, refine database schemas, and resolve complex code blocks in real time." },
  { title: "Portfolio Development", desc: "Deploy your web applications on live hosting platforms, creating a professional development portfolio ready to show employers." },
  { title: "Version Control", desc: "Learn to use Git and GitHub to commit, push, and manage your codebase professionally." },
  { title: "Live Code Reviews", desc: "Participate in live programming reviews with industry mentors to check code quality." },
  { title: "GitHub Portfolio", desc: "Learn to manage code directories, create branches, and maintain a professional commit history on your profile." },
  { title: "Real Coding Assignments", desc: "Tackle structured weekly milestone exercises designed to test your understanding of MERN stack APIs." },
  { title: "One-Year LMS Access", desc: "Watch recorded class sessions, access developer guides, and download code templates for 1 year from your batch start." },
  { title: "Industry Best Practices", desc: "Learn modern development methodologies, clean code principles, and repository patterns." }
];

const CURRICULUM = [
  { phase: "Phase 1: Foundations", topics: ["Programming Fundamentals", "HTML5 Semantics", "CSS3 Flexbox & Grid Layouts", "Responsive Media Queries"] },
  { phase: "Phase 2: CSS Layouts & Libraries", topics: ["Tailwind Utility Styling", "Bootstrap Grid Architecture", "Custom CSS Variables", "Visual Design Best Practices"] },
  { phase: "Phase 3: JavaScript Engine", topics: ["Variables & Scopes", "ES6+ Modern Syntax", "Asynchronous Promises", "DOM Selection & Event Listeners"] },
  { phase: "Phase 4: Revision Workflows", topics: ["Git Version Control", "GitHub Commit History", "Postman API Inspection Client", "Consuming REST Endpoints"] },
  { phase: "Phase 5: React Component Architecture", topics: ["JSX Virtual DOM", "useState & useEffect hooks", "Context API State Trees", "React Router client navigation"] },
  { phase: "Phase 6: Server Engines", topics: ["Node.js Asynchronous Runtime", "Express Server Initialization", "Route Middleware Controls", "REST API Development"] },
  { phase: "Phase 7: Database ODM Modeling", topics: ["MongoDB Document Collections", "Mongoose Validation Schemas", "Querying Database Indices", "Data Normalization Rules"] },
  { phase: "Phase 8: Security & Operations", topics: ["JWT Token Issuance", "Password Hashing with bcrypt", "CORS Configuration", "Render Server Deployment"] }
];

const SAMPLE_PROJECTS = [
  { 
    title: "Developer Portfolio Website", 
    desc: "Build and host a personal developer website featuring responsive structures, CSS transitions, and form variables.", 
    tech: ["HTML5", "CSS Grid", "JavaScript", "Vercel"],
    learn: "Responsive UI layouts, semantic structure, and web hosting workflows.",
    skills: "CSS Grid, Flexbox, Vercel Deployment, Git Setup",
    outcome: "A live personal site to showcase all your cohort projects to recruiters.",
    mockType: "portfolio"
  },
  { 
    title: "Weather Forecast Application", 
    desc: "Create a visual widget that fetches live weather forecasts using asynchronous fetch requests.", 
    tech: ["React.js", "REST APIs", "Tailwind CSS"],
    learn: "React component states, API consumption, and rendering dynamic data.",
    skills: "React Hooks, Fetch API, Tailwind Utility Classes",
    outcome: "A functional weather dashboard fetching real-time global weather parameters.",
    mockType: "weather"
  },
  { 
    title: "Task Management Board", 
    desc: "Construct a collaborative dashboard enabling users to create, delete, and filter priority tasks.", 
    tech: ["MERN Stack", "Express APIs"],
    learn: "Creating REST APIs, setting up Express routers, and updating MongoDB data.",
    skills: "Express Routing, MongoDB CRUD Operations, Axios Client Integration",
    outcome: "A database-backed workspace board supporting full task lifecycle management.",
    mockType: "taskboard"
  },
  { 
    title: "E-Commerce Web Portal", 
    desc: "Build a digital storefront featuring item grids, shopping cart actions, and secure login modules.", 
    tech: ["MERN Stack", "MongoDB Atlas"],
    learn: "State management for shopping carts, user sessions, and database search queries.",
    skills: "Context API, Mongoose Schemas, Database Query Optimization",
    outcome: "An online store prototype supporting cart persistence and item filtering.",
    mockType: "ecommerce"
  },
  { 
    title: "Secure Authentication API", 
    desc: "Develop a backend server implementing bcrypt encryption, JWT tokens, and route protection.", 
    tech: ["Node.js", "Express.js", "JWT"],
    learn: "Backend security practices, hashing passwords, and validating session tokens.",
    skills: "JWT Authorization, bcrypt Hashing, Express Middleware Controls",
    outcome: "A secure authentication API ready to protect private client paths and admin panels.",
    mockType: "auth"
  },
  { 
    title: "Student Learning Dashboard", 
    desc: "Design a study portal for students to track course milestones, read logs, and submit assignments.", 
    tech: ["React", "Mongoose", "Tailwind"],
    learn: "Building complex relational student data models and visual progress bars.",
    skills: "React Components, Complex Database Aggregations, Responsive Dashboards",
    outcome: "A study planner portal featuring visual progress states and file upload logic.",
    mockType: "lms"
  }
];

const FAQS = [
  { q: "Who is this program for?", a: "This program is designed for college students, fresh graduates, beginners, and working professionals looking to transition into web development. No prior coding experience is required." },
  { q: "Can beginners join without prior coding experience?", a: "Yes. The curriculum starts with the basics of programming syntax and HTML/CSS, then guides you step-by-step to advanced React and backend server deployment." },
  { q: "How are classes conducted?", a: "Live sessions are conducted mostly in the evening after 6:00 PM. A comprehensive cohort schedule is provided to students upon enrollment. Recorded access, assignment guides, and chat support channels are available throughout the week." },
  { q: "Will I build projects during the course?", a: "Yes. You will build and deploy several practical web projects, including landing pages, dashboards, and database-backed web applications." },
  { q: "What tools and technologies will I learn?", a: "You will master the MERN stack: HTML5, CSS3, JavaScript (ES6+), React.js, Node.js, Express.js, MongoDB, Git, GitHub, Postman, Vercel, and Render." },
  { q: "Will I receive mentor support?", a: "Yes. Active web engineers lead live sessions and support you in code reviews and debugging assignments." },
  { q: "Will I receive a certificate?", a: "Yes. On successfully completing the course projects and assessments, you will be issued a digital certificate of completion." },
  { q: "How long is the program?", a: "The program spans 4 months with structured weekly modules to ensure sufficient time to practice coding and build your portfolio." },
  { q: "How do I enroll in the cohort?", a: "Fill out the enquiry form on this page. Our admissions advisor will contact you to explain the cohort schedule, syllabus details, and guide you through the registration process." },
  { q: "How does the admission process work?", a: "Once your enquiry form is submitted, we arrange a brief consultation to understand your career goals, verify class compatibility, and finalize your enrollment credentials." }
];

export default function FullStackLandingPage() {
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: 'Undergraduate',
    experience: 'Beginner - No Coding',
    goal: 'Land a Tech Job',
    contactTime: '' // Optional by default
  });
  const [status, setStatus] = useState(null);
  const [faqOpen, setFaqOpen] = useState({});

  // Dynamic SEO tag management & Schema Markup injection
  useEffect(() => {
    document.title = "Full Stack Web Development Program | BeyondSkills Upskilling";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Master web development with BeyondSkills' MERN Stack Certification Program. Attend live mentor-led sessions, build database-connected web apps, and compile coding portfolios.";

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Full Stack Web Development Certification Program (MERN)",
      "description": "Learn HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB with live mentorship and hands-on projects.",
      "provider": {
        "@type": "Organization",
        "name": "BeyondSkills",
        "sameAs": window.location.origin
      },
      "educationalCredentialAwarded": "Certification in Full Stack Web Development"
    };

    const scriptId = "landing-schema-jsonld";
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schemaData);

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, []);

  const handleApplySubmit = (e) => {
    e.preventDefault();

    const searchParams = new URLSearchParams(window.location.search);
    const utmSource = searchParams.get('utm_source') || 'Direct / CPC';
    const utmMedium = searchParams.get('utm_medium') || 'Search Ads';
    const utmCampaign = searchParams.get('utm_campaign') || 'Full Stack Campaign';
    const utmContent = searchParams.get('utm_content') || 'Ad Variant 1';

    const leads = getDbItem('beyondskills_leads', []);
    const newLead = {
      type: 'Academy',
      name: enquiryForm.name,
      email: enquiryForm.email,
      phone: enquiryForm.phone,
      college: enquiryForm.qualification, 
      status: enquiryForm.experience, 
      message: `Goal: ${enquiryForm.goal} • Contact: ${enquiryForm.contactTime || 'Not Specified'}`,
      campaign: utmCampaign,
      source: utmSource,
      utmMedium: utmMedium,
      utmCampaign: utmCampaign,
      utmContent: utmContent,
      leadStatus: 'New Lead',
      remarks: 'Submitted via Standalone Full Stack Landing Page',
      date: new Date().toISOString()
    };
    leads.push(newLead);
    setDbItem('beyondskills_leads', leads);

    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Enrollment Application Registered: ${enquiryForm.name}`,
        body: `Dear ${enquiryForm.name},\n\nWe have logged your application profile for the Full Stack Web Development cohort. An admissions counselor will reach out to you at ${enquiryForm.phone} to discuss curriculum timeline details.`
      }
    }));

    setStatus('success');
    setEnquiryForm({
      name: '',
      email: '',
      phone: '',
      qualification: 'Undergraduate',
      experience: 'Beginner - No Coding',
      goal: 'Land a Tech Job',
      contactTime: ''
    });
    setTimeout(() => setStatus(null), 6000);
  };

  const scrollToCurriculum = () => {
    const el = document.getElementById('curriculum-roadmap-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHeroForm = () => {
    const el = document.getElementById('hero-application-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.classList.add('ring-4', 'ring-blue-500/30');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-blue-500/30');
      }, 1500);
    }
  };

  // Render highly-detailed, beautiful, responsive interactive CSS coding/dashboard mockups
  const renderProjectMock = (type, title) => {
    switch (type) {
      case "portfolio":
        return (
          <div className="w-full h-32 bg-[#0F172A] border border-white/10 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 font-mono text-[9px] text-slate-350">
            <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              </div>
              <span className="text-[7px] text-slate-400">rohansharma.dev</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-blue-400">&lt;header&gt;</div>
              <div className="pl-2 text-emerald-400">h1: "Hi, I am Rohan"</div>
              <div className="pl-2 text-slate-400">p: "MERN Stack Engineer Intern"</div>
              <div className="text-blue-400">&lt;/header&gt;</div>
            </div>
            <div className="flex justify-between items-center text-[7px] text-slate-500 border-t border-white/5 pt-1">
              <span>css: flexbox-centered</span>
              <span className="text-[#2563EB]">Live on Vercel</span>
            </div>
          </div>
        );
      case "weather":
        return (
          <div className="w-full h-32 bg-slate-900 border border-white/10 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 text-[10px] text-white">
            <div className="flex justify-between items-center border-b border-white/5 pb-1">
              <span className="font-bold text-xs">New Delhi</span>
              <span className="text-[#F97316] font-mono font-bold">34°C</span>
            </div>
            <div className="flex-1 flex items-center justify-center space-x-2 my-1">
              <div className="bg-[#2563EB]/25 border border-blue-500/30 p-1.5 rounded-lg text-center flex-1">
                <span className="text-[7px] text-slate-400 block uppercase font-mono">Humidity</span>
                <span className="font-bold font-mono">68%</span>
              </div>
              <div className="bg-[#F97316]/25 border border-orange-500/30 p-1.5 rounded-lg text-center flex-1">
                <span className="text-[7px] text-slate-400 block uppercase font-mono">Wind</span>
                <span className="font-bold font-mono">14 km/h</span>
              </div>
            </div>
            <div className="text-[7px] text-slate-500 font-mono text-center">
              api.openweathermap.org/data/2.5/weather
            </div>
          </div>
        );
      case "taskboard":
        return (
          <div className="w-full h-32 bg-slate-950 border border-white/10 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 text-[8px] font-mono text-slate-300">
            <div className="flex justify-between items-center border-b border-white/5 pb-1">
              <span>Sprint Workspace</span>
              <span className="text-emerald-500">3/4 Done</span>
            </div>
            <div className="flex-1 space-y-1.5 mt-2">
              <div className="flex items-center justify-between bg-white/5 p-1 rounded border border-white/5">
                <span>Configure Express routers</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded text-[7px]">Done</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-1 rounded border border-white/5">
                <span>Setup MongoDB ODM schemas</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded text-[7px]">Done</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-1 rounded border border-white/5">
                <span>Render frontend tasks catalog</span>
                <span className="bg-amber-500/20 text-amber-400 px-1 rounded text-[7px]">Pending</span>
              </div>
            </div>
          </div>
        );
      case "ecommerce":
        return (
          <div className="w-full h-32 bg-white border border-slate-200 rounded-xl relative overflow-hidden flex flex-col justify-between p-2.5 text-[#0F172A]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-1">
              <span className="font-bold text-[9px] uppercase tracking-wide text-blue-600">RetroShop</span>
              <span className="text-[8px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">Cart: 2 items</span>
            </div>
            <div className="flex-1 flex items-center space-x-2 my-1">
              <div className="border border-slate-100 rounded p-1 text-center flex-1">
                <div className="w-full h-8 bg-slate-50 rounded flex items-center justify-center mb-1 text-[9px]">💻</div>
                <span className="font-bold text-[7px] block">MacBook M3</span>
                <span className="text-[7px] text-slate-500 block font-mono">₹1,14,000</span>
              </div>
              <div className="border border-slate-100 rounded p-1 text-center flex-1">
                <div className="w-full h-8 bg-slate-50 rounded flex items-center justify-center mb-1 text-[9px]">🎧</div>
                <span className="font-bold text-[7px] block">Noise-Cancelling</span>
                <span className="text-[7px] text-slate-500 block font-mono">₹14,500</span>
              </div>
            </div>
          </div>
        );
      case "auth":
        return (
          <div className="w-full h-32 bg-[#0B0F19] border border-white/10 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 font-mono text-[8px] text-slate-400">
            <div className="flex justify-between items-center border-b border-white/5 pb-1">
              <span className="text-emerald-500">POST /api/auth/login</span>
              <span className="text-slate-500">Status 200</span>
            </div>
            <div className="flex-1 space-y-1 mt-2">
              <div>// JWT Token Issued</div>
              <div className="text-blue-400 overflow-x-hidden whitespace-nowrap">
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              </div>
              <div className="text-slate-500">// bcrypt: password verification successful</div>
            </div>
          </div>
        );
      case "lms":
        return (
          <div className="w-full h-32 bg-white border border-slate-200 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 text-[#0F172A]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-1">
              <span className="font-bold text-[9px] text-slate-700">Course Progress Tracker</span>
              <span className="text-blue-600 font-bold text-[9px]">72%</span>
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-2">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[72%]"></div>
              </div>
              <div className="flex justify-between text-[7px] text-slate-500">
                <span>Completed: 8 Modules</span>
                <span>Active Track: Node Server APIs</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-32 bg-slate-100 rounded-xl flex items-center justify-center font-mono text-xs text-slate-400">
            Mock Project Screen
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-inter antialiased selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      
      {/* 1. Sticky Header wrapper */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1 group">
            <span className="logo-font font-extrabold tracking-tight text-[#0F172A] text-xl">
              Beyond
            </span>
            <span className="logo-font font-extrabold tracking-tight text-[#2563EB] text-xl">
              Skills
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={scrollToHeroForm}
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all"
            >
              Apply Now
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH ENQUIRY FORM AT THE TOP (ABOVE THE FOLD) */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Information Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Become a Full Stack Developer</span>
            </span>
            <h1 className="font-manrope font-extrabold text-[#0F172A] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08]">
              Build Production-Ready Web Applications with <span className="text-[#2563EB]">Industry Mentorship</span>
            </h1>
            <p className="text-slate-650 text-sm sm:text-base leading-relaxed max-w-xl">
              Learn HTML, CSS, JavaScript, React, Node.js, Express.js and MongoDB through live mentor-led sessions, practical assignments and real-world projects designed to prepare you for internships and software development roles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md pt-2">
              <button 
                onClick={scrollToHeroForm}
                className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/10 text-center cursor-pointer"
              >
                Apply Now
              </button>
              <button 
                onClick={scrollToCurriculum}
                className="bg-slate-50 border border-slate-200 text-[#0F172A] hover:bg-slate-100 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>View Curriculum Roadmap</span>
              </button>
            </div>

            {/* Trust Indicators directly below CTA */}
            <div className="pt-6 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">What is included</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2.5 text-xs text-slate-700 font-medium">
                <span className="flex items-center space-x-1.5"><Check className="w-4 h-4 text-emerald-500" /> <span>Beginner Friendly</span></span>
                <span className="flex items-center space-x-1.5"><Check className="w-4 h-4 text-emerald-500" /> <span>Live Mentor Sessions</span></span>
                <span className="flex items-center space-x-1.5"><Check className="w-4 h-4 text-emerald-500" /> <span>Real Projects</span></span>
                <span className="flex items-center space-x-1.5"><Check className="w-4 h-4 text-emerald-500" /> <span>Interview Preparation</span></span>
                <span className="flex items-center space-x-1.5"><Check className="w-4 h-4 text-emerald-500" /> <span>1 Year LMS Access</span></span>
              </div>
            </div>
          </div>

          {/* Right Lead Capture Form Column (Above the fold) */}
          <div className="lg:col-span-5">
            <div 
              id="hero-application-form" 
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl w-full transition-all duration-300"
            >
              <h3 className="font-manrope font-bold text-[#0F172A] text-base sm:text-lg mb-4 text-left border-b border-slate-100 pb-2">
                Cohort Admission Enquiry
              </h3>
              
              {status === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl space-y-2 text-center animate-fade-in">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-xs">Enquiry Registered Successfully!</h4>
                  <p className="text-[11px] text-emerald-600 leading-relaxed">
                    Your details have been logged in the admissions queue. An advisor will reach out to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-3.5 text-left">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({...enquiryForm, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] transition-all"
                      placeholder="e.g., Rohan Sharma" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Email *</label>
                      <input 
                        type="email" 
                        required 
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({...enquiryForm, email: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] transition-all"
                        placeholder="e.g., rohan@gmail.com" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Mobile *</label>
                      <input 
                        type="tel" 
                        required 
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({...enquiryForm, phone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] transition-all"
                        placeholder="e.g., 99999 99999" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Qualification *</label>
                      <select 
                        value={enquiryForm.qualification}
                        onChange={(e) => setEnquiryForm({...enquiryForm, qualification: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] transition-all"
                      >
                        <option value="Undergraduate">Undergraduate Student</option>
                        <option value="Postgraduate">Postgraduate Student</option>
                        <option value="Fresh Graduate">Fresh Graduate</option>
                        <option value="Working Professional">Working Professional</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Coding Experience *</label>
                      <select 
                        value={enquiryForm.experience}
                        onChange={(e) => setEnquiryForm({...enquiryForm, experience: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] transition-all"
                      >
                        <option value="Beginner - No Coding">Beginner - No Coding</option>
                        <option value="Basic - Little Coding">Basic - Little Coding</option>
                        <option value="Intermediate - Code Daily">Intermediate - Code Daily</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Career Goal *</label>
                      <select 
                        value={enquiryForm.goal}
                        onChange={(e) => setEnquiryForm({...enquiryForm, goal: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] transition-all"
                      >
                        <option value="Land a Tech Job">Land a Tech Job</option>
                        <option value="Freelancing/Independent">Freelancing</option>
                        <option value="Build a Startup">Build a Startup</option>
                        <option value="General Upskilling">General Upskilling</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Preferred Call Time (Optional)</label>
                      <select 
                        value={enquiryForm.contactTime}
                        onChange={(e) => setEnquiryForm({...enquiryForm, contactTime: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] transition-all"
                      >
                        <option value="">Select time...</option>
                        <option value="Morning 9 AM - 12 PM">Morning 9 AM - 12 PM</option>
                        <option value="Afternoon 12 PM - 4 PM">Afternoon 12 PM - 4 PM</option>
                        <option value="Evening 4 PM - 8 PM">Evening 4 PM - 8 PM</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full mt-2 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    Apply Now
                  </button>
                  
                  <p className="text-[8px] text-slate-400 leading-normal text-center mt-2 font-mono">
                    *By submitting this form you agree to be contacted regarding this program.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 3. NEW TRUST METRICS SECTION */}
      <section className="py-12 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] font-mono">Trusted Learning Experience</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
          {[
            { metric: "7,000+", label: "Students Trained", desc: "Across academic upskilling tracks" },
            { metric: "100+", label: "Hiring Partners", desc: "Aspirations for program graduates" },
            { metric: "100+", label: "College Collaborations", desc: "Collaborative campus networks" },
            { metric: "Industry", label: "Mentorship", desc: "Led by working software engineers" },
            { metric: "Hands-on", label: "Learning", desc: "Weekly project milestone exercises" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-1">
              <span className="text-2xl font-extrabold text-[#0F172A] font-manrope tracking-tight block">{stat.metric}</span>
              <span className="text-xs font-bold text-[#2563EB] block">{stat.label}</span>
              <span className="text-[10px] text-slate-500 block leading-normal">{stat.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY COMPANIES HIRE FULL STACK DEVELOPERS */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Industry Hiring Insights</span>
              <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Why Companies Hire Full Stack Developers
              </h2>
              <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                Modern engineering teams seek versatile developers who can conceptualize backend services and build responsive, fast-loading visual interfaces. This program focuses on equipping you with both frontend and backend capabilities to help you stand out.
              </p>
              <div className="space-y-4 pt-2">
                {[
                  { title: "Versatile Project Handling", text: "Product teams prefer developers who understand both frontend layouts and databases to streamline communication and deliver web features faster." },
                  { title: "Independent Product Building", text: "Startups hire Full Stack developers to design, code, and deploy minimal viable products from scratch without needing extra resources." },
                  { title: "Growing Freelance Demand", text: "Small businesses and international clients require developers who can take a web project from raw visual folders to a live-hosted portal." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-900 block font-manrope">{item.title}</strong>
                      <span className="text-slate-500 leading-normal block mt-0.5">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Code Mockup */}
            <div className="lg:col-span-5">
              <div className="bg-[#0A0E29] border border-white/10 rounded-2xl p-5 shadow-2xl relative text-slate-350">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">mern_architecture.js</span>
                </div>
                <div className="font-mono text-xs text-slate-300 space-y-2 bg-slate-950 p-4 rounded-xl border border-white/5 overflow-x-auto">
                  <div className="text-blue-400">const mernStack = &#123;</div>
                  <div className="pl-4">frontend: "React.js Component UI",</div>
                  <div className="pl-4">backend: "Node.js & Express API Routes",</div>
                  <div className="pl-4">database: "MongoDB Data Collections",</div>
                  <div className="pl-4">hosting: ["Vercel", "Render Cloud"],</div>
                  <div className="pl-4">lmsAccessPeriod: "1 Year",</div>
                  <div className="pl-4">newCohortStarts: "Every Month"</div>
                  <div className="text-blue-400">&#125;;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW CAREER OUTCOMES SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Target Job Profiles</span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
            Career Opportunities After This Program
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            Build the technical skills required to qualify for developer internships, entry-level software jobs, and freelance opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { role: "Frontend Developer", desc: "Specialize in building interactive client-side interfaces, responsive visual grids, and dynamic state-driven layouts using React.js." },
            { role: "Backend Developer", desc: "Build Express API microservices, configure middleware routes, implement JWT tokens, and coordinate MongoDB database actions." },
            { role: "Full Stack Developer", desc: "Combine client-side React code with backend Express routing to develop complete, database-backed web portals." },
            { role: "React.js Developer", desc: "Focus specifically on component design systems, state context trees, dynamic custom hooks, and route parameters." },
            { role: "Node.js API Engineer", desc: "Optimize server execution scripts, handle file uploads, and configure CORS parameters to support external applications." },
            { role: "Software Engineer", desc: "Apply software engineering basics, maintain Git commit logs, and write clean code scripts to solve data problems." }
          ].map((job, idx) => (
            <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl space-y-2 hover:border-[#2563EB]/25 transition-all">
              <h3 className="font-manrope font-bold text-[#0F172A] text-base">{job.role}</h3>
              <p className="text-xs text-slate-550 leading-relaxed">{job.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY BEYONDSKILLS (REWRITTEN ADVANTAGE SECTION) */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">The BeyondSkills Advantage</span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
              Designed for Practical Competence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
            {OUTCOMES.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-between hover:border-[#2563EB]/20 transition-all group">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                    <Check className="w-4 h-4" />
                  </div>
                  <h4 className="font-manrope font-bold text-slate-800 text-xs uppercase tracking-wide leading-tight">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. NEW COMPARISON SECTION (Why BeyondSkills?) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Program Comparison</span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
            How BeyondSkills Compares
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* Traditional Learning */}
          <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-slate-500 border-b border-slate-200 pb-3 uppercase tracking-wider font-manrope">Traditional Learning</h3>
            <ul className="space-y-4 text-xs text-slate-500">
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold mt-0.5">✗</span>
                <span><strong>Theory-focused lectures:</strong> Heavy focus on syntax definitions without practical hosting configurations.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold mt-0.5">✗</span>
                <span><strong>Recorded tutorials only:</strong> Passive watching without active mentor code reviews or debugging assistance.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold mt-0.5">✗</span>
                <span><strong>Simple exercise files:</strong> Submitting basic code scripts instead of compiling complete portfolio projects.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500 font-bold mt-0.5">✗</span>
                <span><strong>Static reference materials:</strong> Relying on static text tutorials without active mentor code reviews or hands-on practice.</span>
              </li>
            </ul>
          </div>

          {/* BeyondSkills */}
          <div className="bg-white border-2 border-[#2563EB]/25 p-8 rounded-3xl space-y-6 relative shadow-lg">
            <div className="absolute -top-3.5 left-8 bg-[#2563EB] text-white text-[9px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider">
              Recommended Cohort
            </div>
            <h3 className="text-lg font-bold text-[#2563EB] border-b border-blue-100 pb-3 uppercase tracking-wider font-manrope">BeyondSkills</h3>
            <ul className="space-y-4 text-xs text-slate-700">
              <li className="flex items-start space-x-3">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <span><strong>Hands-on Projects:</strong> Learn by coding, folder configurations, and hosting live React and Node applications.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <span><strong>Live Interactive Reviews:</strong> Share code directories with cohort mentors and resolve programming doubts.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <span><strong>Git Portfolio Integration:</strong> Document your development progress by maintaining active GitHub repositories.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <span><strong>Structured Projects:</strong> Practice data manipulation, DOM operations, and Express server APIs in production environments.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. CURRICULUM ROADMAP TIMELINE */}
      <section id="curriculum-roadmap-section" className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#F97316] text-[10px] font-extrabold tracking-widest uppercase border border-[#F97316]/30 px-3 py-1 rounded bg-[#F97316]/5 font-mono">
              Timeline Modules
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Curriculum Roadmap Timeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {CURRICULUM.map((module, idx) => (
              <div key={idx} className="bg-slate-950 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider block mb-3 font-mono">
                    {module.phase}
                  </span>
                  <ul className="space-y-2">
                    {module.topics.map((topic, tIdx) => (
                      <li key={tIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* End timeline extra info */}
          <div className="mt-8 text-center bg-white/5 border border-white/10 max-w-xl mx-auto p-4 rounded-xl text-xs text-slate-300 leading-normal font-mono">
            *Final milestone: Portfolio verification, final project submission, and certificate allocation.
          </div>
        </div>
      </section>

      {/* 9. PROJECTS SHOWCASE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Hands-On Practice</span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
            Portfolio Project Samples
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            Build applications standard in global technology products. The following listings represent sample projects developed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {SAMPLE_PROJECTS.map((project, idx) => (
            <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow relative">
              <div className="space-y-4">
                
                {/* Responsive, premium CSS browser mock */}
                {renderProjectMock(project.mockType, project.title)}

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[#2563EB] uppercase border border-blue-100 px-2 py-0.5 rounded bg-blue-50 font-mono">
                    Portfolio Module
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Project {idx + 1}</span>
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{project.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{project.desc}</p>
                
                <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl space-y-2 text-[11px] text-slate-650 leading-normal">
                  <p><strong>What You Will Learn:</strong> {project.learn}</p>
                  <p><strong>Skills Gained:</strong> {project.skills}</p>
                  <p className="text-blue-600 font-semibold"><strong>Outcome:</strong> {project.outcome}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-6">
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t, tIdx) => (
                    <span key={tIdx} className="text-[9px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. NEW MENTOR SECTION */}
      <section className="py-16 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Cohort Instructors</span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
              Meet Your Mentors
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              Learn directly from software engineers who understand industry coding standards and recruitment parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            {/* Mentor 1 */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl space-y-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-sm">
                  AR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dr. Aris Rawat</h4>
                  <p className="text-[10px] text-slate-400">Lead Program Instructor</p>
                  <p className="text-[9px] text-[#2563EB] font-mono font-bold">12+ Years Industry Experience</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500 leading-normal space-y-2">
                <p><strong>Past Company Experience:</strong> Tech Lead Architect & Academic Researcher</p>
                <p className="italic text-slate-600">
                  "I specialize in database structures, Node servers, and system scalability guidelines. In this cohort, we focus on writing clean, modular APIs and configuring robust production database indexes."
                </p>
                <p className="text-[#2563EB] font-medium font-mono text-[9px] flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>LinkedIn Verified Profile Reference</span>
                </p>
              </div>
            </div>

            {/* Mentor 2 */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl space-y-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-sm">
                  SM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Siddharth Mehta</h4>
                  <p className="text-[10px] text-slate-400">Senior Web Architect & MERN Lead</p>
                  <p className="text-[9px] text-[#2563EB] font-mono font-bold">8+ Years Development Experience</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500 leading-normal space-y-2">
                <p><strong>Past Company Experience:</strong> Lead Engineer at Enterprise SaaS Division</p>
                <p className="italic text-slate-600">
                  "My focus is frontend component trees, React State Context, and responsive styling systems. I'll be guiding your weekly portfolio project code audits to prepare you for tech interviews."
                </p>
                <p className="text-[#2563EB] font-medium font-mono text-[9px] flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>LinkedIn Verified Profile Reference</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. NEW PROGRAM JOURNEY (Visual Roadmap) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Roadmap Milestone Cycles</span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
            The Program Journey
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Horizontal line for desktop timelines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-left relative z-10">
            {[
              { step: "01", title: "Apply", desc: "Submit your cohort application form online." },
              { step: "02", title: "Admission Call", desc: "Review details with program advisor." },
              { step: "03", title: "Enrollment", desc: "Log details and activate your study credential." },
              { step: "04", title: "Live Classes", desc: "Attend evening sessions (mostly after 6:00 PM)." },
              { step: "05", title: "Assignments", desc: "Submit weekly code milestone exercises." },
              { step: "06", title: "Projects", desc: "Develop and coordinate database applications." },
              { step: "07", title: "Portfolio", desc: "Commit your code and deploy to Vercel/Render." },
              { step: "08", title: "Git Push", desc: "Host all your verified project files on GitHub." },
              { step: "09", title: "Final Review", desc: "Verify complete project compilation with mentors." },
              { step: "10", title: "Completion", desc: "Receive program certificate credentials." }
            ].map((journey, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-between hover:border-[#2563EB]/25 transition-all">
                <div>
                  <span className="text-[10px] font-bold text-[#F97316] font-mono block mb-1.5">Milestone {journey.step}</span>
                  <h4 className="font-manrope font-bold text-slate-800 text-xs uppercase tracking-wide mb-1">{journey.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">{journey.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. PROGRAM PARAMETERS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Overview Details</span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
            Program Parameters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { label: "Timeline Duration", value: "4 Months", extra: "Structured weekly modules", icon: Clock },
            { label: "Class Timings", value: "Evening Classes (Mostly after 6:00 PM)", extra: "Detailed schedule shared upon enrollment", icon: Calendar },
            { label: "Delivery Mode", value: "Live Classes + Recorded Access", extra: "Flexible online access", icon: Laptop },
            { label: "Support Language", value: "English / Hindi Support", extra: "Clear query explanations", icon: Globe },
            { label: "Eligibility Threshold", value: "Beginner to Intermediate", extra: "No coding background required", icon: Users },
            { label: "LMS Access Period", value: "1 Year LMS Access", extra: "Access recordings for 1 year from start", icon: BookOpen },
            { label: "Projects Completed", value: "8+ Practical Projects", extra: "Portfolio building focus", icon: Code },
            { label: "Mentorship Focus", value: "Code Review & Guidance", extra: "Learn professional workflow methodologies", icon: Briefcase },
            { label: "Milestone Credentials", value: "Completion Certificate", extra: "BeyondSkills Program Certificate", icon: Award }
          ].map((detail, idx) => {
            const Icon = detail.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl hover:border-[#2563EB]/25 transition-all flex items-start space-x-4">
                <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-xl flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block font-mono">{detail.label}</span>
                  <p className="text-sm sm:text-base font-bold text-slate-900 font-manrope">{detail.value}</p>
                  <p className="text-[10px] text-slate-500 leading-normal">{detail.extra}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 13. SOCIAL PROOF Testimonial Placeholders */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Student Success</span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
              Cohort Success Stories
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              Below are accounts from students who completed the program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Rohan Sharma */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    RS
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Rohan Sharma</p>
                    <p className="text-[9px] text-slate-400">College Student Track</p>
                  </div>
                </div>
                <span className="text-[8px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                  Enrolled
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-650 leading-relaxed">
                <p><strong>Affiliation:</strong> Delhi Technological University (DTU)</p>
                <p><strong>Current Role:</strong> Frontend Intern at Hashedin by Deloitte (6.5 LPA)</p>
                <p className="italic text-slate-500 pt-2 border-t border-slate-100">
                  "The project reviews were extremely critical. Siddharth mentored me on organizing my React context trees and building clean portfolio directories. That helped me qualify for the internship interview."
                </p>
              </div>
            </div>

            {/* Priya Patel */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    PP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Priya Patel</p>
                    <p className="text-[9px] text-slate-400">Working Professional Track</p>
                  </div>
                </div>
                <span className="text-[8px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                  Enrolled
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-650 leading-relaxed">
                <p><strong>Affiliation:</strong> ex-Operations Associate</p>
                <p><strong>Current Role:</strong> Backend Analyst at Paytm (8.2 LPA)</p>
                <p className="italic text-slate-500 pt-2 border-t border-slate-100">
                  "Being from a non-developer Operations background, transitioning was tough. Dr. Aris guided me through Express routers, MongoDB aggregations, and REST protocols. The 1 year LMS recorded videos let me revise after shifts."
                </p>
              </div>
            </div>

            {/* Amit Kumar */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    AK
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Amit Kumar</p>
                    <p className="text-[9px] text-slate-400">Career Switcher Track</p>
                  </div>
                </div>
                <span className="text-[8px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                  Enrolled
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-650 leading-relaxed">
                <p><strong>Affiliation:</strong> Mechanical Stream Graduate</p>
                <p><strong>Current Role:</strong> Junior Developer at Cognizant (5.8 LPA)</p>
                <p className="italic text-slate-500 pt-2 border-t border-slate-100">
                  "I had zero coding background. The cohort journey layout (starting with basic HTML layouts and JS parameters) kept the learning curve manageable. The live project reviews and mentor feedback helped build real confidence going into interviews."
                </p>
              </div>
            </div>
          </div>

          {/* Hiring partners logo section */}
          <div className="mt-12 border-t border-slate-200/60 pt-8 text-center">
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-widest block mb-6 font-mono">Companies Where Our Learners Aspire to Work</span>
            <div className="flex flex-wrap items-center justify-center gap-8 text-[#0F172A] font-bold font-manrope tracking-wider text-xs">
              <span className="bg-white border border-slate-200/80 px-4 py-2 rounded-xl text-slate-600 shadow-sm">Deloitte</span>
              <span className="bg-white border border-slate-200/80 px-4 py-2 rounded-xl text-slate-600 shadow-sm">Paytm</span>
              <span className="bg-white border border-slate-200/80 px-4 py-2 rounded-xl text-slate-600 shadow-sm">Cognizant</span>
              <span className="bg-white border border-slate-200/80 px-4 py-2 rounded-xl text-slate-600 shadow-sm">Infosys</span>
              <span className="bg-white border border-slate-200/80 px-4 py-2 rounded-xl text-slate-600 shadow-sm">Wipro</span>
            </div>
          </div>
        </div>
      </section>

      {/* 14. ACCORDION FAQS */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Got Questions?</span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Frequently Asked Queries
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200/60 rounded-xl overflow-hidden transition-all">
              <button 
                onClick={() => setFaqOpen(prev => ({ ...prev, [idx]: !prev[idx] }))}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between text-slate-900 hover:text-[#2563EB] transition-colors focus:outline-none cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-left">{item.q}</span>
                {faqOpen[idx] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {faqOpen[idx] && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3 text-left animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 15. FINAL CTA SECTION (SCROLLS TO TOP) */}
      <section className="py-20 bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded font-mono">
            Start Your Developer Journey Today
          </span>
          <h2 className="font-manrope font-extrabold text-[#0F172A] text-3xl sm:text-4xl">
            Build Your Portfolio with BeyondSkills
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Register details at the top of the page to schedule a live training counseling session. Download the syllabus models and receive detailed briefs from academy mentors.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={scrollToHeroForm}
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              Reserve Your Seat
            </button>
            <button 
              onClick={scrollToHeroForm}
              className="bg-slate-150 hover:bg-slate-200 text-[#0F172A] font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all border border-slate-300/60 cursor-pointer"
            >
              Talk to Our Program Advisor
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal max-w-sm mx-auto">
            Our team will contact you to explain the program, curriculum, fee structure and answer all your questions.
          </p>
        </div>
      </section>

      {/* Standalone Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-left">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-1 group">
              <span className="logo-font font-extrabold tracking-tight text-white text-lg">
                Beyond
              </span>
              <span className="logo-font font-extrabold tracking-tight text-[#2563EB] text-lg">
                Skills
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Upskilling cohorts combining live mentorship and project assessments.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] font-mono">Contact Details</h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>connect@beyondskills.in</span>
              </p>
              <p className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-slate-500" />
                <span>WhatsApp Chat Support</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] font-mono">Quick Links</h4>
            <div className="text-xs text-slate-400 flex flex-col space-y-2">
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
              <a href="/terms" className="hover:underline">Terms & Conditions</a>
            </div>
          </div>
          
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 pt-6 text-center text-[10px] text-slate-500 font-mono">
          &copy; {new Date().getFullYear()} BeyondSkills. All rights reserved.
        </div>
      </footer>

      {/* 16. Floating WhatsApp button */}
      <a 
        href="https://wa.me/919999999999?text=Hi%20BeyondSkills,%20I'm%20interested%2520in%2520the%2520Full%2520Stack%2520Web%2520Development%2520Cohort!"
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer group"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="absolute right-full mr-3 bg-slate-900 text-white text-[10px] font-bold font-mono px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </a>

      {/* 17. Sticky Mobile Apply CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 p-3 flex sm:hidden items-center justify-between shadow-2xl">
        <div>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Cohort Program</span>
          <span className="text-xs font-bold text-slate-900 font-manrope">Full Stack Web Dev</span>
        </div>
        <button 
          onClick={scrollToHeroForm}
          className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg transition-all cursor-pointer"
        >
          Apply Now
        </button>
      </div>

    </div>
  );
}
