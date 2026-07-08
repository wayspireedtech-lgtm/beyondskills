import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDbItem, setDbItem } from '../utils/mockDb';
import { Lock, Mail, Phone, User, Send, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
      setError('Invalid email or password. Use student@beyondskills.in / password for testing.');
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
                <input type="email" required value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-brand-purple outline-none" placeholder="student@beyondskills.in" />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <button type="button" onClick={() => setMode('reset')} className="text-[10px] text-brand-purple hover:underline focus:outline-none uppercase font-semibold">Forgot Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input type="password" required value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-brand-purple outline-none" placeholder="password" />
              </div>
            </div>

            <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-1.5">
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-[10px] text-slate-500 text-center mt-6">
              Test accounts:<br />
              Student: <span className="text-slate-700 font-mono">student@beyondskills.in / password</span><br />
              Admin: <span className="text-slate-700 font-mono">admin@beyondskills.in / admin123</span>
            </div>
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

      </div>
    </div>
  );
}
