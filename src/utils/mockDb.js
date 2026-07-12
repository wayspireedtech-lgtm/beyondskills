// Mock Database for BeyondSkills platform content and localStorage persistence

export const COURSES = [
  {
    id: 'ai-ml',
    techStack: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow', 'Keras'],
    title: 'Artificial Intelligence & Machine Learning',
    category: 'AI/ML/DS/DA',
    level: 'Basic to Intermediate',
    duration: '3 Months',
    fee: 10000,
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.8,
    enrollments: '1,800+',
    overview: 'Master the fundamentals of Python, machine learning algorithms, deep learning models, computer vision, and Large Language Models (LLMs) with hands-on projects.',
    curriculum: [
      { week: 'Weeks 1-4', title: 'Python Programming & Core Machine Learning (Scikit-Learn)' },
      { week: 'Weeks 5-8', title: 'Deep Learning, Neural Networks & Computer Vision (TensorFlow/Keras)' },
      { week: 'Weeks 9-10', title: 'Introduction to Natural Language Processing & Large Language Models (LLMs)' },
      { week: 'Weeks 11-12', title: 'Generative AI Capstone Project & Industry Mentorship' }
    ],
    mentors: [
      { name: 'Dr. Aris Rawat', role: 'Ex-Data Scientist at Microsoft', experience: '8+ Years' },
      { name: 'Sanjay Mehta', role: 'AI Lead at Tech Solutions', experience: '6+ Years' }
    ],
    outcomes: [
      'Understand and apply supervised and unsupervised learning techniques.',
      'Build and train custom Deep Learning neural networks.',
      'Fine-tune and deploy LLM applications.',
      'Complete 4 industry-aligned AI/ML projects to build a solid portfolio.'
    ],
    faqs: [
      { q: 'Who is this course for?', a: 'Undergraduate and postgraduate students, graduates, and professionals wanting to transition into AI and ML engineering.' },
      { q: 'Will I get an internship certificate?', a: 'Yes, an internship completion certificate is issued upon successful completion of the course capstone project and curriculum assessments.' },
      { q: 'Is there a job guarantee?', a: 'No, we do not guarantee jobs or placements. Please refer to our placement disclaimer.' }
    ],
    reviews: [
      { user: 'Amit Sharma', rating: 5, comment: 'The AI/ML live sessions were excellent. Mentors resolve doubts instantly.', date: 'May 2026' },
      { user: 'Priya Nair', rating: 4, comment: 'Hands-on neural network projects helped me clear my basic concepts. Highly recommended!', date: 'June 2026' }
    ]
  },
  {
    id: 'data-science-analytics',
    techStack: ['Python', 'SQL', 'Excel', 'Pandas', 'NumPy', 'PowerBI', 'Tableau'],
    title: 'Data Science & Analytics',
    category: 'AI/ML/DS/DA',
    level: 'Basic to Intermediate',
    duration: '3 Months',
    fee: 10000,
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.7,
    enrollments: '1,400+',
    overview: 'Master data cleaning, advanced SQL querying, relational databases, statistical modelling, and interactive dashboard creation in PowerBI and Tableau to extract insights and drive business decisions.',
    curriculum: [
      { week: 'Weeks 1-4', title: 'Advanced SQL, Relational Databases, Data Extraction & Cleaning (Pandas/NumPy)' },
      { week: 'Weeks 5-8', title: 'Data Visualization & Reporting (Designing Dashboards in Tableau & PowerBI)' },
      { week: 'Weeks 9-10', title: 'Statistical Methods, Exploratory Data Analysis & Predictive Analytics' },
      { week: 'Weeks 11-12', title: 'Data Storytelling Capstone Project & Dashboard Deployment' }
    ],
    mentors: [
      { name: 'Dr. Aris Rawat', role: 'Ex-Data Scientist at Microsoft', experience: '8+ Years' },
      { name: 'Riddhima Das', role: 'Growth Hacker & Ex-Consultant', experience: '5+ Years' }
    ],
    outcomes: [
      'Write optimized SQL queries for extracting large datasets.',
      'Clean, preprocess, and analyze unstructured raw data.',
      'Design and deploy production-grade corporate dashboards in PowerBI/Tableau.',
      'Present findings through compelling data stories and predictive model insights.'
    ],
    faqs: [
      { q: 'Do I need a mathematical background?', a: 'Basic math and logic are sufficient. We teach all statistical concepts step-by-step from scratch.' },
      { q: 'Will I learn database management?', a: 'Yes, relational database querying via SQL is covered extensively.' }
    ],
    reviews: [
      { user: 'Karthik S.', rating: 5, comment: 'Excellent dashboarding sessions. Learned Tableau from absolute scratch.', date: 'May 2026' }
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
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.7,
    enrollments: '4,500+',
    overview: 'Learn modern web development using HTML5, CSS3, JavaScript, React, Node.js, Express, and MongoDB. Build real-world web applications and deploy them to the cloud.',
    curriculum: [
      { week: 'Weeks 1-4', title: 'Frontend Basics: HTML, CSS, JavaScript (ES6+), Tailwind CSS' },
      { week: 'Weeks 5-8', title: 'React.js Development: Components, Hooks, Context API, SPA Routing' },
      { week: 'Weeks 9-12', title: 'Backend Engineering: Node.js, Express.js, MongoDB database' },
      { week: 'Weeks 13-16', title: 'Authentication, API Security, Cloud Deployment & Capstone Projects' }
    ],
    mentors: [
      { name: 'Vikram Aditya', role: 'Staff Engineer at Swiggy', experience: '9+ Years' },
      { name: 'Neha Gupta', role: 'Senior React Developer', experience: '5+ Years' }
    ],
    outcomes: [
      'Build responsive, highly interactive frontends in React.',
      'Design RESTful APIs, manage databases (MongoDB), and secure application endpoints.',
      'Deploy full-stack applications to platforms like Vercel and Render.',
      'Implement real-time features like chat or notification feeds.'
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
    title: 'Performance Digital Marketing & Ads',
    category: 'Digital Marketing',
    level: 'Basic to Intermediate',
    duration: '2 Months',
    fee: 6000,
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.6,
    enrollments: '1,800+',
    overview: 'Master SEO, Content Marketing, Google Ads, Meta Ads (Facebook & Instagram), Email Marketing, and Analytics (GA4) to drive high ROI lead-generation.',
    curriculum: [
      { week: 'Weeks 1-2', title: 'Digital Marketing Fundamentals & SEO (On-page/Off-page)' },
      { week: 'Weeks 3-5', title: 'Paid Campaigns: Google Search & Display Ads, Meta Campaigns' },
      { week: 'Weeks 6-7', title: 'Content Strategy, Copywriting, Email Campaigns & Automation' },
      { week: 'Weeks 8', title: 'Google Analytics (GA4), Campaign Auditing, & Capstone Assessment' }
    ],
    mentors: [
      { name: 'Kunal Sen', role: 'Digital Lead at Ogilvy', experience: '7+ Years' },
      { name: 'Riddhima Das', role: 'Growth Hacker & Ex-Consultant', experience: '5+ Years' }
    ],
    outcomes: [
      'Create and optimize high-converting Google & Meta ad campaigns.',
      'Analyze traffic and sales funnels using Google Analytics (GA4).',
      'Conduct keyword research and implement SEO guidelines for websites.',
      'Formulate organic content calendar strategies for brands.'
    ],
    faqs: [
      { q: 'Are ad budgets included in the fee?', a: 'No, the fee covers training and live sessions. We provide simulated environments and small budgets during live projects.' }
    ],
    reviews: [
      { user: 'Karthik S.', rating: 4, comment: 'Learnt Facebook ads targeting setup. Very practical and structured.', date: 'May 2026' }
    ]
  },
  {
    id: 'hr-mgmt',
    techStack: ['ATS Systems', 'Payroll Tools', 'HR Analytics', 'Excel'],
    title: 'Human Resource Management & Operations',
    category: 'HR',
    level: 'Basic to Intermediate',
    duration: '2 Months',
    fee: 6000,
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.5,
    enrollments: '800+',
    overview: 'Learn modern HR practices, recruitment strategies, onboarding, HR analytics, payroll administration, and employee relations.',
    curriculum: [
      { week: 'Weeks 1-2', title: 'Talent Acquisition, ATS Systems, & Candidate Sourcing' },
      { week: 'Weeks 3-4', title: 'Employee Lifecycle, Onboarding, Engagement & Policy Design' },
      { week: 'Weeks 5-6', title: 'Payroll Systems, Labor Laws, Compensation & Benefits' },
      { week: 'Weeks 7-8', title: 'HR Analytics, Resume Evaluation Methods & Mock Interviews' }
    ],
    mentors: [
      { name: 'Meenakshi Iyer', role: 'HR Director at GlobalCorp', experience: '12+ Years' }
    ],
    outcomes: [
      'Conduct professional hiring campaigns and pre-screen applicants.',
      'Draft HR manuals, offer letters, and policy documents.',
      'Manage basic payroll calculations and understand compliance guidelines.',
      'Optimize recruitment pipelines using modern ATS tools.'
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
    fee: 6000,
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.6,
    enrollments: '1,200+',
    overview: 'Understand financial markets, technical analysis, fundamental analysis, risk management, and trading strategies.',
    curriculum: [
      { week: 'Weeks 1-2', title: 'Financial Markets Basics, Stock Exchanges, & Order Execution' },
      { week: 'Weeks 3-5', title: 'Technical Analysis: Candlestick Patterns, Indicators, & Charts' },
      { week: 'Weeks 6-7', title: 'Fundamental Analysis: Balance Sheets, Ratios & Valuation' },
      { week: 'Weeks 8', title: 'Portfolio Management, Risk Mitigation, & Trading Psychology' }
    ],
    mentors: [
      { name: 'Rajeev Singhal', role: 'Certified Financial Analyst', experience: '10+ Years' }
    ],
    outcomes: [
      'Perform chart reading and pattern identification for technical trades.',
      'Read and analyze corporate annual reports and key financial ratios.',
      'Implement risk-reward principles to preserve capital.',
      'Backtest simple trading systems using live data sheets.'
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
    title: 'Introduction to Cyber Security & Ethical Hacking',
    category: 'Cyber Security',
    level: 'Basic to Intermediate',
    duration: '2 Months',
    fee: 6000,
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.7,
    enrollments: '950+',
    overview: 'Understand network security, cryptography, vulnerability assessment, web application security, and ethical hacking concepts.',
    curriculum: [
      { week: 'Weeks 1-2', title: 'Networking Fundamentals & Cryptography' },
      { week: 'Weeks 3-4', title: 'System Security, Kali Linux Basics, & Port Scanning' },
      { week: 'Weeks 5-6', title: 'Web App Pentesting (OWASP Top 10 vulnerabilities)' },
      { week: 'Weeks 7-8', title: 'Incidence Response, Secure Audits, & Ethical Reports' }
    ],
    mentors: [
      { name: 'Aditya Sen', role: 'Certified CEH, Security Analyst', experience: '6+ Years' }
    ],
    outcomes: [
      'Scan networks for active hosts and open ports securely.',
      'Identify and document OWASP Top 10 vulnerabilities in web pages.',
      'Apply basic encryption models to protect digital data assets.',
      'Draft remediation recommendations for compromised servers.'
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
    title: 'Cloud Computing Foundations (AWS & Azure)',
    category: 'Cloud Computing',
    level: 'Basic to Intermediate',
    duration: '2 Months',
    fee: 6000,
    delivery: 'Recorded + Live Mentor Sessions',
    certificate: 'Yes',
    rating: 4.8,
    enrollments: '1,400+',
    overview: 'Get introduced to cloud infrastructure. Learn about computing, storage, networking, database services, and deployment models on AWS.',
    curriculum: [
      { week: 'Weeks 1-2', title: 'Introduction to Cloud, Virtualization, & Core Models (IaaS, PaaS)' },
      { week: 'Weeks 3-4', title: 'AWS Essentials: EC2 instances, S3 storage, IAM security' },
      { week: 'Weeks 5-6', title: 'Cloud Networking: VPC setup, Route 53, & Load Balancing' },
      { week: 'Weeks 7-8', title: 'Auto Scaling, RDS database, Monitoring (CloudWatch), & Billing' }
    ],
    mentors: [
      { name: 'Mohit Rao', role: 'Lead Solutions Architect at AWS', experience: '8+ Years' }
    ],
    outcomes: [
      'Provision and manage secure cloud servers and object storage pools.',
      'Configure custom virtual private networks with public/private subnets.',
      'Configure auto-scaling systems for web application high-availability.',
      'Understand cloud security baseline configurations.'
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
