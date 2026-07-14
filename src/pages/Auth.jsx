import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDbItem, setDbItem } from '../utils/mockDb';
import { Lock, Mail, Phone, User, Send, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();

  // Navigation / Mode states
  const [authType, setAuthType] = useState('mobile'); // 'mobile' or 'google'
  const [step, setStep] = useState('mobile-input'); // 'mobile-input', 'register-collect', 'otp-verify'

  // Input states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registerForm, setRegisterForm] = useState({ name: '', email: '' });
  const [enteredOtp, setEnteredOtp] = useState('');

  // Cache/Validation states
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [currentUserData, setCurrentUserData] = useState(null); // cache details for login
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Google Client ID Configuration states
  const [clientId, setClientId] = useState(localStorage.getItem('beyondskills_google_client_id') || '');
  const [clientIdInput, setClientIdInput] = useState('');

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

    // Always trigger custom toast notification for dry-run testing / visibility
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `[BeyondSkills] Login Verification OTP`,
        body: `Hi ${name},\n\nYour 4-Digit login verification code is: ${otp}.\n\nThis OTP has been triggered via EmailJS to your address: ${email}.`,
      }
    }));

    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS environment keys not defined in environment variables. Falling back to sandbox toast notification.");
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

  // Handle mobile form submission (Next)
  const handleMobileSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    // Validate 10-digit number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = getDbItem('beyondskills_users', []);
      const matchedUser = users.find(u => u.phone === cleanPhone);

      // Generate random 4-digit OTP
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);

      if (matchedUser) {
        // User exists -> trigger OTP directly
        setCurrentUserData(matchedUser);
        triggerOtpEmail(matchedUser.email, matchedUser.name, code);
        setStep('otp-verify');
        setInfo(`OTP verification code dispatched to ${matchedUser.email}.`);
      } else {
        // New User -> collect name and email first
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

    if (!registerForm.name.trim() || !registerForm.email.trim()) {
      setError('Please fill in all registration fields.');
      return;
    }

    const users = getDbItem('beyondskills_users', []);
    const emailExists = users.some(u => u.email === registerForm.email.trim());
    if (emailExists) {
      setError('An account with this email address already exists. Please use another.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);

      // Cache details for verification
      const tempUser = {
        name: registerForm.name,
        email: registerForm.email,
        phone: phoneNumber.replace(/\D/g, ''),
        password: `BS-${Math.floor(100000 + Math.random() * 900000)}`,
        studentId: `BS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        activeCourses: []
      };

      setCurrentUserData(tempUser);
      triggerOtpEmail(tempUser.email, tempUser.name, code);
      setStep('otp-verify');
      setInfo(`OTP verification code dispatched to ${tempUser.email}.`);
      setLoading(false);
    }, 800);
  };

  // Handle OTP verification
  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (enteredOtp !== generatedOtp) {
      setError('Invalid OTP code. Please check the code sent or check the toast popup notification.');
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
    if (!clientId) {
      setError('Please configure Google Client ID first.');
      return;
    }
    const redirectUri = encodeURIComponent(window.location.origin + '/auth');
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile`;
    window.location.href = oauthUrl;
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

  return (
    <div className="text-slate-900 min-h-[80vh] flex items-center justify-center p-6 bg-[#F8FAFC] relative">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

      <div className="bg-white border border-slate-200/80 p-8 rounded-3xl max-w-sm w-full z-10 shadow-xl space-y-6 animate-fade-in">
        
        {/* Welcome Text */}
        <div className="text-center space-y-2">
          <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight">Welcome Back.</h2>
          <p className="text-xs text-slate-550 leading-normal max-w-[280px] mx-auto">
            Sign in to continue your learning journey with BeyondSkills.
          </p>
        </div>

        {/* Segmented Pill Selector (Mobile vs Google) */}
        {step !== 'otp-verify' && step !== 'register-collect' && (
          <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 border border-slate-200/30">
            <button
              type="button"
              onClick={() => setAuthType('mobile')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${authType === 'mobile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Mobile
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
            {authType === 'mobile' && step === 'mobile-input' && (
              /* MOBILE NUMBER INPUT FORM */
              <form onSubmit={handleMobileSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your 10-digit number"
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

            {authType === 'mobile' && step === 'register-collect' && (
              /* REGISTRATION INFO COLLECTION FORM */
              <form onSubmit={handleRegisterDetailsSubmit} className="space-y-4 animate-fade-in">
                <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-xl">
                  <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                    Account not found for <strong>{phoneNumber}</strong>. Fill in the details below to initialize profile registration.
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
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="e.g. jatin@gmail.com"
                    className="w-full bg-[#FAFAFA] border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('mobile-input')}
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

            {authType === 'mobile' && step === 'otp-verify' && (
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
                  Enter the OTP code received in your email (or check the alert toast in the corner of your page).
                </p>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(currentUserData?.activeCourses ? 'mobile-input' : 'register-collect')}
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
              <div className="space-y-4 py-2">
                {!clientId ? (
                  /* Enter Client ID configuration block */
                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      To configure real Google Authentication, please input your **Google Client ID** below. You can get one from the Google Cloud Credentials Console.
                    </p>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Google Client ID</label>
                      <input
                        type="text"
                        value={clientIdInput}
                        onChange={(e) => setClientIdInput(e.target.value)}
                        placeholder="your-client-id.apps.googleusercontent.com"
                        className="w-full bg-[#FAFAFA] border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm"
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
                      className="w-full bg-[#0F5CFC] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs uppercase transition-colors"
                    >
                      Save & Initialize
                    </button>
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={handleMockGoogleLogin}
                        className="text-[10px] text-slate-500 hover:underline uppercase tracking-wider font-semibold"
                      >
                        Demo Sign In (Simulated)
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Continue with Real Google authentication */
                  <div className="space-y-4 text-center">
                    <button
                      type="button"
                      onClick={handleRealGoogleLogin}
                      className="w-full flex items-center justify-center space-x-3 border border-slate-200 shadow-sm rounded-xl py-3.5 text-slate-800 font-bold hover:bg-slate-50 transition-all text-xs"
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
                        className="text-[10px] text-slate-500 hover:underline uppercase tracking-wider font-semibold"
                      >
                        Demo Sign In (Simulated)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem('beyondskills_google_client_id');
                          setClientId('');
                          setClientIdInput('');
                        }}
                        className="text-[10px] text-slate-400 hover:text-slate-650 underline uppercase tracking-wider font-semibold"
                      >
                        Change / Reset Client ID
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer Disclaimer */}
        <p className="text-[10px] text-slate-400 text-center leading-normal">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>

      </div>
    </div>
  );
}
