import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Sparkles, Send, ArrowRight, GraduationCap, Briefcase, 
  Calendar, BookOpen, User, Phone, Mail, FileText, CheckCircle,
  Users, Code, Monitor, Compass, Award, ShieldCheck, Clock,
  Laptop, ChevronRight, Star, ChevronDown, ChevronUp, Download,
  MessageCircle, Target, Check
} from 'lucide-react';
import { COURSES, setDbItem, getDbItem } from '../utils/mockDb';
import { saveLeadToSupabase } from '../utils/supabaseClient';
import confetti from 'canvas-confetti';
import microsoftLogo from '../assets/microsoft.svg';
import adobeLogo from '../assets/adobe.svg';
import ibmLogo from '../assets/ibm.svg';

const CURRICULUM_GROUPS = [
  {
    title: "Python Programming Foundations",
    description: "Install environment, master syntax structure, file handling, and variable styling standards.",
    topics: [
      "Anaconda Environment Setup & Jupyter Notebook shortcuts",
      "Python Data Types & PEP 8 variable naming standards",
      "Control Flow: Conditional if/elif/else & for/while loops",
      "Data Structures: Lists, Tuples, Sets, and Dictionaries",
      "File Handling: Reading/writing files & with context managers",
      "Command Line Interface (CLI) & Terminal Navigation"
    ]
  },
  {
    title: "Data Analysis & Exploratory Visualization",
    description: "Clean, filter, transform, and plot actual datasets using industrial libraries.",
    topics: [
      "Introduction to ML libraries & NumPy array math operations",
      "Pandas: DataFrames cleaning, filtering, and transformation",
      "Exploratory Data Analysis (EDA) core concepts & techniques",
      "Matplotlib: Hands-on plotting & customized graphs",
      "Seaborn: Multi-dimensional data plots & advanced insights",
      "Interactive doubt-clearing & concept strengthening sessions"
    ]
  },
  {
    title: "Applied Statistics & Linear Models",
    description: "Understand mathematical logic, central tendency, dispersion, regressions, and evaluation metrics.",
    topics: [
      "Measures of Central Tendency & Measures of Dispersion",
      "IQR (Interquartile Range) stats & anomaly detection",
      "Supervised vs Unsupervised ML concepts & model fine-tuning",
      "Linear Regression: Theory, building, and evaluation metrics",
      "Logistic Regression: Concepts, metrics, and classification labs",
      "Model evaluation: ROC curves, AUC, F1 score, precision & recall"
    ]
  },
  {
    title: "Data Preprocessing & Tree-Based Models",
    description: "Normalize raw inputs, clean missing fields, scale features, and fit decision forests.",
    topics: [
      "Data Standardization, Normalization, & Scaling techniques",
      "Handling Missing Values & Outlier Treatment",
      "Feature Scaling and Feature Selection techniques",
      "Tree-Based Models: CART Classification & Regression Trees",
      "Ensemble learning: Bagging, Boosting, & Random Forests",
      "Neural Networks: Core concepts & Deep Learning fundamentals"
    ]
  },
  {
    title: "Natural Language Processing & Generative AI",
    description: "Preprocess text, build semantic vector mappings, write prompt scripts, and leverage transformers.",
    topics: [
      "NLTK: Text preprocessing, tokenization, & linguistic analysis",
      "spaCy: Advanced NLP, NER, and Industrial Applications",
      "Gensim: Topic Modeling, Word Embeddings, & Semantic Analysis",
      "FastText: Text Classification & Deep Learning-based NLP",
      "Generative AI: GANs, VAEs, & Large Language Models (LLMs)",
      "Hugging Face: Transformers, model hub, & prompt engineering",
      "Real-world use cases: ChatGPT/DALL-E, AI Agents & assistants"
    ]
  }
];

const PROJECTS = [
  {
    name: "Customer Churn Predictor",
    difficulty: "Intermediate",
    tools: ["Python", "Scikit-Learn", "Pandas", "Flask"],
    skills: ["Supervised Classification", "Feature Scaling", "REST API Development"],
    outcome: "Deploys a live predictive API estimating customer churn risk with 92% accuracy.",
    githubReady: true,
    mockType: "churn"
  },
  {
    name: "E-Commerce Recommendation System",
    difficulty: "Advanced",
    tools: ["Python", "Surprise", "Streamlit", "NumPy"],
    skills: ["Collaborative Filtering", "Matrix Factorization", "User Experience Design"],
    outcome: "Builds a recommendation engine sorting catalog items by matching user vectors.",
    githubReady: true,
    mockType: "recommend"
  },
  {
    name: "Real Estate Valuation Estimator",
    difficulty: "Beginner",
    tools: ["Python", "Pandas", "Matplotlib", "Scikit-Learn"],
    skills: ["Linear Regression", "Exploratory Analysis", "Feature Correlations"],
    outcome: "Estimates housing pricing parameters based on structural attributes.",
    githubReady: true,
    mockType: "regression"
  },
  {
    name: "Financial Fraud Detector",
    difficulty: "Advanced",
    tools: ["Python", "Random Forest", "SMOTE", "Jupyter"],
    skills: ["Imbalanced Data Handling", "Precision-Recall Curves", "Anomaly Detection"],
    outcome: "Identifies fraudulent transactions inside highly skewed credit card streams.",
    githubReady: true,
    mockType: "fraud"
  },
  {
    name: "Review Sentiment Classifier",
    difficulty: "Intermediate",
    tools: ["Python", "NLTK", "Logistic Regression", "Vercel"],
    skills: ["Natural Language Processing", "TF-IDF Vectorization", "Model Deployment"],
    outcome: "Scores review text sentiment categories and pushes indicators to a webhook.",
    githubReady: true,
    mockType: "sentiment"
  },
  {
    name: "AI Helpdesk Assistant Chatbot",
    difficulty: "Intermediate",
    tools: ["Python", "Flask", "Hugging Face", "Generative AI"],
    skills: ["Context Management", "API Integrations", "Frontend UI Design"],
    outcome: "Implements an online chatbot resolving academic FAQs via natural chat interactions.",
    githubReady: true,
    mockType: "chatbot"
  }
];

const FAQS = [
  { q: "Can beginners join?", a: "Yes, absolutely. No prior programming background is required. The curriculum starts with foundational Python syntax before moving into advanced machine learning algorithms and neural networks." },
  { q: "How are live sessions conducted?", a: "Live online sessions are held on weekends and weekday evenings to fit around college schedules. Recorded versions are logged to the LMS within 4 hours." },
  { q: "Will I build projects?", a: "Yes, you will construct 3+ resume-ready data products and log their deployment commits directly to your GitHub repository." },
  { q: "How much mentor support is available?", a: "You have direct access to our data science instructors during weekly live Q&A hours, group Slack channels, and code audit cycles." },
  { q: "How long do I get LMS access?", a: "You get full access to all video modules, class code templates, and notes for 1 entire year from your cohort start." },
  { q: "What certificate will I receive?", a: "You will receive a verified course completion certificate and a project portfolio completion badge from BeyondSkills." }
];

// Helper Animated Counter Component
function AnimatedCounter({ value, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const target = parseFloat(value.replace(/,/g, ''));
    if (isNaN(target)) {
      setCount(value);
      return;
    }
    const end = target;
    if (start === end) return;

    const isFloat = value.includes('.');
    const steps = 50;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = progress * (2 - progress);
      const nextCount = start + (end - start) * easedProgress;

      if (currentStep >= steps) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(isFloat ? Math.round(nextCount * 10) / 10 : Math.round(nextCount));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  const formatCount = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return val.toString();
    }
    return val;
  };

  return <span ref={ref}>{formatCount(count)}{suffix}</span>;
}

// Hero Interactive Visual IDE Component
function HeroIDEVisual() {
  const [epoch, setEpoch] = useState(1);
  const [loss, setLoss] = useState(0.85);
  const [accuracy, setAccuracy] = useState(0.62);

  useEffect(() => {
    const timer = setInterval(() => {
      setEpoch(prev => (prev >= 100 ? 1 : prev + 1));
      setLoss(prev => (prev <= 0.05 ? 0.85 : Math.max(0.04, prev - 0.008)));
      setAccuracy(prev => (prev >= 0.98 ? 0.62 : Math.min(0.98, prev + 0.004)));
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 font-mono text-[10px] text-slate-350 text-left overflow-hidden select-none relative">
      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
        <div className="flex space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
        </div>
        <span className="text-[9px] text-slate-500 uppercase tracking-widest">ai_model_training.py</span>
      </div>
      <div className="space-y-1.5 text-xs">
        <div><span className="text-purple-400">import</span> tensorflow <span className="text-purple-400">as</span> tf</div>
        <div><span className="text-purple-400">from</span> tensorflow.keras <span className="text-purple-400">import</span> layers</div>
        <div className="text-slate-500"># Compiling neural network architecture...</div>
        <div>model = tf.keras.Sequential([</div>
        <div className="pl-4">layers.Dense(<span className="text-amber-400">128</span>, activation=<span className="text-emerald-400">'relu'</span>),</div>
        <div className="pl-4">layers.Dropout(<span className="text-amber-400">0.2</span>),</div>
        <div className="pl-4">layers.Dense(<span className="text-amber-400">1</span>, activation=<span className="text-emerald-400">'sigmoid'</span>)</div>
        <div>])</div>
        <div className="text-slate-500 pt-1.5"># Epoch Loop Active</div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 mt-2 space-y-1">
          <div className="flex justify-between font-bold text-white text-[10px]">
            <span className="text-blue-400">Epoch {epoch}/100</span>
            <span className="text-emerald-400">Loss: {loss.toFixed(4)}</span>
            <span className="text-cyan-400">Acc: {(accuracy * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-[#0EA5E9] h-full" style={{ width: `${accuracy * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AiMlDataScienceLandingPage() {
  const navigate = useNavigate();

  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    college: '',
    year: '1st Year',
    role: 'Student', // Current Status
    upskilling: 'artificial-intelligence',
    batch: 'July Batch',
    skillLevel: 'Beginner - No Coding',
    careerGoal: 'Internship',
    laptopAccess: 'Yes',
    weeklyHours: '5-8 Hours',
    whyInterested: '',
    learningStart: 'Immediately'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedMod, setExpandedMod] = useState(0);
  const [faqOpen, setFaqOpen] = useState({});
  const [formStarted, setFormStarted] = useState(false);

  // Analytics event tracking helper
  const trackPixelEvent = (eventName, params = {}) => {
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('track', eventName, params);
      } catch (err) {
        console.error('Meta Pixel tracking error:', err);
      }
    }
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', eventName, params);
      } catch (err) {
        console.error('Google Analytics tracking error:', err);
      }
    }
  };

  useEffect(() => {
    document.title = "AI, Machine Learning & Data Science Cohort | BeyondSkills Admissions";
    
    // PageView & ViewContent
    trackPixelEvent('PageView');
    trackPixelEvent('ViewContent', { content_name: 'AI & Data Science Cohort Page' });

    // Scroll depth tracking
    const trackedDepths = new Set();
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
      
      [25, 50, 75, 100].forEach(depth => {
        if (scrollPercent >= depth && !trackedDepths.has(depth)) {
          trackedDepths.add(depth);
          trackPixelEvent('ScrollDepth', { depth_percent: depth });
        }
      });
    };
    window.addEventListener('scroll', handleScroll);

    // Lead Queue Sync on Mount
    syncFailedLeadsQueue();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync queued offline/failed leads
  const syncFailedLeadsQueue = async () => {
    const queue = getDbItem('beyondskills_leads_queue', []);
    if (queue.length === 0) return;

    console.log(`[Queue Sync] Found ${queue.length} unsynced leads. Retrying...`);
    const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? (window.location.port === '5173' ? 'http://localhost:5001' : 'http://localhost:5000')
      : window.location.origin;

    const remainingQueue = [];

    for (const item of queue) {
      let supabaseSuccess = !item.failedSupabase;
      let webhookSuccess = !item.failedWebhook;

      if (item.failedSupabase) {
        try {
          const res = await saveLeadToSupabase(item.lead);
          if (!res.error) supabaseSuccess = true;
        } catch (err) {
          console.error('[Sync] Supabase retry failed:', err);
        }
      }

      if (item.failedWebhook) {
        try {
          const res = await fetch(`${apiHost}/api/webhook/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.lead)
          });
          if (res.ok) webhookSuccess = true;
        } catch (err) {
          console.error('[Sync] Webhook retry failed:', err);
        }
      }

      if (!supabaseSuccess || !webhookSuccess) {
        remainingQueue.push({
          ...item,
          failedSupabase: !supabaseSuccess,
          failedWebhook: !webhookSuccess,
          attempts: item.attempts + 1
        });
      } else {
        console.log(`[Sync] Successfully synced lead: ${item.lead.name}`);
      }
    }

    setDbItem('beyondskills_leads_queue', remainingQueue);
  };

  const getDeviceDetails = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown Browser';
    if (ua.includes('Chrome') && !ua.includes('Chromium') && !ua.includes('Edg')) {
      browser = 'Chrome';
    } else if (ua.includes('Firefox')) {
      browser = 'Firefox';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browser = 'Safari';
    } else if (ua.includes('Edg')) {
      browser = 'Edge';
    }
    const isMobile = /Mobile|Android|iP(hone|od|ad)|IEMobile|BlackBerry/i.test(ua);
    return {
      device: isMobile ? 'Mobile' : 'Desktop',
      browser
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!formStarted) {
      setFormStarted(true);
      trackPixelEvent('FormStart', { form_name: 'AI ML Data Science Application' });
    }
    setEnquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Field validations
    if (!enquiryForm.name.trim() || !enquiryForm.phone.trim() || !enquiryForm.email.trim()) {
      setErrorMessage('Full Name, Phone Number, and Email Address are required fields.');
      setIsSubmitting(false);
      return;
    }

    trackPixelEvent('SubmitApplication', { form_name: 'AI ML Data Science Application' });

    // Parameters Extraction
    const searchParams = new URLSearchParams(window.location.search);
    const utmSource = searchParams.get('utm_source') || 'Direct';
    const utmMedium = searchParams.get('utm_medium') || 'None';
    const utmCampaign = searchParams.get('utm_campaign') || 'None';
    const utmContent = searchParams.get('utm_content') || 'None';
    const utmTerm = searchParams.get('utm_term') || 'None';

    const referrer = document.referrer || 'Direct';
    const pageUrl = window.location.href;
    const { device, browser } = getDeviceDetails();
    const submissionTime = new Date().toISOString();
    const leadId = `LD-AI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const detailedNotes = `
College: ${enquiryForm.college || 'N/A'}
Academic Year: ${enquiryForm.year}
Current Status: ${enquiryForm.role}
Skill Level: ${enquiryForm.skillLevel}
Career Goal: ${enquiryForm.careerGoal}
Laptop Availability: ${enquiryForm.laptopAccess}
Weekly Learning Hours: ${enquiryForm.weeklyHours}
Start Timeline: ${enquiryForm.learningStart}
Why interested: ${enquiryForm.whyInterested || 'N/A'}
Referrer: ${referrer}
Device: ${device}
Browser: ${browser}
Page URL: ${pageUrl}
Submission Time: ${submissionTime}
    `.trim();

    const newLead = {
      id: leadId,
      leadId: leadId,
      type: 'Ads Leads',
      program: enquiryForm.upskilling,
      course_id: enquiryForm.upskilling,
      course_title: 'Artificial Intelligence, Machine Learning & Data Science',
      name: enquiryForm.name.trim(),
      email: enquiryForm.email.trim(),
      phone: enquiryForm.phone.trim(),
      college: enquiryForm.college.trim() || 'Unspecified',
      student_details: `College: ${enquiryForm.college || 'N/A'} | Year: ${enquiryForm.year} | Status: ${enquiryForm.role} | Skill: ${enquiryForm.skillLevel} | Laptop: ${enquiryForm.laptopAccess} | Hours: ${enquiryForm.weeklyHours}`,
      qualification: enquiryForm.college.trim() || 'Unspecified',
      profession: enquiryForm.role,
      experience: enquiryForm.skillLevel,
      contactTime: 'Any Time',
      careerGoal: enquiryForm.careerGoal,
      goal: enquiryForm.careerGoal,
      status: 'New',
      subStatus: 'QUALIFIED',
      message: detailedNotes,
      notes: detailedNotes,
      campaign: utmCampaign,
      source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
      utmMedium: utmMedium,
      utmCampaign: utmCampaign,
      utmContent: utmContent,
      utmTerm: utmTerm,
      referrer: referrer,
      deviceType: device,
      browser: browser,
      submissionTime: submissionTime,
      pageUrl: pageUrl,
      timestamp: Date.now(),
      remarks: 'Submitted via Standalone AI/ML/Data Science Landing Page'
    };

    // Save locally
    const localLeads = getDbItem('beyondskills_leads', []);
    localLeads.push(newLead);
    setDbItem('beyondskills_leads', localLeads);

    let savedSupabase = false;
    let savedWebhook = false;

    // Save to Supabase
    try {
      const res = await saveLeadToSupabase(newLead);
      if (!res.error) savedSupabase = true;
    } catch (sbErr) {
      console.error('Error saving lead to Supabase:', sbErr);
    }

    // Post to backend webhook
    try {
      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? (window.location.port === '5173' ? 'http://localhost:5001' : 'http://localhost:5000')
        : window.location.origin;

      const res = await fetch(`${apiHost}/api/webhook/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
      if (res.ok) {
        savedWebhook = true;
      }
    } catch (err) {
      console.error('Error posting lead to webhook:', err);
    }

    // Fallback to queue if not completely saved
    if (!savedSupabase || !savedWebhook) {
      const queue = getDbItem('beyondskills_leads_queue', []);
      queue.push({
        lead: newLead,
        failedSupabase: !savedSupabase,
        failedWebhook: !savedWebhook,
        attempts: 1
      });
      setDbItem('beyondskills_leads_queue', queue);
    }

    // Analytics success tracking
    trackPixelEvent('Lead', { value: 1.0, currency: 'USD', lead_id: leadId });

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Program Application Received`,
        body: `Dear ${enquiryForm.name},\n\nYour application has been logged for evaluation. Our admissions counselling team will verify details and reach out to you within 24 hours.\n\nLead ID: ${leadId}`
      }
    }));

    setIsSubmitting(false);
    window.location.href = '/thank-you';
  };

  const scrollToHeroForm = (buttonName) => {
    trackPixelEvent('CtaClick', { button_name: buttonName });
    const el = document.getElementById('aiml-name');
    if (el) {
      el.focus({ preventScroll: false });
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToSyllabus = (buttonName) => {
    trackPixelEvent('CtaClick', { button_name: buttonName });
    const el = document.getElementById('cohort-syllabus-path');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (idx) => {
    setFaqOpen(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const renderProjectMock = (type) => {
    switch (type) {
      case "churn":
        return <div className="w-full h-28 bg-[#0B0F19] border border-slate-900 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 font-mono text-[9px] text-slate-300 text-left select-none">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1 mb-1">
            <span className="text-[7px] text-[#2563EB]">model_fit.py</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <div className="flex-1 space-y-1">
            <div><span className="text-purple-400">import</span> sklearn.ensemble</div>
            <div className="text-slate-550"># Random Forest Classifier fit</div>
            <div className="text-emerald-400">clf = RandomForestClassifier()</div>
            <div className="text-[#F97316]">clf.fit(X_train, y_train)</div>
          </div>
          <div className="text-[7px] text-slate-550 border-t border-slate-900 pt-1 flex justify-between">
            <span>Accuracy: 92.4%</span>
            <span className="text-[#2563EB]">Active</span>
          </div>
        </div>;
      case "recommend":
        return <div className="w-full h-28 bg-[#0B0F19] border border-slate-900 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 font-mono text-[9px] text-slate-300 text-left select-none">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1 mb-1">
            <span className="text-[7px] text-[#2563EB]">recommend_engine.py</span>
            <span className="text-slate-500">surprise_fit</span>
          </div>
          <div className="flex-1 space-y-0.5 pt-1 text-[8px]">
            <div className="text-slate-500">User Vector: U_1042</div>
            <div className="text-emerald-400">Rec 1: AI Masterclass (Match: 98%)</div>
            <div className="text-emerald-400">Rec 2: ML Pipeline Script (Match: 91%)</div>
          </div>
          <div className="text-[7px] text-slate-550 border-t border-slate-900 pt-1">
            <span>Collaborative Filtering Active</span>
          </div>
        </div>;
      case "regression":
        return <div className="w-full h-28 bg-[#0B0F19] border border-slate-900 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 font-mono text-[9px] text-slate-300 text-left select-none">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1 mb-1">
            <span className="text-[7px] text-[#2563EB]">house_regression.py</span>
            <span className="text-slate-500">metrics</span>
          </div>
          <div className="flex-grow flex flex-col justify-center space-y-1">
            <div className="text-[#F97316]">R2 Score: 0.892</div>
            <div className="text-slate-400">Mean Absolute Error: $12.4k</div>
          </div>
          <div className="text-[7px] text-slate-550 border-t border-slate-900 pt-1 flex justify-between">
            <span>Epoch: 50 / 50</span>
            <span className="text-green-500">Stable</span>
          </div>
        </div>;
      default:
        return <div className="w-full h-28 bg-[#0B0F19] border border-slate-900 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 font-mono text-[9px] text-slate-300 text-left select-none">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1">
            <span className="text-[#2563EB]">data_pipeline.py</span>
            <span className="text-[7px] text-slate-500">Pandas Engine</span>
          </div>
          <div className="flex-grow flex flex-col justify-center space-y-1">
            <div className="text-emerald-400">df = pd.read_csv("dataset.csv")</div>
            <div className="text-slate-450">df.dropna(inplace=True)</div>
          </div>
          <div className="text-[7px] text-slate-550 border-t border-slate-900 pt-1">
            <span>Records Cleaned: 15,204</span>
          </div>
        </div>;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <div className="text-slate-900 min-h-screen relative bg-white font-sans overflow-x-hidden">
      
      {/* Custom grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>

      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 px-4 py-3 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1 group">
            <span className="logo-font font-extrabold tracking-tight text-slate-955 text-xl">Beyond</span>
            <span className="logo-font font-extrabold tracking-tight text-blue-600 text-xl">Skills</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => scrollToHeroForm('Header CTA')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow"
            >
              Apply Now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 border-b border-slate-100 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full text-blue-600 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Next Cohort Batch Opening</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-950">
              Launch Your Career in <span className="bg-gradient-to-r from-blue-600 to-[#0EA5E9] bg-clip-text text-transparent">AI & Data Science</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-650 leading-relaxed max-w-xl">
              Master Artificial Intelligence, Machine Learning and Data Science through live mentor-led training, hands-on projects, industry guidance and practical learning. Even if you're starting from scratch.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button 
                onClick={() => scrollToHeroForm('Hero Core CTA')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all text-center cursor-pointer"
              >
                Apply Now
              </button>
              <button 
                onClick={() => scrollToSyllabus('Hero Syllabus Scroll')}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all text-center flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:shadow"
              >
                <Compass className="w-4 h-4 text-blue-400" />
                <span>View Syllabus</span>
              </button>
            </div>

            {/* Core Pillars Checklist */}
            <div className="pt-6 border-t border-slate-100">
              <p className="text-[9px] text-slate-405 uppercase tracking-widest font-mono font-bold mb-3">CORE PROGRAM BENEFITS:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-semibold">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Live Industry Mentor Training</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Resume-Ready Capstone Projects</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Verified Course Certificates</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Student Networking Opportunities</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Internship Completion Projects</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Admissions Application Form */}
          <div className="lg:col-span-6 relative">
            <div className="bg-slate-950 text-slate-105 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[30px] pointer-events-none"></div>
              
              <div className="mb-4">
                <h3 className="text-white font-extrabold text-lg sm:text-xl">Apply for the Next AI & Data Science Cohort</h3>
                <p className="text-[11px] text-slate-400 mt-1">Complete your application and our admissions team will contact you for eligibility guidance.</p>
              </div>

              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-xl text-[11px] mb-4">
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="aiml-name" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name *</label>
                    <input 
                      id="aiml-name"
                      type="text" 
                      name="name"
                      required 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                      placeholder="e.g. Rahul Sharma"
                      value={enquiryForm.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="aiml-phone" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number *</label>
                    <input 
                      id="aiml-phone"
                      type="tel" 
                      name="phone"
                      required 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                      placeholder="e.g. 9876543210"
                      value={enquiryForm.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="aiml-email" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address *</label>
                    <input 
                      id="aiml-email"
                      type="email" 
                      name="email"
                      required 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                      placeholder="e.g. rahul@example.com"
                      value={enquiryForm.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="aiml-college" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">College / Institute *</label>
                    <input 
                      id="aiml-college"
                      type="text" 
                      name="college"
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                      placeholder="College or University"
                      value={enquiryForm.college}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="aiml-role" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</label>
                    <select 
                      id="aiml-role"
                      name="role"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white outline-none cursor-pointer"
                      value={enquiryForm.role}
                      onChange={handleChange}
                    >
                      <option value="Student">Student</option>
                      <option value="Working Professional">Working Professional</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="aiml-year" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Year</label>
                    <select 
                      id="aiml-year"
                      name="year"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white outline-none cursor-pointer"
                      value={enquiryForm.year}
                      onChange={handleChange}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduated">Graduated</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="aiml-upskilling" className="block text-[9px] font-bold text-slate-400 tracking-wider mb-1">Preferred Program</label>
                    <select 
                      id="aiml-upskilling"
                      name="upskilling"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white outline-none cursor-pointer"
                      value={enquiryForm.upskilling}
                      onChange={handleChange}
                    >
                      <option value="artificial-intelligence">AI & ML Program</option>
                      <option value="data-science">Data Science Program</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="aiml-batch" className="block text-[9px] font-bold text-slate-400 tracking-wider mb-1">Preferred Batch</label>
                    <select 
                      id="aiml-batch"
                      name="batch"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white outline-none cursor-pointer"
                      value={enquiryForm.batch}
                      onChange={handleChange}
                    >
                      <option value="July Batch">July Batch</option>
                      <option value="August Batch">August Batch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="aiml-skillLevel" className="block text-[9px] font-bold text-slate-400 tracking-wider mb-1">Current Skill</label>
                    <select 
                      id="aiml-skillLevel"
                      name="skillLevel"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white outline-none cursor-pointer"
                      value={enquiryForm.skillLevel}
                      onChange={handleChange}
                    >
                      <option value="Beginner - No Coding">Beginner - No Coding</option>
                      <option value="Basic Knowledge">Basic Knowledge</option>
                      <option value="Intermediate">Intermediate</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="aiml-careerGoal" className="block text-[9px] font-bold text-slate-400 tracking-wider mb-1">Career Goal</label>
                    <select 
                      id="aiml-careerGoal"
                      name="careerGoal"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white outline-none cursor-pointer"
                      value={enquiryForm.careerGoal}
                      onChange={handleChange}
                    >
                      <option value="Internship">Internship</option>
                      <option value="Higher Studies">Higher Studies</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Skill Development">Skill Development</option>
                      <option value="Career Switch">Career Switch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="aiml-laptopAccess" className="block text-[9px] font-bold text-slate-400 tracking-wider mb-1">Laptop Availability</label>
                    <select 
                      id="aiml-laptopAccess"
                      name="laptopAccess"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white outline-none cursor-pointer"
                      value={enquiryForm.laptopAccess}
                      onChange={handleChange}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Planning to Purchase">Planning to Purchase</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="aiml-weeklyHours" className="block text-[9px] font-bold text-slate-400 tracking-wider mb-1">Weekly Study Hours</label>
                    <select 
                      id="aiml-weeklyHours"
                      name="weeklyHours"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white outline-none cursor-pointer"
                      value={enquiryForm.weeklyHours}
                      onChange={handleChange}
                    >
                      <option value="Less than 3 Hours">Less than 3 Hours</option>
                      <option value="3–5 Hours">3–5 Hours</option>
                      <option value="5–8 Hours">5–8 Hours</option>
                      <option value="More than 8 Hours">More than 8 Hours</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="aiml-learningStart" className="block text-[9px] font-bold text-slate-400 tracking-wider mb-1">Start Timeline</label>
                    <select 
                      id="aiml-learningStart"
                      name="learningStart"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white outline-none cursor-pointer"
                      value={enquiryForm.learningStart}
                      onChange={handleChange}
                    >
                      <option value="Immediately">Immediately</option>
                      <option value="Within 30 Days">Within 30 Days</option>
                      <option value="Within 3 Months">Within 3 Months</option>
                      <option value="Just Exploring">Just Exploring</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="aiml-whyInterested" className="block text-[9px] font-bold text-slate-400 tracking-wider mb-1">Why do you want to join? *</label>
                  <textarea 
                    id="aiml-whyInterested"
                    name="whyInterested"
                    required
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Tell us about your career goals and what you hope to achieve after completing this program."
                    value={enquiryForm.whyInterested}
                    onChange={handleChange}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-[#0EA5E9] hover:opacity-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-12 bg-slate-900 border-y border-slate-800 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              <AnimatedCounter value="10000" suffix="+" />
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">Learners Enrolled</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              <AnimatedCounter value="100" suffix="+" />
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">Academic Collaborations</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center">
              <AnimatedCounter value="4.8" />
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 ml-1 inline-block" />
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">Learner Rating</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Experienced
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">Industry Mentors</p>
          </div>
        </div>
      </section>

      {/* Interactive Workspace & Cohort Specs Section (CRO section under trust signals) */}
      <section className="py-16 bg-slate-50 border-b border-slate-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Interactive IDE Workspace */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Interactive Workspace</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950">Learn by Running Code</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Build predictive classifiers, tune parameters, and analyze models inside our structured developer environments.
              </p>
            </div>
            <HeroIDEVisual />
          </div>

          {/* Program Information Specifications Grid */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Cohort Specs</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-955">Cohort Parameters</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Explore the structured learning parameters mapped out for the upcoming batch.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Program Duration</p>
                <p className="text-base font-extrabold text-slate-950 mt-1">3 Months</p>
              </div>
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Learning Mode</p>
                <p className="text-base font-extrabold text-slate-950 mt-1">Live + Recorded</p>
              </div>
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Industry Projects</p>
                <p className="text-base font-extrabold text-slate-955 mt-1">3+ Resume Ready</p>
              </div>
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Mentor Support</p>
                <p className="text-base font-extrabold text-slate-955 mt-1">Direct Access</p>
              </div>
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Certificate Status</p>
                <p className="text-base font-extrabold text-slate-955 mt-1">Attach to Resume/CV</p>
              </div>
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Internship Project</p>
                <p className="text-base font-extrabold text-slate-955 mt-1">Certificate Included</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Program Highlights Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100 text-left">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Academic Excellence</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">AI & Data Science Program Highlights</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">We provide the technical ecosystem and mentor infrastructure required to master algorithm architectures.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Users className="w-5 h-5" />, title: "Live Mentor Sessions", desc: "Interact directly with data engineers and resolve questions in real-time." },
            { icon: <Code className="w-5 h-5" />, title: "Hands-on Projects", desc: "Construct predictive applications matching resume specifications." },
            { icon: <BookOpen className="w-5 h-5" />, title: "Industry Curriculum", desc: "Acquire skills matching active requirements requested by modern corporate tech teams." },
            { icon: <Monitor className="w-5 h-5" />, title: "Portfolio Development", desc: "Compile codebase, organize git logs, and deploy model endpoints to host systems." },
            { icon: <Compass className="w-5 h-5" />, title: "Networking Opportunities", desc: "Connect with peer students, share code logic, and collaborate on data pipelines." },
            { icon: <Award className="w-5 h-5" />, title: "Verified Certification", desc: "Earn professional credentials recognized by recruiters to attach to your Resume/CV." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex items-start space-x-4">
              <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl border border-blue-100/50 shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-slate-955 font-bold text-sm sm:text-base">{item.title}</h4>
                <p className="text-xs text-slate-550 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Career Benefits Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100 text-left">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Student Outcomes</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">How You Benefit From This Program</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">We focus on teaching practical capabilities that make you ready to tackle actual work environments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Build Practical AI Projects", desc: "Create working classifiers, recommendation filters, and fraud detectors from raw dataset files." },
            { title: "Strengthen Your Portfolio", desc: "Compile all your code commits to your public GitHub profile to prove your technical abilities to teams." },
            { title: "Learn Industry Tools", desc: "Master tools like Python, SQL databases, Scikit-Learn, TensorFlow, Git, and model endpoints." },
            { title: "Gain Mentor Feedback", desc: "Get structural feedback, code optimizations, and design advice directly from data practitioners." },
            { title: "Networking & Collaboration", desc: "Engage with like-minded developers, build teams, and review peer program logic." },
            { title: "Build Real Confidence", desc: "Develop the ability to solve blockers independently, debug script errors, and optimize models." }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-slate-50/50 border border-slate-200/60 p-6 rounded-2xl hover:bg-slate-50 transition-colors">
              <h3 className="text-slate-955 font-bold text-sm sm:text-base mb-2 flex items-center">
                <Check className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                {benefit.title}
              </h3>
              <p className="text-xs text-slate-555 leading-relaxed pl-6">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="cohort-syllabus-path" className="py-16 bg-slate-950 text-white border-b border-slate-900 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest font-mono">Curriculum Syllabus</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Cohort Syllabus Path</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">A comprehensive path divided into logical modules. Click below to expand topics.</p>
          </div>

          <div className="space-y-4">
            {CURRICULUM_GROUPS.map((group, idx) => {
              const isExpanded = expandedMod === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg"
                >
                  <button
                    onClick={() => setExpandedMod(isExpanded ? -1 : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-white hover:bg-slate-800/50 transition-all"
                  >
                    <div className="space-y-1">
                      <p className="text-[10px] text-blue-400 uppercase tracking-widest font-mono font-extrabold">Module 0{idx + 1}</p>
                      <h4 className="text-white text-base font-black">{group.title}</h4>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-5 border-t border-slate-850 bg-slate-950/60 space-y-4 animate-fade-in">
                      <p className="text-xs text-slate-400 leading-relaxed italic">{group.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                        {group.topics.map((t, i) => (
                          <div key={i} className="flex items-center space-x-2 text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-[#f8fafc] border-b border-slate-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Portfolio Building</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Build Deployed Portfolio Projects</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">Create working code for these 6 resume-ready sample projects to host on your public git repository.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((proj, idx) => (
              <div 
                key={idx} 
                className="bg-slate-950 border border-slate-855 rounded-2xl p-5 flex flex-col justify-between space-y-5 text-white shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="space-y-4">
                  {/* Embedded IDE Mockup */}
                  {renderProjectMock(proj.mockType)}
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-white">{proj.name}</h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono border ${
                        proj.difficulty === 'Beginner' ? 'text-green-400 bg-green-950/40 border-green-900/50' :
                        proj.difficulty === 'Intermediate' ? 'text-blue-400 bg-blue-950/40 border-blue-900/50' :
                        'text-orange-400 bg-orange-950/40 border-orange-900/50'
                      }`}>
                        {proj.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{proj.outcome}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-900 pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tools.map((t, i) => (
                      <span key={i} className="text-blue-400 bg-blue-955/60 border border-blue-900/60 font-bold px-2 py-0.5 rounded text-[9px] uppercase font-mono">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="text-[10px] text-slate-550 font-mono uppercase tracking-wider">Key Skills:</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {proj.skills.map((s, i) => (
                        <span key={i} className="text-slate-300 inline-flex items-center">
                          <span className="w-1 h-1 rounded-full bg-blue-500 mr-1.5"></span>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {proj.githubReady && (
                    <div className="flex items-center space-x-1.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-2 py-1 rounded inline-flex self-start">
                      <Check className="w-3 h-3" />
                      <span>GITHUB PORTFOLIO READY</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Apply Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100 text-left">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Cohort Demographics</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Who Should Apply?</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">Prerequisites are minimal. No prior programming background is required to start.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "College Students", desc: "Undergraduate students (1st-4th Year) wanting to acquire industry coding skills and build resume capstones." },
            { title: "Fresh Graduates", desc: "Graduates interested in structuring developer portfolios and starting a career in AI and Data Science." },
            { title: "Beginners", desc: "Absolute beginners seeking logic foundations, Python coding structures, and guided milestone checkpoints." },
            { title: "Career Switchers", desc: "Professionals looking to transition into data analytics, predictive modeling, or automation engineering." }
          ].map((profile, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-slate-955 font-extrabold text-sm sm:text-base mb-2">{profile.title}</h3>
              <p className="text-xs text-slate-550 leading-relaxed">{profile.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* After Form Section: Admissions Counselling Timeline */}
      <section className="py-16 bg-[#0B0F19] text-white border-b border-slate-955 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">Application Process</h3>
            <p className="text-xs text-slate-400">Our admissions counselling cycle checks commitment and maps curriculum routes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-600/30 via-[#0EA5E9]/30 to-emerald-500/20 z-0"></div>

            <div className="relative z-10 flex flex-col items-center space-y-3 p-5 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-md">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="text-xs font-bold text-white">Submit Application</h4>
              <p className="text-[10px] text-slate-450 leading-relaxed">Complete your student credentials and goals questionnaire.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center space-y-3 p-5 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-md">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="text-xs font-bold text-white">Admissions Counselling</h4>
              <p className="text-[10px] text-slate-455 leading-relaxed">Connect with academic advisor to verify batch readiness.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center space-y-3 p-5 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-md">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="text-xs font-bold text-white">Program Recommendation</h4>
              <p className="text-[10px] text-slate-460 leading-relaxed">Unlock cohort curriculum alignment matching roadmap.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center space-y-3 p-5 bg-slate-900 border border-emerald-500/30 rounded-2xl text-center shadow-md">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h4 className="text-xs font-bold text-emerald-300">Enrollment</h4>
              <p className="text-[10px] text-slate-465 leading-relaxed">Secure cohort seat allocation to begin learning journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100 text-left">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Feedback Logs</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-955">Student Success Reviews</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">Hear how cohort candidates acquired confidence, formatted developer portfolios, and learned script logic.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Ankita Patel",
              role: "B.Tech CSE Student (3rd Year)",
              org: "VIT Vellore",
              feedback: "The practical coding approach helped me immensely. I was able to build regression predictors and clean dataset parameters for my college capstone under mentor guidance. My confidence in coding has improved greatly.",
              color: "bg-blue-600/10 text-blue-600"
            },
            {
              name: "Rahul Sen",
              role: "BCA Student (3rd Year)",
              org: "Delhi University",
              feedback: "Building recommendation algorithms and compiling commits to my public GitHub was the best part of this cohort. I formatted a developer portfolio that really stood out during college project evaluations.",
              color: "bg-emerald-500/10 text-emerald-500"
            },
            {
              name: "Vikram Malhotra",
              role: "Graduate Scholar",
              org: "VIT Alumni Network",
              feedback: "Understanding neural network loss functions, compiling Pandas pipelines, and deploying model endpoints to Vercel was exactly the upskilling I needed. Highly recommend for any beginner switcher.",
              color: "bg-orange-500/10 text-orange-500"
            }
          ].map((story, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${story.color} font-black flex items-center justify-center font-mono text-sm`}>
                  {story.name[0]}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">{story.name}</p>
                  <p className="text-[10px] text-slate-450 font-mono">{story.role} at {story.org}</p>
                </div>
              </div>
              <p className="text-xs text-slate-655 italic leading-relaxed">"{story.feedback}"</p>
            </div>
          ))}
        </div>

        {/* Scrolling Partner Logos */}
        <div className="mt-16 text-center border-t border-slate-100 pt-8 space-y-4 overflow-hidden">
          <p className="text-[10px] text-slate-450 uppercase tracking-widest font-mono font-bold">Learners from Top Institutions & Brands:</p>
          <div className="flex justify-center items-center flex-wrap gap-8 opacity-60">
            <img src={microsoftLogo} alt="Microsoft Logo" className="h-6" />
            <img src={adobeLogo} alt="Adobe Logo" className="h-6" />
            <img src={ibmLogo} alt="IBM Logo" className="h-6" />
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100 text-left">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Academic Queries</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-500">Get direct answers to common queries regarding the upskilling program.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = faqOpen[idx];
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4.5 text-left font-bold text-xs sm:text-sm text-slate-950 hover:bg-slate-55 transition-colors outline-none"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>

                {isOpen && (
                  <div className="p-4.5 border-t border-slate-100 text-xs text-slate-500 leading-relaxed bg-slate-50/50 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <span className="inline-flex items-center space-x-1.5 bg-blue-500/20 text-blue-400 px-3.5 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Today</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight text-white">Ready to Start Your AI Journey?</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Construct statistical scripts, train decision classifiers, and deploy neural network APIs under direct guidance from industry mentors.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4 max-w-xs sm:max-w-none mx-auto">
            <button
              onClick={() => scrollToHeroForm('Final CTA Core')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer"
            >
              Apply Now
            </button>
            <button
              onClick={() => scrollToSyllabus('Final CTA Syllabus')}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              View Syllabus
            </button>
          </div>

          <p className="text-[9px] text-slate-400 max-w-sm mx-auto pt-4 leading-relaxed">
            Our academic admissions counselling team will contact you to explain cohort timings and evaluate eligibility.
          </p>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919953607074?text=Hi!+I+am+interested+in+BeyondSkills+AI+ML+and+Data+Science+Cohort."
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 border border-emerald-400/20"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Sticky Mobile CTA Footer */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/90 backdrop-blur border-t border-slate-200 p-3 sm:hidden flex items-center justify-center">
        <button
          onClick={() => scrollToHeroForm('Mobile Sticky CTA')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow text-center cursor-pointer"
        >
          Apply Now
        </button>
      </div>

    </div>
  );
}
