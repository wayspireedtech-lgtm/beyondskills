import React, { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, ArrowLeft, BookOpen, MessageSquare, PhoneCall, 
  Brain, Code, Megaphone, Cloud, ShieldCheck, Sparkles, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PROGRAM_MAP = {
  'ai-data-science': {
    id: 'ai-data-science',
    title: 'Artificial Intelligence, Machine Learning & Data Science',
    badge: 'AI & Data Science Cohort',
    subtitle: 'Your registration for the AI, ML & Data Science Certification Program is confirmed.',
    description: 'Our senior AI program advisors have received your details. We are assembling your curriculum roadmap, live project repository access, and mentorship slot.',
    link: '/courses/ai-data-science',
    ctaText: 'Explore AI Syllabus',
    icon: Brain,
    colorClass: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  'full-stack-web-development': {
    id: 'full-stack-web-development',
    title: 'Full Stack Web Development (MERN & DevOps)',
    badge: 'Full Stack Developer Cohort',
    subtitle: 'Your registration for the Full Stack Web Development Program is confirmed.',
    description: 'Our development mentors are preparing your roadmap for live MERN stack projects, code reviews, and developer portfolio setup.',
    link: '/courses/full-stack-web-development',
    ctaText: 'Explore Full Stack Syllabus',
    icon: Code,
    colorClass: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  'digital-marketing': {
    id: 'digital-marketing',
    title: 'Digital Marketing & Performance Marketing',
    badge: 'Digital Marketing Program',
    subtitle: 'Your application for Digital & Performance Marketing has been received.',
    description: 'Our marketing strategy advisors will connect with you shortly to share live campaign budgets, SEO tools access, and Meta/Google ad case studies.',
    link: '/courses/digital-marketing',
    ctaText: 'Explore Marketing Syllabus',
    icon: Megaphone,
    colorClass: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  'cloud-computing': {
    id: 'cloud-computing',
    title: 'Cloud Computing & DevOps Engineering',
    badge: 'Cloud & DevOps Cohort',
    subtitle: 'Your application for Cloud Computing & DevOps Engineering is logged.',
    description: 'Our cloud architects will reach out with details on AWS, Docker, Kubernetes labs, and hands-on infrastructure projects.',
    link: '/courses/cloud-computing',
    ctaText: 'Explore Cloud Syllabus',
    icon: Cloud,
    colorClass: 'text-sky-600 bg-sky-50 border-sky-200'
  },
  'cyber-security': {
    id: 'cyber-security',
    title: 'Cyber Security & Ethical Hacking',
    badge: 'Cyber Security Certification',
    subtitle: 'Your application for Cyber Security & Ethical Hacking is confirmed.',
    description: 'Our security specialists will contact you with details on ethical hacking labs, network security tools, and certification guidance.',
    link: '/courses/cyber-security',
    ctaText: 'Explore Cyber Security Syllabus',
    icon: ShieldCheck,
    colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  }
};

function getProgramDetails(programKey, queryParams) {
  const queryProg = queryParams.get('program') || queryParams.get('course') || queryParams.get('program_name') || queryParams.get('slug');
  const rawKey = (programKey || queryProg || '').toLowerCase().trim();

  if (PROGRAM_MAP[rawKey]) {
    return PROGRAM_MAP[rawKey];
  }

  if (rawKey.includes('ai') || rawKey.includes('data-science') || rawKey.includes('machine-learning')) {
    return PROGRAM_MAP['ai-data-science'];
  }
  if (rawKey.includes('full-stack') || rawKey.includes('web-dev') || rawKey.includes('mern') || rawKey.includes('fullstack')) {
    return PROGRAM_MAP['full-stack-web-development'];
  }
  if (rawKey.includes('digital-marketing') || rawKey.includes('performance-marketing') || rawKey.includes('marketing')) {
    return PROGRAM_MAP['digital-marketing'];
  }
  if (rawKey.includes('cloud') || rawKey.includes('devops')) {
    return PROGRAM_MAP['cloud-computing'];
  }
  if (rawKey.includes('cyber') || rawKey.includes('security') || rawKey.includes('ethical-hacking')) {
    return PROGRAM_MAP['cyber-security'];
  }

  if (rawKey) {
    const formattedTitle = rawKey
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());

    return {
      id: rawKey,
      title: formattedTitle,
      badge: `${formattedTitle} Program`,
      subtitle: `Your application for ${formattedTitle} has been logged in our system.`,
      description: `A dedicated program advisor will review your profile and reach out with your syllabus preview, batch schedules, and enrollment details.`,
      link: '/courses',
      ctaText: 'Explore All Courses',
      icon: BookOpen,
      colorClass: 'text-blue-600 bg-blue-50 border-blue-200'
    };
  }

  return {
    id: 'general',
    title: 'BeyondSkills Professional Certification',
    badge: 'Submission Received',
    subtitle: 'Thank you for getting in touch with team BeyondSkills.',
    description: 'We have registered your details in our system. A program advisor or technical manager will connect with you shortly.',
    link: '/courses',
    ctaText: 'Explore Courses Catalog',
    icon: BookOpen,
    colorClass: 'text-blue-600 bg-blue-50 border-blue-200'
  };
}

export default function ThankYou() {
  const { program } = useParams();
  const [searchParams] = useSearchParams();
  const programDetails = getProgramDetails(program, searchParams);
  const ProgramIcon = programDetails.icon;

  useEffect(() => {
    document.title = `Thank You - ${programDetails.title} | BeyondSkills`;
    
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

    // Fire Meta Pixel and Google Analytics Lead events on Thank You page load
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'Lead', {
          content_name: programDetails.title,
          content_category: programDetails.id,
          page_url: window.location.href
        });
        window.fbq('trackCustom', 'CourseLeadSubmission', {
          course: programDetails.title,
          course_id: programDetails.id
        });
      } catch (err) {
        console.error('Meta Pixel Thank You track error:', err);
      }
    }

    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'generate_lead', {
          event_category: 'Lead',
          event_label: programDetails.title,
          value: 1
        });
      } catch (err) {
        console.error('Google Analytics Thank You track error:', err);
      }
    }
  }, [programDetails]);

  return (
    <div className="text-slate-900 min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-transparent">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="max-w-2xl w-full text-center space-y-8 z-10 relative">
        {/* Animated Check Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 border border-emerald-200/50 text-emerald-500 shadow-lg shadow-emerald-500/10 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs font-bold tracking-widest text-[#2A4BFF] uppercase bg-[#2A4BFF]/10 border border-[#2A4BFF]/20 px-4 py-1.5 rounded-full inline-flex items-center space-x-2 font-mono">
              <ProgramIcon className="w-3.5 h-3.5 text-[#2A4BFF]" />
              <span>{programDetails.badge}</span>
            </span>
          </div>

          <h1 className="logo-font text-3xl sm:text-4xl font-extrabold text-[#0A0E35] leading-tight">
            Thank You for Registering for <span className="text-[#2A4BFF]">{programDetails.title}</span>!
          </h1>
          
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            {programDetails.subtitle} {programDetails.description}
          </p>
        </div>

        {/* Selected Program Summary Card */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-2xl shadow-sm text-left space-y-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Selected Program</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Application Verified</span>
            </span>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-[#2A4BFF]/10 text-[#2A4BFF] mt-0.5">
              <ProgramIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{programDetails.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">BeyondSkills Executive Industry Certification</p>
            </div>
          </div>
        </div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-lg mx-auto">
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl text-left space-y-2">
            <div className="flex items-center space-x-2.5 text-[#2A4BFF]">
              <PhoneCall className="w-4 h-4" />
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">Call SLA</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Our admissions team typically calls within 2–4 hours (Mon–Sat, 10 AM to 7 PM IST).
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl text-left space-y-2">
            <div className="flex items-center space-x-2.5 text-[#2A4BFF]">
              <MessageSquare className="w-4 h-4" />
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">WhatsApp Counseling</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Check your mobile for counseling schedules, syllabus PDF download link, and mentor slots.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={programDetails.link}
            className="w-full sm:w-auto bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-xl shadow-lg shadow-[#2A4BFF]/15 transition-all text-center flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{programDetails.ctaText}</span>
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
