// Mock Database for BeyondSkills platform content and localStorage persistence

export const COURSES = [
  {
    id: 'artificial-intelligence',
    techStack: ['Python', 'Neural Networks', 'NLP', 'Generative AI', 'TensorFlow', 'Hugging Face'],
    title: 'Artificial Intelligence',
    category: 'AI/ML/DS/DA',
    level: 'Basic to Intermediate',
    duration: '3 Months',
    fee: 14000,
    originalFee: 16000,
    selfPacedFee: 6000,
    selfPacedOriginalFee: 8000,
    mentorLedHours: '30+ Hours Live Training',
    mentorLedProjects: '3 Projects',
    selfPacedHours: '25–30 Hours Recorded Content',
    selfPacedProjects: '2 Projects',
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.8,
    enrollments: '1,250+',
    overview: 'Understand neural networks, natural language processing (NLP), computer vision, and generative AI frameworks using Python and modern library architectures.',
    curriculum: [
      {
        week: 'Weeks 1-4',
        title: 'Neural Networks & Deep Learning Foundations',
        topics: [
          'Installation of Anaconda Prompt & Jupyter Notebook overview',
          'Introduction to Neural Networks and activation functions',
          'Building simple neural network architectures with TensorFlow',
          'Hyperparameter tuning, optimizer selection, and learning rates'
        ]
      },
      {
        week: 'Weeks 5-8',
        title: 'Natural Language Processing (NLP)',
        topics: [
          'Basics of NLP: Tokenization, Stemming, and Lemmatization',
          'Working with NLTK, SpaCy, and TF-IDF representations',
          'Word embeddings: Word2Vec, GloVe, and FastText',
          'Introduction to transformers and pre-trained language models'
        ]
      },
      {
        week: 'Weeks 9-12',
        title: 'Generative AI & LLM APIs',
        topics: [
          'Hugging Face pipelines for text classification and translation',
          'Generative AI fundamentals: OpenAI APIs and prompt engineering',
          'Designing custom AI chat agents and deploying pipelines',
          'DALL-E, ChatGPT, and corporate use cases for generative AI'
        ]
      }
    ],
    projects: [
      {
        title: 'NLP Custom Text Classifier',
        description: 'Build an intent-detection system using NLTK and Hugging Face Transformers to classify user queries and automate support workflow tags.',
        techUsed: ['Python', 'Hugging Face', 'NLP', 'NLTK']
      },
      {
        title: 'Custom Chat Agent with OpenAI API',
        description: 'Design and deploy an intelligent assistant that parses business document sheets to resolve client technical support queries.',
        techUsed: ['Python', 'Generative AI', 'API Integration']
      }
    ],
    mentors: [
      { name: 'Saurav Kumar Sinha', role: 'Tietoevry | Ex-Nokia, Xiaomi, LnT, Capgemini', experience: '8+ Years' },
      { name: 'Vinod Kumar Eslavath', role: 'Assistant Manager - Data Scientist at Shemaroo', experience: '5+ Years' }
    ],
    outcomes: [
      'Understand and apply neural networks and deep learning architectures.',
      'Process textual data and construct NLP preprocessing pipelines.',
      'Leverage pre-trained transformers and large language model APIs.',
      'Deploy generative AI models to build custom corporate applications.'
    ],
    faqs: [
      { q: 'Who is this course for?', a: 'Undergraduate and postgraduate students, graduates, and professionals wanting to transition into AI and NLP engineering.' },
      { q: 'What certificates will I receive?', a: 'You will receive 2 certificates: a course completion certificate and a project completion certificate.' }
    ],
    reviews: [
      { user: 'Manshi Srivastav', rating: 5, comment: 'I’ve successfully finished my AI course. A big thank you to my mentors for their continuous support. This journey has enriched my skills and provided clarity on my career path.', date: 'May 2026' }
    ]
  },
  {
    id: 'machine-learning',
    techStack: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Scikit-Learn'],
    title: 'Machine Learning',
    category: 'AI/ML/DS/DA',
    level: 'Basic to Intermediate',
    duration: '3 Months',
    fee: 14000,
    originalFee: 16000,
    selfPacedFee: 6000,
    selfPacedOriginalFee: 8000,
    mentorLedHours: '30+ Hours Live Training',
    mentorLedProjects: '3 Projects',
    selfPacedHours: '25–30 Hours Recorded Content',
    selfPacedProjects: '2 Projects',
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.8,
    enrollments: '1,450+',
    overview: 'Master supervised and unsupervised machine learning algorithms, model evaluation metrics, and feature engineering techniques using Python and Scikit-Learn.',
    curriculum: [
      {
        week: 'Weeks 1-4',
        title: 'Data Preprocessing & Python Libraries',
        topics: [
          'Python programming basics: Loops, lists, and directories',
          'Data manipulation with NumPy array calculations',
          'Pandas library for filtering, cleaning, and grouping datasets',
          'Data visualization with Matplotlib and Seaborn charts'
        ]
      },
      {
        week: 'Weeks 5-8',
        title: 'Supervised Learning Algorithms',
        topics: [
          'Linear Regression and Logistic Regression mathematics',
          'Model evaluation metrics: MSE, R2, Accuracy, Precision, Recall',
          'Tree-based algorithms: Decision Trees, Bagging, and Random Forests',
          'Boosting models (XGBoost, AdaBoost) for structured data prediction'
        ]
      },
      {
        week: 'Weeks 9-12',
        title: 'Unsupervised Learning & Model Selection',
        topics: [
          'Clustering models: K-Means and Hierarchical clustering',
          'Dimensionality reduction using Principal Component Analysis (PCA)',
          'Hyperparameter tuning and cross-validation techniques',
          'Building and deploying end-to-end machine learning pipelines'
        ]
      }
    ],
    projects: [
      {
        title: 'Predictive Customer Churn Model',
        description: 'Implement a machine learning pipeline to preprocess customer data, scale features, and train Random Forest models to predict subscriber churn.',
        techUsed: ['Python', 'Pandas', 'Scikit-Learn', 'Seaborn']
      },
      {
        title: 'House Price Forecasting Pipeline',
        description: 'Train a regression pipeline using boosting models to forecast real estate prices based on geographical and structural features.',
        techUsed: ['Python', 'Scikit-Learn', 'XGBoost']
      }
    ],
    mentors: [
      { name: 'Uttam Grade', role: 'EY | Ex-Accenture, McKinsey', experience: '6+ Years' },
      { name: 'Vinod Kumar Eslavath', role: 'Assistant Manager - Data Scientist at Shemaroo', experience: '5+ Years' }
    ],
    outcomes: [
      'Clean, pre-process, and visualize complex datasets in Python.',
      'Train, evaluate, and tune supervised classification and regression models.',
      'Apply unsupervised clustering algorithms to segments and group data points.',
      'Deploy robust machine learning prediction pipelines.'
    ],
    faqs: [
      { q: 'Is this course suitable for beginners?', a: 'Yes! We start from basic Python syntax, so no prior programming background is required.' },
      { q: 'Will I build projects?', a: 'Yes, you will complete hands-on machine learning projects utilizing real-world datasets.' }
    ],
    reviews: [
      { user: 'Rakesh Rana', rating: 5, comment: 'Delighted to have achieved my certification in Machine Learning! Grateful to BeyondSkills for their constant support and mentorship.', date: 'June 2026' }
    ]
  },
  {
    id: 'full-stack-web',
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    title: 'Full Stack Web Development (MERN)',
    category: 'Full Stack Development',
    level: 'Basic to Intermediate',
    duration: '4 Months',
    fee: 15000,
    originalFee: 18000,
    selfPacedFee: 6000,
    selfPacedOriginalFee: 8000,
    mentorLedHours: '40+ Hours Live Training',
    mentorLedProjects: '3 Projects',
    selfPacedHours: '25–30 Hours Recorded Content',
    selfPacedProjects: '2 Projects',
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.7,
    enrollments: '4,500+',
    overview: 'Learn modern web development using HTML5, CSS3, JavaScript, React, Node.js, Express, and MongoDB. Build real-world web applications and deploy them to the cloud.',
    curriculum: [
      { 
        week: 'Weeks 1-4', 
        title: 'Frontend Foundations: HTML5, CSS3, & Modern JavaScript',
        topics: ['Semantic HTML5 Markup', 'CSS3 Layouts: Flexbox & CSS Grid', 'Responsive Web Design & Media Queries', 'Tailwind CSS utility framework integration', 'JavaScript ES6+ core: Variables, Scopes, Arrays, Objects', 'DOM Manipulation & Event Listeners', 'Asynchronous JS: Callbacks, Promises, Async/Await', 'Fetch API & consuming REST endpoints']
      },
      { 
        week: 'Weeks 5-8', 
        title: 'Component Architectures & React.js Development',
        topics: ['Introduction to React & Single Page Apps (SPAs)', 'JSX Syntax & Virtual DOM', 'Functional Components, Props, & State', 'React Hooks: useState, useEffect, useRef', 'Custom Hooks & State Management (Context API)', 'React Router for client-side navigation', 'Form Handling, Validation (Formik/Yup), & Error Boundaries', 'Styling React apps with Tailwind & CSS Modules']
      },
      { 
        week: 'Weeks 9-12', 
        title: 'Backend Engineering: Node.js, Express.js, & MongoDB',
        topics: ['Introduction to Server-side Runtime (Node.js)', 'npm (Node Package Manager) & module patterns', 'Express.js Framework: Server setup & Routing', 'Writing Custom Express Middleware', 'REST API Architecture Principles', 'NoSQL Database fundamentals & MongoDB Atlas', 'Mongoose ODM: Schemas, Models, & Validations', 'CRUD Operations & database relation concepts']
      },
      { 
        week: 'Weeks 13-16', 
        title: 'Advanced Operations, Authentication, & Cloud Deployment',
        topics: ['JSON Web Tokens (JWT) for secure authentication', 'Password Hashing using bcrypt', 'Route Protection & Role-based Access Control', 'Integrating Frontend & Backend (CORS & Proxy)', 'WebSockets (Socket.io) for real-time channels', 'File Uploads with Multer & Cloudinary', 'Testing APIs with Postman', 'Production Build & Deployment (Vercel, Render, Heroku)']
      }
    ],
    projects: [
      {
        title: 'SaaS Business Operations Dashboard',
        description: 'A responsive dashboard application featuring secure JWT authentication, lead pipelines, client status toggles, dynamic chart reporting, and roles.',
        techUsed: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS']
      },
      {
        title: 'Real-time Cooperative Kanban Workspace',
        description: 'A collaborative board app enabling users to organize task cards, live chat with team members, drag cards, and trace update history feeds.',
        techUsed: ['React', 'Socket.io', 'Express', 'MongoDB', 'Tailwind CSS']
      }
    ],
    mentors: [
      { name: 'Vikram Aditya', role: 'Staff Engineer at Swiggy', experience: '9+ Years' },
      { name: 'Neha Gupta', role: 'Senior React Developer', experience: '5+ Years' }
    ],
    outcomes: [
      'Build responsive, highly interactive web applications using React.',
      'Design and secure robust RESTful APIs, routing mechanisms, and data schemas.',
      'Manage NoSQL databases (MongoDB Atlas) and write complex queries with Mongoose.',
      'Deploy full-stack applications to platforms like Vercel and Render with live logs.'
    ],
    faqs: [
      { q: 'Do I need prior coding experience?', a: 'No, we start from absolute basics, making it perfect for fresh graduates and career switchers.' },
      { q: 'Will I learn database management?', a: 'Yes, MongoDB is covered extensively along with Mongoose ODM.' }
    ],
    reviews: [
      { user: 'Rohan Gupta', rating: 5, comment: 'Amazing mentors! The curriculum is extremely up-to-date.', date: 'April 2026' },
      { user: 'Sneha Patel', rating: 5, comment: 'Built 3 major full-stack projects which look great on my resume.', date: 'May 2026' }
    ]
  },
  {
    id: 'digital-marketing-cert',
    techStack: ['Google Ads', 'Meta Ads', 'Google Analytics', 'SEO', 'Email Marketing'],
    title: 'Digital Marketing',
    category: 'Digital Marketing',
    level: 'Basic to Intermediate',
    duration: '3 Months',
    fee: 12000,
    originalFee: 15000,
    selfPacedFee: 5000,
    selfPacedOriginalFee: 7000,
    mentorLedHours: '24+ Hours Live Training',
    mentorLedProjects: '2 Projects',
    selfPacedHours: '25–30 Hours Recorded Content',
    selfPacedProjects: '2 Projects',
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.6,
    enrollments: '1,800+',
    overview: 'Master SEO, Content Marketing, Google Ads, Meta Ads (Facebook & Instagram), Email Marketing, and Analytics (GA4) to drive high ROI lead-generation.',
    curriculum: [
      { 
        week: 'Weeks 1-2', 
        title: 'Digital Marketing Fundamentals & Search Engine Optimization (SEO)',
        topics: ['Digital Marketing Landscape & Customer Journey', 'Keyword Research: Volume, Intent, & Competitiveness', 'On-Page SEO: Title Tags, Meta Descriptions, Headers, URL Structures', 'Technical SEO: XML Sitemaps, Robots.txt, Page Speed, Core Web Vitals', 'Off-Page SEO: Backlink Building & Domain Authority', 'SEO Audit Tools (Ahrefs, SEMrush, Screaming Frog)']
      },
      { 
        week: 'Weeks 3-5', 
        title: 'Paid Advertising Campaigns (Google Ads & Meta Campaigns)',
        topics: ['Google Ads Account Setup & Structure', 'Search Campaigns: Ad Groups, Bidding Strategies, Quality Score', 'Display & YouTube Video Ad Campaigns', 'Meta Ads Manager: Campaign Goals, Target Audiences, Ad Formats', 'Pixel Setup & Custom Conversion Events', 'A/B Testing Creatives & Copywriting for High Conversions']
      },
      { 
        week: 'Weeks 6-7', 
        title: 'Content Strategy, Email Marketing & Automations',
        topics: ['Content Marketing: Creating Calendars & Lead Magnets', 'Copywriting Formulas (AIDA, PAS) for Social Media & Web', 'Email Marketing tools (Mailchimp, ActiveCampaign)', 'Building & Segmenting Email Lists', 'Setting up Email Automations & drip campaigns', 'Landing Page design principles & Conversion Rate Optimization (CRO)']
      },
      { 
        week: 'Weeks 8', 
        title: 'Google Analytics (GA4), Campaign Auditing, & Analysis',
        topics: ['Google Analytics (GA4) setup & event tracking', 'Analyzing Traffic Channels & User Behavior logs', 'UTM Parameter tracking & Attribution models', 'Auditing active ad campaigns & budget optimization guides', 'Final Marketing Capstone Presentation']
      }
    ],
    projects: [
      {
        title: 'High-Conversion Ad Campaign Blueprint',
        description: 'Audit a business landing page, perform keyword research, build active search campaigns, design Meta ads creatives, and configure GA4 tracking goals.',
        techUsed: ['Google Ads', 'Meta Ads', 'Google Analytics (GA4)', 'Mailchimp']
      }
    ],
    mentors: [
      { name: 'Kunal Sen', role: 'Digital Lead at Ogilvy', experience: '7+ Years' },
      { name: 'Riddhima Das', role: 'Growth Hacker & Ex-Consultant', experience: '5+ Years' }
    ],
    outcomes: [
      'Create and optimize high-converting Google & Meta ad campaigns from scratch.',
      'Analyze traffic sources and sales funnels using Google Analytics (GA4).',
      'Conduct keyword research and implement SEO guidelines for web pages.',
      'Formulate organic content calendar strategies and automated email drips for brands.'
    ],
    faqs: [
      { q: 'Are ad budgets included in the fee?', a: 'No, the fee covers training and live sessions. We provide simulated environments and small budgets during live projects.' }
    ],
    reviews: [
      { user: 'Karthik S.', rating: 4, comment: 'Learnt Facebook ads targeting setup. Very practical and structured.', date: 'May 2026' }
    ]
  },
  {
    id: 'data-science',
    techStack: ['Python', 'SQL', 'Pandas', 'NumPy', 'Statistics'],
    title: 'Data Science',
    category: 'AI/ML/DS/DA',
    level: 'Basic to Intermediate',
    duration: '3 Months',
    fee: 14000,
    originalFee: 16000,
    selfPacedFee: 6000,
    selfPacedOriginalFee: 8000,
    mentorLedHours: '30+ Hours Live Training',
    mentorLedProjects: '3 Projects',
    selfPacedHours: '25–30 Hours Recorded Content',
    selfPacedProjects: '2 Projects',
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.7,
    enrollments: '1,100+',
    overview: 'Learn statistics, data preprocessing, SQL database querying, exploratory analysis in Pandas, and predictive models in Python.',
    curriculum: [
      { 
        week: 'Weeks 1-4', 
        title: 'Relational Databases & SQL Querying',
        topics: ['Database Fundamentals & ER Diagrams', 'SQL Basics: SELECT, WHERE, ORDER BY', 'Aggregations: GROUP BY, HAVING', 'JOINS (Inner, Left, Right, Full Outer)', 'Subqueries & Common Table Expressions (CTEs)']
      },
      { 
        week: 'Weeks 5-8', 
        title: 'Python for Data Science & Pandas',
        topics: ['Python data structures: Lists, Tuples, Dictionaries', 'Data loading & filtering in Pandas', 'NumPy for numerical calculations', 'Data cleaning and handling missing values']
      },
      { 
        week: 'Weeks 9-12', 
        title: 'Statistical Analysis & Predictive Modeling',
        topics: ['Descriptive Statistics: Mean, Median, Mode, Variance', 'Correlation and Hypothesis Testing', 'Linear and Logistic Regression forecasting models', 'Data Storytelling & Capstone project review']
      }
    ],
    projects: [
      {
        title: 'Global Cohort Retention & Churn Profiler',
        description: 'An analytical pipeline extracting relational database tables via SQL, performing cohort analysis in Python, and modeling future client churn patterns.',
        techUsed: ['SQL', 'Python', 'Pandas']
      }
    ],
    mentors: [
      { name: 'Dr. Aris Rawat', role: 'Ex-Data Scientist at Microsoft', experience: '8+ Years' },
      { name: 'Riddhima Das', role: 'Growth Hacker & Ex-Consultant', experience: '5+ Years' }
    ],
    outcomes: [
      'Write optimized SQL queries for extracting datasets.',
      'Clean, pre-process, and analyze raw unstructured data in Python.',
      'Apply descriptive and inferential statistics to extract metrics.',
      'Build basic predictive modeling pipelines.'
    ],
    faqs: [
      { q: 'Do I need a mathematical background?', a: 'Basic math and logic are sufficient. We teach all statistical concepts step-by-step from scratch.' }
    ],
    reviews: [
      { user: 'Karthik S.', rating: 5, comment: 'Excellent data science sessions. Kept stats clear and practical.', date: 'May 2026' }
    ]
  },
  {
    id: 'data-analytics',
    techStack: ['Excel', 'SQL', 'PowerBI', 'Tableau', 'Dashboard Design'],
    title: 'Data Analytics',
    category: 'AI/ML/DS/DA',
    level: 'Basic to Intermediate',
    duration: '3 Months',
    fee: 14000,
    originalFee: 16000,
    selfPacedFee: 6000,
    selfPacedOriginalFee: 8000,
    mentorLedHours: '30+ Hours Live Training',
    mentorLedProjects: '3 Projects',
    selfPacedHours: '25–30 Hours Recorded Content',
    selfPacedProjects: '2 Projects',
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.7,
    enrollments: '1,200+',
    overview: 'Master data visualization and business intelligence by querying databases with SQL, organizing data in Excel, and building interactive dashboards in PowerBI and Tableau.',
    curriculum: [
      { 
        week: 'Weeks 1-4', 
        title: 'Advanced Excel & SQL Data Wrangling',
        topics: ['Excel functions: VLOOKUP, INDEX-MATCH, Pivot Tables', 'SQL database querying and joins', 'Aggregations and CTEs for data extraction', 'SQL Window Functions (ROW_NUMBER, RANK, LEAD, LAG)']
      },
      { 
        week: 'Weeks 5-8', 
        title: 'PowerBI Dashboard Design & Modeling',
        topics: ['PowerBI Desktop Interface & Workspace layout', 'Data modelling: Star & Snowflake schemas', 'Writing DAX (Data Analysis Expressions) Measures', 'Designing interactive multi-page dashboards']
      },
      { 
        week: 'Weeks 9-12', 
        title: 'Tableau Visualization & Business Reports',
        topics: ['Tableau Desktop: Connections, Worksheets, & Stories', 'Creating Calculated Fields & Parameters in Tableau', 'Dashboard Publishing and Security Best Practices', 'Structuring analytical reports for business stakeholders']
      }
    ],
    projects: [
      {
        title: 'E-commerce Sales Performance Dashboard',
        description: 'An interactive multi-page dashboard built in PowerBI visualizing user retention, product category sales, monthly revenue trends, and geo-analytics.',
        techUsed: ['PowerBI', 'SQL', 'Excel']
      }
    ],
    mentors: [
      { name: 'Dr. Aris Rawat', role: 'Ex-Data Scientist at Microsoft', experience: '8+ Years' },
      { name: 'Riddhima Das', role: 'Growth Hacker & Ex-Consultant', experience: '5+ Years' }
    ],
    outcomes: [
      'Extract datasets from relational databases using SQL.',
      'Organize and analyze datasets using advanced Excel formulas.',
      'Design corporate dashboards in PowerBI and Tableau.',
      'Present findings through compelling data visualization stories.'
    ],
    faqs: [
      { q: 'Will I learn database management?', a: 'Yes, relational database querying via SQL is covered extensively.' }
    ],
    reviews: [
      { user: 'Karthik S.', rating: 5, comment: 'Excellent dashboarding sessions. Learned Tableau from absolute scratch.', date: 'May 2026' }
    ]
  },
  {
    id: 'hr-mgmt',
    techStack: ['ATS Systems', 'Payroll Tools', 'HR Analytics', 'Excel'],
    title: 'Human Resource Management & Operations',
    category: 'HR',
    level: 'Basic to Intermediate',
    duration: '2 Months',
    fee: 9000,
    originalFee: 12000,
    selfPacedFee: 5000,
    selfPacedOriginalFee: 7000,
    mentorLedHours: '18+ Hours Live Training',
    mentorLedProjects: '3 Case Studies',
    selfPacedHours: '25–30 Hours Recorded Content',
    selfPacedProjects: '2 Case Studies',
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.5,
    enrollments: '800+',
    overview: 'Learn modern HR practices, recruitment strategies, onboarding, HR analytics, payroll administration, and employee relations.',
    curriculum: [
      { 
        week: 'Weeks 1-2', 
        title: 'Talent Acquisition, ATS Systems, & Sourcing Strategies',
        topics: ['Manpower Planning & Job Description (JD) Writing', 'Sourcing Channels: LinkedIn Recruiting, Job Portals, & Referrals', 'Applicant Tracking Systems (ATS) configurations', 'Structuring Resumes & Screenings', 'Interviewing Models: Behavioral & Situational', 'Offer Management & Candidate Communication']
      },
      { 
        week: 'Weeks 3-4', 
        title: 'Employee Lifecycle, Onboarding, & Policy Design',
        topics: ['Designing Employee Onboarding Journeys', 'Employee Engagement frameworks & surveys', 'Performance Management Systems (PMS): OKRs & KPIs', 'Designing HR Manuals & Code of Conduct guidelines', 'Offboarding processes & Exit Interviews']
      },
      { 
        week: 'Weeks 5-6', 
        title: 'Payroll Administration, Labor Laws, & Statutory Compliances',
        topics: ['Compensation & Benefits structure (CTC breakup)', 'Payroll processing inputs (Attendance, LOP, Deductions)', 'Understanding PF, ESIC, Professional Tax, & Gratuity', 'Overview of key Labor Laws (Factories Act, Industrial Disputes)', 'Managing employee relations & conflict resolution']
      },
      { 
        week: 'Weeks 7-8', 
        title: 'HR Analytics, Resume Evaluation Methods & Mock Interviews',
        topics: ['Key HR Metrics: Attrition Rate, Time-to-Hire, Cost-per-Hire', 'Designing HR Dashboards in Excel', 'Mock Resume evaluation labs aligning with recruitment standards', 'Conducting mock interviews & recruiter feedback sessions']
      }
    ],
    projects: [
      {
        title: 'Enterprise Recruitment Operations Hub',
        description: 'Draft job descriptions, design a recruitment funnel with ATS tracking stages, calculate CTC breaks, and build an attrition analytics dashboard in Excel.',
        techUsed: ['Excel', 'ATS Tools', 'HR Analytics']
      }
    ],
    mentors: [
      { name: 'Meenakshi Iyer', role: 'HR Director at GlobalCorp', experience: '12+ Years' }
    ],
    outcomes: [
      'Conduct professional hiring campaigns and pre-screen applicants using ATS criteria.',
      'Draft HR manuals, offer letters, CTC structures, and employee policy documents.',
      'Manage payroll calculations and understand statutory compliance guidelines.',
      'Optimize recruitment pipelines and metrics tracking using Excel dashboards.'
    ],
    faqs: [
      { q: 'Does this cover resume screening training?', a: 'Yes, we train on how HR teams evaluate resumes, aligning with our resume feedback service.' }
    ],
    reviews: [
      { user: 'Aisha Khan', rating: 5, comment: 'Practical insights into ATS screening algorithms and mock recruiter calls.', date: 'June 2026' }
    ]
  },
  {
    id: 'stock-market',
    techStack: ['Technical Analysis', 'Fundamental Analysis', 'Trading Sheets', 'Risk Management'],
    title: 'Stock Market & Financial Analysis',
    category: 'Stock Market',
    level: 'Basic to Intermediate',
    duration: '2 Months',
    fee: 9000,
    originalFee: 12000,
    selfPacedFee: 5000,
    selfPacedOriginalFee: 7000,
    mentorLedHours: '20+ Hours Live Training',
    mentorLedProjects: '2 Projects',
    selfPacedHours: '25–30 Hours Recorded Content',
    selfPacedProjects: '2 Projects',
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.6,
    enrollments: '1,200+',
    overview: 'Understand financial markets, technical analysis, fundamental analysis, risk management, and trading strategies.',
    curriculum: [
      { 
        week: 'Weeks 1-2', 
        title: 'Financial Markets Basics & Order Execution',
        topics: ['Introduction to Primary & Secondary Markets', 'Role of SEBI, Stock Exchanges (NSE/BSE), & Depositories', 'Understanding Demat Accounts & Order Types (Market, Limit, SL)', 'Reading Market Depth & Bid-Ask spreads', 'Key Asset Classes: Equities, Mutual Funds, ETFs']
      },
      { 
        week: 'Weeks 3-5', 
        title: 'Technical Analysis (Candlesticks, Indicators, & Charts)',
        topics: ['Dow Theory & Basic Trend Identification', 'Candlestick Patterns (Hammer, Engulfing, Doji, etc.)', 'Support & Resistance levels, Trendlines', 'Chart Patterns: Head & Shoulders, Double Top/Bottom, Triangles', 'Technical Indicators: Moving Averages, RSI, MACD, Bollinger Bands', 'Volume Analysis & breakout confirmations']
      },
      { 
        week: 'Weeks 6-7', 
        title: 'Fundamental Analysis (Reading Financials & Valuation)',
        topics: ['Reading Annual Reports & Financial Statements', 'Analyzing Balance Sheet, Income Statement, & Cash Flow Statement', 'Financial Ratios: P/E, P/B, EV/EBITDA, ROE, ROCE, Debt-to-Equity', 'Analyzing Industry sectors & Moats', 'Qualitative Analysis: Corporate Governance & Management Quality']
      },
      { 
        week: 'Weeks 8', 
        title: 'Portfolio Management, Risk Mitigation, & Trading Psychology',
        topics: ['Risk-Reward Ratio & Position Sizing formulas', 'Diversification & Portfolio Allocation rules', 'Stop-Loss management strategies', 'Understanding trading biases & psychology guidelines', 'Backtesting a trading system blueprint']
      }
    ],
    projects: [
      {
        title: 'Trading System Backtesting & Equity Report',
        description: 'Formulate a candlestick chart trading strategy, backtest it on 6 months of stock charts, apply sizing, and write a fundamental valuation audit on a stock.',
        techUsed: ['Technical Analysis', 'Excel', 'Fundamental Valuation']
      }
    ],
    mentors: [
      { name: 'Rajeev Singhal', role: 'Certified Financial Analyst', experience: '10+ Years' }
    ],
    outcomes: [
      'Perform chart reading and pattern identification for technical short-term trades.',
      'Read and analyze corporate annual reports and key financial valuation ratios.',
      'Implement risk-reward principles and position sizing to preserve capital.',
      'Backtest simple trading systems using historical data sheets.'
    ],
    faqs: [
      { q: 'Is this trading advice?', a: 'No, this is purely educational. We do not provide tips or advisory services.' }
    ],
    reviews: [
      { user: 'Devendra K.', rating: 4, comment: 'Excellent technical analysis class. Kept it simple and math-free.', date: 'March 2026' }
    ]
  },
  {
    id: 'cyber-security',
    techStack: ['Kali Linux', 'Wireshark', 'Metasploit', 'Nmap', 'OWASP Top 10'],
    title: 'Cyber Security',
    category: 'Cyber Security',
    level: 'Basic to Intermediate',
    duration: '3 Months',
    fee: 12000,
    originalFee: 15000,
    selfPacedFee: 6000,
    selfPacedOriginalFee: 8000,
    mentorLedHours: '26+ Hours Live Training',
    mentorLedProjects: '3 Projects',
    selfPacedHours: '25–30 Hours Recorded Content',
    selfPacedProjects: '2 Projects',
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.7,
    enrollments: '950+',
    overview: 'Understand network security, cryptography, vulnerability assessment, web application security, and ethical hacking concepts.',
    curriculum: [
      { 
        week: 'Weeks 1-2', 
        title: 'Computer Networking & Cryptography Fundamentals',
        topics: ['OSI Model & TCP/IP Protocol Suite', 'Understanding IP Addressing, Subnetting, & Routing', 'DNS, DHCP, & HTTP/HTTPS operations', 'Symmetric vs. Asymmetric Encryption', 'Hashing algorithms (SHA, MD5) & Digital Signatures', 'VPNs, Firewalls, & Secure Network Topologies']
      },
      { 
        week: 'Weeks 3-4', 
        title: 'System Security, Kali Linux, & Port Scanning Labs',
        topics: ['Introduction to Kali Linux Workspace', 'Command Line basics & Linux permissions', 'Information Gathering & Reconnaissance', 'Network scanning with Nmap: Options & Scans', 'Analyzing network packets using Wireshark', 'Vulnerability Assessment concepts']
      },
      { 
        week: 'Weeks 5-6', 
        title: 'Web Application Security & Pentesting Labs',
        topics: ['Introduction to Web Application Architectures', 'OWASP Top 10 vulnerabilities overview', 'SQL Injection (SQLi) attacks & mitigations', 'Cross-Site Scripting (XSS) & CSRF mechanisms', 'Broken Authentication & Sensitive Data Exposure', 'Scanning web apps with Burp Suite']
      },
      { 
        week: 'Weeks 7-8', 
        title: 'Incidence Response, Secure Audits, & Compliance Reports',
        topics: ['Social Engineering attacks (Phishing, Social profiling)', 'Password cracking concepts & dictionary attacks', 'Malware categories (Trojans, Ransomware)', 'Incident Response lifecycle stages', 'Writing vulnerability report sheets for stakeholders']
      }
    ],
    projects: [
      {
        title: 'OWASP Security Audit & Vulnerability Assessment',
        description: 'Configure virtual lab environments, perform port scans using Nmap, intercept HTTP requests in Burp Suite, identify XSS/SQLi holes, and write a fix report.',
        techUsed: ['Nmap', 'Wireshark', 'Burp Suite', 'Kali Linux', 'OWASP Top 10']
      }
    ],
    mentors: [
      { name: 'Aditya Sen', role: 'Certified CEH, Security Analyst', experience: '6+ Years' }
    ],
    outcomes: [
      'Scan networks for active hosts and open ports securely using Nmap.',
      'Identify and document OWASP Top 10 vulnerabilities in web pages.',
      'Apply basic encryption models to protect digital data assets.',
      'Draft remediation recommendations and security patch reports for servers.'
    ],
    faqs: [
      { q: 'Do we practice on live sites?', a: 'No, we use local labs and virtual machine templates to practice ethical tests.' }
    ],
    reviews: [
      { user: 'Siddharth M.', rating: 5, comment: 'Highly structured labs and clear explanation of SQL injections.', date: 'May 2026' }
    ]
  },
  {
    id: 'cloud-computing',
    techStack: ['AWS', 'AWS EC2', 'AWS S3', 'VPC Routing', 'Auto Scaling'],
    title: 'Cloud Computing',
    category: 'Cloud Computing',
    level: 'Basic to Intermediate',
    duration: '2 Months',
    fee: 10000,
    originalFee: 12000,
    selfPacedFee: 5000,
    selfPacedOriginalFee: 7000,
    mentorLedHours: '20+ Hours Live Training',
    mentorLedProjects: '2 Projects',
    selfPacedHours: '25–30 Hours Recorded Content',
    selfPacedProjects: '2 Projects',
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.8,
    enrollments: '1,400+',
    overview: 'Get introduced to cloud infrastructure. Learn about computing, storage, networking, database services, and deployment models on AWS.',
    curriculum: [
      { 
        week: 'Weeks 1-2', 
        title: 'Cloud Core Models & Virtualization',
        topics: ['Introduction to Cloud Computing: Scalability & Elasticity', 'Cloud Deployment Models (Public, Private, Hybrid)', 'Service Models: IaaS (Infrastructure), PaaS (Platform), SaaS (Software)', 'Virtualization & Hypervisors overview', 'Cloud Economics: Pay-as-you-go & cost optimization']
      },
      { 
        week: 'Weeks 3-4', 
        title: 'AWS Compute, Storage, & Identity IAM Services',
        topics: ['AWS Global Infrastructure (Regions & Availability Zones)', 'Amazon EC2 (Elastic Compute Cloud): Launching & managing instances', 'Security Groups & Key Pairs', 'Amazon S3 (Simple Storage Service): Buckets, Policies, & Classes', 'AWS IAM (Identity & Access Management): Users, Groups, Roles']
      },
      { 
        week: 'Weeks 5-6', 
        title: 'Cloud Networking & Route 53 Configurations',
        topics: ['Amazon VPC (Virtual Private Cloud) fundamentals', 'Subnets (Public & Private), Internet Gateways, Route Tables', 'Network Access Control Lists (NACLs) vs. Security Groups', 'Elastic Load Balancing (ELB) types & setups', 'Amazon Route 53 DNS routing policies']
      },
      { 
        week: 'Weeks 7-8', 
        title: 'Auto Scaling, Cloud Databases, & Monitoring Services',
        topics: ['Amazon EC2 Auto Scaling setup', 'Amazon RDS (Relational Database Service) configurations', 'AWS CloudWatch: Logs, Metrics, & Alarms setup', 'AWS Billing & Budgets management dashboards', 'AWS Well-Architected Framework principles']
      }
    ],
    projects: [
      {
        title: 'Multi-Tier Secure Cloud Deployment Architecture',
        description: 'Design and deploy a secure VPC on AWS containing public and private subnets, configure an Auto Scaling EC2 pool behind a Load Balancer, and connect RDS.',
        techUsed: ['AWS VPC', 'AWS EC2', 'AWS S3', 'Elastic Load Balancer', 'AWS RDS']
      }
    ],
    mentors: [
      { name: 'Mohit Rao', role: 'Lead Solutions Architect at AWS', experience: '8+ Years' }
    ],
    outcomes: [
      'Provision and manage secure cloud servers and object storage pools on AWS.',
      'Configure custom virtual private networks (VPCs) with public and private subnets.',
      'Configure auto-scaling networks for web application high-availability.',
      'Understand cloud security baseline configurations and monitor billing alerts.'
    ],
    faqs: [
      { q: 'Is there hands-on cloud credits?', a: 'We guide you on creating AWS Free Tier accounts for your learning projects.' }
    ],
    reviews: [
      { user: 'Nisha K.', rating: 5, comment: 'Clear, step-by-step AWS console walkthroughs. Got my cloud basics clear.', date: 'June 2026' }
    ]
  }
];

export const BLOGS = [
  {
    id: 'ai-trends-2026',
    title: 'Artificial Intelligence Trends Dominating 2026',
    category: 'Artificial Intelligence',
    author: 'Dr. Aris Rawat',
    date: 'June 28, 2026',
    summary: 'Discover how multimodal models and localized micro-AI agents are transforming business operations and custom web systems this year.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    content: 'The landscape of AI in 2026 has transitioned from simple chatbots to highly integrated micro-agents. Businesses are moving away from monolithic APIs and towards localized domain-specific models. Multimodal models that combine sight, speech, and structured database queries are powering operations in logistics, health, and e-learning platforms. As custom systems become more agent-driven, developers must build skills around vector databases and orchestration systems...'
  },
  {
    id: 'webdev-future',
    title: 'The Evolution of Frontend Development: What Lies Beyond React?',
    category: 'Web Development',
    author: 'Vikram Aditya',
    date: 'June 15, 2026',
    summary: 'A look into compilation-first frameworks, server components, and how modern web assembly is altering layout speed and interaction models.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    content: 'Frontend technology is shifting towards zero-bundle-size targets. With compilers doing the heavy-lifting of reactive rendering, libraries like React Compiler and compile-centric architectures are reshaping performance benchmarks. As web apps become richer and demand glassmorphism interfaces, loading speeds remain a critical SEO criteria. Keeping bundle sizes optimized and caching aggressively are critical parameters in high-converting agency applications...'
  },
  {
    id: 'performance-marketing',
    title: 'Mastering Meta & Google Ads Attribution in 2026',
    category: 'Digital Marketing',
    author: 'Kunal Sen',
    date: 'May 20, 2026',
    summary: 'Why first-party data and server-side tracking are critical to maximizing ROI on performance campaigns under modern privacy laws.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    content: 'Attribution has become the hardest part of digital marketing. With third-party cookies phased out, tracking rely on server-side connections. Smart organizations are integrating custom CRM hooks to push real-time conversion events directly to Meta Conversions API and Google Ads. Learn how first-party signals are helping campaigns target buyers with high precision...'
  },
  {
    id: 'resume-tips',
    title: 'How HR Teams Screening Resumes (And How to Beat the ATS)',
    category: 'Resume Tips',
    author: 'Meenakshi Iyer',
    date: 'April 10, 2026',
    summary: 'An inside look into ATS keyword scoring, structural alignment, and the checklist items recruitment managers look for in freshers.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    content: 'An average recruiter spends less than 7 seconds reviewing a resume. Automated Application Tracking Systems (ATS) scan for specific keywords, formatting clarity, and project structures. Our HR professionals emphasize listing tools, impact-driven bullet points, and avoiding double column grids which break parser engines. Learn the checklist for freshers...'
  }
];

export const MENTORS = [
  { name: 'Dr. Aris Rawat', role: 'AI & Data Science Lead', org: 'Ex-Microsoft', exp: '8+ Years', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { name: 'Vikram Aditya', role: 'Full Stack Staff Architect', org: 'Swiggy', exp: '9+ Years', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Meenakshi Iyer', role: 'Human Resources Director', org: 'GlobalCorp', exp: '12+ Years', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
  { name: 'Kunal Sen', role: 'Growth & Ads Specialist', org: 'Ogilvy', exp: '7+ Years', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
];

export const CLIENT_TESTIMONIALS = [
  { company: 'EdStart Solutions', client: 'Dr. Ramesh R.', text: 'BeyondSkills built our custom learning platform in record time. The quality of react implementation and analytics dashboard is incredible.', rating: 5 },
  { company: 'Zeta Fashion Brand', client: 'Priya K.', text: 'Our performance ad campaign ROI went up by 45% in the first two months. Their meta ads optimizations are top tier.', rating: 5 }
];

export const STUDENT_TESTIMONIALS = [
  { name: 'Arjun Das', course: 'Full Stack Development', text: 'The dual learning model of recorded lessons and weekly live mentor reviews helped me clear coding interviews easily. The project dashboard is amazing.', rating: 5, company: 'Wipro' },
  { name: 'Srinidhi Gowda', course: 'AI/ML/DS', text: 'Awesome mentor sessions! The Capstone project gave me hands-on practice. The onboarding is instant and certificate PDF download is direct.', rating: 5, company: 'Cognizant' }
];

// Helper database triggers stored in localStorage

export const getDbItem = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

export const setDbItem = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(e);
  }
};

// Initialize DB with sample leads and transactions if empty
if (!localStorage.getItem('beyondskills_users')) {
  setDbItem('beyondskills_users', [
    { email: 'student@beyondskills.in', phone: '9876543210', password: 'password', name: 'Demo Student', studentId: 'BS-2026-1004', activeCourses: ['full-stack-web'] }
  ]);
}

if (!localStorage.getItem('beyondskills_leads')) {
  setDbItem('beyondskills_leads', [
    { type: 'Agency', name: 'Ramesh Patel', email: 'ramesh@startup.in', phone: '9988776655', company: 'Ramesh Tech', service: 'Website Development', budget: '₹1,00,000 - ₹3,00,000', message: 'Looking for a custom React/Node client onboarding platform.', date: new Date(Date.now() - 3600000).toISOString() },
    { type: 'Academy', name: 'Nikhil Gowda', email: 'nikhil@college.edu', phone: '8877665544', course: 'ai-ml', college: 'RV College of Eng', status: 'Final Year Student', message: 'Interested in AI course recorded lecture models.', date: new Date(Date.now() - 7200000).toISOString() }
  ]);
}

if (!localStorage.getItem('beyondskills_payments')) {
  setDbItem('beyondskills_payments', [
    { orderId: 'pay_mock_12345', amount: 15000, studentId: 'BS-2026-1004', courseId: 'full-stack-web', email: 'student@beyondskills.in', status: 'Success', date: new Date(Date.now() - 3600000).toISOString() }
  ]);
}

if (!localStorage.getItem('beyondskills_certificates')) {
  setDbItem('beyondskills_certificates', [
    { id: 'CERT-BS-FS-9874', studentName: 'Demo Student', studentId: 'BS-2026-1004', courseTitle: 'Full Stack Web Development (MERN)', issueDate: 'June 30, 2026', verificationUrl: window.location.origin + '/verify?certId=CERT-BS-FS-9874' }
  ]);
}
