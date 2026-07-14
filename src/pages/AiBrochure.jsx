import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Brain, Code, CheckCircle, ChevronDown, ChevronUp, Sparkles, 
  TrendingUp, Briefcase, Award, Rocket, ArrowRight, BarChart3, 
  Users, BookOpen, Quote, ShieldCheck, Mail, Calendar, HelpCircle, FileText
} from 'lucide-react';

const CURRICULUM_DATA = [
  {
    sNo: 1,
    title: "Python Fundamentals: Internals, Architecture, and Best Practices",
    subtopics: [
      "Installation and Setup of Anaconda Environment",
      "Jupyter Notebook Overview with Modern Usage Practices",
      "Essential Shortcut Keys and Productivity Tips in Jupyter Notebook",
      "Understanding Python Data Types with Real-World Applications"
    ]
  },
  {
    sNo: 2,
    title: "Python Data Structures & File Handling in Python",
    subtopics: [
      "Best Practices for Naming Variables in Python (PEP 8 Standards)",
      "Python Data Structures: List, Tuple, Set, and Dictionary with Practical Use Cases",
      "Introduction to Files and Directories in Modern Development Environments",
      "Working with Command Line Interfaces (CLI) and Terminal Navigation",
      "File Handling in Python: Reading Text Files and Using Context Managers (with Statement)"
    ]
  },
  {
    sNo: 3,
    title: "Regular Doubt-Clearing & Interactive Discussion Sessions",
    subtopics: [
      "Dedicated sessions will be held to address course-related queries and foster interactive discussions."
    ]
  },
  {
    sNo: 4,
    title: "Control Flow in Python: Loops and Conditional Statements",
    subtopics: [
      "Conditional Statements in Python: if, elif, and else",
      "Looping Constructs: for loops and while loops"
    ]
  },
  {
    sNo: 5,
    title: "Data Analysis & Manipulation using NumPy",
    subtopics: [
      "Introduction to Machine Learning Libraries",
      "NumPy: Hands-on Implementation and Practical Applications"
    ]
  },
  {
    sNo: 6,
    title: "Continuous Doubt Resolution & Concept Strengthening Sessions",
    subtopics: [
      "Regular sessions will be conducted to address course-related queries and promote interactive discussions."
    ]
  },
  {
    sNo: 7,
    title: "Data Analysis with Pandas (Data Cleaning & Transformation)",
    subtopics: [
      "Pandas: Hands-on Data Analysis and Real-World Applications"
    ]
  },
  {
    sNo: 8,
    title: "Exploratory Data Analysis (EDA) and Visualization using Matplotlib",
    subtopics: [
      "Learn to explore, visualize, and extract meaningful insights from data",
      "Data Visualization Concepts and Techniques",
      "Matplotlib: Hands-on Implementation",
      "Seaborn: Hands-on Visualization for Advanced Insights"
    ]
  },
  {
    sNo: 9,
    title: "Statistical Thinking in Python: Building Core Foundations",
    subtopics: [
      "Build Statistical Thinking and Learn to Understand Data Effectively",
      "Measures of Central Tendency",
      "Measures of Dispersion",
      "IQR (Interquartile Range) Statistics – Hands-on Practice"
    ]
  },
  {
    sNo: 10,
    title: "Introduction to Machine Learning: Supervised & Unsupervised Learning",
    subtopics: [
      "Introduction to Classification, Regression, and Model Fine-Tuning",
      "Supervised Learning Concepts",
      "Unsupervised Learning Concepts",
      "Linear Regression: Theory and Practical Implementation",
      "Evaluation Metrics in Linear Regression – Hands-on Practice"
    ]
  },
  {
    sNo: 11,
    title: "Logistic Regression: Concepts and Practical Implementation",
    subtopics: [
      "Logistic Regression: Fundamentals and Practical Applications",
      "Performance Evaluation Metrics for Logistic Regression",
      "Hands-on Implementation of Logistic Regression"
    ]
  },
  {
    sNo: 12,
    title: "Linear Regression: Model Building and Evaluation",
    subtopics: [
      "Linear Regression: Concepts and Practical Applications",
      "Evaluation Metrics for Linear Regression"
    ]
  },
  {
    sNo: 13,
    title: "Data Preprocessing Techniques for Machine Learning",
    subtopics: [
      "Introduction to Data Preprocessing Techniques",
      "Data Standardization and Normalization",
      "Exploratory Data Analysis (EDA)",
      "Handling Missing Values",
      "Outlier Detection and Treatment",
      "Feature Scaling and Feature Selection Techniques"
    ]
  },
  {
    sNo: 14,
    title: "Tree-Based Models: Classification and Regression Trees (CART)",
    subtopics: [
      "Decision Trees: Concepts and Practical Applications",
      "Bagging Techniques for Model Improvement",
      "Boosting and Random Forest Methods"
    ]
  },
  {
    sNo: 15,
    title: "Fundamentals of Neural Networks and Deep Learning",
    subtopics: [
      "Neural Networks: Concepts and Practical Applications"
    ]
  },
  {
    sNo: 16,
    title: "Capstone Project (Real-World Implementation)",
    subtopics: [
      "Utilize Data Science Libraries for Data Analysis, Visualization, Model Building, and Data Extraction"
    ]
  },
  {
    sNo: 17,
    title: "Fundamentals of Natural Language Processing (NLP): Text Processing, Tokenization, and Language Models",
    subtopics: [
      "NLTK: Text Preprocessing, Tokenization, and Linguistic Analysis",
      "spaCy: Advanced NLP, Named Entity Recognition (NER), and Industrial Applications",
      "Gensim: Topic Modeling, Word Embeddings, and Semantic Analysis",
      "FastText: Efficient Text Classification, Word Representations, and Deep Learning-based NLP"
    ]
  },
  {
    sNo: 18,
    title: "Introduction to Generative AI (Gen AI): LLMs, Prompt Engineering, and Real-World Applications",
    subtopics: [
      "Hugging Face Ecosystem: Transformers, Model Hub, and Pre-trained Models",
      "Working of Generative AI: Concepts, Architectures, and Model Training Process",
      "Generative AI Models: GANs, VAEs, and Large Language Models (LLMs)",
      "Overview of DALL·E, ChatGPT, and Bard: Capabilities and Applications",
      "Real-World Use Cases of Generative AI: Content Creation, Automation, Personalization, and AI Assistants"
    ]
  }
];

const CAREER_ROADMAP = [
  {
    step: 1,
    role: "Data Analyst & Python Developer",
    salary: "₹6 - 8 LPA",
    description: "Write custom scripts to automate pipeline checks, execute SQL commands, clean corporate datasets, and construct clean Matplotlib and Seaborn graphs.",
    tech: ["Python", "Jupyter", "NumPy", "Pandas", "Matplotlib"]
  },
  {
    step: 2,
    role: "Data Scientist",
    salary: "₹10 - 15 LPA",
    description: "Construct advanced statistical predictions, design classification/regression matrix systems, and translate business requirements into feature engineering goals.",
    tech: ["SciPy", "Statistical Modeling", "Feature Scaling", "Scikit-Learn"]
  },
  {
    step: 3,
    role: "Machine Learning Engineer",
    salary: "₹12 - 18 LPA",
    description: "Train complex tree-based CART algorithms, construct ensemble bagging and boosting structures, and deploy predictive metrics pipelines inside production apps.",
    tech: ["Random Forests", "CART", "Ensemble Models", "XGBoost"]
  },
  {
    step: 4,
    role: "NLP Specialist",
    salary: "₹15 - 22 LPA",
    description: "Build custom text models, create tokenization and NER architectures, deploy word embedding structures, and manage semantic search models for document databases.",
    tech: ["NLTK", "spaCy", "Gensim", "Word Embeddings"]
  },
  {
    step: 5,
    role: "Generative AI Developer",
    salary: "₹18 - 30+ LPA",
    description: "Integrate LLM APIs, fine-tune models, implement retrieval-augmented generation (RAG) structures, design custom agents with OpenAI APIs and deploy Hugging Face models.",
    tech: ["Generative AI", "Hugging Face", "LLMs", "Prompt Engineering", "OpenAI APIs"]
  }
];

const COMPANYS_TIEUPS = [
  "Google Cloud", "Microsoft", "AWS Cloud", "Razorpay", "HubSpot", "Meta Ads", "Vercel", "Shopify"
];

const LOGO_IMAGES = {
  "Google Cloud": "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg",
  "Microsoft": "https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg",
  "AWS Cloud": "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg",
  "Razorpay": "https://cdn.worldvectorlogo.com/logos/razorpay.svg",
  "HubSpot": "https://www.vectorlogo.zone/logos/hubspot/hubspot-icon.svg",
  "Meta Ads": "https://www.vectorlogo.zone/logos/meta/meta-icon.svg",
  "Vercel": "https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg",
  "Shopify": "https://www.vectorlogo.zone/logos/shopify/shopify-icon.svg"
};

const DATASETS = [
  {
    label: "Global AI Market Expansion",
    current: "2024: $184 Billion",
    projected: "2032: $1.3 Trillion",
    growth: 85,
    details: "According to McKinsey analysis, the global market for Artificial Intelligence is growing at a CAGR of 37.3% as enterprises implement custom APIs."
  },
  {
    label: "Increase in AI-Specific Job Openings",
    current: "2022 Base Value",
    projected: "2026: +250% Growth",
    growth: 90,
    details: "Active hiring reports indicate that roles requiring generative AI capabilities have doubled, while standard python developer salaries grew by 40%."
  },
  {
    label: "Global Corporate Data Generation",
    current: "2020: 64 Zettabytes",
    projected: "2025: 175 Zettabytes",
    growth: 78,
    details: "The explosion of unstructured log files and enterprise documents necessitates localized NLP parsing architectures to index corporate data pools."
  }
];

const PROJECTS = [
  {
    id: 1,
    title: "Enterprise Predictive Churn Model",
    desc: "Train supervised classification structures using Random Forests to forecast contract cancellations based on log telemetry and transaction trends.",
    tech: ["Python", "Pandas", "Scikit-Learn", "Seaborn"]
  },
  {
    id: 2,
    title: "NLP Intent Classification Engine",
    desc: "Build a text classification system utilizing spaCy, tokenization, and custom corpus vectors to direct customer queries to appropriate departments.",
    tech: ["spaCy", "NLTK", "Gensim", "Word Embeddings"]
  },
  {
    id: 3,
    title: "Generative AI QA Assistant",
    desc: "Construct an advanced chatbot running on Hugging Face transformers and custom prompt interfaces, enabling natural-language search over documents.",
    tech: ["Generative AI", "Hugging Face", "LLM APIs", "Python"]
  },
  {
    id: 4,
    title: "End-to-End Capstone Deployment",
    desc: "Extract data via web scraper pipelines, clean it with Pandas, train an ensemble CART regression model, and build a live Streamlit analytics dashboard.",
    tech: ["Matplotlib", "CART Models", "Feature Selection", "Data Pipeline"]
  }
];

export default function AiBrochure() {
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState({ 0: true });
  const [activeDatasetIdx, setActiveDatasetIdx] = useState(0);

  const toggleModule = (idx) => {
    setExpandedModules(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleEnrollClick = () => {
    navigate('/checkout?courseId=artificial-intelligence&mode=mentor-led');
  };

  return (
    <div className="text-slate-900 min-h-screen relative overflow-x-hidden bg-transparent">
      {/* Background spotlights to layer with the global interactive grid */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[1200px] left-[-300px] w-[600px] h-[600px] bg-brand-cyan/8 rounded-full blur-[140px] pointer-events-none z-0"></div>
      
      {/* 1. Hero Section (Futuristic Dark Theme) */}
      <section className="relative z-10 pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900/60 bg-[#060A24] text-white overflow-hidden">
        {/* Neon Grid Lines overlay inside hero */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(to right, #2A4BFF 1px, transparent 1px),
            linear-gradient(to bottom, #2A4BFF 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <span className="inline-flex items-center space-x-2 bg-[#2A4BFF]/20 text-[#0EA5E9] font-mono text-xs font-bold tracking-widest px-4 py-1.5 rounded-full border border-[#2A4BFF]/30 uppercase">
              <Sparkles className="w-4.5 h-4.5 text-[#0EA5E9] animate-pulse" />
              <span>Interactive Digital Brochure</span>
            </span>
            
            <h1 className="logo-font text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Master <span className="bg-gradient-to-r from-[#0EA5E9] to-[#2A4BFF] bg-clip-text text-transparent">Artificial Intelligence</span>
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed font-mono">
              Accelerate your engineering credentials. A comprehensive 18-week roadmap bridging fundamental Python coding to deep neural models and advanced Generative AI architectures.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleEnrollClick}
                className="w-full sm:w-auto bg-[#2A4BFF] hover:brightness-110 text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                Register & Enroll Now
              </button>
              <a 
                href="#curriculum"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-widest transition-all text-center"
              >
                Explore Syllabus modules
              </a>
            </div>
          </div>
          
          {/* Key Program Pillars grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { label: "Duration", value: "3 Months (18 Modules)" },
              { label: "Delivery Mode", value: "Recorded + Live Mentoring" },
              { label: "Hands-on projects", value: "3 Core + 1 Capstone" },
              { label: "Outcome", value: "2 Industry Certificates" }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center backdrop-blur-md">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">{pillar.label}</span>
                <span className="text-xs sm:text-sm font-extrabold mt-1 text-white block">{pillar.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Brand Introduction (Beyond Skills Overview) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold text-[#2A4BFF] uppercase tracking-wider font-mono bg-[#2A4BFF]/5 px-3 py-1 rounded border border-[#2A4BFF]/10">
              Beyond Skills Academy
            </span>
            <h2 className="logo-font text-3xl font-extrabold text-slate-900 leading-tight">
              Bridging Corporate Realities with Expert Pedagogy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify font-mono">
              At BeyondSkills, we operate a hybrid platform: a technology agency delivering high-end custom code solutions to international enterprises, and a training academy mentoring student programmers.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify font-mono">
              This double vertical architecture means our syllabus doesn't stay static. The modules taught represent precisely what our agency developers use in production environments.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Active Tech Mentors", desc: "Classes are designed and run by managers from Tietoevry, EY, and Nokia with 5+ years of live experience.", icon: Users },
              { title: "Production Workflows", desc: "Skip academic toy tasks. Clean actual raw datasets, handle real CSV files, and deploy transformer pipelines.", icon: Code },
              { title: "Verifiable Badges", desc: "Recipients gain secure cryptographic badges linked to their projects, proving verification directly to HR teams.", icon: Award },
              { title: "End-to-End Support", desc: "From Jupyter setup issues to resume construction reviews, our mentors resolve blocks within daily SLAs.", icon: ShieldCheck }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-[#0A0E35]/90 border border-[#2A4BFF]/20 hover:border-brand-purple/40 p-5 rounded-2xl transition-all group text-white shadow-xl">
                  <div className="bg-[#2A4BFF]/20 p-2.5 rounded-xl text-[#0EA5E9] w-fit mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wide font-mono mb-1">{item.title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-normal font-mono">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Why Learn AI Today Section & Dataset Dashboard */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#040824]/90 border-t border-b border-slate-900 z-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[#0EA5E9] text-xs font-bold uppercase tracking-wider font-mono">Market Intel & Datasets</span>
            <h2 className="logo-font text-3xl font-bold text-white">Why You Must Learn AI Right Now</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              We compile recent dataset reports demonstrating the massive demand trajectory for Python, Machine Learning, and GenAI skillsets across tech hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Dataset Navigation Cards */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              {DATASETS.map((data, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDatasetIdx(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                    activeDatasetIdx === idx 
                      ? 'bg-[#0F174A]/90 border-[#2A4BFF] shadow-lg ring-1 ring-[#2A4BFF]/40 text-white' 
                      : 'bg-[#0A0E35]/70 border-[#2A4BFF]/10 text-slate-300 hover:bg-[#0B1240]/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs uppercase tracking-wide font-mono ${activeDatasetIdx === idx ? 'text-[#0EA5E9]' : 'text-slate-300'}`}>{data.label}</span>
                    <TrendingUp className={`w-4 h-4 ${activeDatasetIdx === idx ? 'text-[#0EA5E9]' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex justify-between items-baseline mt-3">
                    <span className="text-[10px] text-slate-400 font-mono">{data.current}</span>
                    <span className={`text-xs font-extrabold font-mono ${activeDatasetIdx === idx ? 'text-white' : 'text-[#2A4BFF]'}`}>{data.projected}</span>
                  </div>
                  {/* Dynamic Progress indicator bar */}
                  <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] h-full transition-all duration-700"
                      style={{ width: activeDatasetIdx === idx ? `${data.growth}%` : '8%' }}
                    ></div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Interactive Data Details Card */}
            <div className="lg:col-span-7 bg-[#05092A] text-white p-8 rounded-3xl border border-[#2A4BFF]/20 relative overflow-hidden flex flex-col justify-between shadow-2xl">
              {/* Graphic mesh watermark */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/15 rounded-full blur-2xl z-0"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center space-x-2 text-[#0EA5E9]">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Active Data Feed</span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold logo-font">
                  {DATASETS[activeDatasetIdx].label}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light font-mono">
                  {DATASETS[activeDatasetIdx].details}
                </p>
                
                <div className="border-t border-white/10 pt-6 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Current Index</span>
                    <span className="text-sm font-bold text-slate-200">{DATASETS[activeDatasetIdx].current}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Projected Capacity</span>
                    <span className="text-sm font-bold text-[#0EA5E9]">{DATASETS[activeDatasetIdx].projected}</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 mt-8 flex items-center space-x-3 text-xs text-slate-300">
                <Rocket className="w-5 h-5 text-[#2A4BFF] flex-shrink-0 animate-bounce" />
                <p className="font-mono">Learn these exact packages to stay ahead of corporate automation shifts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Zig-Zag Career Roadmap Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[#2A4BFF] text-xs font-bold uppercase tracking-wider font-mono">Career Trajectory</span>
          <h2 className="logo-font text-3xl font-bold text-slate-900">Interactive Career Roadmap</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-mono">
            See the pathways open to you as you progress through our 18 modules. Hover over each step to see salary levels and required tools.
          </p>
        </div>

        {/* The Zig-Zag Roadmap Layout */}
        <div className="relative pt-6">
          
          {/* Weaving Glowing Neon Road (md+) */}
          <svg 
            className="absolute top-0 bottom-0 left-0 right-0 w-full h-full pointer-events-none hidden md:block z-0" 
            viewBox="0 0 1000 960" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="road-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2A4BFF" />
                <stop offset="50%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#2A4BFF" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Elegant glowing snaking road path weaving back and forth between cards */}
            <path 
              d="M 500 0 C 320 120, 320 200, 500 300 C 680 400, 680 480, 500 580 C 320 680, 320 760, 500 860 C 600 910, 600 940, 500 960" 
              fill="none" 
              stroke="url(#road-grad)" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeDasharray="12 8" 
              filter="url(#glow)"
              className="opacity-70" 
            />
          </svg>

          <div className="space-y-8 relative z-10">
            {CAREER_ROADMAP.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                  
                  {/* Content card representing the role (Dark Glassmorphic) */}
                  <div className="w-full md:w-[45%]">
                    <div className="bg-[#0A0E35]/95 border border-[#2A4BFF]/25 p-5 rounded-2xl hover:border-[#2A4BFF]/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative text-white">
                      {/* Decorative subtle dot highlight on card border */}
                      <div className="absolute top-0 right-0 w-8 h-8 bg-[#2A4BFF]/10 rounded-bl-3xl group-hover:bg-[#2A4BFF]/20 transition-colors z-0"></div>
                      
                      <div className="relative z-10 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wide">Milestone {step.step}</span>
                          <span className="text-xs font-extrabold text-[#0EA5E9] bg-[#2A4BFF]/15 px-2.5 py-0.5 rounded border border-[#2A4BFF]/30 font-mono">
                            {step.salary}
                          </span>
                        </div>
                        
                        <h4 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-[#0EA5E9] transition-colors">{step.role}</h4>
                        
                        <p className="text-[11px] text-slate-300 leading-relaxed font-light font-mono">{step.description}</p>
                        
                        {/* Tools tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {step.tech.map((tag, tIdx) => (
                            <span key={tIdx} className="text-[8px] font-bold text-slate-200 bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bullet center marker (md+) */}
                  <div className="w-10 h-10 bg-[#060A24] border-2 border-[#2A4BFF] rounded-full flex items-center justify-center text-white text-xs font-mono font-bold z-10 shadow-lg relative hidden md:flex">
                    {step.step}
                    {/* Pulsing indicator ring */}
                    <div className="absolute -inset-1.5 border border-[#2A4BFF]/40 rounded-full animate-ping opacity-60 pointer-events-none"></div>
                  </div>

                  {/* Empty space filler for alignment (md+) */}
                  <div className="w-full md:w-[45%] hidden md:block"></div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Company Tie-ups & Hiring Partners */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-900 bg-[#040824]/80 z-10 relative">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div>
            <span className="text-[#0EA5E9] text-[10px] font-bold font-mono uppercase tracking-widest bg-[#2A4BFF]/10 border border-[#2A4BFF]/20 px-3 py-1 rounded">Tie-ups & Placements</span>
            <h3 className="logo-font text-xl sm:text-2xl font-bold text-white mt-3">Where Our Alumni Work & Get Hired</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center max-w-4xl mx-auto pt-4">
            {COMPANYS_TIEUPS.map((company, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center justify-center space-y-3 group"
              >
                {/* Clean white round casing for official brand logo to stand out */}
                <div className="bg-white p-4.5 rounded-full shadow-lg border border-slate-100 flex items-center justify-center w-16 h-16 group-hover:scale-110 transition-transform duration-300">
                  <img src={LOGO_IMAGES[company]} alt={company} className="w-9 h-9 object-contain" />
                </div>
                <span className="text-[10px] text-slate-300 font-mono font-bold uppercase tracking-wider">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Detailed 18-Week Week-by-Week Curriculum */}
      <section id="curriculum" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[#2A4BFF] text-xs font-bold uppercase tracking-wider font-mono">Detailed Syllabus</span>
          <h2 className="logo-font text-3xl font-bold text-slate-900">Curriculum Breakdown (18 Weeks)</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-mono">
            Click on each module below to view the complete topic list and learn how each subtopic ties to production pipelines.
          </p>
        </div>

        {/* Accordions (Premium Dark Theme boxes) */}
        <div className="space-y-3.5">
          {CURRICULUM_DATA.map((module, idx) => {
            const isExpanded = expandedModules[idx];
            return (
              <div 
                key={idx} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isExpanded 
                    ? 'border-[#2A4BFF]/50 shadow-lg bg-[#0C153D]/95 text-white' 
                    : 'border-[#2A4BFF]/15 hover:border-[#2A4BFF]/30 hover:shadow-md bg-[#0A0E35]/90 text-slate-200 hover:bg-[#0E174E]/90'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => toggleModule(idx)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <span className="bg-[#2A4BFF]/25 border border-[#2A4BFF]/40 text-[#0EA5E9] font-mono text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg flex-shrink-0">
                      Module {module.sNo}
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm uppercase tracking-wide font-mono leading-relaxed">
                      {module.title}
                    </h4>
                  </div>
                  <div className="text-slate-400 hover:text-white ml-2 flex-shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[#0EA5E9]" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Subtopics List */}
                {isExpanded && (
                  <div className="p-5 border-t border-[#2A4BFF]/20 bg-slate-950/40 space-y-3.5 animate-fade-in text-slate-100">
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Topics Covered</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {module.subtopics.map((topic, tIdx) => (
                        <li key={tIdx} className="flex items-start space-x-2 text-xs leading-relaxed font-light font-mono text-slate-300">
                          <CheckCircle className="w-4 h-4 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Projects Showcase Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#040824]/90 border-t border-b border-slate-900 z-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[#0EA5E9] text-xs font-bold uppercase tracking-wider font-mono">Project Portfolio</span>
            <h2 className="logo-font text-3xl font-bold text-white">Hands-On Development Tasks</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              We believe in building. You will complete 3 real-world portfolio tasks plus 1 custom capstone deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROJECTS.map((proj) => (
              <div 
                key={proj.id} 
                className="bg-[#0A0E35]/95 border border-[#2A4BFF]/20 p-6 rounded-2xl flex flex-col justify-between hover:border-[#2A4BFF]/45 hover:shadow-xl transition-all duration-300 group text-white"
              >
                <div>
                  <div className="bg-[#2A4BFF]/20 text-[#0EA5E9] border border-[#2A4BFF]/30 px-2 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-widest w-fit mb-4">
                    Project 0{proj.id}
                  </div>
                  <h4 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wide font-mono mb-2 group-hover:text-[#0EA5E9] transition-colors">{proj.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-light mb-6 font-mono">{proj.desc}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
                  {proj.tech.map((t, idx) => (
                    <span key={idx} className="text-[8px] font-bold text-slate-200 bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Upskilling Sessions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold text-[#2A4BFF] uppercase tracking-wider font-mono bg-[#2A4BFF]/5 px-3 py-1 rounded border border-[#2A4BFF]/10">
              Career Readiness
            </span>
            <h2 className="logo-font text-3xl font-bold text-slate-900 leading-tight">
              Upskilling & Career Acceleration Suite
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-mono">
              Acquiring hard programming competencies represents only 70% of candidate value. We dedicate weekly slots to building your personal brand and communication confidence.
            </p>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { 
                title: "1-on-1 Resume Builder", 
                desc: "We analyze your project statements, audit technical keywords, and re-format structures to pass ATS screening algorithms.",
                action: "ATS Optimization Reviews"
              },
              { 
                title: "LinkedIn Branding", 
                desc: "Learn to write content showcasing your capstone steps, optimize search banners, and network with active technology managers.",
                action: "Creator Mode Optimization"
              },
              { 
                title: "Public Speaking & Pitching", 
                desc: "Weekly demo days where students present code architectures, explaining algorithms to peers and building narrative speaking skills.",
                action: "Public Technical Explanations"
              },
              { 
                title: "Mock Technical & HR Reviews", 
                desc: "Replicate live interview telemetry: solve Python arrays under pressure and answer logic checks from agency managers.",
                action: "Simulated Telemetry Rounds"
              }
            ].map((suite, idx) => (
              <div key={idx} className="bg-[#0A0E35]/95 border border-[#2A4BFF]/20 hover:border-[#2A4BFF]/45 hover:shadow-lg p-6 rounded-2xl transition-all text-white">
                <h4 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wide font-mono mb-2">{suite.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-4 font-mono">{suite.desc}</p>
                <span className="text-[9px] text-[#0EA5E9] font-bold font-mono uppercase tracking-widest border border-[#2A4BFF]/30 bg-[#2A4BFF]/20 px-2 py-0.5 rounded">
                  {suite.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. End CTA Section & Founder's Quote */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-[#060A24] text-white text-center overflow-hidden">
        {/* Glow vector background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-10">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-[#0EA5E9] text-[10px] font-bold font-mono uppercase tracking-widest border border-[#2A4BFF]/30 bg-[#2A4BFF]/10 px-3 py-1 rounded">
              Ready to Accelerate
            </span>
            <h2 className="logo-font text-3xl sm:text-4xl font-extrabold leading-tight">
              Get Industry Ready with Beyond Skills
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-mono">
              Skip traditional academic lags. Enroll today to secure direct support access and build working projects.
            </p>
          </div>

          {/* Founder Quote card */}
          <div className="bg-[#0A0E35]/90 border border-[#2A4BFF]/25 p-8 rounded-3xl text-left max-w-2xl mx-auto relative shadow-2xl">
            <Quote className="w-10 h-10 text-[#0EA5E9]/15 absolute top-4 left-4 pointer-events-none" />
            <div className="relative z-10 pl-6 space-y-4">
              <p className="text-slate-200 text-xs sm:text-sm italic leading-relaxed font-light font-mono">
                "BeyondSkills was founded to resolve the extreme misalignment between college textbooks and corporate realities. We do not just teach syntax; we construct engineers who can build products and navigate technical issues autonomously."
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-6 bg-[#2A4BFF] rounded-full"></div>
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider font-mono text-white">Founder, BeyondSkills</h5>
                  <span className="text-[10px] text-slate-400 font-mono">Agency & Academy Operations</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={handleEnrollClick}
              className="w-full sm:w-auto bg-[#2A4BFF] hover:brightness-110 text-white font-bold px-10 py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 cursor-pointer"
            >
              Get Started & Enroll Now
            </button>
            <div className="mt-4 flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-mono">
              <Mail className="w-3.5 h-3.5 text-[#2A4BFF]" />
              <span>Contact: admissions@wayspire.in / support@beyondskills.co</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
