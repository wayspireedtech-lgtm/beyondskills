import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, GraduationCap, Briefcase, User, LogOut, Code, Megaphone } from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/mockDb';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [agencyDropdown, setAgencyDropdown] = useState(false);
  const [coursesDropdown, setCoursesDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Watch for auth changes
  useEffect(() => {
    const checkAuth = () => {
      const user = getDbItem('beyondskills_current_user', null);
      setCurrentUser(user);
    };
    checkAuth();
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);
    // Custom trigger event watcher
    window.addEventListener('auth_change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth_change', checkAuth);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('beyondskills_current_user');
    window.dispatchEvent(new Event('auth_change'));
    navigate('/');
  };

  // Close menus on page route changes
  useEffect(() => {
    setIsOpen(false);
    setAgencyDropdown(false);
    setCoursesDropdown(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex flex-col items-start leading-none group">
              <div className="flex items-center">
                <span className="logo-font text-2xl sm:text-[26px] font-extrabold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-slate-700">
                  Beyond
                </span>
                <span className="logo-font text-2xl sm:text-[26px] font-extrabold tracking-tight bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110">
                  Skills
                </span>
              </div>
              <span className="text-[7px] font-bold text-gray-400 uppercase tracking-[0.16em] mt-1 select-none leading-none">
                Digital Services • Upskilling • Future-Ready
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Capsule Bar */}
          <nav className="hidden lg:flex items-center bg-white/70 border border-slate-200/80 rounded-full px-2 py-1.5 shadow-sm shadow-slate-100/50 backdrop-blur-md hover:border-brand-purple/30 transition-all duration-300">
            <Link to="/" className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${location.pathname === '/' ? 'text-white bg-brand-purple shadow-md shadow-brand-purple/25 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'}`}>
              Home
            </Link>
            
            <Link to="/about" className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${location.pathname === '/about' ? 'text-white bg-brand-purple shadow-md shadow-brand-purple/25 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'}`}>
              About Us
            </Link>

            {/* Agency Hover Dropdown */}
            <div className="relative" 
                 onMouseEnter={() => setAgencyDropdown(true)}
                 onMouseLeave={() => setAgencyDropdown(false)}>
              <button className={`flex items-center space-x-1 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none ${location.pathname.startsWith('/services') ? 'text-white bg-brand-purple shadow-md shadow-brand-purple/25 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'}`}>
                <span>Agency</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              {agencyDropdown && (
                <div className="absolute left-0 w-64 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-2 animate-fade-in backdrop-blur-xl">
                  <Link to="/services/website-development" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <Code className="w-5 h-5 text-brand-purple mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Website Development</p>
                      <p className="text-xs text-slate-500">Custom web apps & ecommerce</p>
                    </div>
                  </Link>
                  <Link to="/services/digital-marketing" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <Megaphone className="w-5 h-5 text-brand-purple mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Digital Marketing</p>
                      <p className="text-xs text-slate-500">Google, Meta Ads & Strategy</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Academy Course Catalog Dropdown */}
            <div className="relative"
                 onMouseEnter={() => setCoursesDropdown(true)}
                 onMouseLeave={() => setCoursesDropdown(false)}>
              <button className={`flex items-center space-x-1 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none ${location.pathname.startsWith('/courses') ? 'text-white bg-brand-purple shadow-md shadow-brand-purple/25 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'}`}>
                <span>Academy</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              {coursesDropdown && (
                <div className="absolute left-0 w-72 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-2 animate-fade-in backdrop-blur-xl">
                  <div className="px-3 py-1 text-[10px] font-bold text-brand-purple tracking-widest uppercase border-b border-white/5 mb-1 pb-1">
                    Certification Programs
                  </div>
                  <Link to="/courses" className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <GraduationCap className="w-5 h-5 text-brand-purple mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">All Courses</p>
                      <p className="text-[11px] text-slate-500">Browse academy programs</p>
                    </div>
                  </Link>
                  <Link to="/courses?cat=AI/ML/DS/DA" className="block px-3 py-1.5 text-xs text-slate-600 hover:text-brand-purple rounded hover:bg-slate-50">
                    Artificial Intelligence & Data Science
                  </Link>
                  <Link to="/courses?cat=Full Stack Development" className="block px-3 py-1.5 text-xs text-slate-600 hover:text-brand-purple rounded hover:bg-slate-50">
                    Full Stack Web Dev (MERN)
                  </Link>
                  <Link to="/courses?cat=Digital Marketing" className="block px-3 py-1.5 text-xs text-slate-600 hover:text-brand-purple rounded hover:bg-slate-50">
                    Performance Ads & SEO
                  </Link>
                  <Link to="/courses?cat=HR" className="block px-3 py-1.5 text-xs text-slate-600 hover:text-brand-purple rounded hover:bg-slate-50">
                    HR Management
                  </Link>
                </div>
              )}
            </div>

            <Link to="/blog" className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${location.pathname === '/blog' ? 'text-white bg-brand-purple shadow-md shadow-brand-purple/25 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'}`}>
              Blogs
            </Link>

            <Link to="/contact" className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${location.pathname === '/contact' ? 'text-white bg-brand-purple shadow-md shadow-brand-purple/25 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'}`}>
              Contact
            </Link>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-500 font-mono bg-white/5 px-2.5 py-1 rounded border border-white/5">
                  ID: {currentUser.studentId || 'Admin'}
                </span>
                
                {currentUser.email === 'admin@beyondskills.in' ? (
                  <Link to="/admin" className="text-xs font-semibold uppercase tracking-wider text-brand-cyan hover:bg-brand-cyan hover:text-white bg-brand-cyan/5 border border-brand-cyan/20 px-4 py-2 rounded-full transition-all">
                    Admin Portal
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-xs font-semibold uppercase tracking-wider text-brand-purple hover:bg-brand-purple hover:text-white bg-brand-purple/5 border border-brand-purple/20 px-4 py-2 rounded-full transition-all">
                    Dashboard
                  </Link>
                )}

                <button onClick={handleLogout} className="text-slate-500 hover:text-slate-800 p-2 focus:outline-none" title="Log Out">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/verify" className="text-xs text-slate-500 hover:text-white px-3 py-2">
                  Verify Certificate
                </Link>
                <Link to="/auth" className="bg-brand-purple text-white hover:brightness-115 shadow-sm shadow-brand-purple/25 px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-105">
                  Student Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <Link to="/" className="block px-3 py-2 text-base font-semibold text-slate-800 hover:text-brand-purple border-b border-slate-100">
            Home
          </Link>
          <Link to="/about" className="block px-3 py-2 text-base font-semibold text-slate-800 hover:text-brand-purple border-b border-slate-100">
            About Us
          </Link>
          
          <div className="px-3 py-1 text-[11px] font-bold text-brand-purple tracking-widest uppercase">
            Agency Services
          </div>
          <Link to="/services/website-development" className="block px-6 py-1.5 text-sm hover:text-brand-purple text-slate-600">
            Website Development
          </Link>
          <Link to="/services/digital-marketing" className="block px-6 py-1.5 text-sm hover:text-brand-purple text-slate-600">
            Digital Marketing
          </Link>

          <div className="px-3 py-1 text-[11px] font-bold text-brand-purple tracking-widest uppercase">
            Academy Programs
          </div>
          <Link to="/courses" className="block px-6 py-1.5 text-sm hover:text-brand-purple text-slate-600">
            All Certification Courses
          </Link>

          <Link to="/blog" className="block px-3 py-2 text-base font-semibold text-slate-800 hover:text-brand-purple border-b border-slate-100">
            Blogs
          </Link>
          <Link to="/contact" className="block px-3 py-2 text-base font-semibold text-slate-800 hover:text-brand-purple border-b border-slate-100">
            Contact
          </Link>
          <Link to="/verify" className="block px-3 py-2 text-base font-semibold text-slate-800 hover:text-brand-purple border-b border-slate-100">
            Verify Certificate
          </Link>

          {currentUser ? (
            <div className="pt-4 px-3 flex flex-col space-y-3">
              <span className="text-xs text-slate-500 font-mono">
                Student ID: {currentUser.studentId || 'Admin'}
              </span>
              {currentUser.email === 'admin@beyondskills.in' ? (
                <Link to="/admin" className="text-center bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan hover:text-white border border-brand-cyan/20 text-center font-bold py-2 rounded-lg">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="text-center bg-brand-purple text-white hover:brightness-110 text-center font-bold py-2 rounded-lg">
                  Student Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center justify-center space-x-2 text-slate-500 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-850">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 px-3">
              <Link to="/auth" className="block text-center bg-brand-purple text-white font-bold py-2.5 rounded-full uppercase tracking-wider text-xs text-center hover:brightness-110">
                Student Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
