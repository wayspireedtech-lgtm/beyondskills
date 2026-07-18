import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Brain, Code, CheckCircle, ChevronDown, ChevronUp, Sparkles, 
  TrendingUp, Briefcase, Award, Rocket, ArrowRight, BarChart3, 
  Users, BookOpen, Quote, ShieldCheck, Mail, Calendar, HelpCircle, FileText,
  ChevronLeft, ArrowLeft, Download, Maximize2, Minimize2, Laptop, GraduationCap, MapPin, Phone, Globe, Eye, BookOpenCheck,
  Clock, RefreshCw, ShieldAlert, Check
} from 'lucide-react';
import { COURSES, getDbItem, setDbItem } from '../utils/mockDb';
import { saveLeadToSupabase } from '../utils/supabaseClient';
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
        details: "Expenditure on threat protection is rising exponentially as online infrastructure expands globally."
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
        label: "Performance Marketing Roles",
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

const BOOKLET_COURSES = ['artificial-intelligence', 'data-science', 'data-analytics', 'hr-mgmt', 'cyber-security', 'machine-learning', 'cloud-computing', 'stock-market', 'digital-marketing-cert', 'full-stack-web'];

const curriculumCategories = {
  field1: {
    title: "Python, Libraries & EDA",
    description: "Learn to write clean, PEP-8 compliant scripts, automate data cleanup, and present telemetry metrics.",
    items: [
      { name: "Python Setup & Conda", desc: "Manage packages, compile custom scripts, configure terminal workspaces, and install dependencies." },
      { name: "NumPy & Pandas", desc: "Formulate array vectors, clean missing logs, filter rows, merge CSV directories, and parse unstructured JSON data." },
      { name: "Data Visualization", desc: "Design publication-ready charts using Matplotlib, compile correlation grids, and map heatplots with Seaborn." }
    ]
  },
  field2: {
    title: "SQL & Relational Datasets",
    description: "Master structured querying, schema modeling, relational indexing, and BI dashboard design.",
    items: [
      { name: "SQL Query Writing", desc: "Write database statements, apply joins, aggregate data groups, and extract tables with subqueries." },
      { name: "Power BI & Tableau", desc: "Connect databases, model schema relations, write DAX calculations, and compile dashboard layouts." },
      { name: "Excel Advanced Logs", desc: "Leverage lookup arrays, configure Pivot reports, write formulas, and clean data tables." }
    ]
  },
  field3: {
    title: "Core Machine Learning",
    description: "Train predictive systems using Scikit-Learn. Master regressions, CART decision trees, and ensemble boosting models.",
    items: [
      { name: "Supervised Modeling", desc: "Execute Linear and Logistic regressions, compute accuracy matrices, and evaluate ROC curves." },
      { name: "CART Decision Trees", desc: "Construct decision nodes, tune min-sample leaves, prevent overfitting, and visualize paths." },
      { name: "Ensemble Algorithms", desc: "Deploy Random Forests, execute bagging logic, tune XGBoost ensembles, and train AdaBoost systems." }
    ]
  },
  field4: {
    title: "NLP & Generative AI",
    description: "Build semantic search indices, write custom text classifiers, and integrate LLM prompt architectures.",
    items: [
      { name: "Text Preprocessing", desc: "Tokenize strings, filter stop-words, execute lemmatization, and compute TF-IDF matrices." },
      { name: "Word Vector Semantics", desc: "Deploy spaCy embeddings, train custom word vectors, and perform nearest-neighbor queries." },
      { name: "Generative AI APIs", desc: "Integrate LLM API endpoints, design RAG semantic systems, write system prompts, and host models on Hugging Face." }
    ]
  }
};

const roadmapSteps = [
  { name: "Python Essentials", desc: "Conda configuration, terminal commands, basic loops, error handling, lists/dict parsing, and git repo creation." },
  { name: "Array Calculations", desc: "NumPy matrix arrays, vector arithmetic, mathematical transformations, indexing, and memory allocation." },
  { name: "Data Cleaning", desc: "Pandas dataframe structures, loading messy CSVs, resolving null columns, indexing datetimes, and grouping logs." },
  { name: "Telemetry Plotting", desc: "Matplotlib visual grids, customizing chart axes, plotting histograms, and seaborn correlation heatmaps." },
  { name: "Database Queries", desc: "SQL table creation, primary keys, relational mapping, inner/left joins, group aggregations, and BI dashboards." },
  { name: "Statistical Modeling", desc: "Mean/median central dispersion, standard dev analysis, outliers detection, IQR limits, and correlation indices." },
  { name: "Supervised ML", desc: "Linear/Logistic regression models, train/test split partitions, MSE loss curves, and classification reports." },
  { name: "Decision Trees", desc: "CART algorithms, random forest baggers, boosting estimators, XGBoost tuning, and hyperparameter grids." },
  { name: "NLP & LLM Systems", desc: "Text tokenizers, spaCy word vectors, Hugging Face transformers, OpenAI completion APIs, and RAG document search." }
];

const careerOutcomes = [
  { title: "Junior Data Scientist", desc: "Clean corporate datasets, train validation partitions, evaluate model performance, and present predictive insights to stakeholders." },
  { title: "Machine Learning Engineer", desc: "Deploy trained neural classifiers to API endpoints, configure MLOps pipelines, and build feature engineering models." },
  { title: "Business Intelligence Analyst", desc: "Query relational databases with SQL, build Power BI dashboards, and automate Excel log reporting." },
  { title: "Data Analyst", desc: "Clean CSV inputs, perform exploratory data analysis, and present telemetry results to management." },
  { title: "Generative AI Integrator", desc: "Configure Retrieval-Augmented Generation (RAG) structures, manage vector databases, and integrate LLM APIs." },
  { title: "Python Utility Developer", desc: "Script backend automation tools, handle local file directories, and schedule cron pipelines." }
];

const faqItems = [
  { q: "Is prior coding experience required?", a: "No. This program is structured to support beginners. We start with basic Conda setups, and progress step-by-step to advanced machine learning and Generative AI modules." },
  { q: "What hardware do I need?", a: "A standard laptop with at least 4GB RAM is sufficient. For training heavy models, we guide you through utilizing free cloud platforms like Google Colab and Kaggle Kernels." },
  { q: "Do you offer placement support?", a: "No, we do not offer job placement guarantees. However, we provide project reviews, GitHub profile alignment, and practical learning resources to help you showcase your skills to recruiters." },
  { q: "Are the projects verifiable?", a: "Yes. All capstone projects are pushed to your personal GitHub repository, providing concrete proof of your coding and implementation skills to hiring teams." }
];

export default function AiBrochure() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [expandedModules, setExpandedModules] = useState({ 0: true });
  const [activeDatasetIdx, setActiveDatasetIdx] = useState(0);

  // Interactive premium SaaS sandbox states
  const [modelType, setModelType] = useState('nlp');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [isTrained, setIsTrained] = useState(false);
  const [testInput, setTestInput] = useState("I absolutely love this AI program, it changed my career!");
  const [testResult, setTestResult] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCurriculumTab, setSelectedCurriculumTab] = useState('field1');
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    status: 'Undergraduate Student',
    message: ''
  });
  const [enquiryStatus, setEnquiryStatus] = useState(null);

  const startSandboxTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setIsTrained(false);
    setTestResult(null);
    setTrainingLogs([
      "Initializing environment variables...",
      "Allocating CUDA device gpu:0...",
      "Epoch 1/5 - loss: 0.6931 - accuracy: 0.5012",
      "Epoch 2/5 - loss: 0.4502 - accuracy: 0.7891",
      "Epoch 3/5 - loss: 0.2104 - accuracy: 0.9125",
      "Epoch 4/5 - loss: 0.0984 - accuracy: 0.9654",
      "Epoch 5/5 - loss: 0.0432 - accuracy: 0.9912",
      "Model training complete. Verifying test accuracy..."
    ]);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setTrainingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsTraining(false);
        setIsTrained(true);
      }
    }, 400);
  };

  const runInference = () => {
    if (modelType === 'nlp') {
      const lower = testInput.toLowerCase();
      if (lower.includes('good') || lower.includes('love') || lower.includes('great') || lower.includes('excellent') || lower.includes('happy') || lower.includes('like')) {
        setTestResult({ class: 'POSITIVE', score: '99.4% confidence', action: 'Route to Testimonial Queue' });
      } else if (lower.includes('bad') || lower.includes('hate') || lower.includes('slow') || lower.includes('poor') || lower.includes('error') || lower.includes('sad')) {
        setTestResult({ class: 'NEGATIVE', score: '98.7% confidence', action: 'Escalate to Customer Support' });
      } else {
        setTestResult({ class: 'NEUTRAL', score: '76.2% confidence', action: 'Standard Response Queue' });
      }
    } else {
      setTestResult({ class: 'RETENTION_CONFIRMED', score: '95.1% probability', action: 'Apply discount coupon code' });
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();

    const courseTitle = course ? course.title : 'Program Specialist';
    const courseSlug = course ? course.id : 'artificial-intelligence';
    const detailedNotes = `College: ${enquiryForm.college || 'N/A'}\nMessage: ${enquiryForm.message || 'N/A'}\nSubmitted via ${courseTitle} Brochure / Booklet page`;

    const payload = {
      name: enquiryForm.name.trim(),
      email: enquiryForm.email.trim(),
      phone: enquiryForm.phone.trim(),
      type: 'Ads Leads',
      program: courseSlug,
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
      program: courseSlug,
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
        subject: `${courseTitle} Brochure Query Registered`,
        body: `Hello ${enquiryForm.name},\n\nWe have logged your course brochure query for ${courseTitle}.\n\nAn academic counselor will contact you within 24 hours at ${enquiryForm.phone} or via email to guide you through model files, schedules, and dashboard logins.\n\nWarm regards,\nBeyondSkills Admissions Team`
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
    alert("Curriculum download has been triggered. Please check your browser downloads folder.");
  };
  
  // Booklet state parameters
  const [isBookletMode, setIsBookletMode] = useState(BOOKLET_COURSES.includes(courseId));
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;

  const isPageDark = (page) => {
    // Pages 1 (Cover), 3 (Why AI/DS), 6 (Highlights), 7 (Roadmap), 13 (Projects), 18 (Success), 20 (Contact) are dark.
    return [1, 3, 6, 7, 13, 18, 20].includes(page);
  };

  // Retrieve course content dynamically from the COURSES mock database
  const course = COURSES.find(c => c.id === courseId) || COURSES.find(c => c.id === 'artificial-intelligence');

  // Auto-expand first accordion module when course changes
  useEffect(() => {
    setExpandedModules({ 0: true });
    setActiveDatasetIdx(0);
    setIsBookletMode(BOOKLET_COURSES.includes(courseId));
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


  // Helper lookup function to render dynamic detailed syllabus for Pages 8-12
  const getSyllabusContent = (cid, page) => {
    const activeId = BOOKLET_COURSES.includes(cid) ? cid : 'artificial-intelligence';
    
    const db = {
      'artificial-intelligence': {
        8: {
          module: "Module 1", duration: "Weeks 1-2 • Python Setup & Structures",
          title: "Python Fundamentals & Basic Structures",
          desc: "Establish professional programming habits, configure terminal workspaces, and master control logic.",
          sec1Title: "1. Setup & Environment",
          sec1Items: [
            "Installation and setup of Anaconda environment",
            "Jupyter Notebook modern usage practices",
            "Essential shortcuts and productivity tips in Jupyter Notebook",
            "Understanding Python data types with real-world applications"
          ],
          sec2Title: "2. Structures & File Logic",
          sec2Items: [
            "Variable naming best practices (PEP 8 standards)",
            "Lists, Tuples, Sets, and Dictionaries with practical use cases",
            "Introduction to files and directories in modern dev environments",
            "File I/O and context managers (with Statement)"
          ],
          sec3Title: "3. CLI & Loops Control Flow",
          sec3Desc: "Looping constructs (for/while loops), conditional statements (if/elif/else), and terminal navigation."
        },
        9: {
          module: "Module 2", duration: "Weeks 3-5 • Data Analysis & Visualization",
          title: "Scientific Libraries & EDA",
          desc: "Clean messy data tables, formulate array calculations, and design presentation-ready telemetry charts.",
          sec1Title: "1. NumPy Computation",
          sec1Items: [
            "Introduction to machine learning scientific libraries",
            "NumPy hands-on implementation & array operations",
            "Matrix transformations and array vector calculations"
          ],
          sec2Title: "2. Pandas Wrangling & Visuals",
          sec2Items: [
            "Pandas: real-world data analysis and cleaning",
            "Data transformation, grouping, and merging datasets",
            "Exploratory analysis (EDA) using Matplotlib",
            "Seaborn visualization for advanced insights"
          ],
          sec3Title: "3. Concept Strengthening & Doubt resolution",
          sec3Desc: "Dedicated interactive discussion sessions to resolve course-related queries and reinforce core logic."
        },
        10: {
          module: "Module 3", duration: "Weeks 6-7 • Relational SQL & Linear Modeling",
          title: "SQL Databases & Statistical Modeling",
          desc: "Manage data schemas, write SQL queries, analyze statistics, and establish supervised regression pipelines.",
          sec1Title: "1. Databases & SQL",
          sec1Items: [
            "Excel: dashboard visual layouts and calculations",
            "SQL Joins, data aggregations, and query writing",
            "Relational database design & schema connections",
            "Power BI: DAX queries & model charts"
          ],
          sec2Title: "2. Stats & Machine Learning",
          sec2Items: [
            "Statistical thinking: central tendencies & dispersion",
            "IQR statistics & dispersion calculations",
            "Supervised & unsupervised model fine-tuning",
            "Linear & Logistic Regression concept checks"
          ],
          sec3Title: "3. Regression Evaluations & Predictions",
          sec3Desc: "Hands-on practice mapping regression performance, evaluating metrics, and auditing classifications."
        },
        11: {
          module: "Module 4", duration: "Weeks 8-10 • Data Processing & Ensembles",
          title: "Data Preprocessing & Tree Models",
          desc: "Standardize data inputs, manage outlier offsets, configure decision trees, and explore neural structures.",
          sec1Title: "1. Data Standardization",
          sec1Items: [
            "Standardization, normalization, scaling",
            "Outlier detection and missing value treatment",
            "Feature scaling and selection techniques",
            "Introduction to data preprocessing techniques"
          ],
          sec2Title: "2. Trees & Deep Learning",
          sec2Items: [
            "Decision Trees: CART concepts & algorithms",
            "Bagging, Boosting, and Random Forest methods",
            "Neural Networks: activation parameters & layers",
            "Fundamentals of Deep Learning models"
          ],
          sec3Title: "3. Capstone Real-world Implementation",
          sec3Desc: "Utilize Data Science libraries to execute data analysis, visualization, model building, and data extraction."
        },
        12: {
          module: "Module 5", duration: "Weeks 11-12 • Text Intelligence & API Pipelines",
          title: "NLP & Generative AI Specialization",
          desc: "Construct text tokenizers, execute entity extractions (NER), download transformer pipelines, and invoke API agents.",
          sec1Title: "1. Natural Language Processing",
          sec1Items: [
            "NLTK text parsing, tokenization, linguistics",
            "spaCy: Named Entity Recognition (NER) & apps",
            "Gensim topic modeling & semantic analysis",
            "FastText: word representations & Deep Learning NLP"
          ],
          sec2Title: "2. Generative AI & LLMs",
          sec2Items: [
            "Hugging Face ecosystem & pre-trained transformers",
            "Working of GenAI: GANs, VAEs, and LLMs",
            "Overview of DALL-E, ChatGPT, and Gemini APIs",
            "Prompt Engineering & building custom agents"
          ],
          sec3Title: "3. Real-World AI Applications",
          sec3Desc: "Apply GenAI models to content generation, workflow automations, and RAG support portals."
        }
      },
      'data-science': {
        8: {
          module: "Module 1", duration: "Weeks 1-2 • Python Internals & Architecture",
          title: "Python Fundamentals & Structures",
          desc: "Configure virtual workspaces, establish PEP 8 variables, and control standard data streams.",
          sec1Title: "1. Setup & Environment",
          sec1Items: [
            "Installation and setup of Anaconda environment",
            "Jupyter Notebook overview with modern usage practices",
            "Essential shortcut keys and productivity tips in Jupyter Notebook",
            "Understanding Python data types with real-world applications"
          ],
          sec2Title: "2. Structures & File Logic",
          sec2Items: [
            "Best practices for naming variables in Python (PEP 8 Standards)",
            "Python Data Structures: List, Tuple, Set, and Dictionary with practical use cases",
            "Introduction to files and directories in modern dev environments",
            "File handling: Reading text files and context managers"
          ],
          sec3Title: "3. CLI & Doubt Clearing",
          sec3Desc: "Working with Command Line Interfaces (CLI), terminal navigation, and dedicated doubt clearing."
        },
        9: {
          module: "Module 2", duration: "Weeks 3-5 • Control Logic & NumPy Data Analysis",
          title: "Control Flow & NumPy Computing",
          desc: "Construct conditional logic pathways and clean multi-dimensional arrays for machine learning.",
          sec1Title: "1. Control Flow & Loops",
          sec1Items: [
            "Conditional statements in Python: if, elif, and else",
            "Looping constructs: for loops and while loops"
          ],
          sec2Title: "2. NumPy Array Processing",
          sec2Items: [
            "Introduction to machine learning scientific libraries",
            "NumPy: Hands-on implementation and practical applications",
            "Data analysis with Pandas (data cleaning, transformation, and analysis)",
            "Pandas: Hands-on data analysis and real-world applications"
          ],
          sec3Title: "3. Continuous Doubt Resolution",
          sec3Desc: "Regular interactive doubtful resolution sessions to solidify data analytics concepts and loop frameworks."
        },
        10: {
          module: "Module 3", duration: "Weeks 6-7 • Exploratory Data Analysis & Statistics",
          title: "EDA, Statistics & Core ML Regressions",
          desc: "Draw interactive telemetry charts, audit standard distributions, and predict simple variables.",
          sec1Title: "1. Visualizations & EDA",
          sec1Items: [
            "Exploratory Data Analysis (EDA) and visualization using Matplotlib",
            "Data visualization concepts and techniques",
            "Seaborn: Hands-on visualization for advanced insights"
          ],
          sec2Title: "2. Statistical Foundations",
          sec2Items: [
            "Statistical thinking in Python: Building core foundations",
            "Measures of central tendency, dispersion, and variance",
            "IQR (Interquartile Range) statistics - hands-on practice",
            "Introduction to machine learning classification & regressions"
          ],
          sec3Title: "3. Logistic Regression Foundations",
          sec3Desc: "Logistic Regression concepts, evaluation metrics, and practical hands-on implementations."
        },
        11: {
          module: "Module 4", duration: "Weeks 8-10 • Data Processing & Machine Learning Trees",
          title: "Data Preprocessing & Tree Models",
          desc: "Apply data scaling matrices, manage outliers, build CART models, and code deep learning basics.",
          sec1Title: "1. Preprocessing & Regressions",
          sec1Items: [
            "Linear Regression model building and evaluation metrics",
            "Introduction to data preprocessing: standardization, normalization",
            "Outlier detection and missing value treatments",
            "Feature scaling and feature selection techniques"
          ],
          sec2Title: "2. Decision Trees & ensembles",
          sec2Items: [
            "Decision Trees: Classification and Regression Trees (CART) concepts",
            "Bagging techniques for model improvement",
            "Boosting models and Random Forest methods",
            "Fundamentals of Neural Networks and Deep Learning"
          ],
          sec3Title: "3. Neural Networks basics",
          sec3Desc: "Neural networks activation parameters, layers, and basic Deep Learning models."
        },
        12: {
          module: "Module 5", duration: "Weeks 11-12 • Excel Analysis, SQL & Power BI Dashboards",
          title: "Excel, SQL & Power BI Visualization",
          desc: "Build relational SQL databases, perform Excel pivots, and construct Power BI telemetry dashboards.",
          sec1Title: "1. Excel & SQL Data Queries",
          sec1Items: [
            "Advanced Excel functions for data analysis & conditional formatting",
            "Pivot tables for data summarization & interactive dashboards",
            "SQL for data extraction: schema design, clauses, Joins"
          ],
          sec2Title: "2. Power BI Reporting",
          sec2Items: [
            "Introduction to Power BI Desktop and its interface",
            "ETL Pipeline implementation in Power BI (extract, transform, load)",
            "Creating calculated fields using DAX formulas",
            "AI-powered features and advanced analytics in Power BI"
          ],
          sec3Title: "3. Capstone Real-world Implementation",
          sec3Desc: "Capstone project deploying analytics scripts, SQL joins, and dashboard visual feeds."
        }
      },
      'data-analytics': {
        // Data analytics shares the exact same curriculum data in files
      },
      'cyber-security': {
        8: {
          module: "Module 1", duration: "Weeks 1-2 • Threat Landscape & Linux System Commands",
          title: "Cyber Security Fundamentals & Linux Command Line",
          desc: "Audit online threat vectors, explore security principles, and master the Linux file system.",
          sec1Title: "1. Cybersecurity Landscape",
          sec1Items: [
            "Cybersecurity Fundamentals: Definition, importance, and threat landscape",
            "Cyber threats: malware, phishing, ransomware, social engineering, and APTs",
            "Core security principles: CIA Triad (Confidentiality, Integrity, Availability)",
            "Cybersecurity ethics, governance, compliance, and data protection"
          ],
          sec2Title: "2. Linux Administration",
          sec2Items: [
            "Introduction to Linux: commands, file system, and admin basics",
            "Linux command-line fundamentals and productivity tips",
            "Networking commands for troubleshooting and connectivity analysis",
            "Service management and log monitoring in Linux systems"
          ],
          sec3Title: "3. Linux Directory Structure",
          sec3Desc: "Linux file system architecture and directory structure (FHS standards) with doubt-clearing sessions."
        },
        9: {
          module: "Module 2", duration: "Weeks 3-5 • Windows Security Config & Networking",
          title: "Windows OS Security & Network Routing",
          desc: "Configure Windows user accesses, script system diagnostics, and study TCP/IP protocols.",
          sec1Title: "1. Windows Configuration",
          sec1Items: [
            "Introduction to Windows: system configuration and security basics",
            "Access control models, user permissions, and User Account Control (UAC)",
            "Windows security tools: firewall configuration and Microsoft Defender",
            "Remote administration: WinRM, Remote Desktop Protocol (RDP)"
          ],
          sec2Title: "2. CLI Scripting & Networking",
          sec2Items: [
            "Command Prompt (CMD) commands and basic batch scripting",
            "Introduction to PowerShell for automation and system management",
            "Networking fundamentals: protocols, models (OSI/TCP-IP), ports",
            "IP Addressing and Subnetting: IPv4/IPv6 concepts & network segmentation"
          ],
          sec3Title: "3. Firewall Config",
          sec3Desc: "Firewall concepts, port security filters, and configuration for network security."
        },
        10: {
          module: "Module 3", duration: "Weeks 6-7 • Ethical Hacking & Web Vulnerabilities",
          title: "Ethical Hacking & Web Penetration Testing",
          desc: "Run active network scans, bypass credentials, exploit file uploads, and mitigate OWASP Top 10.",
          sec1Title: "1. Ethical Hacking Concepts",
          sec1Items: [
            "Ethical Hacking: concepts, tools, methodologies, and reconnaissance",
            "Vulnerability assessment and professional security reporting",
            "Windows and Linux system hacking and password cracking",
            "Network analysis and testing using Wireshark"
          ],
          sec2Title: "2. Web App Security",
          sec2Items: [
            "Web application security, fuzzing, and directory enumeration",
            "Subdomain enumeration, asset discovery, and authentication bypass",
            "File Inclusion (LFI/RFI) and file upload exploits",
            "Cross-Site Scripting (XSS), Command Injection, and SQL Injection (SQLi)"
          ],
          sec3Title: "3. OWASP Top 10 Mitigation",
          sec3Desc: "OWASP Top 10 (2021) critical web security risks, vulnerability exploitation, and mitigations."
        },
        11: {
          module: "Module 4", duration: "Weeks 8-10 • SIEM Systems & Incident Response",
          title: "SOC Operations, SIEM & Team Scenarios",
          desc: "Analyze SIEM consoles, install intrusion detection systems, and rehearse Red/Blue attack scenarios.",
          sec1Title: "1. SOC & SIEM Integration",
          sec1Items: [
            "Security Operations Center (SOC) roles, responsibilities, and workflows",
            "Security Information and Event Management (SIEM) concepts",
            "Security tools: installation, configuration, and integration",
            "Building and configuring IDS, firewalls, and honeypots"
          ],
          sec2Title: "2. Threat Detection & Teams",
          sec2Items: [
            "Threat detection, incident reporting, and compliance practices",
            "Red, Blue, and Purple Team: cybersecurity attack & defense scenarios",
            "Blue Team: defensive security strategies and threat monitoring",
            "Red Team: offensive security testing and ethical hacking techniques"
          ],
          sec3Title: "3. Collaborative Security",
          sec3Desc: "Purple Team collaborative security approach for continuous organizational threat protection improvement."
        },
        12: {
          module: "Module 5", duration: "Weeks 11-12 • Security Audits & Capstone Lab",
          title: "Security Auditing & Pentest Capstones",
          desc: "Compile detailed system audit reports and simulate offensive security campaigns.",
          sec1Title: "1. Security Auditing",
          sec1Items: [
            "Security testing and vulnerability assessment checks",
            "Comprehensive security audit checklists for vulnerability scans"
          ],
          sec2Title: "2. Offensive Simulation",
          sec2Items: [
            "Real-World attack simulations on vulnerable services",
            "Web application vulnerability assessment and security testing",
            "Identifying, analyzing, and reporting security vulnerabilities",
            "Anonymity techniques, dark web fundamentals, and secure comms"
          ],
          sec3Title: "3. Capstone Real-world Implementation",
          sec3Desc: "Capstone project executing vulnerability assessment and penetration testing (VAPT) on simulated networks."
        }
      },
      'hr-mgmt': {
        8: {
          module: "Module 1", duration: "Weeks 1-2 • Strategic HRM & Organizational Alignment",
          title: "Strategic HR Management & Digital Transformation",
          desc: "Align human resource operations with business goals and understand digital HR automated tools.",
          sec1Title: "1. Strategic HRM",
          sec1Items: [
            "Introduction to Strategic HRM: Aligning strategies with business goals",
            "Linking HRM with organizational strategy & performance metrics",
            "Organizational growth through people-centric and data-driven HR strategies"
          ],
          sec2Title: "2. Goal Translation & Digital HR",
          sec2Items: [
            "Deriving HR strategy from organizational goals and objectives",
            "Digital transformation in HR: emerging tech, automation, and challenges",
            "Interactive doubt-clearing & discussion sessions for HR alignment"
          ],
          sec3Title: "3. Doubts Resolution",
          sec3Desc: "Dedicated Q&A checkups to address course-related queries and strategic workforce cases."
        },
        9: {
          module: "Module 2", duration: "Weeks 3-5 • Workforce Planning & Job Architecture",
          title: "Workforce Planning & Job Design Techniques",
          desc: "Manage manpower demand forecasts, compile job specifications, and run evaluation schemas.",
          sec1Title: "1. Planning & Analysis",
          sec1Items: [
            "Workforce planning & job design: analysis, evaluation, and structuring",
            "Manpower demand & supply analysis: forecasting workforce needs",
            "HR Planning (HRP) process: strategic workforce planning, gap analysis"
          ],
          sec2Title: "2. Job Specifications",
          sec2Items: [
            "Job Description (JD): defining roles, responsibilities, and deliverables",
            "Job Specification (JS): outlining skills, qualifications, and competencies",
            "Job design techniques: structuring roles for productivity & efficiency",
            "Methods of Job Evaluation (JE): systematic approaches to assess job value"
          ],
          sec3Title: "3. Compensation Alignment",
          sec3Desc: "Establish systematic approaches to align compensation bands with evaluated role weights."
        },
        10: {
          module: "Module 3", duration: "Weeks 6-7 • Advanced Workforce Analytics",
          title: "Advanced Planning & Doubt Resolution",
          desc: "Apply data-driven approaches to workforce planning, design future-ready roles, and resolve doubts.",
          sec1Title: "1. Doubt Resolution",
          sec1Items: [
            "Regular doubt-clearing sessions to resolve course-related questions",
            "Interactive discussions on strategic workforce cases"
          ],
          sec2Title: "2. Data-Driven Planning",
          sec2Items: [
            "Manpower demand & supply analysis using data-driven approaches",
            "HR Planning process: resource optimization & gap analysis",
            "Job description & specification: defining competency requirements",
            "Job design strategies: creating efficient, engaging, and future-ready roles",
            "Methods of Job Evaluation: pay structuring and internal equity"
          ],
          sec3Title: "3. Internal Equity Focus",
          sec3Desc: "Modern techniques for role assessment, pay structuring, and maintaining internal equity."
        },
        11: {
          module: "Module 4", duration: "Weeks 8-10 • Talent Acquisition & Recruitment AI",
          title: "Talent Acquisition & Employee Development",
          desc: "Build employer branding campaigns, review automated ATS keyword filters, and schedule training paths.",
          sec1Title: "1. Talent Acquisition",
          sec1Items: [
            "Talent acquisition strategies: modern recruitment & hiring techniques",
            "Employer branding, candidate experience, and sourcing",
            "Individual differences: personality, attitudes, motivation, and assessments",
            "AI & ML in recruitment: automation, resume screening, bias reduction",
            "HR metrics in talent acquisition: Time-to-Hire, Cost-per-Hire, Quality"
          ],
          sec2Title: "2. Development & Engagement",
          sec2Items: [
            "Career planning & talent development: upskilling and reskilling",
            "Training & Development: learning strategies for workforce growth",
            "Career management: aligning individual goals with organizational plans",
            "Employee engagement & modern workplace trends: culture, D&I, remote work"
          ],
          sec3Title: "3. Workplace Trends",
          sec3Desc: "Enhancing employee engagement through culture, well-being, diversity, inclusion, and remote work practices."
        },
        12: {
          module: "Module 5", duration: "Weeks 11-12 • Performance Systems, Labor Laws & AI",
          title: "Performance Systems, Labor Laws & AI in HR",
          desc: "Setup OKRs, appraise employee potentials, learn labor law compliance, and automate HR tasks.",
          sec1Title: "1. Performance Management",
          sec1Items: [
            "PMS: goal setting, KPIs, appraisals, and continuous feedback",
            "Performance appraisal systems: modern and continuous feedback methods",
            "Potential Appraisal: identifying future leaders for succession planning",
            "Performance management: OKRs/KPIs and 360-degree feedback"
          ],
          sec2Title: "2. Labor Laws & Change Mgmt",
          sec2Items: [
            "People management: leadership, motivation, and workplace culture",
            "Managing individuals/teams in uncertain environments: Agile leadership",
            "Compensation & Benefits: salary structures, incentives, and rewards",
            "Labour laws & social security: compliance, regulations, and rights",
            "Change management: organizational transformation and digital adoption"
          ],
          sec3Title: "3. AI in HR Automation",
          sec3Desc: "Applicant Tracking Systems (ATS), task automation, collaborative scheduling, and AI-driven decision making."
        }
      },
      'machine-learning': {
        8: {
          module: "Module 1", duration: "Weeks 1-2 • Data Preprocessing & Libraries",
          title: "Python Basics & Array Computations",
          desc: "Configure python environments, learn loop control logic, and perform array maths using NumPy.",
          sec1Title: "1. Setup & Environment",
          sec1Items: [
            "Installation of Anaconda Prompt & Jupyter Notebook overview",
            "Jupyter Notebook usage best practices & shortcuts",
            "Python programming basics: Loops, lists, and conditional flow",
            "Understanding variable scopes and standard PEP 8 naming checks"
          ],
          sec2Title: "2. NumPy Computational Arrays",
          sec2Items: [
            "Introduction to scientific array computations in machine learning",
            "NumPy: Multi-dimensional array operations and operations index",
            "Array slicing, filtering, and matrix transformations",
            "Hands-on implementation of vector calculations"
          ],
          sec3Title: "3. CLI & doubted resolutions",
          sec3Desc: "Working with Command Line Interfaces (CLI), directory navigation, and doubts clearing."
        },
        9: {
          module: "Module 2", duration: "Weeks 3-5 • Data Analysis & Visualization",
          title: "Pandas Wrangling & Seaborn Visualization",
          desc: "Filter datasets, clean missing data fields, perform pivots, and draw statistical dashboards.",
          sec1Title: "1. Pandas Data Wrangling",
          sec1Items: [
            "Pandas library for filtering, cleaning, and grouping datasets",
            "Handling missing values and transforming data frames",
            "Merging, joining, and pivoting complex data tables",
            "Real-world data manipulation checks and analytics"
          ],
          sec2Title: "2. Exploratory Data Visuals",
          sec2Items: [
            "Data visualization using Matplotlib library charts",
            "Designing line, bar, scatter, and histogram plots",
            "Seaborn visualization for advanced distribution insights",
            "Exploratory Data Analysis (EDA) on real-world datasets"
          ],
          sec3Title: "3. Doubt resolution",
          sec3Desc: "Dedicated interactive question loops to reinforce coding foundations and library checks."
        },
        10: {
          module: "Module 3", duration: "Weeks 6-7 • Supervised Learning Algorithms",
          title: "Supervised Classification & Regressions",
          desc: "Understand regression math, evaluate classifications, and predict continuous variables.",
          sec1Title: "1. Regressions Mathematics",
          sec1Items: [
            "Linear Regression and Logistic Regression mathematics",
            "Hands-on implementation of Linear Regression pipelines",
            "Logistic Regression: Concepts and practical applications"
          ],
          sec2Title: "2. Performance Evaluations",
          sec2Items: [
            "Model evaluation metrics: MSE, RMSE, R2 values",
            "Classification metrics: Accuracy, Precision, Recall, F1-Score",
            "Understanding confusion matrices and ROC-AUC curves",
            "Cross-validation and bias-variance tradeoff diagnostics"
          ],
          sec3Title: "3. Overfitting checks",
          sec3Desc: "Regularization concepts (L1/L2 ridge/lasso regressions) to prevent overfitting."
        },
        11: {
          module: "Module 4", duration: "Weeks 8-10 • Ensemble Models & Tree Architectures",
          title: "Tree-Based Models & Boosting Ensembles",
          desc: "Train Decision Trees, construct Random Forest bagging, and deploy boosting classifiers.",
          sec1Title: "1. Decision Trees (CART)",
          sec1Items: [
            "Tree-based algorithms: Decision Trees & splitting criteria (Gini/Entropy)",
            "Hyperparameter tuning for decision trees (depth, leaf sizes)",
            "Bagging techniques for model performance improvement"
          ],
          sec2Title: "2. Boosting & Random Forests",
          sec2Items: [
            "Random Forest classifiers: Bootstrap aggregation & ensembles",
            "Boosting models: AdaBoost and Gradient Boosting algorithms",
            "XGBoost: High-performance tree boosting implementations",
            "Feature importance analysis in tree models"
          ],
          sec3Title: "3. Ensembles Capstone",
          sec3Desc: "Hands-on project training ensemble classifiers to predict structured telemetry parameters."
        },
        12: {
          module: "Module 5", duration: "Weeks 11-12 • Unsupervised Learning & MLOps",
          title: "Unsupervised Clustering & Model Pipelines",
          desc: "Segment datasets with K-Means, compress dimensions using PCA, and deploy predictive models.",
          sec1Title: "1. Clustering & Dimensionality",
          sec1Items: [
            "Clustering models: K-Means and Hierarchical clustering",
            "Finding optimal clusters: Elbow method & Silhouette scores",
            "Dimensionality reduction using Principal Component Analysis (PCA)"
          ],
          sec2Title: "2. MLOps & Deployments",
          sec2Items: [
            "Saving models using joblib/pickle formats",
            "Building end-to-end machine learning pipelines",
            "Deploying ML model endpoints inside Flask/FastAPI routing",
            "Monitoring model performance drift in production environments"
          ],
          sec3Title: "3. Capstone Real-world Implementation",
          sec3Desc: "Final capstone project deploying an end-to-end machine learning model on cloud environments."
        }
      },
      'cloud-computing': {
        8: {
          module: "Module 1", duration: "Weeks 1-2 • Introduction & Service Models",
          title: "Introduction to Cloud Computing & Core Fundamentals",
          desc: "Understand cloud concepts, virtualization, core benefits, delivery models, and tenant isolation.",
          sec1Title: "1. Introduction to Cloud Computing",
          sec1Items: [
            "Introduction to Cloud Computing: Concepts, Service Models (IaaS, PaaS, SaaS), and Modern Use Cases",
            "Introduction to Cloud Computing: What It Is and Why It Matters in Modern Technology"
          ],
          sec2Title: "2. Cloud Fundamentals",
          sec2Items: [
            "Key Benefits of Cloud Computing: Scalability, Cost Efficiency, Flexibility, Security, and High Availability",
            "Cloud Computing Models: Service Models (IaaS, PaaS, SaaS) and Deployment Models (Public, Private, Hybrid, Multi-Cloud)"
          ],
          sec3Title: "3. Doubt-Clearing and Interactive Discussions",
          sec3Desc: "Dedicated interactive sessions to address course-related doubts, service setups, and resource groups."
        },
        9: {
          module: "Module 2", duration: "Weeks 3-5 • Azure Basics & Core Networks",
          title: "Microsoft Azure Fundamentals & Networking",
          desc: "Explore subscription management, resource organization, subnets, routing tables, regions, and VPN connectivity.",
          sec1Title: "1. Microsoft Azure Fundamentals",
          sec1Items: [
            "Introduction to Microsoft Azure: Overview and Core Capabilities",
            "Exploring Azure Services: Service Tour and Practical Use Cases",
            "Managing Azure Subscriptions: Setup, Configuration, and Access Control"
          ],
          sec2Title: "2. Azure Networking Basics",
          sec2Items: [
            "Virtual Networks (VNet) in Azure: Concepts, Configuration, and Best Practices",
            "Understanding Azure VPN: Purpose, Use Cases, and Hands-On Implementation",
            "Introduction to Azure Regions: Geographic Distribution and Availability Zones"
          ],
          sec3Title: "3. Doubt-Clearing & Support Sessions",
          sec3Desc: "Regular sessions held to resolve course-related doubts, VNet configuration conflicts, and facilitate interactive discussions."
        },
        10: {
          module: "Module 3", duration: "Weeks 6-7 • Advanced Security & Traffic",
          title: "Azure Networking (Advanced Configuration & Security)",
          desc: "Implement N-tier security matrices, manage traffic, set up load balancers, and configure public/private endpoints.",
          sec1Title: "1. Advanced Traffic Routing & DNS",
          sec1Items: [
            "Azure Load Balancer: Traffic Distribution and High Availability",
            "Azure Application Gateway: Web Traffic Management and Security",
            "Azure Traffic Manager: Global Traffic Routing and Performance Optimization",
            "Azure DNS: Domain Management and Name Resolution"
          ],
          sec2Title: "2. Network Security Groups & Controls",
          sec2Items: [
            "Implementing N-Tier Architecture in Azure: Design and Best Practices",
            "Network Security Groups (NSGs): Configuration and Access Control",
            "Ensuring Availability and High Availability in Azure Environments"
          ],
          sec3Title: "3. Connectivity Labs",
          sec3Desc: "Hands-on labs deploying N-Tier routing tables, configuring NSGs, application gateways, and DNS records."
        },
        11: {
          module: "Module 4", duration: "Weeks 8-10 • Compute Services & Storage",
          title: "Azure Compute Services & Storage Solutions",
          desc: "Provision virtual machines, host APIs in app containers, deploy Kubernetes, and configure structured/unstructured storage.",
          sec1Title: "1. Azure Compute Services",
          sec1Items: [
            "Virtual Machines and Containers in Azure: Deployment and Management",
            "Azure App Service: Hosting Web Apps and APIs",
            "Serverless Computing in Azure: Functions and Event-Driven Architectures",
            "Azure Kubernetes Service (AKS): Container Orchestration and Management",
            "Scaling Virtual Machines in Azure: Autoscaling, Load Management, and Availability Sets"
          ],
          sec2Title: "2. Azure Storage & Database Solutions",
          sec2Items: [
            "Azure Storage: Types of Data (Structured, Unstructured) and Storage Solutions",
            "Blob, File, Queue, Disk, Data Lake, and Azure SQL Database Services",
            "Azure Cosmos DB: Globally Distributed, Multi-Model Database",
            "Storage Security: Encryption, Replication, and Access Management"
          ],
          sec3Title: "3. Hands-On Labs",
          sec3Desc: "Working with Blob and File Storage in Azure, managing instances inside Azure Storage Explorer, and compute scaling."
        },
        12: {
          module: "Module 5", duration: "Weeks 11-12 • Security, ML, Backup & Projects",
          title: "Azure Security, Governance, Machine Learning & Capstone",
          desc: "Configure role-based access control, set up automation templates, perform compliance audits, and deploy capstone projects.",
          sec1Title: "1. Security & Governance Compliance",
          sec1Items: [
            "Azure Security: Layered Security Approach and Best Practices (IAM, Data Hashing, Encryption)",
            "Implementing Azure Policy & Blueprints: Enforcing Organizational Standards",
            "Enterprise Governance in Azure: Best Practices and Compliance Manager guidelines"
          ],
          sec2Title: "2. Backup, Automation & AI",
          sec2Items: [
            "Azure Backup & Recovery Solutions: Key Vault, disaster recovery configurations",
            "Azure Resource Manager (ARM) Templates and Automated Deployment",
            "Azure Machine Learning: Introduction and Use Cases",
            "Cost Optimization Strategies and Azure Service Health Monitoring"
          ],
          sec3Title: "3. Capstone Real-world Implementation",
          sec3Desc: "Project Discussion, career guidance, resume building, mock interviews, and final portfolio verification."
        }
      },
      'stock-market': {
        8: {
          module: "Module 1", duration: "Weeks 1-2 • Market Architecture & Trading Basics",
          title: "Financial Markets & Order Operations",
          desc: "Analyze stock exchanges, understand regulatory margins, and execute limits/stop-losses.",
          sec1Title: "1. Market Structure",
          sec1Items: [
            "Overview of financial markets: stock, bond, commodity markets",
            "Key participants: investors, traders, brokers, regulators (SEBI)",
            "Understanding stock exchanges: NSE, BSE, NYSE, NASDAQ",
            "Stock market indices: Nifty 50, Sensex, S&P 500, Dow Jones"
          ],
          sec2Title: "2. Trading Operations",
          sec2Items: [
            "What is a stock? Common vs Preferred shares",
            "How to buy and sell: market, limit, stop-loss orders",
            "Brokerage accounts: types and setup procedures",
            "Introduction to trading platforms, terminal interfaces, and margins"
          ],
          sec3Title: "3. Execution Labs",
          sec3Desc: "Simulating order placements, managing margins, and navigating trading terminals."
        },
        9: {
          module: "Module 2", duration: "Weeks 3-5 • Fundamental & Technical Analysis",
          title: "Equity Valuations & Technical Indicators",
          desc: "Audit corporate balance sheets, read P/E ratios, draw trendlines, and configure RSI/MACD charts.",
          sec1Title: "1. Fundamental Analysis",
          sec1Items: [
            "Financial statements: income statements & balance sheets",
            "Cash flow statements and earnings reports",
            "Key financial ratios: P/E, PEG, ROE, ROCE, Debt-to-Equity",
            "Analyzing corporate performances & industry trends"
          ],
          sec2Title: "2. Technical Analysis",
          sec2Items: [
            "Introduction to technical analysis and charting platforms",
            "Chart types: Line, Bar, and Candlestick patterns",
            "Key indicators: Moving Averages, RSI, MACD, Bollinger Bands",
            "Understanding support & resistance levels, trendlines, and volumes"
          ],
          sec3Title: "3. Research Diagnostics",
          sec3Desc: "Analyzing balance sheets, identifying chart trends, and backtesting indicator parameters."
        },
        10: {
          module: "Module 3", duration: "Weeks 6-7 • Investment Strategies & Risk Management",
          title: "Investment Styles & Portfolio Construction",
          desc: "Formulate compounding portfolios, allocate assets, and manage risk position sizing.",
          sec1Title: "1. Investment Strategies",
          sec1Items: [
            "Value investing, growth investing, and dividend income styles",
            "Active vs passive investing: Index funds & ETFs",
            "Long-term vs short-term compounding strategies",
            "Developing a structured investment process"
          ],
          sec2Title: "2. Risk & Portfolio Diversification",
          sec2Items: [
            "Understanding risk and return parameters in investing",
            "Asset allocation and constructing diversified portfolios",
            "Position sizing logic and limiting single-stock exposures",
            "Mitigating systemic vs non-systemic risk vectors"
          ],
          sec3Title: "3. Portfolio Allocations",
          sec3Desc: "Designing custom asset allocation matrices and backtesting historical portfolios."
        },
        11: {
          module: "Module 4", duration: "Weeks 8-10 • Derivatives & Market Psychology",
          title: "Options Derivatives & Behavioral Finance",
          desc: "Study options calls/puts, structure covered hedges, and analyze investor biases.",
          sec1Title: "1. Derivatives & Hedging",
          sec1Items: [
            "Introduction to derivatives: Options, Futures, and CFDs",
            "Option contracts: Calls, Puts, Strike prices, and Expiry dates",
            "Basic options strategies: Covered calls & Protective puts",
            "Understanding ETFs, mutual funds, and alternative assets"
          ],
          sec2Title: "2. Behavioral Finance",
          sec2Items: [
            "Introduction to behavioral finance: cognitive biases",
            "Common biases: overconfidence, herd behavior, loss aversion",
            "Market sentiment, fear & greed index, and panic cycles",
            "Identifying psychological patterns in trading decisions"
          ],
          sec3Title: "3. Derivatives Execution",
          sec3Desc: "Simulating option call/put strategies and calculating risk-to-reward ratios."
        },
        12: {
          module: "Module 5", duration: "Weeks 11-12 • Regulations, Ethics & Capstone",
          title: "Regulatory Compliance & Equity Research Capstone",
          desc: "Inspect SEBI guidelines, prevent manipulation, and compile a stock research evaluation portfolio.",
          sec1Title: "1. Market Regulations",
          sec1Items: [
            "Regulatory bodies: SEBI, SEC, FINRA rules and mandates",
            "Understanding market manipulation and pump-and-dump checks",
            "Insider trading regulations and corporate governance ethics",
            "Risk disclosures and investor protection guidelines"
          ],
          sec2Title: "2. Capstone Research",
          sec2Items: [
            "Analyzing a selected stock's financials and chart patterns",
            "Creating a mock paper-trading investment portfolio",
            "Integrating technical overlays with fundamental valuation models",
            "Peer-reviewing valuation reports and trading system logic"
          ],
          sec3Title: "3. Capstone Real-world Implementation",
          sec3Desc: "Presenting a detailed equity research report and mock portfolio performance logs."
        }
      },
      'digital-marketing-cert': {
        8: {
          module: "Module 1", duration: "Weeks 1-2 • Introduction & Marketing Funnels",
          title: "Digital Marketing Funnels & Brand Positionings",
          desc: "Design target customer profiles, map buyer journeys, and study standard marketing metrics (CAC).",
          sec1Title: "1. Digital Landscape",
          sec1Items: [
            "Understanding core concepts & scope of Digital Marketing",
            "Traditional vs Digital Marketing, and customer behaviors",
            "Market segmentation, target customer profiling, and positioning",
            "The 4Ps of marketing: Product, Price, Place, and Promotion"
          ],
          sec2Title: "2. Funnels & Journeys",
          sec2Items: [
            "Marketing Funnel: Awareness, Interest, Desire, Action",
            "Customer journey mapping: From awareness to retention",
            "Formulating cross-channel acquisition strategies",
            "KPIs for tracking customer acquisition costs (CAC)"
          ],
          sec3Title: "3. Campaigns Design",
          sec3Desc: "Designing customer persona avatars and mapping multi-channel campaign funnels."
        },
        9: {
          module: "Module 2", duration: "Weeks 3-5 • WordPress Branding & Search Engine SEO",
          title: "WordPress Web Branding & SEO Optimization",
          desc: "Host WordPress websites, optimize on-page meta tags, audit technical schemas, and write keywords.",
          sec1Title: "1. Website Branding",
          sec1Items: [
            "Brand identity building: Logo, colors, voice, and assets",
            "WordPress development: Domain registration & hosting setups",
            "Building responsive, SEO-friendly websites on WordPress",
            "Storytelling in digital branding to connect with audiences"
          ],
          sec2Title: "2. Search Engine Optimization (SEO)",
          sec2Items: [
            "Keyword research: short-tail, long-tail, and search intent",
            "On-page SEO: Content optimization, meta tags, and alt text",
            "Technical SEO: Site speed, sitemaps, indexability, schemas",
            "Off-page SEO: Link building, backlinks, and local citations"
          ],
          sec3Title: "3. SEO Auditing Labs",
          sec3Desc: "Running keyword research with SEO tools and auditing a page's technical parameters."
        },
        10: {
          module: "Module 3", duration: "Weeks 6-7 • Paid Ads, Google PPC & Analytics",
          title: "Google Search PPC Ads & Google Analytics GA4",
          desc: "Configure search groups, launch video ads, deploy GA4 custom pixels, and analyze traffic logs.",
          sec1Title: "1. Google PPC Ads",
          sec1Items: [
            "Introduction to Google Ads: Overview of PPC advertising",
            "Campaign types: Search, Display, Video, Shopping, and PMax",
            "Google Ad group structuring, bidding models, and quality score",
            "Ad copies creation, extensions, and landing page conversions"
          ],
          sec2Title: "2. Google Analytics (GA4)",
          sec2Items: [
            "Analytics setup: Configuring Google Analytics (GA4) properties",
            "Custom tracking codes deployment and event tracking parameters",
            "Metrics audit: Traffic source, conversion rates, and bounce rates",
            "Cohort analysis, funnel visualizations, and ROI calculations"
          ],
          sec3Title: "3. Telemetry Ad Reports",
          sec3Desc: "Simulating A/B copy tests, auditing tracking codes, and designing dashboards."
        },
        11: {
          module: "Module 4", duration: "Weeks 8-10 • Social Media Optimization & Meta Ads",
          title: "Social Media Optimization & Meta Campaign Manager",
          desc: "Draft content calendars, launch Facebook/Instagram ads, build custom audiences, and deploy Meta pixels.",
          sec1Title: "1. Organic Social Media (SMO)",
          sec1Items: [
            "Profile creation and search optimization across platform indexes",
            "Trending hashtag strategies and organic discovery hacks",
            "Content planning and structuring social calendars",
            "Short-form video tactics, influencer reviews, and outreach"
          ],
          sec2Title: "2. Meta Ads (FB & IG)",
          sec2Items: [
            "Meta Ad Manager: Setting up business managers and ad sets",
            "Audience targeting: Demographics, custom and lookalike segments",
            "Facebook/Instagram ads: Video, image, carousel, lead ads",
            "Deploying Meta pixels to trace visitor conversions and retarget"
          ],
          sec3Title: "3. Audience Targeting Labs",
          sec3Desc: "Installing Meta pixels, building custom custom audiences, and auditing ad ROI."
        },
        12: {
          module: "Module 5", duration: "Weeks 11-12 • Email Automation, Affiliate & Reputation",
          title: "Email Marketing Automations & Growth Capstones",
          desc: "Build database lists, set up drip sequences, manage ORM reviews, and analyze ad campaign metrics.",
          sec1Title: "1. Email Automations",
          sec1Items: [
            "Building lists: opt-ins, lead magnets, and databases",
            "Campaign execution in Mailchimp & HubSpot platforms",
            "Writing engaging subject lines and setting up drip schedules",
            "Analyzing metrics: open rates, CTRs, and unsubscribe records"
          ],
          sec2Title: "2. Affiliate & ORM",
          sec2Items: [
            "Affiliate marketing models: CPA, CPC, CPL systems",
            "Online Reputation Management (ORM): Brand monitoring reviews",
            "Content marketing strategy: Content pillars & planning",
            "Statutory guidelines for digital ads disclosures"
          ],
          sec3Title: "3. Capstone Real-world Implementation",
          sec3Desc: "Final capstone project deploying integrated email drip sequences and analyzing ad spend logs."
        }
      },
      'full-stack-web': {
        8: {
          module: "Module 1", duration: "Weeks 1-2 • Frontend HTML & Basic CSS",
          title: "Web Architecture, Semantic HTML & CSS Basics",
          desc: "Write semantic layout code, build forms with inputs, and apply basic typography/dimension styling.",
          sec1Title: "1. Web Architecture",
          sec1Items: [
            "How websites work: Client-server architecture and requests",
            "HTML structure: Document setup, head, body, semantics",
            "HTML tags: Forms, input fields, tables, lists, validation",
            "Responsive design concepts and mobile-first viewpoints"
          ],
          sec2Title: "2. CSS Fundamentals",
          sec2Items: [
            "Introduction to CSS: Inline, internal, and external styles",
            "Selectors: class, ID, pseudo-selectors, parent-child structures",
            "CSS Box Model: Margins, padding, borders, dimensions",
            "Styling elements: colors, gradients, backgrounds, typography"
          ],
          sec3Title: "3. Code Layouts Labs",
          sec3Desc: "Building semantic profile pages and styling forms with CSS layouts."
        },
        9: {
          module: "Module 2", duration: "Weeks 3-5 • Responsive CSS & Javascript Basics",
          title: "Responsive Flex/Grid & JS Variables/Loops",
          desc: "Implement CSS flexbox/grids, write Javascript control loops, and trigger DOM element select modifications.",
          sec1Title: "1. Responsive CSS",
          sec1Items: [
            "Advanced CSS layouts: Flexbox alignment parameters",
            "CSS Grid systems for multi-dimensional layouts",
            "CSS transitions, keyframe animations, and transformations",
            "Tailwind CSS utility setups and configuration checks"
          ],
          sec2Title: "2. Javascript Fundamentals",
          sec2Items: [
            "Variables & Data types: let, const, arrays, objects",
            "Operators, loops (for/while), conditional statements",
            "Functions: Arrow functions, return scopes, closures",
            "DOM Manipulation: Selecting elements, changing content/styles"
          ],
          sec3Title: "3. Interactive Actions",
          sec3Desc: "Dedicated doubt clearing sessions on JavaScript functions and DOM event listener triggers."
        },
        10: {
          module: "Module 3", duration: "Weeks 6-7 • Advanced JS & React Component Basics",
          title: "Async Javascript & React.js State Basics",
          desc: "Write async promises, validate forms data, configure local storage, and study React JSX setups.",
          sec1Title: "1. Advanced JS",
          sec1Items: [
            "Asynchronous JS: Callbacks, Promises, Async/Await",
            "Event handling, bubbling, and forms input validations",
            "Cookies, local storage, and session token storage",
            "Built-in objects: Date, Math, JSON parsing methods"
          ],
          sec2Title: "2. React.js Component Basics",
          sec2Items: [
            "Introduction to React.js and Virtual DOM principles",
            "React component architecture, JSX parameters, and imports",
            "Passing parameters through React props, conditional rendering",
            "State management: useState and simple event loops"
          ],
          sec3Title: "3. Component Designs",
          sec3Desc: "Constructing reusable UI cards, mapping arrays into lists, and tracking state triggers."
        },
        11: {
          module: "Module 4", duration: "Weeks 8-10 • Advanced React, APIs & Toolings",
          title: "React Hooks, Dynamic Routes & REST API Fetching",
          desc: "Execute useEffect hooks, setup client paths with Router, and connect elements with backend REST endpoints.",
          sec1Title: "1. React Hooks & Router",
          sec1Items: [
            "React hooks lifecycle tracking: useEffect, useRef",
            "React Router routing setup: Routes, Route, Link pathing",
            "Context API for global state variables management",
            "Optimizing React rendering performance blocks"
          ],
          sec2Title: "2. API Data Handling",
          sec2Items: [
            "Fetching REST API endpoints using Axios & Fetch options",
            "Handling loading and error alerts states in components",
            "Formik and validations libraries for forms data checks",
            "Testing components using React Testing Library"
          ],
          sec3Title: "3. Integrated API Labs",
          sec3Desc: "Connecting React frontend panels with external REST JSON endpoints."
        },
        12: {
          module: "Module 5", duration: "Weeks 11-12 • Node, Express, MongoDB & Auth",
          title: "Node Server APIs, MongoDB Atlas & JWT Security",
          desc: "Build backend Express routes, query database documents, configure JWT logins, and deploy capstones.",
          sec1Title: "1. Node.js & Express REST APIs",
          sec1Items: [
            "Node.js server setups, npm packages management",
            "Express.js routes parameters, request/response models",
            "Creating custom middleware structures for requests",
            "Git version control: branching, merging, GitHub workflows"
          ],
          sec2Title: "2. Database Integration & Auth",
          sec2Items: [
            "MongoDB Atlas cloud clusters & MongoDB queries (CRUD)",
            "Relational MySQL queries: SELECT, joins, schemas",
            "Security: Bcrypt password hashing & JWT tokens",
            "Connecting frontend inputs with backend REST routes"
          ],
          sec3Title: "3. Capstone Real-world Implementation",
          sec3Desc: "Deploying a full stack application to cloud servers (Vercel/Render) with MongoDB databases."
        }
      }
    };

    // If data-analytics, fallback to data-science since they carry matching schemas
    const targetId = activeId === 'data-analytics' ? 'data-science' : activeId;
    return db[targetId][page];
  };

  // Helper lookup function to render dynamic Page 3 metrics depending on course
  const getMarketMetrics = (cid) => {
    const activeId = BOOKLET_COURSES.includes(cid) ? cid : 'artificial-intelligence';
    
    const db = {
      'artificial-intelligence': [
        { label: "Enterprise AI Adoption", percent: 85, detail: "Companies replacing static logs with pipeline checks" },
        { label: "AI Developer Job Openings", percent: 92, detail: "Active hiring requirements showing 2.5x growth" },
        { label: "Salary Premium Trajectory", percent: 78, detail: "Higher salaries for engineers managing API models" }
      ],
      'data-science': [
        { label: "Data Science Platform Market", percent: 86, detail: "Enterprise investments multiplying for predictive modeling" },
        { label: "Data Scientist Hiring Demand", percent: 92, detail: "Job listings showing 3x growth in analytics requirements" },
        { label: "Telemetry Log Parsing", percent: 80, detail: "Companies automating raw database schema parsing" }
      ],
      'data-analytics': [
        { label: "Business Intelligence Market", percent: 72, detail: "Global conversion of raw operations data to dashboards" },
        { label: "Power BI & SQL Openings", percent: 78, detail: "Active analytics requirements representing largest job chunk" },
        { label: "Executive Dashboard Reliance", percent: 85, detail: "Business managers tracking real-time operations telemetry" }
      ],
      'cyber-security': [
        { label: "Cybersecurity Market Size", percent: 84, detail: "Expenditure rising exponentially as threat landscape expands" },
        { label: "Annual Cybercrime Cost", percent: 92, detail: "Penetration testers heavily recruited for protection" },
        { label: "Cyber Job Openings Gap", percent: 89, detail: "Massive shortage of certified threat analysts globally" }
      ],
      'hr-mgmt': [
        { label: "Global HR Tech Market", percent: 68, detail: "Investments rising fast in automated recruitment systems" },
        { label: "HR Analytics Adoption", percent: 72, detail: "Hiring managers seeking metrics-driven talent strategists" },
        { label: "ATS Filter Implementation", percent: 76, detail: "Companies pre-screening resumes through keywords filters" }
      ],
      'machine-learning': [
        { label: "ML Platform Market size", percent: 88, detail: "Enterprise training pipelines expanding rapidly" },
        { label: "Algorithm Hiring Demands", percent: 82, detail: "Surge in requirements for tree-based ensemble specialists" },
        { label: "Enterprise ML Adaptations", percent: 75, detail: "Platforms running active ML pipelines to predict behaviors" }
      ],
      'cloud-computing': [
        { label: "Global Cloud Market Size", percent: 88, detail: "Enterprise cloud hosting allocations are accelerating fast" },
        { label: "Cloud Openings Growth", percent: 85, detail: "Hiring demands focusing heavily on certified cloud architects" },
        { label: "VPC Deployments", percent: 80, detail: "Companies replacing standard servers with cloud VPC routing" }
      ],
      'stock-market': [
        { label: "Retail Trading Demat Accounts", percent: 90, detail: "Retail investment participation experiencing historic volumes" },
        { label: "Algorithmic Exchanges Volume", percent: 82, detail: "A massive share of exchange volumes processed programmatically" },
        { label: "Financial Literacy Search Indices", percent: 78, detail: "Sharp increase in demand for fundamental analysis research" }
      ],
      'digital-marketing-cert': [
        { label: "Digital Advertising Spend", percent: 78, detail: "Digital marketing budgets expanding fast on Google & Meta Ads" },
        { label: "Performance Marketing Jobs", percent: 82, detail: "Hiring focuses on marketers who track campaign pixel funnels" },
        { label: "Outreach Leads Automations", percent: 80, detail: "Businesses deploying drip campaigns to automate outreach" }
      ],
      'full-stack-web': [
        { label: "Web Application Market Value", percent: 82, detail: "Global scaling of React, Node.js and REST API applications" },
        { label: "Developer Openings Index", percent: 86, detail: "Active hiring registrations seeking dynamic frontend SPA modelers" },
        { label: "Vercel / Edge Host Deployments", percent: 78, detail: "Headless web portals deployed to serverless microservices" }
      ]
    };
    
    return db[activeId === 'data-analytics' ? 'data-science' : activeId];
  };

  // Helper lookup function to render dynamic tools covered cells on Page 14
  const getToolsList = (cid) => {
    const activeId = BOOKLET_COURSES.includes(cid) ? cid : 'artificial-intelligence';
    
    const db = {
      'artificial-intelligence': ["python", "sql", "pandas", "numpy", "scikit-learn", "tensorflow"],
      'data-science': ["python", "sql", "pandas", "numpy", "scikit-learn", "excel"],
      'data-analytics': ["python", "sql", "pandas", "numpy", "excel", "power-bi"],
      'cyber-security': ["linux", "windows", "wireshark", "bash", "network", "python"],
      'hr-mgmt': ["excel", "data-analytics", "power-bi", "nlp", "python", "sql"],
      'machine-learning': ["python", "numpy", "pandas", "scikit-learn", "xgboost", "flask"],
      'cloud-computing': ["windows", "linux", "python", "sql", "network", "bash"],
      'stock-market': ["excel", "data-analytics", "python", "pandas", "numpy", "sql"],
      'digital-marketing-cert': ["excel", "power-bi", "nlp", "python", "sql", "pandas"],
      'full-stack-web': ["react", "node.js", "python", "sql", "pandas", "numpy"]
    };
    
    return db[activeId === 'data-analytics' ? 'data-science' : activeId];
  };

  // Helper lookup function to render dynamic tools footer text on Page 14
  const getToolsFooter = (cid) => {
    const activeId = BOOKLET_COURSES.includes(cid) ? cid : 'artificial-intelligence';
    
    const db = {
      'artificial-intelligence': "Plus: Jupyter Notebooks, Hugging Face Transformers, Git, OpenAI APIs",
      'data-science': "Plus: Jupyter Notebooks, Anaconda Navigator, GitHub, Power BI DAX formulas",
      'data-analytics': "Plus: Excel VLOOKUP/Pivots, SQL Joins, Power BI desktop dashboard reports",
      'cyber-security': "Plus: Kali Linux commands, Nmap port scanning, Metasploit, SIEM tools, Burp Suite",
      'hr-mgmt': "Plus: ATS Screening keywords, KPI calculators, 360 Feedback sheets, Excel CTC models",
      'machine-learning': "Plus: Jupyter Notebook, Anaconda, XGBoost, Cross Validation, API deployment tools",
      'cloud-computing': "Plus: Microsoft Azure subscription portal, EC2 nodes, ARM templates, Azure VPNs",
      'stock-market': "Plus: Technical Candlestick charts, EV Valuations, SEBI compliances, SL Margin checks",
      'digital-marketing-cert': "Plus: Google ads, Meta Pixel targeting, WordPress design, SEO crawlers, Mailchimp",
      'full-stack-web': "Plus: Express.js routes, MongoDB Atlas collections, JWT tokens, Vercel deployments"
    };
    
    return db[activeId === 'data-analytics' ? 'data-science' : activeId];
  };
  // Render individual pages for the interactive 20-page booklet
  const renderPageContent = (page) => {
    const pageIsDark = isPageDark(page);
    const textPrimary = pageIsDark ? 'text-white' : 'text-slate-800';
    const textMuted = pageIsDark ? 'text-slate-350' : 'text-slate-500';
    const cardBg = pageIsDark ? 'bg-[#1E293B]/40 border-white/5' : 'bg-slate-50 border-slate-200';
    const badgeBg = pageIsDark ? 'bg-[#2A4BFF]/20 border-[#2A4BFF]/30 text-[#0EA5E9]' : 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple';

    switch (page) {
      case 1:
        return (
          <div className="flex flex-col justify-between h-full text-center relative overflow-hidden">
            {/* Ambient Background Grid for cover */}
            {pageIsDark && (
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
                backgroundImage: `linear-gradient(to right, #2A4BFF 1px, transparent 1px), linear-gradient(to bottom, #2A4BFF 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>
            )}
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${pageIsDark ? 'bg-[#2A4BFF]/20' : 'bg-[#2A4BFF]/5'}`}></div>
            <div className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${pageIsDark ? 'bg-[#0EA5E9]/15' : 'bg-[#0EA5E9]/5'}`}></div>

            <div className="flex justify-between items-center z-10">
              <span className={`logo-font text-xl font-bold tracking-tight ${textPrimary} flex items-center gap-2`}>
                <Brain className="w-5 h-5 text-[#0EA5E9] animate-pulse" />
                BeyondSkills
              </span>
              <span className={`text-[10px] font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider ${pageIsDark ? 'text-slate-400' : 'text-slate-600 bg-slate-100'}`}>
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
                  {course.title}
                </span>
              </h1>
              <p className={`text-xs sm:text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed font-mono ${textMuted}`}>
                {course.overview}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-200 dark:border-white/10 pt-6 mt-6 z-10">
              {[
                { label: "Duration", value: course.duration || "3 Months" },
                { label: "Delivery", value: "Live + Recorded" },
                { label: "Hands-on Tasks", value: course.mentorLedProjects || "10+ Projects" },
                { label: "Mentorship Focus", value: "Code Portfolio" }
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
                BeyondSkills is a Gurugram-based tech training academy and digital services agency. We train students and working professionals on practical tech stacks used in the industry.
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

      case 3: {
        const metrics = getMarketMetrics(course.id);
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Market Trajectory</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Why {course.title}?</h2>
              <p className={`text-xs sm:text-sm leading-relaxed font-mono ${textMuted}`}>
                The global corporate environment is pivoting aggressively toward digital workflow execution. Standard operational pipelines require automation.
              </p>
            </div>

            <div className="space-y-4 my-auto relative z-10">
              {metrics.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className={textPrimary}>{item.label}</span>
                    <span className="text-[#0EA5E9]">{item.percent}% Increase</span>
                  </div>
                  <div className={`w-full ${pageIsDark ? 'bg-slate-900 border-white/5' : 'bg-slate-200 border-slate-300'} h-2 rounded-full overflow-hidden border`}>
                    <div className="bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] h-full" style={{ width: `${item.percent}%` }}></div>
                  </div>
                  <p className="text-[9px] text-[#2A4BFF] dark:text-[#0EA5E9] font-mono leading-none">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

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
                { value: course.duration || "3 Months", label: "Program Duration", desc: "Active cohort tracking" },
                { value: "100+ Hours", label: "Coding & Mentorship", desc: "Live + Recorded sessions" },
                { value: course.mentorLedProjects || "10+ Projects", label: "Portfolio Tasks", desc: "Git repository builds" },
                { value: "Capstone", label: "Production Project", desc: "Evaluated by managers" },
                { value: "1 Year LMS", label: "Learning Portal Access", desc: "Code templates & videos" }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl text-center flex flex-col justify-between border ${cardBg}`}>
                  <span className="text-sm font-extrabold text-[#2A4BFF] dark:text-[#0EA5E9] block font-mono">{item.value}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider block font-mono mt-1 ${textPrimary}`}>{item.label}</span>
                  <span className="text-[8px] text-slate-450 dark:text-slate-400 font-mono mt-0.5 block">{item.desc}</span>
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
                Progress systematically from initial scripting to training machine learning algorithms and deploying operational models.
              </p>
            </div>

            <div className="my-auto grid grid-cols-2 md:grid-cols-5 gap-3.5 relative z-10 pt-4">
              {[
                { step: "01", name: "Python Basics", detail: "Syntax & file logic" },
                { step: "02", name: "Data Wrangling", detail: "NumPy & Pandas" },
                { step: "03", name: "BI & SQL", detail: "Database queries" },
                { step: "04", name: "Advanced Analytics", detail: "Model optimization" },
                { step: "05", name: "Deployments", detail: "API setups & Capstones" }
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl text-center relative flex flex-col justify-between border ${cardBg}`}>
                  <div className="absolute top-2 left-2 text-[#0EA5E9] text-[9px] font-mono font-bold">{item.step}</div>
                  <h4 className={`font-extrabold text-xs font-mono uppercase tracking-wide mt-4 ${textPrimary}`}>{item.name}</h4>
                  <p className="text-[9px] text-slate-400 font-mono mt-1 leading-tight">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="text-center bg-[#2A4BFF]/10 border border-[#2A4BFF]/20 text-[#2A4BFF] dark:text-[#0EA5E9] rounded-xl p-3 relative z-10 mt-4 text-[10px] font-mono">
              🚀 Final Capstone Project: Integrate your custom course project with live telemetry logs.
            </div>
          </div>
        );

      case 8:
      case 9:
      case 10:
      case 11:
      case 12: {
        const content = getSyllabusContent(course.id, page);
        return (
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>
                  {content.module}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {content.duration}
                </span>
              </div>
              <h2 className={`logo-font text-2xl font-bold ${textPrimary}`}>
                {content.title}
              </h2>
              <p className={`text-xs font-mono leading-relaxed ${textMuted}`}>
                {content.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto pt-2">
              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">
                  {content.sec1Title}
                </h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  {content.sec1Items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`p-4 rounded-xl border ${cardBg}`}>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-2 text-[#2A4BFF] dark:text-[#0EA5E9]">
                  {content.sec2Title}
                </h3>
                <ul className="space-y-1.5 text-[10px] font-mono">
                  {content.sec2Items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2A4BFF] dark:text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`p-3.5 rounded-xl border ${cardBg} md:col-span-2 flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-brand-purple" />
                  <div>
                    <h4 className={`font-bold text-xs font-mono uppercase ${textPrimary}`}>
                      {content.sec3Title}
                    </h4>
                    <p className="text-[9px] text-slate-500 font-mono">
                      {content.sec3Desc}
                    </p>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#2A4BFF] dark:text-[#0EA5E9] bg-[#2A4BFF]/10 px-2 py-0.5 rounded border border-[#2A4BFF]/20">
                  Active Q&A
                </span>
              </div>
            </div>
          </div>
        );
      }

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
              {course.projects.slice(0, 4).map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl flex flex-col justify-between border ${cardBg}`}>
                  <div>
                    <h4 className={`font-bold text-xs font-mono uppercase tracking-wide leading-tight ${textPrimary}`}>{item.title}</h4>
                    <p className={`text-[9px] font-mono mt-1 leading-snug ${textMuted}`}>{item.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.techUsed && item.techUsed.map((tech, tIdx) => (
                      <span key={tIdx} className="text-[8px] font-mono text-[#2A4BFF] dark:text-[#0EA5E9] bg-[#2A4BFF]/10 px-2 py-0.5 rounded border border-[#2A4BFF]/20 w-fit">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 14: {
        const tools = getToolsList(course.id);
        const toolsFooter = getToolsFooter(course.id);
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
              {tools.map((tool, idx) => (
                <div key={idx} className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border ${cardBg}`}>
                  <TechIcon name={tool} className="w-8 h-8" />
                  <span className={`text-[8px] font-mono font-bold uppercase tracking-wider block text-center truncate w-full ${textPrimary}`}>{tool}</span>
                </div>
              ))}
            </div>
            
            <div className={`text-[10px] font-mono text-center border-t pt-4 ${pageIsDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
              {toolsFooter}
            </div>
          </div>
        );
      }

      case 15:
        return (
          <div className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border ${badgeBg}`}>Developer Setup</span>
              <h2 className={`logo-font text-2xl sm:text-3xl font-bold ${textPrimary}`}>Developer Setup Suite</h2>
              <p className={`text-xs font-mono ${textMuted}`}>
                We provide technical setup support to ensure your portfolio projects are ready to showcase to employers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto relative z-10">
              {[
                { title: "GitHub Profile Tuning", desc: "Organize your code repositories to showcase your projects clearly.", tag: "Profile Setup" },
                { title: "Portfolio Web Hosting", desc: "Deploy your projects on live hosting platforms to demonstrate functionality.", tag: "Hosting" },
                { title: "Technical Code Audits", desc: "Review your code syntax and folder structures with mentors.", tag: "Code Quality" },
                { title: "Open Source Sharing", desc: "Make your project code public for the community and hiring managers.", tag: "Open Source" }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl space-y-1.5 flex flex-col justify-between border ${cardBg}`}>
                  <h4 className={`font-extrabold text-xs font-mono uppercase tracking-wide leading-tight ${textPrimary}`}>{item.title}</h4>
                  <p className={`text-[10px] font-mono mt-0.5 leading-snug ${textMuted}`}>{item.desc}</p>
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
                  <p className={`text-[10px] font-mono mt-2 leading-relaxed ${textMuted}`}>
                    Access our full database library of pre-recorded lectures and download templates to learn independently.
                  </p>
                </div>
                <div className={`border-t pt-3 mt-4 text-[9px] font-mono ${pageIsDark ? 'border-white/10 text-slate-450' : 'border-slate-200 text-slate-500'}`}>
                  Includes certification and code support.
                </div>
              </div>

              <div className="bg-[#2A4BFF]/10 border border-[#2A4BFF]/30 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[#0EA5E9] font-mono text-[9px] font-bold uppercase tracking-wider block">Live Cohort Track</span>
                  <h4 className={`font-extrabold text-sm font-mono mt-1 ${textPrimary}`}>Professional Track</h4>
                  <p className={`text-[10px] font-mono mt-2 leading-relaxed ${textMuted}`}>
                    Participate in weekend cohort workshops directed by EY/Nokia engineers. Backed by Slack support SLA channels.
                  </p>
                </div>
                <div className={`border-t pt-3 mt-4 text-[9px] font-mono ${pageIsDark ? 'border-white/10 text-[#0EA5E9]' : 'border-slate-200 text-brand-purple'} font-bold`}>
                  Includes project reviews & code audits.
                </div>
              </div>
            </div>
          </div>
        );

      case 17: {
        const mentorList = course.mentors && course.mentors.length > 0 
          ? course.mentors 
          : [
              { name: "Saurav Kumar Sinha", role: "Tietoevry | Ex-Nokia, Xiaomi, LnT, Capgemini", experience: "8+ Years" },
              { name: "Vinod Kumar Eslavath", role: "Assistant Manager - Data Scientist at Shemaroo", experience: "5+ Years" }
            ];
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
              {mentorList.slice(0, 2).map((mentor, idx) => (
                <div key={idx} className={`p-5 rounded-xl flex flex-col justify-between border ${cardBg}`}>
                  <div className="space-y-2">
                    <span className="text-[9px] text-[#0EA5E9] font-mono font-bold uppercase tracking-wider bg-[#2A4BFF]/25 px-2 py-0.5 rounded border border-[#2A4BFF]/30 w-fit block">{mentor.experience || "5+ Years"} Exp</span>
                    <h4 className={`font-extrabold text-xs font-mono uppercase tracking-wide mt-1 ${textPrimary}`}>{mentor.name}</h4>
                    <p className={`text-[9px] font-mono leading-none ${textMuted}`}>{mentor.role}</p>
                  </div>
                  <p className={`text-[10px] font-mono mt-3 leading-relaxed border-t pt-2 ${pageIsDark ? 'border-white/5 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
                    Guides preprocessing, scientific analysis, and core program architectures.
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 18: {
        const reviewObj = course.reviews && course.reviews[0] 
          ? course.reviews[0] 
          : { comment: "I've successfully finished my certification course. A big thank you to my mentors for their support.", user: "Aakash Sharma" };
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
                  "{reviewObj.comment}"
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-6 bg-[#2A4BFF] rounded-full"></div>
                  <div>
                    <h5 className={`text-[10px] font-bold uppercase tracking-wider font-mono ${textPrimary}`}>{reviewObj.user}</h5>
                    <span className="text-[9px] text-slate-400 font-mono block">{course.title} Student</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] font-mono text-[#2A4BFF] dark:text-[#0EA5E9] bg-[#2A4BFF]/10 border border-[#2A4BFF]/20 rounded-lg p-2.5">
              🏆 Verified credentials: Project completions issue cryptographic badges links directly for HR checks.
            </div>
          </div>
        );
      }

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
                  <p className={`text-[9px] font-mono mt-1 leading-snug ${textMuted}`}>{item.detail}</p>
                  <span className="text-[8px] font-mono text-[#2A4BFF] dark:text-[#0EA5E9] mt-3 font-bold block">{item.badge}</span>
                </div>
              ))}
            </div>

            <div className={`text-center text-[10px] font-mono ${pageIsDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
              <span className={`text-[9px] font-mono ${pageIsDark ? 'text-slate-400' : 'text-slate-500'}`}>
                BeyondSkills © 2026. All rights reserved.
              </span>
            </div>
          </div>
        );

      default:
        return <div>Page Not Found</div>;
    }
  };

  // Outer background is set to transparent to allow App.jsx grid pattern overlay to show behind
  const pageBgClass = isBookletMode && BOOKLET_COURSES.includes(course.id)
    ? 'bg-transparent text-slate-900'
    : 'bg-transparent text-slate-900';

  // Prevent vertical scrolling on desktop viewports in booklet mode
  const containerHeightClass = isBookletMode && BOOKLET_COURSES.includes(course.id)
    ? 'md:h-screen md:max-h-screen md:overflow-hidden'
    : 'min-h-screen';

  return (
    <div className={`relative overflow-x-hidden ${containerHeightClass} ${pageBgClass}`}>
      {/* Local Background Grid pattern forced inside for absolute visual clarity */}
      {isBookletMode && BOOKLET_COURSES.includes(course.id) && (
        <>
          <div className="bg-grid-glow"></div>
          <div className="bg-grid-pattern"></div>
        </>
      )}

      {/* Conditionally Render Booklet/PDF Reader or Standard Scrolling Web View */}
      {isBookletMode && BOOKLET_COURSES.includes(course.id) ? (
        <div className="relative z-10 pt-4 pb-4 px-4 max-w-6xl mx-auto flex flex-col justify-between h-full md:h-[calc(100vh-20px)] md:max-h-[calc(100vh-20px)]">
          {/* Header Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border p-4 rounded-2xl backdrop-blur-md mb-4 bg-white/95 border-slate-200 text-slate-800 shadow-sm">
            <div className="flex items-center space-x-3">
              <Link
                to={`/course/${course.id}`}
                className="text-slate-500 hover:text-brand-purple mr-2 flex items-center gap-1 font-mono text-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <span className="logo-font text-lg font-bold tracking-tight flex items-center gap-1.5 text-slate-900">
                <Brain className="w-5 h-5 text-[#2A4BFF]" />
                BeyondSkills
              </span>
              <span className="hidden sm:inline-block w-1.5 h-6 bg-brand-purple rounded-full"></span>
              <span className="hidden sm:inline-block text-xs font-mono font-bold text-slate-600">
                {course.title} Booklet
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              {/* Dropdown to jump directly to sections */}
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="border font-mono text-xs px-3 py-1.5 rounded-lg outline-none bg-slate-50 border-slate-200 text-slate-800"
                aria-label="Select brochure page"
              >
                <option value={1}>Page 1: Cover</option>
                <option value={2}>Page 2: Who We Are</option>
                <option value={3}>Page 3: Why {course.title}</option>
                <option value={4}>Page 4: Why BeyondSkills</option>
                <option value={5}>Page 5: Eligibility</option>
                <option value={6}>Page 6: Highlights</option>
                <option value={7}>Page 7: Roadmap</option>
                <option value={8}>Page 8: Module 1 Syllabus</option>
                <option value={9}>Page 9: Module 2 Syllabus</option>
                <option value={10}>Page 10: Module 3 Syllabus</option>
                <option value={11}>Page 11: Module 4 Syllabus</option>
                <option value={12}>Page 12: Module 5 Syllabus</option>
                <option value={13}>Page 13: Portfolio Projects</option>
                <option value={14}>Page 14: Tools Covered</option>
                <option value={15}>Page 15: Career Suite</option>
                <option value={16}>Page 16: Learning Pathways</option>
                <option value={17}>Page 17: Industry Faculty</option>
                <option value={18}>Page 18: Success & Reviews</option>
                <option value={19}>Page 19: Accreditations</option>
                <option value={20}>Page 20: Contact Admissions</option>
              </select>

              {/* Toggle to change view back to scrolling landing page */}
              <button
                onClick={() => setIsBookletMode(false)}
                className="border text-xs font-mono px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80"
                title="Switch to Scrolling Web Mode"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Scroll View</span>
              </button>
            </div>
          </div>

          {/* Centered Booklet Canvas Layout */}
          <div className="flex-grow flex items-center justify-center relative my-2">
            
            {/* Previous Page Floating Button Overlay */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="absolute left-0 md:-left-6 z-20 w-10 h-10 md:w-12 md:h-12 border rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl transition-all cursor-pointer hover:scale-105 disabled:opacity-30 disabled:pointer-events-none bg-white/95 border-slate-200 text-slate-800 hover:border-brand-purple/50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Page Slide Box (Responsive Height scaling with viewport) */}
            <div className={`w-full md:max-w-4xl md:h-[calc(100vh-230px)] md:max-h-[580px] md:aspect-[1.414] p-5 md:p-7 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
              isPageDark(currentPage)
                ? 'bg-[#060A24] border-white/10 text-white shadow-[0_20px_50px_rgba(42,75,255,0.15)]' 
                : 'bg-white border-slate-200 text-slate-800 shadow-[0_20px_40px_rgba(15,23,42,0.06)]'
            }`}>
              {renderPageContent(currentPage)}
            </div>

            {/* Next Page Floating Button Overlay */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="absolute right-0 md:-right-6 z-20 w-10 h-10 md:w-12 md:h-12 border rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl transition-all cursor-pointer hover:scale-105 disabled:opacity-30 disabled:pointer-events-none bg-white/95 border-slate-200 text-slate-800 hover:border-brand-purple/50"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Pagination & Progress Controls */}
          <div className="flex flex-col items-center space-y-2 mt-4 border p-4 rounded-2xl backdrop-blur-sm bg-white/80 border-slate-200 text-slate-800 shadow-sm">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-slate-500 hover:text-brand-purple font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                Previous
              </button>
              <span className="font-mono text-xs font-bold border px-3 py-1 rounded-lg bg-brand-purple/10 border-brand-purple/20 text-brand-purple">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="text-slate-500 hover:text-brand-purple font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
            
            {/* Completion Progress Bar */}
            <div className="w-full max-w-md bg-slate-200 h-1 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] h-full transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              ></div>
            </div>

            <div className="text-[10px] font-mono text-slate-500">
              💡 Hint: You can use your keyboard's <kbd className="bg-slate-100 text-slate-650 px-1 py-0.5 rounded border border-slate-200 font-bold">Left</kbd> and <kbd className="bg-slate-100 text-slate-650 px-1 py-0.5 rounded border border-slate-200 font-bold">Right</kbd> arrow keys to turn pages.
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* View Mode Panel for Web Mode */}
          {BOOKLET_COURSES.includes(course.id) && (
            <div className="relative z-20 max-w-7xl mx-auto px-4 mt-6">
              <div className="bg-[#0B0F19] border border-white/10 p-3 rounded-xl flex items-center justify-between text-white backdrop-blur-sm">
                <span className="text-xs font-mono font-bold text-[#0EA5E9] flex items-center gap-1.5">
                  <BookOpenCheck className="w-4 h-4" />
                  Try booklet/PDF reader mode for this course
                </span>
                <button
                  onClick={() => setIsBookletMode(true)}
                  className="bg-[#2D43B8] hover:brightness-110 text-white font-mono text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Switch to Booklet Mode</span>
                </button>
              </div>
            </div>
          )}

          {/* Premium Hero Section */}
          <section className="relative z-10 pt-12 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-transparent">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Hero Left Content */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <span className="inline-flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-[#2D43B8] bg-[#2D43B8]/10 border border-[#2D43B8]/20 px-3 py-1.5 rounded-full font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Premium {course.title} Program</span>
                </span>
                <h1 className="font-manrope font-extrabold text-slate-900 text-4xl sm:text-6xl tracking-tight leading-[1.08] mt-2">
                  Build the Future with <span className="text-[#2D43B8]">{course.title}</span>
                </h1>
                <p className="text-slate-650 text-sm sm:text-base leading-relaxed max-w-xl font-inter">
                  {course.overview}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a 
                    href="#enquiry-form-section"
                    className="bg-[#2D43B8] text-white hover:brightness-110 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#2D43B8]/20 text-center cursor-pointer"
                  >
                    Apply Now
                  </a>
                  <button 
                    onClick={downloadSyllabusMock}
                    className="bg-[#F5F7FA] border border-slate-200 text-[#111111] hover:bg-slate-100 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 text-center flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Syllabus Guide</span>
                  </button>
                  <a 
                    href="#enquiry-form-section"
                    className="bg-transparent border-b-2 border-slate-300 hover:border-[#2D43B8] text-slate-700 hover:text-slate-900 px-4 py-2 font-bold text-xs uppercase tracking-widest transition-all text-center cursor-pointer"
                  >
                    Talk to Counselor
                  </a>
                </div>
              </div>

              {/* Hero Right: Interactive AI Sandbox */}
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
                          className="bg-[#2D43B8] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
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

            {/* Highlights Statistics Grid */}
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { metric: course.duration, label: 'Program Duration', icon: Clock },
                { metric: '40 Hours', label: 'Live Mentor Training', icon: BookOpen },
                { metric: course.mentorLedProjects, label: 'Hands-on Projects', icon: Code },
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
          </section>

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
                {datasetsList && datasetsList.length > 0 ? (
                  datasetsList.map((dataset, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl border ${idx === 0 ? 'bg-[#0B0F19] text-white border-white/5 col-span-1 sm:col-span-2' : 'bg-slate-50 border-slate-200/65 text-slate-800'} space-y-4 hover:shadow-md transition-all duration-300`} >
                      <span className={`text-[10px] ${idx === 0 ? 'text-[#0EA5E9]' : 'text-[#2D43B8]'} font-bold tracking-widest uppercase block font-mono`}>{dataset.label}</span>
                      <h3 className={`text-xl sm:text-2xl font-extrabold font-manrope ${idx === 0 ? 'text-white' : 'text-slate-900'}`}>{dataset.projected}</h3>
                      <p className={`text-xs ${idx === 0 ? 'text-slate-400' : 'text-slate-505'} leading-relaxed font-inter`}>
                        {dataset.details}
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-[#0B0F19] text-white p-6 rounded-2xl border border-white/5 space-y-4">
                      <span className="text-[10px] text-[#0EA5E9] font-bold tracking-widest uppercase block font-mono">Market Demand</span>
                      <h3 className="text-xl sm:text-2.5xl font-extrabold font-manrope text-white">36% CAGR Growth</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-inter">
                        The global AI & analytics software market is expanding at a record pace. Traditional roles are transitioning rapidly into automation pipelines, requiring active training.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl space-y-4">
                      <span className="text-[10px] text-[#2D43B8] font-bold tracking-widest uppercase block font-mono">Average Packages</span>
                      <h3 className="text-xl sm:text-2.5xl font-extrabold font-manrope text-slate-900">₹6.5 - 12 LPA</h3>
                      <p className="text-xs text-slate-505 leading-relaxed font-inter">
                        Data scientists and neural network developers command some of the highest salaries for entry-level developers in the Indian technology industry.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 3: Animated Learning Journey Roadmap */}
          <section className="py-16 bg-[#0B0F19] text-white relative overflow-hidden z-10 border-t border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,67,184,0.08),transparent_40%)]"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[#0EA5E9] text-[10px] font-extrabold tracking-widest uppercase border border-[#0EA5E9]/20 px-3 py-1 rounded bg-[#0EA5E9]/5 font-mono">
                  Learning Journey
                </span>
                <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
                  Your Professional Roadmap
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

          {/* SECTION 4: Curriculum Overview Grid */}
          <section id="curriculum" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
                Curriculum Grid
              </span>
              <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-4 tracking-tight">
                Academic Curriculum Syllabus
              </h2>
              <p className="text-slate-505 text-sm">
                {['artificial-intelligence', 'machine-learning'].includes(course.id)
                  ? 'Categorized into four core fields of data science and artificial intelligence engineering.'
                  : 'Detailed learning modules structured to scale your technical knowledge systematically.'}
              </p>
            </div>

            {/* Standard Tab Controls for AI / ML */}
            {['artificial-intelligence', 'machine-learning'].includes(course.id) ? (
              <>
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                  {Object.keys(curriculumCategories).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCurriculumTab(key)}
                      className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${selectedCurriculumTab === key ? 'bg-[#2D43B8] text-white border-[#2D43B8] shadow-lg shadow-[#2D43B8]/10' : 'bg-slate-50 text-slate-655 border-slate-200 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                      {curriculumCategories[key].title}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="bg-[#F5F7FA] border border-slate-200/60 rounded-3xl p-8 sm:p-10 shadow-sm animate-fade-in">
                  <div className="max-w-3xl mb-8">
                    <h3 className="font-manrope font-extrabold text-[#111111] text-xl sm:text-2.5xl mb-2">
                      {curriculumCategories[selectedCurriculumTab].title}
                    </h3>
                    <p className="text-slate-505 text-xs sm:text-sm leading-relaxed font-inter">
                      {curriculumCategories[selectedCurriculumTab].description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {curriculumCategories[selectedCurriculumTab].items.map((item, idx) => (
                      <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl space-y-2.5 hover:shadow-md transition-shadow animate-fade-in">
                        <div className="flex items-center space-x-2 text-[#2D43B8]">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{item.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-505 leading-relaxed font-inter pl-6">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              // Reusable module fallback for other courses
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                {course.curriculum && course.curriculum.map((module, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl hover:border-[#2D43B8]/20 transition-all group shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-[#2D43B8] uppercase bg-[#2D43B8]/5 border border-[#2D43B8]/10 px-2.5 py-1 rounded-md font-mono">{module.week}</span>
                    </div>
                    <h3 className="font-manrope font-bold text-slate-900 text-lg group-hover:text-[#2D43B8] transition-colors">{module.title}</h3>
                    <ul className="mt-4 space-y-2.5">
                      {module.topics && module.topics.map((topic, tIdx) => (
                        <li key={tIdx} className="flex items-start space-x-2 text-xs text-slate-650 leading-relaxed font-inter">
                          <Check className="w-3.5 h-3.5 text-[#2D43B8] mt-0.5 flex-shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 5: Projects Showcase */}
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
                  Construct advanced intelligence models, deploy API endpoints, and host them live using GitHub workflows.
                </p>
              </div>

              {/* Dynamic Projects Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {course.projects && course.projects.map((project, idx) => (
                  <div key={idx} className="bg-slate-900 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-brand-cyan/30 transition-all duration-300 relative group">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-[#0EA5E9] uppercase border border-[#0EA5E9]/20 px-2.5 py-0.5 rounded bg-[#0EA5E9]/5 font-mono">
                          Industrial Capstone
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Verifiable Repo
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight group-hover:text-brand-cyan transition-colors">{project.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-inter">{project.description}</p>
                    </div>

                    <div className="border-t border-white/10 pt-4 mt-6">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techUsed && project.techUsed.map((t, tIdx) => (
                          <span key={tIdx} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">
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

          {/* SECTION 6: Tools Covered Badges */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-[#2D43B8] text-xs font-bold tracking-widest uppercase">
                Modern Tech Stack
              </span>
              <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-4 tracking-tight">
                Tools & Engineering Platforms
              </h2>
              <p className="text-slate-500 text-sm font-inter">
                Work with platforms deployed at leading technology organizations.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
              {course.techStack && course.techStack.map((tech, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/60 px-5 py-3 rounded-xl flex items-center space-x-2.5 hover:border-[#2D43B8]/20 transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
                  <TechIcon name={tech} className="w-5 h-5" />
                  <span className="text-xs font-bold text-slate-800 tracking-wide uppercase font-mono">{tech}</span>
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
                  Career Paths After This Program
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
                    <p className="text-xs text-slate-505 leading-relaxed font-inter">{role.desc}</p>
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
                    onClick={() => toggleModule(idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between text-slate-900 hover:text-[#2D43B8] transition-colors cursor-pointer focus:outline-none"
                  >
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">{item.q}</span>
                    {expandedModules[idx] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedModules[idx] && (
                    <div className="px-6 pb-6 text-xs sm:text-sm text-slate-505 leading-relaxed border-t border-slate-200/40 pt-4 font-inter animate-fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 9: FINAL CTA & ENQUIRY FORM */}
          <section id="enquiry-form-section" className="relative z-10 py-20 bg-[#F5F7FA] border-t border-[#E5E7EB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Left Column: CTA Context */}
                <div className="space-y-6 text-left">
                  <span className="inline-flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-[#2D43B8] bg-[#2D43B8]/10 border border-[#2D43B8]/20 px-3 py-1 rounded font-mono">
                    Admissions Open
                  </span>
                  <h2 className="font-manrope font-extrabold text-[#111111] text-3xl sm:text-5xl leading-tight">
                    Build Your Future in <span className="text-[#2D43B8]">{course.title}</span>
                  </h2>
                  <p className="text-slate-505 text-xs sm:text-sm leading-relaxed max-w-md font-inter">
                    Register details to schedule a live training counseling session. Download the syllabus models and receive detailed briefs from academy mentors.
                  </p>
                  
                  {/* Compliance note */}
                  <div className="flex items-start space-x-3 bg-white border border-slate-200 p-4 rounded-xl max-w-md">
                    <ShieldAlert className="w-5 h-5 text-[#2D43B8] flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-505 leading-relaxed font-inter">
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
                        <label htmlFor="brochure-status" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Current Status *</label>
                        <select 
                          id="brochure-status"
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
        </>
      )}
    </div>
  );
}
