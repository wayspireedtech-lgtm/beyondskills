import React, { useState } from 'react';
import { Send, Sparkles, Award, Users, ShieldAlert, Briefcase, MessageSquare, CheckCircle, Star } from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/mockDb';

export default function CampusAmbassador() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '2nd Year',
    stream: '',
    whyApply: ''
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const leads = getDbItem('beyondskills_leads', []);
    const newLead = { 
      type: 'Campus Ambassador', 
      ...form, 
      date: new Date().toISOString() 
    };
    leads.push(newLead);
    setDbItem('beyondskills_leads', leads);

    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: 'Ambassador Application Received',
        body: `Hello ${form.name},\n\nWe have received your application for the BeyondSkills Campus Ambassador Program. Our campus recruitment lead will review your profile and reach out to you at ${form.phone} within 48 hours for a brief telephonic interaction.\n\nBest regards,\nBeyondSkills Campus Team`
      }
    }));

    setStatus('success');
    setForm({
      name: '',
      email: '',
      phone: '',
      college: '',
      year: '2nd Year',
      stream: '',
      whyApply: ''
    });
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <div className="text-slate-900 min-h-screen relative pt-12 pb-24">
      {/* Glow Blur */}
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-[100px] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-purple uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5">
            BeyondSkills Network
          </span>
          <h1 className="logo-font text-4xl sm:text-6xl font-extrabold mt-6">
            Campus Ambassador Program
          </h1>
          <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
            Represent BeyondSkills at your college campus. Bridge the gap between academic education and industry tech skills while earning cash rewards and certification.
          </p>
        </div>

        {/* Dynamic Section: Grid of Info vs Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-20">
          
          {/* Details Column (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Responsibilities */}
            <div className="bg-slate-50/70 border border-slate-200/50 p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-6 border-l-2 border-brand-purple pl-3">
                Your Role & Responsibilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Community Building',
                    desc: 'Create and grow a community of 50+ technology enthusiasts at your college to share industry updates.',
                    icon: Users
                  },
                  {
                    title: 'Brand Representation',
                    desc: 'Act as the official student face of BeyondSkills, promoting tech workshops and upskilling webinars.',
                    icon: Sparkles
                  },
                  {
                    title: 'Social & Digital Promotion',
                    desc: 'Share learning resources, certifications updates, and events on college groups and LinkedIn.',
                    icon: MessageSquare
                  },
                  {
                    title: 'Event Coordination',
                    desc: 'Co-host online tech sessions with industry mentors and help students solve onboarding queries.',
                    icon: Briefcase
                  }
                ].map((role, idx) => {
                  const Icon = role.icon;
                  return (
                    <div key={idx} className="flex space-x-3.5">
                      <div className="bg-brand-purple/10 text-brand-purple p-2.5 rounded-xl h-fit border border-brand-purple/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{role.title}</h4>
                        <p className="text-xs text-slate-500 leading-normal">{role.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Perks & Benefits */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-6 border-l-2 border-brand-purple pl-3">
                Ambassador Incentives & Perks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Internship Certificate',
                    desc: 'Receive an official corporate Internship Certificate on successful completion.',
                    icon: Award
                  },
                  {
                    title: 'Performance Stipend',
                    desc: 'Earn cash rewards up to ₹25,000 based on recruitment milestones and tasks.',
                    icon: Sparkles
                  },
                  {
                    title: 'PPO & LOR Options',
                    desc: 'Top performers receive Letters of Recommendation and Pre-Placement Offers (PPOs).',
                    icon: Briefcase
                  }
                ].map((perk, idx) => {
                  const Icon = perk.icon;
                  return (
                    <div key={idx} className="bg-slate-100 border border-slate-200/50 p-6 rounded-2xl flex flex-col justify-between min-h-[180px] hover:border-brand-purple/35 transition-all">
                      <Icon className="w-8 h-8 text-brand-purple mb-4" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">{perk.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{perk.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Interactive Profile Card Column (Right 1 col) */}
          <div className="sticky top-24">
            <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 relative overflow-hidden">
              {/* Glowing Background Blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/20 rounded-full blur-2xl z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-[9px] font-bold tracking-widest text-brand-purple uppercase bg-brand-purple/10 border border-brand-purple/40 px-2.5 py-1 rounded-full mb-6">
                  Verified Ambassador Profile
                </span>

                {/* Avatar mock */}
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-2 border-brand-purple shadow-lg mb-4">
                  <span className="text-xl font-bold text-white font-mono">AM</span>
                </div>

                <h4 className="font-bold text-base">Aarav Mehta</h4>
                <p className="text-[11px] text-brand-blue font-mono mt-1">Delhi University</p>
                <div className="flex items-center space-x-1.5 mt-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                  <span className="text-xs text-slate-200 font-medium">Gold Leader Profile</span>
                </div>

                <div className="w-full border-t border-slate-800 my-6 pt-6 grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">Recruits</span>
                    <span className="text-sm font-bold font-mono">18 Learners</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">Points Earned</span>
                    <span className="text-sm font-bold font-mono text-brand-purple">1,450 XP</span>
                  </div>
                </div>

                <div className="w-full space-y-2 text-left bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-brand-blue uppercase font-bold tracking-wider block">Achievements</span>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-purple flex-shrink-0" />
                    <span>Weekly Target Leader (Gold badge)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-purple flex-shrink-0" />
                    <span>Hosted AI Webinar (120+ attendees)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Application Form */}
        <div id="apply-form" className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 p-8 rounded-3xl relative z-10 shadow-sm">
          <div className="text-center mb-8">
            <h3 className="logo-font text-2xl font-bold">Apply For Ambassador Role</h3>
            <p className="text-xs text-slate-500 mt-1">Submit your background details to schedule a call.</p>
          </div>

          {status === 'success' ? (
            <div className="bg-brand-purple/5 border border-brand-purple/20 p-6 rounded-2xl text-center space-y-4 animate-fade-in">
              <CheckCircle className="w-12 h-12 text-brand-purple mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                Your application has been received. Our campus team will reach out within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} 
                    className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" 
                    placeholder="Enter your name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={form.email} 
                    onChange={(e) => setForm({...form, email: e.target.value})} 
                    className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" 
                    placeholder="name@college.edu" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={form.phone} 
                    onChange={(e) => setForm({...form, phone: e.target.value})} 
                    className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" 
                    placeholder="+91 98765 43210" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">College Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={form.college} 
                    onChange={(e) => setForm({...form, college: e.target.value})} 
                    className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" 
                    placeholder="Enter your college / institute" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Current Year *</label>
                  <select 
                    value={form.year} 
                    onChange={(e) => setForm({...form, year: e.target.value})} 
                    className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Stream / Major *</label>
                  <input 
                    type="text" 
                    required 
                    value={form.stream} 
                    onChange={(e) => setForm({...form, stream: e.target.value})} 
                    className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" 
                    placeholder="e.g. B.Tech CSE, BBA, B.Com" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Why do you want to join our network? *</label>
                <textarea 
                  rows={4} 
                  required 
                  value={form.whyApply} 
                  onChange={(e) => setForm({...form, whyApply: e.target.value})} 
                  className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none text-slate-900 transition-all" 
                  placeholder="Describe your motivation, leadership experience, or previous outreach roles..."
                ></textarea>
              </div>

              {/* Disclaimer */}
              <div className="bg-slate-100 p-4 rounded-xl flex items-start space-x-2 text-[10px] text-slate-500 leading-normal border border-slate-200/60">
                <ShieldAlert className="w-4.5 h-4.5 text-brand-purple flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Selection Notice:</strong> Submitting this form does not guarantee selection. Final decisions are subject to college enrollment verification and a brief screening call.
                </p>
              </div>

              <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-brand-purple/10">
                <Send className="w-4 h-4" />
                <span>Submit Application</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
