import React, { useState, useEffect } from 'react';
import { 
  Code, BookOpen, Clock, Award, Users, CheckCircle, ArrowRight, Check, 
  ChevronRight, Calendar, ShieldAlert, Sparkles, Phone, Mail, Globe, 
  Star, Briefcase, Zap, Compass, HelpCircle, ChevronDown, ChevronUp, Download,
  MessageCircle, Layout, Server, Database, GitBranch, ShieldCheck
} from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/mockDb';

const BENEFITS = [
  { title: "Beginner Friendly", desc: "No coding background needed. We start from basic syntax and HTML tags." },
  { title: "Practical Learning", desc: "Focus on clean coding, folder setups, and hosting active web apps." },
  { title: "Mentor Guidance", desc: "Weekly review sessions led by active professional web engineers." },
  { title: "Live Sessions", desc: "Attend live training blocks to clarify queries and discuss concepts." },
  { title: "Real Projects", desc: "Build applications backed by databases and dynamic routing structures." },
  { title: "Career Guidance", desc: "Equip yourself to navigate recruitment steps and highlight your developer skills." },
  { title: "Resume Support", desc: "Structure your resume sheets to focus on code portfolios and core technologies." },
  { title: "Interview Preparation", desc: "Practice coding algorithms, DOM manipulations, and Express server questions." },
  { title: "Learning Community", desc: "Collaborate and share code directories with cohort members in chat channels." },
  { title: "LMS Access", desc: "Watch recorded lectures and access code libraries at your convenience." },
  { title: "Assignments", desc: "Tackle weekly milestone checks to validate your database and API models." },
  { title: "Portfolio Development", desc: "Host 3 core projects on GitHub as concrete proof of your capabilities." }
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
  { title: "Developer Portfolio Website", desc: "Build and host a personal developer website featuring responsive structures, CSS transitions, and form variables.", tech: ["HTML5", "CSS Grid", "JavaScript", "Vercel"] },
  { title: "Weather Forecast Application", desc: "Create a visual widget that fetches live weather forecasts using asynchronous fetch requests.", tech: ["React.js", "REST APIs", "Tailwind CSS"] },
  { title: "Task Management Board", desc: "Construct a collaborative dashboard enabling users to create, delete, and filter priority tasks.", tech: ["MERN Stack", "Express APIs"] },
  { title: "E-Commerce Web Portal", desc: "Build a digital storefront featuring item grids, shopping cart actions, and secure login modules.", tech: ["MERN Stack", "MongoDB Atlas"] },
  { title: "Secure Authentication API", desc: "Develop a backend server implementing bcrypt encryption, JWT tokens, and route protection.", tech: ["Node.js", "Express.js", "JWT"] },
  { title: "Student Learning Dashboard", desc: "Design a study portal for students to track course milestones, read logs, and submit assignments.", tech: ["React", "Mongoose", "Tailwind"] }
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
    contactTime: 'Morning 9 AM - 12 PM'
  });
  const [status, setStatus] = useState(null);
  const [faqOpen, setFaqOpen] = useState({});

  // Dynamic SEO tag management & Schema Markup injection
  useEffect(() => {
    document.title = "Full Stack Web Development Program | BeyondSkills Upskilling";
    
    // Add Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Master web development with BeyondSkills' MERN Stack Certification Program. Attend live mentor-led sessions, build database-connected web apps, and compile coding portfolios.";

    // Schema Markup
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

    // Read UTM Parameters
    const searchParams = new URLSearchParams(window.location.search);
    const utmSource = searchParams.get('utm_source') || 'Direct / CPC';
    const utmMedium = searchParams.get('utm_medium') || 'Search Ads';
    const utmCampaign = searchParams.get('utm_campaign') || 'Full Stack Campaign';
    const utmContent = searchParams.get('utm_content') || 'Ad Variant 1';

    // Log to local storage DB leads (for CRM validation inside Admin console)
    const leads = getDbItem('beyondskills_leads', []);
    const newLead = {
      type: 'Academy',
      name: enquiryForm.name,
      email: enquiryForm.email,
      phone: enquiryForm.phone,
      college: enquiryForm.qualification, 
      status: enquiryForm.experience, 
      message: `Goal: ${enquiryForm.goal} • Contact: ${enquiryForm.contactTime}`,
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

    // simulated Google Sheets request trigger
    console.log("Saving lead metrics to mock Google Sheets table schema:", newLead);

    // Trigger local SLA toast notification
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Enrollment Application Registered: ${enquiryForm.name}`,
        body: `Dear ${enquiryForm.name},\n\nWe have logged your application profile for the Full Stack Web Development cohort. \n\nOur team has received your registration under campaign parameters: ${utmCampaign}. An admissions counselor has been assigned and will reach out during your preferred window (${enquiryForm.contactTime}) at ${enquiryForm.phone}.\n\nSincerely,\nBeyondSkills Cohort Coordinator`
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
      contactTime: 'Morning 9 AM - 12 PM'
    });
    setTimeout(() => setStatus(null), 6000);
  };

  const downloadSyllabusMock = () => {
    alert('Full Stack Web Development Curriculum Program Guide downloaded! (Simulated PDF download)');
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Curriculum Guide Dispatched`,
        body: `The program curriculum syllabus has been formatted and shared. Reach out to connect@beyondskills.in if you face folder configuration issues.`
      }
    }));
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
              <span>Full Stack Web Development Cohort</span>
            </span>
            <h1 className="font-manrope font-extrabold text-[#0F172A] text-4xl sm:text-6xl tracking-tight leading-[1.08]">
              Build Real Web Applications with <span className="text-[#2563EB]">MERN Stack Mentorship</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Master frontend designs, express backend routing, and MongoDB databases. Participate in live mentor-led sessions, build structural projects, and prepare coding portfolios.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md pt-2">
              <button 
                onClick={scrollToHeroForm}
                className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/10 text-center cursor-pointer"
              >
                Apply Now
              </button>
              <button 
                onClick={downloadSyllabusMock}
                className="bg-slate-50 border border-slate-200 text-[#0F172A] hover:bg-slate-100 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Curriculum</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">Cohort Standards</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-[11px] text-slate-600 font-medium">
                {["Practical Learning", "Hands-on Projects", "Mentor Support", "Career Guidance", "Completion Certificate"].map((badge, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{badge}</span>
                  </div>
                ))}
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
                Admission Enquiry Form
              </h3>
              
              {status === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl space-y-2 text-center animate-fade-in">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-xs">Enquiry Registered Successfully!</h4>
                  <p className="text-[11px] text-emerald-600 leading-relaxed">
                    Your details have been logged in the admissions queue. An advisor will reach out during your preferred contact window.
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
                      placeholder="e.g., Faisal Shah" 
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
                        placeholder="faisal@gmail.com" 
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
                        placeholder="+91 99999 99999" 
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
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Fresh Graduate">Fresh Graduate</option>
                        <option value="Working Professional">Working Prof.</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Coding Exp *</label>
                      <select 
                        value={enquiryForm.experience}
                        onChange={(e) => setEnquiryForm({...enquiryForm, experience: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] transition-all"
                      >
                        <option value="Beginner - No Coding">Beginner</option>
                        <option value="Basic - Little Coding">Basic</option>
                        <option value="Intermediate - Code Daily">Intermediate</option>
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
                        <option value="Build a Startup">Build Startup</option>
                        <option value="General Upskilling">Upskilling</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Preferred Call Time *</label>
                      <select 
                        value={enquiryForm.contactTime}
                        onChange={(e) => setEnquiryForm({...enquiryForm, contactTime: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2563EB] transition-all"
                      >
                        <option value="Morning 9 AM - 12 PM">9 AM - 12 PM</option>
                        <option value="Afternoon 12 PM - 4 PM">12 PM - 4 PM</option>
                        <option value="Evening 4 PM - 8 PM">4 PM - 8 PM</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full mt-2 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-blue-500/10 cursor-pointer"
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

      {/* 3. WHY LEARN FULL STACK WEB DEVELOPMENT */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Target Landscape</span>
              <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Why Learn Full Stack Web Development
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Full Stack Web Development is a highly sought-after technology career path. Product companies, fast-growing SaaS startups, and digital solution agencies look for developers capable of handling user-facing visuals as well as backend REST APIs and database models.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  "Companies seek developers who can manage both interface experiences and backend engines.",
                  "Enables you to build and launch complete web applications quickly as a single developer.",
                  "Offers remote freelance opportunities and high-paying professional career roles.",
                  "Gives you the foundational skills to build custom prototypes for startup ideas."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Developer visual profile snippet placed here as graphic support */}
            <div className="lg:col-span-5">
              <div className="bg-[#0A0E29] border border-white/10 rounded-2xl p-5 shadow-2xl relative text-slate-350">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">developer_environment.js</span>
                </div>
                <div className="font-mono text-xs text-slate-300 space-y-2 bg-slate-950 p-4 rounded-xl border border-white/5 overflow-x-auto">
                  <div className="text-blue-400">const developerProfile = &#123;</div>
                  <div className="pl-4">name: "BeyondSkills Student",</div>
                  <div className="pl-4">duration: "4 Months",</div>
                  <div className="pl-4">frameworks: ["React.js", "Node.js", "Express.js"],</div>
                  <div className="pl-4">database: "MongoDB Atlas",</div>
                  <div className="pl-4">verifiableCertificate: false,</div>
                  <div className="pl-4">projectsBuilt: ["E-Commerce", "Admin Portal", "LMS"]</div>
                  <div className="text-blue-400">&#125;;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY BEYONDSKILLS (12 Icon Cards) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">The BeyondSkills Advantage</span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
            Designed for Practical Competence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {BENEFITS.map((benefit, idx) => (
            <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl flex flex-col justify-between hover:border-[#2563EB]/25 hover:shadow-md transition-all group">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="font-manrope font-bold text-slate-800 text-sm uppercase tracking-wide">{benefit.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CURRICULUM ROADMAP TIMELINE */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
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
            *Final milestone: Portfolio verification, customized resume audit reviews, and technical mock interviews preparation.
          </div>
        </div>
      </section>

      {/* 6. PROJECTS SHOWCASE */}
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
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[#2563EB] uppercase border border-blue-100 px-2 py-0.5 rounded bg-blue-50 font-mono">
                    Portfolio Module
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Sample</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{project.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{project.desc}</p>
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

      {/* 7. THE LEARNING EXPERIENCE JOURNEY */}
      <section className="py-16 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Learning Journey</span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
              The BeyondSkills Method
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { step: "01", title: "Attend live mentor sessions", desc: "Interact with practicing engineers on structured evenings." },
              { step: "02", title: "Complete assignments", desc: "Receive code reviews from teaching assistants." },
              { step: "03", title: "Build project portfolios", desc: "Pushes deliverables to your personal Git repository." },
              { step: "04", title: "Prepare for interviews", desc: "Drill algorithm parameters and review technical code questions." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl hover:border-blue-500/25 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-mono font-bold text-sm mb-4">
                  {step.step}
                </div>
                <h4 className="font-manrope font-bold text-slate-800 text-sm uppercase tracking-wide mb-1.5">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PROGRAM DETAILS cards */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Overview details</span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
            Program Parameters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { label: "Timeline Duration", value: "4 Months", extra: "Structured weekly modules" },
            { label: "Class Schedule", value: "Evening Classes (Mostly after 6:00 PM)", extra: "Timetable shared upon enrollment" },
            { label: "Instructor Pool", value: "Tech Leads & Senior Engineers", extra: "Practicing software engineers" },
            { label: "Skill Threshold", value: "Beginner to Intermediate", extra: "No coding background required" },
            { label: "Delivery Format", value: "Live Classes + Recorded Access", extra: "Flexible lifetime LMS access" },
            { label: "Support Language", value: "English / Hindi Support", extra: "Clear query explanations" },
            { label: "Learning Access", value: "Lifetime LMS Access", extra: "Access past batch recordings anytime" },
            { label: "Milestone Credentials", value: "Completion Certificate", extra: "BeyondSkills Program Certificate" }
          ].map((detail, idx) => (
            <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl space-y-2 hover:border-[#2563EB]/25 transition-all">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">{detail.label}</span>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-manrope">{detail.value}</p>
              <p className="text-[10px] text-slate-500">{detail.extra}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. TESTIMONIALS Placeholders only */}
      <section className="py-16 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Student Success</span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
              Cohort Success Stories
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              Below are placeholders representing student placement testimonials and hiring partner logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { name: "Rohan Sharma", role: "College Student", desc: "[ Testimonial Review Content Placeholder - Verified candidate narrative regarding assignments and coding support details will be logged here. ]" },
              { name: "Priya Patel", role: "Working Professional", desc: "[ Testimonial Review Content Placeholder - Verified candidate narrative regarding assignments and coding support details will be logged here. ]" },
              { name: "Amit Kumar", role: "Career Changer", desc: "[ Testimonial Review Content Placeholder - Verified candidate narrative regarding assignments and coding support details will be logged here. ]" }
            ].map((student, num) => (
              <div key={num} className="bg-white border border-slate-200/60 p-6 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-mono text-slate-400 text-xs font-bold">
                    P{num + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{student.name}</p>
                    <p className="text-[9px] text-slate-400">{student.role}</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-400 italic">
                    {student.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Hiring partners mockup section */}
          <div className="mt-12 border-t border-slate-200/60 pt-8 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-6 font-mono">Hiring Partner Placements</span>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-45">
              {["Google Cloud", "Microsoft", "AWS Cloud", "HubSpot", "Shopify"].map((p, idx) => (
                <span key={idx} className="font-extrabold text-slate-400 tracking-wider text-xs uppercase font-mono">
                  [ {p} Logo ]
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. ACCORDION FAQS */}
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

      {/* 11. FINAL CTA SECTION (SCROLLS TO TOP) */}
      <section className="py-20 bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded font-mono">
            Start Today
          </span>
          <h2 className="font-manrope font-extrabold text-[#0F172A] text-3xl sm:text-4xl">
            Start Building Real Software with BeyondSkills
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Register details at the top of the page to schedule a live training counseling session. Download the syllabus models and receive detailed briefs from academy mentors.
          </p>
          <div className="pt-4">
            <button 
              onClick={scrollToHeroForm}
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              Apply Now
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal max-w-sm mx-auto">
            Our team will contact you to explain the program, curriculum, fee structure and answer all your questions.
          </p>
        </div>
      </section>

      {/* Standalone Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative z-10 text-center">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-center space-x-1 group">
            <span className="logo-font font-extrabold tracking-tight text-white text-lg">
              Beyond
            </span>
            <span className="logo-font font-extrabold tracking-tight text-[#2563EB] text-lg">
              Skills
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Upskilling cohorts combining live mentorship and project assessments.
          </p>
          <div className="border-t border-white/5 pt-6 text-[10px] text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} BeyondSkills. All rights reserved.
          </div>
        </div>
      </footer>

      {/* 12. Floating WhatsApp button */}
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

      {/* 13. Sticky Mobile Apply CTA Bar */}
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
