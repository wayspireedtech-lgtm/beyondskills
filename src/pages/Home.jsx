import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Code, Megaphone, CheckCircle, Star, Users, Briefcase, Award, Sparkles, MessageSquare, Plus, Minus, Send, Play, Terminal } from 'lucide-react';
import TechIcon from '../components/TechIcon';
import { COURSES, MENTORS, STUDENT_TESTIMONIALS, CLIENT_TESTIMONIALS, getDbItem, setDbItem } from '../utils/mockDb';

export default function Home() {
  const [activeTab, setActiveTab] = useState('agency');
  const [faqOpen, setFaqOpen] = useState({});
  const navigate = useNavigate();

  // Form states
  const [agencyForm, setAgencyForm] = useState({ name: '', company: '', email: '', phone: '', service: 'Website Development', budget: '₹1,00,000 - ₹3,00,000', message: '' });
  const [academyForm, setAcademyForm] = useState({ name: '', email: '', phone: '', course: 'ai-ml-ds', college: '', status: 'Undergraduate Student', message: '' });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleAgencySubmit = (e) => {
    e.preventDefault();
    const leads = getDbItem('beyondskills_leads', []);
    const newLead = { type: 'Agency', ...agencyForm, date: new Date().toISOString() };
    leads.push(newLead);
    setDbItem('beyondskills_leads', leads);
    
    // Trigger simulated SLA toast
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Inquiry Logged: ${agencyForm.service}`,
        body: `Hello ${agencyForm.name},\n\nWe have recorded your consultation request for ${agencyForm.service}. A digital strategy advisor is preparing a baseline technical proposal. We will contact you at ${agencyForm.phone} shortly.\n\nBest,\nBeyondSkills Sales`
      }
    }));

    setSubmitStatus('agency_success');
    setAgencyForm({ name: '', company: '', email: '', phone: '', service: 'Website Development', budget: '₹1,00,000 - ₹3,00,000', message: '' });
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const handleAcademySubmit = (e) => {
    e.preventDefault();
    const leads = getDbItem('beyondskills_leads', []);
    const newLead = { type: 'Academy', ...academyForm, date: new Date().toISOString() };
    leads.push(newLead);
    setDbItem('beyondskills_leads', leads);

    // Trigger simulated SLA toast
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Admissions Callback Booked`,
        body: `Hello ${academyForm.name},\n\nThank you for choosing BeyondSkills Academy. We received your request regarding ${academyForm.course}. A program specialist is reviewing your background and will reach out shortly.\n\nWarm regards,\nBeyondSkills admissions team`
      }
    }));

    setSubmitStatus('academy_success');
    setAcademyForm({ name: '', email: '', phone: '', course: 'ai-ml-ds', college: '', status: 'Undergraduate Student', message: '' });
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const stats = [
    { value: '2022', label: 'Company Registered', icon: Award },
    { value: '10,000+', label: 'Learners Empowered', icon: Users },
    { value: '250+', label: 'Projects Delivered', icon: Briefcase },
    { value: '4.6 / 5', label: 'Learner Rating', icon: Star },
    { value: '50+', label: 'Expert Mentors', icon: Sparkles },
  ];

  const services = [
    {
      id: 'website-development',
      title: 'Website & Web Application Development',
      desc: 'High-performance React/Next.js portals, headless Shopify builds, custom CRM ecosystems, and robust cloud applications built to scale.',
      icon: Code,
      tech: ['React', 'Next.js', 'Node.js', 'AWS VPC', 'PostgreSQL']
    },
    {
      id: 'digital-marketing',
      title: 'Performance Brand Ads & Optimization',
      desc: 'Targeted lead-acquisition across Google & Meta. Implement Conversions API tracking for high ROI performance campaigns.',
      icon: Megaphone,
      tech: ['Google Ads', 'Meta Campaigns', 'GA4 Attribution', 'Server Tracking']
    }
  ];

  const homeFaqs = [
    { q: 'What is the background of BeyondSkills?', a: 'BeyondSkills was registered in 2022. We operate as a hybrid team, providing technical services to companies while training students through live mentorship.' },
    { q: 'Is there a placement guarantee?', a: 'No, we do not guarantee jobs, internships, salary packages, or interviews. Our programs focus entirely on practical coding skills, project reviews, and certifications.' },
    { q: 'Who teaches the certification programs?', a: 'Classes are guided by 50+ industry experts and mentors with 5+ years of active coding and marketing experience in top corporate brands.' },
    { q: 'How does onboarding work after course purchase?', a: 'Onboarding is fully automated. Within 5 minutes of completing Razorpay checkout, you get a welcome email, unique student ID, and live calendar links.' }
  ];

  const featuredCourses = COURSES.slice(0, 3);

  return (
    <div className="relative bg-white text-slate-900 overflow-hidden bg-grid-pattern min-h-screen">
      
      {/* Radiant Glow Blobs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] animate-pulse-glow z-0"></div>
      <div className="absolute top-[400px] right-1/4 w-[450px] h-[450px] bg-brand-blue/5 rounded-full blur-[100px] animate-pulse-glow z-0" style={{ animationDelay: '4s' }}></div>

      {/* 1. Hero Section */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 text-center">
        
        {/* Animated Glow Pill */}
        <span className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200/80 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-brand-purple mb-8 shadow-md shadow-brand-purple/5">
          <Sparkles className="w-4 h-4 animate-spin-slow text-brand-purple" />
          <span>Agency Vertical & Academic Certification Center</span>
        </span>
        
        {/* Heading */}
        <h1 className="logo-font text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15] max-w-6xl mx-auto uppercase">
          Building Solutions. <br />
          Empowering People. <br />
          <span className="bg-gradient-to-r from-brand-purple via-brand-blue to-brand-cyan bg-clip-text text-transparent">
            Creating Impact.
          </span>
        </h1>
        
        {/* Subhead / Tagline */}
        <h2 className="mt-6 text-base sm:text-xl font-bold tracking-wider text-brand-blue uppercase">
          Empowering Skills, Elevating Futures.
        </h2>
        
        {/* Description */}
        <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
          From delivering digital solutions that drive growth to empowering individuals with future-ready skills, 
          we've been on a journey to create real impact.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          <Link to="/courses" className="w-full sm:w-auto bg-gradient-to-r from-[#1B2A8A] to-[#2563EB] hover:brightness-110 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-brand-purple/20 hover:scale-[1.03] transition-all text-xs uppercase tracking-widest">
            Browse Academy Programs
          </Link>
          <a href="#contact-forms" className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold px-8 py-4 rounded-xl hover:scale-[1.03] transition-all text-xs uppercase tracking-widest">
            Partner with Our Agency
          </a>
        </div>

        {/* Legal Placement Disclaimer Header inside Hero Section */}
        <p className="mt-8 text-[10px] text-slate-500 max-w-xl mx-auto leading-relaxed">
          *<strong>Educational Notice:</strong> BeyondSkills does not guarantee jobs, placements, internships, salary packages, or corporate interviews. Learners are responsible for their own employment search.
        </p>
      </section>

      {/* 2. Infinite Scrolling Logo Bar */}
      <div className="w-full bg-slate-100 border-y border-slate-200 py-8 overflow-hidden relative z-10">
        <div className="flex w-[200%] animate-infinite-scroll items-center justify-around space-x-12">
          {['Google Cloud Partner', 'Meta Ads Agency Partner', 'AWS Cloud Architect', 'Microsoft Hub Member', 'Razorpay Integrated Gateway', 'HubSpot Partner', 'Vercel Partner System', 'Shopify Experts Team'].map((partner, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-slate-500 font-mono text-[10px] uppercase tracking-widest select-none">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              <span>{partner}</span>
            </div>
          ))}
          {/* Duplicate for infinite loop */}
          {['Google Cloud Partner', 'Meta Ads Agency Partner', 'AWS Cloud Architect', 'Microsoft Hub Member', 'Razorpay Integrated Gateway', 'HubSpot Partner', 'Vercel Partner System', 'Shopify Experts Team'].map((partner, idx) => (
            <div key={`dup-${idx}`} className="flex items-center space-x-2 text-slate-500 font-mono text-[10px] uppercase tracking-widest select-none">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              <span>{partner}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Company Highlights Metrics */}
      <section className="relative py-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div key={idx} className="text-center p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm">
                  <div className="flex justify-center text-brand-purple mb-3">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{stat.value}</p>
                  <p className="text-[10px] text-slate-500 mt-2 font-bold tracking-wider uppercase">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Ecosystem Section from Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-t border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-cyan uppercase border border-brand-cyan/30 px-3 py-1 rounded bg-brand-cyan/5">
            Core Ecosystem
          </span>
          <h2 className="logo-font text-3xl sm:text-4xl font-bold text-slate-900 mt-4 mb-4">
            Unified Digital Services & Academy
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Providing end-to-end digital solutions for businesses while running industry-focused practical upskilling programs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { title: 'AI-Powered Learning', desc: 'Next-gen cognitive training', icon: Sparkles },
            { title: 'Web Development Solutions', desc: 'Custom enterprise software', icon: Code },
            { title: 'Digital Marketing Services', desc: 'Performance ads & optimization', icon: Megaphone },
            { title: 'Industry Focused Upskilling', desc: 'Practical projects & mentorship', icon: Users },
            { title: 'Professional Certifications', desc: 'Verified secure credentials', icon: Award },
            { title: 'Corporate Training & Transformation', desc: 'Team scaling & consulting', icon: Briefcase }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group hover:border-brand-purple/40">
                <div className="bg-brand-purple/10 border border-brand-purple/20 p-3 rounded-xl text-brand-purple mb-4 group-hover:bg-brand-purple/20 transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2 leading-tight h-8 flex items-center justify-center">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Agency Verticals Summary */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-purple uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5">
            Enterprise Solutions
          </span>
          <h2 className="logo-font text-3xl sm:text-4xl font-bold text-slate-900 mt-4 mb-4">
            Digital Transformation Agency
          </h2>
          <p className="text-slate-500 text-sm">
            We architect clean software and design conversion-first performance marketing systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((svc) => (
            <div key={svc.id} className="glass-card p-8 rounded-2xl flex flex-col justify-between relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-2xl group-hover:bg-brand-purple/10 transition-colors"></div>
              
              <div>
                <div className="bg-brand-purple/10 border border-brand-purple/20 p-4 rounded-xl w-14 h-14 flex items-center justify-center text-brand-purple mb-6">
                  <svc.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{svc.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{svc.desc}</p>
              </div>
              
              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {svc.tech.map((t, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 border border-slate-200 px-2.5 py-1 rounded text-slate-700 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
                <Link to={`/services/${svc.id}`} className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-brand-purple hover:text-slate-900 transition-colors">
                  <span>Explore Process & Outcomes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Academy Verticals / Courses Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 bg-slate-50 rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-purple text-xs font-bold tracking-widest uppercase bg-brand-purple/10 px-3 py-1 rounded-full">
            Upskilling Programs
          </span>
          <h2 className="logo-font text-3xl sm:text-4xl font-bold text-slate-900 mt-4 mb-4">
            Professional Certification Catalog
          </h2>
          <p className="text-slate-500 text-sm">
            Basic to Intermediate certification courses combining recorded lectures with weekly live mentor reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div key={course.id} className="bg-white border border-slate-200/80 shadow-sm border border-slate-200/60 hover:border-brand-purple/30 p-6 rounded-2xl flex flex-col justify-between transition-all hover:scale-[1.01] glass-card">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-bold text-brand-purple uppercase border border-brand-purple/30 px-2.5 py-0.5 rounded bg-brand-purple/5">
                    {course.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {course.duration}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 line-clamp-2 h-12 leading-tight">{course.title}</h3>
                <p className="text-xs text-slate-500 mb-6 line-clamp-3 leading-relaxed">{course.overview}
                </p>
                
                {/* Tech Stack Badges */}
                {course.techStack && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {course.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-[10px] text-slate-700 font-medium">
                        <TechIcon name={tech} className="w-3.5 h-3.5" />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-1 mb-4 text-brand-cyan">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold text-slate-900">{course.rating}</span>
                  <span className="text-[10px] text-slate-500">({course.enrollments} learners)</span>
                </div>
                
                <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Syllabus Fee</span>
                    <span className="text-base font-bold text-slate-900">₹{course.fee.toLocaleString()}</span>
                  </div>
                  <Link to={`/courses?id=${course.id}`} className="bg-brand-purple hover:bg-brand-purple/90 text-black font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors">
                    View Syllabus
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/courses" className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-brand-purple hover:text-slate-900 transition-colors">
            <span>Browse All 7 Academic Programs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. Key Value Propositions (Why Choose Us) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-purple text-xs font-bold tracking-widest uppercase">
              The BeyondSkills Difference
            </span>
            <h2 className="logo-font text-3xl sm:text-4xl font-bold text-slate-900 mt-4 mb-6">
              Practical, Project-Driven Learning Systems
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              We bridge the gap between academic theory and active corporate pipelines. Learn from active web programmers and marketers running live client systems in Noida.
            </p>

            <div className="space-y-4">
              {[
                'Dual Model: High-quality Recorded + Weekly Live Mentor Sessions',
                'Instructed by 50+ Mentors with 5+ Years Industry Experience',
                'Internship Completion Certificate upon passing project metrics',
                'Detailed Resume Evaluations by corporate recruitment teams',
                'Instant Student ID and automated workspace provisioning'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-slate-200 relative">
            <div className="absolute -top-4 -left-4 bg-brand-purple text-black font-extrabold uppercase px-3 py-1 rounded text-[9px] tracking-wider">
              Resume Services
            </div>
            
            <h4 className="text-lg font-bold text-slate-900 mb-4">Resume Evaluations & ATS Screening</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Academy students receive detailed resume reviews. Industry recruitment specialists analyze your code layout, project presentation, and align formatting with ATS algorithms.
            </p>
            
            <div className="bg-slate-100 border border-slate-200/60 rounded-xl p-4 flex items-center space-x-3">
              <Star className="w-8 h-8 text-brand-cyan flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">4.6 / 5 Score Rating</p>
                <p className="text-[10px] text-slate-500">Calculated average student reviews across 10,000+ graduates since 2022.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="logo-font text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Alumni Success Stories & Client Reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xs font-bold text-brand-purple tracking-widest uppercase mb-6 pl-2 border-l-2 border-brand-purple">
              Academy Graduates
            </h4>
            <div className="space-y-6">
              {STUDENT_TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="bg-slate-100 border border-slate-200/60 p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-brand-purple/5 rounded-full blur-xl"></div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-[10px] text-slate-500">{t.course} • Hired at {t.company}</p>
                    </div>
                    <div className="flex text-brand-cyan">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-brand-purple tracking-widest uppercase mb-6 pl-2 border-l-2 border-brand-purple">
              Agency Clients
            </h4>
            <div className="space-y-6">
              {CLIENT_TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="bg-slate-100 border border-slate-200/60 p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-brand-purple/5 rounded-full blur-xl"></div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.client}</p>
                      <p className="text-[10px] text-slate-500">{t.company}</p>
                    </div>
                    <div className="flex text-brand-cyan">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Contact & Lead Generation Forms */}
      <section id="contact-forms" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10 border-t border-slate-200">
        
        <div className="text-center mb-12">
          <h2 className="logo-font text-3xl font-bold text-slate-900 mb-2">Get In Touch</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            Automatic email acknowledgments dispatch within 5 minutes SLA.
          </p>
        </div>

        {/* Tab Headers */}
        <div className="flex justify-center space-x-4 mb-8">
          <button onClick={() => { setActiveTab('agency'); setSubmitStatus(null); }} className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'agency' ? 'bg-brand-purple text-black font-semibold' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'}`}>
            Hire Our Agency
          </button>
          <button onClick={() => { setActiveTab('academy'); setSubmitStatus(null); }} className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'academy' ? 'bg-brand-purple text-black font-semibold' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'}`}>
            Ask Academy Advisors
          </button>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-slate-200 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-3xl"></div>

          {submitStatus === 'agency_success' && (
            <div className="bg-brand-purple/15 border border-brand-purple/30 text-slate-900 p-4 rounded-xl mb-6 text-xs sm:text-sm">
              🚀 Agency Request Logged! A mock client receipt confirmation has been dispatched to your email.
            </div>
          )}
          
          {submitStatus === 'academy_success' && (
            <div className="bg-brand-purple/15 border border-brand-purple/30 text-slate-900 p-4 rounded-xl mb-6 text-xs sm:text-sm">
              📚 Academic Request Logged! Check your active mock alerts box for admissions receipt details.
            </div>
          )}

          {activeTab === 'agency' ? (
            /* Agency Form */
            <form onSubmit={handleAgencySubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Name *</label>
                  <input type="text" required value={agencyForm.name} onChange={(e) => setAgencyForm({...agencyForm, name: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="Enter full name" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Company Name *</label>
                  <input type="text" required value={agencyForm.company} onChange={(e) => setAgencyForm({...agencyForm, company: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="Enter company name" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address *</label>
                  <input type="email" required value={agencyForm.email} onChange={(e) => setAgencyForm({...agencyForm, email: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="name@company.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone Number *</label>
                  <input type="tel" required value={agencyForm.phone} onChange={(e) => setAgencyForm({...agencyForm, phone: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Service Required *</label>
                  <select value={agencyForm.service} onChange={(e) => setAgencyForm({...agencyForm, service: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all">
                    <option value="Website Development">Website Development</option>
                    <option value="Custom Web Applications">Custom Web Applications</option>
                    <option value="Google & Meta Ads - Performance Marketing">Google & Meta Ads - Performance Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Estimated Budget *</label>
                  <select value={agencyForm.budget} onChange={(e) => setAgencyForm({...agencyForm, budget: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all">
                    <option value="₹1,00,000 - ₹3,00,000">₹1,00,000 - ₹3,00,000</option>
                    <option value="₹3,00,000 - ₹5,00,000">₹3,00,000 - ₹5,00,000</option>
                    <option value="₹5,00,000+">₹5,00,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Project Brief / Message</label>
                <textarea rows={4} value={agencyForm.message} onChange={(e) => setAgencyForm({...agencyForm, message: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="Scope, features, design inputs, timelines..."></textarea>
              </div>

              <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Submit Agency Inquiry</span>
              </button>
            </form>
          ) : (
            /* Academy Form */
            <form onSubmit={handleAcademySubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Name *</label>
                  <input type="text" required value={academyForm.name} onChange={(e) => setAcademyForm({...academyForm, name: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="Enter full name" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address *</label>
                  <input type="email" required value={academyForm.email} onChange={(e) => setAcademyForm({...academyForm, email: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="johndoe@gmail.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone Number *</label>
                  <input type="tel" required value={academyForm.phone} onChange={(e) => setAcademyForm({...academyForm, phone: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Course of Interest *</label>
                  <select value={academyForm.course} onChange={(e) => setAcademyForm({...academyForm, course: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all">
                    {COURSES.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">College / Organization Name *</label>
                  <input type="text" required value={academyForm.college} onChange={(e) => setAcademyForm({...academyForm, college: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="Enter college/organization name" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Current Status *</label>
                  <select value={academyForm.status} onChange={(e) => setAcademyForm({...academyForm, status: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all">
                    <option value="Undergraduate Student">Undergraduate Student</option>
                    <option value="Postgraduate Student">Postgraduate Student</option>
                    <option value="Recent Graduate">Recent Graduate</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Career Switcher">Career Switcher</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message</label>
                <textarea rows={4} value={academyForm.message} onChange={(e) => setAcademyForm({...academyForm, message: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="Any doubts or questions about recorded schedules, reviews, or materials..."></textarea>
              </div>

              <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Submit Academy Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 9. FAQs Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10 border-t border-slate-200">
        
        <div className="text-center mb-16">
          <h2 className="logo-font text-3xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Learn more about our verticals & academy guidelines.</p>
        </div>

        <div className="space-y-4">
          {homeFaqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl bg-slate-100 overflow-hidden">
              <button onClick={() => toggleFaq(idx)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none transition-colors hover:bg-slate-100">
                <span className="font-bold text-slate-900 text-sm sm:text-base">{faq.q}</span>
                {faqOpen[idx] ? <Minus className="w-5 h-5 text-brand-purple flex-shrink-0" /> : <Plus className="w-5 h-5 text-brand-purple flex-shrink-0" />}
              </button>
              {faqOpen[idx] && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-200/60 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
