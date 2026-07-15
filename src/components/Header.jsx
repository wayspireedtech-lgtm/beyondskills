import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, GraduationCap, Briefcase, User, LogOut, Code, Megaphone } from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/mockDb';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [agencyDropdown, setAgencyDropdown] = useState(false);
  const [coursesDropdown, setCoursesDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll event watcher to trigger the squeeze effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Watch for auth changes
  useEffect(() => {
    const checkAuth = () => {
      const user = getDbItem('beyondskills_current_user', null);
      setCurrentUser(user);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
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
    <header className="sticky top-0 z-50 w-full bg-transparent pointer-events-none flex flex-col items-center">
      <div className={`transition-all duration-500 ease-in-out pointer-events-auto mx-auto ${
        isScrolled 
          ? `max-w-6xl w-[92%] mt-3 ${isOpen ? 'rounded-3xl' : 'rounded-full'} bg-white/90 border border-slate-200/80 shadow-2xl shadow-slate-200/30 backdrop-blur-lg px-6` 
          : `max-w-6xl w-[92%] mt-4 ${isOpen ? 'rounded-3xl' : 'rounded-full'} bg-white border border-slate-200/70 shadow-lg px-6`
      }`}>
        <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-14' : 'h-20'}`}>
          {/* Logo */}
          <div className="lg:flex-1 lg:flex lg:justify-start flex-shrink-0">
            <Link to="/" className="flex flex-col items-start leading-none group">
              <div className="flex items-center">
                <span className={`logo-font font-extrabold tracking-tight text-slate-900 transition-all duration-500 group-hover:text-slate-700 ${isScrolled ? 'text-lg sm:text-xl' : 'text-3xl sm:text-[34px]'}`}>
                  Beyond
                </span>
                <span className={`logo-font font-extrabold tracking-tight bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] bg-clip-text text-transparent transition-all duration-500 group-hover:brightness-110 ${isScrolled ? 'text-lg sm:text-xl' : 'text-3xl sm:text-[34px]'}`}>
                  Skills
                </span>
              </div>
              {!isScrolled && (
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.16em] mt-1.5 select-none leading-none">
                  Digital Services • Professional Programs • Future-Ready
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation Capsule Bar */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center">
            <nav className={`flex items-center transition-all duration-500 ${
              isScrolled 
                ? 'bg-transparent border-0 shadow-none' 
                : 'bg-slate-100/70 border border-slate-200/40 rounded-full px-2 py-1.5 shadow-sm'
            } hover:border-[#2A4BFF]/20 transition-all duration-300`}>
              {/* 1. Home */}
              <Link to="/" className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${location.pathname === '/' ? 'text-white bg-[#2A4BFF] shadow-md shadow-[#2A4BFF]/25' : 'text-slate-655 hover:text-[#2A4BFF] hover:bg-slate-150'}`}>
                Home
              </Link>

              {/* 2. Services Dropdown */}
              <div className="relative" 
                   onMouseEnter={() => setAgencyDropdown(true)}
                   onMouseLeave={() => setAgencyDropdown(false)}>
                <button className={`flex items-center space-x-1 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none ${location.pathname.startsWith('/services') ? 'text-white bg-[#2A4BFF] shadow-md shadow-[#2A4BFF]/25' : 'text-slate-655 hover:text-[#2A4BFF] hover:bg-slate-150'}`}>
                  <span>Services</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                
                {agencyDropdown && (
                  <div className="absolute left-0 top-full w-64 pt-2 z-50 animate-fade-in">
                    <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-2">
                      <Link to="/services/website-development" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700">
                        <Code className="w-5 h-5 text-[#2A4BFF] mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Website Development</p>
                          <p className="text-xs text-slate-500">Custom web apps & ecommerce</p>
                        </div>
                      </Link>
                      <Link to="/services/digital-marketing" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700">
                        <Megaphone className="w-5 h-5 text-[#2A4BFF] mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Digital Marketing</p>
                          <p className="text-xs text-slate-500">Google, Meta Ads & Strategy</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Career Accelerator Program Dropdown */}
              <div className="relative"
                   onMouseEnter={() => setCoursesDropdown(true)}
                   onMouseLeave={() => setCoursesDropdown(false)}>
                <button className={`flex items-center space-x-1 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none ${location.pathname.startsWith('/courses') ? 'text-white bg-[#2A4BFF] shadow-md shadow-blue-500/20' : 'text-slate-655 hover:text-[#2A4BFF] hover:bg-slate-150'}`}>
                  <span>Training Programs</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {coursesDropdown && (
                  <div className="absolute left-0 top-full w-72 pt-2 z-50 animate-fade-in">
                    <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-2">
                      <div className="px-3 py-1 text-[10px] font-bold text-[#0EA5E9] tracking-widest uppercase border-b border-slate-100 mb-1 pb-1">
                        Certification Programs
                      </div>
                      <Link to="/courses" className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-700">
                        <GraduationCap className="w-5 h-5 text-[#2A4BFF] mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">All Courses</p>
                          <p className="text-[11px] text-slate-500">Browse upskilling programs</p>
                        </div>
                      </Link>
                      <Link to="/programs/ai-data-science" className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#2A4BFF] rounded hover:bg-slate-50">
                        Artificial Intelligence & Data Science
                      </Link>
                      <Link to="/programs/full-stack-web-development" className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#2A4BFF] rounded hover:bg-slate-50">
                        Full Stack Web Dev (MERN)
                      </Link>
                      <Link to="/courses?cat=Digital Marketing" className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#2A4BFF] rounded hover:bg-slate-50">
                        Performance Ads & SEO
                      </Link>
                      <Link to="/courses?cat=HR" className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#2A4BFF] rounded hover:bg-slate-50">
                        HR Management
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 3.5. Campus Ambassador */}
              <Link to="/ambassador" className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${location.pathname === '/ambassador' ? 'text-white bg-[#2A4BFF] shadow-md shadow-blue-500/20' : 'text-slate-655 hover:text-[#2A4BFF] hover:bg-slate-150'}`}>
                Campus Ambassador
              </Link>

              {/* 4. Blog */}
              <Link to="/blog" className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${location.pathname === '/blog' ? 'text-white bg-[#2A4BFF] shadow-md shadow-blue-500/20' : 'text-slate-655 hover:text-[#2A4BFF] hover:bg-slate-150'}`}>
                Blog
              </Link>

              {/* 5. About Us */}
              <Link to="/about" className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${location.pathname === '/about' ? 'text-white bg-[#2A4BFF] shadow-md shadow-blue-500/20' : 'text-slate-655 hover:text-[#2A4BFF] hover:bg-slate-150'}`}>
                About
              </Link>

              {/* 6. Contact */}
              <Link to="/contact" className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${location.pathname === '/contact' ? 'text-white bg-[#2A4BFF] shadow-md shadow-blue-500/20' : 'text-slate-655 hover:text-[#2A4BFF] hover:bg-slate-150'}`}>
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                {!isScrolled && (
                  <span className="text-xs text-slate-600 font-mono bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                    ID: {currentUser.studentId || 'Admin'}
                  </span>
                )}
                
                {currentUser.email === 'beyondskills.ai@gmail.com' ? (
                  <Link to="/admin" className={`text-xs font-semibold uppercase tracking-wider text-[#2A4BFF] hover:bg-[#2A4BFF] hover:text-white bg-[#2A4BFF]/10 border border-[#2A4BFF]/25 rounded-full transition-all ${isScrolled ? 'px-3 py-1.5' : 'px-4 py-2'}`}>
                    Admin Portal
                  </Link>
                ) : (
                  <Link to="/dashboard" className={`text-xs font-semibold uppercase tracking-wider text-[#2A4BFF] hover:bg-[#2A4BFF] hover:text-white bg-[#2A4BFF]/10 border border-[#2A4BFF]/25 rounded-full transition-all ${isScrolled ? 'px-3 py-1.5' : 'px-4 py-2'}`}>
                    Dashboard
                  </Link>
                )}

                <button onClick={handleLogout} className="text-slate-500 hover:text-slate-800 p-2 focus:outline-none cursor-pointer" title="Log Out">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-5">
                <Link to="/verify" className="text-xs font-bold uppercase tracking-wider text-slate-550 hover:text-[#2A4BFF] transition-colors">
                  Verify
                </Link>
                <Link to="/auth" className={`bg-[#2A4BFF] text-white hover:brightness-110 shadow-md shadow-blue-500/20 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-105 ${isScrolled ? 'px-4 py-1.5' : 'px-6 py-3'}`}>
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 pt-2 pb-6 space-y-3">
          <Link to="/" className="block px-3 py-2 text-base font-semibold text-slate-700 hover:text-[#2A4BFF] border-b border-slate-100">
            Home
          </Link>
          
          <div className="px-3 py-1 text-[11px] font-bold text-[#0EA5E9] tracking-widest uppercase">
            Services
          </div>
          <Link to="/services/website-development" className="block px-6 py-1.5 text-sm hover:text-[#2A4BFF] text-slate-600">
            Website Development
          </Link>
          <Link to="/services/digital-marketing" className="block px-6 py-1.5 text-sm hover:text-[#2A4BFF] text-slate-600">
            Digital Marketing
          </Link>

          <div className="px-3 py-1 text-[11px] font-bold text-[#0EA5E9] tracking-widest uppercase">
            Training Programs
          </div>
          <Link to="/courses" className="block px-6 py-1.5 text-sm hover:text-[#2A4BFF] text-slate-600">
            All Certification Courses
          </Link>

          <Link to="/ambassador" className="block px-3 py-2 text-base font-semibold text-slate-700 hover:text-[#2A4BFF] border-b border-slate-100">
            Campus Ambassador Program
          </Link>

          <Link to="/blog" className="block px-3 py-2 text-base font-semibold text-slate-700 hover:text-[#2A4BFF] border-b border-slate-100">
            Blog
          </Link>
          <Link to="/about" className="block px-3 py-2 text-base font-semibold text-slate-700 hover:text-[#2A4BFF] border-b border-slate-100">
            About Us
          </Link>
          <Link to="/contact" className="block px-3 py-2 text-base font-semibold text-slate-700 hover:text-[#2A4BFF] border-b border-slate-100">
            Contact
          </Link>
          <Link to="/verify" className="block px-3 py-2 text-base font-semibold text-slate-700 hover:text-[#2A4BFF] border-b border-slate-100">
            Verify Certificate
          </Link>

          {currentUser ? (
            <div className="pt-4 px-3 flex flex-col space-y-3">
              <span className="text-xs text-slate-500 font-mono">
                Student ID: {currentUser.studentId || 'Admin'}
              </span>
              {currentUser.email === 'beyondskills.ai@gmail.com' ? (
                <Link to="/admin" className="text-center bg-[#2A4BFF]/10 text-[#2A4BFF] hover:bg-[#2A4BFF] hover:text-white border border-[#2A4BFF]/20 font-bold py-2 rounded-lg">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="text-center bg-[#2A4BFF] text-white hover:brightness-110 font-bold py-2 rounded-lg shadow-lg shadow-blue-500/20">
                  Student Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center justify-center space-x-2 text-slate-500 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-800 cursor-pointer">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 px-3">
              <Link to="/auth" className="block text-center bg-[#2A4BFF] text-white font-bold py-2.5 rounded-full uppercase tracking-wider text-xs hover:brightness-110 shadow-lg shadow-blue-500/20">
                Login
              </Link>
            </div>
          )}
        </div>
      )}
      </div>
    </header>
  );
}
