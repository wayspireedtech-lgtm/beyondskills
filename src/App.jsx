import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Courses from './pages/Courses';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';
import AdminDashboard from './pages/AdminDashboard';
import CourseDetails from './pages/CourseDetails';
import FullStackProgram from './pages/FullStackProgram';
import CampusAmbassador from './pages/CampusAmbassador';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ReturnRefundPolicy from './pages/ReturnRefundPolicy';
import AiBrochure from './pages/AiBrochure';
import { Mail, Sparkles, X } from 'lucide-react';

// Scroll to top on navigation change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// App shell wrapper to optionally hide header/footer on portal interfaces
function LayoutWrapper({ children }) {
  const location = useLocation();
  
  // Hide headers/footers on specific onboarding/checkout paths if desired
  const isPortal = ['/checkout', '/onboarding'].includes(location.pathname);
  
  return (
    <div id="glow-bg-container" className="flex flex-col min-h-screen bg-white text-slate-900 relative">
      <div className="bg-grid-glow"></div>
      <div className="bg-grid-pattern"></div>
      
      {/* Floating Developer Tools Logos in the background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* React */}
        <svg viewBox="-11.5 -10.23 23 20.46" className="w-16 h-16 text-[#61DAFB] opacity-[0.03] absolute top-[12%] left-[6%] animate-float pointer-events-none" style={{ animationDuration: '8s' }}>
          <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
        {/* Node.js */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-[#339933] opacity-[0.03] absolute top-[24%] right-[6%] animate-float pointer-events-none" style={{ animationDuration: '10s', animationDelay: '1s' }}>
          <path d="M12 2L2 7.7v10.6L12 24l10-5.7V7.7L12 2zm-1 18.5l-6-3.5v-7l6 3.5v7zm1-8.7L6 8.3l6-3.5 6 3.5-6 3.5zm7 5.2l-6 3.5v-7l6-3.5v7z"/>
        </svg>
        {/* Python */}
        <svg viewBox="0 0 448 512" fill="currentColor" className="w-14 h-14 text-[#3776AB] opacity-[0.03] absolute top-[42%] left-[10%] animate-float pointer-events-none" style={{ animationDuration: '9s', animationDelay: '2s' }}>
          <path d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2{h-40.1}v47.4c0 36.8-31.2 60.8-66.8 60.8H185.9c-9.9 0-17.9 8-17.9 17.9v45.7c0 9.9 8 17.9 17.9 17.9h148c30.1 0 53.4-23.3 53.4-53.4v-40.1c31.1 0 54.2-14.6 54.2-45.7-.1-.1-.1-2.9-.2-6.1zm-86.8-12c-12 0-21.6-9.7-21.6-21.7s9.7-21.7 21.6-21.7c12 0 21.7 9.7 21.7 21.7s-9.7 21.7-21.7 21.7zM8.2 311.5c7.7 30.9 22.3 54.2 53.4 54.2h40.1v-47.4c0-36.8 31.2-60.8 66.8-60.8h93.6c9.9 0 17.9-8 17.9-17.9v-45.7c0-9.9-8-17.9-17.9-17.9h-148c-30.1 0-53.4 23.3-53.4 53.4v40.1c-31.1 0-54.2 14.6-54.2 45.7 0 .1 0 2.9.2 6.1zm86.8 12c12 0 21.6 9.7 21.6 21.7s-9.7 21.7-21.6 21.7c-12 0-21.7-9.7-21.7-21.7s9.7-21.7 21.7-21.7z" />
        </svg>
        {/* JS */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-[#F7DF1E] opacity-[0.03] absolute top-[55%] right-[9%] animate-float pointer-events-none" style={{ animationDuration: '11s', animationDelay: '0.5s' }}>
          <rect x="2" y="2" width="20" height="20" rx="3"/>
          <text x="12" y="17" fill="black" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">JS</text>
        </svg>
        {/* MongoDB */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-[#47A248] opacity-[0.03] absolute top-[72%] left-[8%] animate-float pointer-events-none" style={{ animationDuration: '12s', animationDelay: '3s' }}>
          <path d="M12 .587c0 .587-4.103 5.753-4.103 10.155s2.434 6.666 4.103 8.358c1.669-1.692 4.103-3.956 4.103-8.358S12 1.174 12 .587zm0 13.793a1.986 1.986 0 1 1 0-3.972 1.986 1.986 0 0 1 0 3.972zM12 21.05c-1.391-.837-7.234-5.267-7.234-11.458C4.766 4.673 8.653 2.122 12 1.584c3.347.538 7.234 3.089 7.234 8.008 0 6.191-5.843 10.621-7.234 11.458z" />
        </svg>
        {/* AWS */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-[#FF9900] opacity-[0.03] absolute top-[85%] right-[12%] animate-float pointer-events-none" style={{ animationDuration: '9s', animationDelay: '1.5s' }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.29 14.29c-.38.38-.89.59-1.42.59s-1.04-.21-1.42-.59L6.5 12.33c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0l3.08 3.08 6.08-6.08c.78-.78 2.05-.78 2.83 0 .78.78.78 2.05 0 2.83l-7.03 7.03z" />
        </svg>
        {/* Figma */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-[#F24E1E] opacity-[0.03] absolute top-[32%] right-[22%] animate-float pointer-events-none" style={{ animationDuration: '10s', animationDelay: '2.5s' }}>
          <path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4zm-4 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4v-4zm8 0h-4v4a4 4 0 0 0 4-4v-4zm-8-8H4v4a4 4 0 0 0 4 4V2zm4 16H8a4 4 0 0 0 4 4V18z"/>
        </svg>
      </div>

      {!isPortal && <Header />}
      <main className="flex-grow z-10 relative bg-transparent">
        {children}
      </main>
      {!isPortal && <Footer />}
    </div>
  );


}

export default function App() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = document.getElementById('glow-bg-container');
      if (container) {
        container.style.setProperty('--mouse-x', `${e.clientX}px`);
        container.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleToast = (e) => {
      setToast(e.detail);
      // Auto dismiss after 7 seconds
      const timer = setTimeout(() => {
        setToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beyondskills_toast', handleToast);
    return () => window.removeEventListener('beyondskills_toast', handleToast);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      
      {/* Toast Notification for email simulated alert / SLA responses */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-gray-900 border border-brand-purple/40 rounded-xl shadow-2xl p-4 animate-fade-in backdrop-blur-xl">
          <div className="flex items-start space-x-3">
            <div className="bg-brand-purple/20 p-2 rounded-lg text-brand-purple">
              <Mail className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-brand-purple uppercase tracking-wider">Simulated SLA Email Alert</p>
                <button onClick={() => setToast(null)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-semibold text-white mt-1">{toast.subject}</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed whitespace-pre-line">{toast.body}</p>
              <span className="text-[10px] text-brand-purple font-mono mt-2 block">
                ⚡ Received within 5 seconds of submission (Target SLA: 5 minutes)
              </span>
            </div>
          </div>
        </div>
      )}

      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services/:serviceId" element={<Services />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/course/:courseId/brochure" element={<AiBrochure />} />
          <Route path="/programs/full-stack-web-development" element={<FullStackProgram />} />
          <Route path="/ambassador" element={<CampusAmbassador />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}
