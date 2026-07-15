import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { COURSES, getDbItem, setDbItem } from '../utils/mockDb';
import { BookOpen, User, CheckCircle, ExternalLink, Award } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = getDbItem('beyondskills_current_user', null);
    if (!loggedInUser) {
      navigate('/auth');
      return;
    }
    
    // Fetch latest user data from DB to catch LMS credentials updates
    const usersList = getDbItem('beyondskills_users', []);
    const latestUserRecord = usersList.find(u => u.email === loggedInUser.email);
    
    if (latestUserRecord) {
      setUser(latestUserRecord);
      setDbItem('beyondskills_current_user', latestUserRecord);
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  if (!user) return null;

  const hasCourses = user.activeCourses && user.activeCourses.length > 0;

  return (
    <div className="text-slate-900 min-h-screen pt-12 pb-24 relative">
      {/* Background radial glow */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative space-y-8 animate-fade-in">
        
        {/* Header Block with Log Out */}
        <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-purple/10 border border-brand-purple/30 text-brand-purple p-2.5 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 leading-none">{user.name}</h2>
              <p className="text-[10px] text-slate-500 font-mono mt-1">Student ID: {user.studentId || 'N/A'}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('beyondskills_current_user');
              window.dispatchEvent(new Event('auth_change'));
              navigate('/auth');
            }}
            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wide transition-all"
          >
            Sign Out
          </button>
        </div>

        {!hasCourses ? (
          /* IF STUDENT HAS NO ACTIVE COURSES */
          <div className="glass-panel p-10 rounded-2xl border border-slate-200/60 text-center max-w-xl mx-auto space-y-6">
            <Award className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="font-bold text-slate-900 text-base">No Allocated Courses Found</h3>
            <p className="text-xs text-slate-550 leading-relaxed max-w-md mx-auto">
              You are registered in the student login database, but have not completed checkout payments for any certification program. Navigate to our catalog to select courses.
            </p>
            <Link to="/courses" className="inline-block bg-brand-purple hover:bg-brand-purple/90 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all">
              Browse Course Catalog
            </Link>
          </div>
        ) : (
          /* ENROLLMENT SUCCESSFUL VIEW */
          <>
            {/* Enrollment Status Card */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-200/60 text-center space-y-6">
              <div className="w-16 h-16 bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-3 py-1 rounded-full uppercase tracking-widest">Enrollment Status: Active</span>
                <h1 className="logo-font text-2.5xl sm:text-3xl font-extrabold text-slate-900 mt-2">Enrollment Successful!</h1>
                <p className="text-xs text-slate-550 leading-relaxed max-w-md mx-auto">
                  Your payment has been successfully verified. You have been granted 1-year LMS access from the batch start date to the following professional upskilling program(s).
                </p>
              </div>

              {/* Enrolled Courses list */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-w-md mx-auto text-left space-y-2.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Allocated Programs:</span>
                {user.activeCourses.map((cId) => {
                  const matchedCourse = COURSES.find(c => c.id === cId);
                  return (
                    <div key={cId} className="flex items-center justify-between border-b border-slate-800 last:border-0 pb-2 last:pb-0">
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{matchedCourse?.title || cId.replace(/-/g, ' ')}</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">{matchedCourse?.duration || '3 Months'} • {matchedCourse?.delivery || 'Recorded + Live'}</p>
                      </div>
                      <span className="text-[9px] font-bold text-brand-purple tracking-wider bg-brand-purple/10 px-2 py-0.5 rounded border border-brand-purple/35 uppercase">Active</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LMS Credentials Access Card */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-200/60 space-y-6">
              <div className="flex items-center space-x-3 border-b border-slate-200/60 pb-4">
                <BookOpen className="w-5 h-5 text-brand-purple" />
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">Wayspire LMS Access Credentials</h3>
              </div>

              {user.lmsUsername && user.lmsPassword ? (
                <div className="space-y-6">
                  <p className="text-xs text-slate-550 leading-normal">
                    Your credentials for the Wayspire LMS portal have been generated and allocated by the admin team. Use the details below to log in:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">LMS Username / Email</span>
                      <span className="text-xs font-bold font-mono text-slate-100 selection:bg-brand-purple/30">{user.lmsUsername}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">LMS Password</span>
                      <span className="text-xs font-bold font-mono text-slate-100 selection:bg-brand-purple/30">{user.lmsPassword}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a 
                      href="https://lms.wayspireedtech.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-colors shadow-lg shadow-brand-purple/10"
                    >
                      <span>Go to Wayspire LMS Portal</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start space-x-3.5">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-purple border-t-transparent mt-0.5"></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Credentials Allocation in Progress</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        Our admin team is currently setting up your profile on the Wayspire LMS servers. 
                        Your unique username and password will be displayed here within 2 to 4 hours. 
                        Please check back shortly.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
