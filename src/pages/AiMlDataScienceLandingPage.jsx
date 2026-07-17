import React, { useState, useEffect } from 'react';
import { 
  Brain, Cpu, Database, TrendingUp, BarChart2, CheckCircle2, ArrowRight, Check, 
  ChevronRight, Calendar, ShieldAlert, Sparkles, Phone, Mail, Globe, 
  Star, Briefcase, Zap, Compass, HelpCircle, ChevronDown, ChevronUp, Download,
  MessageCircle, FileText, BookOpen, Users, Award, Clock, Laptop, User, GraduationCap
} from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/mockDb';
import confetti from 'canvas-confetti';
import microsoftLogo from '../assets/microsoft.svg';
import adobeLogo from '../assets/adobe.svg';
import ibmLogo from '../assets/ibm.svg';


const CURRICULUM = [
  { phase: "Module 1: Programming Fundamentals & Databases", topics: ["Python Syntax & Scopes", "Object-Oriented Programming (OOP)", "SQL Database Queries & Filters", "Data Normalization Rules"] },
  { phase: "Module 2: Exploratory Data Analysis (EDA)", topics: ["Pandas DataFrames Manipulation", "NumPy Matrix Operations", "Handling Missing Data Fields", "Outlier Identification Workflows"] },
  { phase: "Module 3: Data Visualization & Analytics", topics: ["Matplotlib Plot Customization", "Seaborn Statistical Graphics", "Visualizing Feature Correlations", "Building Analytical Widgets"] },
  { phase: "Module 4: Applied Statistics & Probability", topics: ["Probability Distributions", "Hypothesis testing & p-values", "Linear & Logistic Regressions", "Feature Engineering Methods"] },
  { phase: "Module 5: Machine Learning Models", topics: ["Decision Trees & Random Forests", "K-Means Clustering Algorithms", "Support Vector Machines (SVM)", "Model Evaluation (ROC, AUC, F1)"] },
  { phase: "Module 6: Deep Learning Foundations", topics: ["Neural Network Architectures", "Activation & Loss Functions", "TensorFlow Tensor Math", "Image & Text Classification Mocks"] },
  { phase: "Module 7: Model APIs & Deployments", topics: ["Flask API Server Development", "Predictive Endpoint Verification", "Docker Container Containers", "Cloud Model Hosting Workflows"] },
  { phase: "Module 8: Capstone & Career Preparation", topics: ["Relational Dataset Case Study", "GitHub Profile Structuring", "Resume Optimization guides", "Live Mock Technical Interviews"] }
];

const SAMPLE_PROJECTS = [
  { 
    title: "Customer Churn Predictor", 
    desc: "Develop a classification algorithm to predict customer churn rates using historical subscription metrics.", 
    tech: ["Python", "Pandas", "Scikit-Learn", "Flask"],
    learn: "Data preparation, feature scaling, model scoring, and endpoint deployment.",
    skills: "Classification Modeling, Feature Selection, Rest API Setup",
    outcome: "A live prediction API that flags high-risk candidate clients in real-time.",
    mockType: "churn"
  },
  { 
    title: "E-Commerce Recommendation System", 
    desc: "Construct a recommendation engine utilizing collaborative filtering algorithms to pitch relevant shop items.", 
    tech: ["Python", "NumPy", "Surprise", "Streamlit"],
    learn: "Matrix factorization, user-item scoring, and visual dashboards.",
    skills: "Collaborative Filtering, User Experience Matrix, Dashboard Rendering",
    outcome: "An interactive store recommendations card widget updating live recommendations.",
    mockType: "recommend"
  },
  { 
    title: "Real Estate Valuation Predictor", 
    desc: "Construct a multivariate regression model forecasting house prices based on regional property parameters.", 
    tech: ["Python", "Pandas", "Scikit-Learn", "Matplotlib"],
    learn: "Feature correlations, handling collinearities, and evaluating RMSE metrics.",
    skills: "Regression Analysis, Exploratory Analysis, Graph Customization",
    outcome: "A deployed regression dashboard estimating real estate valuations with live input sliders.",
    mockType: "regression"
  },
  { 
    title: "Financial Fraud Detector", 
    desc: "Develop an anomaly detection pipeline flagging fraudulent transactions inside unbalanced transaction streams.", 
    tech: ["Python", "Pandas", "Random Forest", "Jupyter"],
    learn: "Handling imbalanced datasets (SMOTE), precision-recall curves, and validation scoring.",
    skills: "Unbalanced Data Handling, Fraud Pattern Analysis, Model Auditing",
    outcome: "A pipeline script classifying payment risks and archiving alerts to logs database.",
    mockType: "fraud"
  },
  { 
    title: "Sentiment Analysis Classifier", 
    desc: "Build a natural language processing model evaluating candidate reviews to categorize sentiment levels.", 
    tech: ["Python", "NLTK", "Scikit-Learn", "Vercel"],
    learn: "Text tokenization, vectorization (TF-IDF), and logistic regression modeling.",
    skills: "Natural Language Processing, Text Vectorization, API Deployment",
    outcome: "An online review sentiment auditor scoring reviews from highly positive to warning states.",
    mockType: "sentiment"
  },
  { 
    title: "AI Chatbot Assistant Profile", 
    desc: "Create an interactive chatbot widget utilizing NLP libraries to handle initial academic FAQs.", 
    tech: ["Python", "Flask", "NLP libraries", "GitHub Pages"],
    learn: "Context matching, session memory, API binding, and responsive chatting layouts.",
    skills: "Context Management, Webhooks Sync, Frontend Form Integration",
    outcome: "An embedded client widget answering course details and cohort enrollment guidelines.",
    mockType: "chatbot"
  }
];

const FAQS = [
  { q: "Who is this program for?", a: "This program is designed for college students, fresh graduates, beginners, and working professionals looking to break into Artificial Intelligence, Machine Learning, Data Science, or Data Analytics. No prior coding experience is required." },
  { q: "Can absolute beginners join without a programming background?", a: "Yes, absolutely. The curriculum is constructed beginner-friendly, starting with the absolute fundamentals of Python syntax before advancing to ML math, algorithms, and deep learning." },
  { q: "How are classes conducted?", a: "Sessions are conducted live online, typically in the evening to accommodate working professionals and college schedules. You will have access to lecture recordings, class notebooks, code scripts, and assignments on our LMS." },
  { q: "Will I build projects during the program?", a: "Yes. You will build and deploy several practical data projects, including predictive classifiers, recommendation engines, and data analytics dashboards that you can show to recruiters." },
  { q: "What tools and libraries will I learn?", a: "You will master Python, SQL databases, Pandas, NumPy, Matplotlib, Seaborn, Scikit-Learn, TensorFlow, Flask, Git, GitHub, and cloud hosting clients." },
  { q: "Will I receive mentor support during the cohort?", a: "Yes. Active data practitioners and engineers lead live doubt-solving sessions, provide feedback on assignments, and audit your project code scripts." },
  { q: "Will I receive a certificate of completion?", a: "Yes. On successfully completing the milestone assessments and capstone projects, you will be issued a digital certificate of completion from BeyondSkills." },
  { q: "How long is the program?", a: "The program spans 3 months with structured weekly modules to ensure you have enough time to practice coding, build models, and compile your portfolio." },
  { q: "How do I enroll in the cohort?", a: "Simply fill out the enquiry form on this landing page. Our academic admissions advisor will contact you to explain the cohort schedule, fee options, and guide you through registration." },
  { q: "How does the admission process work?", a: "Once your enquiry is logged, we host a brief evaluation call to check batch alignment, verify prerequisites, and process your cohort onboarding details." }
];

export default function AiMlDataScienceLandingPage() {
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: 'Undergraduate',
    experience: 'Beginner - No Coding',
    goal: 'Land a Tech Job',
    contactTime: ''
  });
  const [status, setStatus] = useState(null);
  const [faqOpen, setFaqOpen] = useState({});

  useEffect(() => {
    document.title = "AI, Machine Learning & Data Science Cohort | BeyondSkills Upskilling";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Master AI, Machine Learning, Data Science, and Analytics. Attend live mentor-led classes, build predictive algorithm projects, and compile developer portfolios with BeyondSkills.";

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Artificial Intelligence, Machine Learning & Data Science Program",
      "description": "Learn Python, SQL, predictive models, statistics, neural networks, and Flask APIs with live mentorship.",
      "provider": {
        "@type": "Organization",
        "name": "BeyondSkills",
        "sameAs": window.location.origin
      },
      "educationalCredentialAwarded": "Certification in AI, Machine Learning & Data Science"
    };

    const scriptId = "landing-ai-schema-jsonld";
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schemaData);

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, []);

  const handleApplySubmit = (e) => {
    e.preventDefault();

    const searchParams = new URLSearchParams(window.location.search);
    const utmSource = searchParams.get('utm_source') || 'Direct / CPC';
    const utmMedium = searchParams.get('utm_medium') || 'Search Ads';
    const utmCampaign = searchParams.get('utm_campaign') || 'AI ML Data Science';
    const utmContent = searchParams.get('utm_content') || 'Ad Variant 1';

    const leads = getDbItem('beyondskills_leads', []);
    const newLead = {
      id: `LD${String(leads.length + 101).padStart(3, '0')}`,
      type: 'Ads Leads',
      program: 'artificial-intelligence',
      name: enquiryForm.name,
      email: enquiryForm.email,
      phone: enquiryForm.phone,
      college: enquiryForm.qualification, 
      qualification: enquiryForm.qualification,
      profession: enquiryForm.experience,
      preferredContactTime: enquiryForm.contactTime || 'Not Specified',
      careerGoal: enquiryForm.goal,
      status: 'New',
      subStatus: 'QUALIFIED',
      message: `Goal: ${enquiryForm.goal} • Contact: ${enquiryForm.contactTime || 'Not Specified'}`,
      campaign: utmCampaign,
      source: utmSource,
      utmMedium: utmMedium,
      utmCampaign: utmCampaign,
      utmContent: utmContent,
      leadStatus: 'New Lead',
      remarks: 'Submitted via Standalone AI/ML/Data Science Landing Page',
      date: new Date().toISOString()
    };
    leads.push(newLead);
    setDbItem('beyondskills_leads', leads);

    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Cohort Application Registered: ${enquiryForm.name}`,
        body: `Dear ${enquiryForm.name},\n\nWe have logged your registration profile for the AI & Data Science cohort. An admissions counselor will reach out to you at ${enquiryForm.phone} to discuss curriculum timeline details.`
      }
    }));

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    window.location.href = '/thank-you';
    setEnquiryForm({
      name: '',
      email: '',
      phone: '',
      qualification: 'Undergraduate',
      experience: 'Beginner - No Coding',
      goal: 'Land a Tech Job',
      contactTime: ''
    });
  };

  const scrollToHeroForm = () => {
    const el = document.getElementById('hero-application-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.classList.add('ring-4', 'ring-[#2563EB]/30');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-[#2563EB]/30');
      }, 1500);
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
        return (
          <div className="w-full h-32 bg-[#0F172A] border border-white/10 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 font-mono text-[9px] text-slate-305 text-left select-none">
            <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1">
              <span className="text-[7px] text-[#2563EB]">model_training.py</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <div className="flex-1 space-y-1">
              <div><span className="text-purple-400">import</span> sklearn.ensemble</div>
              <div className="text-slate-400"># Fit Classifier model</div>
              <div className="text-emerald-400">clf = RandomForestClassifier()</div>
              <div className="text-[#F97316]">clf.fit(X_train, y_train)</div>
            </div>
            <div className="text-[7px] text-slate-500 border-t border-white/5 pt-1 flex justify-between">
              <span>Accuracy: 92.4%</span>
              <span className="text-[#2563EB]">Live API</span>
            </div>
          </div>
        );
      case "recommend":
        return (
          <div className="w-full h-32 bg-[#0F172A] border border-white/10 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 font-mono text-[9px] text-slate-305 text-left select-none">
            <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1">
              <span className="text-[7px] text-[#2563EB]">recommender_matrix.py</span>
              <span className="text-slate-400">surprise_engine</span>
            </div>
            <div className="flex-1 space-y-0.5 pt-1 text-[8px]">
              <div className="text-slate-400">User ID: U_1042</div>
              <div className="text-emerald-400">Rec 1: AI Masterclass Course (Match: 98%)</div>
              <div className="text-emerald-400">Rec 2: ML Pipeline Script (Match: 91%)</div>
              <div className="text-slate-500">Rec 3: Cloud Compute Notebook (Match: 85%)</div>
            </div>
            <div className="text-[7px] text-slate-500 border-t border-white/5 pt-1">
              <span>Collaborative Filtering Active</span>
            </div>
          </div>
        );
      case "regression":
        return (
          <div className="w-full h-32 bg-[#0F172A] border border-white/10 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 font-mono text-[9px] text-slate-305 text-left select-none">
            <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1">
              <span className="text-[7px] text-[#2563EB]">housing_regression.py</span>
              <span className="text-slate-400">metrics</span>
            </div>
            <div className="flex-grow flex flex-col justify-center space-y-1">
              <div className="text-[#F97316]">R2 Score: 0.892</div>
              <div className="text-slate-400">Mean Absolute Error: $12.4k</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#2563EB] h-full w-[89%]"></div>
              </div>
            </div>
            <div className="text-[7px] text-slate-500 border-t border-white/5 pt-1 flex justify-between">
              <span>Epoch: 50 / 50</span>
              <span className="text-green-500">Stable</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-32 bg-[#0F172A] border border-white/10 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 font-mono text-[9px] text-slate-350 text-left select-none">
            <div className="flex items-center justify-between border-b border-white/5 pt-1">
              <span className="text-[#2563EB]">data_pipeline.py</span>
              <span className="text-[7px] text-slate-500">Pandas Engine</span>
            </div>
            <div className="flex-grow flex flex-col justify-center space-y-1">
              <div className="text-emerald-400">df = pd.read_csv("dataset.csv")</div>
              <div className="text-slate-400">df.dropna(inplace=True)</div>
              <div className="text-purple-400">df.groupby("goals").mean()</div>
            </div>
            <div className="text-[7px] text-slate-500 border-t border-white/5 pt-1">
              <span>Records Cleaned: 15,204</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="text-slate-900 min-h-screen relative bg-[#FFFFFF] font-sans bg-grid-light">
      
      {/* Sticky Header wrapper */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1 group">
            <span className="logo-font font-extrabold tracking-tight text-[#0F172A] text-xl">
              Beyond
            </span>
            <span className="logo-font font-extrabold tracking-tight text-[#2563EB] text-xl">
              Skills
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={scrollToHeroForm}
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              APPLY NOW
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-slate-100">
        <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center space-x-1.5 bg-[#2563EB]/10 text-[#2563EB] px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next Cohort Starts: July 2026</span>
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight text-left">
              Master Practical <span className="bg-gradient-to-r from-[#2563EB] via-[#F97316] to-[#0EA5E9] bg-clip-text text-transparent font-black">Artificial Intelligence, Machine Learning, Data Science & Data Analytics</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              No programming background required. Build statistical algorithms, design recommendation engines, and deploy neural network models with direct mentor audits and live support.
            </p>
            
            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button 
                onClick={scrollToHeroForm}
                className="bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-xl shadow-lg transition-all text-center cursor-pointer"
              >
                Apply Now
              </button>
              <button 
                onClick={() => {
                  confetti({ particleCount: 60, spread: 40 });
                  alert("Your curriculum catalog download has started! Please check your browser notifications.");
                }}
                className="bg-[#0F172A] hover:bg-[#0F172A]/95 text-white font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-xl transition-all text-center flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Syllabus</span>
              </button>
            </div>

            {/* Trust badge tags */}
            <div className="pt-6 border-t border-slate-100">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold mb-3">Our Core Program Pillars:</p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Practical Learning",
                  "Hands-on Projects",
                  "Mentor Support",
                  "Career Guidance",
                  "Certificate After Completion"
                ].map((tag, idx) => (
                  <span key={idx} className="flex items-center space-x-1 text-slate-600 bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Lead Capture Form Card */}
          <div className="lg:col-span-5 relative">
            <div id="hero-application-form" className="bg-white border border-slate-200/85 text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 rounded-full blur-[30px] pointer-events-none"></div>
              
              <h3 className="text-slate-900 font-extrabold text-lg sm:text-xl mb-1.5 text-left">Request Program Info</h3>
              <p className="text-xs text-slate-500 mb-6 text-left">Fill in details. Our admissions advisor will contact you soon.</p>
              
              <form onSubmit={handleApplySubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" required 
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#2563EB] focus:bg-white outline-none"
                      placeholder="e.g. Rahul Sharma"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" required 
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#2563EB] focus:bg-white outline-none"
                      placeholder="e.g. rahul@example.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Mobile Number</label>
                  <div className="relative">
                    <input 
                      type="tel" required 
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#2563EB] focus:bg-white outline-none"
                      placeholder="e.g. +91 98765 43210"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Current Qualification</label>
                    <select 
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:bg-white outline-none cursor-pointer"
                      value={enquiryForm.qualification}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, qualification: e.target.value })}
                    >
                      <option className="bg-white text-slate-900" value="Undergraduate">Undergraduate</option>
                      <option className="bg-white text-slate-900" value="Postgraduate">Postgraduate</option>
                      <option className="bg-white text-slate-900" value="College Student">College Student</option>
                      <option className="bg-white text-slate-900" value="Working Professional">Working Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Coding Experience</label>
                    <select 
                      className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:bg-white outline-none cursor-pointer"
                      value={enquiryForm.experience}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, experience: e.target.value })}
                    >
                      <option className="bg-white text-slate-900" value="Beginner - No Coding">Beginner (No Coding)</option>
                      <option className="bg-white text-slate-900" value="Basic Knowledge">Basic Knowledge</option>
                      <option className="bg-white text-slate-900" value="Experienced Developer">Experienced Developer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Career Goal</label>
                  <select 
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:bg-white outline-none cursor-pointer"
                    value={enquiryForm.goal}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, goal: e.target.value })}
                  >
                    <option className="bg-white text-slate-900" value="Land a Tech Job">Get a Tech Job</option>
                    <option className="bg-white text-slate-900" value="Career Transition">Switch Careers</option>
                    <option className="bg-white text-slate-900" value="Freelancing / Projects">Freelance Work</option>
                    <option className="bg-white text-slate-900" value="Build an AI Startup">Build an AI Startup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Preferred Contact Time</label>
                  <select 
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-[#2563EB] focus:bg-white outline-none cursor-pointer"
                    value={enquiryForm.contactTime}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, contactTime: e.target.value })}
                  >
                    <option className="bg-white text-slate-900" value="">Any Time</option>
                    <option className="bg-white text-slate-900" value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option className="bg-white text-slate-900" value="Afternoon (12 PM - 5 PM)">Afternoon (12 PM - 5 PM)</option>
                    <option className="bg-white text-slate-900" value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {status === 'success' && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] px-3.5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Application logged! Our counselor will call you shortly.</span>
                  </div>
                )}

                <p className="text-[9px] text-slate-500 text-center leading-relaxed pt-2">
                  By submitting this form you agree to be contacted regarding this upskilling program.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Why Learn AI & Data Science Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest font-mono">Market Analysis & Careers</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Why Master AI & Data Science Today?</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">The industry demand for data-literate professionals is reaching historic levels.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            {
              title: "Extreme Industry Demand",
              desc: "From product companies to healthcare, organizations globally are converting data into intelligence to automate predictive analytics.",
              highlight: "Data Scientists & AI engineers are crucial."
            },
            {
              title: "Competitive Compensation",
              desc: "Data modeling, statistical analysis, and machine learning skillsets command highly premium budgets in today's tech recruiting market.",
              highlight: "High career growth potential."
            },
            {
              title: "Freelancing & Automation",
              desc: "Master automated script pipelines to construct predictive web crawlers, text aggregators, and financial fraud analyzers.",
              highlight: "Diverse gig workflows."
            },
            {
              title: "AI Startups & Innovation",
              desc: "Understand algorithm mechanics to build SaaS products, recommendation tools, custom chat layers, and data insights engines.",
              highlight: "SaaS Builder friendly."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-[#0F172A] font-extrabold text-sm sm:text-base mb-2.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.desc}</p>
              </div>
              <span className="text-[10px] text-[#F97316] font-bold uppercase tracking-wider font-mono bg-orange-50 border border-orange-200/30 px-2 py-1 rounded inline-block self-start">
                {item.highlight}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Why BeyondSkills Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest font-mono">BeyondSkills Advantages</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Upskilling Engineered For Results</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">We provide the structure, direct guidance, and practice modules you need to gain true coding confidence.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            { icon: <GraduationCap className="w-5 h-5" />, title: "Beginner Friendly", desc: "Start from coding syntax structures before scaling to predictive algorithms and network layers." },
            { icon: <Laptop className="w-5 h-5" />, title: "Practical Learning", desc: "Build predictive models and analytics dashboards utilizing real relational dataset files." },
            { icon: <Users className="w-5 h-5" />, title: "Mentor Guidance", desc: "Receive structural code audits and review feedback from practicing data engineers." },
            { icon: <Clock className="w-5 h-5" />, title: "Live Sessions", desc: "Participate in interactive online classes with direct screen sharing and debugging support." },
            { icon: <Database className="w-5 h-5" />, title: "Real Projects", desc: "Build anomaly detectors, estimators, and text sorters to add to your git repository." },
            { icon: <Briefcase className="w-5 h-5" />, title: "Career Readiness", desc: "Optimize your developer profiles, construct portfolios, and learn industry standards." },
            { icon: <FileText className="w-5 h-5" />, title: "Resume Support", desc: "Format coding achievements and capstones professionally to pass recruiter screens." },
            { icon: <HelpCircle className="w-5 h-5" />, title: "Interview Prep", desc: "Understand algorithm test structures, mock evaluation prompts, and system designs." },
            { icon: <Users className="w-5 h-5" />, title: "Learning Community", desc: "Network with other cohort members to share code models and solve blockers." },
            { icon: <Award className="w-5 h-5" />, title: "LMS Access", desc: "Watch recorded lecture videos, read notes, and download project code models for 1 year." },
            { icon: <CheckCircle2 className="w-5 h-5" />, title: "Assignments", desc: "Assess weekly milestones with structured coding checklists and validation tests." },
            { icon: <TrendingUp className="w-5 h-5" />, title: "Portfolio Development", desc: "Deploy algorithm endpoints on live hosts to verify code utility directly." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start space-x-3.5">
              <div className="bg-[#2563EB]/10 text-[#2563EB] p-2.5 rounded-xl border border-[#2563EB]/20 shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-[#0F172A] font-bold text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-16 bg-slate-950 text-white border-b border-slate-900 bg-grid-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest font-mono">Structured Roadmap</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Our AI & Data Science Cohort Path</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">A comprehensive timeline engineered to take you from foundational Python syntax to live model deployment.</p>
          </div>

          <div className="max-w-3xl mx-auto relative border-l border-slate-800 pl-6 sm:pl-8 space-y-10 py-2 text-left">
            {CURRICULUM.map((mod, idx) => (
              <div key={idx} className="relative">
                {/* Dot indicator */}
                <span className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                </span>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest font-mono">Module {idx + 1}</span>
                  <h3 className="text-white font-extrabold text-sm sm:text-base leading-tight">{mod.phase}</h3>
                  
                  {/* Topic tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {mod.topics.map((t, i) => (
                      <span key={i} className="text-slate-300 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <div className="relative bg-gradient-to-b from-[#2563EB]/5 via-white to-transparent py-16 border-b border-slate-100">
        {/* Soft glowing blue spots behind the grid */}
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#2563EB]/5 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#2563EB]/5 blur-[80px] pointer-events-none"></div>
        
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest font-mono">Hands-on Experience</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Construct Deployed Data Projects</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">Compile a powerful coding repository showcasing real statistical applications. Below are sample projects constructed during the batch.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_PROJECTS.map((proj, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 text-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-100/10 transition-all p-5 flex flex-col justify-between space-y-5">
                
                {/* Dynamic Interactive Code Preview Mockup */}
                <div className="space-y-4">
                  {renderProjectMock(proj.mockType)}
                  
                  <div className="space-y-2 text-left">
                    <h3 className="text-white font-extrabold text-base leading-snug">{proj.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{proj.desc}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-900 pt-4 text-xs text-left">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tech.map((t, i) => (
                      <span key={i} className="text-blue-400 bg-blue-950 border border-blue-900/60 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">Key Learnings:</p>
                    <p className="text-blue-400 font-medium italic">{proj.learn}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Learning Experience Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest font-mono">The Cohort Journey</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">How You Will Master AI & ML</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">A structured cycle designed to build logic, code fluency, and career confidence step-by-step.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { step: "01", title: "Live Classes", desc: "Attend mentor-led interactive sessions to understand syntax logic and algorithm theory." },
            { step: "02", title: "Milestone Assignments", desc: "Complete practical tasks evaluating module checkpoints with detailed support." },
            { step: "03", title: "Build Projects", desc: "Construct regression engines, classifiers, and recommendation system interfaces." },
            { step: "04", title: "Code Reviews", desc: "Receive structural code audits from data practitioners to align with engineering standards." },
            { step: "05", title: "Resolve Blockers", desc: "Participate in dedicated Q&A hours to debug code scripts and query datasets." },
            { step: "06", title: "GitHub Compilation", desc: "Organize script commits, write documentation, and deploy analytics platforms live." },
            { step: "07", title: "Interview Prep", desc: " Triage statistics questionnaires, solve mock evaluation test queries, and map case studies." },
            { step: "08", title: "Career Launch", desc: "Compile your upskilling achievements, update your profile logs, and apply with confidence." }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/50 p-6 rounded-2xl space-y-3 text-left">
              <span className="text-2xl font-black text-[#2563EB]/25 font-mono">{item.step}</span>
              <h3 className="text-[#0F172A] font-extrabold text-sm sm:text-base">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Program Details Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest font-mono">Program Specs</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Cohort Information</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">Clear cohort parameters. Find program schedules, details, and access modules below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
          {/* Details Card */}
          <div className="lg:col-span-8 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
              {[
                { label: "Program Duration", value: "3 Months", detail: "12 Weeks (3 Months)" },
                { label: "Class Schedule", value: "3 Lectures / Week", detail: "3 Live Classes/Week (Evening)" },
                { label: "Lead Instructor", value: "Industry Mentors", detail: "Active Data Scientists" },
                { label: "Learning Mode", value: "Online Live Lectures", detail: "LMS recordings & codes provided" },
                { label: "Cohort Demographics", value: "95% College Students", detail: "5% Graduates & Working Professionals" },
                { label: "Course language", value: "English / Hindi support", detail: "Practical industry terms" }
              ].map((spec, idx) => (
                <div key={idx} className="space-y-1.5 border-b border-slate-100 pb-4">
                  <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">{spec.label}</p>
                  <p className="text-base font-extrabold text-[#0F172A]">{spec.value}</p>
                  <p className="text-xs text-slate-500">{spec.detail}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center space-x-3.5 text-xs text-slate-500">
              <Award className="w-5 h-5 text-[#2563EB] shrink-0" />
              <p>Successful candidates will receive an industry-recognized upskilling completion certificate.</p>
            </div>
          </div>

          {/* Cohort Inclusions Card */}
          <div className="lg:col-span-4 bg-[#0F172A] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/10 rounded-full blur-[30px] pointer-events-none"></div>
            
            <div className="space-y-6">
              <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest font-mono bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full inline-block">
                Batch Open
              </span>
              
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Cohort Access</p>
                <p className="text-3xl font-black font-mono">Live Batch</p>
                <p className="text-[10px] text-slate-450">Join our cohort of data practitioners</p>
              </div>

              <div className="space-y-3.5 text-left text-xs text-slate-350 border-t border-white/5 pt-6">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 Year Access to LMS portal logs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive coding notebooks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct mentor portfolio audits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Weekly doubts Q&A calls</span>
                </div>
              </div>
            </div>

            <button 
              onClick={scrollToHeroForm}
              className="w-full bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all mt-8 shadow-md cursor-pointer"
            >
              Secure Cohort Seat
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials & Partner Logos Slider Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee-forward {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-forward {
            animation: marquee-forward 25s linear infinite;
          }
          .partner-logo-item {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 140px;
            height: 50px;
            padding: 0 20px;
          }
        `}} />

        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest font-mono">Success Stories</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Student Success & Hiring Partners</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">Our cohort consists of 95% college students and 5% graduates, interns, or working professionals. Read their learning logs below.</p>
        </div>

        {/* Real Student Success Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { 
              name: "Ankita Patel", 
              role: "B.Tech CSE Student (3rd Year)",
              company: "VIT Vellore",
              avatarColor: "bg-blue-600/10 text-blue-600",
              review: "As a B.Tech student, our college lectures were too theoretical. This cohort gave me the practical coding side. Starting from Python foundations to building custom machine learning models, the hands-on project approach was perfect. I completed my college capstone project here under mentor guidance!"
            },
            { 
              name: "Rahul Sen", 
              role: "BCA Student (3rd Year)",
              company: "Delhi University",
              avatarColor: "bg-emerald-500/10 text-emerald-500",
              review: "Being a BCA student, I wanted to build a strong portfolio for placement drives. The cohort statistics and data visualization modules helped me understand real data workflows. Building the customer churn predictor and deploying it live on the cloud gave me projects that stood out in college reviews."
            },
            { 
              name: "Vikram Malhotra", 
              role: "Data Analyst Intern (Graduate Track)",
              company: "EY India",
              avatarColor: "bg-orange-500/10 text-orange-500",
              review: "Although the cohort is majorly composed of college students, the 5% seats allocated for graduates and interns like me are extremely valuable. The advanced Flask API deployment and database normalization lessons helped me directly in my internship tasks at EY. The code reviews were super clean!"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/50 p-6 rounded-2xl space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${item.avatarColor} font-black flex items-center justify-center font-mono text-sm`}>
                  {item.name[0]}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#0F172A]">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{item.role} at {item.company}</p>
                </div>
              </div>
              <p className="text-xs text-slate-650 italic leading-relaxed">"{item.review}"</p>
            </div>
          ))}
        </div>
        
        {/* Scrolling Partner Logos Slider */}
        <div className="mt-16 text-center border-t border-slate-100 pt-8 space-y-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">Upskilled Candidates Placed & Hired at:</p>
          
          <div className="w-full flex overflow-hidden select-none relative mt-4">
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div className="flex whitespace-nowrap animate-marquee-forward items-center py-2">
              {[
                { name: 'Cisco', url: 'https://cdn.simpleicons.org/cisco/005073' },
                { name: 'Intuit', url: 'https://cdn.simpleicons.org/intuit/3F4EBF' },
                { name: 'Microsoft', url: microsoftLogo },
                { name: 'Meta', url: 'https://cdn.simpleicons.org/meta/0668E1' },
                { name: 'Adobe', url: adobeLogo },
                { name: 'IBM', url: ibmLogo },
                { name: 'Samsung', url: 'https://cdn.simpleicons.org/samsung/1428A0' },
                { name: 'Infosys', url: 'https://cdn.simpleicons.org/infosys/007CC3' },
                { name: 'Sony', url: 'https://cdn.simpleicons.org/sony/000000' }
              ].concat([
                { name: 'Cisco', url: 'https://cdn.simpleicons.org/cisco/005073' },
                { name: 'Intuit', url: 'https://cdn.simpleicons.org/intuit/3F4EBF' },
                { name: 'Microsoft', url: microsoftLogo },
                { name: 'Meta', url: 'https://cdn.simpleicons.org/meta/0668E1' },
                { name: 'Adobe', url: adobeLogo },
                { name: 'IBM', url: ibmLogo },
                { name: 'Samsung', url: 'https://cdn.simpleicons.org/samsung/1428A0' },
                { name: 'Infosys', url: 'https://cdn.simpleicons.org/infosys/007CC3' },
                { name: 'Sony', url: 'https://cdn.simpleicons.org/sony/000000' }
              ]).map((logo, idx) => (
                <div key={idx} className="partner-logo-item hover:scale-105 transition-transform duration-300">
                  <img src={logo.url} alt={logo.name} className="h-7 object-contain opacity-70 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest font-mono">Academic Queries</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-500">Find clear, direct answers to common cohort and upskilling queries.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 text-left">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4.5 text-left font-bold text-xs sm:text-sm text-[#0F172A] hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                {faqOpen[idx] ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
              </button>
              
              {faqOpen[idx] && (
                <div className="p-4.5 border-t border-slate-100 text-xs text-slate-500 leading-relaxed bg-slate-50/50 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-[#0F172A] text-white text-center relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#2563EB]/10 blur-[130px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <span className="inline-flex items-center space-x-1.5 bg-[#2563EB]/20 text-[#2563EB] px-3.5 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join BeyondSkills Cohort</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight">Start Building Real Software with BeyondSkills</h2>
          <p className="text-xs sm:text-sm text-slate-355 max-w-xl mx-auto leading-relaxed">
            Construct predictive models, script data cleaning queries, and deploy production ML endpoints under direct mentor guidance.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4 max-w-xs sm:max-w-none mx-auto">
            <button 
              onClick={scrollToHeroForm}
              className="bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer"
            >
              Apply Now
            </button>
            <button 
              onClick={() => {
                confetti({ particleCount: 50, spread: 30 });
                alert("Curriculum guide catalog download starting!");
              }}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              Syllabus PDF
            </button>
          </div>
          
          <p className="text-[10px] text-slate-400 max-w-md mx-auto pt-4 leading-relaxed">
            Our team will contact you to explain the program, curriculum, fee structure and answer all your questions.
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

      {/* Sticky mobile CTA button */}
      <div className="fixed bottom-0 inset-x-0 z-35 bg-white/95 backdrop-blur border-t border-slate-200 p-3 sm:hidden flex items-center justify-center">
        <button 
          onClick={scrollToHeroForm}
          className="w-full bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all shadow text-center cursor-pointer"
        >
          Apply Now
        </button>
      </div>

    </div>
  );
}
