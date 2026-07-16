import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDbItem, setDbItem } from '../utils/mockDb';
import { Lock, Mail, Phone, User, Send, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();

  // Navigation / Mode states
  const [authType, setAuthType] = useState('email'); // 'email' or 'google'
  const [step, setStep] = useState('email-input'); // 'email-input', 'register-collect', 'otp-verify', 'admin-login', 'admin-forgot', 'admin-otp-verify', 'admin-new-password'

  // Input states (Students)
  const [email, setEmail] = useState('');
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '' });
  const [enteredOtp, setEnteredOtp] = useState('');

  // Input states (Admin)
  const [adminLoginForm, setAdminLoginForm] = useState({ email: 'beyondskills.ai@gmail.com', password: '' });
  const [adminForgotEmail, setAdminForgotEmail] = useState('');
  const [adminNewPasswordForm, setAdminNewPasswordForm] = useState({ password: '', confirmPassword: '' });

  // Cache/Validation states
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [currentUserData, setCurrentUserData] = useState(null); // cache details for login
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Google Client ID Configuration states (loaded from env with self-healing fallback)
  const [clientId, setClientId] = useState(() => {
    const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (envId && envId.endsWith('.apps.googleusercontent.com') && !envId.includes('mockclientid')) {
      return envId;
    }
    const cachedId = localStorage.getItem('beyondskills_google_client_id');
    if (cachedId) {
      const isValid = cachedId.endsWith('.apps.googleusercontent.com') && !cachedId.includes('mockclientid');
      if (isValid) {
        return cachedId;
      } else {
        localStorage.removeItem('beyondskills_google_client_id');
      }
    }
    return '819274581670-not9uh8t1e2af0m720pgbiigs09jp3ec.apps.googleusercontent.com';
  });

  // Simulated Google Login & Client ID Configuration states
  const [showGoogleSimulatedModal, setShowGoogleSimulatedModal] = useState(false);
  const [simulatedEmail, setSimulatedEmail] = useState('');
  const [simulatedName, setSimulatedName] = useState('');
  const [simulatedStep, setSimulatedStep] = useState(1); // 1 = chooser, 2 = custom form
  const [isConfiguringClient, setIsConfiguringClient] = useState(false);
  const [customClientIdInput, setCustomClientIdInput] = useState(clientId.includes('mockclientid') ? '' : clientId);

  // Handle Google OAuth redirect callback on component mount
  useEffect(() => {
    const handleCallback = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token=')) {
        setLoading(true);
        setError(null);
        setInfo(null);
        
        try {
          const params = new URLSearchParams(hash.replace('#', '?'));
          const token = params.get('access_token');
          
          if (token) {
            // Fetch profile data from Google UserInfo endpoint
            const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
            if (res.ok) {
              const googleUser = await res.json();
              if (googleUser && googleUser.email) {
                const users = getDbItem('beyondskills_users', []);
                let targetUser = users.find(u => u.email === googleUser.email);
                
                if (!targetUser) {
                  // Register new user from Google profile
                  targetUser = {
                    name: googleUser.name || 'Google Student',
                    email: googleUser.email,
                    phone: '',
                    password: `BS-${Math.floor(100000 + Math.random() * 900000)}`,
                    studentId: `BS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    activeCourses: []
                  };
                  users.push(targetUser);
                  setDbItem('beyondskills_users', users);
                }
                
                setDbItem('beyondskills_current_user', targetUser);
                window.dispatchEvent(new Event('auth_change'));
                
                // Clear URL hash securely
                window.history.replaceState(null, null, window.location.pathname);
                
                setInfo(`Authenticated via Google as ${googleUser.email}! Redirecting...`);
                setTimeout(() => {
                  if (targetUser.activeCourses && targetUser.activeCourses.length > 0) {
                    navigate('/dashboard');
                  } else {
                    navigate('/courses');
                  }
                }, 1500);
              }
            } else {
              setError('Failed to fetch user profile details from Google accounts endpoint.');
            }
          }
        } catch (err) {
          console.error("Error processing Google Auth Callback:", err);
          setError('Google Login callback encountered an error.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    handleCallback();
  }, [navigate]);

  // EmailJS Direct REST API Integration Helper
  const triggerOtpEmail = async (email, name, otp) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
    const isDemoMode = !serviceId || !templateId || !publicKey;

    // Trigger custom toast notification letting user know email was sent
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: isDemoMode ? `Verification Code Dispatched (Demo Mode)` : `Verification Code Dispatched`,
        body: isDemoMode 
          ? `Hi ${name},\n\nBecause EmailJS keys are not configured yet, here is your security OTP code: ${otp}\n(For production, configure your EmailJS credentials in the admin settings or env).`
          : `Hi ${name},\n\nWe sent a 4-digit verification code to your email address: ${email}.\nPlease check your inbox/spam folder.`,
      }
    }));

    // Log to console for development debug purposes only
    console.log(`[BeyondSkills Debug] Generated OTP: ${otp}`);

    if (isDemoMode) {
      console.warn("EmailJS environment keys not defined in environment variables. Logged OTP to console for debugging.");
      return false;
    }

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_name: name,
            to_email: email,
            otp_code: otp,
            company: 'BeyondSkills'
          }
        })
      });
      return res.ok;
    } catch (err) {
      console.error("EmailJS REST post trigger failed:", err);
      return false;
    }
  };

  // Handle email form submission (Next)
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    // Validate email format
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = getDbItem('beyondskills_users', []);
      const matchedUser = users.find(u => u.email === cleanEmail);

      // Generate random 4-digit OTP
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);

      if (matchedUser) {
        // User exists -> trigger OTP directly to email
        setCurrentUserData(matchedUser);
        triggerOtpEmail(matchedUser.email, matchedUser.name, code);
        setStep('otp-verify');
        setInfo(`OTP verification code sent to your email address: ${matchedUser.email}.`);
      } else {
        // New User -> collect name and phone number
        setRegisterForm({ name: '', email: cleanEmail, phone: '' });
        setStep('register-collect');
      }
      setLoading(false);
    }, 800);
  };

  // Handle registration details submission
  const handleRegisterDetailsSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!registerForm.name.trim() || !registerForm.phone.trim()) {
      setError('Please fill in all registration fields.');
      return;
    }

    const cleanPhone = registerForm.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const users = getDbItem('beyondskills_users', []);
    const phoneExists = users.some(u => u.phone === cleanPhone);
    if (phoneExists) {
      setError('An account with this phone number already exists. Please use another.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);

      // Cache details for verification
      const tempUser = {
        name: registerForm.name.trim(),
        email: registerForm.email.trim().toLowerCase(),
        phone: cleanPhone,
        password: `BS-${Math.floor(100000 + Math.random() * 900000)}`,
        studentId: `BS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        activeCourses: []
      };

      setCurrentUserData(tempUser);
      triggerOtpEmail(tempUser.email, tempUser.name, code);
      setStep('otp-verify');
      setInfo(`OTP verification code sent to your email address: ${tempUser.email}.`);
      setLoading(false);
    }, 800);
  };

  // Handle OTP verification
  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (enteredOtp !== generatedOtp) {
      setError('Invalid OTP code. Please check the code sent to your email.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = getDbItem('beyondskills_users', []);
      const userExists = users.some(u => u.email === currentUserData.email);

      let loggedInRecord = currentUserData;

      if (!userExists) {
        // Save new user registration
        users.push(currentUserData);
        setDbItem('beyondskills_users', users);
        loggedInRecord = currentUserData;
      } else {
        // Retrieve matched database user record
        const dbMatch = users.find(u => u.email === currentUserData.email);
        if (dbMatch) loggedInRecord = dbMatch;
      }

      setDbItem('beyondskills_current_user', loggedInRecord);
      window.dispatchEvent(new Event('auth_change'));

      setInfo('Authentication Successful! Redirecting to workspace...');
      
      setTimeout(() => {
        if (loggedInRecord.activeCourses && loggedInRecord.activeCourses.length > 0) {
          navigate('/dashboard');
        } else {
          navigate('/courses');
        }
      }, 1500);
    }, 1000);
  };

  // Real Google Login Redirect Flow
  const handleRealGoogleLogin = () => {
    const isMock = clientId.includes('mockclientid');
    const isValidFormat = clientId && clientId.endsWith('.apps.googleusercontent.com') && !isMock;

    if (isValidFormat) {
      const redirectUri = encodeURIComponent(window.location.origin + '/auth');
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile`;
      window.location.href = oauthUrl;
    } else {
      setShowGoogleSimulatedModal(true);
      setSimulatedStep(1);
    }
  };

  // Handle Simulated Google Login submission
  const handleSimulatedLoginSubmit = (email, name) => {
    setShowGoogleSimulatedModal(false);
    setLoading(true);
    setError(null);
    setInfo(null);

    setTimeout(() => {
      const emailLower = email.toLowerCase().trim();
      const users = getDbItem('beyondskills_users', []);
      let targetUser = users.find(u => u.email.toLowerCase() === emailLower);

      if (!targetUser) {
        // Register new user from simulated Google profile
        targetUser = {
          name: name || 'Google Student',
          email: emailLower,
          phone: '',
          password: `BS-${Math.floor(100000 + Math.random() * 900000)}`,
          studentId: `BS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          activeCourses: []
        };
        users.push(targetUser);
        setDbItem('beyondskills_users', users);
      }

      setDbItem('beyondskills_current_user', targetUser);
      window.dispatchEvent(new Event('auth_change'));

      setInfo(`Simulated Google Sign-in as ${emailLower} successful! Redirecting...`);
      
      setTimeout(() => {
        if (targetUser.activeCourses && targetUser.activeCourses.length > 0) {
          navigate('/dashboard');
        } else {
          navigate('/courses');
        }
      }, 1500);
    }, 1000);
  };

  // Mock Google Login Fallback
  const handleMockGoogleLogin = () => {
    setLoading(true);
    setError(null);
    setInfo(null);

    setTimeout(() => {
      const email = 'google.student@gmail.com';
      const name = 'Google Student';
      
      const users = getDbItem('beyondskills_users', []);
      let targetUser = users.find(u => u.email === email);

      if (!targetUser) {
        targetUser = {
          name,
          email,
          phone: '9999999999',
          password: `BS-${Math.floor(100000 + Math.random() * 900000)}`,
          studentId: `BS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          activeCourses: []
        };
        users.push(targetUser);
        setDbItem('beyondskills_users', users);
      }

      setDbItem('beyondskills_current_user', targetUser);
      window.dispatchEvent(new Event('auth_change'));

      setInfo('Logged in via Mock Google Student successfully! Redirecting...');
      setTimeout(() => {
        if (targetUser.activeCourses && targetUser.activeCourses.length > 0) {
          navigate('/dashboard');
        } else {
          navigate('/courses');
        }
      }, 1500);
    }, 1000);
  };

  // --- ADMIN LOGIN LOGIC ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const targetEmail = 'beyondskills.ai@gmail.com';
    const savedPassword = localStorage.getItem('beyondskills_admin_password') || '9953607074';
    
    // Fetch registered CRM users (BDAs/BDMs)
    const crmUsers = getDbItem('beyondskills_crm_users', []);
    const matchingUser = crmUsers.find(u => u.email.trim().toLowerCase() === adminLoginForm.email.trim().toLowerCase());

    let authenticatedUser = null;

    if (adminLoginForm.email.trim().toLowerCase() === targetEmail.toLowerCase()) {
      if (adminLoginForm.password === savedPassword) {
        authenticatedUser = {
          email: targetEmail,
          name: 'BeyondSkills Administrator',
          role: 'Admin',
          studentId: 'DV-ADMIN'
        };
      }
    } else if (matchingUser) {
      // Check custom BDA/BDM password (defaulting to BDA email name + '123' if not set)
      const userPassword = matchingUser.password || 'Gradus@123';
      if (adminLoginForm.password === userPassword) {
        authenticatedUser = {
          email: matchingUser.email,
          name: matchingUser.name,
          role: matchingUser.role,
          studentId: matchingUser.role + '-' + Math.floor(1000 + Math.random() * 9000)
        };
      }
    }

    if (!authenticatedUser) {
      setError('Invalid administrator or BDA credentials.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setDbItem('beyondskills_current_user', authenticatedUser);
      window.dispatchEvent(new Event('auth_change'));
      setLoading(false);
      setInfo(`${authenticatedUser.role} Authentication Successful! Redirecting to Console...`);
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    }, 1000);
  };

  // --- ADMIN FORGOT PASSWORD LOGIC ---
  const handleAdminForgotSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const targetEmail = 'beyondskills.ai@gmail.com';
    if (adminForgotEmail.trim() !== targetEmail) {
      setError('Only the registered admin email can receive verification keys.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);

      // Trigger OTP dispatch to admin email
      triggerOtpEmail(targetEmail, 'BeyondSkills Administrator', code);

      setStep('admin-otp-verify');
      setInfo('OTP code dispatched to beyondskills.ai@gmail.com.');
      setLoading(false);
    }, 800);
  };

  // --- ADMIN OTP VERIFY ---
  const handleAdminVerifyOtpSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (enteredOtp !== generatedOtp) {
      setError('Invalid OTP code. Please check the code sent or check the toast notification.');
      return;
    }

    setStep('admin-new-password');
    setEnteredOtp(''); // Reset OTP input state
  };

  // --- ADMIN RESET PASSWORD SAVE ---
  const handleAdminNewPasswordSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (adminNewPasswordForm.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (adminNewPasswordForm.password !== adminNewPasswordForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('beyondskills_admin_password', adminNewPasswordForm.password);
      setInfo('Admin password updated successfully! Please login with your new password.');
      setStep('admin-login');
      setAdminLoginForm({ email: 'beyondskills.ai@gmail.com', password: '' });
      setAdminNewPasswordForm({ password: '', confirmPassword: '' });
      setLoading(false);
    }, 1000);
  };

  const isAdminStep = step.startsWith('admin-');

  return (
    <div className="text-slate-900 min-h-[80vh] flex items-center justify-center p-6 bg-transparent relative">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

      <div className="bg-white border border-slate-200/80 p-8 rounded-3xl max-w-sm w-full z-10 shadow-xl space-y-6 animate-fade-in">
        
        {/* Welcome Text */}
        <div className="text-center space-y-2">
          <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight">
            {isAdminStep ? 'Admin Portal.' : 'Welcome Back.'}
          </h2>
          <p className="text-xs text-slate-550 leading-normal max-w-[280px] mx-auto">
            {isAdminStep 
              ? 'Administrator security panel login and credentials recovery.' 
              : 'Sign in to continue your learning journey with BeyondSkills.'}
          </p>
        </div>

        {/* Segmented Pill Selector (Email vs Google) - Student Only */}
        {!isAdminStep && step !== 'otp-verify' && step !== 'register-collect' && (
          <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 border border-slate-200/30">
            <button
              type="button"
              onClick={() => setAuthType('email')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${authType === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthType('google')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${authType === 'google' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Google
            </button>
          </div>
        )}

        {/* Error / Success Banners */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-xs font-medium animate-pulse">
            {error}
          </div>
        )}
        {info && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-xl text-xs font-medium flex items-center space-x-1.5">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{info}</span>
          </div>
        )}

        {/* Loading Spinner overlay */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Processing...</span>
          </div>
        )}

        {/* Conditional forms based on states */}
        {!loading && (
          <>
            {/* STUDENT FLOWS */}
            {!isAdminStep && (
              <>
                {authType === 'email' && step === 'email-input' && (
                  /* EMAIL ADDRESS INPUT FORM */
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-[#FAFAFA] border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0F5CFC] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/10"
                    >
                      Next
                    </button>
                  </form>
                )}

                {authType === 'email' && step === 'register-collect' && (
                  /* REGISTRATION INFO COLLECTION FORM */
                  <form onSubmit={handleRegisterDetailsSubmit} className="space-y-4 animate-fade-in">
                    <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-xl">
                      <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                        Account not found for <strong>{email}</strong>. Fill in the details below to initialize profile registration.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        placeholder="e.g. Jatin Kumar"
                        className="w-full bg-[#FAFAFA] border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        placeholder="Enter your 10-digit mobile number"
                        className="w-full bg-[#FAFAFA] border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep('email-input')}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-xs uppercase"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-[#0F5CFC] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/10"
                      >
                        Send OTP
                      </button>
                    </div>
                  </form>
                )}

                {authType === 'email' && step === 'otp-verify' && (
                  /* OTP CODE ENTRY FORM */
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-5 animate-fade-in">
                    <div className="text-center">
                      <h3 className="font-bold text-slate-800 text-sm">Verify Verification Code</h3>
                      <p className="text-[11px] text-slate-500 mt-1">We have sent a verification code to your email.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider text-center">4-Digit Security OTP</label>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="0000"
                        className="w-32 mx-auto block bg-[#FAFAFA] border border-slate-200/80 rounded-xl py-3 text-center font-mono font-extrabold text-lg text-slate-900 focus:border-blue-600 outline-none tracking-widest shadow-sm"
                      />
                    </div>

                    <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                      Enter the 4-digit code received in your registered email inbox.
                    </p>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(currentUserData?.activeCourses ? 'email-input' : 'register-collect')}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-xs uppercase"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-[#0F5CFC] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/10"
                      >
                        Verify
                      </button>
                    </div>
                  </form>
                )}

                 {authType === 'google' && (
                  /* GOOGLE SIGN IN TAB CONTENT */
                  <div className="space-y-4 py-2 text-center">
                    {clientId.includes('mockclientid') ? (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-xl text-left text-[11px] leading-relaxed space-y-2">
                        <div>
                          <strong>Real Google Sign-In is not configured:</strong>
                        </div>
                        <div className="text-slate-650">
                          A real Google Client ID is missing. Clicking <strong>Continue with Google</strong> will launch a <strong>Simulated Google Sign-In</strong> modal where you can sign in as any user.
                        </div>
                        {!isConfiguringClient ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsConfiguringClient(true);
                              setCustomClientIdInput('');
                            }}
                            className="text-amber-950 font-bold hover:underline flex items-center space-x-1 uppercase text-[10px] tracking-wider cursor-pointer"
                          >
                            Configure Client ID
                          </button>
                        ) : (
                          <div className="space-y-1.5 pt-1">
                            <input
                              type="text"
                              value={customClientIdInput}
                              onChange={(e) => setCustomClientIdInput(e.target.value)}
                              placeholder="Paste Google Client ID here"
                              className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-800 outline-none focus:border-amber-500"
                            />
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (customClientIdInput.trim()) {
                                    localStorage.setItem('beyondskills_google_client_id', customClientIdInput.trim());
                                    setClientId(customClientIdInput.trim());
                                    setIsConfiguringClient(false);
                                    setInfo('Google Client ID updated successfully.');
                                  } else {
                                    setError('Please enter a valid Client ID.');
                                  }
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsConfiguringClient(false)}
                                className="bg-slate-200 hover:bg-slate-355 text-slate-700 font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : !clientId.endsWith('.apps.googleusercontent.com') ? (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-left text-[11px] leading-relaxed space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <strong>Invalid Google Client ID format:</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              localStorage.removeItem('beyondskills_google_client_id');
                              setClientId('819274581670-not9uh8t1e2af0m720pgbiigs09jp3ec.apps.googleusercontent.com');
                              setCustomClientIdInput('');
                              setInfo('Google Client ID reset to default.');
                            }}
                            className="text-rose-600 font-bold hover:underline uppercase text-[9px] cursor-pointer"
                          >
                            Reset
                          </button>
                        </div>
                        <div className="text-slate-650">
                          The active Client ID (<code className="bg-rose-100/60 px-1 py-0.5 rounded font-mono break-all">{clientId}</code>) does not appear to be a valid Google Client ID. It must end with <code className="font-mono bg-rose-100/60 px-1 py-0.5 rounded">.apps.googleusercontent.com</code>.
                        </div>
                        <div className="text-slate-650 font-semibold pt-1">
                          Clicking <strong>Continue with Google</strong> will fallback to a <strong>Simulated Google Sign-In</strong> modal to prevent OAuth errors.
                        </div>
                        {!isConfiguringClient ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsConfiguringClient(true);
                              setCustomClientIdInput(clientId);
                            }}
                            className="text-rose-955 font-bold hover:underline flex items-center space-x-1 uppercase text-[10px] tracking-wider cursor-pointer"
                          >
                            Reconfigure Client ID
                          </button>
                        ) : (
                          <div className="space-y-1.5 pt-1">
                            <input
                              type="text"
                              value={customClientIdInput}
                              onChange={(e) => setCustomClientIdInput(e.target.value)}
                              placeholder="Paste Google Client ID here"
                              className="w-full bg-white border border-rose-300 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-800 outline-none focus:border-rose-500"
                            />
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (customClientIdInput.trim()) {
                                    localStorage.setItem('beyondskills_google_client_id', customClientIdInput.trim());
                                    setClientId(customClientIdInput.trim());
                                    setIsConfiguringClient(false);
                                    setInfo('Google Client ID updated successfully.');
                                  } else {
                                    setError('Please enter a valid Client ID.');
                                  }
                                }}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsConfiguringClient(false)}
                                className="bg-slate-200 hover:bg-slate-355 text-slate-700 font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={handleRealGoogleLogin}
                      className="w-full flex items-center justify-center space-x-3 border border-slate-200 shadow-sm rounded-xl py-3.5 text-slate-800 font-bold hover:bg-slate-50 transition-all text-xs cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.64 5.64 0 0 1 8.3 12.98a5.64 5.64 0 0 1 5.69-5.62c1.47 0 2.82.52 3.88 1.48L21 5.09C19.11 3.32 16.63 2.24 13.99 2.24A9.76 9.76 0 0 0 4.2 12a9.76 9.76 0 0 0 9.79 9.76c5.29 0 9.53-3.79 9.53-9.53 0-.61-.06-1.2-.17-1.76H12.24z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <div className="flex flex-col space-y-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleMockGoogleLogin}
                        className="text-[10px] text-slate-400 hover:text-slate-650 hover:underline uppercase tracking-wider font-semibold cursor-pointer"
                      >
                        Demo Sign In (Simulated)
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ADMIN FLOWS */}
            {isAdminStep && (
              <>
                {step === 'admin-login' && (
                  /* ADMIN EMAIL/PASSWORD LOGIN */
                  <form onSubmit={handleAdminLogin} className="space-y-4 animate-fade-in">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Admin Email</label>
                      <input
                        type="email"
                        required
                        value={adminLoginForm.email}
                        onChange={(e) => setAdminLoginForm({ ...adminLoginForm, email: e.target.value })}
                        placeholder="beyondskills.ai@gmail.com"
                        className="w-full bg-[#FAFAFA] border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Password</label>
                        <button
                          type="button"
                          onClick={() => { setStep('admin-forgot'); setError(null); setInfo(null); }}
                          className="text-[10px] text-blue-600 hover:underline uppercase font-bold"
                        >
                          Forgot?
                        </button>
                      </div>
                      <input
                        type="password"
                        required
                        value={adminLoginForm.password}
                        onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-[#FAFAFA] border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0F5CFC] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/10"
                    >
                      Login to Console
                    </button>
                  </form>
                )}

                {step === 'admin-forgot' && (
                  /* ADMIN FORGOT PASSWORD REQUEST */
                  <form onSubmit={handleAdminForgotSubmit} className="space-y-4 animate-fade-in">
                    <div className="text-center border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-800 text-sm">Recover Admin Password</h3>
                      <p className="text-[10px] text-slate-500 mt-1">Enter your registered admin email address below.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Registered Email</label>
                      <input
                        type="email"
                        required
                        value={adminForgotEmail}
                        onChange={(e) => setAdminForgotEmail(e.target.value)}
                        placeholder="beyondskills.ai@gmail.com"
                        className="w-full bg-[#FAFAFA] border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => { setStep('admin-login'); setError(null); setInfo(null); }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-xs uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-[#0F5CFC] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/10"
                      >
                        Send OTP
                      </button>
                    </div>
                  </form>
                )}

                {step === 'admin-otp-verify' && (
                  /* ADMIN OTP VERIFY */
                  <form onSubmit={handleAdminVerifyOtpSubmit} className="space-y-5 animate-fade-in">
                    <div className="text-center">
                      <h3 className="font-bold text-slate-800 text-sm">Admin OTP Verification</h3>
                      <p className="text-[11px] text-slate-500 mt-1">A verification code was dispatched to your email.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider text-center">4-Digit Security OTP</label>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="0000"
                        className="w-32 mx-auto block bg-[#FAFAFA] border border-slate-200/80 rounded-xl py-3 text-center font-mono font-extrabold text-lg text-slate-900 focus:border-blue-600 outline-none tracking-widest shadow-sm"
                      />
                    </div>

                    <p className="text-[10px] text-slate-550 text-center leading-relaxed">
                      Please enter the 4-digit code received in your admin email inbox.
                    </p>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => { setStep('admin-forgot'); setError(null); setInfo(null); }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-xs uppercase"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-[#0F5CFC] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/10"
                      >
                        Verify
                      </button>
                    </div>
                  </form>
                )}

                {step === 'admin-new-password' && (
                  /* ADMIN NEW PASSWORD INPUT */
                  <form onSubmit={handleAdminNewPasswordSubmit} className="space-y-4 animate-fade-in">
                    <div className="text-center border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-800 text-sm">Create New Admin Password</h3>
                      <p className="text-[10px] text-slate-500 mt-1">Passwords must be at least 6 characters in length.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">New Password</label>
                      <input
                        type="password"
                        required
                        value={adminNewPasswordForm.password}
                        onChange={(e) => setAdminNewPasswordForm({ ...adminNewPasswordForm, password: e.target.value })}
                        placeholder="At least 6 characters"
                        className="w-full bg-[#FAFAFA] border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={adminNewPasswordForm.confirmPassword}
                        onChange={(e) => setAdminNewPasswordForm({ ...adminNewPasswordForm, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full bg-[#FAFAFA] border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0F5CFC] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/10"
                    >
                      Save Password
                    </button>
                  </form>
                )}
              </>
            )}
          </>
        )}

        {/* Footer Disclaimer & Links */}
        <div className="space-y-3 pt-3 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 leading-normal">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setInfo(null);
              if (isAdminStep) {
                setStep('email-input');
              } else {
                setStep('admin-login');
              }
            }}
            className="text-[9px] text-[#0F5CFC] hover:text-blue-700 transition-colors uppercase tracking-widest font-bold block mx-auto hover:underline"
          >
            {isAdminStep ? 'Student Workspace Login' : 'Admin Panel Access'}
          </button>
        </div>

      </div>

      {/* Simulated Google Sign-In Modal */}
      {showGoogleSimulatedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[380px] rounded-2xl shadow-2xl border border-slate-100 p-8 space-y-6 text-slate-800 animate-fade-in">
            {/* Google Logo */}
            <div className="flex justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>

            {simulatedStep === 1 ? (
              <div className="space-y-4">
                <div className="text-center space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Choose an account</h3>
                  <p className="text-xs text-slate-500">to continue to <span className="font-semibold text-slate-700">BeyondSkills</span></p>
                </div>

                <div className="space-y-2 pt-2">
                  {/* Account 1 */}
                  <button
                    type="button"
                    onClick={() => handleSimulatedLoginSubmit('google.student@gmail.com', 'Google Student')}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      GS
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">Google Student</div>
                      <div className="text-[10px] text-slate-500 truncate">google.student@gmail.com</div>
                    </div>
                  </button>

                  {/* Account 2 */}
                  <button
                    type="button"
                    onClick={() => handleSimulatedLoginSubmit('vishal.beyondskills@gmail.com', 'Vishal Dev')}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      VD
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">Vishal Dev</div>
                      <div className="text-[10px] text-slate-500 truncate">vishal.beyondskills@gmail.com</div>
                    </div>
                  </button>

                  {/* Use another account option */}
                  <button
                    type="button"
                    onClick={() => setSimulatedStep(2)}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl border border-dashed border-slate-250 hover:bg-slate-50 transition-all text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-550 font-bold text-sm">
                      +
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-700">Use another account</div>
                      <div className="text-[10px] text-slate-450">Sign in with a custom Google email</div>
                    </div>
                  </button>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoogleSimulatedModal(false);
                      setSimulatedStep(1);
                      setSimulatedEmail('');
                      setSimulatedName('');
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 py-2 px-4 rounded-xl hover:bg-slate-50 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (simulatedEmail.trim() && simulatedName.trim()) {
                    handleSimulatedLoginSubmit(simulatedEmail.trim(), simulatedName.trim());
                  }
                }}
                className="space-y-4"
              >
                <div className="text-center space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Sign in with Google</h3>
                  <p className="text-xs text-slate-550">Enter details to simulate Google authentication</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={simulatedEmail}
                      onChange={(e) => setSimulatedEmail(e.target.value)}
                      placeholder="e.g. user@gmail.com"
                      className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={simulatedName}
                      onChange={(e) => setSimulatedName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 justify-end text-xs uppercase font-bold tracking-wider">
                  <button
                    type="button"
                    onClick={() => setSimulatedStep(1)}
                    className="text-slate-500 hover:text-slate-700 py-2 px-4 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0F5CFC] hover:bg-blue-700 text-white py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
