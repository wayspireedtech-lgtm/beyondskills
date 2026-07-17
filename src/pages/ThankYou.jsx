import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, BookOpen, MessageSquare, PhoneCall } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ThankYou() {
  useEffect(() => {
    document.title = "Thank You | BeyondSkills";
    
    // Trigger celebratory confetti on load
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.55 }
      });
    } catch (err) {
      console.log("Confetti trigger deferred:", err);
    }
  }, []);

  return (
    <div className="text-slate-900 min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-white">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="max-w-xl w-full text-center space-y-8 z-10 relative">
        {/* Animated Check Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 border border-emerald-200/50 text-emerald-500 shadow-lg shadow-emerald-500/10 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#2A4BFF] uppercase bg-[#2A4BFF]/10 border border-[#2A4BFF]/20 px-3.5 py-1.5 rounded-full inline-block font-mono">
            Submission Received
          </span>
          <h1 className="logo-font text-3xl sm:text-4xl font-extrabold text-[#0A0E35] leading-tight">
            Thank You for Reaching Out!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Thank you for getting in touch with team <strong className="text-slate-800">BeyondSkills</strong>. We have registered your details in our system. A program advisor or technical manager will connect with you shortly.
          </p>
        </div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl text-left space-y-2">
            <div className="flex items-center space-x-2.5 text-[#2A4BFF]">
              <PhoneCall className="w-4 h-4" />
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">Call SLA</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              We typically reach out within 2–4 hours during business days (Mon–Sat, 10 AM to 7 PM).
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl text-left space-y-2">
            <div className="flex items-center space-x-2.5 text-[#2A4BFF]">
              <MessageSquare className="w-4 h-4" />
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">WhatsApp Support</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Keep an eye on your mobile for a message from our team regarding counseling schedules.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link
            to="/courses"
            className="w-full sm:w-auto bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-xl shadow-lg shadow-[#2A4BFF]/15 transition-all text-center flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Other Courses</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-xl transition-all text-center flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
