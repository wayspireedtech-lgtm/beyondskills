import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Code, Megaphone, Terminal, FileText, CheckCircle, ArrowLeft, Send, Sparkles, AlertCircle } from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/dbHelpers';
import { saveLeadToSupabase, getISTDateTimeString } from '../utils/supabaseClient';
import { validateEmail, validatePhone } from '../utils/validationHelpers';

const SERVICE_DATA = {
  'website-development': {
    title: 'Website & Custom Web Applications Development',
    category: 'Digital Services',
    icon: Code,
    overview: 'We build premium, enterprise-grade custom web portals, single page applications (SPAs), SaaS dashboards, and e-commerce systems tailored to scale with your business.',
    process: [
      { step: '01', name: 'Discovery & Architecture', desc: 'Analyzing functional specifications, data models, user flows, and software architecture.' },
      { step: '02', name: 'UI/UX Interactive Design', desc: 'Crafting modern interfaces using high-fidelity dark-mode themes, Outfit typography, and custom mockups.' },
      { step: '03', name: 'Agile Coding Iterations', desc: 'Developing logic using React, Next.js, Node.js, and integrating secure API layers.' },
      { step: '04', name: 'Quality Assurance & Tests', desc: 'Verifying load speeds, responsive views, compile constraints, and security audits.' },
      { step: '05', name: 'Cloud Deployment & SLA Launch', desc: 'Provisioning secure VPS/server pipelines on AWS, configuring CDN caching, and domain routing.' }
    ],
    deliverables: [
      'Production-ready React/Node source code repository',
      'Database architecture schemas (PostgreSQL / MongoDB)',
      'Integrated admin dashboard panel with real-time stats',
      'API documentation & post-deployment support guides'
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'MongoDB', 'PostgreSQL', 'AWS Cloud'],
    benefits: [
      'High-performance PageSpeed scores (90+ mobile & desktop)',
      'Rigid security configurations preventing common injections',
      'Fully responsive, fluid layouts across all devices'
    ],
    faqs: [
      { q: 'How long does a typical portal project take?', a: 'Standard business portals take 4-6 weeks, while complex full-stack web applications require 8-12 weeks depending on integration requirements.' },
      { q: 'Do you provide maintenance and updates post-launch?', a: 'Yes, our agency offers monthly retainers covering server health, security patches, backups, and feature iterations.' }
    ]
  },
  'digital-marketing': {
    title: 'Performance Digital Marketing & Brand Campaigns',
    category: 'Digital Services',
    icon: Megaphone,
    overview: 'Drive customer acquisition and high ROI revenue growth through targeted Meta Ads, Google performance campaigns, SEO indexing, and real-time database funnels.',
    process: [
      { step: '01', name: 'Competitor Auditing', desc: 'Researching target keywords, competitor search volumes, and visual ad copy strategies.' },
      { step: '02', name: 'Creative Development', desc: 'Designing high-impact graphic creatives, copywriting headlines, and building custom landing pages.' },
      { step: '03', name: 'Attribution & Tracking Setup', desc: 'Deploying Google Analytics (GA4), GTM containers, and Meta Conversions server-side API links.' },
      { step: '04', name: 'Campaign Launch & A/B Matrix', desc: 'Setting custom audiences, budgeting, and running multi-variant ad set tests.' },
      { step: '05', name: 'Optimization Scaling', desc: 'Analyzing cost per acquisition (CPA), cleaning ad sets, and scaling budgets toward positive pipelines.' }
    ],
    deliverables: [
      'Configured Google Tag Manager and Meta Conversions API links',
      'High-fidelity custom ad creatives and landing pages layouts',
      'Weekly performance analytics reporting & attribution audits',
      'Fully optimized ads accounts structure with scaling plan'
    ],
    technologies: ['Meta Ads Manager', 'Google Ads', 'Google Tag Manager', 'GA4 Analytics', 'Conversions API', 'SEO Tools'],
    benefits: [
      'Trackable conversion attribution (no lost sales parameters)',
      'A/B tested copywriting converting traffic at high baseline margins',
      'Budget allocation alignment preventing wasted ad spend'
    ],
    faqs: [
      { q: 'What is the minimum ad spend budget required?', a: 'We recommend starting with at least ₹50,000 monthly ad budget to allow ad networks algorithms to gather conversion events data.' },
      { q: 'Who pays for the ad spend budget?', a: 'Ad spend is billed directly to your corporate payment card. Our agency fees are structured as a percentage of ad spend or flat monthly retainers.' }
    ]
  }
};

const leadSchema = {
  type: 'Digital Services',
  name: '',
  company: '',
  email: '',
  phone: '',
  budget: 'Below 1 Lakh',
  message: ''
};

export default function Services() {
  const { serviceId } = useParams();
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', budget: 'Below 1 Lakh', message: '' });
  const [status, setStatus] = useState(null);

  const data = SERVICE_DATA[serviceId];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Email Address', body: 'Please enter a valid email address (e.g. name@example.com).' }
      }));
      return;
    }
    if (!validatePhone(form.phone)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Mobile Number', body: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).' }
      }));
      return;
    }
    const leads = getDbItem('beyondskills_leads', []);
    const newLead = { 
      type: 'Digital Services', 
      name: form.name,
      email: form.email,
      phone: form.phone,
      program: data.title || 'Digital Services',
      college: form.company || 'Unspecified',
      profession: 'Corporate / Client',
      message: `Budget: ${form.budget} | Message: ${form.message}`,
      date: getISTDateTimeString() 
    };
    leads.push(newLead);
    setDbItem('beyondskills_leads', leads);

    // Save to Supabase
    try {
      await saveLeadToSupabase(newLead);
    } catch (sbErr) {
      console.error('Error saving lead to Supabase:', sbErr);
    }

    try {
      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : window.location.origin;

      await fetch(`${apiHost}/api/webhook/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
    } catch (err) {
      console.error('Error posting digital services inquiry to backend webhook:', err);
    }

    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Inquiry Logged: ${data.title}`,
        body: `Hello ${form.name},\n\nWe have received your digital services consultation inquiry regarding ${data.title}. One of our senior architects will reach out to schedule a technical discovery call shortly.\n\nThank you,\nBeyondSkills Consulting Team`
      }
    }));

    const serviceSlug = (serviceId || data.title || 'digital-services').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    window.location.href = `/thank-you/${serviceSlug}?program=${encodeURIComponent(data.title)}`;
  };

  if (!data) {
    return (
      <div className="text-slate-900 min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-brand-blue mb-4" />
        <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
        <p className="text-slate-500 mb-6">The digital service you are looking for does not exist.</p>
        <Link to="/" className="bg-brand-purple text-white font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider">
          Return Home
        </Link>
      </div>
    );
  }

  const IconComp = data.icon;

  return (
    <div className="text-slate-900 min-h-screen relative pt-12 pb-24">
      {/* Decorative Blur */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] animate-pulse-glow z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-brand-purple uppercase tracking-wider mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="max-w-4xl mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-purple uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5">
            {data.category}
          </span>
          <h1 className="logo-font text-3xl sm:text-5xl font-extrabold mt-4 mb-6 leading-tight">
            {data.title}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            {data.overview}
          </p>
        </div>

        {/* Grid: Details Left, Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Tech Stack */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-2 border-brand-purple pl-3">
                Technologies & Platforms
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {data.technologies.map((t, idx) => (
                  <span key={idx} className="text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Process Timeline */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-8 border-l-2 border-brand-purple pl-3">
                Our Work Process
              </h3>
              <div className="relative border-l border-slate-200 pl-6 space-y-8">
                {data.process.map((p, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[37px] bg-brand-purple text-black font-extrabold text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-black">
                      {p.step}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{p.name}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits & Deliverables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="glass-panel p-6 rounded-xl border border-slate-200/60">
                <h4 className="font-bold text-sm text-brand-purple uppercase tracking-wider mb-4">Core Deliverables</h4>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  {data.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Terminal className="w-4 h-4 text-brand-purple mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel p-6 rounded-xl border border-slate-200/60">
                <h4 className="font-bold text-sm text-brand-purple uppercase tracking-wider mb-4">Core Benefits</h4>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  {data.benefits.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-brand-purple mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-6 border-l-2 border-brand-purple pl-3">
                Service FAQs
              </h3>
              <div className="space-y-4">
                {data.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200/60 bg-slate-100 p-5 rounded-xl">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-2">{faq.q}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Inquiry Form Sticky Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 sticky top-24">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2">Request Consultation</h3>
            <p className="text-xs text-slate-500 mb-6">Our team reviews requests within the day.</p>

            {status === 'success' && (
              <div className="bg-brand-purple/15 border border-brand-purple/30 text-slate-900 p-3.5 rounded-lg mb-6 text-xs leading-relaxed">
                🚀 Request received. Our team will be in touch shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none shadow-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company *</label>
                <input type="text" required value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none shadow-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="Company Name" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none shadow-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="jane@company.com" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone *</label>
                <input type="tel" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none shadow-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Budget *</label>
                <select value={form.budget} onChange={(e) => setForm({...form, budget: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none shadow-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none">
                  <option value="Below 1 Lakh">Below 1 Lakh</option>
                  <option value="₹1,00,000 - ₹3,00,000">₹1,00,000 - ₹3,00,000</option>
                  <option value="₹3,00,000 - ₹5,00,000">₹3,00,000 - ₹5,00,000</option>
                  <option value="₹5,00,000+">₹5,00,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Brief Message</label>
                <textarea rows={3} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none shadow-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="What are your goals?"></textarea>
              </div>
              <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
