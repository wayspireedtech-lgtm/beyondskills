import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDbItem, setDbItem, COURSES, MENTORS } from '../utils/mockDb';
import { 
  Sparkles, CheckCircle, ChevronDown, ChevronUp, BookOpen, Clock, 
  MapPin, ShieldAlert, Award, Star, ArrowRight, User, GraduationCap, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CustomLandingPage() {
  const { slug } = useParams();
  const [lp, setLp] = useState(null);
  const [course, setCourse] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: 'Undergraduate',
    experience: 'Beginner - No Coding',
    goal: 'Land a Tech Job',
    contactTime: ''
  });
  const [status, setStatus] = useState(null);
  const [faqOpen, setFaqOpen] = useState({});

  useEffect(() => {
    // Load dynamic landing pages config
    const landingPages = getDbItem('beyondskills_landing_pages', []);
    let matchedLp = landingPages.find(p => p.slug === slug);
    
    // Fallback seed if nothing matches
    if (!matchedLp && slug === 'full-stack-web-development') {
      matchedLp = {
        slug: 'full-stack-web-development',
        courseId: 'full-stack-web',
        heroHeadline: 'Become a Full Stack Web Developer. Live.',
        heroSubheadline: 'A comprehensive, structured 4-month developer cohort. Master HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB under the guidance of active software engineers.',
        ctaText: 'Apply For Cohort',
        highlights: [
          'Beginner Friendly',
          'Live Mentor Sessions',
          'Real Projects',
          'Interview Preparation',
          '1 Year LMS Access'
        ],
        faqs: [
          { q: 'Who is this program for?', a: 'This program is designed for college students, fresh graduates, beginners, and working professionals looking to transition into web development. No prior coding experience is required.' },
          { q: 'How are classes conducted?', a: 'Live sessions are conducted mostly in the evening after 6:00 PM. A comprehensive cohort schedule is provided to students upon enrollment.' }
        ]
      };
    }

    if (matchedLp) {
      setLp(matchedLp);
      const matchedCourse = COURSES.find(c => c.id === matchedLp.courseId);
      setCourse(matchedCourse);

      // Set dynamic SEO tags
      document.title = `${matchedLp.heroHeadline} | BeyondSkills`;
    }
  }, [slug]);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) return;

    const leads = getDbItem('beyondskills_leads', []);
    const newLead = {
      id: `LD${String(leads.length + 101).padStart(3, '0')}`,
      type: 'Academy',
      name: enquiryForm.name,
      email: enquiryForm.email || 'no-email@beyondskills.com',
      phone: enquiryForm.phone,
      college: enquiryForm.qualification, 
      status: enquiryForm.experience, 
      message: `Goal: ${enquiryForm.goal} • Contact: ${enquiryForm.contactTime || 'Not Specified'}`,
      campaign: 'Dynamic LP',
      source: `lp/${slug}`,
      utmMedium: 'Dynamic Landing Page',
      utmCampaign: slug,
      utmContent: 'Ad Variant 1',
      leadStatus: 'New Lead',
      remarks: `Submitted via Custom Landing Page: ${slug}`,
      date: new Date().toISOString()
    };
    leads.push(newLead);
    setDbItem('beyondskills_leads', leads);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });

    // Alert toast
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Enquiry Received: ${enquiryForm.name}`,
        body: `Dear ${enquiryForm.name},\n\nWe have received your enquiry for the ${course?.title || 'program'}. Our academic BDA advisor will connect with you soon.`
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

  const scrollToHeroForm = () => {
    const el = document.getElementById('hero-application-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!lp) {
    return (
      <div className="text-slate-900 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Landing Page Configuration Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">Create this slug config in the Admin Panel to active it.</p>
        <Link to="/" className="bg-brand-purple text-white font-bold px-6 py-2 rounded-lg text-xs uppercase">
          Go Home
        </Link>
      </div>
    );
  }

  // Load global dynamic mentors
  const dynamicMentors = getDbItem('beyondskills_mentors', MENTORS);

  return (
    <div className="text-slate-900 min-h-screen relative pt-10 pb-24 bg-white">
      {/* Spotlight blur */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        
        {/* Dynamic Navigation Mini Header */}
        <header className="flex justify-between items-center py-6 border-b border-slate-100 mb-12">
          <Link to="/" className="flex items-center">
            <span className="logo-font text-2.5xl font-extrabold text-[#0A0E35]">Beyond</span>
            <span className="logo-font text-2.5xl font-extrabold bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] bg-clip-text text-transparent">Skills</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono hidden md:inline">Live Online Cohort</span>
            <button 
              onClick={scrollToHeroForm}
              className="bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-md"
            >
              {lp.ctaText || 'Apply Now'}
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6 mb-20">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-brand-purple/10 border border-brand-purple/20 px-3.5 py-1 rounded-full text-brand-purple text-xs font-bold uppercase tracking-widest w-fit flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Next Cohort Starting Soon</span>
            </div>
            <h1 className="logo-font text-4xl sm:text-5.5xl font-extrabold text-slate-900 leading-tight">
              {lp.heroHeadline}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {lp.heroSubheadline}
            </p>

            {/* Highlights bullet checks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {(lp.highlights || []).map((highlight, idx) => (
                <div key={idx} className="flex items-center space-x-2.5">
                  <div className="bg-[#4ADE80]/15 text-[#4ADE80] rounded-full p-1 border border-[#4ADE80]/25">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Course Meta Info */}
            {course && (
              <div className="grid grid-cols-3 gap-6 bg-slate-50 border border-slate-100 rounded-2xl p-5 mt-8 text-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-mono">Duration</span>
                  <span className="text-sm font-bold text-slate-800 block mt-1">{course.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-mono">Format</span>
                  <span className="text-sm font-bold text-slate-800 block mt-1">{course.delivery}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-mono">LMS Access</span>
                  <span className="text-sm font-bold text-slate-800 block mt-1">1 Year</span>
                </div>
              </div>
            )}
          </div>

          {/* Hero Right Enquiry Form */}
          <div className="lg:col-span-5">
            <div 
              id="hero-application-form" 
              className="bg-white border-2 border-[#2A4BFF]/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative transition-all duration-300"
            >
              <div className="space-y-1 text-center">
                <span className="text-[9px] font-bold text-[#2A4BFF] uppercase tracking-widest font-mono">Direct Admissions Query</span>
                <h3 className="text-lg font-bold text-slate-900">Enquire for Cohort Entry</h3>
                <p className="text-[11px] text-slate-500">Fill out details below to align your class credentials with a mentor.</p>
              </div>

              {status === 'success' ? (
                <div className="bg-[#4ADE80]/15 border border-[#4ADE80]/20 rounded-2xl p-6 text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-[#4ADE80] mx-auto animate-bounce" />
                  <h4 className="font-bold text-slate-900 text-sm">Application Sent!</h4>
                  <p className="text-xs text-slate-500 leading-normal">
                    Your details are recorded in our admissions lead roster. Our advisor BDA will call you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Your Full Name</label>
                    <input 
                      type="text" required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#2A4BFF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Email Address</label>
                      <input 
                        type="email" required
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="e.g. rahul@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#2A4BFF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">WhatsApp Phone Number</label>
                      <input 
                        type="tel" required
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="10-digit number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#2A4BFF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Current Qualification</label>
                    <select 
                      value={enquiryForm.qualification}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, qualification: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#2A4BFF] cursor-pointer"
                    >
                      <option value="Undergraduate">College Student (Undergraduate)</option>
                      <option value="Postgraduate">Postgraduate Student</option>
                      <option value="Fresh Graduate">Fresh Graduate (Looking for Job)</option>
                      <option value="Working Professional">Working Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Prior Programming Experience</label>
                    <select 
                      value={enquiryForm.experience}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, experience: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#2A4BFF] cursor-pointer"
                    >
                      <option value="Beginner - No Coding">Beginner (No coding experience)</option>
                      <option value="Basic Syntax Level">Basic (Know simple HTML/CSS or Python syntax)</option>
                      <option value="Intermediate Developer">Intermediate (Can build simple programs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Admissions Call Time Window</label>
                    <select 
                      value={enquiryForm.contactTime}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, contactTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#2A4BFF] cursor-pointer"
                    >
                      <option value="">Anytime between 10am to 8pm</option>
                      <option value="Morning 10am - 1pm">Morning (10:00 AM - 01:00 PM)</option>
                      <option value="Afternoon 1pm - 5pm">Afternoon (01:00 PM - 05:00 PM)</option>
                      <option value="Evening 5pm - 8pm">Evening (05:00 PM - 08:00 PM)</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                  >
                    Submit Admissions Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* CURRICULUM SECTION */}
        {course && course.syllabus && (
          <section className="py-16 border-t border-slate-100">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#2A4BFF] uppercase tracking-widest font-mono">Syllabus Breakdown</span>
              <h2 className="logo-font text-3xl font-extrabold text-slate-900 mt-2">What You Will Master</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Step-by-step practical modules designed by industry engineers to build actual code projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {course.syllabus.map((module, idx) => (
                <div key={idx} className="bg-slate-50/70 border border-slate-100 rounded-2xl p-6 space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-[#2A4BFF]/10 text-[#2A4BFF] flex items-center justify-center font-bold text-xs font-mono">{idx + 1}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{module.week || `Module ${idx + 1}`}</h4>
                  </div>
                  <h5 className="font-bold text-slate-700 text-xs pl-9">{module.title}</h5>
                  <p className="text-[11px] text-slate-500 leading-normal pl-9">{module.description || module.topics?.join(', ')}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LEADERSHIP & ADVISORY MENTORS */}
        <section className="py-16 border-t border-slate-100">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#2A4BFF] uppercase tracking-widest font-mono">Team Leaders & Advisors</span>
            <h2 className="logo-font text-3xl font-extrabold text-slate-900 mt-2">Learn Under Active Specialists</h2>
            <p className="text-xs text-slate-500 mt-2">Get regular feedback, code reviews, and structured live instruction.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {dynamicMentors.map((m, idx) => (
              <div key={idx} className="text-center bg-slate-50/50 border border-slate-100 rounded-2xl p-5 shadow-sm">
                <img src={m.image} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border border-slate-200" />
                <h4 className="font-bold text-slate-900 text-xs">{m.name}</h4>
                <p className="text-[10px] text-brand-purple font-medium mt-0.5">{m.role}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{m.org} • {m.exp} Exp</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQS SECTION */}
        {lp.faqs && lp.faqs.length > 0 && (
          <section className="py-16 border-t border-slate-100 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#2A4BFF] uppercase tracking-widest font-mono">Cohort Helpdesk</span>
              <h2 className="logo-font text-3xl font-extrabold text-slate-900 mt-2">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {lp.faqs.map((faq, idx) => {
                const isOpen = faqOpen[idx];
                return (
                  <div key={idx} className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50/30">
                    <button 
                      onClick={() => setFaqOpen({ ...faqOpen, [idx]: !isOpen })}
                      className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-900 text-xs sm:text-sm focus:outline-none hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-brand-purple" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* BOTTOM LEGAL DISCLAIMER */}
        <footer className="mt-20 pt-8 border-t border-slate-100 text-center text-[10px] text-slate-400 space-y-2">
          <p className="max-w-4xl mx-auto leading-relaxed uppercase tracking-wider font-mono font-bold text-slate-500">
            Mandatory Compliance Disclaimer: No Job or Placement Guarantee
          </p>
          <p className="max-w-4xl mx-auto leading-relaxed">
            BeyondSkills operates as an educational provider delivering structured cohorts, curriculum resources, skills certificates, and industry mentors support. <strong>We do not guarantee jobs, internship offers, placement interviews, or salary packages.</strong> Enrollment is governed by standard academic codes. Learners remain fully responsible for their own employment applications.
          </p>
          <p className="pt-6">© {new Date().getFullYear()} BeyondSkills Academy. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
}
