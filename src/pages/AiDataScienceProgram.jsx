import React, { useState, useEffect } from 'react';
import { 
  Code, BookOpen, Clock, Award, Users, CheckCircle, ArrowRight, Check, 
  ChevronRight, Calendar, ShieldAlert, Sparkles, Phone, Mail, Globe, 
  Star, Briefcase, Zap, Compass, HelpCircle, ChevronDown, ChevronUp, Download, Play, RefreshCw, BarChart2
} from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/dbHelpers';
import { saveLeadToSupabase } from '../utils/supabaseClient';

export default function AiDataScienceProgram() {
  const [faqOpen, setFaqOpen] = useState({});
  const [selectedCurriculumTab, setSelectedCurriculumTab] = useState('programming');
  
  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    status: 'Undergraduate Student',
    message: ''
  });
  const [enquiryStatus, setEnquiryStatus] = useState(null);

  // Active step in roadmap
  const [activeStep, setActiveStep] = useState(0);

  // Interactive AI Sandbox State
  const [modelType, setModelType] = useState('nlp'); // 'nlp' | 'mlp'
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [isTrained, setIsTrained] = useState(false);
  const [testInput, setTestInput] = useState('The mentors are incredibly helpful and the live sessions are amazing!');
  const [testResult, setTestResult] = useState(null);

  // Curriculum category cards data
  const curriculumCategories = {
    programming: {
      title: 'Programming Foundations',
      description: 'Acquire robust software engineering foundations tailored specifically for scientific and data workflows.',
      items: [
        { name: 'Python Fundamentals', desc: 'Core syntax, variables, expressions, and best coding practices.' },
        { name: 'Jupyter Notebook', desc: 'Interactive development environment setup and markdown execution.' },
        { name: 'Data Types', desc: 'Strings, numbers, booleans, and implicit data type conversions.' },
        { name: 'Data Structures', desc: 'Working with Lists, Tuples, Dictionaries, and Sets efficiently.' },
        { name: 'File Handling', desc: 'Reading, writing, and parsing text, CSV, and JSON files.' },
        { name: 'Control Flow', desc: 'Conditional statements, loops, error handlers, and code functions.' }
      ]
    },
    analysis: {
      title: 'Data Analysis & Insights',
      description: 'Learn how to clean raw unstructured datasets and extract actionable visual intelligence.',
      items: [
        { name: 'NumPy Calculations', desc: 'Multidimensional array creation, vector operations, and matrix math.' },
        { name: 'Pandas Library', desc: 'DataFrames manipulation, filtering, grouping, and merging datasets.' },
        { name: 'Data Cleaning', desc: 'Handling missing values, duplicate entries, outliers, and type normalization.' },
        { name: 'Data Visualization', desc: 'Creating charts, heatmaps, and distribution plots using Matplotlib.' },
        { name: 'Exploratory Data Analysis', desc: 'Uncovering patterns, anomalies, and statistical relationships in data.' }
      ]
    },
    ml: {
      title: 'Machine Learning Pipelines',
      description: 'Master mathematical concepts, supervised models, and feature engineering frameworks.',
      items: [
        { name: 'Applied Statistics', desc: 'Probability distributions, hypothesis testing, mean, variance, and standard deviation.' },
        { name: 'Linear Regression', desc: 'Predicting continuous variables using linear mathematical formulas.' },
        { name: 'Logistic Regression', desc: 'Binary classification techniques for categorical target variables.' },
        { name: 'Decision Trees', desc: 'Tree-based classifiers, random forest ensemble, and model pruning.' },
        { name: 'Data Preprocessing', desc: 'Feature scaling, normalization, and handling categorical data.' },
        { name: 'Feature Engineering', desc: 'Selecting, transforming, and constructing powerful features for ML models.' }
      ]
    },
    ai: {
      title: 'Artificial Intelligence & LLMs',
      description: 'Build neural networks, pretrain language models, and leverage state-of-the-art Generative AI.',
      items: [
        { name: 'Neural Networks', desc: 'Artificial neurons, layers, activation functions, and backpropagation.' },
        { name: 'Deep Learning', desc: 'Multi-layer networks, tuning optimizers, loss curves, and model weights.' },
        { name: 'Natural Language Processing', desc: 'Tokenization, embeddings, tf-idf, and sequence-to-sequence models.' },
        { name: 'Hugging Face API', desc: 'Utilizing pre-trained transformer models for classification and inference.' },
        { name: 'Generative AI & LLMs', desc: 'Large language models, prompt engineering, and building custom RAG apps.' }
      ]
    }
  };

  const faqItems = [
    {
      q: "Do I need prior coding knowledge to join this program?",
      a: "No prior programming experience is required. The curriculum is built from the ground up, starting with Python fundamentals, Jupyter notebooks, and basic data structures, before building up to advanced machine learning and deep learning pipelines."
    },
    {
      q: "What is the schedule for the 40 hours of live mentor training?",
      a: "The program spans 4 months. Live interactive sessions are scheduled on weekends to accommodate college students and working professionals. In addition to live lectures, you will have access to weekly office hours and live coding labs for individual doubt resolution."
    },
    {
      q: "How are the 3 real-world projects structured?",
      a: "Each project is based on actual industrial use cases (e.g. predictive customer churn, LLM-based RAG chat agents). You will write the clean production code, receive direct repo feedback from engineering mentors, and build a deployment-ready portfolio."
    },
    {
      q: "What is the certificate verification system?",
      a: "Upon completing the course and project requirements, you will receive a unique verifiable digital certificate. It is registered on our database and can be verified instantly by any employer on the BeyondSkills /verify portal using your student ID."
    },
    {
      q: "What career support is provided after the program?",
      a: "We focus on project reviews, GitHub profile optimization, and live coding practices with senior data scientists to help you showcase your skills to potential recruiters."
    }
  ];

  // Learning journey roadmap steps
  const roadmapSteps = [
    { name: 'Admission', desc: 'Registration & environment setup.' },
    { name: 'Python Foundations', desc: 'Core syntax & data structures.' },
    { name: 'Data Analysis', desc: 'Pandas, NumPy & visualization.' },
    { name: 'Machine Learning', desc: 'Supervised models & regression.' },
    { name: 'Deep Learning', desc: 'Neural networks & model weights.' },
    { name: 'Projects', desc: 'Real-world deployment scenarios.' },
    { name: 'Portfolio', desc: 'GitHub reviews & dashboard assets.' },
    { name: 'Certificate', desc: 'Issuance of verifiable credentials.' },
    { name: 'Developer Setup', desc: 'GitHub optimization & code reviews.' }
  ];

  // Tools and tech data
  const techTools = [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Jupyter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg' },
    { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
    { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
    { name: 'Matplotlib', icon: 'https://img.icons8.com/color/48/000000/line-chart.png' },
    { name: 'Seaborn', icon: 'https://img.icons8.com/color/48/000000/area-chart.png' },
    { name: 'Scikit-learn', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg' },
    { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
    { name: 'NLTK', icon: 'https://img.icons8.com/color/48/000000/alphabet.png' },
    { name: 'spaCy', icon: 'https://img.icons8.com/color/48/000000/brain.png' },
    { name: 'Hugging Face', icon: 'https://img.icons8.com/color/48/000000/emoji-heart-eyes.png' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' }
  ];

  // Projects list
  const projectList = [
    {
      title: 'Predictive Customer Churn Pipeline',
      type: 'Machine Learning',
      metrics: '94.2% Prediction Accuracy',
      desc: 'Build an end-to-end data pipeline to preprocess demographic and subscription records. Scale features, handle missing data, and train Random Forest models to predict customer churn risk, outputting retention metrics directly to an active database.',
      tech: ['Python', 'Pandas', 'Scikit-learn', 'Seaborn']
    },
    {
      title: 'Hugging Face Sentiment API',
      type: 'Natural Language Processing',
      metrics: 'Real-time NLP Inference',
      desc: 'Develop a serverless NLP inference script that calls pre-trained transformer pipelines. Feed raw text inputs to analyze user sentiment scores, classify intent tags, and automatically route support enquiries using Hugging Face pipelines.',
      tech: ['Python', 'Hugging Face', 'NLP', 'NLTK']
    },
    {
      title: 'Corporate RAG Chat Agent (LLM)',
      type: 'Generative AI',
      metrics: 'Custom LLM Document Retrieval',
      desc: 'Design and deploy an intelligent chatbot utilizing Retrieval-Augmented Generation (RAG). Convert corporate PDFs/sheets into vector database embeddings, and query them using OpenAI/Hugging Face APIs with structured prompt engineering.',
      tech: ['Python', 'Generative AI', 'TensorFlow', 'Git']
    }
  ];

  // Career outcomes roles list
  const careerOutcomes = [
    { title: 'AI Engineer', desc: 'Build and optimize production neural networks, transformer pipelines, and machine learning models.' },
    { title: 'Machine Learning Engineer', desc: 'Design model pipelines, perform feature engineering, and deploy scalable inference servers.' },
    { title: 'Data Analyst', desc: 'Clean raw logs, construct SQL/Pandas pipelines, and present charts to drive business decisions.' },
    { title: 'Data Scientist', desc: 'Model predictive statistics, run hypothesis testing, and discover user behavior insights.' },
    { title: 'Business Intelligence Analyst', desc: 'Build interactive dashboards, monitor metrics, and support data-driven plans.' },
    { title: 'AI Application Developer', desc: 'Integrate LLM API backends, configure vector searches, and build AI agents.' }
  ];

  // Simulated AI training sandbox logic
  const startSandboxTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setIsTrained(false);
    setTestResult(null);
    setTrainingLogs(['[SYSTEM] Initializing weight matrices...', '[SYSTEM] Loading dataset tensor variables...']);
  };

  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        const next = prev + 20;
        if (next >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setIsTrained(true);
          setTrainingLogs((logs) => [
            ...logs,
            `Epoch 5/5 - loss: ${modelType === 'nlp' ? '0.062' : '0.118'} - accuracy: ${modelType === 'nlp' ? '98.6%' : '94.2%'}`,
            '[SYSTEM] Model training complete! Saving network weights...',
            '[SYSTEM] AI Inference Engine online.'
          ]);
          // Auto run test
          runInference();
          return 100;
        }

        const epoch = Math.floor(next / 20);
        const loss = (1.2 - (next / 100) * 1.1 + Math.random() * 0.05).toFixed(3);
        const accuracy = (55 + (next / 100) * 39 + Math.random() * 2).toFixed(1);
        setTrainingLogs((logs) => [
          ...logs,
          `Epoch ${epoch}/5 - loss: ${loss} - accuracy: ${accuracy}%`
        ]);
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isTraining, modelType]);

  const runInference = () => {
    if (modelType === 'nlp') {
      const positiveWords = ['love', 'good', 'amazing', 'great', 'helpful', 'awesome', 'best', 'excellent', 'smart'];
      const textLower = testInput.toLowerCase();
      let isPos = false;
      for (let word of positiveWords) {
        if (textLower.includes(word)) {
          isPos = true;
          break;
        }
      }
      const score = isPos ? (85 + Math.random() * 14).toFixed(1) : (10 + Math.random() * 20).toFixed(1);
      setTestResult({
        class: isPos ? 'POSITIVE Sentiment' : 'NEGATIVE / NEUTRAL Sentiment',
        score: `${score}% Confidence`,
        action: isPos ? 'Route to Testimonials & Reviews' : 'Route to Advising Support Team'
      });
    } else {
      setTestResult({
        class: 'ML Prediction: Customer Retained',
        score: '96.2% Retention Probability',
        action: 'Trigger loyalty email workflow'
      });
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();

    const courseTitle = 'AI & Data Science Specialist';
    const detailedNotes = `College: ${enquiryForm.college || 'N/A'}\nMessage: ${enquiryForm.message || 'N/A'}\nSubmitted via AI & Data Science Program page`;

    const payload = {
      name: enquiryForm.name.trim(),
      email: enquiryForm.email.trim(),
      phone: enquiryForm.phone.trim(),
      type: 'Ads Leads',
      program: 'artificial-intelligence',
      notes: detailedNotes,
      college: enquiryForm.college || 'Unspecified',
      profession: enquiryForm.status,
      message: enquiryForm.message || ''
    };

    // 1. Save to Supabase (dynamic client with fallbacks)
    const leadRecord = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      status: payload.profession,
      course_id: payload.program,
      course_title: courseTitle,
      student_details: `College: ${payload.college} | Message: ${payload.message}`,
      job_role: payload.profession
    };
    await saveLeadToSupabase(leadRecord);

    // 2. Post to backend webhook API
    try {
      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : window.location.origin;

      await fetch(`${apiHost}/api/webhook/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Error posting enquiry to backend webhook:', err);
    }

    // 3. Save locally for fallback redundancy
    const leads = getDbItem('beyondskills_leads', []);
    const newLead = { 
      id: `LD${String(leads.length + 101).padStart(3, '0')}`,
      type: 'Ads Leads', 
      program: 'artificial-intelligence',
      course: courseTitle,
      name: enquiryForm.name,
      email: enquiryForm.email,
      phone: enquiryForm.phone,
      college: enquiryForm.college,
      qualification: enquiryForm.college,
      profession: enquiryForm.status,
      message: enquiryForm.message,
      status: 'New',
      subStatus: 'QUALIFIED',
      date: new Date().toISOString() 
    };
    leads.push(newLead);
    setDbItem('beyondskills_leads', leads);

    // Simulated email SLA trigger
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `AI & Data Science Program Registration Received`,
        body: `Hello ${enquiryForm.name},\n\nWe have successfully received your registration details for the BeyondSkills AI & Data Science Certification Program. \n\nAn academic counselor will contact you within 24 hours at ${enquiryForm.phone} or via email to guide you through model files, schedules, and dashboard logins.\n\nWarm regards,\nBeyondSkills Admissions Team`
      }
    }));

    setEnquiryStatus('success');
    setEnquiryForm({
      name: '',
      email: '',
      phone: '',
      college: '',
      status: 'Undergraduate Student',
      message: ''
    });
    setTimeout(() => setEnquiryStatus(null), 5000);
  };

  const downloadSyllabusMock = () => {
    alert('BeyondSkills AI & Data Science Program Guide — please check your browser downloads folder.');
    window.dispatchEvent(new CustomEvent('beyondskills_toast', {
      detail: {
        subject: `Syllabus Downloaded: AI & Data Science`,
        body: `Hello,\n\nYou have downloaded the program guide for the BeyondSkills AI & Data Science Specialist Program. A reference email with curriculum guidelines, student project repositories, and fee options has been dispatched to your files.\n\nSincerely,\nBeyondSkills Team`
      }
    }));
  };

  const toggleFaq = (idx) => {
    setFaqOpen(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="text-slate-900 bg-white min-h-screen relative font-sans">
      {/* Dynamic Grid Background Pattern */}
      <div className="bg-grid-pattern"></div>
      <div className="bg-grid-glow"></div>

      {/* Hero & Highlights Section Combined */}
      <header className="relative z-10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-none bg-transparent! backdrop-blur-none!">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="inline-flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-[#2D43B8] bg-[#2D43B8]/10 border border-[#2D43B8]/20 px-3 py-1.5 rounded-full font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium AI & Data Science Certification</span>
            </span>
            <h1 className="font-manrope font-extrabold text-slate-900 text-4xl sm:text-6xl tracking-tight leading-[1.08] mt-2">
              Build the Future with <span className="text-[#2D43B8]">Artificial Intelligence</span>
            </h1>
            <p className="text-slate-650 text-sm sm:text-base leading-relaxed max-w-xl font-inter">
              Master neural networks, deep learning models, data visualization, and large language model (LLM) APIs through live expert training, industrial coding pipelines, and verifiable project certificates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={() => scrollToSection('enquiry-form')}
                className="bg-[#2D43B8] text-white hover:brightness-110 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#2D43B8]/20 text-center cursor-pointer"
              >
                Apply Now
              </button>
              <button 
                onClick={downloadSyllabusMock}
                className="bg-[#F5F7FA] border border-slate-200 text-[#111111] hover:bg-slate-100 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 text-center flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Guide</span>
              </button>
              <button 
                onClick={() => scrollToSection('enquiry-form')}
                className="bg-transparent border-b-2 border-slate-300 hover:border-[#2D43B8] text-slate-700 hover:text-slate-900 px-4 py-2 font-bold text-xs uppercase tracking-widest transition-all text-center cursor-pointer"
              >
                Talk to Advisor
              </button>
            </div>
          </div>

          {/* Right Interactive AI Sandbox */}
          <div className="lg:col-span-6">
            <div className="bg-[#0A0E35] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D43B8]/20 rounded-full blur-2xl z-0"></div>
              
              {/* Header Tab */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 pl-2">beyondskills_ai_sandbox.py</span>
                </div>
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                  <button 
                    onClick={() => { setModelType('nlp'); setIsTrained(false); setTestResult(null); }}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${modelType === 'nlp' ? 'bg-[#2D43B8] text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Sentiment classifier
                  </button>
                  <button 
                    onClick={() => { setModelType('mlp'); setIsTrained(false); setTestResult(null); }}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${modelType === 'mlp' ? 'bg-[#2D43B8] text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    MLP Classifier
                  </button>
                </div>
              </div>

              {/* Code Screen / Terminal */}
              <div className="font-mono text-xs space-y-3 min-h-[170px] bg-slate-950/80 p-4 rounded-xl border border-white/5 relative z-10 max-h-[180px] overflow-y-auto">
                <div className="text-emerald-400"># Model: {modelType === 'nlp' ? 'Deep BERT Sentiment Analyzer' : 'Multi-Layer Perceptron (MLP)'}</div>
                <div>import tensorflow as tf</div>
                <div>model = tf.keras.Sequential([</div>
                {modelType === 'nlp' ? (
                  <>
                    <div className="text-slate-400 pl-4">tf.keras.layers.Embedding(20000, 128),</div>
                    <div className="text-slate-400 pl-4">tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64)),</div>
                    <div className="text-slate-400 pl-4">tf.keras.layers.Dense(1, activation='sigmoid')</div>
                  </>
                ) : (
                  <>
                    <div className="text-slate-400 pl-4">tf.keras.layers.Dense(64, activation='relu'),</div>
                    <div className="text-slate-400 pl-4">tf.keras.layers.Dropout(0.2),</div>
                    <div className="text-slate-400 pl-4">tf.keras.layers.Dense(1, activation='sigmoid')</div>
                  </>
                )}
                <div>])</div>
                
                {/* Dynamic Logs */}
                {trainingLogs.map((log, i) => (
                  <div key={i} className="text-slate-350 text-[11px] border-t border-white/5 pt-1 mt-1">
                    {log}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-between relative z-10">
                <button 
                  onClick={startSandboxTraining}
                  disabled={isTraining}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 ${isTraining ? 'bg-white/10 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/10'}`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
                  <span>{isTraining ? `Training ${trainingProgress}%` : 'Train Neural Net'}</span>
                </button>
                <div className="text-[10px] text-slate-400">
                  Click to simulate live network training
                </div>
              </div>

              {/* Inference Box */}
              {isTrained && (
                <div className="mt-4 pt-4 border-t border-white/10 relative z-10 animate-fade-in space-y-3">
                  <span className="text-[9px] font-bold text-[#0EA5E9] uppercase tracking-widest block">Live AI Inference Engine:</span>
                  {modelType === 'nlp' ? (
                    <input 
                      type="text"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                      placeholder="Type a sentiment message..."
                    />
                  ) : (
                    <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-white/5">
                      Target Customer: ID_88029 • Tenure: 14 Months • Support Tickets: 0
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={runInference}
                      className="bg-brand-cyan hover:bg-brand-cyan/90 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
                    >
                      Run Model
                    </button>
                    {testResult && (
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#0EA5E9]">{testResult.class}</div>
                        <div className="text-[10px] text-slate-400">{testResult.score} • {testResult.action}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Combined Viewport: Program Highlights Statistics Grid */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { metric: '4 Months', label: 'Program Duration', icon: Clock },
            { metric: '40 Hours', label: 'Live Mentor Training', icon: BookOpen },
            { metric: '3 Real-World', label: 'Hands-on Projects', icon: Code },
            { metric: 'Live + Recorded', label: 'Delivery Model', icon: Users },
            { metric: 'Portfolio SLA', label: 'Career Support Prep', icon: Briefcase },
            { metric: 'Verifiable', label: 'Digital Certificate', icon: Award }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-between hover:border-[#2D43B8]/30 transition-all duration-300 group hover:shadow-lg hover:shadow-[#2D43B8]/5">
                <div className="w-8 h-8 rounded-lg bg-[#2D43B8]/5 flex items-center justify-center text-[#2D43B8] mb-4 group-hover:bg-[#2D43B8]/10 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 font-manrope">{stat.metric}</div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </header>

      {/* SECTION 2: Career Opportunities & Why BeyondSkills (Combined logical layout) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Why BeyondSkills Left (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
              The BeyondSkills Advantage
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Project-Driven Learning Architecture
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-inter">
              We eliminate traditional classroom theory. Our learning systems are instructed by active industry practitioners, focusing entirely on clean code, vector models, and deployable portfolios.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Industry Expert Mentors', desc: 'Classes are taught by practicing engineers from Tietoevry, EY, and Shemaroo.' },
                { title: 'Weekly Coding Labs', desc: 'Get hands-on support in our community channels to debug Jupyter notebooks.' },
                { title: 'Verifiable Portfolios', desc: 'Construct real models and push them to git, providing verifiable proof of skills.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#2D43B8]/10 text-[#2D43B8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market/Career Opportunities Right (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#0B0F19] text-white p-6 rounded-2xl border border-white/5 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/10 rounded-full blur-2xl"></div>
              <span className="text-[10px] text-brand-cyan font-bold tracking-widest uppercase block font-mono">Market Demand</span>
              <h3 className="text-2.5xl font-extrabold font-manrope text-white">36% CAGR Growth</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-inter">
                The global AI & analytics software market is expanding at a record pace. Traditional roles are transitioning rapidly into automation pipelines, requiring active training.
              </p>
            </div>

            <div className="bg-slate-55 shadow-sm border border-slate-200/60 p-6 rounded-2xl space-y-6 hover:shadow-md transition-all duration-300">
              <span className="text-[10px] text-[#2D43B8] font-bold tracking-widest uppercase block font-mono">Average Packages</span>
              <h3 className="text-2.5xl font-extrabold font-manrope text-slate-900">₹6.5 - 12 LPA</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-inter">
                Data scientists and neural network developers command some of the highest salaries for entry-level developers in the Indian technology industry.
              </p>
            </div>

            <div className="bg-slate-55 shadow-sm border border-slate-200/60 p-6 rounded-2xl space-y-6 hover:shadow-md transition-all duration-300 col-span-1 sm:col-span-2">
              <span className="text-[10px] text-[#2D43B8] font-bold tracking-widest uppercase block font-mono">Realistic Technology Focus</span>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">No Cartoon Robots, Just Actual Models</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-inter">
                We focus on tools like TensorFlow, Scikit-learn, and Hugging Face pipelines. Build production-grade customer classifiers and document indexing models that align with modern tech stacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Animated Learning Journey Roadmap (Timelines alternating) */}
      <section className="py-16 bg-[#0B0F19] text-white relative overflow-hidden z-10 border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,67,184,0.08),transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-cyan text-[10px] font-extrabold tracking-widest uppercase border border-brand-cyan/20 px-3 py-1 rounded bg-brand-cyan/5 font-mono">
              Learning Journey
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
              Your Professional AI Roadmap
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Click through the pipeline phases to preview your training timeline deliverables.
            </p>
          </div>

          {/* Interactive Timeline Controls */}
          <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-10">
            {roadmapSteps.map((step, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`py-3 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer text-center ${activeStep === idx ? 'bg-[#2D43B8] border-[#2D43B8] text-white shadow-lg shadow-[#2D43B8]/20' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
              >
                {step.name}
              </button>
            ))}
          </div>

          {/* Detailed Step Card */}
          <div className="max-w-3xl mx-auto bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#2D43B8]/20 text-white font-extrabold text-[9px] tracking-widest uppercase px-4 py-1.5 rounded-bl-xl font-mono">
              Step 0{activeStep + 1} / 09
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-xl bg-[#2D43B8] text-white flex items-center justify-center font-extrabold text-lg flex-shrink-0 font-mono shadow-md shadow-[#2D43B8]/25">
                0{activeStep + 1}
              </div>
              <div className="space-y-3">
                <h3 className="font-manrope font-extrabold text-white text-xl sm:text-2xl">{roadmapSteps[activeStep].name}</h3>
                <p className="text-slate-350 text-sm leading-relaxed font-inter">{roadmapSteps[activeStep].desc}</p>
                <div className="flex items-center space-x-2 text-xs text-[#0EA5E9] font-bold font-mono pt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Syllabus Milestone Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Curriculum Overview Grid (Alternating categories) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
            Curriculum Grid
          </span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-4 tracking-tight">
            Academic Curriculum Syllabus
          </h2>
          <p className="text-slate-500 text-sm">
            Categorized into four core fields of data science and artificial intelligence engineering.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center space-x-4 mb-12">
          {Object.keys(curriculumCategories).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedCurriculumTab(key)}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${selectedCurriculumTab === key ? 'bg-[#2D43B8] text-white border-[#2D43B8] shadow-lg shadow-[#2D43B8]/10' : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              {curriculumCategories[key].title}
            </button>
          ))}
        </div>

        {/* Dynamic Category Card Grid */}
        <div className="bg-[#F5F7FA] border border-slate-200/60 rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="max-w-3xl mb-8">
            <h3 className="font-manrope font-extrabold text-[#111111] text-xl sm:text-2.5xl mb-2">
              {curriculumCategories[selectedCurriculumTab].title}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              {curriculumCategories[selectedCurriculumTab].description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculumCategories[selectedCurriculumTab].items.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl space-y-2.5 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-2 text-[#2D43B8]">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{item.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-inter pl-6">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Real-World Projects Showcase */}
      <section className="py-16 bg-[#0B0F19] text-white relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#0EA5E9] text-[10px] font-extrabold tracking-widest uppercase border border-white/10 px-3 py-1 rounded font-mono">
              Hands-On Projects
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
              Build Production-Grade Portfolios
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
              Construct three advanced intelligence models, deploy API endpoints, and host them live using GitHub workflows.
            </p>
          </div>

          {/* Grid Layout Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projectList.map((project, idx) => (
              <div key={idx} className="bg-slate-900 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-brand-cyan/30 transition-all duration-300 relative group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-brand-cyan uppercase border border-brand-cyan/20 px-2.5 py-0.5 rounded bg-brand-cyan/5 font-mono">
                      {project.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {project.metrics}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight group-hover:text-brand-cyan transition-colors">{project.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-inter">{project.desc}</p>
                </div>

                <div className="border-t border-white/10 pt-4 mt-6">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t, tIdx) => (
                      <span key={tIdx} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-350 font-mono">
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

      {/* SECTION 6: Tools & Technologies Badges */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
            Modern Tech Stack
          </span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-4 tracking-tight">
            Tools & Engineering Platforms
          </h2>
          <p className="text-slate-500 text-sm">
            Work with platforms deployed at leading technology organizations.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
          {techTools.map((tool, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/60 px-5 py-3 rounded-xl flex items-center space-x-3 hover:border-[#2D43B8]/20 transition-all duration-200 hover:-translate-y-0.5">
              <img src={tool.icon} alt={tool.name} className="w-5 h-5 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
              <span className="text-xs font-bold text-slate-800 tracking-wide uppercase font-mono">{tool.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Career Outcomes Roles Grid */}
      <section className="py-16 bg-[#F5F7FA] border-t border-[#E5E7EB] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
              Career Directions
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-[#111111] mt-4 mb-4 tracking-tight">
              AI & Data Science Career Paths
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Equip yourself to compete for specialized developer and analytics roles in global technology pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careerOutcomes.map((role, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 hover:border-[#2D43B8]/20 hover:shadow-lg transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-[#2D43B8]/5 flex items-center justify-center text-[#2D43B8] group-hover:bg-[#2D43B8]/10 transition-colors">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-manrope font-bold text-slate-900 text-base group-hover:text-[#2D43B8] transition-colors">{role.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-inter">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ Accordion Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
            Have Questions?
          </span>
          <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Frequently Asked Queries
          </h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-200">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between text-slate-900 hover:text-[#2D43B8] transition-colors cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">{item.q}</span>
                {faqOpen[idx] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {faqOpen[idx] && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-200/40 pt-4 font-inter animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: FINAL CTA & ENQUIRY FORM */}
      <section id="enquiry-form" className="relative z-10 py-20 bg-[#F5F7FA] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: CTA Context */}
            <div className="space-y-6 text-left">
              <span className="inline-flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-[#2D43B8] bg-[#2D43B8]/10 border border-[#2D43B8]/20 px-3 py-1 rounded font-mono">
                Admissions Open
              </span>
              <h2 className="font-manrope font-extrabold text-[#111111] text-3xl sm:text-5xl leading-tight">
                Build Your Future in <span className="text-[#2D43B8]">Artificial Intelligence</span>
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-md font-inter">
                Register details to schedule a live training counseling session. Download the syllabus models and receive detailed briefs from academy mentors.
              </p>
              
              {/* Compliance note */}
              <div className="flex items-start space-x-3 bg-white border border-slate-200 p-4 rounded-xl max-w-md">
                <ShieldAlert className="w-5 h-5 text-[#2D43B8] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-relaxed font-inter">
                  <strong>Notice:</strong> Program registration fees are final. Class schedules are mapped dynamically to weekends to assist working professionals.
                </p>
              </div>
            </div>

            {/* Right Column: Admission Enquiry Form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl max-w-lg mx-auto w-full">
              <h3 className="font-manrope font-bold text-[#111111] text-lg sm:text-xl mb-6">Admission Enquiry Form</h3>
              
              {enquiryStatus === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl space-y-2 text-center animate-fade-in">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-sm">Enquiry Submitted Successfully!</h4>
                  <p className="text-[11px] text-emerald-600 leading-relaxed">
                    Your enquiry has been received. A program advisor will reach out shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({...enquiryForm, name: e.target.value})}
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all"
                      placeholder="e.g., Faisal Shah" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({...enquiryForm, email: e.target.value})}
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all"
                      placeholder="e.g., faisal@gmail.com" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({...enquiryForm, phone: e.target.value})}
                        className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all"
                        placeholder="e.g., +91 99999 99999" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">College Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={enquiryForm.college}
                        onChange={(e) => setEnquiryForm({...enquiryForm, college: e.target.value})}
                        className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all"
                        placeholder="e.g., IIT Delhi / NIT Trichy" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Current Status *</label>
                    <select 
                      value={enquiryForm.status}
                      onChange={(e) => setEnquiryForm({...enquiryForm, status: e.target.value})}
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all"
                    >
                      <option value="Undergraduate Student">Undergraduate Student</option>
                      <option value="Final Year Student">Final Year Student</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                      <option value="Working Professional">Working Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Brief Message</label>
                    <textarea 
                      rows="3"
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#2D43B8] transition-all resize-none"
                      placeholder="Tell us about your career goals..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3.5 bg-[#2D43B8] text-white hover:brightness-110 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-[#2D43B8]/20 cursor-pointer"
                  >
                    Submit Enquiry
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
