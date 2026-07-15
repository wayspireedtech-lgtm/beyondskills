import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Brain, Code, CheckCircle, ChevronDown, ChevronUp, Sparkles, 
  TrendingUp, Briefcase, Award, Rocket, ArrowRight, BarChart3, 
  Users, BookOpen, Quote, ShieldCheck, Mail, Calendar, HelpCircle, FileText,
  ChevronLeft, ArrowLeft, Download, Maximize2, Minimize2, Laptop, GraduationCap, MapPin, Phone, Globe, Eye, BookOpenCheck
} from 'lucide-react';
import { COURSES } from '../utils/mockDb';
import TechIcon from '../components/TechIcon';

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

const COURSE_METADATA = {
  'artificial-intelligence': {
    datasets: [
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
    ],
    roadmap: [
      { step: 1, role: "Data Analyst & Python Developer", salary: "₹6 - 8 LPA", description: "Write custom scripts to automate pipeline checks, execute SQL commands, clean corporate datasets, and construct clean Matplotlib and Seaborn graphs.", tech: ["Python", "Jupyter", "NumPy", "Pandas", "Matplotlib"] },
      { step: 2, role: "Data Scientist", salary: "₹10 - 15 LPA", description: "Construct advanced statistical predictions, design classification/regression matrix systems, and translate business requirements into feature engineering goals.", tech: ["SciPy", "Statistical Modeling", "Feature Scaling", "Scikit-Learn"] },
      { step: 3, role: "Machine Learning Engineer", salary: "₹12 - 18 LPA", description: "Train complex tree-based CART algorithms, construct ensemble bagging and boosting structures, and deploy predictive metrics pipelines inside production apps.", tech: ["Random Forests", "CART", "Ensemble Models", "XGBoost"] },
      { step: 4, role: "NLP Specialist", salary: "₹15 - 22 LPA", description: "Build custom text models, create tokenization and NER architectures, deploy word embedding structures, and manage semantic search models for document databases.", tech: ["NLTK", "spaCy", "Gensim", "Word Embeddings"] },
      { step: 5, role: "Generative AI Developer", salary: "₹18 - 30+ LPA", description: "Integrate LLM APIs, fine-tune models, implement retrieval-augmented generation (RAG) structures, design custom agents with OpenAI APIs and deploy Hugging Face models.", tech: ["Generative AI", "Hugging Face", "LLMs", "Prompt Engineering", "OpenAI APIs"] }
    ]
  },
  'machine-learning': {
    datasets: [
      {
        label: "ML Platform Market size",
        current: "2024: $32 Billion",
        projected: "2030: $225 Billion",
        growth: 88,
        details: "The market for automated Machine Learning training pipelines is expanding rapidly as corporate decision systems rely on dynamic neural predictions."
      },
      {
        label: "Algorithm Hiring Demands",
        current: "2023 Base Index",
        projected: "2027: +180% Openings",
        growth: 82,
        details: "Top tech hubs report a surge in requirements for specialists who understand CART decision trees, random forests, and bagging/boosting algorithms."
      },
      {
        label: "Enterprise ML Adaptations",
        current: "2021: 15% adoption",
        projected: "2025: 68% adoption",
        growth: 75,
        details: "Over two-thirds of digital platforms now run active ML pipelines to predict user behaviour, customer churn, and load balances."
      }
    ],
    roadmap: [
      { step: 1, role: "Python Script Developer", salary: "₹5 - 7 LPA", description: "Construct utility scripts, clean CSV files, extract raw files, and manage dependencies inside virtual environments.", tech: ["Python", "Anaconda", "Terminal Commands"] },
      { step: 2, role: "Data Preprocessing Specialist", salary: "₹8 - 12 LPA", description: "Analyze outlier arrays, resolve missing data fields, perform feature scaling, and construct normalized statistics indexes.", tech: ["NumPy", "Pandas", "Matplotlib", "Seaborn"] },
      { step: 3, role: "ML Algorithm Modeler", salary: "₹11 - 16 LPA", description: "Train classification models, execute linear and logistic regressions, and evaluate performance logs with MSE metrics.", tech: ["Scikit-Learn", "Regression Analysis", "Evaluation Metrics"] },
      { step: 4, role: "Ensemble Systems Architect", salary: "₹14 - 20 LPA", description: "Deploy CART systems, construct random forest models, implement bagging and boosting architectures, and tune hyperparameters.", tech: ["Random Forests", "CART Models", "XGBoost", "AdaBoost"] },
      { step: 5, role: "MLOps Production Engineer", salary: "₹18 - 28+ LPA", description: "Integrate predictive frameworks into operational APIs, deploy continuous training triggers, and monitor log metrics.", tech: ["MLOps", "Model Deployment", "Flask", "Docker", "API Routing"] }
    ]
  },
  'data-science': {
    datasets: [
      {
        label: "Data Science Platform Market",
        current: "2024: $103 Billion",
        projected: "2030: $322 Billion",
        growth: 86,
        details: "Enterprise investments in Data Science platforms are multiplying as companies transition from simple reporting to predictive modeling."
      },
      {
        label: "BLS Job Forecasts",
        current: "2022 Baseline",
        projected: "2032: +35% Growth",
        growth: 92,
        details: "The US Bureau of Labor Statistics rates Data Science as one of the fastest-growing professional areas, out pacing average tech growth by 3x."
      },
      {
        label: "Corporate Unstructured Logs",
        current: "2020: 30% parsed",
        projected: "2025: 85% parsed",
        growth: 80,
        details: "Organizations are deploying data pipelines to clean, index, and analyze unstructured raw business logs and file directories."
      }
    ],
    roadmap: [
      { step: 1, role: "Relational Data Analyst", salary: "₹5 - 7 LPA", description: "Write structured SQL database queries, design tables, filter data points, and manage custom Excel sheets.", tech: ["SQL Queries", "Excel", "Data Filtering"] },
      { step: 2, role: "Data Engineering Associate", salary: "₹8 - 11 LPA", description: "Clean datasets with Pandas, handle missing values, analyze arrays with NumPy, and script custom data extraction tools.", tech: ["Python", "Jupyter Notebook", "Pandas", "NumPy"] },
      { step: 3, role: "Business Intelligence Modeler", salary: "₹11 - 15 LPA", description: "Build interactive corporate dashboards, manage data connections, implement DAX formulas, and compile visualization reports.", tech: ["Power BI", "Tableau", "DAX Formulas", "Dashboard Design"] },
      { step: 4, role: "Predictive Analytics Modeler", salary: "₹14 - 18 LPA", description: "Train machine learning models, execute regressions, evaluate CART trees, and optimize model predictions.", tech: ["Scikit-Learn", "Machine Learning", "Regression", "Decision Trees"] },
      { step: 5, role: "Lead Data Scientist", salary: "₹18 - 28+ LPA", description: "Formulate end-to-end data products, lead model deployment strategies, and present predictive business solutions to stakeholders.", tech: ["Model Deployment", "Neural Networks", "NLP Basics", "Advanced Analytics"] }
    ]
  },
  'data-analytics': {
    datasets: [
      {
        label: "Business Intelligence Market",
        current: "2024: $28 Billion",
        projected: "2030: $52 Billion",
        growth: 72,
        details: "The global BI market is scaling up as operations convert raw operational logs into real-time visual dashboard feeds."
      },
      {
        label: "Analytics Listings Growth",
        current: "2023 Base",
        projected: "2027: +25% Listings",
        growth: 78,
        details: "Job listings requiring Power BI, SQL databases, and dashboard design have climbed to represent the largest chunk of corporate analyst requirements."
      },
      {
        label: "Executive Dashboard Reliance",
        current: "2021: 50% reliance",
        projected: "2026: 92% reliance",
        growth: 85,
        details: "A massive majority of business managers now depend on automated charts rather than text reports to track corporate operations."
      }
    ],
    roadmap: [
      { step: 1, role: "Junior Report Creator", salary: "₹4 - 6 LPA", description: "Manage basic spreadsheet records, configure filters, perform data lookups, and construct basic charts.", tech: ["Excel Basics", "Google Sheets", "VLOOKUP", "Charts"] },
      { step: 2, role: "Database SQL Query Developer", salary: "₹6 - 9 LPA", description: "Write relational database queries, filter logs, join tables, and manage relational database schemas.", tech: ["SQL Joins", "DB Schema", "Data Extraction"] },
      { step: 3, role: "BI Dashboard Specialist", salary: "₹8 - 12 LPA", description: "Design multi-page interactive dashboards, implement data gateways, and write DAX measures.", tech: ["Power BI", "Tableau", "DAX", "Data Modeling"] },
      { step: 4, role: "Data Analytics Consultant", salary: "₹12 - 16 LPA", description: "Perform exploratory analytics, run statistical checks in Python, and convert telemetry metrics into business goals.", tech: ["Python", "Pandas", "EDA", "Statistical Foundations"] },
      { step: 5, role: "Analytics Operations Lead", salary: "₹16 - 25+ LPA", description: "Direct corporate data reporting architecture, govern pipeline standards, and manage operational dashboard portals.", tech: ["BI Administration", "VPC Gateways", "Enterprise Reporting", "Project Strategy"] }
    ]
  },
  'cyber-security': {
    datasets: [
      {
        label: "Cybersecurity Market Size",
        current: "2024: $190 Billion",
        projected: "2030: $424 Billion",
        growth: 84,
        details: "Expenditure on corporate threat protection is rising exponentially as online infrastructure expands globally."
      },
      {
        label: "Annual Cybercrime Cost",
        current: "2020: $6 Trillion",
        projected: "2025: $10.5 Trillion",
        growth: 92,
        details: "The soaring cost of ransomware attacks and data leaks has forced enterprise teams to heavily recruit penetration testers."
      },
      {
        label: "Cyber Job Openings Gap",
        current: "2022: 2.8 Million",
        projected: "2026: 3.5 Million",
        growth: 89,
        details: "There remains a massive shortage of certified cybersecurity analysts, resulting in high premiums for skilled security professionals."
      }
    ],
    roadmap: [
      { step: 1, role: "Linux System Administrator", salary: "₹5 - 7 LPA", description: "Manage user permissions, configure network interfaces, audit server logs, and script terminal operations.", tech: ["Linux Terminal", "Bash Scripting", "System Permissions"] },
      { step: 2, role: "SOC Security Analyst", salary: "₹8 - 11 LPA", description: "Monitor SIEM consoles, analyze security incidents, audit alert logs, and respond to basic network telemetry threats.", tech: ["SIEM", "SOC Operations", "Wireshark", "Log Audits"] },
      { step: 3, role: "Ethical Hacking Associate", salary: "₹10 - 14 LPA", description: "Execute vulnerability scans, perform reconnaissance, and exploit test environments inside simulated networks.", tech: ["Nmap", "Metasploit", "Kali Linux", "Reconnaissance"] },
      { step: 4, role: "Penetration Tester", salary: "₹14 - 18 LPA", description: "Audit web application code, identify OWASP vulnerabilities, bypass authentications, and draft fix reports.", tech: ["Burp Suite", "OWASP Top 10", "SQLi", "XSS Mitigation"] },
      { step: 5, role: "Cybersecurity Architect", salary: "₹18 - 28+ LPA", description: "Formulate layered threat defense architectures, design secure networks, and govern compliance practices.", tech: ["Security Governance", "Firewall Architecture", "Risk Management"] }
    ]
  },
  'cloud-computing': {
    datasets: [
      {
        label: "Global Cloud Market Size",
        current: "2024: $680 Billion",
        projected: "2030: $1.6 Trillion",
        growth: 88,
        details: "Enterprise cloud hosting allocations are accelerating as servers move from on-premises to AWS/Azure."
      },
      {
        label: "Cloud Postings Growth",
        current: "2022 Baseline",
        projected: "2026: +160% Postings",
        growth: 85,
        details: "Requirements for certified AWS Solutions Architects and Azure Administrators have outpaced classic IT roles."
      },
      {
        label: "Enterprise Migration Rates",
        current: "2020: 72% migrated",
        projected: "2025: 94% migrated",
        growth: 82,
        details: "Virtually all global digital apps now operate on cloud computing nodes using load balancers and auto-scaling."
      }
    ],
    roadmap: [
      { step: 1, role: "Systems Support Engineer", salary: "₹4 - 6 LPA", description: "Configure local network subnets, audit server parameters, and maintain basic operating system resources.", tech: ["Linux", "Networking Basics", "Subnets"] },
      { step: 2, role: "Junior Cloud Administrator", salary: "₹7 - 10 LPA", description: "Provision virtual machines, configure storage buckets, manage user permissions, and establish cost budget monitors.", tech: ["AWS Console", "EC2 Instances", "S3 Storage", "IAM"] },
      { step: 3, role: "Cloud Solutions Architect", salary: "₹10 - 15 LPA", description: "Design multi-tier secure cloud networks, set up auto-scaling rules, and configure public/private subnets inside VPCs.", tech: ["AWS VPC", "Load Balancers", "VPC Routing", "RDS Databases"] },
      { step: 4, role: "Cloud Security Specialist", salary: "₹14 - 20 LPA", description: "Implement data encryption at-rest and in-transit, manage key vaults, configure network security groups, and audit access protocols.", tech: ["Azure Security", "Key Vaults", "NSGs", "IAM Controls"] },
      { step: 5, role: "Enterprise DevOps Engineer", salary: "₹18 - 28+ LPA", description: "Automate cloud resources using deployment templates, manage Kubernetes container orchestration, and establish monitoring pipelines.", tech: ["ARM Templates", "DevOps", "AKS / Kubernetes", "Azure Monitor"] }
    ]
  },
  'hr-mgmt': {
    datasets: [
      {
        label: "Global HR Tech Market",
        current: "2024: $26 Billion",
        projected: "2030: $48 Billion",
        growth: 68,
        details: "Investments in automated recruitment systems, payroll engines, and candidate screeners are rising fast."
      },
      {
        label: "HR Analytics Adoption",
        current: "2021 Baseline",
        projected: "2026: +150% Adoption",
        growth: 72,
        details: "Organizations are seeking talent managers who can build data-driven retention models and calculate KPIs in Excel."
      },
      {
        label: "ATS Filter Implementation",
        current: "2020: 45% use",
        projected: "2025: 78% use",
        growth: 76,
        details: "Over three-quarters of mid-sized companies now pre-screen resumes through ATS keyword filters before human reviews."
      }
    ],
    roadmap: [
      { step: 1, role: "HR Operations Associate", salary: "₹3 - 5 LPA", description: "Draft employee files, organize onboarding records, schedule interviews, and maintain database lists.", tech: ["Excel Basics", "HR Records", "Interview Scheduling"] },
      { step: 2, role: "Talent Sourcing Specialist", salary: "₹5 - 8 LPA", description: "Post job ads, screen candidate profiles, search portals, and calculate initial applicant metrics.", tech: ["ATS Systems", "Job Sourcing", "Screening Criteria"] },
      { step: 3, role: "HR Analyst & Recruiter", salary: "₹8 - 12 LPA", description: "Manage recruitment channels, configure automated screening rules, and analyze employee attrition patterns.", tech: ["HR Analytics", "Candidate Tracking", "Excel Dashboards"] },
      { step: 4, role: "Compensation & Benefits Specialist", salary: "₹12 - 16 LPA", description: "Draft corporate CTC brackets, calculate payroll variables, execute statutory compliance logs, and audit wage systems.", tech: ["Payroll Administration", "Labour Laws", "Compensation Frameworks"] },
      { step: 5, role: "HR Operations Director", salary: "₹16 - 25+ LPA", description: "Govern enterprise people strategy, align recruitment goals with business expansion plans, and lead digital HR transformations.", tech: ["Strategic HRM", "Change Management", "AI in HR Strategy"] }
    ]
  },
  'stock-market': {
    datasets: [
      {
        label: "Retail Demat Accounts",
        current: "2020: 40 Million",
        projected: "2026: 150 Million",
        growth: 90,
        details: "Retail investment participation is experiencing historic volumes, multiplying the demand for research tools."
      },
      {
        label: "Algorithmic Trading Share",
        current: "2019: 35% volume",
        projected: "2025: 65% volume",
        growth: 82,
        details: "A massive share of exchange volumes is now processed programmatically, requiring analysts to understand trend lines."
      },
      {
        label: "Financial Literacy Search Indices",
        current: "2022 Base Value",
        projected: "2026: +120% Interest",
        growth: 78,
        details: "Search trends show a sharp increase in public demand for fundamental analysis and structured trading systems."
      }
    ],
    roadmap: [
      { step: 1, role: "Technical Chart Analyst", salary: "₹4 - 6 LPA", description: "Identify stock market trends, map support and resistance levels, and read basic candlestick chart patterns.", tech: ["Technical Analysis", "Trendlines", "Candlestick Charts"] },
      { step: 2, role: "Research Associate", salary: "₹6 - 9 LPA", description: "Analyze corporate balance sheets, read annual reports, compute EV ratios, and write fundamental stock logs.", tech: ["Fundamental Analysis", "Annual Reports", "Financial Ratios"] },
      { step: 3, role: "Structured System Trader", salary: "₹9 - 14 LPA", description: "Backtest historical trading indicators, calculate win ratios, manage stop-loss boundaries, and execute SL orders.", tech: ["Backtesting Systems", "Excel Sheets", "SL Management"] },
      { step: 4, role: "Portfolio Risk Consultant", salary: "₹14 - 20 LPA", description: "Audit asset allocations, manage position-sizing ratios, hedge equities with options, and configure stop-losses.", tech: ["Risk Management", "Position Sizing", "Portfolio Diversification"] },
      { step: 5, role: "Lead Investment Manager", salary: "₹20 - 30+ LPA", description: "Direct capital portfolios, lead institutional research teams, and formulate market strategy recommendations.", tech: ["Portfolio Management", "SEBI Compliance", "Investment Strategy"] }
    ]
  },
  'full-stack-web': {
    datasets: [
      {
        label: "Web App Market Value",
        current: "2024: $140 Billion",
        projected: "2030: $320 Billion",
        growth: 82,
        details: "The market for cooperative web applications is scaling up as companies transition to headless portals."
      },
      {
        label: "Developer Openings Index",
        current: "2023 Base",
        projected: "2027: +28% Openings",
        growth: 86,
        details: "Active hiring registers consistently cite React, Node.js, and MongoDB as the most requested stack."
      },
      {
        label: "Enterprise App Deployments",
        current: "2021: 40% cloud-native",
        projected: "2025: 80% cloud-native",
        growth: 78,
        details: "Four-fifths of new startup portals deploy directly to edge hosting environments (Vercel, Render) with REST API models."
      }
    ],
    roadmap: [
      { step: 1, role: "Frontend UI Developer", salary: "₹5 - 7 LPA", description: "Code responsive web structures, apply layouts with Tailwind CSS, and build responsive styling frames.", tech: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"] },
      { step: 2, role: "React Application Developer", salary: "₹8 - 12 LPA", description: "Build component SPA architectures, execute hooks, fetch endpoints, and implement client routes.", tech: ["React.js", "React Router", "JSX", "Context API"] },
      { step: 3, role: "Backend REST API Developer", salary: "₹11 - 16 LPA", description: "Construct server systems, set up routes, build custom middleware parameters, and process database requests.", tech: ["Node.js", "Express.js", "MongoDB", "REST APIs"] },
      { step: 4, role: "Security & Operations Architect", salary: "₹15 - 22 LPA", description: "Implement secure password hashing, configure JWT authentication tokens, protect routes, and connect WebSockets.", tech: ["JWT Security", "Bcrypt", "WebSockets", "Socket.io"] },
      { step: 5, role: "Full Stack Lead Engineer", salary: "₹18 - 28+ LPA", description: "Design complete cloud deployments, handle production operations, configure CI/CD pipelines, and manage database servers.", tech: ["Vercel / Render", "MongoDB Atlas", "Server Operations", "Project Architectures"] }
    ]
  },
  'digital-marketing-cert': {
    datasets: [
      {
        label: "Digital Advertising Spend",
        current: "2024: $420 Billion",
        projected: "2030: $680 Billion",
        growth: 78,
        details: "Digital marketing budgets continue to expand as brands shift allocations from TV to Google/Meta search algorithms."
      },
      {
        label: "ROI Tracker Placements",
        current: "2022 Baseline",
        projected: "2026: +140% Openings",
        growth: 82,
        details: "Hiring demands are focused on performance marketers who can set up GA4 pixels and audit lead funnels."
      },
      {
        label: "Enterprise Lead Automation",
        current: "2020: 30% automation",
        projected: "2025: 75% automation",
        growth: 80,
        details: "Businesses are deploying email drips and segmenting CRM lists to automate their sales outreach."
      }
    ],
    roadmap: [
      { step: 1, role: "SEO & Content Analyst", salary: "₹3 - 5 LPA", description: "Execute search keyword research, audit pages, write meta descriptions, and check sitemaps.", tech: ["SEO Basics", "Google Analytics", "Keyword Tools"] },
      { step: 2, role: "Google Search Ads Executive", salary: "₹5 - 8 LPA", description: "Configure search campaign parameters, map keyword target tiers, bid on groups, and write ad copies.", tech: ["Google Ads", "Search Campaigns", "Bidding Tiers"] },
      { step: 3, role: "Performance Marketing Specialist", salary: "₹8 - 12 LPA", description: "Create target audience clusters, deploy Meta pixels, run A/B copy tests, and audit ad conversions.", tech: ["Meta Ads", "Meta Pixel", "Ad Manager", "A/B Testing"] },
      { step: 4, role: "Growth Campaign Automator", salary: "₹12 - 17 LPA", description: "Design landing page funnels, setup email marketing automation triggers, and deploy lead magnets.", tech: ["Email Marketing", "Mailchimp", "CRO Basics", "Drip Automations"] },
      { step: 5, role: "Digital Marketing Director", salary: "₹17 - 25+ LPA", description: "Govern overall customer acquisition strategy, audit ad spend metrics, and manage high-ROI growth plans.", tech: ["GA4 Analytics", "Marketing Analytics", "Attribution Systems"] }
    ]
  }
};

const DEFAULT_METADATA = {
  datasets: [
    {
      label: "Industry Market Growth",
      current: "2024 Base",
      projected: "2030: +150% Expansion",
      growth: 70,
      details: "Top research analysis reports indicating high CAGR expansions across technical corporate platforms."
    },
    {
      label: "Professional Openings",
      current: "2023 base index",
      projected: "2027: +120% Postings",
      growth: 75,
      details: "Requirements for specialists with modern technical credentials have outpaced classic IT roles."
    },
    {
      label: "Enterprise Integrations",
      current: "2021: 40% adoption",
      projected: "2025: 80% adoption",
      growth: 78,
      details: "Over two-thirds of operations use automated technical toolsets to streamline pipelines."
    }
  ],
  roadmap: [
    { step: 1, role: "Entry Level Developer", salary: "₹4 - 6 LPA", description: "Develop script logic, manage basic data tables, and run baseline diagnostic tools.", tech: ["Python", "Jupyter", "SQL Queries"] },
    { step: 2, role: "Junior Specialist", salary: "₹6 - 9 LPA", description: "Perform data styling, resolve missing variables, and manage system operations.", tech: ["Pandas", "NumPy", "Data Preprocessing"] },
    { step: 3, role: "Associate Architect", salary: "₹9 - 14 LPA", description: "Deploy automated modeling pipelines, analyze statistics logs, and design charts.", tech: ["Power BI", "Scikit-Learn", "Model Training"] },
    { step: 4, role: "Senior Engineer", salary: "₹14 - 19 LPA", description: "Audit application parameters, implement secure APIs, and run advanced scripts.", tech: ["Model Deployment", "Advanced APIs", "Security Basics"] },
    { step: 5, role: "Technical Lead", salary: "₹19 - 28+ LPA", description: "Govern project architectural standards, lead technical strategy, and compile dashboard results.", tech: ["System Architectures", "Strategic Governance", "Team Leadership"] }
  ]
};

export default function AiBrochure() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [expandedModules, setExpandedModules] = useState({ 0: true });
  const [activeDatasetIdx, setActiveDatasetIdx] = useState(0);
  
  // Booklet state parameters
  const [isBookletMode, setIsBookletMode] = useState(courseId === 'artificial-intelligence');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const totalPages = 20;

  // Retrieve course content dynamically from the COURSES mock database
  const course = COURSES.find(c => c.id === courseId) || COURSES.find(c => c.id === 'artificial-intelligence');

  // Auto-expand first accordion module when course changes
  useEffect(() => {
    setExpandedModules({ 0: true });
    setActiveDatasetIdx(0);
    setIsBookletMode(courseId === 'artificial-intelligence');
    setCurrentPage(1);
  }, [courseId]);

  // Handle keyboard navigation for booklet mode
  useEffect(() => {
    if (!isBookletMode) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentPage(prev => Math.max(1, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookletMode]);

  if (!course) {
    return (
      <div className="text-slate-900 min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-extrabold mb-2 logo-font">Brochure Not Found</h2>
        <Link to="/courses" className="bg-brand-purple hover:brightness-110 text-white font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all">
          Explore All Courses
        </Link>
      </div>
    );
  }

  // Load custom market datasets and career roadmaps
  const meta = COURSE_METADATA[course.id] || DEFAULT_METADATA;
  const datasetsList = meta.datasets;
  const roadmapList = meta.roadmap;

  const toggleModule = (idx) => {
    setExpandedModules(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleEnrollClick = () => {
    navigate(`/checkout?courseId=${course.id}&mode=mentor-led`);
  };

  const handleDownloadBrochure = () => {
    const link = document.createElement('a');
    link.href = `/brochures/${course.id}.pdf`;
    link.download = `${course.title.replace(/[^a-zA-Z0-9]/g, '_')}_Brochure.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic Theme Styling Variables
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-800';
  const textMuted = isDarkMode ? 'text-slate-300' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-[#1E293B]/40 border-white/5' : 'bg-slate-50 border-slate-200/80';
  const badgeBg = isDarkMode ? 'bg-[#2A4BFF]/20 border-[#2A4BFF]/30 text-[#0EA5E9]' : 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple';

  // Render individual pages for the interactive 20-page booklet
  const renderPageContent = (page) => {
    switch (page) {
      case 1:
        return (
          <div className="flex flex-col justify-between h-full text-center relative overflow-hidden">
            {/* Ambient Background Grid for cover */}
            {isDarkMode && (
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
                backgroundImage: `linear-gradient(to right, #2A4BFF 1px, transparent 1px), linear-gradient(to bottom, #2A4BFF 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>
            )}
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${isDarkMode ? 'bg-[#2A4BFF]/20' : 'bg-[#2A4BFF]/5'}`}></div>
            <div className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${isDarkMode ? 'bg-[#0EA5E9]/15' : 'bg-[#0EA5E9]/5'}`}></div>

            <div className="flex justify-between items-center z-10">
              <span className={`logo-font text-xl font-bold tracking-tight ${textPrimary} flex items-center gap-2`}>
                <Brain className="w-5 h-5 text-[#0EA5E9] animate-pulse" />
                BeyondSkills
              </span>
              <span className={`text-[10px] font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-655 bg-slate-100'}`}>
                Interactive Edition
              </span>
            </div>

            <div className="my-auto space-y-6 z-10">
              <span className={`inline-flex items-center space-x-2 font-mono text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full border uppercase ${badgeBg}`}>
                <Sparkles className="w-4 h-4 text-[#0EA5E9]" />
                <span>Certification Program</span>
              </span>
              <h1 className="logo-font text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-[#0EA5E9] via-brand-purple to-[#2A4BFF] bg-clip-text text-transparent">
                  AI & Data Science
                </span>
              </h1>
              <p className={`text-xs sm:text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed font-mono ${textMuted}`}>
                Learn Python, Data Analytics, Machine Learning & Generative AI in a hands-on production environment.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-200 dark:border-white/10 pt-6 mt-6 z-10">
              {[
                { label: "Duration", value: "3 Months" },
                { label: "Delivery", value: "Live + Recorded" },
                { label: "Hands-on Tasks", value: "10+ Projects" },
                { label: "Placement Support", value: "End-to-End" }
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl backdrop-blur-sm border ${cardBg}`}>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block font-mono">{item.label}</span>
                  <span className="text-xs font-extrabold mt-0.5 text-[#2A4BFF] dark:text-[#0EA5E9] block">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Welcome</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Who We Are</h2>
              <p className={`text-xs sm:text-sm leading-relaxed font-mono text-justify ${textMuted}`}>
                BeyondSkills is an AI-powered Digital Solutions & Professional Upskilling company helping students build practical, industry-ready capabilities.
              </p>
              <p className={`text-xs sm:text-sm leading-relaxed font-mono text-justify ${textMuted}`}>
                We operate a hybrid model: a professional agency deploying software systems globally, and a vocational academy training candidates on matching tech stacks.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
              {[
                { title: "10,000+ Learners", desc: "Trained across domains", icon: Users },
                { title: "250+ Projects", desc: "Built inside simulation", icon: Code },
                { title: "Startup India", desc: "Government recognized", icon: Award },
                { title: "ISO & MSME", desc: "Quality standards certified", icon: ShieldCheck }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={`p-4 rounded-xl flex items-start space-x-3 border ${cardBg}`}>
                    <div className="bg-[#2A4BFF]/20 p-2 rounded-lg text-[#0EA5E9] flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#2A4BFF] dark:text-[#0EA5E9]" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs font-mono ${textPrimary}`}>{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Market Trajectory</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Why AI & Data Science?</h2>
              <p className={`text-xs sm:text-sm leading-relaxed font-mono ${textMuted}`}>
                The global corporate environment is pivoting aggressively toward data parsing and model endpoints. Standard operational pipelines require automation.
              </p>
            </div>

            <div className="space-y-4 my-auto relative z-10">
              {[
                { label: "Enterprise AI Adoption", percent: 85, detail: "Companies replacing static logs with pipeline checks" },
                { label: "AI Developer Job Openings", percent: 92, detail: "Active hiring requirements showing 2.5x growth" },
                { label: "Salary Premium Trajectory", percent: 78, detail: "Higher salaries for engineers managing API models" }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className={textPrimary}>{item.label}</span>
                    <span className="text-[#0EA5E9]">{item.percent}% Increase</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] h-full" style={{ width: `${item.percent}%` }}></div>
                  </div>
                  <p className="text-[9px] text-[#2A4BFF] dark:text-[#0EA5E9] font-mono leading-none">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Key Differentiators</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Why BeyondSkills?</h2>
              <p className={`text-xs sm:text-sm leading-relaxed font-mono ${textMuted}`}>
                Skip obsolete university textbooks. We build your programming foundations using the exact software architectures our development agency deploys for real clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 relative z-10">
              {[
                { title: "Production Workflows", desc: "Work with real CSV logs, clean arrays, and deploy scripts.", icon: Code },
                { title: "Agency Mentorship", desc: "Taught by engineers from EY, Nokia, and Tietoevry.", icon: Users },
                { title: "Verifiable Badges", desc: "Earn secure project credentials verifiable by HR teams.", icon: ShieldCheck },
                { title: "Structured Support", desc: "Technical blocker tickets resolved within daily SLAs.", icon: Rocket }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={`p-3.5 rounded-xl space-y-1 border ${cardBg}`}>
                    <div className="flex items-center space-x-2 text-[#0EA5E9]">
                      <Icon className="w-4 h-4 text-[#2A4BFF] dark:text-[#0EA5E9]" />
                      <h4 className={`font-bold text-xs font-mono uppercase tracking-wide ${textPrimary}`}>{item.title}</h4>
                    </div>
                    <p className={`text-[10px] font-mono leading-normal ${textMuted}`}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Eligibility</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Who Should Join?</h2>
              <p className={`text-xs sm:text-sm leading-relaxed font-mono ${textMuted}`}>
                Whether you want to build custom analytics tools, write deep learning models, or automate executive reporting, this program provides the structural pathways.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-6 relative z-10">
              {[
                { title: "Engineering & CS Students", desc: "Acquire portfolio project builds for tech interviews.", icon: GraduationCap },
                { title: "BCA / BSc / BCom Grads", desc: "Establish verified technical skills to stand out.", icon: Award },
                { title: "MBA & Business Analysts", desc: "Master SQL databases and dashboard modeling.", icon: BarChart3 },
                { title: "Career Switchers", desc: "Transition from non-tech positions into development.", icon: Briefcase }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={`p-3 rounded-xl flex items-center space-x-3 border ${cardBg}`}>
                    <div className="bg-[#2A4BFF]/25 p-2 rounded-lg text-[#0EA5E9] flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#2A4BFF] dark:text-[#0EA5E9]" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs font-mono ${textPrimary}`}>{item.title}</h4>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5 leading-tight">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Key Metrics</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Program Highlights</h2>
              <p className={`text-xs sm:text-sm leading-relaxed font-mono ${textMuted}`}>
                A highly comprehensive, structured path designed to convert beginners into capable pipeline developers.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 relative z-10">
              {[
                { value: "3 Months", label: "Program Duration", desc: "Active cohort tracking" },
                { value: "100+ Hours", label: "Coding & Mentorship", desc: "Live + Recorded sessions" },
                { value: "10+ Projects", label: "Portfolio Tasks", desc: "Git repository builds" },
                { value: "Capstone", label: "Production Project", desc: "Evaluated by managers" },
                { value: "1 Year LMS", label: "Learning Portal Access", desc: "Code templates & videos" }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl text-center flex flex-col justify-between border ${cardBg}`}>
                  <span className="text-sm font-extrabold text-[#2A4BFF] dark:text-[#0EA5E9] block font-mono">{item.value}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider block font-mono mt-1 ${textPrimary}`}>{item.label}</span>
                  <span className="text-[8px] text-slate-450 dark:text-slate-405 font-mono mt-0.5 block">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Syllabus Flow</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Learning Roadmap</h2>
              <p className={`text-[11px] font-mono ${textMuted}`}>
                Progress systematically from initial scripting to training machine learning algorithms and deploying Generative AI models.
              </p>
            </div>

            <div className="my-auto grid grid-cols-2 md:grid-cols-5 gap-3.5 relative z-10 pt-4">
              {[
                { step: "01", name: "Python Basics", detail: "Syntax & file logic" },
                { step: "02", name: "Data Wrangling", detail: "NumPy & Pandas" },
                { step: "03", name: "BI & SQL", detail: "Database queries" },
                { step: "04", name: "Machine Learning", detail: "Classification/Regression" },
                { step: "05", name: "Generative AI", detail: "LLMs & Hugging Face" }
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl text-center relative flex flex-col justify-between border ${cardBg}`}>
                  <div className="absolute top-2 left-2 text-[#0EA5E9] text-[9px] font-mono font-bold">{item.step}</div>
                  <h4 className={`font-extrabold text-xs font-mono uppercase tracking-wide mt-4 ${textPrimary}`}>{item.name}</h4>
                  <p className="text-[9px] text-slate-400 font-mono mt-1 leading-tight">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="text-center bg-[#2A4BFF]/10 border border-[#2A4BFF]/20 text-[#2A4BFF] dark:text-[#0EA5E9] rounded-xl p-3 relative z-10 mt-4 text-[10px] font-mono">
              🚀 Final Capstone Project: Integrate your custom LLM chat agent with live telemetry logs.
            </div>
          </div>
        );

      case 8:
        return (
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Module 1</span>
                <span className="text-[10px] font-mono text-slate-400">Weeks 1-2 • Python Internals & Architecture</span>
              </div>
              <h2 className={`logo-font text-2xl font-bold ${textPrimary}`}>Python Fundamentals & Basic Structures</h2>
              <p className={`text-xs font-mono leading-relaxed ${textMuted}`}>
                Establish professional programming habits, configure terminal workspaces, and master control logic.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto pt-2">
              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">1. Setup & Environment</h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Installation and setup of Anaconda environment</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Jupyter Notebook modern usage practices</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Essential shortcuts and productivity tips in Jupyter Notebook</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Understanding Python data types with real-world applications</span></li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">2. Structures & File Logic</h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Variable naming best practices (PEP 8 standards)</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Lists, Tuples, Sets, and Dictionaries with practical use cases</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Introduction to files and directories in modern dev environments</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>File I/O and context managers (with Statement)</span></li>
                </ul>
              </div>

              <div className={`p-3.5 rounded-xl border ${cardBg} md:col-span-2 flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-brand-purple" />
                  <div>
                    <h4 className={`font-bold text-xs font-mono uppercase ${textPrimary}`}>3. CLI & Loops Control Flow</h4>
                    <p className="text-[9px] text-slate-400 font-mono">Looping constructs (for/while loops), conditional statements (if/elif/else), and terminal navigation.</p>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#2A4BFF] dark:text-[#0EA5E9] bg-[#2A4BFF]/10 px-2 py-0.5 rounded border border-[#2A4BFF]/20">Active coding</span>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Module 2</span>
                <span className="text-[10px] font-mono text-slate-400">Weeks 3-5 • Data Analysis & Visualization</span>
              </div>
              <h2 className={`logo-font text-2xl font-bold ${textPrimary}`}>Scientific Libraries & EDA</h2>
              <p className={`text-xs font-mono leading-relaxed ${textMuted}`}>
                Clean messy data tables, formulate array calculations, and design presentation-ready telemetry charts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto pt-2">
              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">1. NumPy Computation</h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Introduction to machine learning scientific libraries</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>NumPy hands-on implementation & array operations</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Matrix transformations and array vector calculations</span></li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">2. Pandas Wrangling & Visuals</h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Pandas: real-world data analysis and cleaning</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Data transformation, grouping, and merging datasets</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Exploratory analysis (EDA) using Matplotlib</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Seaborn visualization for advanced insights</span></li>
                </ul>
              </div>

              <div className={`p-3.5 rounded-xl border ${cardBg} md:col-span-2 flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-purple" />
                  <div>
                    <h4 className={`font-bold text-xs font-mono uppercase ${textPrimary}`}>3. Concept Strengthening & Doubt resolution</h4>
                    <p className="text-[9px] text-slate-400 font-mono">Dedicated interactive discussion sessions to resolve course-related queries and reinforce core logic.</p>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#2A4BFF] dark:text-[#0EA5E9] bg-[#2A4BFF]/10 px-2 py-0.5 rounded border border-[#2A4BFF]/20">Active Q&A</span>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Module 3</span>
                <span className="text-[10px] font-mono text-slate-400">Weeks 6-7 • Relational SQL & Linear Modeling</span>
              </div>
              <h2 className={`logo-font text-2xl font-bold ${textPrimary}`}>SQL Databases & Statistical Modeling</h2>
              <p className={`text-xs font-mono leading-relaxed ${textMuted}`}>
                Manage data schemas, write SQL queries, analyze statistics, and establish supervised regression pipelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto pt-2">
              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">1. Databases & SQL</h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Excel: dashboard visual layouts and calculations</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>SQL Joins, data aggregations, and query writing</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Relational database design & schema connections</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Power BI: DAX queries & model charts</span></li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">2. Stats & Machine Learning</h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Statistical thinking: central tendencies & dispersion</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>IQR statistics & dispersion calculations</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Supervised & unsupervised model fine-tuning</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Linear & Logistic Regression concept checks</span></li>
                </ul>
              </div>

              <div className={`p-3.5 rounded-xl border ${cardBg} md:col-span-2 flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-purple" />
                  <div>
                    <h4 className={`font-bold text-xs font-mono uppercase ${textPrimary}`}>3. Regression Evaluations & Predictions</h4>
                    <p className="text-[9px] text-slate-400 font-mono">Hands-on practice mapping regression performance, evaluating metrics, and auditing classifications.</p>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#2A4BFF] dark:text-[#0EA5E9] bg-[#2A4BFF]/10 px-2 py-0.5 rounded border border-[#2A4BFF]/20">Theory + Code</span>
              </div>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Module 4</span>
                <span className="text-[10px] font-mono text-slate-400">Weeks 8-10 • Data Processing & Ensembles</span>
              </div>
              <h2 className={`logo-font text-2xl font-bold ${textPrimary}`}>Data Preprocessing & Tree Models</h2>
              <p className={`text-xs font-mono leading-relaxed ${textMuted}`}>
                Standardize data inputs, manage outlier offsets, configure decision trees, and explore neural structures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto pt-2">
              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">1. Data Standardization</h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Standardization, normalization, scaling</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Outlier detection and missing value treatment</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Feature scaling and selection techniques</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Introduction to data preprocessing techniques</span></li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">2. Trees & Deep Learning</h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Decision Trees: CART concepts & algorithms</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Bagging, Boosting, and Random Forest methods</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Neural Networks: activation parameters & layers</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Fundamentals of Deep Learning models</span></li>
                </ul>
              </div>

              <div className={`p-3.5 rounded-xl border ${cardBg} md:col-span-2 flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-brand-purple" />
                  <div>
                    <h4 className={`font-bold text-xs font-mono uppercase ${textPrimary}`}>3. Capstone Real-world Implementation</h4>
                    <p className="text-[9px] text-slate-400 font-mono">Utilize Data Science libraries to execute data analysis, visualization, model building, and data extraction.</p>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#2A4BFF] dark:text-[#0EA5E9] bg-[#2A4BFF]/10 px-2 py-0.5 rounded border border-[#2A4BFF]/20">Production Build</span>
              </div>
            </div>
          </div>
        );

      case 12:
        return (
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Module 5</span>
                <span className="text-[10px] font-mono text-slate-400">Weeks 11-12 • Text Intelligence & API Pipelines</span>
              </div>
              <h2 className={`logo-font text-2xl font-bold ${textPrimary}`}>NLP & Generative AI Specialization</h2>
              <p className={`text-xs font-mono leading-relaxed ${textMuted}`}>
                Construct text tokenizers, execute entity extractions (NER), download transformer pipelines, and invoke API agents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto pt-2">
              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">1. Natural Language Processing</h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>NLTK text parsing, tokenization, linguistics</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>spaCy: Named Entity Recognition (NER) & apps</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Gensim topic modeling & semantic analysis</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>FastText: word representations & Deep Learning NLP</span></li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">2. Generative AI & LLMs</h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Hugging Face ecosystem & pre-trained transformers</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Working of GenAI: GANs, VAEs, and LLMs</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Overview of DALL-E, ChatGPT, and Gemini APIs</span></li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" /> <span>Prompt Engineering & building custom agents</span></li>
                </ul>
              </div>

              <div className={`p-3.5 rounded-xl border ${cardBg} md:col-span-2 flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-brand-purple animate-pulse" />
                  <div>
                    <h4 className={`font-bold text-xs font-mono uppercase ${textPrimary}`}>3. Real-World AI Applications</h4>
                    <p className="text-[9px] text-slate-400 font-mono">Apply GenAI models to content generation, workflow automations, and RAG support portals.</p>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#2A4BFF] dark:text-[#0EA5E9] bg-[#2A4BFF]/10 px-2 py-0.5 rounded border border-[#2A4BFF]/20">Future Ready</span>
              </div>
            </div>
          </div>
        );

      case 13:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Practice</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Featured Projects</h2>
              <p className={`text-xs font-mono ${textMuted}`}>
                Construct actual deployable portfolios representing real corporate telemetry situations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-auto relative z-10 pt-2">
              {[
                { title: "Netflix Recommendation", desc: "Build filtering models suggesting titles based on historical records.", tech: "Python, ML" },
                { title: "Customer Churn Predictor", desc: "Deploy Random Forest structures predicting subscriber churn.", tech: "Scikit-Learn" },
                { title: "AI Custom Support Agent", desc: "Design chat engines parsing custom text directories dynamically.", tech: "OpenAI API, RAG" },
                { title: "NLP Resume ATS Matcher", desc: "Audit keywords on applicant PDF sheets against description logs.", tech: "spaCy, NLTK" }
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl flex flex-col justify-between border ${cardBg}`}>
                  <div>
                    <h4 className={`font-bold text-white text-xs font-mono uppercase tracking-wide leading-tight ${textPrimary}`}>{item.title}</h4>
                    <p className="text-[9px] text-slate-400 font-mono mt-1 leading-snug">{item.desc}</p>
                  </div>
                  <span className="text-[8px] font-mono text-[#2A4BFF] dark:text-[#0EA5E9] bg-[#2A4BFF]/10 px-2 py-0.5 rounded border border-[#2A4BFF]/20 w-fit mt-2">
                    {item.tech}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 14:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Technologies</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Tools Covered</h2>
              <p className={`text-xs font-mono ${textMuted}`}>
                Gain hands-on proficiency in the standard developer ecosystems required by global engineering operations.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-auto relative z-10">
              {[
                "python", "sql", "pandas", "numpy", "scikit-learn", "tensorflow", "react", "node.js"
              ].map((tool, idx) => (
                <div key={idx} className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 hover:bg-white/10 transition-colors border ${cardBg}`}>
                  <TechIcon name={tool} className="w-8 h-8" />
                  <span className={`text-[8px] font-mono font-bold uppercase tracking-wider block text-center truncate w-full ${textPrimary}`}>{tool}</span>
                </div>
              ))}
            </div>
            
            <div className="text-[10px] font-mono text-slate-450 dark:text-slate-400 text-center border-t border-slate-200 dark:border-white/10 pt-4">
              Plus: Jupyter Notebooks, Hugging Face Transformers, Git Version Control, OpenAI API tokens
            </div>
          </div>
        );

      case 15:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Career Acceleration</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Career Support Suite</h2>
              <p className={`text-xs font-mono ${textMuted}`}>
                We dedicate support bandwidth to ensuring your portfolio projects translate to candidate interviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto relative z-10">
              {[
                { title: "ATS Resume Tuning", desc: "Format profiles to bypass operational filters and target keywords.", tag: "Resume Reviews" },
                { title: "LinkedIn Brand Optimization", desc: "Write walkthrough articles explaining your code logic.", tag: "Branding" },
                { title: "Mock Technical Assessments", desc: "Solve Python algorithms under pressure with mock examiners.", tag: "Technical Prep" },
                { title: "Placement Placement Loop", desc: "Share verified profiles directly with partner agencies.", tag: "Referral Tracks" }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl space-y-1.5 flex flex-col justify-between border ${cardBg}`}>
                  <h4 className={`font-extrabold text-xs font-mono uppercase tracking-wide leading-tight ${textPrimary}`}>{item.title}</h4>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 font-mono mt-0.5 leading-snug">{item.desc}</p>
                  <span className="text-[8px] font-mono text-[#2A4BFF] dark:text-[#0EA5E9] uppercase font-bold tracking-wider">{item.tag}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 16:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Pathways</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Learning Pathways</h2>
              <p className={`text-xs font-mono ${textMuted}`}>
                Choose the program enrollment pathway that matches your learning schedule.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto relative z-10 pt-4">
              <div className={`p-5 rounded-xl flex flex-col justify-between border ${cardBg}`}>
                <div>
                  <span className="text-[#0EA5E9] font-mono text-[9px] font-bold uppercase tracking-wider block">Recorded Track</span>
                  <h4 className={`font-extrabold text-sm font-mono mt-1 ${textPrimary}`}>Essential Track</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-2 leading-relaxed">
                    Access our full database library of pre-recorded lectures and download templates to learn independently.
                  </p>
                </div>
                <div className="border-t border-white/10 pt-3 mt-4 text-[9px] font-mono text-slate-400">
                  Includes certification and code support.
                </div>
              </div>

              <div className="bg-[#2A4BFF]/10 border border-[#2A4BFF]/30 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[#0EA5E9] font-mono text-[9px] font-bold uppercase tracking-wider block">Live Cohort Track</span>
                  <h4 className="font-extrabold text-white text-sm font-mono mt-1">Professional Track</h4>
                  <p className="text-[10px] text-slate-350 dark:text-slate-300 mt-2 leading-relaxed">
                    Participate in weekend cohort workshops directed by EY/Nokia engineers. Backed by Slack support SLA channels.
                  </p>
                </div>
                <div className="border-t border-[#2A4BFF]/30 pt-3 mt-4 text-[9px] font-mono text-[#0EA5E9] font-bold">
                  Includes mock reviews & resume analysis.
                </div>
              </div>
            </div>
          </div>
        );

      case 17:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Faculty</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Industry Mentors</h2>
              <p className={`text-xs font-mono ${textMuted}`}>
                Classes are designed and directed by active developers carrying extensive software production histories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto relative z-10 pt-4">
              {[
                { name: "Saurav Kumar Sinha", role: "Tietoevry | Ex-Nokia, Xiaomi, LnT, Capgemini", exp: "8+ Years", details: "Directs neural network setups and software architectures." },
                { name: "Vinod Kumar Eslavath", role: "Assistant Manager - Data Scientist at Shemaroo", exp: "5+ Years", details: "Guides preprocessing, scientific libraries, and ML modeling." }
              ].map((mentor, idx) => (
                <div key={idx} className={`p-5 rounded-xl flex flex-col justify-between border ${cardBg}`}>
                  <div className="space-y-2">
                    <span className="text-[9px] text-[#0EA5E9] font-mono font-bold uppercase tracking-wider bg-[#2A4BFF]/25 px-2 py-0.5 rounded border border-[#2A4BFF]/30 w-fit block">{mentor.exp} Exp</span>
                    <h4 className={`font-extrabold text-xs font-mono uppercase tracking-wide mt-1 ${textPrimary}`}>{mentor.name}</h4>
                    <p className="text-[9px] text-slate-400 font-mono leading-none">{mentor.role}</p>
                  </div>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 font-mono mt-3 leading-relaxed border-t border-slate-200 dark:border-white/5 pt-2">{mentor.details}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 18:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Reviews</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Student Success</h2>
              <p className={`text-xs font-mono ${textMuted}`}>
                Hear from candidates who successfully completed domain certification and project tasks.
              </p>
            </div>

            <div className={`p-6 rounded-xl my-auto relative z-10 border ${cardBg}`}>
              <Quote className="w-10 h-10 text-[#0EA5E9]/10 absolute top-4 left-4 pointer-events-none" />
              <div className="relative z-10 pl-6 space-y-4">
                <p className={`text-xs italic leading-relaxed font-mono ${textPrimary}`}>
                  "I've successfully finished my AI course. A big thank you to my mentors for their continuous support. This journey has enriched my skills and provided clarity on my career path."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-6 bg-[#2A4BFF] rounded-full"></div>
                  <div>
                    <h5 className={`text-[10px] font-bold uppercase tracking-wider font-mono ${textPrimary}`}>Manshi Srivastav</h5>
                    <span className="text-[9px] text-slate-400 font-mono block">AI & Data Science Student</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] font-mono text-[#2A4BFF] dark:text-[#0EA5E9] bg-[#2A4BFF]/10 border border-[#2A4BFF]/20 rounded-lg p-2.5">
              🏆 Verified credentials: Project completions issue cryptographic badges links directly for HR checks.
            </div>
          </div>
        );

      case 19:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Compliance</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Trust & Accreditation</h2>
              <p className={`text-xs font-mono ${textMuted}`}>
                BeyondSkills is registered with national quality standardization agencies and entrepreneurship panels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto relative z-10">
              {[
                { title: "Startup India", detail: "Government-registered digital skills platform.", badge: "Recognized Entity" },
                { title: "ISO Certified", detail: "Certified systems for learning delivery & curriculum.", badge: "ISO 9001:2015" },
                { title: "MSME Registered", detail: "Recognized operational upskilling organization.", badge: "Government of India" }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl flex flex-col justify-between text-center border ${cardBg}`}>
                  <h4 className={`font-extrabold text-xs font-mono uppercase tracking-wide leading-tight ${textPrimary}`}>{item.title}</h4>
                  <p className="text-[9px] text-slate-450 dark:text-slate-400 font-mono mt-1 leading-snug">{item.detail}</p>
                  <span className="text-[8px] font-mono text-[#2A4BFF] dark:text-[#0EA5E9] mt-3 font-bold block">{item.badge}</span>
                </div>
              ))}
            </div>

            <div className="text-center text-[10px] font-mono text-slate-450 dark:text-slate-400">
              Certificates carry unique tracking hashes to prevent credential forging.
            </div>
          </div>
        );

      case 20:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#2A4BFF]/10 rounded-full blur-2xl"></div>

            <div className="space-y-4 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Admissions</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Start Your Journey</h2>
              <p className={`text-xs font-mono ${textMuted}`}>
                Secure your slot in our upcoming training cohort. Reach out to admissions handlers to resolve query blockers.
              </p>
            </div>

            <div className="my-auto space-y-4 relative z-10 pt-4 max-w-sm mx-auto w-full">
              <a href="https://www.beyondskills.in" target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-3 p-3.5 rounded-xl transition-colors border ${cardBg}`}>
                <Globe className="w-5 h-5 text-[#2A4BFF] dark:text-[#0EA5E9]" />
                <div>
                  <span className="text-[9px] text-slate-400 font-mono block">Website</span>
                  <span className={`text-xs font-mono font-bold ${textPrimary}`}>www.beyondskills.in</span>
                </div>
              </a>

              <a href="tel:+918130927999" className={`flex items-center space-x-3 p-3.5 rounded-xl transition-colors border ${cardBg}`}>
                <Phone className="w-5 h-5 text-[#2A4BFF] dark:text-[#0EA5E9]" />
                <div>
                  <span className="text-[9px] text-slate-400 font-mono block">Hotline</span>
                  <span className={`text-xs font-mono font-bold ${textPrimary}`}>+91 81309 27999</span>
                </div>
              </a>

              <a href="mailto:admissions@wayspire.in" className={`flex items-center space-x-3 p-3.5 rounded-xl transition-colors border ${cardBg}`}>
                <Mail className="w-5 h-5 text-[#2A4BFF] dark:text-[#0EA5E9]" />
                <div>
                  <span className="text-[9px] text-slate-400 font-mono block">Admissions Email</span>
                  <span className={`text-xs font-mono font-bold ${textPrimary}`}>admissions@wayspire.in</span>
                </div>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-4 border-t border-slate-200 dark:border-white/10 justify-between items-center z-10">
              <button 
                onClick={handleEnrollClick}
                className="w-full sm:w-auto bg-[#2A4BFF] hover:brightness-110 text-white font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer text-center font-mono"
              >
                Enroll Now
              </button>
              <span className="text-[9px] text-slate-450 dark:text-slate-400 font-mono">
                BeyondSkills © 2026. All rights reserved.
              </span>
            </div>
          </div>
        );

      default:
        return <div>Page Not Found</div>;
    }
  };

  // Outer solid background to cover any parent layout spill gaps
  const pageBgClass = isBookletMode && course.id === 'artificial-intelligence'
    ? (isDarkMode ? 'bg-[#020412] text-white' : 'bg-slate-50 text-slate-900')
    : 'bg-transparent text-slate-900';

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${pageBgClass}`}>
      {/* Background spotlights to layer with the global interactive grid */}
      {isDarkMode && (
        <>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
          <div className="absolute top-[1200px] left-[-300px] w-[600px] h-[600px] bg-brand-cyan/8 rounded-full blur-[140px] pointer-events-none z-0"></div>
        </>
      )}
      
      {/* Conditionally Render Booklet/PDF Reader or Standard Scrolling Web View */}
      {isBookletMode && course.id === 'artificial-intelligence' ? (
        <div className="relative z-10 pt-6 pb-16 px-4 max-w-6xl mx-auto flex flex-col justify-between min-h-screen">
          {/* Header Controls Bar */}
          <div className={`flex flex-wrap items-center justify-between gap-4 border p-4 rounded-2xl backdrop-blur-md mb-6 ${
            isDarkMode ? 'bg-slate-950/85 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
          }`}>
            <div className="flex items-center space-x-3">
              <Link
                to={`/course/${course.id}`}
                className="text-slate-400 hover:text-brand-purple mr-2 flex items-center gap-1 font-mono text-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <span className="logo-font text-lg font-bold tracking-tight flex items-center gap-1.5">
                <Brain className="w-5 h-5 text-[#2A4BFF] dark:text-[#0EA5E9]" />
                BeyondSkills
              </span>
              <span className="hidden sm:inline-block w-1.5 h-6 bg-brand-purple rounded-full"></span>
              <span className="hidden sm:inline-block text-xs font-mono font-bold text-slate-400 dark:text-slate-300">
                AI & DS Booklet
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              {/* Dropdown to jump directly to sections */}
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className={`border font-mono text-xs px-3 py-1.5 rounded-lg outline-none ${
                  isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-550 border-slate-200 text-slate-800'
                }`}
              >
                <option value={1}>Page 1: Cover</option>
                <option value={2}>Page 2: Who We Are</option>
                <option value={3}>Page 3: Why AI/DS</option>
                <option value={4}>Page 4: Why BeyondSkills</option>
                <option value={5}>Page 5: Eligibility</option>
                <option value={6}>Page 6: Highlights</option>
                <option value={7}>Page 7: Roadmap</option>
                <option value={8}>Page 8: Module 1 (Python Setup)</option>
                <option value={9}>Page 9: Module 2 (EDA & NumPy)</option>
                <option value={10}>Page 10: Module 3 (SQL & Stats)</option>
                <option value={11}>Page 11: Module 4 (CART & ML)</option>
                <option value={12}>Page 12: Module 5 (GenAI & NLP)</option>
                <option value={13}>Page 13: Portfolio Projects</option>
                <option value={14}>Page 14: Tools Covered</option>
                <option value={15}>Page 15: Career Suite</option>
                <option value={16}>Page 16: Learning Pathways</option>
                <option value={17}>Page 17: Industry Faculty</option>
                <option value={18}>Page 18: Success & Reviews</option>
                <option value={19}>Page 19: Accreditations</option>
                <option value={20}>Page 20: Contact Admissions</option>
              </select>

              {/* Theme Toggle Button */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`border text-xs font-mono px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/10 text-white hover:bg-white/15' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80'
                }`}
                title="Toggle Theme"
              >
                {isDarkMode ? <span>☀️ Light</span> : <span>🌙 Dark</span>}
              </button>

              {/* Toggle to change view back to scrolling landing page */}
              <button
                onClick={() => setIsBookletMode(false)}
                className={`border text-xs font-mono px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/10 text-white hover:bg-white/15' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80'
                }`}
                title="Switch to Scrolling Web Mode"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Scroll View</span>
              </button>

              {/* Download Brochure */}
              <button
                onClick={handleDownloadBrochure}
                className="bg-[#2A4BFF] hover:brightness-110 text-white font-mono text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Download PDF Brochure"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Download PDF</span>
              </button>
            </div>
          </div>

          {/* Centered Booklet Canvas Layout */}
          <div className="flex-grow flex items-center justify-center relative my-4">
            
            {/* Previous Page Floating Button Overlay */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`absolute left-0 md:-left-6 z-20 w-10 h-10 md:w-12 md:h-12 border rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl transition-all cursor-pointer hover:scale-105 disabled:opacity-30 disabled:pointer-events-none ${
                isDarkMode ? 'bg-slate-950/80 border-white/10 text-white hover:border-brand-cyan/50' : 'bg-white/95 border-slate-200 text-slate-800 hover:border-brand-purple/50'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Page Slide Box */}
            <div className={`w-full md:max-w-4xl md:h-[600px] md:aspect-[1.414] p-6 md:p-10 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
              isDarkMode 
                ? 'bg-slate-900 border-white/10 text-white shadow-[0_20px_50px_rgba(42,75,255,0.15)]' 
                : 'bg-white border-slate-200/80 text-slate-800 shadow-[0_20px_40px_rgba(15,23,42,0.06)]'
            }`}>
              {renderPageContent(currentPage)}
            </div>

            {/* Next Page Floating Button Overlay */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`absolute right-0 md:-right-6 z-20 w-10 h-10 md:w-12 md:h-12 border rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl transition-all cursor-pointer hover:scale-105 disabled:opacity-30 disabled:pointer-events-none ${
                isDarkMode ? 'bg-slate-950/80 border-white/10 text-white hover:border-brand-cyan/50' : 'bg-white/95 border-slate-250 text-slate-800 hover:border-brand-purple/50'
              }`}
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Pagination & Progress Controls */}
          <div className={`flex flex-col items-center space-y-3.5 mt-6 border p-4 rounded-2xl backdrop-blur-sm ${
            isDarkMode ? 'bg-slate-950/40 border-white/5 text-white' : 'bg-white/80 border-slate-200 text-slate-800 shadow-sm'
          }`}>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-slate-400 hover:text-brand-purple font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                Previous
              </button>
              <span className={`font-mono text-xs font-bold border px-3 py-1 rounded-lg ${
                isDarkMode ? 'bg-[#2A4BFF]/20 border-[#2A4BFF]/30 text-white' : 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple'
              }`}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="text-slate-400 hover:text-brand-purple font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
            
            {/* Completion Progress Bar */}
            <div className="w-full max-w-md bg-slate-200 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] h-full transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              ></div>
            </div>

            <div className="text-[10px] font-mono text-slate-450 dark:text-slate-400">
              💡 Hint: You can use your keyboard's <kbd className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 py-0.5 rounded border border-slate-200 dark:border-white/10 font-bold">Left</kbd> and <kbd className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 py-0.5 rounded border border-slate-200 dark:border-white/10 font-bold">Right</kbd> arrow keys to turn pages.
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* View Mode Panel for Web Mode */}
          {course.id === 'artificial-intelligence' && (
            <div className="relative z-20 max-w-6xl mx-auto px-4 mt-6">
              <div className="bg-slate-950/80 border border-white/10 p-3 rounded-xl flex items-center justify-between text-white backdrop-blur-sm">
                <span className="text-xs font-mono font-bold text-[#0EA5E9] flex items-center gap-1.5">
                  <BookOpenCheck className="w-4 h-4" />
                  Try booklet/PDF reader mode for this course
                </span>
                <button
                  onClick={() => setIsBookletMode(true)}
                  className="bg-[#2A4BFF] hover:brightness-110 text-white font-mono text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Switch to Booklet Mode</span>
                </button>
              </div>
            </div>
          )}

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
                  Master <span className="bg-gradient-to-r from-[#0EA5E9] to-[#2A4BFF] bg-clip-text text-transparent">{course.title}</span>
                </h1>
                
                <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed font-mono">
                  {course.overview}
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
                  { label: "Duration", value: course.duration },
                  { label: "Delivery Mode", value: course.delivery },
                  { label: "Hands-on projects", value: course.mentorLedProjects },
                  { label: "Rating & Badges", value: `${course.rating} ★ (verifiable)` }
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
                  { title: "Production Workflows", desc: "Skip academic toy tasks. Clean actual raw datasets, handle real CSV files, and deploy developer architectures.", icon: Code },
                  { title: "Verifiable Badges", desc: "Recipients gain secure cryptographic badges linked to their projects, proving verification directly to HR teams.", icon: Award },
                  { title: "End-to-End Support", desc: "From technical setup issues to resume construction reviews, our mentors resolve blocks within daily SLAs.", icon: ShieldCheck }
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

          {/* 3. Why Learn Section & Dataset Dashboard */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#040824]/90 border-t border-b border-slate-900 z-10 relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <span className="text-[#0EA5E9] text-xs font-bold uppercase tracking-wider font-mono">Market Intel & Datasets</span>
                <h2 className="logo-font text-3xl font-bold text-white">Why You Must Master {course.title}</h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
                  We compile recent dataset reports demonstrating the massive demand trajectory for {course.techStack ? course.techStack.slice(0, 3).join(', ') : 'modern'} skillsets.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Dataset Navigation Cards */}
                <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                  {datasetsList.map((data, idx) => (
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
                      {datasetsList[activeDatasetIdx].label}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light font-mono">
                      {datasetsList[activeDatasetIdx].details}
                    </p>
                    
                    <div className="border-t border-white/10 pt-6 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Current Index</span>
                        <span className="text-sm font-bold text-slate-200">{datasetsList[activeDatasetIdx].current}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Projected Capacity</span>
                        <span className="text-sm font-bold text-[#0EA5E9]">{datasetsList[activeDatasetIdx].projected}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 mt-8 flex items-center space-x-3 text-xs text-slate-300">
                    <Rocket className="w-5 h-5 text-[#2A4BFF] flex-shrink-0 animate-bounce" />
                    <p className="font-mono">Learn these exact tools to stay ahead of corporate workflow automation shifts.</p>
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
              <p className="text-xs sm:text-sm text-slate-550 leading-relaxed font-mono">
                See the pathways open to you as you progress through the modules. Hover over each step to see salary levels and required tools.
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
                {roadmapList.map((step, idx) => {
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
                    <span className="text-[10px] text-slate-350 dark:text-slate-300 font-mono font-bold uppercase tracking-wider">{company}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. Detailed Week-by-Week Curriculum */}
          <section id="curriculum" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative scroll-mt-20">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <span className="text-[#2A4BFF] text-xs font-bold uppercase tracking-wider font-mono">Detailed Syllabus</span>
              <h2 className="logo-font text-3xl font-bold text-slate-900">Curriculum Breakdown ({course.curriculum.length} Modules)</h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-mono">
                Click on each module below to view the complete topic list and learn how each subtopic ties to production pipelines.
              </p>
            </div>

            {/* Accordions (Premium Dark Theme boxes) */}
            <div className="space-y-3.5">
              {course.curriculum.map((module, idx) => {
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
                          Module {idx + 1}
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
                        <p className="text-[10px] text-slate-450 dark:text-slate-400 font-mono uppercase tracking-wider font-bold">Topics Covered</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {module.topics.map((topic, tIdx) => (
                            <li key={tIdx} className="flex items-start space-x-2 text-xs leading-relaxed font-light font-mono text-slate-300">
                              <CheckCircle className="w-4.5 h-4.5 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
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
                  We believe in building. You will complete dynamic industry project builds during the program duration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {course.projects.map((proj, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#0A0E35]/95 border border-[#2A4BFF]/20 p-6 rounded-2xl flex flex-col justify-between hover:border-[#2A4BFF]/45 hover:shadow-xl transition-all duration-300 group text-white"
                  >
                    <div>
                      <div className="bg-[#2A4BFF]/20 text-[#0EA5E9] border border-[#2A4BFF]/30 px-2 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-widest w-fit mb-4">
                        Project 0{idx + 1}
                      </div>
                      <h4 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wide font-mono mb-2 group-hover:text-[#0EA5E9] transition-colors">{proj.title}</h4>
                      <p className="text-[11px] text-slate-350 dark:text-slate-300 leading-relaxed font-light mb-6 font-mono">{proj.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
                      {proj.techUsed && proj.techUsed.map((t, tIdx) => (
                        <span key={tIdx} className="text-[8px] font-bold text-slate-200 bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono">
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
                  Acquiring hard technical competencies represents only 70% of candidate value. We dedicate weekly slots to building your personal brand and communication confidence.
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
                    <p className="text-[11px] text-slate-350 dark:text-slate-300 leading-relaxed mb-4 font-mono">{suite.desc}</p>
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
                <div className="mt-4 flex items-center justify-center space-x-2 text-[10px] text-slate-450 dark:text-slate-400 font-mono">
                  <Mail className="w-3.5 h-3.5 text-[#2A4BFF]" />
                  <span>Contact: admissions@wayspire.in / support@beyondskills.co</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
