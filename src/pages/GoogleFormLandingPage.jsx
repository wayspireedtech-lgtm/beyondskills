import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Send, ArrowRight, GraduationCap, Briefcase, 
  Calendar, BookOpen, User, Phone, Mail, FileText, CheckCircle 
} from 'lucide-react';
import { COURSES, setDbItem, getDbItem } from '../utils/mockDb';
import { saveLeadToSupabase } from '../utils/supabaseClient';

export default function GoogleFormLandingPage() {
  const navigate = useNavigate();
  
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
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 relative font-sans">
        {/* Glow Effects */}
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full blur-[120px] bg-emerald-500/10 pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full blur-[120px] bg-blue-500/10 pointer-events-none"></div>

        <div className="max-w-md w-full bg-slate-900/60 border border-emerald-500/30 p-8 rounded-3xl text-center space-y-6 backdrop-blur-xl shadow-2xl animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-2xl">
            <CheckCircle className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Registration Completed!</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Thank you for registering. Your details have been submitted directly to our counseling sheet. An admissions counselor will reach out to you within 24 hours.
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-[#0EA5E9] hover:opacity-95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
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
              className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all border border-white/5 cursor-pointer"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white py-16 px-4 relative overflow-x-hidden font-sans">
      {/* Background Decorative Ambient Spotlights */}
      <div className="absolute top-[5%] left-[-10%] w-[450px] h-[450px] rounded-full blur-[140px] bg-blue-500/10 pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] bg-[#0EA5E9]/10 pointer-events-none"></div>
      <div className="absolute bottom-[5%] left-[10%] w-[400px] h-[400px] rounded-full blur-[130px] bg-indigo-500/5 pointer-events-none"></div>
      
      {/* Custom grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        {/* Branding & Headers */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 rounded-full text-blue-400 text-xs font-mono tracking-wider uppercase font-bold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campaign Registration Form</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Upskilling Program <span className="bg-gradient-to-r from-blue-500 to-[#0EA5E9] bg-clip-text text-transparent">Counseling</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Fill in the details below to book a live mentor catalog review session and register for our upcoming cohorts.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200/85 p-6 sm:p-10 rounded-3xl backdrop-blur-xl shadow-2xl space-y-8 text-slate-850">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Group Name, Email, Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  Full Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white outline-none text-slate-800 transition-all placeholder-slate-400"
                />
              </div>
              
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  Phone Number <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white outline-none text-slate-800 transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  Email Address <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. john@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white outline-none text-slate-800 transition-all placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  College / Institute
                </label>
                <input
                  type="text"
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  placeholder="Enter your college name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white outline-none text-slate-800 transition-all placeholder-slate-400"
                />
              </div>
            </div>

            {/* Year & Student/Working Professional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  Academic Year
                </label>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white outline-none text-slate-800 transition-all cursor-pointer"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  Current Profile
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white outline-none text-slate-800 transition-all cursor-pointer"
                >
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                </select>
              </div>
            </div>

            {/* Upskilling (Dropdown of all courses) & Batch (July/August) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  Upskilling Goal (Course)
                </label>
                <select
                  name="upskilling"
                  value={form.upskilling}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white outline-none text-slate-800 transition-all cursor-pointer"
                >
                  {COURSES.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-2 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  Preferred Batch
                </label>
                <select
                  name="batch"
                  value={form.batch}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white outline-none text-slate-800 transition-all cursor-pointer"
                >
                  <option value="July Batch">July Batch</option>
                  <option value="August Batch">August Batch</option>
                </select>
              </div>
            </div>

            {/* Project Work Experience */}
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-2 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                Project / Work Experience
              </label>
              <input
                type="text"
                name="projectExp"
                value={form.projectExp}
                onChange={handleChange}
                placeholder="Briefly describe your project/work experience (e.g. None, Basic HTML site, Python script)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white outline-none text-slate-800 transition-all placeholder-slate-400"
              />
            </div>

            {/* Why Interested */}
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-2 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                Why are you interested in this program?
              </label>
              <textarea
                name="whyInterested"
                rows={3}
                value={form.whyInterested}
                onChange={handleChange}
                placeholder="What is your learning goal or target outcome from this course..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white outline-none text-slate-800 transition-all placeholder-slate-400"
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
