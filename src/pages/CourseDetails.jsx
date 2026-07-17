import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, Clock, BookOpen, Award, CheckCircle, 
  ChevronDown, ChevronUp, Users, ShieldAlert, FileText, 
  ExternalLink, Code, CheckSquare, Sparkles, HelpCircle 
} from 'lucide-react';
import { COURSES } from '../utils/mockDb';
import TechIcon from '../components/TechIcon';

const COURSE_IMAGES = {
  'artificial-intelligence': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  'machine-learning': 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&auto=format&fit=crop&q=80',
  'data-science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  'data-analytics': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
  'ai-ml': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  'data-science-analytics': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  'full-stack-web': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  'digital-marketing-cert': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  'hr-mgmt': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80',
  'stock-market': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
  'cyber-security': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
  'cloud-computing': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
};

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [learningMode, setLearningMode] = useState('mentor-led');

  // Refs for scroll spy and navigation
  const overviewRef = useRef(null);
  const syllabusRef = useRef(null);
  const projectsRef = useRef(null);
  const mentorsRef = useRef(null);
  const faqRef = useRef(null);
  const heroRef = useRef(null);

  const course = COURSES.find(c => c.id === courseId);

  // Auto-expand first week on load
  useEffect(() => {
    if (course) {
      setExpandedWeeks({ 0: true });
    }
  }, [course]);

  // Scroll spy to toggle bottom sticky CTA bar and update active tab
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const scrollPosition = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      
      // Toggle bottom sticky bar after scrolling past hero
      setShowStickyBar(scrollPosition > heroHeight - 100);

      // Check current active section
      const sections = [
        { id: 'overview', ref: overviewRef },
        { id: 'syllabus', ref: syllabusRef },
        { id: 'projects', ref: projectsRef },
        { id: 'mentors', ref: mentorsRef },
        { id: 'faq', ref: faqRef },
      ];

      for (const section of sections) {
        if (section.ref.current) {
          const top = section.ref.current.offsetTop - 120;
          const height = section.ref.current.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!course) {
    return (
      <div className="text-slate-900 min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-brand-purple mb-4 animate-bounce" />
        <h2 className="text-3xl font-extrabold mb-2 logo-font">Course Not Found</h2>
        <p className="text-slate-500 mb-6 max-w-sm">The course you are looking for might have been moved or renamed.</p>
        <Link to="/courses" className="bg-brand-purple hover:brightness-110 text-white font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all">
          Explore All Courses
        </Link>
      </div>
    );
  }

  const currentFee = learningMode === 'self-paced' ? (course.selfPacedFee || Math.round(course.fee * 0.5)) : course.fee;
  const currentOriginalFee = learningMode === 'self-paced' ? (course.selfPacedOriginalFee || Math.round((course.originalFee || course.fee * 1.5) * 0.5)) : (course.originalFee || course.fee * 1.5);
  const discountPercent = currentOriginalFee > 0 ? Math.round(((currentOriginalFee - currentFee) / currentOriginalFee) * 100) : 0;

  const toggleWeek = (index) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleFaq = (index) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const scrollToSection = (ref, tabId) => {
    setActiveTab(tabId);
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  const handleEnroll = () => {
    navigate(`/checkout?courseId=${course.id}&mode=${learningMode}`);
  };

  return (
    <div className="text-slate-900 min-h-screen relative bg-transparent">
      {/* Background glow graphics */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[800px] left-[-200px] w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Floating tool watermarks in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-[0.03] z-0">
        {course && course.techStack && course.techStack.map((tech, idx) => {
          const positions = [
            { top: '8%', left: '4%' },
            { top: '22%', right: '6%' },
            { top: '38%', left: '10%' },
            { top: '55%', right: '5%' },
            { top: '70%', left: '6%' },
            { top: '88%', right: '8%' },
          ];
          const pos = positions[idx % positions.length];
          return (
            <div key={idx} className="absolute transform scale-[4.2] rotate-[15deg] transition-transform duration-500" style={pos}>
              <TechIcon name={tech} className="w-24 h-24" />
            </div>
          );
        })}
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="relative z-10 pt-8 pb-16 border-b border-slate-100 bg-slate-50/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb / Back */}
          <Link to="/courses" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-brand-purple uppercase tracking-wider mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>All Courses Catalog</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold tracking-widest text-brand-purple uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5">
                  {course.category} Certification
                </span>
                <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase border border-emerald-500/30 px-3 py-1 rounded bg-emerald-500/5">
                  {course.level}
                </span>
              </div>

              <h1 className="logo-font text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {course.overview}
              </p>

              {/* Dynamic stats row */}
              <div className="flex flex-wrap items-center gap-6 py-2">
                <div className="flex items-center space-x-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 text-yellow-700 font-bold text-xs sm:text-sm">
                  <Star className="w-4.5 h-4.5 fill-current" />
                  <span>{course.rating} Rating</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-500 font-mono text-xs sm:text-sm">
                  <Users className="w-4.5 h-4.5 text-brand-purple" />
                  <span>{course.enrollments} Students Enrolled</span>
                </div>
              </div>

              {/* Course details widgets */}
              <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-200/60 py-5 font-mono text-xs text-slate-700">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Duration</span>
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                    <Clock className="w-4 h-4 text-brand-purple" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                <div className="space-y-1 border-l border-r border-slate-200/60 px-4">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Format</span>
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                    <BookOpen className="w-4 h-4 text-brand-purple" />
                    <span className="truncate">{course.delivery.split(' ')[0]} + Live</span>
                  </div>
                </div>
                <div className="space-y-1 pl-2">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Digital Badge</span>
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                    <Award className="w-4 h-4 text-brand-purple" />
                    <span>Included</span>
                  </div>
                </div>
              </div>

              {/* Technologies Covered */}
              {course.techStack && (
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Tools & Tech Stack Covered</p>
                  <div className="flex flex-wrap gap-2">
                    {course.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 font-medium hover:bg-white transition-all shadow-sm">
                        <TechIcon name={tech} className="w-4.5 h-4.5" />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Card (Pricing & CTA) */}
            <div className="lg:col-span-5 relative">
              <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 bg-white/70 shadow-xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/10 rounded-full blur-xl z-0"></div>
                
                <div className="relative z-10 space-y-6">
                  {/* Learning Mode Selector */}
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-mono block mb-2">Choose Course Format</span>
                    <div className="bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 flex space-x-1">
                      <button
                        onClick={() => setLearningMode('mentor-led')}
                        className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex flex-col items-center justify-center cursor-pointer ${
                          learningMode === 'mentor-led'
                            ? 'bg-[#1B2A8A] text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'
                        }`}
                      >
                        <span className="text-[10px]">Mentor Led</span>
                        <span className={`text-[8px] font-medium tracking-tight mt-0.5 ${learningMode === 'mentor-led' ? 'text-blue-200' : 'text-slate-400'}`}>Live + Support</span>
                      </button>
                      <button
                        onClick={() => setLearningMode('self-paced')}
                        className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex flex-col items-center justify-center cursor-pointer ${
                          learningMode === 'self-paced'
                            ? 'bg-[#1B2A8A] text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'
                        }`}
                      >
                        <span className="text-[10px]">Self Paced</span>
                        <span className={`text-[8px] font-medium tracking-tight mt-0.5 ${learningMode === 'self-paced' ? 'text-blue-200' : 'text-slate-400'}`}>Recorded Only</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-mono">Certification & Onboarding Fee</span>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                        ₹{currentFee.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-bold line-through">
                        ₹{currentOriginalFee.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      ⚡ Flat {discountPercent}% Off (Early bird pricing applied)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button onClick={handleEnroll} className="w-full bg-gradient-to-r from-[#1B2A8A] to-[#2563EB] hover:brightness-110 text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all transform hover:scale-[1.01] shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 cursor-pointer">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>Register & Enroll Now</span>
                    </button>
                    
                    {course && (
                      <Link 
                        to={`/course/${course.id}/brochure`}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all border border-slate-700/50 flex items-center justify-center space-x-2 cursor-pointer text-center"
                      >
                        <FileText className="w-4 h-4 text-[#2A4BFF]" />
                        <span>View Interactive Brochure</span>
                      </Link>
                    )}
                  </div>

                  <ul className="text-xs space-y-2.5 text-slate-600 border-t border-slate-100 pt-6">
                    {course.mentorLedHours && (
                      <li className="flex items-center space-x-2.5">
                        <CheckCircle className="w-4.5 h-4.5 text-brand-purple flex-shrink-0" />
                        <span>{learningMode === 'self-paced' ? course.selfPacedHours : course.mentorLedHours}</span>
                      </li>
                    )}
                    {course.mentorLedProjects && (
                      <li className="flex items-center space-x-2.5">
                        <CheckCircle className="w-4.5 h-4.5 text-brand-purple flex-shrink-0" />
                        <span>{learningMode === 'self-paced' ? course.selfPacedProjects : course.mentorLedProjects}</span>
                      </li>
                    )}
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle className="w-4.5 h-4.5 text-brand-purple flex-shrink-0" />
                      <span>Immediate Access to Recorded Modules</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      {learningMode === 'self-paced' ? (
                        <div className="w-4.5 h-4.5 flex items-center justify-center text-slate-400 font-bold bg-slate-100 rounded-full text-[9px] flex-shrink-0">✕</div>
                      ) : (
                        <CheckCircle className="w-4.5 h-4.5 text-brand-purple flex-shrink-0" />
                      )}
                      <span className={learningMode === 'self-paced' ? 'text-slate-400 line-through' : ''}>Live Mentoring & Doubt Resolutions</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <CheckCircle className="w-4.5 h-4.5 text-brand-purple flex-shrink-0" />
                      <span>Verifiable Certificate & Digital Badge</span>
                    </li>
                  </ul>

                  {/* Program disclosure */}
                  <div className="bg-slate-50 border border-slate-200/40 p-4 rounded-2xl flex items-start space-x-2 text-[10px] text-slate-500 leading-relaxed">
                    <ShieldAlert className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Scope Policy:</strong> BeyondSkills certifications represent participation assessments. Program fees are non-refundable. No placement guarantees are made.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation Bar */}
      <div className="sticky top-[64px] z-30 bg-white/80 border-b border-slate-200 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto no-scrollbar py-3.5 space-x-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
            <button 
              onClick={() => scrollToSection(overviewRef, 'overview')} 
              className={`pb-1 border-b-2 transition-all flex-shrink-0 ${activeTab === 'overview' ? 'text-brand-purple border-brand-purple' : 'border-transparent hover:text-slate-900'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => scrollToSection(syllabusRef, 'syllabus')} 
              className={`pb-1 border-b-2 transition-all flex-shrink-0 ${activeTab === 'syllabus' ? 'text-brand-purple border-brand-purple' : 'border-transparent hover:text-slate-900'}`}
            >
              Curriculum
            </button>
            <button 
              onClick={() => scrollToSection(projectsRef, 'projects')} 
              className={`pb-1 border-b-2 transition-all flex-shrink-0 ${activeTab === 'projects' ? 'text-brand-purple border-brand-purple' : 'border-transparent hover:text-slate-900'}`}
            >
              Capstone Projects
            </button>
            <button 
              onClick={() => scrollToSection(mentorsRef, 'mentors')} 
              className={`pb-1 border-b-2 transition-all flex-shrink-0 ${activeTab === 'mentors' ? 'text-brand-purple border-brand-purple' : 'border-transparent hover:text-slate-900'}`}
            >
              Mentors
            </button>
            <button 
              onClick={() => scrollToSection(faqRef, 'faq')} 
              className={`pb-1 border-b-2 transition-all flex-shrink-0 ${activeTab === 'faq' ? 'text-brand-purple border-brand-purple' : 'border-transparent hover:text-slate-900'}`}
            >
              FAQs
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column (Main Information) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Section 1: Overview */}
            <section ref={overviewRef} id="overview" className="scroll-mt-24 space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wide border-l-3 border-brand-purple pl-3 logo-font">
                Program Highlights & Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.outcomes.map((outcome, idx) => (
                  <div key={idx} className="bg-slate-50/60 backdrop-blur-sm border border-slate-100 p-5 rounded-2xl flex items-start space-x-3.5 hover:bg-white hover:shadow-md hover:border-brand-purple/35 transition-all group relative overflow-hidden">
                    {/* Glowing background circles */}
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-brand-purple/5 rounded-full blur-xl group-hover:bg-brand-purple/12 transition-colors z-0"></div>
                    <div className="absolute -top-6 -left-6 w-12 h-12 bg-brand-cyan/5 rounded-full blur-lg group-hover:bg-brand-cyan/10 transition-colors z-0"></div>
                    
                    <div className="bg-brand-purple/10 p-2 rounded-xl text-brand-purple group-hover:scale-105 transition-transform flex-shrink-0 relative z-10">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {outcome}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Syllabus / Curriculum */}
            <section ref={syllabusRef} id="syllabus" className="scroll-mt-24 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wide border-l-3 border-brand-purple pl-3 logo-font">
                  Detailed Syllabus & Learning Plan
                </h2>

              </div>

              {/* Accordion Layout */}
              <div className="space-y-4">
                {course.curriculum.map((module, idx) => {
                  const isExpanded = expandedWeeks[idx];
                  return (
                    <div key={idx} className={`border rounded-2xl overflow-hidden transition-all ${isExpanded ? 'border-slate-300 shadow-md bg-white' : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm bg-slate-50 hover:bg-slate-100/50'}`}>
                      {/* Accordion Header */}
                      <button 
                        onClick={() => toggleWeek(idx)}
                        className="w-full flex items-center justify-between p-5 text-left transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-mono text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg flex-shrink-0">
                            {module.week}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide font-mono">
                            {module.title}
                          </h4>
                        </div>
                        <div className="text-slate-400 hover:text-slate-600 ml-2">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>

                      {/* Accordion Body */}
                      {isExpanded && module.topics && (
                        <div className="p-5 border-t border-slate-100 bg-white animate-fade-in">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-4 font-mono">Topics & Skills covered in this module:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {module.topics.map((topic, tIdx) => (
                              <div key={tIdx} className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
                                <CheckSquare className="w-4.5 h-4.5 text-brand-purple flex-shrink-0" />
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 3: Capstone Projects */}
            {course.projects && (
              <section ref={projectsRef} id="projects" className="scroll-mt-24 space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wide border-l-3 border-brand-purple pl-3 logo-font">
                  Hands-On Capstone Projects
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Build and deploy real-world projects that showcase your abilities to employers. Every project is reviewed by industry mentors.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {course.projects.map((project, idx) => (
                    <div key={idx} className="border border-slate-200 bg-white p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/[0.02] rounded-bl-3xl z-0"></div>
                      
                      <div className="relative z-10 space-y-4">
                        <div className="bg-brand-purple/10 w-fit p-2.5 rounded-xl text-brand-purple">
                          <Code className="w-5 h-5" />
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-wide">
                          {project.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="relative z-10 pt-4 border-t border-slate-100 mt-6 space-y-2">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 font-mono block">Built With</span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.techUsed.map((tech, tIdx) => (
                            <span key={tIdx} className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold font-mono">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 4: Mentors */}
            <section ref={mentorsRef} id="mentors" className="scroll-mt-24 space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wide border-l-3 border-brand-purple pl-3 logo-font">
                Industry-Leading Mentors
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Learn directly from verified working professionals at top tier firms through recorded modules and live doubt resolution sessions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {course.mentors.map((mentor, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/50 p-6 rounded-2xl flex items-start justify-between space-x-4 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-start space-x-4">
                      <div className="bg-brand-purple/10 p-3 rounded-2xl text-brand-purple flex-shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                          {mentor.name}
                        </h4>
                        <p className="text-xs text-brand-purple font-semibold font-mono">
                          {mentor.role}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          {mentor.experience} Experience
                        </p>
                      </div>
                    </div>
                    {mentor.logo && (
                      <img src={mentor.logo} alt="" className="w-6 h-6 opacity-80 mt-1 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5: FAQs */}
            <section ref={faqRef} id="faq" className="scroll-mt-24 space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wide border-l-3 border-brand-purple pl-3 logo-font">
                Frequently Asked Questions
              </h2>

              <div className="space-y-3">
                {course.faqs.map((faq, idx) => {
                  const isExpanded = expandedFaqs[idx];
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <button 
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-slate-50"
                      >
                        <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center space-x-2 font-mono">
                          <HelpCircle className="w-4 h-4 text-brand-purple flex-shrink-0" />
                          <span>{faq.q}</span>
                        </span>
                        <div className="text-slate-400 ml-2">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium animate-fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* Right Column (Side Sticky Disclaimers / Reviews) */}
          <div className="lg:col-span-4 space-y-8 sticky top-36">
            
            {/* Educational Scope */}
            <div className="bg-slate-50 border border-slate-200/50 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 font-mono">
                <ShieldAlert className="w-4 h-4 text-brand-purple" />
                <span>Certification Policy</span>
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Our certifications signify completion of coursework and practice assessment structures. All evaluations are conducted online. Programs are designed to expand operational coding skills; career placement outcomes depend entirely on individual efforts and credentials.
              </p>
            </div>

            {/* Testimonials */}
            <div className="bg-slate-50 border border-slate-200/50 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 font-mono">
                <Sparkles className="w-4 h-4 text-brand-purple animate-pulse" />
                <span>Student Feedback</span>
              </h4>
              
              <div className="space-y-4 mt-2 max-h-[260px] overflow-y-auto pr-1">
                {course.reviews.map((rev, idx) => (
                  <div key={idx} className="border-b border-slate-200/60 pb-4 last:border-b-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-slate-800">{rev.user}</span>
                      <div className="flex text-yellow-500">
                        {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Floating Bottom Sticky CTA bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl py-4 animate-slide-up">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            
            {/* Left pricing text */}
            <div className="flex items-center space-x-3 truncate">
              <img 
                src={COURSE_IMAGES[course.id] || COURSE_IMAGES['ai-ml']} 
                alt={course.title}
                className="w-10 h-10 object-cover rounded-lg hidden sm:block border border-slate-100 flex-shrink-0"
              />
              <div className="truncate">
                <h4 className="text-xs font-extrabold text-slate-900 truncate leading-tight font-mono uppercase tracking-wide">
                  {course.title}
                </h4>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-sm font-extrabold text-slate-900">₹{currentFee.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 line-through font-mono">₹{currentOriginalFee.toLocaleString()}</span>
                  </div>
              </div>
            </div>

            {/* Right Action buttons */}
            <div className="flex items-center space-x-3 flex-shrink-0">

              <button 
                onClick={handleEnroll} 
                className="bg-gradient-to-r from-[#1B2A8A] to-[#2563EB] hover:brightness-110 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all transform hover:scale-[1.01] shadow-lg shadow-blue-600/10"
              >
                Enroll Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
