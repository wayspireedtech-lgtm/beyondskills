import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Calendar, Shield } from 'lucide-react';

export default function TermsAndConditions() {
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-brand-purple transition-all group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero header */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center space-x-3 text-brand-purple mb-4">
            <Shield className="w-6 h-6" />
            <span className="text-xs font-extrabold uppercase tracking-widest bg-brand-purple/10 px-2.5 py-1 rounded-full">
              User Agreement
            </span>
          </div>
          
          <h1 className="logo-font text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Terms & Conditions
          </h1>
          
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last Updated: January 10, 2026</span>
            </span>
            <span className="flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Version 1.8</span>
            </span>
          </div>
        </div>

        {/* Terms Content */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200/80 space-y-12 text-slate-600 leading-relaxed text-sm">
          
          <div>
            <p className="text-base text-slate-700 font-medium mb-4">
              Welcome to BeyondSkills! These Terms and Conditions govern your use of our platforms, educational courses, and services.
            </p>
            <p>
              By accessing our website at <a href="https://www.beyondskills.in" className="text-brand-purple font-semibold hover:underline">https://www.beyondskills.in</a> (or related domains), you accept and agree to be bound by these Terms. If you do not agree, please discontinue use immediately.
            </p>
          </div>

          <hr className="border-slate-200" />

          {/* Section 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">1</span>
              <span>Terminology</span>
            </h3>
            <p>
              “You”, “User”, and “Your” refer to the person accessing this website and registering for services. “BeyondSkills”, “We”, “Us”, and “Our” refer to BeyondSkills. All terms apply to all agreements necessary for providing services in accordance with the applicable laws of India.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">2</span>
              <span>Cookies</span>
            </h3>
            <p>
              We use cookies to enhance your experience. By accessing BeyondSkills, you consent to the use of cookies in accordance with our Privacy Policy.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">3</span>
              <span>Intellectual Property Rights</span>
            </h3>
            <p>
              Unless otherwise stated, BeyondSkills owns all intellectual property rights on this website. All rights are reserved. You may access content for personal use only and must not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-500">
              <li>Republish or redistribute content from our website or LMS platforms.</li>
              <li>Sell, rent, or sub-license course syllabus, recordings, or resources.</li>
              <li>Reproduce, duplicate, or copy content for public or commercial purposes.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">4</span>
              <span>User Content & Comments</span>
            </h3>
            <p>
              Users may post comments, queries, or code scripts on our student dashboards. BeyondSkills reserves the right to remove any content deemed inappropriate, hostile, or infringing. By posting content, you grant BeyondSkills a non-exclusive license to use, reproduce, and distribute your content across our platforms.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">5</span>
              <span>Hyperlinking to our Content</span>
            </h3>
            <p>
              Certain organizations (academic institutes, search engines, news entities) may link to our website without prior written approval. We reserve the right to approve or deny any link request depending on context. No use of BeyondSkills’ logo or brand asset will be allowed for linking absent a trademark license agreement.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">6</span>
              <span>iFrames</span>
            </h3>
            <p>
              Without prior approval and written permission, you may not create frames around our web pages that alter in any way the visual presentation or appearance of our website.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">7</span>
              <span>Content Liability</span>
            </h3>
            <p>
              We shall not be held responsible for any content that appears on external websites that link to us. You agree to protect and defend us against all claims arising out of external links.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">8</span>
              <span>Reservation of Rights</span>
            </h3>
            <p>
              We reserve the right to request that you remove all links or any particular link to our website. You approve to immediately remove all links to our website upon request. We also reserve the right to amend these Terms and Conditions and its linking policy at any time.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">9</span>
              <span>Disclaimer</span>
            </h3>
            <p>
              To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. All educational services are provided "as is". BeyondSkills makes no warranties of professional placement or employment, and will not be liable for damages arising from use of the website or platform resources.
            </p>
          </div>

          {/* Section 10 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">10</span>
              <span>Refund Policy Summary</span>
            </h3>
            <p>
              All purchases of digital products, workspace provisioning, and course enrollments are final and non-refundable. Please review our dedicated Refund Policy page for details on exceptional refund cases.
            </p>
          </div>

          <hr className="border-slate-200" />
          
          <div className="space-y-4 text-xs text-slate-400">
            <p className="font-bold text-slate-700">Official Contact Details:</p>
            <ul className="space-y-1">
              <li>Email: <a href="mailto:support@beyondskills.in" className="text-brand-purple hover:underline">support@beyondskills.in</a></li>
              <li>Call Support: +91 81309 27999</li>
              <li>Address: Udyog Vihar, Gurugram, Haryana</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
