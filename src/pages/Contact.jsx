import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { COURSES, getDbItem, setDbItem } from '../utils/mockDb';
import { saveLeadToSupabase, getISTDateTimeString } from '../utils/supabaseClient';
import { validateEmail, validatePhone } from '../utils/validationHelpers';

export default function Contact() {
  const [activeForm, setActiveForm] = useState('agency');
  const [agencyForm, setAgencyForm] = useState({ name: '', company: '', email: '', phone: '', service: 'Website Development', budget: 'Below 1 Lakh', message: '' });
  const [academyForm, setAcademyForm] = useState({ name: '', email: '', phone: '', course: 'ai-ml', college: '', status: 'Undergraduate Student', message: '' });
  const [status, setStatus] = useState(null);

  const handleAgencySubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(agencyForm.email)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Email Address', body: 'Please enter a valid email address (e.g. name@example.com).' }
      }));
      return;
    }
    if (!validatePhone(agencyForm.phone)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Mobile Number', body: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).' }
      }));
      return;
    }
    const newLead = { 
      type: 'Agency Leads', 
      name: agencyForm.name,
      email: agencyForm.email,
      phone: agencyForm.phone,
      program: agencyForm.service,
      college: agencyForm.company || 'Unspecified',
      profession: 'Corporate / Client',
      message: `Budget: ${agencyForm.budget} | Message: ${agencyForm.message}`,
      date: getISTDateTimeString() 
    };

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
      console.error('Error posting agency lead to backend webhook:', err);
    }

    // Send Simulated SLA toast
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Corporate Request logged: ${agencyForm.service}`,
        body: `Dear ${agencyForm.name},\n\nWe have logged your consultation inquiry at BeyondSkills Agency for ${agencyForm.service}. A digital solutions manager has been assigned. You will receive an onboarding briefing calendar invite shortly.\n\nWarm regards,\nBeyondSkills Client Team`
      }
    }));

    const agencySlug = (agencyForm.service || 'digital-services').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    window.location.href = `/thank-you/${agencySlug}?program=${encodeURIComponent(agencyForm.service)}`;
  };

  const handleAcademySubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(academyForm.email)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Email Address', body: 'Please enter a valid email address (e.g. name@example.com).' }
      }));
      return;
    }
    if (!validatePhone(academyForm.phone)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Mobile Number', body: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).' }
      }));
      return;
    }
    const newLead = { 
      type: 'Academy Leads', 
      name: academyForm.name,
      email: academyForm.email,
      phone: academyForm.phone,
      program: academyForm.course,
      college: academyForm.college || 'Unspecified',
      profession: academyForm.status || 'Unspecified',
      message: academyForm.message || '',
      date: getISTDateTimeString() 
    };

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
      console.error('Error posting academy lead to backend webhook:', err);
    }

    // Send Simulated SLA toast
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Program Registration received`,
        body: `Hello ${academyForm.name},\n\nWe have successfully received your inquiry about our ${academyForm.course} program. A mentor is reviewing your background details to prepare a curriculum path recommendation. We will contact you shortly.\n\nSincerely,\nBeyondSkills Academy Admissions`
      }
    }));

    const academySlug = (academyForm.course || 'academy').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    window.location.href = `/thank-you/${academySlug}?program=${encodeURIComponent(academyForm.course)}`;
  };

  return (
    <div className="text-slate-900 min-h-screen relative pt-12 pb-24">
      {/* Glow Blur */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-purple uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5">
            Get In Touch
          </span>
          <h1 className="logo-font text-4xl sm:text-6xl font-extrabold mt-6">
            Let's Start a Conversation
          </h1>
          <p className="mt-4 text-slate-500 text-sm sm:text-base">
            Reach our team for software & ads projects, or contact our advisors to plan your upskilling catalog.
          </p>
        </div>

        {/* Outer Grid: Info Cards Left, Forms Tab Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Info Columns */}
          <div className="space-y-8">
            <div className="glass-panel p-6 rounded-xl border border-slate-200/60 space-y-6">
              <h3 className="font-bold text-slate-900 text-base uppercase tracking-wider">Contact Channels</h3>
              
              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Office Location</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Udyog Vihar, Gurugram, Haryana
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-brand-purple flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone / WhatsApp</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    <a href="tel:+917982119571" className="hover:text-brand-purple transition-colors">+91 7982119571</a>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Mail className="w-5 h-5 text-brand-purple flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Channels</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    <a href="mailto:connect@beyondskills.in" className="hover:text-brand-purple transition-colors">connect@beyondskills.in</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/40 border border-slate-200/60 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-2 text-brand-purple">
                <Clock className="w-5 h-5" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Response SLA Agreement</h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                All submissions are logged immediately. Our admissions and account teams review details the same day and will follow up by phone or email.
              </p>
            </div>
          </div>

          {/* Form Tabs Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex border-b border-slate-200 space-x-6 pb-2">
              <button onClick={() => { setActiveForm('agency'); setStatus(null); }} className={`pb-4 font-bold text-sm uppercase tracking-wider transition-colors relative ${activeForm === 'agency' ? 'text-brand-purple' : 'text-slate-500 hover:text-slate-900'}`}>
                <span>Service Request</span>
                {activeForm === 'agency' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple"></div>}
              </button>
              <button onClick={() => { setActiveForm('academy'); setStatus(null); }} className={`pb-4 font-bold text-sm uppercase tracking-wider transition-colors relative ${activeForm === 'academy' ? 'text-brand-purple' : 'text-slate-500 hover:text-slate-900'}`}>
                <span>Program Consultation</span>
                {activeForm === 'academy' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple"></div>}
              </button>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-slate-200">
              {status === 'agency_success' && (
                <div className="bg-brand-purple/15 border border-brand-purple/30 text-slate-900 p-4 rounded-xl mb-6 text-xs">
                  🚀 Request received. A team member will be in touch shortly.
                </div>
              )}
              
              {status === 'academy_success' && (
                <div className="bg-brand-purple/15 border border-brand-purple/30 text-slate-900 p-4 rounded-xl mb-6 text-xs">
                  📚 Enquiry received. A program advisor will reach out shortly.
                </div>
              )}

              {activeForm === 'agency' ? (
                /* Agency */
                <form onSubmit={handleAgencySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name *</label>
                      <input type="text" required value={agencyForm.name} onChange={(e) => setAgencyForm({...agencyForm, name: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name *</label>
                      <input type="text" required value={agencyForm.company} onChange={(e) => setAgencyForm({...agencyForm, company: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="Tech Startup Inc." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address *</label>
                      <input type="email" required value={agencyForm.email} onChange={(e) => setAgencyForm({...agencyForm, email: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="john@company.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number *</label>
                      <input type="tel" required value={agencyForm.phone} onChange={(e) => setAgencyForm({...agencyForm, phone: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Service Required *</label>
                      <select value={agencyForm.service} onChange={(e) => setAgencyForm({...agencyForm, service: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all">
                        <option value="Website Development">Website Development</option>
                        <option value="Custom Web Applications">Custom Web Applications</option>
                        <option value="Google & Meta Ads - Performance Marketing">Google & Meta Ads - Performance Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Estimated Budget *</label>
                      <select value={agencyForm.budget} onChange={(e) => setAgencyForm({...agencyForm, budget: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all">
                        <option value="Below 1 Lakh">Below 1 Lakh</option>
                        <option value="₹1,00,000 - ₹3,00,000">₹1,00,000 - ₹3,00,000</option>
                        <option value="₹3,00,000 - ₹5,00,000">₹3,00,000 - ₹5,00,000</option>
                        <option value="₹5,00,000+">₹5,00,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Brief / Message</label>
                    <textarea rows={4} value={agencyForm.message} onChange={(e) => setAgencyForm({...agencyForm, message: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="Provide scope details, design criteria, or timelines..."></textarea>
                  </div>

                  <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Submit Request</span>
                  </button>
                </form>
              ) : (
                /* Academy */
                <form onSubmit={handleAcademySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name *</label>
                      <input type="text" required value={academyForm.name} onChange={(e) => setAcademyForm({...academyForm, name: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address *</label>
                      <input type="email" required value={academyForm.email} onChange={(e) => setAcademyForm({...academyForm, email: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="john@gmail.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number *</label>
                      <input type="tel" required value={academyForm.phone} onChange={(e) => setAcademyForm({...academyForm, phone: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course of Interest *</label>
                      <select value={academyForm.course} onChange={(e) => setAcademyForm({...academyForm, course: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all">
                        {COURSES.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Status *</label>
                      <select value={academyForm.status} onChange={(e) => setAcademyForm({...academyForm, status: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all">
                        <option value="Undergraduate Student">Undergraduate Student</option>
                        <option value="Postgraduate Student">Postgraduate Student</option>
                        <option value="Recent Graduate">Recent Graduate</option>
                        <option value="Working Professional">Working Professional</option>
                        <option value="Career Switcher">Career Switcher</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {academyForm.status === 'Working Professional' || academyForm.status === 'Career Switcher' ? 'Company Name *' : 'College / Institute Name *'}
                      </label>
                      <input type="text" required value={academyForm.college} onChange={(e) => setAcademyForm({...academyForm, college: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder={academyForm.status === 'Working Professional' || academyForm.status === 'Career Switcher' ? "e.g. Google, Tech Mahindra" : "BITS Pilani"} />
                    </div>
                  </div>

                  {(academyForm.status === 'Working Professional' || academyForm.status === 'Career Switcher') && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Designation / Role *</label>
                      <input 
                        type="text" 
                        required 
                        value={academyForm.message.startsWith('Designation: ') ? academyForm.message.split(' | ')[0].replace('Designation: ', '') : ''} 
                        onChange={(e) => {
                          const designation = e.target.value;
                          const msg = academyForm.message.includes(' | ') ? academyForm.message.split(' | ').slice(1).join(' | ') : academyForm.message;
                          setAcademyForm({...academyForm, message: `Designation: ${designation}${msg ? ' | ' + msg : ''}`});
                        }} 
                        className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" 
                        placeholder="e.g. Software Engineer" 
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Questions / Message</label>
                    <textarea rows={4} value={academyForm.message} onChange={(e) => setAcademyForm({...academyForm, message: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" placeholder="Any doubts regarding live schedule, recorded classes, or dashboard tools..."></textarea>
                  </div>

                  <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Submit Request</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
