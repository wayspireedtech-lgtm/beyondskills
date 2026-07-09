import React from 'react';
import { Target, Eye, ShieldCheck, Milestone, Calendar, Sparkles } from 'lucide-react';
import { MENTORS } from '../utils/mockDb';

export default function About() {
  const coreValues = [
    { title: 'Industry Relevance', desc: 'Bridging the gap between theory and actual corporate processes through practical project tasks.', icon: Target },
    { title: 'Expert Guidance', desc: 'Direct feedback and live sessions run by managers with 5+ years of active market exposure.', icon: ShieldCheck },
    { title: 'Compliance & Honesty', desc: 'A strict, transparent placement disclaimer across all operations and clear separation of business verticals.', icon: Milestone }
  ];

  const timeline = [
    { year: '2022', title: 'Company Registered & Launched', desc: 'Founded with a dual focus: delivering custom web/digital services to startups and launching localized tech training programs.' },
    { year: '2023', title: '100+ Delivered Agency Projects', desc: 'Scaled operations to deliver custom portals for SMEs, expanding our expert mentors base to 20+ managers.' },
    { year: '2024', title: '5,000+ Enrolled Learners', desc: 'Launched the dedicated student login platform, integrating payment and certificate verification features.' },
    { year: '2025', title: 'Accreditation & Growth', desc: 'Recognized as one of Indias growing platforms with 10,000+ graduates and 250+ successfully delivered agency contracts.' },
    { year: '2026', title: 'BeyondSkills Integrated Workspace', desc: 'Deploying our integrated student onboarding flow, enabling PDF invoice tools and automatic project checks.' }
  ];

  return (
    <div className="text-slate-900 relative pt-12">
      
      {/* Decorative Glow */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] animate-pulse-glow z-0"></div>

      {/* Hero Header */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 text-center z-10">
        <span className="text-brand-purple text-xs font-bold tracking-widest uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5">
          About BeyondSkills
        </span>
        <h1 className="logo-font text-4xl sm:text-6xl font-extrabold tracking-tight mt-6">
          The Journey Behind the <br />
          <span className="bg-gradient-to-r from-[#1B2A8A] to-[#2563EB] bg-clip-text text-transparent">
            Agency & Academy
          </span>
        </h1>
        <p className="mt-6 text-slate-500 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
          Founded in 2022, BeyondSkills operates as a combined technology services organization. 
          We solve digital problems for enterprises through our Agency, and train the next generation of technicians through our Academy.
        </p>
      </section>

      {/* Story, Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="logo-font text-2xl sm:text-3xl font-bold text-slate-900">Our Story</h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed text-justify">
              In 2022, we saw two prominent issues: growing startups struggling to find skilled teams to deploy high-quality software, and fresh graduates unable to crack technical interviews due to a lack of hands-on build experience.
            </p>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed text-justify">
              BeyondSkills was established to resolve both. By hiring active programmers and digital advertisers to build real client projects inside our Agency vertical, and setting them up to instruct college students and career transitioners in our Academy vertical, we created a self-reinforcing practical learning environment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="glass-panel p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3 text-brand-purple mb-3">
                <Target className="w-6 h-6" />
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Our Mission</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                To empower individuals and organizations through high-quality digital services and practical education that bridges the gap between academic learning and industry requirements.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3 text-brand-purple mb-3">
                <Eye className="w-6 h-6" />
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Our Vision</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                To become one of India's most trusted digital transformation and professional upskilling platforms by delivering measurable value through technology, education, and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <h2 className="logo-font text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-12">Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-slate-100 border border-slate-200/60 p-6 rounded-xl text-center">
                <div className="flex justify-center text-brand-purple mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">{v.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
        <h2 className="logo-font text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-16">Company Timeline</h2>
        <div className="relative border-l border-slate-200 pl-6 space-y-12">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[31px] bg-brand-purple p-1 rounded-full text-black">
                <Calendar className="w-3 h-3" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded border border-brand-purple/30">
                  {item.year}
                </span>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-2">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative border-t border-slate-200">
        <h2 className="logo-font text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-4">Our Leadership</h2>
        <p className="text-center text-slate-500 text-xs sm:text-sm mb-12">Experienced industry directors steering the Agency and Academy projects.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {MENTORS.map((m, idx) => (
            <div key={idx} className="text-center">
              <img src={m.image} alt={m.name} className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border border-slate-200" />
              <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
              <p className="text-xs text-brand-purple font-medium mt-0.5">{m.role}</p>
              <p className="text-[10px] text-slate-500">{m.org} • {m.exp} Exp</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
