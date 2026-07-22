import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Target, BarChart2, Award, Users, CheckCircle, ArrowRight, Check, 
  ChevronRight, Calendar, Sparkles, Phone, Mail, Globe, Star, Briefcase, Zap, 
  HelpCircle, ChevronDown, ChevronUp, Download, MessageCircle, Layout, 
  Search, ShieldCheck, TrendingUp, RefreshCw, Send, FileText, Link as LinkIcon
} from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/dbHelpers';
import { saveLeadToSupabase } from '../utils/supabaseClient';
import { validateEmail, validatePhone } from '../utils/validationHelpers';
import wiproLogo from '../assets/wipro.svg';
import tcsLogo from '../assets/tcs.svg';
import infosysLogo from '../assets/infosys.svg';
import cognizantLogo from '../assets/cognizant.svg';
import accentureLogo from '../assets/accenture.svg';

const OUTCOMES = [
  { title: "Understand Brand Strategy", desc: "Build online presence, define color palettes, and create compelling storytelling campaigns that resonate with users." },
  { title: "Master Keyword Analysis", desc: "Perform advanced on-page, off-page, and technical SEO audits using real-world analytics dashboards." },
  { title: "Launch Paid PPC Campaigns", desc: "Create search, display, and video campaigns inside Google Ads and Meta Ads Manager with optimized bidding strategies." },
  { title: "Configure Event Tracking", desc: "Set up Google Analytics (GA4), track conversion metrics, analyze funnel dropoffs, and build executive reporting dashboards." },
  { title: "Configure Email Automations", desc: "Build lists, write subject lines, and schedule automated drip campaigns using professional tools like Mailchimp." }
];

const CURRICULUM = [
  {
    week: "Module 1",
    title: "Introduction to Digital Marketing",
    subtopic: "Understanding the Digital Landscape, Key Concepts, and Emerging Trends",
    details: [
      "Digital Marketing Fundamentals: Understanding the Core Concepts and Scope of Digital Marketing",
      "Purpose and Goals of Marketing: Driving Brand Awareness, Engagement, and Conversions",
      "Market Segmentation & 4Ps of Marketing: Targeting, Positioning, Product, Price, Place, and Promotion Strategies",
      "Marketing Funnel & Customer Journey: From Awareness to Conversion and Retention, Mapping Effective Campaigns"
    ]
  },
  {
    week: "Module 2",
    title: "Interactive Sessions for Doubts & Discussions",
    subtopic: "Engaging Learners and Resolving Queries in Real-Time",
    details: [
      "Interactive Doubt-Clearing Sessions: Dedicated sessions to address course-related questions, encourage discussions, and enhance practical understanding."
    ]
  },
  {
    week: "Module 3",
    title: "Digital Branding & Website Development",
    subtopic: "Creating Strong Online Brand Identity and Optimized Websites",
    details: [
      "Fundamentals of Branding: Understanding Brand Strategy and Its Importance in the Digital Era",
      "Building a Strong Brand Identity: Logo, Visual Identity, Color Palette, and Brand Voice",
      "Establishing an Online Presence: Leveraging Social Media, Websites, and Digital Touchpoints",
      "Storytelling in Digital Branding: Crafting Engaging Narratives to Connect with Your Audience",
      "Domain & Hosting Essentials: Choosing, Registering, and Managing Your Domain and Web Hosting",
      "WordPress Website Development: Building Responsive, SEO-Friendly, and Professional Websites Using WordPress"
    ]
  },
  {
    week: "Module 4",
    title: "Keyword Research & SEO Strategy",
    subtopic: "Effective Keyword Analysis, On-Page and Off-Page SEO Techniques",
    details: [
      "Keyword Research & Types: Understanding Short-Tail, Long-Tail, and Intent-Based Keywords using Modern SEO Tools",
      "Competitive Analysis: Analyzing Competitor Strategies, Keywords, and Market Positioning",
      "Keyword Mapping: Strategically Assigning Keywords to Content and Pages for Better SEO Performance"
    ]
  },
  {
    week: "Module 5",
    title: "SEO Auditing & Technical Optimization",
    subtopic: "Effective Keyword Analysis, On-Page and Off-Page SEO Techniques (Cont.)",
    details: [
      "How Search Engines Work: Crawling, Indexing, Ranking, and Search Intent Optimization",
      "On-Page SEO: Content Optimization, Meta Tags, Internal Linking, and Keyword Placement",
      "Technical SEO: Site Speed, Core Web Vitals, Indexing, Crawlability, and Structured Data",
      "Off-Page SEO: Link Building, Backlinks Strategy, and Authority Building",
      "Mobile & Local SEO: Mobile-First Optimization and Local Search Strategies (Google Business Profile)",
      "Google Algorithms & SEO Practices: Updates, Guidelines, and Avoiding Black Hat SEO Techniques",
      "Case Studies: Real-World SEO Strategies, Analysis, and Performance Insights"
    ]
  },
  {
    week: "Module 6",
    title: "Course Doubt-Clearing & Discussion Sessions",
    subtopic: "Mid-Term Review & Milestone Evaluation",
    details: [
      "Regular sessions will be held to resolve course-related doubts and facilitate interactive discussions."
    ]
  },
  {
    week: "Module 7",
    title: "Paid Advertising & PPC Campaigns",
    subtopic: "Google Ads, Social Media Ads, and Performance Optimization",
    details: [
      "Introduction to Google Ads: Overview of PPC Advertising and Platform Fundamentals",
      "Types of Ad Campaigns: Search, Display, Video, Shopping, and Performance Max Campaigns",
      "Ad Campaign Creation: Setting Up Campaigns, Targeting, Ad Copy, and Creative Strategy",
      "Optimization & Reporting: Performance Tracking, A/B Testing, and Data-Driven Improvements",
      "Bidding Strategies & Key Terminologies: CPC, CPA, ROAS, Smart Bidding, and Budget Optimization",
      "Case Studies: Real-World Campaign Analysis and Performance Insights"
    ]
  },
  {
    week: "Module 8",
    title: "Analytics & Data-Driven Insights",
    subtopic: "Using Google Analytics, Conversion Tracking, and Traffic Analysis",
    details: [
      "Analytics Setup: Configuring Google Analytics (GA4), Tracking Codes, and Event Tracking",
      "Key Metrics & KPIs: Traffic, Engagement, Conversion Rate, ROI, and User Behavior Analysis",
      "Advanced Analytics Techniques: Funnel Analysis, Cohort Analysis, Attribution Models, and Predictive Insights",
      "Custom Reports & Dashboards: Creating Interactive Dashboards for Data Visualization and Decision-Making"
    ]
  },
  {
    week: "Module 9",
    title: "Social Media Optimization (SMO) & SMM",
    subtopic: "Leveraging Platforms to Boost Engagement and Leads",
    details: [
      "Profile Creation & Optimization: Building Professional, SEO-Optimized Social Media Profiles Across Platforms",
      "Hashtag & Discoverability Strategies: Using Trending, Niche, and AI-Driven Hashtag Research for Better Reach",
      "Content Planning & Calendar: Designing Consistent, Data-Driven Content Strategies and Scheduling",
      "Social Media Trends: Short-Form Video, Influencer Marketing, AI Content, and Platform-Specific Trends",
      "Analytics & Performance Measurement: Tracking Engagement, Reach, Conversions, and Campaign Effectiveness"
    ]
  },
  {
    week: "Module 10",
    title: "Social Media Marketing for Businesses",
    subtopic: "Leads Generation & Brand Growth Campaigns",
    details: [
      "Social Media Marketing for Businesses: Building Brand Presence, Engagement, and Lead Generation Strategies",
      "Facebook & Instagram Marketing: Platform Strategies, Content Planning, and Audience Targeting",
      "Types of Facebook/Meta Ads: Image, Video, Carousel, Lead Generation, and Performance-Based Campaigns",
      "Influencer Marketing: Collaboration Strategies, Creator Partnerships, and ROI Measurement",
      "Campaign Measurement & Optimization: Tracking Performance, A/B Testing, and Data-Driven Campaign Improvements"
    ]
  },
  {
    week: "Module 11",
    title: "Email Marketing & Automation",
    subtopic: "Campaign Planning, Segmentation, and ROI Tracking",
    details: [
      "Types of Email Marketing Campaigns: Newsletters, Promotional, Drip Campaigns, Transactional, and Automation-Based Emails",
      "Email List Building: Lead Generation Strategies, Opt-ins, Segmentation, and Audience Targeting",
      "Email Content Creation: Writing Engaging Subject Lines, Personalization, and Conversion-Focused Content",
      "Email Marketing Tools: Platforms like Mailchimp, HubSpot, and Automation Tools for Campaign Management",
      "Analytics & Reporting: Tracking Open Rate, Click-Through Rate (CTR), Conversions, and Campaign Performance Optimization"
    ]
  },
  {
    week: "Module 12",
    title: "Affiliate Marketing Strategies",
    subtopic: "Monetization, Platforms, and Performance Monitoring",
    details: [
      "Affiliate Marketing Models: CPA, CPC, CPL, Revenue Sharing, and Performance-Based Strategies",
      "Affiliate Networks & Platforms: Overview of Popular Networks and Partner Ecosystems",
      "Performance Tracking & Analytics: Monitoring Conversions, ROI, Attribution, and Campaign Optimization"
    ]
  },
  {
    week: "Module 13",
    title: "Online Reputation Management (ORM)",
    subtopic: "Building and Maintaining a Positive Digital Presence",
    details: [
      "Fundamentals of Online Reputation Management (ORM): Understanding Brand Perception and Digital Presence",
      "Building a Strong Online Presence: Strategies for Brand Visibility, Trust, and Audience Engagement",
      "Monitoring Tools & Techniques: Tracking Online Mentions, Reviews, and Sentiment using Modern Tools"
    ]
  },
  {
    week: "Module 14",
    title: "Content Marketing & Strategy",
    subtopic: "Creating, Distributing, and Optimizing Content for Maximum Impact",
    details: [
      "Content Planning & Strategy: Audience Research, Content Pillars, and Data-Driven Planning",
      "Blog Creation: SEO-Optimized Writing, Formatting, and Publishing Best Practices",
      "Content Creation & Distribution: Multi-Channel Content Strategy across Blogs, Social Media, and Email",
      "Content Marketing Tools: Using Tools for Research, Creation, Scheduling, and Optimization",
      "Case Studies: Real-World Content Strategies, Performance Analysis, and Success Stories"
    ]
  },
  {
    week: "Module 15",
    title: "Project Work & Career Guidance",
    subtopic: "Hands-On Projects, Q&A Sessions, and Industry-Relevant Career Insights",
    details: [
      "Project Overview & Requirement Analysis: Defining Scope, Objectives, and Implementation Strategy",
      "Project Review & Feedback Sessions: Continuous Evaluation and Iterative Improvements",
      "Ongoing Doubt Resolution & Mentorship Support: Ensuring Concept Clarity and Guidance",
      "Concept Revision & Interactive Q&A Sessions: Reinforcing Learning Outcomes",
      "Industry Use Cases & Real-World Applications: Practical Insights and Case Study Discussions",
      "Career Opportunities in Digital Marketing & Emerging Domains",
      "Job Roles, Career Pathways & Industry Trends",
      "Key Skills, Tools & Competencies for Industry Readiness"
    ]
  }
];

const SAMPLE_PROJECTS = [
  {
    title: "WordPress Branding Website",
    desc: "Design and customize a professional business website on WordPress featuring responsive landing sections, custom domains, and SEO setup.",
    tech: ["WordPress", "Domain/Hosting", "Branding Design"],
    learn: "Establishing an online presence and deploying clean WordPress pages."
  },
  {
    title: "Google Search Campaign Architecture",
    desc: "Build a Google search campaign targeting intent-based keywords, writing visual ad copies, and choosing optimal bidding variables.",
    tech: ["Google Ads Manager", "Keyword Planner", "PPC Analytics"],
    learn: "Ad groups creation, negative keywords setups, and CTR reporting."
  },
  {
    title: "Meta Ads Funnel Blueprint",
    desc: "Set up Facebook Pixel conversion events and configure visual carousel ads targeting segmented custom audiences.",
    tech: ["Meta Ads Manager", "A/B Testing", "Pixel Event Tracking"],
    learn: "Custom target settings, image/video ad sets, and ROAS optimization."
  },
  {
    title: "Google Analytics Reporting Dashboard",
    desc: "Configure GA4 tracking tags on a landing page, mapping event-driven parameters, and custom dashboard widgets.",
    tech: ["Google Analytics (GA4)", "Google Tag Manager", "Funnel Analytics"],
    learn: "Cohorts, user retention ratios, conversion rate reporting, and custom KPIs."
  },
  {
    title: "Automated Email Drip Funnel",
    desc: "Design a lead-generating opt-in newsletter list and configure automated workflows based on click behavior tags.",
    tech: ["Mailchimp / HubSpot", "Email Copywriting", "List Segmentation"],
    learn: "Automation triggers, subject line analytics, and open rate diagnostics."
  },
  {
    title: "Brand Reputation Monitoring Audit",
    desc: "Perform a reputation audit for a mock brand, configuring search tracking tools and analyzing user reviews sentiment.",
    tech: ["ORM Audits", "Social Listening Tools", "Sentiment Analysis"],
    learn: "Brand perception strategy, reviews resolution, and positive presence management."
  }
];

const FAQS = [
  { q: "Who is this digital marketing certification program for?", a: "This program is tailored for college students, fresh graduates, beginners, career switchers, and working professionals looking to build practical knowledge in search engine marketing, social campaigns, and data-driven branding." },
  { q: "Do I need any coding experience to join this course?", a: "No coding experience is required. The curriculum starts with digital essentials and guides you step-by-step through easy-to-use platforms like WordPress, Google Ads, and Mailchimp." },
  { q: "How are classes conducted?", a: "Live interactive sessions are conducted online, mostly scheduled in the evening for convenience. Recorded session access, project guidelines, and mentor debug forums are available throughout." },
  { q: "Will I work on real marketing assignments?", a: "Yes. You will design keyword strategies, build landing pages, construct ad campaigns, and set up Google Analytics properties to gather real-world analytical insights." },
  { q: "What tools and platforms will I learn?", a: "You will master Google Ads, Meta Ads Manager, Google Analytics (GA4), WordPress, Mailchimp, GTM, SEO Audit Tools, and Social Listening dashboards." },
  { q: "Will I receive mentor feedback on my projects?", a: "Yes. Industry experts audit your project blueprints and campaign setups, providing feedback to align your skills with marketing agency expectations." },
  { q: "Will I receive a certificate of completion?", a: "Yes. Upon finishing the curriculum modules, project tasks, and final campaign assessments, you will be issued a digital certificate." },
  { q: "What is the duration of this program?", a: "The program spans 3 months, offering structured weekly modules to ensure comprehensive concept coverage." },
  { q: "How do I submit my application?", a: "Simply fill out the lead capture form on this page with your credentials. Our program advisors will contact you to explain details and complete enrollment." },
  { q: "What support is provided for career readiness?", a: "We provide resume auditing, portfolio presentation support, and cohort interview questions to help prepare you for marketing associate roles." }
];

export default function DigitalMarketingLandingPage() {
  // SEO tags setup on mount
  useEffect(() => {
    document.title = "Digital Marketing Certification Program | BeyondSkills";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Master Google Ads, Meta Ads, SEO, GA4 Analytics, and Email Marketing. Build a professional digital marketing portfolio with BeyondSkills.");
    }

    // Add Schema Markup
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Digital Marketing Certification Program",
      "description": "Master Google Ads, Meta Ads, SEO, GA4 Analytics, and Email Marketing. Build a professional portfolio.",
      "provider": {
        "@type": "Organization",
        "name": "BeyondSkills",
        "sameAs": window.location.origin
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: 'Undergraduate Student',
    experience: 'Beginner (No Experience)',
    goal: 'Start a Career in Digital Marketing',
    preferredTime: 'Evening (6 PM - 9 PM)'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  // FAQ Accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Curriculum timeline state
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);

  // Sticky apply CTA visibility on scroll
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!validateEmail(formData.email)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Email Address', body: 'Please enter a valid email address (e.g. name@example.com).' }
      }));
      setIsSubmitting(false);
      return;
    }
    if (!validatePhone(formData.phone)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Mobile Number', body: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).' }
      }));
      setIsSubmitting(false);
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');

    // Parse URL campaigns
    const queryParams = new URLSearchParams(window.location.search);
    const campaign = queryParams.get('utm_campaign') || 'Digital Marketing Paid Campaign';
    const source = queryParams.get('utm_source') || 'Direct Ads';
    const medium = queryParams.get('utm_medium') || 'CPC';
    const content = queryParams.get('utm_content') || 'Landing Page';

    const newLead = {
      id: `LD${String(Date.now()).slice(-4)}${Math.floor(Math.random() * 100)}`,
      name: formData.name,
      email: formData.email,
      phone: cleanPhone,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: 'Ads Leads',
      program: 'digital-marketing-cert',
      assignedBDM: '',
      assignedBDA: '',
      status: 'New',
      subStatus: 'QUALIFIED',
      profession: formData.experience,
      qualification: formData.qualification,
      careerGoal: formData.goal,
      preferredContactTime: formData.preferredTime,
      campaign: campaign,
      source: source,
      utmMedium: medium,
      utmCampaign: campaign,
      utmContent: content,
      remarks: `Contact: ${formData.preferredTime}. Career goal: ${formData.goal}. Experience: ${formData.experience}. Qual: ${formData.qualification}.`,
      callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
      history: []
    };

    try {


      // Save to Supabase
      try {
        await saveLeadToSupabase(newLead);
      } catch (sbErr) {
        console.error('Error saving lead to Supabase:', sbErr);
      }

      // Attempt to hit CRM live sync endpoint if available
      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : window.location.origin;

      await fetch(`${apiHost}/api/webhook/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      }).catch(() => console.log("Realtime webhook offline, saved locally."));

      // Trigger custom notification
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: {
          subject: 'Lead Captured',
          body: `Hi ${formData.name},\n\nYour application has been logged. Our enrollment advisor will reach out shortly.`
        }
      }));

      // Success
      window.location.href = '/thank-you/digital-marketing?program=digital-marketing';
      setFormData({
        name: '',
        email: '',
        phone: '',
        qualification: 'Undergraduate Student',
        experience: 'Beginner (No Experience)',
        goal: 'Start a Career in Digital Marketing',
        preferredTime: 'Evening (6 PM - 9 PM)'
      });
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScrollToForm = () => {
    const formEl = document.getElementById('enquiry-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-[#0F172A] font-sans antialiased min-h-screen relative selection:bg-blue-600/10 selection:text-blue-600 bg-grid-light">
      
      {/* Sticky Header wrapper */}
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
              onClick={handleScrollToForm}
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              APPLY NOW
            </button>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-100 bg-slate-50/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero left content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold text-blue-600 font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Next Cohort Starts: July 2026</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#0F172A] leading-tight tracking-tight">
              Grow Brands. Drive Sales. Master Paid Ads & Analytics.
            </h1>
            
            <p className="text-base sm:text-lg text-slate-550 leading-relaxed max-w-xl">
              Learn how to design marketing plans, launch campaigns inside Google Ads and Meta Manager, and analyze conversion tracks with Google Analytics (GA4).
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              {['Live Doubts Solving', 'Practical Exercises', 'Industry Mentorship', 'Professional Portfolio', 'Dual Certification'].map((badge, idx) => (
                <div key={idx} className="flex items-center space-x-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs text-xs font-semibold text-slate-650">
                  <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={handleScrollToForm}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Apply For Free Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={handleScrollToForm}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Curriculum</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100">
              {[
                { label: "100% Practical", desc: "No boring slides" },
                { label: "Real Dashboards", desc: "Spend logs & audits" },
                { label: "GA4 Configured", desc: "Data driven metrics" },
                { label: "Expert Guidance", desc: "Ogilvy & Agency leads" }
              ].map((badge, idx) => (
                <div key={idx} className="space-y-0.5 text-left">
                  <p className="text-xs font-black text-[#0F172A]">{badge.label}</p>
                  <p className="text-[10px] text-slate-450 font-medium">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero right Form */}
          <div className="lg:col-span-5 w-full z-10" id="enquiry-form-section">
            <div className="bg-white border border-slate-200/85 text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              {/* Form header details */}
              
              <div className="space-y-1.5 mb-6 text-left">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Request Program Info</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Fill in your details below. Our marketing advisors will contact you to answer your curriculum and admission questions.
                </p>
              </div>

              {submitStatus === 'success' && (
                <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-2xl text-xs font-medium space-y-2 text-left animate-fade-in mb-6">
                  <p className="font-bold flex items-center space-x-1.5 text-emerald-900">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Application Submitted!</span>
                  </p>
                  <p className="text-[11px] text-emerald-700 leading-normal">
                    We received your contact details. A team representative will dial you back at your preferred contact slot.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-medium text-left animate-pulse mb-6">
                  Please enter a valid 10-digit mobile number to verify details.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label htmlFor="dm-name" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">Full Name</label>
                  <input 
                    id="dm-name"
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Roshan Kumar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label htmlFor="dm-email" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">Email Address</label>
                    <input 
                      id="dm-email"
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="roshan@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label htmlFor="dm-phone" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">Mobile Number</label>
                    <input 
                      id="dm-phone"
                      type="tel" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="dm-qualification" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">Current Qualification</label>
                  <select 
                    id="dm-qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-blue-600 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    <option className="bg-white text-slate-900">Undergraduate Student</option>
                    <option className="bg-white text-slate-900">Postgraduate Student</option>
                    <option className="bg-white text-slate-900">Recent Graduate</option>
                    <option className="bg-white text-slate-900">Working Professional</option>
                    <option className="bg-white text-slate-900">Other / Freelancer</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label htmlFor="dm-experience" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">Marketing Experience</label>
                    <select 
                      id="dm-experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-blue-600 focus:bg-white outline-none transition-all cursor-pointer"
                    >
                      <option className="bg-white text-slate-900">Beginner (No Experience)</option>
                      <option className="bg-white text-slate-900">Intermediate (Basic Knowledge)</option>
                      <option className="bg-white text-slate-900">Professional (Wants to Upskill)</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-left">
                    <label htmlFor="dm-preferred-time" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">Preferred Callback Slot</label>
                    <select 
                      id="dm-preferred-time"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-blue-600 focus:bg-white outline-none transition-all cursor-pointer"
                    >
                      <option className="bg-white text-slate-900">Morning (10 AM - 1 PM)</option>
                      <option className="bg-white text-slate-900">Afternoon (2 PM - 5 PM)</option>
                      <option className="bg-white text-slate-900">Evening (6 PM - 9 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="dm-goal" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">Primary Career Goal</label>
                  <select 
                    id="dm-goal"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-blue-600 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    <option className="bg-white text-slate-900">Start a Career in Digital Marketing</option>
                    <option className="bg-white text-slate-900">Grow a Business or Startup</option>
                    <option className="bg-white text-slate-900">Become a Freelancer</option>
                    <option className="bg-white text-slate-900">Upskill / Get a Promotion</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? <span>Logging Application...</span> : <span>Apply Now</span>}
                </button>

                <p className="text-[9px] text-slate-500 text-center leading-normal pt-1">
                  By submitting this form you agree to be contacted regarding this certification program. 
                  We strictly respect your privacy.
                </p>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Partners Marquee Banner */}
      <section className="bg-slate-50 py-8 overflow-hidden border-b border-slate-100 select-none">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4 font-mono">Learn to Navigate Industry Platforms</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
            <span className="text-sm font-black tracking-tight text-slate-500 font-mono">GOOGLE ADS</span>
            <span className="text-sm font-black tracking-tight text-slate-500 font-mono">META BUSINESS</span>
            <span className="text-sm font-black tracking-tight text-slate-500 font-mono">GOOGLE ANALYTICS 4</span>
            <span className="text-sm font-black tracking-tight text-slate-500 font-mono">MAILCHIMP</span>
            <span className="text-sm font-black tracking-tight text-slate-500 font-mono">HUBSPOT CRM</span>
            <span className="text-sm font-black tracking-tight text-slate-500 font-mono">WORDPRESS</span>
          </div>
        </div>
      </section>

      {/* 2. Why Learn Digital Marketing */}
      <section className="py-20 border-b border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">Market Demand</span>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">The Fuel of Modern Commerce</h2>
            <p className="text-sm text-slate-550 leading-relaxed">
              Every modern brand, startup, and agency relies on digital advertising to acquire customers. Standard offline campaigns are no longer sufficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
                title: "Industry Demand",
                desc: "Marketing budgets are shifting entirely from TV and print to search engines and social platforms. Professionals who know how to optimize paid campaign spend are in high demand."
              },
              {
                icon: <Globe className="w-6 h-6 text-orange-500" />,
                title: "Freelancing & Remote Work",
                desc: "Digital marketing offers immediate path to freelancing. Agencies and small businesses worldwide routinely outsource campaign setups, SEO content writing, and GA4 configurations."
              },
              {
                icon: <Briefcase className="w-6 h-6 text-blue-600" />,
                title: "Startups & Growth Roles",
                desc: "Startups need rapid user acquisition. Knowing how to map marketing funnels, run A/B copy tests, and audit acquisition metrics makes you a key growth contributor."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50/55 border border-slate-100 p-8 rounded-2xl text-left space-y-4 hover:shadow-md transition-all animate-fade-in">
                <div className="bg-white border border-slate-200/60 p-3.5 rounded-xl w-fit shadow-xs">
                  {item.icon}
                </div>
                <h3 className="text-base font-black text-[#0F172A]">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why BeyondSkills */}
      <section className="py-20 border-b border-slate-100 bg-slate-50/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">BeyondSkills Advantage</span>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Structured Learning Built for Results</h2>
            <p className="text-sm text-slate-550 leading-relaxed">
              We focus entirely on hands-on practical exercises. We teach you how to audit, manage budget variables, and read metric dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Beginner Friendly", desc: "No complex software prerequisites required to start." },
              { title: "Practical Exercises", desc: "Build keyword lists and draft ad mockups." },
              { title: "Weekly Doubt Check", desc: "Mentor-led sessions to review your audits and reports." },
              { title: "WordPress Setup", desc: "Learn domain management and build optimized WordPress landing pages." },
              { title: "Interactive Dashboards", desc: "Review real Google and Meta ads structures." },
              { title: "Cohort Community", desc: "Discuss topics and share campaign creatives with peers." },
              { title: "LMS Platform", desc: "Structured video files and campaign audits dashboard." },
              { title: "Resume Building", desc: "Format your projects onto your profiles." }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white border border-slate-200/65 p-6 rounded-2xl text-left space-y-3 hover:border-blue-600/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold font-mono">
                  {idx + 1}
                </div>
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{benefit.title}</h4>
                <p className="text-xs text-slate-500 leading-normal">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Curriculum Timeline Roadmap */}
      <section className="py-20 border-b border-slate-900 bg-slate-950 text-white bg-grid-dark">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-500 bg-blue-950 border border-blue-900/60 px-3 py-1 rounded-full uppercase tracking-wider font-mono">Syllabus Details</span>
            <h2 className="text-3xl font-black text-white tracking-tight">Structured Course Timeline</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore the 15 comprehensive modules. You will build and test marketing campaign elements throughout the curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side list */}
            <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-2 border-r border-slate-900">
              {CURRICULUM.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveModuleIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs font-bold flex items-center justify-between cursor-pointer ${
                    activeModuleIdx === idx
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${activeModuleIdx === idx ? 'bg-blue-700/60 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {item.week}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${activeModuleIdx === idx ? 'text-white' : 'text-slate-400'}`} />
                </button>
              ))}
            </div>

            {/* Right side details card */}
            <div className="lg:col-span-7 bg-[#0F172A] border border-white/5 p-6 sm:p-8 rounded-3xl text-left min-h-[420px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-bold font-mono text-orange-400 bg-orange-950 border border-orange-900/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {CURRICULUM[activeModuleIdx].week}
                  </span>
                  <h3 className="text-lg font-black text-white">{CURRICULUM[activeModuleIdx].title}</h3>
                </div>
                
                <p className="text-xs font-bold text-slate-400 border-b border-slate-900 pb-3 font-mono">
                  Focus: {CURRICULUM[activeModuleIdx].subtopic}
                </p>

                <ul className="space-y-3 pt-2">
                  {CURRICULUM[activeModuleIdx].details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start space-x-3">
                      <div className="bg-blue-500/10 p-0.5 rounded-full mt-0.5">
                        <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      </div>
                      <span className="text-xs text-slate-300 leading-relaxed font-medium">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-900 mt-6 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500">Total 15 Modules Included</span>
                <button 
                  onClick={handleScrollToForm}
                  className="text-xs text-blue-400 hover:text-blue-500 font-extrabold flex items-center space-x-1 cursor-pointer"
                >
                  <span>Inquire About Batch Dates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Projects Section */}
      <section className="py-20 border-b border-slate-100 bg-slate-50/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">Practical Portfolio</span>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Sample Cohort Projects</h2>
            <p className="text-sm text-slate-550 leading-relaxed">
              Build functional marketing strategies, ad setups, and analytics reports. Use these samples to demonstrate your capabilities to employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_PROJECTS.map((project, idx) => (
              <div key={idx} className="bg-slate-950 text-white border border-slate-800 p-6 rounded-2xl text-left space-y-4 hover:shadow-xl hover:shadow-slate-100/10 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t, tIdx) => (
                      <span key={tIdx} className="bg-slate-900 border border-slate-800 text-slate-350 px-2.5 py-0.5 rounded text-[10px] font-bold font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-sm font-bold text-white">{project.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{project.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-900 mt-2">
                  <p className="text-[10px] text-slate-450 font-semibold leading-relaxed">
                    <span className="font-bold text-slate-500 block">Skills Learned:</span>
                    <span className="text-orange-400 font-semibold mt-1 block italic">{project.learn}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[10px] text-slate-400 font-mono mt-8">
            *Note: Project scopes are adjusted dynamically based on campaign platform updates.
          </p>
        </div>
      </section>

      {/* 6. Learning Experience */}
      <section className="py-20 border-b border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">Student Journey</span>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">How the Cohort Works</h2>
            <p className="text-sm text-slate-550 leading-relaxed">
              We follow a structured progression format to guide you from basic overview to campaign analytics audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { step: "01", title: "Attend Session", desc: "Attend live mentor-led classes and follow step-by-step optimization case studies." },
              { step: "02", title: "Launch Ads Check", desc: "Draft keyword sheets, write visual headlines, and map budget campaign structures." },
              { step: "03", title: "Review Metrics", desc: "Verify conversions inside Google Analytics (GA4) with guidance from active specialists." },
              { step: "04", title: "Complete Assessment", desc: "Compile your search campaigns, ad copies, and analytical reviews into your portfolio." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-3 text-left relative z-10">
                <span className="text-4xl font-black text-blue-600/25 font-mono">{item.step}</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">{item.title}</h4>
                <p className="text-xs text-slate-555 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Program Details Section */}
      <section className="py-20 border-b border-slate-100 bg-slate-50/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12">
            
            {/* Details Left */}
            <div className="p-8 sm:p-10 md:col-span-7 text-left space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest font-mono">Special Pricing Slot</span>
                <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">Marketing Upskill Package</h3>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Cohort Duration", value: "3 Months (Structured Modules)" },
                  { label: "Schedule Mode", value: "Live Interactive Discussions + Video Modules" },
                  { label: "Instructors", value: "Kunal Sen (Ogilvy Lead), Riddhima Das (Growth Consultant)" },
                  { label: "Delivery Language", value: "English & Hinglish Support" },
                  { label: "Learning Access", value: "1-Year LMS Access + Project Files" }
                ].map((detail, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-450 font-medium">{detail.label}</span>
                    <span className="font-bold text-[#0F172A] text-right ml-2">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Right (Conversion) */}
            <div className="p-8 bg-slate-900 text-white md:col-span-5 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Included Badges</h4>
                <div className="space-y-2.5">
                  {[
                    "WordPress Portal Buildout",
                    "Keyword Mapping Guide",
                    "Meta Pixel Analytics Sync",
                    "Email Automation Drips",
                    "Digital Audits Portfolio",
                    "Certificate of Completion"
                  ].map((badge, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 text-xs text-slate-200">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 md:pt-0 mt-6 md:mt-0">
                <button 
                  onClick={handleScrollToForm}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md text-center block cursor-pointer"
                >
                  Secure Enrollment Info
                </button>
                <p className="text-[9px] text-slate-455 text-center mt-2 leading-relaxed font-mono">
                  Enrollment fee payment is processed via safe payment gateways.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 8. Testimonials Section (Placeholders Only - No Fake Reviews) */}
      <section className="py-20 border-b border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">Student Success</span>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Verified Success Stories</h2>
            <p className="text-sm text-slate-550 leading-relaxed">
              Read review records and check campaign results from our student cohort graduates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", role: "Digital Marketing Executive", city: "Delhi", comment: "The Google Ads and Meta campaign modules were incredibly practical. I launched my first live ad campaign during the course itself and got real results. The mentor sessions helped me understand bidding strategies I couldn't find anywhere else." },
              { name: "Rohan Mehta", role: "Freelance Consultant", city: "Mumbai", comment: "After completing this program, I started acquiring clients for SEO and social media management. The WordPress website module was a game changer — I built 3 client websites within the first month. Absolutely worth it." },
              { name: "Anjali Verma", role: "Marketing Manager", city: "Bangalore", comment: "I was already working in marketing but needed to upskill in performance analytics. The GA4 and GTM tracking section gave me exactly that. My reporting dashboards improved dramatically and I got a promotion shortly after." }
            ].map((pCard, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl text-left space-y-4 shadow-lg shadow-blue-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-sm">
                    {pCard.name[0]}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{pCard.name}</h5>
                    <p className="text-[10px] text-blue-200 font-medium font-mono">{pCard.role} · {pCard.city}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-blue-100 italic leading-relaxed">
                  "{pCard.comment}"
                </p>
                <div className="pt-2 border-t border-white/20 text-[9px] text-blue-300 font-mono">
                  ✓ Verified Student · BeyondSkills Cohort Graduate
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-8">Our Graduates Work At</p>
            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
              <div className="flex flex-col items-center gap-2 group">
                <img src={wiproLogo} alt="Wipro" className="h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Wipro</span>
              </div>
              <div className="flex flex-col items-center gap-2 group">
                <img src={tcsLogo} alt="TCS" className="h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">TCS</span>
              </div>
              <div className="flex flex-col items-center gap-2 group">
                <img src={infosysLogo} alt="Infosys" className="h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Infosys</span>
              </div>
              <div className="flex flex-col items-center gap-2 group">
                <img src={cognizantLogo} alt="Cognizant" className="h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Cognizant</span>
              </div>
              <div className="flex flex-col items-center gap-2 group">
                <img src={accentureLogo} alt="Accenture" className="h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Accenture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Frequently Asked Questions */}
      <section className="py-20 border-b border-slate-100 bg-slate-50/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">FAQ Section</span>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-550 leading-relaxed">
              Find answers to common questions about enrollment, syllabus details, and support systems.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-[#0F172A] cursor-pointer hover:bg-slate-50/50"
                >
                  <span>{faq.q}</span>
                  {openFaqIdx === idx ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaqIdx === idx && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs text-slate-555 leading-relaxed text-left animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Launch Your Digital Marketing Career with BeyondSkills
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Get practical knowledge on campaign optimization, keywords settings, and data audits. Build a portfolio that demonstrates your campaign skills to recruiters.
          </p>

          <div className="pt-4">
            <button
              onClick={handleScrollToForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center space-x-2 mx-auto cursor-pointer"
            >
              <span>Apply For Syllabus Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-slate-450 leading-relaxed max-w-sm mx-auto font-mono">
            Our team will contact you to explain the program, curriculum topics, fee structure, and answer your questions.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-white/5 text-center text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-1 text-white font-extrabold text-sm">
            <span className="logo-font text-white">Beyond</span>
            <span className="logo-font bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">Skills</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            © 2026 BeyondSkills. All Rights Reserved. Digital marketing upskilling programs are executed under expert mentorship guides.
          </p>
        </div>
      </footer>

      {/* FLOATING WIDGETS */}
      {/* 1. Floating WhatsApp Button */}
      <a
        href="https://wa.me/919953607074?text=Hi%20BeyondSkills,%20I%20am%20interested%2520in%20the%20Digital%20Marketing%20Certification%20Program"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
      </a>

      {/* 2. Sticky Mobile Apply CTA (Visible on Mobile only, when scrolled past Hero) */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 sm:hidden flex items-center justify-between shadow-2xl animate-slide-up">
          <div className="text-left">
            <p className="text-[9px] font-bold text-slate-400 uppercase font-mono">Upskill Package</p>
            <p className="text-xs font-black text-[#0F172A]">₹12,000 Fee</p>
          </div>
          <button
            onClick={handleScrollToForm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2.5 rounded-lg text-[10px] uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            Apply Now
          </button>
        </div>
      )}

    </div>
  );
}
