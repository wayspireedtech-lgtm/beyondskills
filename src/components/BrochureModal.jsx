import React, { useState } from 'react';
import { X, ArrowRight, Download } from 'lucide-react';
import { saveLeadToSupabase, getISTDateTimeString } from '../utils/supabaseClient';
import { getDbItem, setDbItem } from '../utils/dbHelpers';
import { validateEmail, validatePhone } from '../utils/validationHelpers';
import { LeadService } from '../utils/leadService';

export default function BrochureModal({ isOpen, onClose, course }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Student',
    studentDetails: '',
    jobRole: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen || !course) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Email Address', body: 'Please enter a valid email address (e.g. name@example.com).' }
      }));
      return;
    }
    if (!validatePhone(formData.phone)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Mobile Number', body: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).' }
      }));
      return;
    }
    setIsSubmitting(true);

    const leadResponse = await LeadService.submitLead({
      formId: `${course.title} Brochure Modal Form`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      program: course.title,
      studentDetails: formData.studentDetails || '',
      jobRole: formData.jobRole || '',
      companyName: formData.companyName || ''
    });

    setIsSubmitting(false);
    if (leadResponse.success) {
      setSubmitSuccess(true);
    } else {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Submission Failed', body: `We encountered an error while submitting your request: ${leadResponse.error || 'Please try again.'}` }
      }));
      return;
    }

    // 3. Trigger brochure PDF file download
    const mapping = {
      'artificial-intelligence': 'ai-ml.pdf',
      'machine-learning': 'ai-ml.pdf',
      'data-science': 'data-science-analytics.pdf',
      'data-analytics': 'data-science-analytics.pdf',
      'cyber-security': 'cyber-security.pdf',
      'hr-mgmt': 'hr-mgmt.pdf',
      'cloud-computing': 'cloud-computing.pdf',
      'stock-market': 'stock-market.pdf',
      'full-stack-web': 'full-stack-web.pdf',
      'digital-marketing-cert': 'digital-marketing-cert.pdf'
    };
    const filename = mapping[course.id] || `${course.id}.pdf`;
    const link = document.createElement('a');
    link.href = `/brochures/${filename}`;
    link.download = `${course.title.replace(/[^a-zA-Z0-9]/g, '_')}_Brochure.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Success delay before close
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'Student',
        studentDetails: '',
        jobRole: ''
      });
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 md:p-8 transform transition-all duration-300 scale-100 text-slate-800">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        {submitSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-brand-purple/10 border border-brand-purple/20 rounded-full flex items-center justify-center mx-auto text-brand-purple">
              <Download className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Downloading Brochure!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your syllabus brochure for <strong>{course.title}</strong> is preparing for download.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-[10px] font-bold text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Brochure Request
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3 leading-snug">
                Download Course Brochure
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Enter your academic/career status to instantly download the PDF brochure for <strong>{course.title}</strong>.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Name *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                  placeholder="Enter your full name" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Contact Number *</label>
                <input 
                  type="tel" 
                  required 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                  placeholder="+91 98765 43210" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Email ID *</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                  placeholder="name@gmail.com" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Current Status *</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                </select>
              </div>

              {formData.status === 'Student' ? (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Current Course / College Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.studentDetails} 
                    onChange={(e) => setFormData({...formData, studentDetails: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                    placeholder="e.g. BCA 2nd Year, Noida Institute" 
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Job Role / Designation *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.jobRole} 
                      onChange={(e) => setFormData({...formData, jobRole: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                      placeholder="e.g. Assistant HR Executive" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Company Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.companyName} 
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-purple outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                      placeholder="e.g. Google, Tech Mahindra" 
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Download Brochure'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
