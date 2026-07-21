import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { COURSES, getDbItem, setDbItem, logUserAccess } from '../utils/mockDb';
import { validateEmail, validatePhone } from '../utils/validationHelpers';
import { BookOpen, User, CheckCircle, ExternalLink, Award, Camera, Check, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    status: 'College Student',
    college: '',
    gradYear: '',
    bio: '',
    avatar: ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loggedInUser = getDbItem('beyondskills_current_user', null);
    if (!loggedInUser) {
      navigate('/register/signin');
      return;
    }
    
    // Fetch latest user data from DB to catch LMS credentials updates
    const usersList = getDbItem('beyondskills_users', []);
    const latestUserRecord = usersList.find(u => u.email === loggedInUser.email);
    
    const targetUser = latestUserRecord || loggedInUser;
    setUser(targetUser);
    if (latestUserRecord) {
      setDbItem('beyondskills_current_user', latestUserRecord);
    }

    setProfileForm({
      name: targetUser.name || '',
      phone: targetUser.phone || targetUser.contact || '',
      status: targetUser.status || 'College Student',
      college: targetUser.college || '',
      gradYear: targetUser.gradYear || '',
      bio: targetUser.bio || '',
      avatar: targetUser.avatar || ''
    });
  }, [navigate]);

  if (!user) return null;

  const hasCourses = user.activeCourses && user.activeCourses.length > 0;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('File is too large. Please select an image under 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (profileForm.phone && !validatePhone(profileForm.phone)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setSaveSuccess(false);
    
    const usersList = getDbItem('beyondskills_users', []);
    const updatedUsers = usersList.map(u => {
      if (u.email === user.email) {
        return {
          ...u,
          name: profileForm.name,
          phone: profileForm.phone,
          status: profileForm.status,
          college: profileForm.status === 'College Student' ? profileForm.college : '',
          gradYear: profileForm.gradYear,
          bio: profileForm.bio,
          avatar: profileForm.avatar
        };
      }
      return u;
    });
    
    const updatedCurrentUser = {
      ...user,
      name: profileForm.name,
      phone: profileForm.phone,
      status: profileForm.status,
      college: profileForm.status === 'College Student' ? profileForm.college : '',
      gradYear: profileForm.gradYear,
      bio: profileForm.bio,
      avatar: profileForm.avatar
    };
    
    setDbItem('beyondskills_users', updatedUsers);
    setDbItem('beyondskills_current_user', updatedCurrentUser);
    setUser(updatedCurrentUser);
    
    logUserAccess(user.email, profileForm.name, 'Profile Updated');
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: 'Profile Updated Successfully',
        body: `Hi ${profileForm.name},\n\nYour profile details have been saved successfully.`
      }
    }));
  };

  const handleSignOut = () => {
    logUserAccess(user.email, user.name, 'Student Logged Out');
    localStorage.removeItem('beyondskills_current_user');
    window.dispatchEvent(new Event('auth_change'));
    navigate('/register/signin');
  };

  return (
    <div className="text-slate-900 min-h-screen pt-12 pb-24 relative">
      {/* Background radial glow */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative space-y-8 animate-fade-in">
        
        {/* Header Block with Log Out */}
        <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              {profileForm.avatar ? (
                <img 
                  src={profileForm.avatar} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="bg-brand-purple/10 border border-brand-purple/30 text-brand-purple p-2.5 rounded-xl">
                  <User className="w-6 h-6" />
                </div>
              )}
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 leading-none">{user.name}</h2>
              <p className="text-[10px] text-slate-500 font-mono mt-1">Student ID: {user.studentId || 'N/A'}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wide transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left/Middle Column (LMS & Courses) */}
          <div className="lg:col-span-2 space-y-8">
            {!hasCourses ? (
              /* IF STUDENT HAS NO ACTIVE COURSES */
              <div className="glass-panel p-10 rounded-2xl border border-slate-200/60 text-center space-y-6">
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
                    <h1 className="logo-font text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Enrollment Successful!</h1>
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

          {/* Right Column (Manage Details / Profile Form) */}
          <div className="space-y-8">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/60 space-y-6">
              <div className="flex items-center space-x-3 border-b border-slate-200/60 pb-4">
                <User className="w-5 h-5 text-brand-purple" />
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">My Profile Details</h3>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                
                {/* Profile Photo Uploader */}
                <div className="flex flex-col items-center justify-center space-y-2 pb-2">
                  <div className="relative group w-20 h-20">
                    {profileForm.avatar ? (
                      <img 
                        src={profileForm.avatar} 
                        alt="Avatar Preview" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-brand-purple/40 shadow-md transition-all group-hover:opacity-75"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-brand-purple/10 border-2 border-dashed border-brand-purple/30 text-brand-purple flex items-center justify-center shadow-inner group-hover:bg-brand-purple/20 transition-all">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                    <label 
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-brand-purple text-white p-1.5 rounded-full cursor-pointer hover:bg-brand-purple/90 transition-all shadow border border-white"
                      title="Upload photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </label>
                    <input 
                      id="avatar-upload"
                      type="file" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">Click icon to upload profile pic</span>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input 
                    type="text" required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-brand-purple transition-all text-xs"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email (Disabled / Locked) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1.5">Registered Email ID</label>
                  <input 
                    type="email" disabled
                    value={user.email}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed text-xs font-mono"
                  />
                  <p className="text-[9px] text-slate-400 mt-1">Email ID acts as login identifier and cannot be changed.</p>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1.5">Contact Number</label>
                  <input 
                    type="text" required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-brand-purple transition-all text-xs font-mono"
                    placeholder="e.g. +91 9953607074"
                  />
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1.5">Academic / Professional Status</label>
                  <select 
                    value={profileForm.status}
                    onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-brand-purple transition-all text-xs cursor-pointer"
                  >
                    <option value="College Student">College Student</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                {/* College / University (Conditional) */}
                {profileForm.status === 'College Student' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1.5">College / University Name</label>
                    <input 
                      type="text" required
                      value={profileForm.college}
                      onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-brand-purple transition-all text-xs"
                      placeholder="e.g. IIT Delhi"
                    />
                  </div>
                )}

                {/* Graduation Year */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1.5">
                    {profileForm.status === 'College Student' ? 'Expected Graduation Year' : 'Year of Graduation'}
                  </label>
                  <input 
                    type="number" required min="1950" max="2035"
                    value={profileForm.gradYear}
                    onChange={(e) => setProfileForm({ ...profileForm, gradYear: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-brand-purple transition-all text-xs font-mono"
                    placeholder="e.g. 2027"
                  />
                </div>

                {/* Bio / Headline */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase tracking-wider mb-1.5">Bio / Headline</label>
                  <textarea 
                    rows="3"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-brand-purple transition-all text-xs resize-none"
                    placeholder="Briefly describe your career goals or current background..."
                  />
                </div>

                {/* Action button */}
                <button 
                  type="submit"
                  className="w-full bg-brand-purple hover:bg-brand-purple/95 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Details Saved!</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
