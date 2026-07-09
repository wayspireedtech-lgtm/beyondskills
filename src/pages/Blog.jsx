import React, { useState } from 'react';
import { BLOGS } from '../utils/mockDb';
import { Calendar, User, ArrowRight, X, BookOpen, Sparkles } from 'lucide-react';

export default function Blog() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Artificial Intelligence', 'Web Development', 'Digital Marketing', 'Resume Tips'];

  const filteredBlogs = selectedCategory === 'All'
    ? BLOGS
    : BLOGS.filter(b => b.category === selectedCategory);

  return (
    <div className="text-slate-900 min-h-screen relative pt-12 pb-24">
      {/* Background Decor */}
      <div className="absolute top-40 left-10 w-96 h-96 bg-brand-purple/5 rounded-full blur-[120px] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-purple uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5">
            BeyondSkills Insights
          </span>
          <h1 className="logo-font text-4xl sm:text-6xl font-extrabold mt-6">
            Industry Tech & Career Guidance
          </h1>
          <p className="mt-4 text-slate-500 text-sm sm:text-base">
            Articles, resume checklists, and software engineering updates written by active specialists.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat, idx) => (
            <button key={idx} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${selectedCategory === cat ? 'bg-brand-purple text-black' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200/60 hover:border-brand-purple/30 transition-all hover:scale-[1.01]">
              <div>
                <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover border-b border-slate-200/60" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold tracking-widest text-brand-purple bg-brand-purple/10 border border-brand-purple/30 px-2.5 py-0.5 rounded uppercase">
                      {blog.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      <span>{blog.date}</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 h-14">{blog.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{blog.summary}</p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                    <User className="w-3.5 h-3.5 text-brand-purple" />
                    <span>{blog.author}</span>
                  </div>
                  <button onClick={() => setSelectedBlog(blog)} className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-purple hover:text-slate-900 transition-colors">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blog Article Reader Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-white/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-50/70 border border-slate-200/40 border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
              <button onClick={() => setSelectedBlog(null)} className="absolute top-4 right-4 bg-white/60 hover:bg-white p-2 rounded-full border border-slate-200 text-slate-900 z-10">
                <X className="w-5 h-5" />
              </button>
              
              <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-64 object-cover border-b border-slate-200" />
              
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4 text-xs">
                  <span className="bg-brand-purple/15 text-brand-purple font-bold uppercase px-3 py-1 rounded">
                    {selectedBlog.category}
                  </span>
                  <span className="text-slate-500 font-mono">{selectedBlog.date}</span>
                  <span className="text-slate-500 font-mono">By {selectedBlog.author}</span>
                </div>
                
                <h2 className="logo-font text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
                  {selectedBlog.title}
                </h2>
                
                <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-6 text-justify">
                  <p className="font-semibold text-slate-900 border-l-2 border-brand-purple pl-4 italic">
                    {selectedBlog.summary}
                  </p>
                  <p className="whitespace-pre-line">
                    {selectedBlog.content}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span>© {new Date().getFullYear()} BeyondSkills Insights.</span>
                  <span className="flex items-center space-x-1.5 text-brand-purple font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Quality Tech Guidance</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
