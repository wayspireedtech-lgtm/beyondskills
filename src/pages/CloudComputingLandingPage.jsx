import React, { useState, useEffect } from 'react';
import { 
  Cloud, Database, Award, Users, CheckCircle, ArrowRight, Check, 
  ChevronRight, Calendar, Sparkles, Phone, Mail, Globe, Star, Briefcase, Zap, 
  HelpCircle, ChevronDown, ChevronUp, Download, MessageCircle, Layout, 
  Search, ShieldCheck, TrendingUp, RefreshCw, Send, FileText, Link as LinkIcon,
  Server, Cpu, Network, Activity, Layers, Lock
} from 'lucide-react';
import { getDbItem, setDbItem } from '../utils/dbHelpers';

const OUTCOMES = [
  { title: "Provision AWS & Azure Servers", desc: "Spin up, configure, and manage high-performance compute instances (EC2 / VMs) and scalable server storage." },
  { title: "Design Custom VPC Networks", desc: "Create secure Virtual Private Clouds (VPC) with granular control over public/private subnets, routes, and security filters." },
  { title: "Deploy Load Balancers & Scaling", desc: "Configure Application Load Balancers and Auto Scaling groups to build resilient architectures that handle heavy spikes." },
  { title: "Configure SQL & NoSQL DBs", desc: "Deploy managed relational databases (RDS/Azure SQL) and low-latency, globally distributed database engines like Cosmos DB." },
  { title: "Manage IAM & Resource Security", desc: "Secure cloud assets using standard Identity & Access Management policies, network security groups, and encryption keys." }
];

const CURRICULUM = [
  {
    week: "Module 1",
    title: "Introduction to Cloud Computing: Concepts, Service Models, and Modern Use Cases",
    subtopic: "Introduction to Cloud Computing: Concepts, Service Models (IaaS, PaaS, SaaS), and Modern Use Cases",
    details: [
      "Introduction to Cloud Computing: Concepts, Service Models (IaaS, PaaS, SaaS), and Modern Use Cases"
    ]
  },
  {
    week: "Module 2",
    title: "Cloud Fundamentals: Core Concepts, Service Models, and Use Cases",
    subtopic: "Introduction to Cloud Computing: What It Is and Why It Matters in Modern Technology",
    details: [
      "Introduction to Cloud Computing: What It Is and Why It Matters in Modern Technology",
      "Key Benefits of Cloud Computing: Scalability, Cost Efficiency, Flexibility, Security, and High Availability"
    ]
  },
  {
    week: "Module 3",
    title: "Dedicated Doubt-Clearing and Interactive Discussion Sessions",
    subtopic: "Dedicated sessions will be conducted to address course-related doubts and encourage discussions",
    details: [
      "Dedicated sessions will be conducted to address course-related doubts and encourage discussions"
    ]
  },
  {
    week: "Module 4",
    title: "Cloud Fundamentals (Advanced Concepts and Practical Understanding)",
    subtopic: "Cloud Computing Models: Service Models (IaaS, PaaS, SaaS) and Deployment Models",
    details: [
      "Cloud Computing Models: Service Models (IaaS, PaaS, SaaS) and Deployment Models (Public, Private, Hybrid, Multi-Cloud)"
    ]
  },
  {
    week: "Module 5",
    title: "Microsoft Azure Fundamentals: Overview of Azure Services and Architecture",
    subtopic: "Introduction to Microsoft Azure: Overview and Core Capabilities",
    details: [
      "Introduction to Microsoft Azure: Overview and Core Capabilities",
      "Exploring Azure Services: Service Tour and Practical Use Cases",
      "Managing Azure Subscriptions: Setup, Configuration, and Access Control"
    ]
  },
  {
    week: "Module 6",
    title: "Azure Networking: Virtual Networks, Subnets, and Connectivity",
    subtopic: "Virtual Networks (VNet) in Azure: Concepts, Configuration, and Best Practices",
    details: [
      "Understanding Azure VPN: Purpose, Use Cases, and Hands-On Implementation",
      "Introduction to Azure Regions: Geographic Distribution and Availability Zones",
      "Virtual Networks (VNet) in Azure: Concepts, Configuration, and Best Practices"
    ]
  },
  {
    week: "Module 7",
    title: "Regular Doubt-Clearing and Support Sessions",
    subtopic: "Regular sessions will be held to resolve course-related doubts and encourage discussions",
    details: [
      "Regular sessions will be held to resolve course-related doubts and facilitate interactive discussions."
    ]
  },
  {
    week: "Module 8",
    title: "Azure Networking (Advanced Configuration and Security)",
    subtopic: "Implementing N-Tier Architecture in Azure: Design and Best Practices",
    details: [
      "Implementing N-Tier Architecture in Azure: Design and Best Practices",
      "Network Security Groups (NSGs): Configuration and Access Control",
      "Azure Load Balancer: Traffic Distribution and High Availability",
      "Ensuring Availability and High Availability in Azure Environments",
      "Azure Application Gateway: Web Traffic Management and Security",
      "Azure DNS: Domain Management and Name Resolution",
      "Azure Traffic Manager: Global Traffic Routing and Performance Optimization"
    ]
  },
  {
    week: "Module 9",
    title: "Azure Compute Services: Virtual Machines, App Services, and Containers",
    subtopic: "Virtual Machines and Containers in Azure: Deployment and Management",
    details: [
      "Virtual Machines and Containers in Azure: Deployment and Management",
      "Azure App Service: Hosting Web Apps and APIs",
      "Serverless Computing in Azure: Functions and Event-Driven Architectures",
      "Scaling Virtual Machines in Azure: Autoscaling and Load Management",
      "Scaling Availability Sets for High Availability and Fault Tolerance",
      "Virtual Machine Types and Sizes: Choosing the Right Compute Resources",
      "Azure Kubernetes Service (AKS): Container Orchestration and Management",
      "Advanced Azure App Services: Deployment, Scaling, and Monitoring"
    ]
  },
  {
    week: "Module 10",
    title: "Azure Storage: Types of Data (Structured, Unstructured) and Storage Solutions",
    subtopic: "Overview of Azure Storage: Architecture, Capabilities, and Use Cases",
    details: [
      "Overview of Azure Storage: Architecture, Capabilities, and Use Cases",
      "Types of Azure Storage: Blob, File, Queue, Disk, and Data Lake Storage",
      "Azure SQL Database: Managed Relational Database Services",
      "Azure Cosmos DB: Globally Distributed, Multi-Model Database",
      "Azure Blob Storage: Object Storage for Unstructured Data",
      "Azure Data Lake Storage: Big Data Storage and Analytics",
      "Azure Files: Managed File Shares for Cloud Applications",
      "Azure Queue Storage: Messaging and Asynchronous Workflows",
      "Disk Storage and Storage Tiers: Standard, Premium, and Ultra Disk Options",
      "Storage Security: Encryption, Replication, and Access Management",
      "Azure Storage Explorer: Managing and Monitoring Storage Accounts",
      "Comparison of Azure Storage vs. On-Premises Storage Solutions",
      "Hands-On Labs: Working with Blob and File Storage in Azure"
    ]
  },
  {
    week: "Module 11",
    title: "Azure Security: Layered Security Approach and Best Practices",
    subtopic: "Cloud Security Usage Scenarios: Practical Applications and Best Practices",
    details: [
      "Cloud Security Usage Scenarios: Practical Applications and Best Practices",
      "Identity and Access Management (IAM): Authentication, Authorization, and Role-Based Access Control",
      "Data Encryption: At-Rest, In-Transit, and Key Management",
      "Managing Azure Certificates: Secure Communication and SSL/TLS Implementation",
      "Network Protection: Securing Virtual Networks and Traffic Flow",
      "Protecting Shared Documents and Data in Azure",
      "Azure Advanced Threat Protection (ATP): Detecting, Preventing, and Responding to Security Threats"
    ]
  },
  {
    week: "Module 12",
    title: "Azure Machine Learning, Cost Optimization, & Backup Services",
    subtopic: "Setting Up Monitoring with Azure Service Health",
    details: [
      "Setting Up Monitoring with Azure Service Health: Alerts, Insights, and Issue Management",
      "Implementing Azure Policy: Enforcing Organizational Standards and Compliance",
      "Defining IT Compliance Using Azure Policy for Governance",
      "Organizing Policies with Initiatives for Streamlined Management",
      "Enterprise Governance in Azure: Best Practices and Frameworks",
      "Defining Standardized Resources Using Azure Blueprints",
      "Monitoring and Ensuring Service Compliance with Azure Compliance Manager"
    ]
  },
  {
    week: "Module 13",
    title: "Azure Backup and Recovery Solutions & ARM Templates",
    subtopic: "Azure Key Vault: Securely Manage Secrets, Keys, and Certificates",
    details: [
      "Azure Key Vault: Securely Manage Secrets, Keys, and Certificates",
      "Scheduling and Automating Backups for Azure Virtual Machines (VMs)",
      "Configuring Disaster Recovery (DR) Solutions in Azure",
      "Cost Management and Optimization: Monitoring Spending and Reducing Cloud Expenses"
    ]
  },
  {
    week: "Module 14",
    title: "Project Discussion, Career Guidance, and Course Doubt Resolution",
    subtopic: "Project Overview and Requirements Analysis: Planning and Execution Strategy",
    details: [
      "Project Overview and Requirements Analysis: Planning and Execution Strategy",
      "Project Review, Feedback, and Iterative Improvement Sessions",
      "Continuous Doubt Resolution and Mentorship Support",
      "Concept Revision, Interactive Q&A, and Knowledge Reinforcement",
      "Industry Use Cases and Real-World Application Discussions",
      "Career Opportunities and Emerging Roles in Data Science",
      "Job Roles, Career Pathways, and Professional Growth Strategies",
      "Key Skills, Tools, and Competencies for Industry Readiness"
    ]
  }
];

const SAMPLE_PROJECTS = [
  {
    title: "Multi-Tier VPC Architecture",
    desc: "Design and deploy a secure virtual network containing public and private subnets, routing tables, and internet gateway rules on the cloud.",
    tech: ["AWS VPC", "Route Tables", "Internet Gateways"],
    learn: "Segregating public-facing web servers from backend databases."
  },
  {
    title: "High-Availability Auto Scaling Pool",
    desc: "Configure an auto-scaling compute cluster behind an elastic load balancer to dynamically handle traffic spikes and hardware failures.",
    tech: ["AWS EC2", "Elastic Load Balancing", "Auto Scaling Group"],
    learn: "Establishing health check triggers and horizontal CPU-based scaling rules."
  },
  {
    title: "Serverless Event-Driven API Pipeline",
    desc: "Host a microservice backend using serverless API gateways and database triggers without provisioned VM costs.",
    tech: ["AWS Lambda / Functions", "API Gateway", "NoSQL / DynamoDB"],
    learn: "Event triggers, compute runtime configurations, and low-latency database queries."
  },
  {
    title: "Secure Object Storage & IAM Governance",
    desc: "Create object storage repositories with restricted user group access policies, lifecycle expiration rules, and backup syncs.",
    tech: ["AWS S3 / Azure Blobs", "IAM Policies", "Replication Vaults"],
    learn: "Granular folder permissions, bucket policies, and cross-region backups."
  },
  {
    title: "Kubernetes Microservices Deployment",
    desc: "Dockerize a multi-service application and deploy it on a managed Kubernetes cluster with volume shares and network load balancers.",
    tech: ["Kubernetes (EKS/AKS)", "Docker Containers", "YAML configs"],
    learn: "Container scheduling, port mapping, cluster storage, and service routing."
  },
  {
    title: "Enterprise Key Vault & Encryption",
    desc: "Deploy a secret manager hub to store database strings, encrypt storage buckets, and rotate TLS domain certificates.",
    tech: ["AWS KMS / Key Vault", "TLS Certificates", "Encryption-at-Rest"],
    learn: "Rotational secrets policy, credential encryption, and token access filters."
  }
];

const FAQS = [
  { q: "Who is this Cloud Computing certification program for?", a: "This program is designed for college students, fresh IT graduates, system administrators, web developers, and technical professionals looking to build practical expertise in cloud infrastructure design, DevOps pipelines, and solutions architecture." },
  { q: "Which cloud providers are covered in this course?", a: "The course provides extensive hands-on training primarily on Amazon Web Services (AWS) and Microsoft Azure, covering key compute, storage, security, and database services." },
  { q: "Do I need programming experience to join?", a: "No prior programming experience is required. We start with basic networking and operating system concepts before moving to console-based provisioning, basic scripting, and cloud automation." },
  { q: "How are classes conducted?", a: "All live interactive mentor sessions are conducted online, mostly scheduled in the evening for convenience. High-definition recordings, lab checklists, and mentor support forums are accessible 24/7." },
  { q: "Will I receive cloud platform credits for labs?", a: "We guide you step-by-step through setting up AWS Free Tier and Azure Trial accounts, allowing you to build and run all your labs for free within free-tier limits." },
  { q: "What tools and platforms will I learn?", a: "You will master AWS EC2, S3, RDS, IAM, VPC, Auto Scaling, Load Balancers, Azure Portal, VM Configurations, App Services, AKS (Kubernetes), Docker, and Key Vault Security." },
  { q: "Will my projects be reviewed by industry architects?", a: "Yes. Expert cloud solutions architects review your deployment architectures, VPC subnet plans, and security configurations, providing agency-grade feedback." },
  { q: "Will I receive a certificate of completion?", a: "Yes. Upon completing all training modules, project assignments, and passing the cloud deployment assessment, you will be issued your certification." },
  { q: "What is the duration of this program?", a: "The program spans 2 months, offering structured weekly modules to ensure comprehensive concept coverage." },
  { q: "How do I submit my application?", a: "Simply fill out the lead capture form on this page with your credentials. Our program advisors will contact you to explain details and complete enrollment." }
];

export default function CloudComputingLandingPage() {
  // SEO tags setup on mount
  useEffect(() => {
    document.title = "Cloud Computing & AWS Solutions Architect Program | BeyondSkills";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Master AWS, Azure, virtualization, server scaling, databases, and DevOps automation. Deploy live multi-tier architectures with BeyondSkills.");
    }

    // Add Schema Markup
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Cloud Computing & AWS Solutions Architect Program",
      "description": "Master AWS, Azure, virtualization, server scaling, databases, and DevOps automation. Deploy live multi-tier architectures.",
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
    goal: 'Start a Career in Cloud & DevOps',
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

    // Form validation
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // Parse URL campaigns
    const queryParams = new URLSearchParams(window.location.search);
    const campaign = queryParams.get('utm_campaign') || 'Cloud Computing Paid Campaign';
    const source = queryParams.get('utm_source') || 'Direct Ads';
    const medium = queryParams.get('utm_medium') || 'CPC';
    const content = queryParams.get('utm_content') || 'Landing Page';

    const newLead = {
      id: `LD${String(Date.now()).slice(-4)}${Math.floor(Math.random() * 100)}`,
      name: formData.name,
      email: formData.email,
      phone: cleanPhone,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: 'Ads Leads',
      program: 'cloud-computing',
      assignedBDM: '',
      assignedBDA: '',
      status: 'New',
      subStatus: 'QUALIFIED',
      profession: formData.experience,
      qualification: formData.qualification,
      careerGoal: formData.goal,
      preferredContactTime: formData.preferredTime,
      campaign: campaign,
      source: source,
      utmMedium: medium,
      utmCampaign: campaign,
      utmContent: content,
      remarks: `Contact: ${formData.preferredTime}. Career goal: ${formData.goal}. Experience: ${formData.experience}. Qual: ${formData.qualification}.`,
      callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
      history: []
    };

    try {
      // Save to localStorage DB so CRM is updated
      const currentLeads = getDbItem('beyondskills_leads', []);
      setDbItem('beyondskills_leads', [newLead, ...currentLeads]);

      // Attempt to hit CRM live sync endpoint if available
      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : window.location.origin;

      await fetch(`${apiHost}/api/webhook/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      }).catch(() => console.log("Realtime webhook offline, saved locally."));

      // Trigger custom notification
      window.dispatchEvent(new CustomEvent('beyondskills_toast', {
        detail: {
          subject: 'Lead Captured',
          body: `Hi ${formData.name},\n\nYour application has been logged. Our enrollment advisor will reach out shortly.`
        }
      }));

      // Success
      window.location.href = '/thank-you';
      setFormData({
        name: '',
        email: '',
        phone: '',
        qualification: 'Undergraduate Student',
        experience: 'Beginner (No Experience)',
        goal: 'Start a Career in Cloud & DevOps',
        preferredTime: 'Evening (6 PM - 9 PM)'
      });
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="text-slate-400 font-mono text-[10px] tracking-wider uppercase font-semibold">100% Industry Aligned Curriculum</div>
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
                Become an AWS & Azure <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Solutions Architect
                </span>
              </h1>
              
              <p className="text-lg text-slate-655 leading-relaxed font-normal">
                Master core virtualization, network design, resource groups, serverless databases, Kubernetes pods, and storage structures under the live guidance of senior AWS solutions engineers.
              </p>

              {/* Course Features Highlight List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="flex items-start gap-2.5">
                  <div className="bg-blue-50 text-blue-600 p-1 rounded-lg mt-0.5">
                    <Server className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">2 Months Mentor Led</h4>
                    <p className="text-xs text-slate-500">Live weekly sessions + dashboard troubleshooting labs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="bg-blue-50 text-blue-600 p-1 rounded-lg mt-0.5">
                    <Network className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Industrial Practical Projects</h4>
                    <p className="text-xs text-slate-500">VPC routing, elastic load scaling, Docker builds.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="bg-blue-50 text-blue-600 p-1 rounded-lg mt-0.5">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Security & IAM Filters</h4>
                    <p className="text-xs text-slate-500">Key Vaults, user rules, certificates configuration.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="bg-blue-50 text-blue-600 p-1 rounded-lg mt-0.5">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Dual Certification</h4>
                    <p className="text-xs text-slate-500">Course completion + project deploy verify sheets.</p>
                  </div>
                </div>
              </div>

              {/* Social Validation Trust indicators */}
              <div className="flex items-center gap-6 pt-4 border-t border-slate-100 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4.5 h-4.5 fill-current" />)}
                  </div>
                  <span className="text-sm font-bold text-slate-800">4.8 / 5 Rating</span>
                </div>
                <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                <div className="text-sm text-slate-655 font-medium">
                  <strong className="text-slate-900 font-extrabold">1,400+ Students</strong> enrolled this year
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
                  <label htmlFor="cloud-name" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Full Name</label>
                  <input 
                    id="cloud-name"
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
                    <label htmlFor="cloud-email" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Email Address</label>
                    <input 
                      id="cloud-email"
                      type="email" 
                      required 
                      placeholder="name@gmail.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-450"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cloud-phone" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">WhatsApp Phone</label>
                    <input 
                      id="cloud-phone"
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
                  <label htmlFor="cloud-qualification" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Current Qualification</label>
                  <select 
                    id="cloud-qualification"
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
                  <label htmlFor="cloud-experience" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Prior Cloud / Systems Experience</label>
                  <select 
                    id="cloud-experience"
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
                    <label htmlFor="cloud-goal" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Career Goal</label>
                    <select 
                      id="cloud-goal"
                      value={formData.goal}
                      onChange={(e) => setFormData({...formData, goal: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                    >
                      <option className="bg-white text-slate-900">Start a Career in Cloud & DevOps</option>
                      <option className="bg-white text-slate-900">Transition roles within IT</option>
                      <option className="bg-white text-slate-900">Prepare for AWS/Azure Certificates</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cloud-preferred-time" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Callback Slot</label>
                    <select 
                      id="cloud-preferred-time"
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
            <p className="text-sm text-slate-400">Core system administration, container routing, and cloud scaling skills expected by modern tech startups.</p>
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
            <span className="text-blue-500 font-extrabold uppercase text-xs tracking-wider font-mono">14 Modules Curriculum</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Step-by-Step Pathway</h2>
            <p className="text-sm text-slate-400">A comprehensive hands-on curriculum mapped directly to AWS & Azure Certification requirements.</p>
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
                <span className="text-[10px] font-mono text-slate-500 uppercase">Interactive Lab environment & console guides provided</span>
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
            <span className="text-blue-600 font-extrabold uppercase text-xs tracking-wider font-mono">Hands-on Cloud Experience</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Deploy Industrial based Projects</h2>
            <p className="text-sm text-slate-650">Master real console steps, command scripts, and architectures compiled in your professional deploy sheet portfolio.</p>
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
      <section className="py-16 md:py-24 bg-slate-950 text-white border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Student Experience</h2>
            <p className="text-sm text-slate-400">Real reviews and experiences of students upskilled through our structured cloud cohorts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">Nisha K.</h4>
                  <p className="text-[10px] text-slate-400">Cloud Support Associate</p>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Clear, step-by-step AWS console walkthroughs. Got my cloud routing, security groups, and object bucket concepts completely clear. The mentorship calls are extremely valuable."
              </p>
              <div className="text-[10px] font-mono text-slate-500">Date: June 2026</div>
            </div>

            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">Vikram Aditya</h4>
                  <p className="text-[10px] text-slate-400">Infrastructure Engineer</p>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "We set up secure multi-tier VPC networks and auto scaling clusters. Building the Kubernetes container pipeline gave me hands-on confidence to apply for cloud engineer roles."
              </p>
              <div className="text-[10px] font-mono text-slate-500">Date: May 2026</div>
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
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cloud Certification</div>
            <div className="text-sm font-black text-slate-900">AWS & Azure Architecture</div>
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
        href="https://wa.me/919999999999?text=Hi!%20I%20am%20interested%20in%20the%20Cloud%20Computing%20and%20AWS%20Solutions%20Architect%20Program."
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
