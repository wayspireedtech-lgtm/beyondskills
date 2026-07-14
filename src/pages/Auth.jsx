import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDbItem, setDbItem } from '../utils/mockDb';
import { Lock, Mail, Phone, User, Send, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { saveUserToSupabase } from '../utils/supabaseClient';

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login, register, reset, otp
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [otpVal, setOtpVal] = useState('');
  
  const [tempRegisterData, setTempRegisterData] = useState(null);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [authType, setAuthType] = useState('mock'); // 'mock' or 'real'
  const [clientId, setClientId] = useState(localStorage.getItem('beyondskills_google_client_id') || '');
  const [clientIdInput, setClientIdInput] = useState('');

  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const handleSelectGoogleAccount = (email, roleName) => {
    setError(null);
    setInfo(null);

    if (email === 'guest@gmail.com') {
      setError('Access Denied. Google Login is restricted to authorized Sales & CRM accounts only.');
      setGoogleModalOpen(false);
      return;
    }

    setGoogleModalOpen(false);
    setInfo(`Authentication Successful as ${email}! Redirecting to CRM Portal (GradusCRM)...`);

    setTimeout(() => {
      const crmSession = { email, name: roleName, type: 'CRM_Agent' };
      setDbItem('beyondskills_current_user', crmSession);
      window.dispatchEvent(new Event('auth_change'));
      window.location.href = 'https://www.graduscrm.online';
    }, 2000);
  };

  // Dynamically load Google Identity Services client script
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize and Render Real Google Button when modal is open and real auth is selected
  React.useEffect(() => {
    if (googleModalOpen && authType === 'real' && clientId && window.google) {
      // Small timeout to allow container element to render in DOM
      const timer = setTimeout(() => {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              const payload = decodeJwt(response.credential);
              if (payload && payload.email) {
                const isAuthorized = payload.email.endsWith('@beyondskills.in') || 
                                     payload.email === 'admin@beyondskills.in' || 
                                     payload.email.includes('sales') || 
                                     payload.email.includes('admin');
                
                if (isAuthorized) {
                  setGoogleModalOpen(false);
                  setInfo(`Authentication Successful as ${payload.email}! Redirecting to CRM Portal (GradusCRM)...`);
                  
                  const crmSession = { email: payload.email, name: payload.name || 'Sales Agent', type: 'CRM_Agent' };
                  setDbItem('beyondskills_current_user', crmSession);
                  window.dispatchEvent(new Event('auth_change'));
                  
                  setTimeout(() => {
                    window.location.href = 'https://www.graduscrm.online';
                  }, 2000);
                } else {
                  setError(`Access Denied: ${payload.email} is not authorized for CRM access.`);
                  setGoogleModalOpen(false);
                }
              }
            }
          });

          window.google.accounts.id.renderButton(
            document.getElementById('google-real-button-container'),
            { theme: 'filled_blue', size: 'large', width: 280 }
          );
        } catch (err) {
          console.error('Failed to initialize Google accounts ID:', err);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [googleModalOpen, authType, clientId]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    
    // Admin login shortcut
    if (loginForm.email === 'admin@beyondskills.in' && loginForm.password === 'admin123') {
      const adminSession = { email: 'admin@beyondskills.in', name: 'BeyondSkills Administrator', studentId: 'DV-ADMIN' };
      setDbItem('beyondskills_current_user', adminSession);
      window.dispatchEvent(new Event('auth_change'));
      navigate('/admin');
      return;
    }

    const users = getDbItem('beyondskills_users', []);
    const match = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    
    if (match) {
      setDbItem('beyondskills_current_user', match);
      window.dispatchEvent(new Event('auth_change'));
      
      // If student has active courses, go to dashboard, else browse courses
      if (match.activeCourses && match.activeCourses.length > 0) {
        navigate('/dashboard');
      } else {
        navigate('/courses');
      }
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    const users = getDbItem('beyondskills_users', []);
    const exists = users.find(u => u.email === registerForm.email);
    if (exists) {
      setError('An account with this email already exists.');
      return;
    }

    // Save temporary registration data, trigger OTP verification modal
    setTempRegisterData(registerForm);
    setMode('otp');
    
    // Dispatch simulated OTP toast within SLA
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `OTP Code Verification Dispatch`,
        body: `Your mock security code is: 2026.\n\nPlease enter this on your registration verification page to complete onboarding.`,
      }
    }));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpVal !== '2026') {
      setError('Invalid OTP code. Please enter 2026 (provided in the toast notification).');
      return;
    }

    if (!tempRegisterData) return;

    const users = getDbItem('beyondskills_users', []);
    const newStudentId = `BS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      name: tempRegisterData.name,
      email: tempRegisterData.email,
      phone: tempRegisterData.phone,
      password: tempRegisterData.password,
      studentId: newStudentId,
      activeCourses: [] // Empty courses initially, needs checkout
    };

    users.push(newRecord);
    setDbItem('beyondskills_users', users);
    
    // Log user registration to Supabase
    saveUserToSupabase(newRecord).catch(err => console.error('Failed to save registered user to Supabase:', err));
    
    // Automatically log in the user
    setDbItem('beyondskills_current_user', newRecord);
    window.dispatchEvent(new Event('auth_change'));
    
    setInfo('Registration successful! Redirecting to course catalog...');
    setTimeout(() => {
      navigate('/courses');
    }, 2000);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setInfo(`A temporary reset token has been generated and mock emailed to ${resetEmail}. Check your mock alerts inbox.`);
    
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Password Recovery Token`,
        body: `Dear User,\n\nWe received a request to reset your password. Use the mock token below to log back in:\nToken: dv_pw_reset_8927\n\nContact support if you did not request this.`,
      }
    }));

    setTimeout(() => {
      setMode('login');
      setInfo(null);
    }, 4000);
  };

  return (
    <div className="text-slate-900 min-h-[80vh] flex items-center justify-center p-6 relative">
      {/* Back glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-200 max-w-md w-full z-10">
        
        {/* Tab Headers */}
        {mode !== 'otp' && (
          <div className="flex border-b border-slate-200 space-x-6 pb-2 mb-8">
            <button onClick={() => { setMode('login'); setError(null); setInfo(null); }} className={`pb-3 font-bold text-xs uppercase tracking-wider relative transition-colors ${mode === 'login' ? 'text-brand-purple' : 'text-slate-500 hover:text-slate-900'}`}>
              Login
              {mode === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple"></div>}
            </button>
            <button onClick={() => { setMode('register'); setError(null); setInfo(null); }} className={`pb-3 font-bold text-xs uppercase tracking-wider relative transition-colors ${mode === 'register' ? 'text-brand-purple' : 'text-slate-500 hover:text-slate-900'}`}>
              Register
              {mode === 'register' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple"></div>}
            </button>
          </div>
        )}

        {/* Error / Success Banners */}
        {error && (
          <div className="bg-brand-blue/10 border border-brand-blue/20 text-brand-blue p-3 rounded-lg text-xs mb-6">
            {error}
          </div>
        )}
        {info && (
          <div className="bg-brand-purple/10 border border-brand-purple/20 text-brand-purple p-3 rounded-lg text-xs mb-6">
            {info}
          </div>
        )}

        {mode === 'login' && (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input type="email" required value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-brand-purple outline-none" placeholder="enteremail@gmail.com" />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <button type="button" onClick={() => setMode('reset')} className="text-[10px] text-brand-purple hover:underline focus:outline-none uppercase font-semibold">Forgot Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input type="password" required value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-brand-purple outline-none" placeholder="Password" />
              </div>
            </div>

            <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-1.5">
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="absolute bg-[#0b0f19] px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">or</span>
            </div>

            <button type="button" onClick={() => setGoogleModalOpen(true)} className="w-full bg-slate-900/65 hover:bg-slate-900 border border-slate-800 text-slate-200 font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.64 5.64 0 0 1 8.3 12.98a5.64 5.64 0 0 1 5.69-5.62c1.47 0 2.82.52 3.88 1.48L21 5.09C19.11 3.32 16.63 2.24 13.99 2.24A9.76 9.76 0 0 0 4.2 12a9.76 9.76 0 0 0 9.79 9.76c5.29 0 9.53-3.79 9.53-9.53 0-.61-.06-1.2-.17-1.76H12.24z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {mode === 'register' && (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input type="text" required value={registerForm.name} onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-brand-purple outline-none" placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input type="email" required value={registerForm.email} onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-brand-purple outline-none" placeholder="johndoe@gmail.com" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input type="tel" required value={registerForm.phone} onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-brand-purple outline-none" placeholder="9876543210" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input type="password" required value={registerForm.password} onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-brand-purple outline-none" placeholder="Create Password" />
              </div>
            </div>

            <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-1.5">
              <span>Send OTP Verification</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {mode === 'otp' && (
          /* OTP VERIFICATION MODAL SIMULATION */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center">
              <h3 className="font-bold text-slate-900 text-base">OTP Code Verification</h3>
              <p className="text-xs text-slate-500 mt-1">We have simulated sending an OTP SMS/Email to your device.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Enter 4-Digit OTP Code</label>
              <input type="text" maxLength={4} required value={otpVal} onChange={(e) => setOtpVal(e.target.value)} className="w-28 mx-auto block bg-white border border-slate-200/80 shadow-sm border border-white/15 rounded-lg py-2.5 text-center font-mono font-bold text-lg text-slate-900 focus:border-brand-purple outline-none tracking-widest" placeholder="0000" />
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-normal">
              Enter <strong className="text-brand-purple">2026</strong> (mock code provided in the active toast banner in the bottom corner of your browser screen).
            </p>

            <div className="flex space-x-3">
              <button type="button" onClick={() => setMode('register')} className="w-1/3 bg-slate-100 border border-slate-200 hover:bg-white/10 text-slate-900 font-bold py-2.5 rounded-lg text-xs uppercase">
                Back
              </button>
              <button type="submit" className="w-2/3 bg-brand-purple hover:bg-brand-purple/90 text-black font-bold py-2.5 rounded-lg text-xs uppercase tracking-widest transition-all">
                Verify & Register
              </button>
            </div>
          </form>
        )}

        {mode === 'reset' && (
          /* PASSWORD RESET FORM */
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="font-bold text-slate-900 text-base">Recover Password</h3>
              <p className="text-xs text-slate-500 mt-1">Enter your registered email address to receive a recovery reset key.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-brand-purple outline-none" placeholder="enteremail@gmail.com" />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="button" onClick={() => setMode('login')} className="w-1/3 bg-slate-100 border border-slate-200 hover:bg-white/10 text-slate-900 font-bold py-2.5 rounded-lg text-xs uppercase">
                Cancel
              </button>
              <button type="submit" className="w-2/3 bg-brand-purple hover:bg-brand-purple/90 text-black font-bold py-2.5 rounded-lg text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Recover Account</span>
              </button>
            </div>
          </form>
        )}

        {googleModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-slate-200 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="font-semibold text-sm text-slate-100">Sign in with Google</span>
              </div>

              {/* Toggle tabs for Mock vs Real Auth */}
              <div className="flex border-b border-slate-800 space-x-4 mb-4 pb-1.5 justify-center">
                <button 
                  type="button"
                  onClick={() => setAuthType('mock')}
                  className={`text-xs font-bold uppercase pb-1 relative ${authType === 'mock' ? 'text-brand-purple' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Mock Accounts
                  {authType === 'mock' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple"></div>}
                </button>
                <button 
                  type="button"
                  onClick={() => setAuthType('real')}
                  className={`text-xs font-bold uppercase pb-1 relative ${authType === 'real' ? 'text-brand-purple' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Real Google Login
                  {authType === 'real' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple"></div>}
                </button>
              </div>

              {authType === 'mock' ? (
                /* MOCK DEMO ACCOUNTS LIST */
                <div className="space-y-2">
                  <div className="text-center mb-3">
                    <p className="text-[10px] text-slate-400">Click any mock account to simulate redirect to CRM</p>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => handleSelectGoogleAccount('sales@beyondskills.in', 'Sales Executive')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 hover:border-brand-purple bg-slate-900/40 hover:bg-slate-900/80 transition-all text-left group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">sales@beyondskills.in</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Role: Sales Team (Access Allowed)</p>
                    </div>
                    <div className="text-[10px] font-bold text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity">Select &rarr;</div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => handleSelectGoogleAccount('admin@beyondskills.in', 'System Admin')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 hover:border-brand-purple bg-slate-900/40 hover:bg-slate-900/80 transition-all text-left group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">admin@beyondskills.in</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Role: Admin & CRM Lead (Access Allowed)</p>
                    </div>
                    <div className="text-[10px] font-bold text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity">Select &rarr;</div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => handleSelectGoogleAccount('guest@gmail.com', 'Standard Student')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 hover:border-brand-blue bg-slate-900/40 hover:bg-slate-900/80 transition-all text-left group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">guest@gmail.com</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Role: Normal Student (Access Denied for CRM)</p>
                    </div>
                    <div className="text-[10px] font-bold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">Select &rarr;</div>
                  </button>
                </div>
              ) : (
                /* REAL GOOGLE OAUTH FLOW */
                <div className="space-y-4 py-2">
                  {!clientId ? (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-400 leading-normal">
                        To enable actual Google authentication, enter your **Google Client ID** from the Google Cloud Credentials console.
                      </p>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Google Client ID</label>
                        <input 
                          type="text" 
                          value={clientIdInput} 
                          onChange={(e) => setClientIdInput(e.target.value)}
                          placeholder="xxxxxxxxxx.apps.googleusercontent.com" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-brand-purple transition-all"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          if (clientIdInput.trim()) {
                            localStorage.setItem('beyondskills_google_client_id', clientIdInput.trim());
                            setClientId(clientIdInput.trim());
                          }
                        }}
                        className="w-full bg-brand-purple hover:bg-brand-purple/95 text-white font-bold py-2.5 rounded-lg text-xs uppercase transition-colors"
                      >
                        Save & Initialize Button
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 py-2">
                      <p className="text-[11px] text-slate-400 text-center leading-normal">
                        Real Google authentication initialized. Click below to sign in:
                      </p>
                      <div id="google-real-button-container" className="flex justify-center w-full min-h-[40px] z-50 animate-pulse"></div>
                      <button 
                        type="button"
                        onClick={() => {
                          localStorage.removeItem('beyondskills_google_client_id');
                          setClientId('');
                          setClientIdInput('');
                        }}
                        className="text-[10px] text-slate-550 hover:text-slate-300 underline uppercase tracking-wider font-semibold mt-2"
                      >
                        Change / Reset Client ID
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button 
                type="button"
                onClick={() => setGoogleModalOpen(false)}
                className="mt-6 w-full text-center text-xs text-slate-400 hover:text-slate-200 uppercase tracking-wider font-semibold py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
