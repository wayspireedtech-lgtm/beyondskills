import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Star, GraduationCap, CheckCircle, ShieldAlert, Award, FileText, ArrowLeft, Users } from 'lucide-react';
import { COURSES } from '../utils/mockDb';
import TechIcon from '../components/TechIcon';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [activeCourseId, setActiveCourseId] = useState(null);

  // Read URL search params
  useEffect(() => {
    const catParam = searchParams.get('cat');
    const idParam = searchParams.get('id');
    
    if (catParam) {
      setSelectedCat(catParam);
    } else {
      setSelectedCat('All');
    }

    if (idParam) {
      setActiveCourseId(idParam);
    } else {
      setActiveCourseId(null);
    }
  }, [searchParams]);

  // Categories list
  const categories = ['All', 'AI/ML/DS/DA', 'Full Stack Development', 'Digital Marketing', 'HR', 'Stock Market', 'Cyber Security', 'Cloud Computing'];

  // Filter logic
  const filteredCourses = COURSES.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.overview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'All' || c.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleCategorySelect = (cat) => {
    setSearchParams(cat === 'All' ? {} : { cat });
  };

  const handleViewCourse = (id) => {
    setSearchParams({ id });
  };

  const handleBackToList = () => {
    const cat = searchParams.get('cat');
    setSearchParams(cat ? { cat } : {});
  };

  const handleEnroll = (courseId) => {
    navigate(`/checkout?courseId=${courseId}`);
  };

  // If a specific course is selected, show its detailed syllabus page
  if (activeCourseId) {
    const course = COURSES.find(c => c.id === activeCourseId);
    if (!course) {
      return (
        <div className="text-slate-900 min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <ShieldAlert className="w-12 h-12 text-brand-blue mb-4" />
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <button onClick={handleBackToList} className="bg-brand-purple text-white font-bold px-6 py-2 rounded-lg text-xs uppercase">
            Back to Catalog
          </button>
        </div>
      );
    }

    return (
      <div className="text-slate-900 min-h-screen relative pt-12 pb-24">
        {/* Glow */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
          
          {/* Back Action */}
          <button onClick={handleBackToList} className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-brand-purple uppercase tracking-wider mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Course Catalog</span>
          </button>

          {/* Header Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-16">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              <span className="text-xs font-bold tracking-widest text-brand-purple uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5">
                {course.category} Certification
              </span>
              <h1 className="logo-font text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {course.overview}
              </p>
              
              {/* Tech Stack Covered */}
              {course.techStack && (
                <div className="pt-2">
                  <p className="text-xs uppercase tracking-wider text-brand-purple font-bold mb-3">Technologies Covered</p>
                  <div className="flex flex-wrap gap-2">
                    {course.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 font-medium hover:bg-white/10 transition-all">
                        <TechIcon name={tech} className="w-4 h-4" />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-700 font-mono">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4.5 h-4.5 text-brand-purple" />
                  <span>Duration: {course.duration}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-4.5 h-4.5 text-brand-purple" />
                  <span>{course.delivery}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Award className="w-4.5 h-4.5 text-brand-purple" />
                  <span>Certify: Yes</span>
                </span>
              </div>
            </div>

            {/* Sidebar Pricing & Action */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Certification Cost</span>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-1">
                ₹{course.fee.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500 mb-6">Inclusive of recorded lectures, live mentor reviews & digital badge.</p>
              
              <button onClick={() => handleEnroll(course.id)} className="w-full bg-gradient-to-r from-[#1B2A8A] to-[#2563EB] hover:brightness-110 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all transform hover:scale-[1.02]">
                Enroll & Onboard Now
              </button>

              {/* Prominent disclaimer under checkouts */}
              <div className="mt-6 pt-6 border-t border-slate-200/60 flex items-start space-x-2 text-[10px] text-slate-500 text-left leading-normal bg-slate-100 p-3.5 rounded-xl">
                <ShieldAlert className="w-4.5 h-4.5 text-brand-purple flex-shrink-0 mt-0.5" />
                <p>
                  <strong>No Placement Guarantee:</strong> Enrollment does not imply job or internship guarantees. Learner career outcomes remain their sole responsibility.
                </p>
              </div>
            </div>

          </div>

          {/* Syllabus Details Accordions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            
            {/* Syllabus Left */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Curriculum */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-6 border-l-2 border-brand-purple pl-3">
                  Course Syllabus & Curriculum
                </h3>
                <div className="space-y-4">
                  {course.curriculum.map((module, idx) => (
                    <div key={idx} className="bg-slate-100 border border-slate-200/60 p-5 rounded-xl flex items-start space-x-4">
                      <span className="bg-brand-purple/10 border border-brand-purple/30 text-brand-purple font-mono text-xs font-bold px-2.5 py-1 rounded">
                        {module.week}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{module.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentors */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-6 border-l-2 border-brand-purple pl-3">
                  Program Mentors
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {course.mentors.map((mentor, idx) => (
                    <div key={idx} className="bg-slate-100 border border-slate-200/60 p-5 rounded-xl flex items-start space-x-3">
                      <Users className="w-8 h-8 text-brand-purple flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{mentor.name}</h4>
                        <p className="text-xs text-brand-purple mt-0.5">{mentor.role}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{mentor.experience} Experience</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-6 border-l-2 border-brand-purple pl-3">
                  Syllabus Learning Outcomes
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  {course.outcomes.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ Section */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-6 border-l-2 border-brand-purple pl-3">
                  Course FAQs
                </h3>
                <div className="space-y-4">
                  {course.faqs.map((faq, idx) => (
                    <div key={idx} className="border border-slate-200/60 p-5 rounded-xl">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">{faq.q}</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Compliance Scope Card Sticky */}
            <div className="space-y-6 sticky top-24">
              <div className="bg-slate-50/70 border border-slate-200/40 border border-slate-200 p-6 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-brand-purple" />
                  <span>Educational Scope Policy</span>
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  BeyondSkills Academy courses are built to provide Basic to Intermediate level coding and operation practices. Completion of course programs signifies syllabus study completion and passing standard test templates, but does not imply advanced competency or corporate licensing.
                </p>
              </div>

              <div className="bg-slate-100 border border-slate-200/60 p-6 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Student Reviews</h4>
                <div className="space-y-4 mt-4">
                  {course.reviews.map((rev, idx) => (
                    <div key={idx} className="border-b border-slate-200/60 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-900">{rev.user}</span>
                        <div className="flex text-brand-cyan">
                          {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // Else, show the standard Course Catalog list
  return (
    <div className="text-slate-900 min-h-screen relative pt-12 pb-24">
      {/* Glow Blur */}
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-purple uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5">
            BeyondSkills Academy
          </span>
          <h1 className="logo-font text-4xl sm:text-6xl font-extrabold mt-6">
            Academy Course Catalog
          </h1>
          <p className="mt-4 text-slate-500 text-sm sm:text-base">
            Recorded learning modules combined with weekly live mentor reviews and digital certificates.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-slate-100 border border-slate-200 p-6 rounded-2xl">
          
          {/* Category Scroller */}
          <div className="flex flex-wrap gap-2.5 max-w-full">
            {categories.map((cat, idx) => (
              <button key={idx} onClick={() => handleCategorySelect(cat)} className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${selectedCat === cat ? 'bg-brand-purple text-black' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white/10'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:border-brand-purple outline-none shadow-sm focus:border-brand-purple outline-none" placeholder="Search courses..." />
          </div>

        </div>

        {/* Course Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((c) => (
            <div key={c.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-200/60 hover:border-brand-purple/30 transition-all hover:scale-[1.01]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-bold text-brand-purple uppercase border border-brand-purple/30 px-2 py-0.5 rounded bg-brand-purple/5">
                    {c.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {c.duration}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 line-clamp-2 h-12">{c.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-3">{c.overview}
                </p>
                
                {/* Tech Stack Badges */}
                {c.techStack && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {c.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-[10px] text-slate-700 font-medium">
                        <TechIcon name={tech} className="w-3.5 h-3.5" />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-1 mb-4 text-brand-cyan">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold text-slate-900">{c.rating}</span>
                  <span className="text-[10px] text-slate-500">({c.enrollments})</span>
                </div>
                
                <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Syllabus Fee</span>
                    <span className="text-base font-bold text-slate-900">₹{c.fee.toLocaleString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleViewCourse(c.id)} className="bg-slate-100 hover:bg-white/10 border border-slate-200 text-slate-900 font-bold text-xs uppercase px-3 py-2.5 rounded-lg transition-colors">
                      Syllabus
                    </button>
                    <button onClick={() => handleEnroll(c.id)} className="bg-brand-purple hover:bg-brand-purple/90 text-black font-bold text-xs uppercase px-3.5 py-2.5 rounded-lg transition-colors">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500">
              No courses matching search filters. Clear filters and search values.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
