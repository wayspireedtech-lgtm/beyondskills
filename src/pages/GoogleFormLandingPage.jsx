import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Send, ArrowRight, GraduationCap, Briefcase, 
  Calendar, BookOpen, User, Phone, Mail, FileText, CheckCircle 
} from 'lucide-react';
import { COURSES, setDbItem, getDbItem } from '../utils/mockDb';
import { saveLeadToSupabase } from '../utils/supabaseClient';
import TechIcon from '../components/TechIcon';

const floatingTools = [
  { name: 'python', top: '10%', left: '8%', delay: '0s', scale: 0.9, animationClass: 'float-animation-1' },
  { name: 'javascript', top: '22%', left: '82%', delay: '1s', scale: 0.95, animationClass: 'float-animation-2' },
  { name: 'react', top: '75%', left: '10%', delay: '2s', scale: 1.05, animationClass: 'float-animation-3' },
  { name: 'sql', top: '58%', left: '88%', delay: '1.5s', scale: 0.85, animationClass: 'float-animation-1' },
  { name: 'node.js', top: '42%', left: '6%', delay: '3s', scale: 0.95, animationClass: 'float-animation-2' },
  { name: 'mongodb', top: '85%', left: '82%', delay: '0.5s', scale: 1.0, animationClass: 'float-animation-3' },
  { name: 'aws', top: '12%', left: '76%', delay: '2.5s', scale: 0.9, animationClass: 'float-animation-2' },
  { name: 'excel', top: '90%', left: '25%', delay: '1.2s', scale: 0.85, animationClass: 'float-animation-1' },
  { name: 'html5', top: '30%', left: '90%', delay: '3.5s', scale: 0.85, animationClass: 'float-animation-3' },
  { name: 'css3', top: '56%', left: '10%', delay: '1.8s', scale: 0.9, animationClass: 'float-animation-2' },
  { name: 'google ads', top: '72%', left: '90%', delay: '4s', scale: 1.0, animationClass: 'float-animation-1' },
  { name: 'meta ads', top: '4%', left: '85%', delay: '2.2s', scale: 0.95, animationClass: 'float-animation-3' },
  { name: 'seo', top: '48%', left: '80%', delay: '0.8s', scale: 0.9, animationClass: 'float-animation-2' },
];

export default function GoogleFormLandingPage() {
  const navigate = useNavigate();

  const renderFloatingTools = () => {
    return (
      <>
        <style>{`
          @keyframes float-slow-1 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
            50% { transform: translateY(-16px) translateX(8px) rotate(4deg); }
          }
          @keyframes float-slow-2 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
            50% { transform: translateY(-22px) translateX(-6px) rotate(-3deg); }
          }
          @keyframes float-slow-3 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
            50% { transform: translateY(-14px) translateX(10px) rotate(5deg); }
          }
          .float-animation-1 { animation: float-slow-1 8s infinite ease-in-out; }
          .float-animation-2 { animation: float-slow-2 10s infinite ease-in-out; }
          .float-animation-3 { animation: float-slow-3 12s infinite ease-in-out; }
        `}</style>
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {floatingTools.map((tool, index) => (
            <div
              key={index}
              className={`absolute transition-all duration-500 hidden sm:block ${tool.animationClass}`}
              style={{
                top: tool.top,
                left: tool.left,
                animationDelay: tool.delay,
                transform: `scale(${tool.scale})`,
              }}
            >
              <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-3 rounded-2xl flex items-center justify-center w-14 h-14 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                <TechIcon name={tool.name} className="w-7 h-7" />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    college: '',
    year: '1st Year',
    role: 'Student',
    upskilling: 'artificial-intelligence',
    whyInterested: '',
    batch: 'July Batch',
    projectExp: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Validate fields
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Phone, and Email).');
      setIsSubmitting(false);
      return;
    }

    try {
      // Find course name for logs
      const selectedCourse = COURSES.find(c => c.id === form.upskilling);
      const courseTitle = selectedCourse ? selectedCourse.title : form.upskilling;

      // 0. Save to Supabase (dynamic client with fallbacks)
      const leadRecord = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        status: form.role,
        course_id: form.upskilling,
        course_title: courseTitle,
        student_details: `College: ${form.college || 'N/A'} | Year: ${form.year} | Batch: ${form.batch} | Why: ${form.whyInterested || 'N/A'}`,
        job_role: form.projectExp || 'None'
      };
      await saveLeadToSupabase(leadRecord);

      // Construct detailed notes containing extra metadata fields
      const detailedNotes = `
College: ${form.college || 'N/A'}
Year: ${form.year}
Status: ${form.role}
Batch: ${form.batch}
Project Work Experience: ${form.projectExp || 'None'}
Why Interested: ${form.whyInterested || 'N/A'}
Submitted via Google Form Campaign page
      `.trim();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        type: 'Google Form Leads', // Classified under Google Form Leads as requested
        program: form.upskilling,
        notes: detailedNotes,
        college: form.college.trim() || 'Unspecified',
        profession: form.role,
        year: form.year,
        batch: form.batch,
        projectExp: form.projectExp.trim() || 'None',
        whyInterested: form.whyInterested.trim() || 'N/A',
        message: detailedNotes
      };

      // 1. Post to backend webhook API
      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : window.location.origin;

      const response = await fetch(`${apiHost}/api/webhook/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // 2. Also save to local storage for local client redundancy
      const localLeads = getDbItem('beyondskills_leads', []);
      const newLocalLead = {
        id: `LD${String(localLeads.length + 101).padStart(3, '0')}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: payload.type,
        program: payload.program,
        assignedBDM: '',
        assignedBDA: '',
        status: 'New',
        subStatus: 'QUALIFIED',
        profession: form.role,
        college: form.college.trim() || 'Unspecified',
        message: detailedNotes,
        mentor: 'None',
        duration: 'None',
        callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
        history: [{ note: detailedNotes, date: new Date().toISOString() }]
      };
      
      localLeads.push(newLocalLead);
      setDbItem('beyondskills_leads', localLeads);

      // Trigger Simulated SLA toast on front-end for visual feedback
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: {
          subject: `Campaign registration log received`,
          body: `Hello ${form.name},\n\nWe have successfully received your campaign enrollment form for ${courseTitle} (${form.batch}). Our BDA team is scheduling a counseling dial session.\n\nSincerely,\nBeyondSkills Admissions Team`
        }
      }));

      window.location.href = '/thank-you';
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Failed to connect to the server. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col items-center justify-center p-6 relative font-sans overflow-hidden">
        {renderFloatingTools()}

        {/* Glow Effects */}
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full blur-[120px] bg-emerald-500/5 pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full blur-[120px] bg-blue-500/5 pointer-events-none"></div>

        <div className="max-w-md w-full bg-slate-950/95 border border-white/10 p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-fade-in relative z-10 text-slate-100 backdrop-blur-xl">
          {/* Centered Brand Logo inside Success State */}
          <div className="flex justify-center mb-2">
            <img 
              src="/logo.png" 
              alt="Beyond Skills Logo" 
              className="h-16 w-auto object-contain mix-blend-multiply"
            />
          </div>

          <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-2xl border border-emerald-500/20 shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white">Registration Completed!</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Thank you for registering. Your details have been submitted directly to our counseling sheet. An admissions counselor will reach out to you within 24 hours.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-[#0EA5E9] hover:opacity-95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10"
            >
              <span>Go to Home Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => {
                setForm({
                  name: '',
                  phone: '',
                  email: '',
                  college: '',
                  year: '1st Year',
                  role: 'Student',
                  upskilling: 'artificial-intelligence',
                  whyInterested: '',
                  batch: 'July Batch',
                  projectExp: ''
                });
                setSubmitStatus(null);
              }}
              className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all border border-white/10 cursor-pointer"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 py-16 px-4 relative overflow-x-hidden font-sans">
      {/* Floating Background App Icons */}
      {renderFloatingTools()}

      {/* Background Decorative Ambient Spotlights */}
      <div className="absolute top-[5%] left-[-10%] w-[450px] h-[450px] rounded-full blur-[140px] bg-blue-500/5 pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] bg-[#0EA5E9]/5 pointer-events-none"></div>
      <div className="absolute bottom-[5%] left-[10%] w-[400px] h-[400px] rounded-full blur-[130px] bg-indigo-500/5 pointer-events-none"></div>
      
      {/* Custom grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        {/* Centered Brand Logo */}
        <div className="flex justify-center -mb-2">
          <img 
            src="/logo.png" 
            alt="Beyond Skills Logo" 
            className="h-20 sm:h-24 w-auto object-contain mix-blend-multiply drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Branding & Headers */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>Campaign Registration Form</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Upskilling Program <span className="bg-gradient-to-r from-blue-600 to-[#0EA5E9] bg-clip-text text-transparent">Counseling</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
            Fill in the details below to book a live mentor catalog review session and register for our upcoming cohorts.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-950/95 border border-white/10 p-6 sm:p-10 rounded-3xl shadow-2xl space-y-8 text-slate-100 backdrop-blur-xl relative z-10">
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-300 p-4 rounded-xl text-xs font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Group Name, Email, Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gf-name" className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  Full Name <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  id="gf-name"
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                />
              </div>
              
              <div>
                <label htmlFor="gf-phone" className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  Phone Number <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  id="gf-phone"
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gf-email" className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  Email Address <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  id="gf-email"
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. john@gmail.com"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                />
              </div>

              <div>
                <label htmlFor="gf-college" className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  College / Institute
                </label>
                <input
                  id="gf-college"
                  type="text"
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  placeholder="Enter your college name"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
                />
              </div>
            </div>

            {/* Year & Student/Working Professional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gf-year" className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  Academic Year
                </label>
                <select
                  id="gf-year"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all cursor-pointer"
                >
                  <option value="1st Year" className="bg-slate-950 text-white">1st Year</option>
                  <option value="2nd Year" className="bg-slate-950 text-white">2nd Year</option>
                  <option value="3rd Year" className="bg-slate-950 text-white">3rd Year</option>
                  <option value="4th Year" className="bg-slate-950 text-white">4th Year</option>
                  <option value="Graduated" className="bg-slate-950 text-white">Graduated</option>
                </select>
              </div>

              <div>
                <label htmlFor="gf-role" className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  Current Profile
                </label>
                <select
                  id="gf-role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all cursor-pointer"
                >
                  <option value="Student" className="bg-slate-950 text-white">Student</option>
                  <option value="Working Professional" className="bg-slate-950 text-white">Working Professional</option>
                </select>
              </div>
            </div>

            {/* Upskilling (Dropdown of all courses) & Batch (July/August) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gf-upskilling" className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  Upskilling Goal (Course)
                </label>
                <select
                  id="gf-upskilling"
                  name="upskilling"
                  value={form.upskilling}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all cursor-pointer"
                >
                  {COURSES.map(course => (
                    <option key={course.id} value={course.id} className="bg-slate-950 text-white">
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="gf-batch" className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  Preferred Batch
                </label>
                <select
                  id="gf-batch"
                  name="batch"
                  value={form.batch}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all cursor-pointer"
                >
                  <option value="July Batch" className="bg-slate-950 text-white">July Batch</option>
                  <option value="August Batch" className="bg-slate-950 text-white">August Batch</option>
                </select>
              </div>
            </div>

            {/* Project Work Experience */}
            <div>
              <label htmlFor="gf-projectExp" className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                Project / Work Experience
              </label>
              <input
                id="gf-projectExp"
                type="text"
                name="projectExp"
                value={form.projectExp}
                onChange={handleChange}
                placeholder="Briefly describe your project/work experience (e.g. None, Basic HTML site, Python script)"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
              />
            </div>

            {/* Why Interested */}
            <div>
              <label htmlFor="gf-whyInterested" className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                Why are you interested in this program?
              </label>
              <textarea
                id="gf-whyInterested"
                name="whyInterested"
                rows={3}
                value={form.whyInterested}
                onChange={handleChange}
                placeholder="What is your learning goal or target outcome from this course..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-slate-900 outline-none text-white transition-all placeholder-slate-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-[#0EA5E9] hover:opacity-95 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-lg shadow-blue-500/20"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting Response...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Details</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Navigation: Explore other courses */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-500">
            Want to see our curriculum catalog first?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-[#0EA5E9] hover:underline font-bold transition-all cursor-pointer inline-flex items-center space-x-0.5 ml-1"
            >
              <span>Explore other courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
