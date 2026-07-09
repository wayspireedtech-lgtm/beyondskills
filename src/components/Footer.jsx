import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldAlert, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-650">
      
      {/* Placement Disclaimer Header / Banner */}
      <div className="bg-slate-100/60 border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex items-center space-x-3 text-brand-purple">
            <ShieldAlert className="w-8 h-8 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">MANDATORY COMPLIANCE DISCLAIMER</h4>
              <p className="text-xs text-slate-500">Please read our educational scope & placement conditions below.</p>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 max-w-4xl text-left leading-relaxed">
            <strong>NO JOB OR PLACEMENT GUARANTEE:</strong> BeyondSkills does not guarantee employment, internships, placements, salary packages, or job offers. Enrollment does not create entitlement to employment. Our academy provides education, industry mentorship, practical projects, and skills verification certificates. Learners remain fully responsible for their own career progression and job search outcomes.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand Info */}
          <div>
            <Link to="/" className="flex flex-col items-start leading-none group mb-6">
              <div className="flex items-center">
                <span className="logo-font text-2.5xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-slate-750">
                  Beyond
                </span>
                <span className="logo-font text-2.5xl font-extrabold tracking-tight bg-gradient-to-r from-[#1B2A8A] to-[#2563EB] bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110">
                  Skills
                </span>
              </div>
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.16em] mt-1 select-none leading-none">
                Digital Services • Upskilling • Future-Ready
              </span>
            </Link>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              Accelerating digital growth for brands through our cutting-edge Agency services while equipping developers, marketers, and leaders of tomorrow with industry-focused upskilling.
            </p>
            <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-5">
              We don't just follow the future. <br />
              <span className="text-brand-purple">We help you build it.</span>
            </p>
            <div className="flex flex-col space-y-2">
              <span className="text-[9px] font-bold tracking-widest text-brand-purple uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5 w-fit">
                ESTD. 2022
              </span>
              <span className="text-[9px] font-bold tracking-wider text-brand-blue uppercase select-none">
                INNOVATE | EMPOWER | GROW BEYOND
              </span>
            </div>
          </div>

          {/* Column 2: Agency & Services */}
          <div>
            <h3 className="text-slate-900 font-bold text-sm tracking-widest uppercase mb-6 border-l-2 border-brand-purple pl-3">
              Agency Services
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/services/website-development" className="hover:text-brand-purple transition-colors">
                  Website Development
                </Link>
              </li>
              <li>
                <Link to="/services/website-development" className="hover:text-brand-purple transition-colors">
                  Custom Web Applications
                </Link>
              </li>
              <li>
                <Link to="/services/digital-marketing" className="hover:text-brand-purple transition-colors">
                  Google & Meta Ads
                </Link>
              </li>
              <li>
                <Link to="/services/digital-marketing" className="hover:text-brand-purple transition-colors">
                  Performance Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academy Courses */}
          <div>
            <h3 className="text-slate-900 font-bold text-sm tracking-widest uppercase mb-6 border-l-2 border-brand-purple pl-3">
              Upskilling Academy
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/courses" className="hover:text-brand-purple transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/courses?cat=AI/ML/DS/DA" className="hover:text-brand-purple transition-colors">
                  AI & Data Science
                </Link>
              </li>
              <li>
                <Link to="/courses?cat=Full Stack Development" className="hover:text-brand-purple transition-colors">
                  Full Stack Development
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-brand-purple transition-colors">
                  Certificate Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Reach Us */}
          <div>
            <h3 className="text-slate-900 font-bold text-sm tracking-widest uppercase mb-6 border-l-2 border-brand-purple pl-3">
              Reach Us
            </h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
                <span>Sector 62, Electronic City, Noida, UP, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-purple flex-shrink-0" />
                <span>connect@beyondskills.in</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-purple flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Compliance Disclaimers */}
        <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs text-slate-500 leading-relaxed text-justify">
          <div>
            <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-2">EDUCATIONAL SCOPE & POLICIES</h5>
            <p>
              All academic certifications and learning materials provided by BeyondSkills Academy are designed for Basic to Intermediate levels of industry education. The programs are structured to deliver project-based knowledge, code repositories development, and guided support. Completion of course requirements signifies participation, syllabus coverage, and passing standard test templates, and does not certify professional expertise or licensing.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-2">BUSINESS VERTICAL SEPARATION</h5>
            <p>
              The Digital Marketing & Web Development Agency and the Upskilling Academy operate as distinct commercial business verticals. Agency services (custom programming, digital strategy campaigns, ads placement) are governed by specific corporate agreements and deliverables SLA. Educational classes, recorded video lessons, student login workspace access, and assessments are governed exclusively by candidate enrollment terms.
            </p>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BeyondSkills. All rights reserved. Registered 2022.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-brand-purple transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-purple transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-purple transition-colors">Refund Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
