import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Star, GraduationCap, CheckCircle, ShieldAlert, Award, FileText, ArrowLeft, Users } from 'lucide-react';
import { COURSES } from '../utils/mockDb';
import TechIcon from '../components/TechIcon';
import BrochureModal from '../components/BrochureModal';

const COURSE_IMAGES = {
  'artificial-intelligence': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  'machine-learning': 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=600&auto=format&fit=crop&q=80',
  'data-science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
  'data-analytics': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
  'ai-ml': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  'data-science-analytics': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
  'full-stack-web': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  'digital-marketing-cert': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
  'hr-mgmt': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop&q=80',
  'stock-market': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
  'cyber-security': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
  'cloud-computing': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
};

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [brochureCourse, setBrochureCourse] = useState(null);

  // Read URL search params & handle legacy redirects
  useEffect(() => {
    const catParam = searchParams.get('cat');
    const idParam = searchParams.get('id');
    
    if (catParam) {
      setSelectedCat(catParam);
    } else {
      setSelectedCat('All');
    }

    // Redirect /courses?id=ai-ml to /course/ai-ml
    if (idParam) {
      const targetPath = `/course/${idParam}`;
      navigate(targetPath, { replace: true });
    }
  }, [searchParams, navigate]);

  // Categories list
  const categories = ['All', 'Tech', 'Marketing', 'HR'];

  // Filter logic
  const filteredCourses = COURSES.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.overview.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCat = false;
    if (selectedCat === 'All') {
      matchesCat = true;
    } else if (selectedCat === 'Tech') {
      matchesCat = ['AI/ML/DS/DA', 'Full Stack Development', 'Cyber Security', 'Cloud Computing'].includes(c.category);
    } else if (selectedCat === 'Marketing') {
      matchesCat = ['Digital Marketing', 'Stock Market'].includes(c.category);
    } else if (selectedCat === 'HR') {
      matchesCat = c.category === 'HR';
    } else {
      // Fallback for direct matches
      matchesCat = c.category === selectedCat;
    }

    return matchesSearch && matchesCat;
  });

  const handleCategorySelect = (cat) => {
    setSearchParams(cat === 'All' ? {} : { cat });
  };

  const handleEnroll = (courseId) => {
    navigate(`/checkout?courseId=${courseId}`);
  };

  // Show the standard Course Catalog list
  return (
    <div className="text-slate-900 min-h-screen relative pt-12 pb-24">
      {/* Glow Blur */}
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-purple uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5">
            BeyondSkills
          </span>
          <h1 className="logo-font text-4xl sm:text-6xl font-extrabold mt-6">
            Upskilling Programs
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
          {filteredCourses.map((c) => {
            const bgImage = COURSE_IMAGES[c.id] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600';
            return (
              <div 
                key={c.id} 
                onClick={() => {
                  const targetPath = `/course/${c.id}`;
                  navigate(targetPath);
                }}
                className="relative overflow-hidden p-6 rounded-2xl flex flex-col justify-between transition-all cursor-pointer min-h-[350px] group border border-slate-200/60 hover:border-brand-purple/30 hover:scale-[1.01]"
              >
                {/* Background Image with Dark Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${bgImage}')` }}
                />
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[0.5px] z-0" />

                {/* Content Container */}
                <div className="relative z-10 flex flex-col justify-between h-full text-white w-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-bold text-brand-purple uppercase border border-brand-purple/40 px-2 py-0.5 rounded bg-brand-purple/10">
                        {c.category}
                      </span>
                      <span className="text-xs text-slate-300 font-mono">
                        {c.duration}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 h-12 leading-tight">{c.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6 line-clamp-3 leading-normal">{c.overview}</p>
                    
                    {/* Tech Stack Badges */}
                    {c.techStack && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {c.techStack.map((tech, tIdx) => (
                          <span key={tIdx} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] text-slate-200 font-medium hover:bg-white/20 transition-all">
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
                      <span className="text-xs font-bold text-white">{c.rating}</span>
                      <span className="text-[10px] text-slate-300">({c.enrollments})</span>
                    </div>
                    
                    <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Syllabus Fee</span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-base font-bold text-white">₹{c.fee.toLocaleString()}</span>
                          <span className="text-[11px] text-slate-400 line-through">₹{c.originalFee.toLocaleString()}</span>
                          <span className="text-[9px] text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                            {Math.round(((c.originalFee - c.fee) / c.originalFee) * 100)}% OFF
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1.5 mt-4">
                        <Link 
                          to={`/course/${c.id}/brochure`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 bg-[#2A4BFF] hover:brightness-110 text-white font-bold text-[10px] uppercase px-2.5 py-2 rounded-lg transition-colors text-center inline-block cursor-pointer"
                        >
                          Brochure
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnroll(c.id);
                          }}
                          className="flex-1 bg-brand-purple hover:bg-brand-purple/90 text-black font-bold text-[10px] uppercase px-2.5 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Enroll
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )})}

          {filteredCourses.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500">
              No courses matching search filters. Clear filters and search values.
            </div>
          )}
        </div>

      </div>
      {/* Brochure Download Modal */}
      <BrochureModal 
        isOpen={isBrochureOpen} 
        onClose={() => setIsBrochureOpen(false)} 
        course={brochureCourse} 
      />

    </div>
  );
}
