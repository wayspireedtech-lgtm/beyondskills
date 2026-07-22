import React, { useState, useEffect } from 'react';
import { 
  Shield, Terminal, Award, Users, CheckCircle, ArrowRight, Check, 
  ChevronRight, Calendar, Sparkles, Phone, Mail, Globe, Star, Briefcase, Zap, 
  HelpCircle, ChevronDown, ChevronUp, Download, MessageCircle, Layout, 
  Search, ShieldCheck, TrendingUp, RefreshCw, Send, FileText, Link as LinkIcon,
  Server, Cpu, Network, Activity, Layers, Lock, Key, EyeOff
} from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/dbHelpers';
import { saveLeadToSupabase } from '../utils/supabaseClient';
import { LeadService } from '../utils/leadService';
import { validateEmail, validatePhone } from '../utils/validationHelpers';

const OUTCOMES = [
  { title: "Perform Network Scanning", desc: "Identify active hosts, open ports, and footprint network services using industry tools like Nmap." },
  { title: "Identify OWASP Web Risks", desc: "Audit and intercept web application vulnerabilities (SQLi, XSS, CSRF) using Burp Suite." },
  { title: "Analyze Live Packet Traffic", desc: "Capture, inspect, and analyze system network packets to detect malicious indicators in Wireshark." },
  { title: "Configure SOC & Firewalls", desc: "Deploy Intrusion Detection Systems (IDS), set up firewalls, and audit threat logs inside SIEM platforms." },
  { title: "Draft Audit Remediations", desc: "Compile professional vulnerability reports and draft remediation strategies to patch compromised systems." }
];

const CURRICULUM = [
  {
    week: "Module 1",
    title: "Fundamentals & CIA Triad",
    subtopic: "Threat Landscape, Security Principles, and Policies",
    details: [
      "Cybersecurity Fundamentals: Definition, Scope, and modern advanced persistent threat (APT) landscape.",
      "The CIA Triad: Confidentiality, Integrity, and Availability principles applied to enterprise systems.",
      "Regulatory Compliance: Introduction to governance, risk assessments, GDPR, and data protection rules."
    ]
  },
  {
    week: "Module 2",
    title: "Linux CLI & Troubleshooting",
    subtopic: "Commands, File System, and Administration Basics",
    details: [
      "Linux command line: Directory navigation, permissions, service controls, and pipeline utilities.",
      "Networking commands: Troubleshooting ports, pinging nodes, and editing local configuration files."
    ]
  },
  {
    week: "Module 3",
    title: "Dedicated Doubt Resolution",
    subtopic: "Interactive Real-Time Support and Lab Configuration",
    details: [
      "Interactive Support: Solving virtual lab environment conflicts, verifying local network settings."
    ]
  },
  {
    week: "Module 4",
    title: "Windows System Security",
    subtopic: "Configuration, Permissions, and PowerShell scripting",
    details: [
      "Access Control: Setting user privileges, editing firewall rules, and reviewing Defender settings.",
      "Command Prompt & PowerShell: Basic automation scripting for system audits and event logs."
    ]
  },
  {
    week: "Module 5",
    title: "Q&A and Review Support",
    subtopic: "System Security Configurations and Doubt Resolution",
    details: [
      "Lab Q&A: Troubleshooting batch scripting triggers, auditing active process trees, and reviewing logs."
    ]
  },
  {
    week: "Module 6",
    title: "Networking Protocols & Ports",
    subtopic: "OSI Models, TCP/IP, and Network Routing",
    details: [
      "Network Communications: Understanding the layers of OSI and TCP/IP protocol suites.",
      "Service Ports: Port bindings for DNS, HTTPS, SSH, and setting up network segmentation rules."
    ]
  },
  {
    week: "Module 7",
    title: "Ethical Hacking Methodologies",
    subtopic: "Reconnaissance, Scanning, and Footprinting",
    details: [
      "Information Sourcing: Footprinting targets using open-source intelligence (OSINT).",
      "Network Enumeration: Running system scans in Wireshark, identifying open ports, and listing services."
    ]
  },
  {
    week: "Module 8",
    title: "Web Application Security",
    subtopic: "Vulnerability Assessments & Penetration Testing",
    details: [
      "Proxy Audits: Setting up Burp Suite to intercept traffic, fuzzing parameters, and directory scanning.",
      "OWASP Vulnerabilities: Hands-on exploitation and patching of Cross-Site Scripting (XSS) and SQL Injection."
    ]
  },
  {
    week: "Module 9",
    title: "SOC Operations & SIEM",
    subtopic: "Threat Monitoring, Event Logs, and Alerts",
    details: [
      "Security Monitoring: Configuring centralized log collection, analyzing network event indicators.",
      "Defensive Tools: Deploying firewalls, configuring honeypots, and drafting incident logs."
    ]
  },
  {
    week: "Module 10",
    title: "Red vs. Blue Team Scenarios",
    subtopic: "Attack & Defense Virtual Simulations",
    details: [
      "Simulated Scenarios: Blue team defensive strategies vs. Red team offensive penetration testing models."
    ]
  },
  {
    week: "Module 11",
    title: "Offensive Penetration Testing",
    subtopic: "System Exploitations & Secure Communication Protocols",
    details: [
      "System Penetration: Explaining buffer overflows, payload injections, and secure proxy connections."
    ]
  },
  {
    week: "Module 12",
    title: "Audit Checklists & Policies",
    subtopic: "Vulnerability Reporting & Remediation Practices",
    details: [
      "Security Audits: Writing checklists, outlining risk factors, and formulating patch advisories."
    ]
  },
  {
    week: "Module 13",
    title: "Project Review & Career Prep",
    subtopic: "Portfolio Auditing, Certified Ethical Hacker (CEH) Q&A",
    details: [
      "Final Review: Submitting your OWASP Security Audit and network diagnostics capstone portfolio.",
      "Careers Guidance: Mock interview drills, resume writing, and setting up cybersecurity portfolios."
    ]
  }
];

const SAMPLE_PROJECTS = [
  {
    title: "OWASP Top 10 Security Audit",
    desc: "Configure a local vulnerable web application, intercept HTTP traffic using Burp Suite, identify XSS and SQLi vulnerabilities, and draft a patch recommendation.",
    tech: ["Burp Suite", "OWASP Top 10", "Web Security"],
    learn: "Parameter tampering, input sanitization audits, and threat reporting."
  },
  {
    title: "Network Packet Diagnostic Inspection",
    desc: "Capture and dissect live TCP/UDP traffic streams in Wireshark to locate cleartext credential transmission and server scanning flags.",
    tech: ["Wireshark", "TCP/IP Protocol", "Packet Analysis"],
    learn: "Filtering protocol frames, isolating rogue packets, and tracking payload streams."
  },
  {
    title: "Network Topology Port Reconnaissance",
    desc: "Conduct footprint scans on a virtual target subnet using Nmap to list active IP nodes, open ports, and operating system versions.",
    tech: ["Nmap Scanner", "Reconnaissance", "OS Footprinting"],
    learn: "Configuring stealth scan flags, reading XML reports, and service validation."
  },
  {
    title: "Centralized SIEM & Firewall Deployment",
    desc: "Build an active network firewall cluster, deploying log filters to capture brute-force patterns on administrative login pages.",
    tech: ["SIEM Logs", "IDS Configuration", "Honeypots"],
    learn: "Setting rule alerts, auditing threat logs, and incident prioritization."
  },
  {
    title: "Stealth Proxy & Anonymity Pipeline",
    desc: "Configure secure proxy chains and Tor network routing vectors to test host vulnerability scanners without exposing origins.",
    tech: ["Proxychains", "Tor Network", "Stealth Audits"],
    learn: "Dynamic route configuration, anonymity diagnostics, and traffic routing."
  },
  {
    title: "Active Directory Access Audit",
    desc: "Audit access permissions on a mock corporate system, locating privilege escalation pathways and correcting group policies.",
    tech: ["Active Directory", "Powershell", "Access Controls"],
    learn: "User group validation, role assignments, and permission restrictions."
  }
];

const FAQS = [
  { q: "Who is this Cybersecurity certification program for?", a: "This program is designed for college students, IT graduates, software developers, system engineers, and tech professionals looking to transition into ethical hacking, security auditing, and security operations center (SOC) roles." },
  { q: "What security tools will I learn?", a: "You will master Kali Linux, Nmap, Wireshark, Burp Suite, OWASP Top 10 frameworks, basic Powershell security scripts, IDS configurations, and SIEM security logging dashboards." },
  { q: "Do I need a strong programming background?", a: "No, prior coding experience is not required. We start with basic Linux command-line tools and operating system controls before introducing scripting and security automation." },
  { q: "How are classes conducted?", a: "All live interactive mentor sessions are conducted online, mostly scheduled in the evening for convenience. High-definition recordings, lab checklists, and mentor support forums are accessible 24/7." },
  { q: "Will I practice hacking on live internet sites?", a: "No. All ethical hacking, scanning, and penetration tests are practiced strictly inside secure, isolated local lab systems and sandbox virtual machines." },
  { q: "Is there support for external security certifications?", a: "Yes. Our curriculum covers the core concepts required for foundation certificates like Certified Ethical Hacker (CEH) and CompTIA Security+, and we provide guidance for their preparation." },
  { q: "Will my lab reports be audited by industry experts?", a: "Yes. Experienced security analysts audit your vulnerability assessment files and network scan reports, providing enterprise-grade review feedback." },
  { q: "Will I receive a certificate of completion?", a: "Yes. Upon completing all training modules, project assignments, and passing the final security audit assessment, you will be issued your certification." },
  { q: "What is the duration of this program?", a: "The program spans 3 months, offering structured weekly modules to ensure comprehensive concept coverage." },
  { q: "How do I submit my application?", a: "Simply fill out the lead capture form on this page with your credentials. Our program advisors will contact you to explain details and complete enrollment." }
];

export default function CybersecurityLandingPage() {
  // SEO tags setup on mount
  useEffect(() => {
    document.title = "Cybersecurity & Ethical Hacking Program | BeyondSkills";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Master Kali Linux, Nmap, Burp Suite, OWASP Top 10, and SIEM security logs. Build a professional cybersecurity portfolio with BeyondSkills.");
    }

    // Add Schema Markup
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Cybersecurity & Ethical Hacking Program",
      "description": "Master Kali Linux, Nmap, Burp Suite, OWASP Top 10, and SIEM security logs. Build a professional cybersecurity portfolio.",
      "provider": {
        "@type": "Organization",
        "name": "BeyondSkills",
        "sameAs": window.location.origin
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: 'Undergraduate Student',
    experience: 'Beginner (No Experience)',
    goal: 'Start a Career in Cybersecurity',
    preferredTime: 'Evening (6 PM - 9 PM)'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  // FAQ Accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Curriculum timeline state
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);

  // Sticky apply CTA visibility on scroll
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!validateEmail(formData.email)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Email Address', body: 'Please enter a valid email address (e.g. name@example.com).' }
      }));
      setIsSubmitting(false);
      return;
    }
    if (!validatePhone(formData.phone)) {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Invalid Mobile Number', body: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).' }
      }));
      setIsSubmitting(false);
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');

    const leadResponse = await LeadService.submitLead({
      formId: 'Cybersecurity Landing Page Form',
      name: formData.name,
      email: formData.email,
      phone: cleanPhone,
      program: 'Cybersecurity & Ethical Hacking',
      qualification: formData.qualification,
      experience: formData.experience,
      careerGoal: formData.goal,
      preferredContactTime: formData.preferredTime,
      remarks: `Contact: ${formData.preferredTime}. Career goal: ${formData.goal}. Experience: ${formData.experience}. Qual: ${formData.qualification}.`
    });

    if (leadResponse.success) {
      // Trigger custom notification
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: {
          subject: 'Lead Captured',
          body: `Hi ${formData.name},\n\nYour application has been logged. Our enrollment advisor will reach out shortly.`
        }
      }));

      // Success
      window.location.href = '/thank-you/cyber-security?program=cyber-security';
      setFormData({
        name: '',
        email: '',
        phone: '',
        qualification: 'Undergraduate Student',
        experience: 'Beginner (No Experience)',
        goal: 'Start a Career in Cybersecurity',
        preferredTime: 'Evening (6 PM - 9 PM)'
      });
    } else {
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: { subject: 'Submission Failed', body: `We encountered an error while submitting your application: ${leadResponse.error || 'Please try again.'}` }
      }));
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  const handleScrollToForm = () => {
    const formEl = document.getElementById('enquiry-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans selection:bg-blue-500 selection:text-white antialiased bg-grid-light">
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
              onClick={handleScrollToForm}
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              APPLY NOW
            </button>
          </div>
        </div>
      </header>

      {/* Trust Badges Banner */}
      <div className="bg-slate-50 border-b border-slate-100 py-3.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-8 md:gap-12 flex-wrap">
          <img src="/assets/startup_india.png" alt="Startup India" className="h-7 opacity-75 grayscale hover:grayscale-0 transition-all duration-300" onError={(e) => { e.target.style.display = 'none'; }} />
          <img src="/assets/msme_registered.png" alt="MSME Registered" className="h-7 opacity-75 grayscale hover:grayscale-0 transition-all duration-300" onError={(e) => { e.target.style.display = 'none'; }} />
          <img src="/assets/iso_certified.png" alt="ISO Certified" className="h-7 opacity-75 grayscale hover:grayscale-0 transition-all duration-300" onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="text-slate-400 font-mono text-[10px] tracking-wider uppercase font-semibold">100% Practical Security Audits</div>
        </div>
      </div>

      {/* Main Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-blue-50/20 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Hero Information Left column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-blue-100/50">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Next Cohort Starts: July 2026</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Master Ethical Hacking & <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Cybersecurity
                </span>
              </h1>
              
              <p className="text-lg text-slate-655 leading-relaxed font-normal">
                Master Kali Linux command consoles, Wireshark packet capture logs, custom firewalls, system penetrations, and security patching under the guidance of certified CEH analysts.
              </p>

              {/* Course Features Highlight List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="flex items-start gap-2.5">
                  <div className="bg-blue-50 text-blue-600 p-1 rounded-lg mt-0.5">
                    <Terminal className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">3 Months Mentor Led</h4>
                    <p className="text-xs text-slate-500">Live troubleshooting labs + CLI instruction calls.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="bg-blue-50 text-blue-600 p-1 rounded-lg mt-0.5">
                    <Shield className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">6+ Practical Audits</h4>
                    <p className="text-xs text-slate-500">OWASP testing, port scans, logging setups.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="bg-blue-50 text-blue-600 p-1 rounded-lg mt-0.5">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Threat Remediation</h4>
                    <p className="text-xs text-slate-500">Writing patch advisories and reporting risks.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="bg-blue-50 text-blue-600 p-1 rounded-lg mt-0.5">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Dual Certification</h4>
                    <p className="text-xs text-slate-500">Course completion + hands-on audit portfolio verify sheets.</p>
                  </div>
                </div>
              </div>

              {/* Social Validation Trust indicators */}
              <div className="flex items-center gap-6 pt-4 border-t border-slate-100 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4.5 h-4.5 fill-current" />)}
                  </div>
                  <span className="text-sm font-bold text-slate-800">4.7 / 5 Rating</span>
                </div>
                <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                <div className="text-sm text-slate-655 font-medium">
                  <strong className="text-slate-900 font-extrabold">950+ Students</strong> enrolled this year
                </div>
              </div>
            </div>

            {/* Sticky Lead Form Right column */}
            <div id="enquiry-form-section" className="lg:col-span-5 bg-white border border-slate-200/85 text-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              <div className="absolute -top-3.5 right-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3.5 rounded-full shadow-md shadow-blue-500/20">
                Admissions Open
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-1">Apply For Cohort</h3>
              <p className="text-xs text-slate-500 mb-6">Enter your details to receive syllabus access, scheduling guidelines, and call advisor support.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                  <label htmlFor="cyber-name" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Full Name</label>
                  <input 
                    id="cyber-name"
                    type="text" 
                    required 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-450"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cyber-email" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Email Address</label>
                    <input 
                      id="cyber-email"
                      type="email" 
                      required 
                      placeholder="name@email.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-450"
                    />
                  </div>
                  <div>
                    <label htmlFor="cyber-phone" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">WhatsApp Phone</label>
                    <input 
                      id="cyber-phone"
                      type="tel" 
                      required 
                      maxLength="10"
                      placeholder="10-digit number" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-450"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cyber-qualification" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Current Qualification</label>
                  <select 
                    id="cyber-qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                  >
                    <option className="bg-white text-slate-900">Undergraduate Student</option>
                    <option className="bg-white text-slate-900">Postgraduate Student</option>
                    <option className="bg-white text-slate-900">Working Professional</option>
                    <option className="bg-white text-slate-900">Fresh Graduate (Job Seeking)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cyber-experience" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Prior Security / CLI Experience</label>
                  <select 
                    id="cyber-experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                  >
                    <option className="bg-white text-slate-900">Beginner (No Experience)</option>
                    <option className="bg-white text-slate-900">Basic Concepts (Some Knowledge)</option>
                    <option className="bg-white text-slate-900">Experienced (Looking to Upskill)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cyber-goal" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Career Goal</label>
                    <select 
                      id="cyber-goal"
                      value={formData.goal}
                      onChange={(e) => setFormData({...formData, goal: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                    >
                      <option className="bg-white text-slate-900">Start a Career in Cybersecurity</option>
                      <option className="bg-white text-slate-900">Transition roles within IT</option>
                      <option className="bg-white text-slate-900">Prepare for CompTIA / CEH Exams</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cyber-preferred-time" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Callback Slot</label>
                    <select 
                      id="cyber-preferred-time"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                    >
                      <option className="bg-white text-slate-900">Morning (10 AM - 1 PM)</option>
                      <option className="bg-white text-slate-900">Afternoon (2 PM - 5 PM)</option>
                      <option className="bg-white text-slate-900">Evening (6 PM - 9 PM)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] mt-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Apply Now & Check Eligibility</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs py-3 px-4 rounded-xl mt-3 text-center font-semibold">
                    🎉 Application submitted successfully! Our advisor will call you shortly.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs py-3 px-4 rounded-xl mt-3 text-center font-semibold">
                    ❌ Invalid 10-digit WhatsApp number. Please check and try again.
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Program Outcomes Section */}
      <section className="py-16 md:py-24 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">What You Will Master</h2>
            <p className="text-sm text-slate-400">Practical scanning diagnostics, vulnerability interceptions, firewall controls, and documentation templates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {OUTCOMES.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-white/8 transition-all duration-300 relative group">
                <div className="absolute top-6 right-6 font-mono text-3xl font-black text-white/5 group-hover:text-blue-500/10 transition-all duration-300">
                  {`0${idx + 1}`}
                </div>
                <div className="bg-blue-500/10 text-blue-400 p-2.5 rounded-xl inline-block mb-4">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Interactive Curriculum Section */}
      <section className="py-16 md:py-24 bg-slate-950 text-white border-b border-slate-900 bg-grid-dark">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
            <span className="text-blue-500 font-extrabold uppercase text-xs tracking-wider font-mono">13 Modules Curriculum</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Step-by-Step Pathway</h2>
            <p className="text-sm text-slate-400">Hands-on virtualization labs and vulnerability audits aligned directly to cybersecurity analyst paths.</p>
          </div>

          {/* Interactive tabs on big screens, grid on smaller screens */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Module Names List Left Column */}
            <div className="lg:col-span-4 space-y-2 max-h-[550px] overflow-y-auto pr-2 border-r border-slate-900 custom-scrollbar">
              {CURRICULUM.map((mod, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveModuleIdx(idx)}
                  className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center justify-between group cursor-pointer ${
                    activeModuleIdx === idx 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' 
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded ${
                      activeModuleIdx === idx ? 'bg-blue-700/60 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {mod.week}
                    </span>
                    <span className="truncate max-w-[180px]">{mod.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    activeModuleIdx === idx ? 'translate-x-1 text-white' : 'text-slate-400 group-hover:translate-x-0.5'
                  }`} />
                </button>
              ))}
            </div>

            {/* Selected Module Details Panel Right Column */}
            <div className="lg:col-span-8 bg-[#0F172A] border border-white/5 rounded-2xl p-6 sm:p-8 min-h-[420px] flex flex-col justify-between">
              <div>
                <span className="text-blue-400 font-mono text-[10px] tracking-wider uppercase font-bold">
                  {CURRICULUM[activeModuleIdx].week} Curriculum Detail
                </span>
                <h3 className="text-xl font-black text-white mt-1 mb-2">
                  {CURRICULUM[activeModuleIdx].title}
                </h3>
                <p className="text-xs text-slate-400 mb-6 italic">
                  {CURRICULUM[activeModuleIdx].subtopic}
                </p>

                <div className="space-y-3.5">
                  <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Key Topics & Labs Covered:</h5>
                  <div className="grid grid-cols-1 gap-3">
                    {CURRICULUM[activeModuleIdx].details.map((topic, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-850">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-slate-300 font-medium leading-relaxed">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Virtual Lab environment & security check checklists provided</span>
                <button 
                  onClick={handleScrollToForm}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 px-5 rounded-lg shadow-md shadow-blue-500/10 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Request Full Syllabus PDF</span>
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Practical Lab Projects Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
            <span className="text-blue-600 font-extrabold uppercase text-xs tracking-wider font-mono">Virtual Security Labs</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Deploy 6 Audit Projects</h2>
            <p className="text-sm text-slate-655">Conduct scans, intercept traffic, modify firewall nodes, and analyze security threats compiled in your professional security portfolio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_PROJECTS.map((proj, idx) => (
              <div key={idx} className="bg-slate-950 text-white border border-slate-800 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-100/10 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[280px]">
                <div>
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {proj.tech.map((tag, tIdx) => (
                      <span key={tIdx} className="bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[9px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-base font-bold text-white mb-2 leading-snug">{proj.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{proj.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-900">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">What you will learn:</div>
                  <div className="text-xs font-semibold text-blue-400 mt-1 italic leading-relaxed">{proj.learn}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Program Reviews / Testimonials Slots */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Student Experience</h2>
            <p className="text-sm text-slate-650">Real reviews and experiences of students upskilled through our structured cybersecurity cohorts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Siddharth M.</h4>
                  <p className="text-[10px] text-slate-550">Security Analyst</p>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
              </div>
              <p className="text-xs text-slate-655 leading-relaxed italic">
                "Highly structured virtual labs and extremely clear explanations of SQL Injection and directory fuzzing. The packet inspection exercises in Wireshark helped me land a job in threat operations."
              </p>
              <div className="text-[10px] font-mono text-slate-400">Date: May 2026</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Karan Malhotra</h4>
                  <p className="text-[10px] text-slate-550">Junior Penetration Tester</p>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
              </div>
              <p className="text-xs text-slate-655 leading-relaxed italic">
                "Learning to intercept HTTP headers with Burp Suite and executing Nmap network footprint scans was very satisfying. The program covers exactly the skills tech companies require."
              </p>
              <div className="text-[10px] font-mono text-slate-400">Date: April 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-650">Have questions? We have answers. If you don't find what you need, submit our call form.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full text-left py-4 px-6 flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="font-bold text-slate-800 text-xs sm:text-sm">{faq.q}</span>
                  {openFaqIdx === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {openFaqIdx === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-650 leading-relaxed border-t border-slate-100 bg-slate-50/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fixed Sticky bottom CTA for Mobile/Tablet */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-xl z-40 lg:hidden flex justify-between items-center gap-4 animate-slide-up">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Certification</div>
            <div className="text-sm font-black text-slate-900">Ethical Hacking & Auditing</div>
          </div>
          <button 
            onClick={handleScrollToForm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 px-6 rounded-lg shadow-md shadow-blue-500/10 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <a 
        href="https://wa.me/919999999999?text=Hi!%20I%20am%20interested%20in%20the%20Cybersecurity%20and%20Ethical%20Hacking%20Program."
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all z-50 flex items-center justify-center"
        aria-label="Contact support on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    </div>
  );
}
