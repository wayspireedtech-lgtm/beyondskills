import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDbItem, setDbItem, logUserAccess } from '../utils/mockDb';
import { 
  BarChart3, LineChart, PieChart, Inbox, Users, DollarSign, Percent, 
  Globe, Star, Trash2, ArrowUpRight, Award, ShieldAlert, Plus, 
  FileSpreadsheet, ClipboardList, CheckSquare, BarChart, Settings, 
  UserPlus, RefreshCw, Eye, Edit2, X, Check, CheckCircle2, ChevronRight,
  TrendingUp, Calendar, AlertCircle, Sparkles, Phone, ShieldCheck, LogOut,
  FileText, BookOpen, Mail, Lock, ArrowRight, ChevronDown
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('beyondskills_admin_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  const toggleTheme = (dark) => {
    setIsDarkMode(dark);
    localStorage.setItem('beyondskills_admin_theme', dark ? 'dark' : 'light');
  };

  // CRM States
  const [currentUser, setCurrentUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [crmUsers, setCrmUsers] = useState([]);

  // Custom Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const targetEmail = 'beyondskills.ai@gmail.com';
    const savedPassword = localStorage.getItem('beyondskills_admin_password') || '9953607074';
    const crmUsers = getDbItem('beyondskills_crm_users', []);
    const matchingUser = crmUsers.find(u => u.email.trim().toLowerCase() === loginEmail.trim().toLowerCase());

    let authenticatedUser = null;

    if (loginEmail.trim().toLowerCase() === targetEmail.toLowerCase()) {
      if (loginPassword === savedPassword) {
        authenticatedUser = {
          email: targetEmail,
          name: 'BeyondSkills Administrator',
          role: 'Admin',
          studentId: 'DV-ADMIN'
        };
      }
    } else if (matchingUser) {
      const userPassword = matchingUser.password || 'Gradus@123';
      if (loginPassword === userPassword) {
        authenticatedUser = {
          email: matchingUser.email,
          name: matchingUser.name,
          role: matchingUser.role,
          studentId: matchingUser.role + '-' + Math.floor(1000 + Math.random() * 9000)
        };
      }
    }

    if (!authenticatedUser) {
      setTimeout(() => {
        setLoginError('Invalid administrator or BDA credentials.');
        setLoginLoading(false);
      }, 500);
      return;
    }

    setTimeout(() => {
      setDbItem('beyondskills_current_user', authenticatedUser);
      window.dispatchEvent(new Event('auth_change'));
      setLoginLoading(false);
      setCurrentUser(authenticatedUser);
      
      // Load CRM data on successful login
      setLeads(getDbItem('beyondskills_leads', []));
      setPayments(getDbItem('beyondskills_payments', []));
      setStudents(getDbItem('beyondskills_users', []));
      setBlogs(getDbItem('beyondskills_blogs', []));
      setMentors(getDbItem('beyondskills_mentors', []));
      setLandingPages(getDbItem('beyondskills_landing_pages', []));
      setLogs(getDbItem('beyondskills_access_logs', []));
      
      // Seed default CRM Users if none exist
      const crmUsersSeeded = localStorage.getItem('beyondskills_crm_users_seeded');
      let existingCrmUsers = getDbItem('beyondskills_crm_users', []);
      if (!crmUsersSeeded && existingCrmUsers.length === 0) {
        existingCrmUsers = [
          { name: 'Abhishek Manager', email: 'abhishek.mgr@gradus.live', role: 'BDM', reportsTo: 'Sales Head', password: 'Abhishek@123' },
          { name: 'Khushi Manager', email: 'khushi.mgr@gradus.live', role: 'BDM', reportsTo: 'Sales Head', password: 'Khushi@123' },
          { name: 'Muskan Gupta', email: 'muskan.g@gradus.live', role: 'BDA', reportsTo: 'Abhishek Manager', password: '7982738724' },
          { name: 'Deepak Gupta', email: 'deepak.g@gradus.live', role: 'BDA', reportsTo: 'Abhishek Manager', password: 'Deepak@123' },
          { name: 'Shubham Tyagi', email: 'shubham.t@gradus.live', role: 'BDA', reportsTo: 'Khushi Manager', password: 'Shubham@123' },
          { name: 'Jatin BDA', email: 'jatin.b@gradus.live', role: 'BDA', reportsTo: 'Khushi Manager', password: 'Jatin@123' }
        ];
        setDbItem('beyondskills_crm_users', existingCrmUsers);
        localStorage.setItem('beyondskills_crm_users_seeded', 'true');
      }
      setCrmUsers(existingCrmUsers);
      if (existingCrmUsers.length > 0 && !selectedBdaName) {
        const firstBda = existingCrmUsers.find(u => u.role === 'BDA');
        if (firstBda) setSelectedBdaName(firstBda.name);
      }
      
      // Start webhook sync
      fetchWebhookLeads();
    }, 800);
  };

  // Blogs, Mentors & Landing Page Editor States
  const [blogs, setBlogs] = useState([]);
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [showEditBlogModal, setShowEditBlogModal] = useState(false);
  const [selectedBlogIdx, setSelectedBlogIdx] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', category: 'Artificial Intelligence', author: '', date: '', summary: '', image: '', content: '' });

  const [mentors, setMentors] = useState([]);
  const [showAddMentorModal, setShowAddMentorModal] = useState(false);
  const [showEditMentorModal, setShowEditMentorModal] = useState(false);
  const [selectedMentorIdx, setSelectedMentorIdx] = useState(null);
  const [mentorForm, setMentorForm] = useState({ name: '', role: '', org: '', exp: '', image: '' });

  const [landingPages, setLandingPages] = useState([]);
  const [showAddLpModal, setShowAddLpModal] = useState(false);
  const [showEditLpModal, setShowEditLpModal] = useState(false);
  const [selectedLpIdx, setSelectedLpIdx] = useState(null);
  const [lpForm, setLpForm] = useState({ slug: '', courseId: 'full-stack-web', heroHeadline: '', heroSubheadline: '', ctaText: 'Apply Now', highlights: '', faqs: '' });
  
  // Navigation Tabs
  // Active Main Tab: 'analytics' | 'leads_manager' | 'allocation' | 'bda_performance' | 'users'
  const [activeMainTab, setActiveMainTab] = useState('analytics');
  // Leads Manager Subtab: 'list' | 'kanban' | 'tasks'
  const [leadsSubTab, setLeadsSubTab] = useState('list');
  // Allocation Subtab: 'assigned' | 'bulk' | 'archived'
  const [allocationSubTab, setAllocationSubTab] = useState('assigned');
  
  // Modals & Form States
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showImportLeadModal, setShowImportLeadModal] = useState(false);
  const [showEditLeadModal, setShowEditLeadModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showSheetsSyncModal, setShowSheetsSyncModal] = useState(false);
  
  // Form Bindings
  const [newLeadForm, setNewLeadForm] = useState({
    name: '', email: '', phone: '', type: 'Ads Leads', program: 'artificial-intelligence', 
    budget: '₹14,000', college: '', message: '', status: 'New', subStatus: 'QUALIFIED'
  });
  const [importText, setImportText] = useState('');
  const [newUserForm, setNewUserForm] = useState({
    name: '', email: '', role: 'BDA', reportsTo: '', password: ''
  });
  const [noteText, setNoteText] = useState('');

  // Google Sheets integration bindings
  const [googleFormSheetUrl, setGoogleFormSheetUrl] = useState(localStorage.getItem('beyondskills_sheet_google_form') || '');
  const [adsSheetUrl, setAdsSheetUrl] = useState(localStorage.getItem('beyondskills_sheet_ads') || '');
  const [isSyncing, setIsSyncing] = useState(false);

  // Selected Lead state for Details Modal
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeadIdx, setSelectedLeadIdx] = useState(null);
  const [logs, setLogs] = useState([]);
  
  // Filters
  const [leadSearch, setLeadSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterBDA, setFilterBDA] = useState('');
  const [filterBDM, setFilterBDM] = useState('');
  const [filterSubStatus, setFilterSubStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [leadChannelTab, setLeadChannelTab] = useState('all');
  const [leadAdsSubTab, setLeadAdsSubTab] = useState('all');
  const [draggedIdx, setDraggedIdx] = useState(null);
  
  // Bulk actions selection
  const [selectedLeadIndexes, setSelectedLeadIndexes] = useState([]);
  const [bulkBDM, setBulkBDM] = useState('');
  const [bulkBDA, setBulkBDA] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');

  // Selected BDA for detailed BDA Performance sub-status view
  const [selectedBdaName, setSelectedBdaName] = useState('');

  const fetchWebhookLeads = async () => {
    try {
      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : window.location.origin;
      const res = await fetch(`${apiHost}/api/webhook/leads`);
      if (res.ok) {
        const webhookLeads = await res.json();
        if (webhookLeads && webhookLeads.length > 0) {
          const currentLocal = getDbItem('beyondskills_leads', []);
          let updated = [...currentLocal];
          let updatedCount = 0;
          
          webhookLeads.forEach(wLead => {
            if (!updated.some(l => l.phone === wLead.phone)) {
              const newId = `LD${String(updated.length + 1).padStart(3, '0')}`;
              updated.push({
                ...wLead,
                id: newId
              });
              updatedCount++;
            }
          });
          
          if (updatedCount > 0) {
            setLeads(updated);
            setDbItem('beyondskills_leads', updated);
          }
        }
      }
    } catch (e) {
      console.error('Real-time sync webhook error:', e);
    }
  };

  useEffect(() => {
    // Check if logged in user is admin or BDA
    const loggedInUser = getDbItem('beyondskills_current_user', null);
    if (!loggedInUser || !['Admin', 'BDA', 'BDM', 'Sales Head'].includes(loggedInUser.role)) {
      setCurrentUser(null);
      return;
    }
    setCurrentUser(loggedInUser);

    setLeads(getDbItem('beyondskills_leads', []));
    setPayments(getDbItem('beyondskills_payments', []));
    setStudents(getDbItem('beyondskills_users', []));
    setBlogs(getDbItem('beyondskills_blogs', []));
    setMentors(getDbItem('beyondskills_mentors', []));
    setLandingPages(getDbItem('beyondskills_landing_pages', []));
    setLogs(getDbItem('beyondskills_access_logs', []));
    
    // Seed default CRM Users if none exist
    const crmUsersSeeded = localStorage.getItem('beyondskills_crm_users_seeded');
    let existingCrmUsers = getDbItem('beyondskills_crm_users', []);
    if (!crmUsersSeeded && existingCrmUsers.length === 0) {
      existingCrmUsers = [
        { name: 'Abhishek Manager', email: 'abhishek.mgr@gradus.live', role: 'BDM', reportsTo: 'Sales Head', password: 'Abhishek@123' },
        { name: 'Khushi Manager', email: 'khushi.mgr@gradus.live', role: 'BDM', reportsTo: 'Sales Head', password: 'Khushi@123' },
        { name: 'Muskan Gupta', email: 'muskan.g@gradus.live', role: 'BDA', reportsTo: 'Abhishek Manager', password: '7982738724' },
        { name: 'Deepak Gupta', email: 'deepak.g@gradus.live', role: 'BDA', reportsTo: 'Abhishek Manager', password: 'Deepak@123' },
        { name: 'Shubham Tyagi', email: 'shubham.t@gradus.live', role: 'BDA', reportsTo: 'Khushi Manager', password: 'Shubham@123' },
        { name: 'Jatin BDA', email: 'jatin.b@gradus.live', role: 'BDA', reportsTo: 'Khushi Manager', password: 'Jatin@123' }
      ];
      setDbItem('beyondskills_crm_users', existingCrmUsers);
      localStorage.setItem('beyondskills_crm_users_seeded', 'true');
    }
    setCrmUsers(existingCrmUsers);
    if (existingCrmUsers.length > 0 && !selectedBdaName) {
      const firstBda = existingCrmUsers.find(u => u.role === 'BDA');
      if (firstBda) setSelectedBdaName(firstBda.name);
    }

    // Fetch initial leads and set polling interval
    fetchWebhookLeads();
    const interval = setInterval(fetchWebhookLeads, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('beyondskills_current_user');
    window.dispatchEvent(new Event('auth_change'));
    setCurrentUser(null);
  };

  // BLOG CRUD Handlers
  const handleAddBlog = (e) => {
    e.preventDefault();
    const cleanId = blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const updated = [...blogs, { 
      ...blogForm, 
      id: cleanId, 
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
    }];
    setBlogs(updated);
    setDbItem('beyondskills_blogs', updated);
    setShowAddBlogModal(false);
    setBlogForm({ title: '', category: 'Artificial Intelligence', author: '', date: '', summary: '', image: '', content: '' });
  };

  const handleEditBlog = (idx) => {
    setSelectedBlogIdx(idx);
    setBlogForm(blogs[idx]);
    setShowEditBlogModal(true);
  };

  const handleSaveEditBlog = (e) => {
    e.preventDefault();
    const updated = [...blogs];
    updated[selectedBlogIdx] = blogForm;
    setBlogs(updated);
    setDbItem('beyondskills_blogs', updated);
    setShowEditBlogModal(false);
    setSelectedBlogIdx(null);
    setBlogForm({ title: '', category: 'Artificial Intelligence', author: '', date: '', summary: '', image: '', content: '' });
  };

  const handleDeleteBlog = (idx) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const updated = blogs.filter((_, i) => i !== idx);
      setBlogs(updated);
      setDbItem('beyondskills_blogs', updated);
    }
  };

  // MENTOR CRUD Handlers
  const handleAddMentor = (e) => {
    e.preventDefault();
    const updated = [...mentors, mentorForm];
    setMentors(updated);
    setDbItem('beyondskills_mentors', updated);
    setShowAddMentorModal(false);
    setMentorForm({ name: '', role: '', org: '', exp: '', image: '' });
  };

  const handleEditMentor = (idx) => {
    setSelectedMentorIdx(idx);
    setMentorForm(mentors[idx]);
    setShowEditMentorModal(true);
  };

  const handleSaveEditMentor = (e) => {
    e.preventDefault();
    const updated = [...mentors];
    updated[selectedMentorIdx] = mentorForm;
    setMentors(updated);
    setDbItem('beyondskills_mentors', updated);
    setShowEditMentorModal(false);
    setSelectedMentorIdx(null);
    setMentorForm({ name: '', role: '', org: '', exp: '', image: '' });
  };

  const handleDeleteMentor = (idx) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      const updated = mentors.filter((_, i) => i !== idx);
      setMentors(updated);
      setDbItem('beyondskills_mentors', updated);
    }
  };

  // LANDING PAGE CRUD Handlers
  const handleAddLp = (e) => {
    e.preventDefault();
    const parsedHighlights = lpForm.highlights.split('\n').filter(h => h.trim() !== '');
    const parsedFaqs = lpForm.faqs.split('\n\n').map(pair => {
      const lines = pair.split('\n');
      return { q: lines[0]?.replace(/^Q:\s*/i, '') || '', a: lines[1]?.replace(/^A:\s*/i, '') || '' };
    }).filter(f => f.q !== '');

    const updated = [...landingPages, {
      ...lpForm,
      highlights: parsedHighlights,
      faqs: parsedFaqs
    }];
    setLandingPages(updated);
    setDbItem('beyondskills_landing_pages', updated);
    setShowAddLpModal(false);
    setLpForm({ slug: '', courseId: 'full-stack-web', heroHeadline: '', heroSubheadline: '', ctaText: 'Apply Now', highlights: '', faqs: '' });
  };

  const handleEditLp = (idx) => {
    setSelectedLpIdx(idx);
    const target = landingPages[idx];
    setLpForm({
      ...target,
      highlights: (target.highlights || []).join('\n'),
      faqs: (target.faqs || []).map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')
    });
    setShowEditLpModal(true);
  };

  const handleSaveEditLp = (e) => {
    e.preventDefault();
    const parsedHighlights = lpForm.highlights.split('\n').filter(h => h.trim() !== '');
    const parsedFaqs = lpForm.faqs.split('\n\n').map(pair => {
      const lines = pair.split('\n');
      return { q: lines[0]?.replace(/^Q:\s*/i, '') || '', a: lines[1]?.replace(/^A:\s*/i, '') || '' };
    }).filter(f => f.q !== '');

    const updated = [...landingPages];
    updated[selectedLpIdx] = {
      ...lpForm,
      highlights: parsedHighlights,
      faqs: parsedFaqs
    };
    setLandingPages(updated);
    setDbItem('beyondskills_landing_pages', updated);
    setShowEditLpModal(false);
    setSelectedLpIdx(null);
    setLpForm({ slug: '', courseId: 'full-stack-web', heroHeadline: '', heroSubheadline: '', ctaText: 'Apply Now', highlights: '', faqs: '' });
  };

  const handleDeleteLp = (idx) => {
    if (window.confirm('Are you sure you want to delete this landing page config?')) {
      const updated = landingPages.filter((_, i) => i !== idx);
      setLandingPages(updated);
      setDbItem('beyondskills_landing_pages', updated);
    }
  };

  // Check if BDA profile
  const isBdaUser = currentUser && currentUser.role === 'BDA';
  const isBdmUser = currentUser && currentUser.role === 'BDM';
  const isAdminUser = currentUser && (currentUser.role === 'Admin' || currentUser.email === 'beyondskills.ai@gmail.com');

  // Filter leads based on logged in associate name if they are BDA
  const getAccessibleLeads = () => {
    if (isBdaUser) {
      return leads.filter(l => l.assignedBDA === currentUser.name);
    }
    if (isBdmUser) {
      // BDM sees their own leads + leads assigned to BDAs reporting to them
      const myBdas = crmUsers.filter(u => u.reportsTo === currentUser.name).map(u => u.name);
      return leads.filter(l => l.assignedBDM === currentUser.name || myBdas.includes(l.assignedBDA));
    }
    return leads; // Admin sees all
  };

  const accessibleLeads = getAccessibleLeads();

  // Save changes helper
  const saveLeadsToDb = (updatedLeads) => {
    setLeads(updatedLeads);
    setDbItem('beyondskills_leads', updatedLeads);
  };

  // Seed demo data helper with new campaign categories
  const handleSeedDemoData = () => {
    const demoLeads = [
      { id: 'LD001', name: 'Roshan Kumar maharana', email: 'roshan.k@gmail.com', phone: '9776741640', date: '25 Jun 2026', type: 'Google Form Leads', program: 'DA FLAGSHIP - UTTAM', assignedBDM: 'Abhishek Manager', assignedBDA: 'Muskan Gupta', status: 'New', subStatus: 'QUALIFIED', profession: 'Unspecified', mentor: 'None', duration: 'None', callAttempts: { s1: 'DNP', s2: 'CB', s3: 'CB', s4: '-', s5: '-', s6: '-' }, history: [{ note: 'Status 1 DNP, Status 2 CB: Scheduled call back.', date: new Date().toISOString() }] },
      { id: 'LD002', name: 'Pooja Sharma', email: 'pooja.s@yahoo.com', phone: '8765432109', date: new Date(Date.now() - 3600000 * 10).toISOString(), type: 'Google Form Leads', program: 'ai-data-science', assignedBDM: 'Abhishek Manager', assignedBDA: 'Deepak Gupta', status: 'New', subStatus: 'QUALIFIED', profession: 'Student', mentor: 'None', duration: 'None', callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' }, history: [] },
      { id: 'LD003', name: 'Rohit Verma', email: 'rohit@gradus.live', phone: '7654321098', date: new Date(Date.now() - 3600000 * 25).toISOString(), type: 'Ads Leads', program: 'full-stack-web-development', assignedBDM: 'Khushi Manager', assignedBDA: 'Shubham Tyagi', status: 'Not Connected', subStatus: 'DNP', profession: 'Working Professional (< 30k) [WP-1]', mentor: 'None', duration: 'None', callAttempts: { s1: 'DNP', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' }, history: [{ note: 'Attempt 1: No answer / Ringing.', date: new Date().toISOString() }] },
      { id: 'LD004', name: 'Karan Mehra', email: 'karan@gmail.com', phone: '9988776655', date: new Date(Date.now() - 3600000 * 48).toISOString(), type: 'WhatsApp Marketing Leads', program: 'ai-data-science', assignedBDM: 'Khushi Manager', assignedBDA: 'Jatin BDA', status: 'Enrolled', subStatus: 'Already Paid', profession: 'Student', mentor: 'None', duration: 'None', callAttempts: { s1: 'QUALIFIED', s2: 'Already Paid', s3: '-', s4: '-', s5: '-', s6: '-' }, history: [{ note: 'Enrollment confirmed, LMS username set.', date: new Date().toISOString() }] },
      { id: 'LD005', name: 'Sneha Roy', email: 'sneha@outlook.com', phone: '9112233445', date: new Date(Date.now() - 3600000 * 60).toISOString(), type: 'Ads Leads', program: 'ai-data-science', assignedBDM: '', assignedBDA: '', status: 'New', subStatus: 'QUALIFIED', profession: 'Unemployed', mentor: 'None', duration: 'None', callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' }, history: [] }
    ];
    saveLeadsToDb(demoLeads);
    alert('Demo CRM Leads seeded successfully with Ads, Google Form, and WhatsApp campaigns!');
  };

  // Add lead action
  const handleAddLead = (e) => {
    e.preventDefault();
    const newId = `LD${String(leads.length + 1).padStart(3, '0')}`;
    const leadEntry = {
      id: newId,
      name: newLeadForm.name,
      email: newLeadForm.email,
      phone: newLeadForm.phone,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: newLeadForm.type,
      program: newLeadForm.program,
      assignedBDM: isBdaUser ? currentUser.reportsTo || '' : '',
      assignedBDA: isBdaUser ? currentUser.name : '',
      status: newLeadForm.status,
      subStatus: newLeadForm.subStatus,
      profession: 'Unspecified',
      mentor: 'None',
      duration: 'None',
      callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
      history: []
    };
    saveLeadsToDb([...leads, leadEntry]);
    setShowAddLeadModal(false);
    setNewLeadForm({
      name: '', email: '', phone: '', type: 'Ads Leads', program: 'artificial-intelligence', 
      budget: '₹14,000', college: '', message: '', status: 'New', subStatus: 'QUALIFIED'
    });
  };

  // Bulk import actions
  const handleBulkImport = () => {
    try {
      const rows = importText.split('\n').filter(r => r.trim() !== '');
      const parsedLeads = [];
      rows.forEach((row, i) => {
        const cols = row.split(',').map(c => c.trim());
        if (cols[0]) {
          parsedLeads.push({
            id: `LD${String(leads.length + i + 1).padStart(3, '0')}`,
            name: cols[0] || 'Unknown Candidate',
            email: cols[1] || 'no-email@beyondskills.com',
            phone: cols[2] || '0000000000',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            type: cols[3] || 'Ads Leads',
            program: cols[4] || 'ai-data-science',
            assignedBDM: isBdaUser ? currentUser.reportsTo || '' : '',
            assignedBDA: isBdaUser ? currentUser.name : '',
            status: 'New',
            subStatus: 'QUALIFIED',
            profession: 'Unspecified',
            mentor: 'None',
            duration: 'None',
            callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
            history: cols[5] ? [{ note: cols[5], date: new Date().toISOString() }] : []
          });
        }
      });
      saveLeadsToDb([...leads, ...parsedLeads]);
      setShowImportLeadModal(false);
      setImportText('');
      alert(`${parsedLeads.length} leads successfully imported!`);
    } catch (e) {
      alert('Error parsing CSV. Please format as: Name, Email, Phone, Type, Program, Message');
    }
  };

  // CSV parsing logic for Google Sheet Syncing
  const parseSheetCSV = (csvText) => {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return [];
    
    // Clean headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
    
    // Find key index mappings dynamically
    const nameIdx = headers.findIndex(h => h.includes('name'));
    const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
    const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('contact'));
    const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('time'));
    const programIdx = headers.findIndex(h => h.includes('program') || h.includes('course') || h.includes('interest'));
    const notesIdx = headers.findIndex(h => h.includes('note') || h.includes('msg') || h.includes('message') || h.includes('comment') || h.includes('feedback'));

    const parsedRecords = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Comma splitter supporting quoted CSV fields
      const cols = [];
      let insideQuotes = false;
      let currentCol = '';
      
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"' || char === "'") {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          cols.push(currentCol.trim().replace(/^["']|["']$/g, ''));
          currentCol = '';
        } else {
          currentCol += char;
        }
      }
      cols.push(currentCol.trim().replace(/^["']|["']$/g, ''));
      
      const parsedName = nameIdx !== -1 ? cols[nameIdx] : cols[0];
      if (parsedName) {
        parsedRecords.push({
          name: parsedName,
          email: emailIdx !== -1 ? cols[emailIdx] : 'no-email@beyondskills.com',
          phone: phoneIdx !== -1 ? cols[phoneIdx] : '0000000000',
          date: dateIdx !== -1 ? cols[dateIdx] : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          program: programIdx !== -1 ? cols[programIdx] : 'ai-data-science',
          notes: notesIdx !== -1 ? cols[notesIdx] : 'Synced from sheet'
        });
      }
    }
    
    return parsedRecords;
  };

  // Google Sheets integration pull sync triggers
  const handleSyncGoogleSheets = async () => {
    if (!googleFormSheetUrl && !adsSheetUrl) {
      alert('Please enter at least one published Google Sheet CSV URL first.');
      return;
    }
    
    setIsSyncing(true);
    let formLeadsAdded = 0;
    let adsLeadsAdded = 0;
    const currentLeadsList = [...leads];

    try {
      // Sync Google Form Leads Sheet
      if (googleFormSheetUrl) {
        const res = await fetch(googleFormSheetUrl);
        if (res.ok) {
          const csvText = await res.text();
          const parsed = parseSheetCSV(csvText);
          parsed.forEach(row => {
            // Avoid duplicate phones
            if (!currentLeadsList.some(l => l.phone === row.phone)) {
              currentLeadsList.push({
                id: `LD${String(currentLeadsList.length + 1).padStart(3, '0')}`,
                name: row.name,
                email: row.email,
                phone: row.phone,
                date: row.date,
                type: 'Google Form Leads',
                program: row.program,
                assignedBDM: '',
                assignedBDA: '',
                status: 'New',
                subStatus: 'QUALIFIED',
                profession: 'Unspecified',
                mentor: 'None',
                duration: 'None',
                callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
                history: [{ note: row.notes, date: new Date().toISOString() }]
              });
              formLeadsAdded++;
            }
          });
        }
      }

      // Sync Ads Leads Sheet
      if (adsSheetUrl) {
        const res = await fetch(adsSheetUrl);
        if (res.ok) {
          const csvText = await res.text();
          const parsed = parseSheetCSV(csvText);
          parsed.forEach(row => {
            if (!currentLeadsList.some(l => l.phone === row.phone)) {
              currentLeadsList.push({
                id: `LD${String(currentLeadsList.length + 1).padStart(3, '0')}`,
                name: row.name,
                email: row.email,
                phone: row.phone,
                date: row.date,
                type: 'Ads Leads',
                program: row.program,
                assignedBDM: '',
                assignedBDA: '',
                status: 'New',
                subStatus: 'QUALIFIED',
                profession: 'Unspecified',
                mentor: 'None',
                duration: 'None',
                callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
                history: [{ note: row.notes, date: new Date().toISOString() }]
              });
              adsLeadsAdded++;
            }
          });
        }
      }

      saveLeadsToDb(currentLeadsList);
      alert(`Sync Complete!\nSuccessfully imported:\n- ${formLeadsAdded} leads from Google Form Sheet\n- ${adsLeadsAdded} leads from Meta Ads Sheet.`);
    } catch (e) {
      console.error(e);
      alert('Error fetching Sheets. Please ensure Sheets are correctly Published as Comma-separated values (.csv)');
    } finally {
      setIsSyncing(false);
      setShowSheetsSyncModal(false);
    }
  };

  // Mock simulation sheet sync
  const handleSimulateSync = () => {
    const mockGoogleFormCSV = `Timestamp,Full Name,Email,Mobile,Course Program,Query Notes\n2026-07-15 14:02,Rajesh Kumar,rajesh.k@gmail.com,9898980011,ai-data-science,Wants to apply for scholarship\n2026-07-15 14:25,Anjali Mehta,anjali@yahoo.com,8787870022,full-stack-web-development,Inquired on MERN stack fee structure`;
    const mockAdsCSV = `Lead ID,Ad Name,Full Name,Email,Phone,Program Interested\nld_ads_445,AI_Lead_Generation,Vikram Aditya,vikram@outlook.com,7676760033,ai-data-science\nld_ads_446,Fullstack_Camp,Priya Verma,priya@gmail.com,9595950044,full-stack-web-development`;

    let addedCount = 0;
    const currentLeadsList = [...leads];

    // Parse Google Form mock
    const formParsed = parseSheetCSV(mockGoogleFormCSV);
    formParsed.forEach(row => {
      if (!currentLeadsList.some(l => l.phone === row.phone)) {
        currentLeadsList.push({
          id: `LD${String(currentLeadsList.length + 1).padStart(3, '0')}`,
          name: row.name,
          email: row.email,
          phone: row.phone,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: 'Google Form Leads',
          program: row.program,
          assignedBDM: '',
          assignedBDA: '',
          status: 'New',
          subStatus: 'QUALIFIED',
          profession: 'Unspecified',
          mentor: 'None',
          duration: 'None',
          callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
          history: [{ note: row.notes, date: new Date().toISOString() }]
        });
        addedCount++;
      }
    });

    // Parse Ads mock
    const adsParsed = parseSheetCSV(mockAdsCSV);
    adsParsed.forEach(row => {
      if (!currentLeadsList.some(l => l.phone === row.phone)) {
        currentLeadsList.push({
          id: `LD${String(currentLeadsList.length + 1).padStart(3, '0')}`,
          name: row.name,
          email: row.email,
          phone: row.phone,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: 'Ads Leads',
          program: row.program,
          assignedBDM: '',
          assignedBDA: '',
          status: 'New',
          subStatus: 'QUALIFIED',
          profession: 'Unspecified',
          mentor: 'None',
          duration: 'None',
          callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
          history: [{ note: 'Imported from mock Facebook/Instagram Campaign', date: new Date().toISOString() }]
        });
        addedCount++;
      }
    });

    saveLeadsToDb(currentLeadsList);
    alert(`Mock Sheet Sync Simulation Successful!\nAdded ${addedCount} new unique lead records to the database.`);
    setShowSheetsSyncModal(false);
  };

  // Delete lead
  const handleDeleteLeadEntry = (idx) => {
    const updated = leads.filter((_, i) => i !== idx);
    saveLeadsToDb(updated);
  };

  // Edit lead action trigger (Opens detailed Lead Details Panel)
  const handleStartEditLead = (lead, idx) => {
    setSelectedLead({
      ...lead,
      profession: lead.profession || 'Unspecified',
      callAttempts: lead.callAttempts || { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' }
    });
    setSelectedLeadIdx(idx);
    setShowEditLeadModal(true);
  };

  const handleSaveEditLead = (e) => {
    if (e) e.preventDefault();
    const updated = [...leads];
    updated[selectedLeadIdx] = selectedLead;
    saveLeadsToDb(updated);
    setShowEditLeadModal(false);
    setSelectedLead(null);
    alert('Lead details saved successfully!');
  };

  // Bulk assignment confirms
  const handleBulkReallocate = () => {
    if (selectedLeadIndexes.length === 0) {
      alert('Please select at least one lead from the table!');
      return;
    }
    const updated = [...leads];
    selectedLeadIndexes.forEach(idx => {
      if (bulkBDM) updated[idx].assignedBDM = bulkBDM;
      if (bulkBDA) updated[idx].assignedBDA = bulkBDA;
      if (bulkStatus) updated[idx].status = bulkStatus;
    });
    saveLeadsToDb(updated);
    setSelectedLeadIndexes([]);
    setBulkBDA('');
    setBulkBDM('');
    setBulkStatus('');
    alert('Selected leads successfully reallocated!');
  };

  // Manage users
  const handleAddUser = (e) => {
    e.preventDefault();
    const updated = [...crmUsers, newUserForm];
    setCrmUsers(updated);
    setDbItem('beyondskills_crm_users', updated);
    logUserAccess(newUserForm.email, newUserForm.name, `CRM User Created: ${newUserForm.role}`);
    setShowAddUserModal(false);
    setNewUserForm({ name: '', email: '', role: 'BDA', reportsTo: '', password: '' });
  };

  const handleRemoveUser = (idx) => {
    const targetUser = crmUsers[idx];
    const updated = crmUsers.filter((_, i) => i !== idx);
    setCrmUsers(updated);
    setDbItem('beyondskills_crm_users', updated);
    if (targetUser) {
      logUserAccess(targetUser.email, targetUser.name, `CRM User Revoked: ${targetUser.role}`);
    }
  };

  // Call history and attempts logs inside details panel
  const handleAddHistoryNote = () => {
    if (!noteText.trim()) return;
    const updatedHistory = [...(selectedLead.history || [])];
    updatedHistory.unshift({
      note: noteText,
      date: new Date().toISOString()
    });
    const updatedLead = { ...selectedLead, history: updatedHistory };
    
    // Save to local states and db directly
    setSelectedLead(updatedLead);
    const updatedLeads = [...leads];
    updatedLeads[selectedLeadIdx] = updatedLead;
    saveLeadsToDb(updatedLeads);
    setNoteText('');
  };

  // Filtering leads calculation
  const getFilteredLeads = () => {
    return accessibleLeads.filter((lead) => {
      const matchSearch = lead.name.toLowerCase().includes(leadSearch.toLowerCase()) || 
                          lead.phone.includes(leadSearch) ||
                          lead.id.toLowerCase().includes(leadSearch.toLowerCase());
      const matchStatus = filterStatus ? lead.status === filterStatus : true;
      
      // Filter by dynamic channel tabs
      let matchType = filterType ? lead.type === filterType : true;
      if (leadChannelTab === 'google') {
        matchType = lead.type === 'Google Form Leads';
      } else if (leadChannelTab === 'ads') {
        matchType = lead.type === 'Ads Leads';
      } else if (leadChannelTab === 'whatsapp') {
        matchType = lead.type === 'WhatsApp Marketing Leads';
      }

      // Filter by dynamic sub-tabs under ads
      let matchProgram = filterProgram ? lead.program === filterProgram : true;
      if (leadChannelTab === 'ads') {
        if (leadAdsSubTab === 'aimlds') {
          matchProgram = ['artificial-intelligence', 'machine-learning', 'data-science'].includes(lead.program);
        } else if (leadAdsSubTab === 'cloud') {
          matchProgram = lead.program === 'cloud-computing';
        } else if (leadAdsSubTab === 'cyber') {
          matchProgram = lead.program === 'cyber-security';
        } else if (leadAdsSubTab === 'fullstack') {
          matchProgram = lead.program === 'full-stack-web';
        } else if (leadAdsSubTab === 'digimar') {
          matchProgram = lead.program === 'digital-marketing-cert';
        }
      }

      const matchBDA = filterBDA ? lead.assignedBDA === filterBDA : true;
      const matchBDM = filterBDM ? lead.assignedBDM === filterBDM : true;
      const matchSub = filterSubStatus ? lead.subStatus === filterSubStatus : true;
      
      let matchDate = true;
      if (filterDateFrom) {
        matchDate = matchDate && new Date(lead.date) >= new Date(filterDateFrom);
      }
      if (filterDateTo) {
        matchDate = matchDate && new Date(lead.date) <= new Date(filterDateTo);
      }
      
      return matchSearch && matchStatus && matchType && matchProgram && matchBDA && matchBDM && matchSub && matchDate;
    });
  };

  const filteredLeads = getFilteredLeads();

  // HTML5 drag and drop row reordering handlers
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) return;
    const items = [...filteredLeads];
    const draggedItem = items[draggedIdx];
    items.splice(draggedIdx, 1);
    items.splice(targetIndex, 0, draggedItem);
    
    // Now, update the master leads list order based on the new order of filteredLeads
    const finalLeads = [...leads];
    const masterDraggedIdx = leads.findIndex(l => l.id === draggedItem.id);
    const targetItem = filteredLeads[targetIndex];
    const masterTargetIdx = leads.findIndex(l => l.id === targetItem.id);
    
    if (masterDraggedIdx !== -1 && masterTargetIdx !== -1) {
      finalLeads.splice(masterDraggedIdx, 1);
      finalLeads.splice(masterTargetIdx, 0, draggedItem);
      saveLeadsToDb(finalLeads);
    }
    setDraggedIdx(null);
  };

  // Kanban column placements calculations
  const getKanbanLeads = (col) => {
    // Col is 'overdue', 'today', 'tomorrow', 'later'
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    return accessibleLeads.filter(l => {
      if (l.status !== 'Follow Up') return false;
      const date = l.date ? new Date(l.date) : new Date();
      if (col === 'overdue') return date < today;
      if (col === 'today') return date >= today && date < tomorrow;
      if (col === 'tomorrow') return date >= tomorrow && date < dayAfter;
      if (col === 'later') return date >= dayAfter;
      return false;
    });
  };

  // CRM Statistics calculations (Filtered for BDA if BDA is logged in)
  const statsTotalLeads = accessibleLeads.length;
  const statsMasterclassLeads = accessibleLeads.filter(l => l.type === 'Google Form Leads').length;
  const statsConversionRate = statsTotalLeads > 0 ? ((accessibleLeads.filter(l => l.status === 'Enrolled').length / statsTotalLeads) * 1051).toFixed(1) : 0;
  const statsSuccessfulEnrollments = accessibleLeads.filter(l => l.status === 'Enrolled').length;
  const statsHotLeads = accessibleLeads.filter(l => l.status === 'Follow Up').length;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center relative overflow-hidden font-sans select-none px-4">
        {/* Ambient light gradient background */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>
        
        {/* Floating tech background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* React */}
          <div className="absolute top-[10%] left-[8%] animate-float pointer-events-none opacity-40 text-blue-500" style={{ animationDuration: '8s' }}>
            <svg className="w-16 h-16" viewBox="-11.5 -10.23 23 20.46" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </svg>
          </div>
          {/* Javascript */}
          <div className="absolute top-[25%] right-[10%] animate-float pointer-events-none opacity-40 text-yellow-500" style={{ animationDuration: '10s', animationDelay: '1s' }}>
            <div className="w-14 h-14 bg-yellow-550 text-black font-black text-xl rounded-xl flex items-center justify-center shadow-md font-mono">JS</div>
          </div>
          {/* Python */}
          <div className="absolute bottom-[20%] left-[12%] animate-float pointer-events-none opacity-40 text-blue-600" style={{ animationDuration: '9s', animationDelay: '2s' }}>
            <svg className="w-14 h-14" viewBox="0 0 448 512" fill="currentColor">
              <path d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 36.8-31.2 60.8-66.8 60.8H185.9c-9.9 0-17.9 8-17.9 17.9v45.7c0 9.9 8 17.9 17.9 17.9h148c30.1 0 53.4-23.3 53.4-53.4v-40.1c31.1 0 54.2-14.6 54.2-45.7-.1-.1-.1-2.9-.2-6.1zm-86.8-12c-12 0-21.6-9.7-21.6-21.7s9.7-21.7 21.6-21.7c12 0 21.7 9.7 21.7 21.7s-9.7 21.7-21.7 21.7zM8.2 311.5c7.7 30.9 22.3 54.2 53.4 54.2h40.1v-47.4c0-36.8 31.2-60.8 66.8-60.8h93.6c9.9 0 17.9-8 17.9-17.9v-45.7c0-9.9-8-17.9-17.9-17.9h-148c-30.1 0-53.4 23.3-53.4 53.4v40.1c-31.1 0-54.2 14.6-54.2 45.7 0 .1 0 2.9.2 6.1zm86.8 12c12 0 21.6 9.7 21.6 21.7s-9.7 21.7-21.6 21.7c-12 0-21.7-9.7-21.7-21.7s9.7-21.7 21.7-21.7z"/>
            </svg>
          </div>
          {/* Node.js */}
          <div className="absolute bottom-[35%] right-[14%] animate-float pointer-events-none opacity-40 text-green-600" style={{ animationDuration: '11s', animationDelay: '1.5s' }}>
            <svg className="w-14 h-14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7.7v10.6L12 24l10-5.7V7.7L12 2zm-1 18.5l-6-3.5v-7l6 3.5v7zm1-8.7L6 8.3l6-3.5 6 3.5 6 3.5zm7 5.2l-6 3.5v-7l6-3.5v7z"/>
            </svg>
          </div>
          {/* Cloud/AWS */}
          <div className="absolute top-[40%] left-[20%] animate-float pointer-events-none opacity-30 text-[#0ea5e9]" style={{ animationDuration: '12s', animationDelay: '0.5s' }}>
            <div className="w-12 h-12 bg-sky-50 text-sky-600 border border-sky-200/50 rounded-xl flex items-center justify-center shadow-sm">
              <Globe className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="max-w-md w-full bg-white border border-slate-200/60 rounded-3xl p-10 shadow-xl z-10 animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            {/* Styled Logo */}
            <div className="flex items-center space-x-1.5 mb-2">
              <span className="logo-font text-2xl font-black text-[#0A0E35]">Beyond</span>
              <span className="logo-font text-2xl font-black bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] bg-clip-text text-transparent">Skills</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2A4BFF] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full font-mono">
              CRM Admin Panel
            </span>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                Email Address
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  required 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-55 border border-slate-200/80 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-800 focus:border-[#2a4bff] outline-none transition-all"
                  placeholder="name@beyondskills.in" 
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                Access Password
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  required 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-55 border border-slate-200/80 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-800 focus:border-[#2a4bff] outline-none transition-all"
                  placeholder="••••••••" 
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center space-x-2 font-semibold animate-fade-in">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] hover:opacity-95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In To CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center text-[10px] text-slate-400 font-mono">
          🔒 Secure SSL encrypted connection. Authorized personnel only.
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex font-sans overflow-x-hidden antialiased text-[13px] sm:text-sm transition-colors duration-300 admin-theme-container ${isDarkMode ? 'bg-[#030712] text-slate-100 admin-theme-dark' : 'bg-[#F8FAFC] text-slate-800 admin-theme-light'}`}>
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0B0F19] border-r border-white/5 flex flex-col shrink-0">
        {/* Branding header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-gradient-to-tr from-[#2A4BFF] to-[#0EA5E9] p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <span className="logo-font text-white font-black text-lg tracking-tight">BeyondSkills</span>
          </div>
          <button className="text-slate-400 hover:text-white border border-white/10 rounded-lg p-1 bg-white/5 cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
        
        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {/* Dashboard menu */}
          <button 
            onClick={() => setActiveMainTab('analytics')}
            className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
              activeMainTab === 'analytics' 
                ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BarChart className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Leads Sub-Menu Header */}
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4.5 pt-4 pb-1.5 font-mono">Leads Pipeline</div>
          
          <button 
            onClick={() => { setActiveMainTab('leads_manager'); setLeadsSubTab('list'); }}
            className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
              activeMainTab === 'leads_manager' && leadsSubTab === 'list'
                ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Leads List</span>
          </button>

          <button 
            onClick={() => { setActiveMainTab('leads_manager'); setLeadsSubTab('kanban'); }}
            className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
              activeMainTab === 'leads_manager' && leadsSubTab === 'kanban'
                ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Follow-ups Board</span>
          </button>

          {!isBdaUser && (
            <>
              {/* Allocation Sub-Menu */}
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4.5 pt-4 pb-1.5 font-mono">Allocation</div>

              <button 
                onClick={() => { setActiveMainTab('allocation'); setAllocationSubTab('assigned'); }}
                className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeMainTab === 'allocation' && allocationSubTab === 'assigned'
                    ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Assigned Leads</span>
              </button>

              <button 
                onClick={() => { setActiveMainTab('allocation'); setAllocationSubTab('bulk'); }}
                className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeMainTab === 'allocation' && allocationSubTab === 'bulk'
                    ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Assign Leads</span>
              </button>

              {/* Management Sub-Menu */}
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4.5 pt-4 pb-1.5 font-mono">Management</div>

              <button 
                onClick={() => setActiveMainTab('lead_analysis')}
                className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeMainTab === 'lead_analysis'
                    ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Lead Analysis</span>
              </button>

              <button 
                onClick={() => setActiveMainTab('bda_performance')}
                className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeMainTab === 'bda_performance'
                    ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>BDAs Performance</span>
              </button>

              <button 
                onClick={() => setActiveMainTab('blogs_manager')}
                className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeMainTab === 'blogs_manager'
                    ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Blogs</span>
              </button>

              <button 
                onClick={() => setActiveMainTab('mentors_manager')}
                className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeMainTab === 'mentors_manager'
                    ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Mentors</span>
              </button>

              <button 
                onClick={() => setActiveMainTab('landing_pages_manager')}
                className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeMainTab === 'landing_pages_manager'
                    ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Landing Pages</span>
              </button>

              <button 
                onClick={() => setActiveMainTab('users')}
                className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeMainTab === 'users'
                    ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>CRM Users</span>
              </button>

              {currentUser && currentUser.email === 'beyondskills.ai@gmail.com' && (
                <button 
                  onClick={() => setActiveMainTab('access_logs')}
                  className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
                    activeMainTab === 'access_logs'
                      ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Access Logs</span>
                </button>
              )}
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-4 font-sans">
          {/* User profile card */}
          {currentUser && (
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5 animate-fade-in">
              <div className="w-9 h-9 rounded-lg bg-[#2A4BFF]/20 text-[#0EA5E9] font-bold flex items-center justify-center border border-[#2A4BFF]/25 font-mono text-sm">
                {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">{currentUser.name}</p>
                <span className="text-[9px] font-bold text-red-550 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest mt-1 inline-block">
                  {currentUser.role === 'Admin' ? 'Sales Head' : currentUser.role}
                </span>
              </div>
            </div>
          )}

          {/* Theme toggler */}
          <div className={`flex p-1 rounded-xl border text-xs font-bold transition-all duration-300 ${isDarkMode ? 'bg-[#030712] border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <button 
              type="button"
              onClick={() => toggleTheme(false)}
              className={`flex-1 flex items-center justify-center py-1.5 rounded-lg cursor-pointer transition-all ${
                !isDarkMode ? 'bg-white text-[#2A4BFF] border border-slate-200/80 shadow-sm' : 'hover:text-white'
              }`}
            >
              Light
            </button>
            <button 
              type="button"
              onClick={() => toggleTheme(true)}
              className={`flex-1 flex items-center justify-center py-1.5 rounded-lg cursor-pointer transition-all ${
                isDarkMode ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' : 'hover:text-slate-900'
              }`}
            >
              Dark
            </button>
          </div>

          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/10 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col min-h-screen relative overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-[#030712]' : 'bg-[#F8FAFC]'}`}>
        {/* Colorful Ambient Glow Spots & Grid Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Grid Pattern with subtle tint */}
          <div className={`absolute inset-0 bg-[size:16px_28px] ${
            isDarkMode 
              ? 'bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)]' 
              : 'bg-[linear-gradient(to_right,rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.02)_1px,transparent_1px)]'
          }`}></div>

          {/* Spot 1: Neon Cyan */}
          <div className={`absolute top-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full blur-[130px] opacity-60 transition-colors duration-500 ${
            isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-300/15'
          }`}></div>
          
          {/* Spot 2: Indigo / Purple */}
          <div className={`absolute top-[40%] right-[-10%] w-[550px] h-[550px] rounded-full blur-[140px] opacity-50 transition-colors duration-500 ${
            isDarkMode ? 'bg-indigo-500/8' : 'bg-indigo-300/15'
          }`}></div>
          
          {/* Spot 3: Rose / Pink */}
          <div className={`absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-40 transition-colors duration-500 ${
            isDarkMode ? 'bg-rose-500/8' : 'bg-rose-300/15'
          }`}></div>
        </div>
        
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8 z-10 relative">
          
          {/* Banner Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 gap-4 border-b border-white/5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                Welcome, {currentUser ? currentUser.name : 'User'}
                {currentUser && (
                  <span className="text-xs font-bold font-mono bg-red-500/10 text-red-500 px-2.5 py-1 rounded border border-red-500/20 uppercase tracking-widest">
                    {currentUser.role === 'Admin' ? 'Sales Head' : currentUser.role}
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-400 mt-1.5">Here is your sales and performance dashboard for today.</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {isAdminUser && (
                <>
                  <button 
                    onClick={handleSeedDemoData} 
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Seed Demo Data</span>
                  </button>
                  <button 
                    onClick={() => {
                      setLeads([]);
                      setDbItem('beyondskills_leads', []);
                      alert('All leads database deleted successfully!');
                    }}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Leads</span>
                  </button>
                </>
              )}
              
              <button 
                onClick={() => setShowAddLeadModal(true)}
                className="bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Lead</span>
              </button>
            </div>
          </div>

        {/* -------------------- MAIN TAB 1: DASHBOARD ANALYTICS -------------------- */}
        {activeMainTab === 'analytics' && (
          <div className="space-y-10 animate-fade-in">
            {/* KPI statistics - Grid Layout matching the screenshot (4 upper cards, 2 lower cards) */}
            <div className="space-y-6">
              {/* Upper Grid: 4 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* TOTAL LEADS */}
                <div className="bg-[#0E1526] border border-white/5 p-6 rounded-2xl shadow-xl flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-mono">
                      Total Leads
                    </span>
                    <p className="text-3xl font-extrabold font-mono mt-1 text-white">{statsTotalLeads}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1 font-mono">Live - In system pipelines</p>
                  </div>
                  <div className="bg-[#2A4BFF]/10 text-[#2A4BFF] p-3 rounded-xl border border-[#2A4BFF]/20">
                    <Inbox className="w-5 h-5" />
                  </div>
                </div>
                
                {/* MASTERCLASS LEADS */}
                <div className="bg-[#0E1526] border border-white/5 p-6 rounded-2xl shadow-xl flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-mono">Masterclass Leads</span>
                    <p className="text-3xl font-extrabold font-mono mt-1 text-white">{statsMasterclassLeads}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1 font-mono">Click to assign - Assign leads</p>
                  </div>
                  <div className="bg-amber-500/10 text-amber-500 p-3 rounded-xl border border-amber-500/20">
                    <Star className="w-5 h-5" />
                  </div>
                </div>

                {/* FX LEADS */}
                <div className="bg-[#0E1526] border border-white/5 p-6 rounded-2xl shadow-xl flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-mono">FX Leads</span>
                    <p className="text-3xl font-extrabold font-mono mt-1 text-white">0</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1 font-mono">Click to assign - Assign leads</p>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl border border-emerald-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                {/* CONVERSION RATE */}
                <div className="bg-[#0E1526] border border-white/5 p-6 rounded-2xl shadow-xl flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-mono">Conversion Rate</span>
                    <p className="text-3xl font-extrabold font-mono mt-1 text-white">{statsConversionRate}%</p>
                    <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest mt-1.5 inline-block font-mono">
                      Needs Review
                    </span>
                  </div>
                  <div className="bg-[#e11d48]/10 text-[#f43f5e] p-3 rounded-xl border border-[#e11d48]/20">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Lower Grid: 2 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* SUCCESSFUL ENROLMENTS */}
                <div className="bg-[#0E1526] border border-white/5 p-6 rounded-2xl shadow-xl flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-mono">Successful Enrolments</span>
                    <p className="text-3xl font-extrabold font-mono mt-1 text-[#4ADE80]">{statsSuccessfulEnrollments}</p>
                    <span className="text-[9px] font-bold text-emerald-500 bg-[#10b981]/15 px-2 py-0.5 rounded border border-[#10b981]/25 uppercase tracking-widest mt-1.5 inline-block font-mono">
                      +{statsSuccessfulEnrollments}
                    </span>
                  </div>
                  <div className="bg-[#4ADE80]/10 text-[#4ADE80] p-3 rounded-xl border border-[#4ADE80]/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                {/* ACTIVE HOT LEADS */}
                <div className="bg-[#0E1526] border border-white/5 p-6 rounded-2xl shadow-xl flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest font-mono">Active Hot Leads</span>
                    <p className="text-3xl font-extrabold font-mono mt-1 text-orange-400">{statsHotLeads}</p>
                    <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest mt-1.5 inline-block font-mono">
                      In Progress
                    </span>
                  </div>
                  <div className="bg-orange-500/10 text-orange-500 p-3 rounded-xl border border-orange-500/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Distribution & Source Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Funnel chart widget */}
              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl text-white">
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center space-x-2 border-b border-white/10 pb-4 mb-4">
                  <LineChart className="w-4.5 h-4.5 text-brand-cyan" />
                  <span>My Pipeline Funnel Stage View</span>
                </h3>
                
                <div className="space-y-4 pt-2">
                  {[
                    { name: 'New Leads', count: accessibleLeads.filter(l => l.status === 'New').length },
                    { name: 'Connected / Contacted', count: accessibleLeads.filter(l => l.status === 'Contacted').length },
                    { name: 'Follow Up (Pending Dial)', count: accessibleLeads.filter(l => l.status === 'Follow Up').length },
                    { name: 'Not Connected (DNP/SO)', count: accessibleLeads.filter(l => l.status === 'Not Connected').length },
                    { name: 'Enrolled (Closed Success)', count: accessibleLeads.filter(l => l.status === 'Enrolled').length },
                    { name: 'Not Interested (Closed Lost)', count: accessibleLeads.filter(l => l.status === 'Not Interested').length }
                  ].map((step, idx) => {
                    const percentage = statsTotalLeads > 0 ? ((step.count / statsTotalLeads) * 100).toFixed(1) : 0;
                    return (
                      <div key={idx} className="relative">
                        <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                          <span className="text-slate-300">{step.name}</span>
                          <span className="text-white font-bold">{step.count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                          <div className="bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] h-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Marketing Lead Source Breakdown */}
              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center space-x-2 border-b border-white/10 pb-4 mb-4">
                    <PieChart className="w-4.5 h-4.5 text-[#2A4BFF]" />
                    <span>Lead Campaign Categories</span>
                  </h3>
                  
                  <div className="space-y-3 pt-2 text-xs font-mono">
                    {[
                      { name: 'Ads Campaign Leads', count: accessibleLeads.filter(l => l.type === 'Ads Leads').length },
                      { name: 'Google Form Leads', count: accessibleLeads.filter(l => l.type === 'Google Form Leads').length },
                      { name: 'WhatsApp Marketing Leads', count: accessibleLeads.filter(l => l.type === 'WhatsApp Marketing Leads').length }
                    ].map((src, idx) => {
                      const pct = statsTotalLeads > 0 ? ((src.count / statsTotalLeads) * 100).toFixed(1) : 0;
                      return (
                        <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-slate-400 flex items-center">
                            <Globe className="w-3.5 h-3.5 text-[#2A4BFF] mr-2" />
                            {src.name}
                          </span>
                          <span className="text-white font-bold">{src.count} ({pct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* -------------------- MAIN TAB 2: LEADS MANAGER -------------------- */}
        {activeMainTab === 'leads_manager' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Sub-tab navigation */}
            <div className="flex border-b border-slate-200 mb-6 gap-6 text-sm">
              <button 
                onClick={() => setLeadsSubTab('list')}
                className={`pb-3 font-bold border-b-2 transition-all ${
                  leadsSubTab === 'list' ? 'border-[#2A4BFF] text-[#2A4BFF]' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Leads Database List
              </button>
              <button 
                onClick={() => setLeadsSubTab('kanban')}
                className={`pb-3 font-bold border-b-2 transition-all ${
                  leadsSubTab === 'kanban' ? 'border-[#2A4BFF] text-[#2A4BFF]' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Follow-ups Board (Kanban)
              </button>
            </div>

            {/* Subtab 1: Leads List */}
            {leadsSubTab === 'list' && (
              <div className="space-y-6">
                
                {/* 3 Main Campaign Channel Tabs */}
                <div className="flex flex-wrap gap-2 bg-[#050718]/80 p-2 rounded-2xl border border-white/10 w-fit">
                  <button
                    onClick={() => {
                      setLeadChannelTab('all');
                      setFilterType('');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      leadChannelTab === 'all'
                        ? 'bg-[#2A4BFF] text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    All Channels
                  </button>
                  <button
                    onClick={() => {
                      setLeadChannelTab('google');
                      setFilterType('Google Form Leads');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      leadChannelTab === 'google'
                        ? 'bg-[#2A4BFF] text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Google Form Leads
                  </button>
                  <button
                    onClick={() => {
                      setLeadChannelTab('ads');
                      setFilterType('Ads Leads');
                      setLeadAdsSubTab('all');
                      setFilterProgram('');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      leadChannelTab === 'ads'
                        ? 'bg-[#2A4BFF] text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Ads Campaigns Leads
                  </button>
                  <button
                    onClick={() => {
                      setLeadChannelTab('whatsapp');
                      setFilterType('WhatsApp Marketing Leads');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      leadChannelTab === 'whatsapp'
                        ? 'bg-[#2A4BFF] text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    WhatsApp Campaigns
                  </button>
                </div>

                {/* Ads Campaigns Sub-Tabs (Sheets) */}
                {leadChannelTab === 'ads' && (
                  <div className="flex flex-wrap gap-2 items-center bg-[#050718]/40 p-2 rounded-xl border border-white/5 w-fit">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono mr-2">Filters (Landing Pages):</span>
                    <button
                      onClick={() => {
                        setLeadAdsSubTab('all');
                        setFilterProgram('');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        leadAdsSubTab === 'all'
                          ? 'bg-[#0EA5E9] text-white'
                          : 'text-slate-450 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      All Sheets
                    </button>
                    <button
                      onClick={() => {
                        setLeadAdsSubTab('aimlds');
                        setFilterProgram(''); 
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        leadAdsSubTab === 'aimlds'
                          ? 'bg-[#0EA5E9] text-white'
                          : 'text-slate-450 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      AI / ML / DS Sheet
                    </button>
                    <button
                      onClick={() => {
                        setLeadAdsSubTab('cloud');
                        setFilterProgram('cloud-computing');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        leadAdsSubTab === 'cloud'
                          ? 'bg-[#0EA5E9] text-white'
                          : 'text-slate-450 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Cloud computing Sheet
                    </button>
                    <button
                      onClick={() => {
                        setLeadAdsSubTab('cyber');
                        setFilterProgram('cyber-security');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        leadAdsSubTab === 'cyber'
                          ? 'bg-[#0EA5E9] text-white'
                          : 'text-slate-450 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Cyber security Sheet
                    </button>
                    <button
                      onClick={() => {
                        setLeadAdsSubTab('fullstack');
                        setFilterProgram('full-stack-web');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        leadAdsSubTab === 'fullstack'
                          ? 'bg-[#0EA5E9] text-white'
                          : 'text-slate-450 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Full Stack Sheet
                    </button>
                    <button
                      onClick={() => {
                        setLeadAdsSubTab('digimar');
                        setFilterProgram('digital-marketing-cert');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        leadAdsSubTab === 'digimar'
                          ? 'bg-[#0EA5E9] text-white'
                          : 'text-slate-450 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Digital Marketing Sheet
                    </button>
                  </div>
                )}
                
                {/* Actions & Filters Header */}
                <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl text-white space-y-6">
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-brand-cyan">Active Lead Filters</h3>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setShowSheetsSyncModal(true)} 
                        className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white border border-[#0EA5E9]/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow"
                      >
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Google Sheet Sync</span>
                      </button>
                      <button 
                        onClick={() => setShowImportLeadModal(true)} 
                        className="bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-brand-cyan" />
                        <span>Import Leads (CSV)</span>
                      </button>
                      <button 
                        onClick={() => setShowAddLeadModal(true)} 
                        className="bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Single Lead</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Dropdowns Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Search Name / Phone</label>
                      <input 
                        type="text" 
                        value={leadSearch}
                        onChange={(e) => setLeadSearch(e.target.value)}
                        placeholder="Search leads..."
                        className="w-full bg-[#050718] border border-white/15 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-cyan font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Lead Campaign Type</label>
                      <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full bg-[#050718] border border-white/15 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-cyan cursor-pointer"
                      >
                        <option value="">All Types</option>
                        <option value="Ads Leads">Ads Leads</option>
                        <option value="Google Form Leads">Google Form Leads</option>
                        <option value="WhatsApp Marketing Leads">WhatsApp Marketing Leads</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Sales Pipeline Status</label>
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-[#050718] border border-white/15 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-cyan cursor-pointer"
                      >
                        <option value="">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Follow Up">Follow Up</option>
                        <option value="Not Connected">Not Connected</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Sub-Status Outcome</label>
                      <select 
                        value={filterSubStatus}
                        onChange={(e) => setFilterSubStatus(e.target.value)}
                        className="w-full bg-[#050718] border border-white/15 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-cyan cursor-pointer"
                      >
                        <option value="">All Sub-Statuses</option>
                        <option value="QUALIFIED">QUALIFIED</option>
                        <option value="DNP">DNP (Did Not Pick)</option>
                        <option value="NI">NI (Not Interested)</option>
                        <option value="CB">CB (Call Back)</option>
                        <option value="SO">SO (Switched Off)</option>
                        <option value="WFC">WFC (Waiting Confirmation)</option>
                        <option value="NQ">NQ (Not Qualified)</option>
                        <option value="Already Paid">Already Paid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs border-t border-white/10 pt-4">
                    {!isBdaUser && (
                      <>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Assigned BDM</label>
                          <select 
                            value={filterBDM}
                            onChange={(e) => setFilterBDM(e.target.value)}
                            className="w-full bg-[#050718] border border-white/15 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-cyan cursor-pointer"
                          >
                            <option value="">All BDMs</option>
                            {crmUsers.filter(u => u.role === 'BDM').map((bdm, i) => (
                              <option key={i} value={bdm.name}>{bdm.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Assigned BDA</label>
                          <select 
                            value={filterBDA}
                            onChange={(e) => setFilterBDA(e.target.value)}
                            className="w-full bg-[#050718] border border-white/15 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-cyan cursor-pointer"
                          >
                            <option value="">All BDAs</option>
                            {crmUsers.filter(u => u.role === 'BDA').map((bda, i) => (
                              <option key={i} value={bda.name}>{bda.name}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                    
                    <div className="sm:col-span-2 flex items-end justify-between gap-4">
                      <div className="flex-grow">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Timeline Date Filters</label>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="date" 
                            value={filterDateFrom}
                            onChange={(e) => setFilterDateFrom(e.target.value)}
                            className="bg-[#050718] border border-white/15 rounded-lg px-2.5 py-1.5 text-white outline-none text-xs flex-grow font-mono"
                          />
                          <span className="text-slate-400 font-mono text-[9px] uppercase">to</span>
                          <input 
                            type="date" 
                            value={filterDateTo}
                            onChange={(e) => setFilterDateTo(e.target.value)}
                            className="bg-[#050718] border border-white/15 rounded-lg px-2.5 py-1.5 text-white outline-none text-xs flex-grow font-mono"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setLeadSearch('');
                          setFilterStatus('');
                          setFilterType('');
                          setFilterProgram('');
                          setFilterBDA('');
                          setFilterBDM('');
                          setFilterSubStatus('');
                          setFilterDateFrom('');
                          setFilterDateTo('');
                        }}
                        className="bg-white/10 hover:bg-white/15 px-4.5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>

                </div>

                {/* Bulk Actions Console */}
                {!isBdaUser && selectedLeadIndexes.length > 0 && (
                  <div className="bg-[#2A4BFF]/10 border border-[#2A4BFF]/30 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 animate-fade-in">
                    <span className="text-xs font-bold text-[#2A4BFF] font-mono">
                      {selectedLeadIndexes.length} leads selected for processing:
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <select 
                        value={bulkBDM}
                        onChange={(e) => setBulkBDM(e.target.value)}
                        className="bg-[#0A0E35] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="">Set BDM</option>
                        {crmUsers.filter(u => u.role === 'BDM').map((bdm, i) => (
                          <option key={i} value={bdm.name}>{bdm.name}</option>
                        ))}
                      </select>
                      <select 
                        value={bulkBDA}
                        onChange={(e) => setBulkBDA(e.target.value)}
                        className="bg-[#0A0E35] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="">Set BDA</option>
                        {crmUsers.filter(u => u.role === 'BDA').map((bda, i) => (
                          <option key={i} value={bda.name}>{bda.name}</option>
                        ))}
                      </select>
                      <select 
                        value={bulkStatus}
                        onChange={(e) => setBulkStatus(e.target.value)}
                        className="bg-[#0A0E35] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="">Set Status</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Follow Up">Follow Up</option>
                        <option value="Not Connected">Not Connected</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>
                      <button 
                        onClick={handleBulkReallocate}
                        className="bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-lg transition-colors shadow-md"
                      >
                        Confirm Edit
                      </button>
                      <button 
                        onClick={() => setSelectedLeadIndexes([])}
                        className="text-slate-500 hover:text-slate-800 text-xs font-semibold px-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Leads Database Table */}
                {filteredLeads.length === 0 ? (
                  <div className="bg-[#0A0E35] border border-white/10 p-12 rounded-2xl text-center shadow-xl space-y-4 max-w-lg mx-auto">
                    <Inbox className="w-12 h-12 text-slate-500 mx-auto" />
                    <h4 className="font-bold text-white text-sm">No Leads Match Filters</h4>
                    <p className="text-xs text-slate-400">Database is empty or the current filters didn't return any candidate records.</p>
                  </div>
                ) : (
                  <div className="bg-[#0A0E35] border border-white/10 rounded-2xl p-6 shadow-xl overflow-x-auto text-white">
                    <table className="w-full text-left text-xs text-slate-300 min-w-[900px]">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 pb-2 uppercase text-[9px] tracking-wider font-mono">
                          <th className="py-3 px-4">
                            <input 
                              type="checkbox"
                              checked={selectedLeadIndexes.length === filteredLeads.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLeadIndexes(filteredLeads.map((_, i) => i));
                                } else {
                                  setSelectedLeadIndexes([]);
                                }
                              }}
                              className="cursor-pointer"
                            />
                          </th>
                          <th className="py-3 px-4">Drag</th>
                          <th className="py-3 px-4">ID</th>
                          <th className="py-3 px-4">Prospect Name</th>
                          <th className="py-3 px-4">Contact Details</th>
                          <th className="py-3 px-4">Campaign</th>
                          <th className="py-3 px-4">Program</th>
                          <th className="py-3 px-4">Assigned Allocation</th>
                          <th className="py-3 px-4 text-center">Sub-Status</th>
                          <th className="py-3 px-4 text-center">Pipeline Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead, idx) => (
                          <tr 
                            key={idx} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, idx)}
                            onClick={() => handleStartEditLead(lead, leads.findIndex(l => l.id === lead.id))}
                            className="border-b border-white/5 hover:bg-white/5 text-slate-300 transition-colors cursor-pointer"
                          >
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox"
                                checked={selectedLeadIndexes.includes(idx)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedLeadIndexes([...selectedLeadIndexes, idx]);
                                  } else {
                                    setSelectedLeadIndexes(selectedLeadIndexes.filter(i => i !== idx));
                                  }
                                }}
                                className="cursor-pointer"
                              />
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 cursor-grab active:cursor-grabbing" onClick={(e) => e.stopPropagation()}>
                              <svg className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{lead.id}</td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-white">{lead.name}</p>
                              <span className="text-[9px] text-slate-500 font-mono">
                                Date: {lead.date}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-xs">
                              <p className="text-white">{lead.phone}</p>
                              <p className="text-slate-400 text-[10px]">{lead.email}</p>
                            </td>
                            <td className="py-3.5 px-4 font-mono uppercase text-[10px]">{lead.type}</td>
                            <td className="py-3.5 px-4 font-semibold text-white text-[10px] uppercase max-w-[120px] truncate" title={lead.program}>
                              {lead.program?.replace(/-/g, ' ')}
                            </td>
                            <td className="py-3.5 px-4">
                              {lead.assignedBDM || lead.assignedBDA ? (
                                <div className="text-[10px] leading-normal font-mono">
                                  {lead.assignedBDM && <p className="text-brand-cyan font-bold">BDM: {lead.assignedBDM.split(' ')[0]}</p>}
                                  {lead.assignedBDA && <p className="text-slate-300">BDA: {lead.assignedBDA.split(' ')[0]}</p>}
                                </div>
                              ) : (
                                <span className="text-[10px] italic text-slate-550 font-mono">Unassigned</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wider ${
                                lead.subStatus === 'QUALIFIED' ? 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20' :
                                lead.subStatus === 'DNP' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                lead.subStatus === 'Already Paid' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20' :
                                'bg-white/5 text-slate-300 border border-white/10'
                              }`}>
                                {lead.subStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase ${
                                lead.status === 'New' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                                lead.status === 'Contacted' ? 'bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/20' :
                                lead.status === 'Follow Up' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' :
                                lead.status === 'Enrolled' ? 'bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/20' :
                                'bg-white/5 text-slate-400 border border-white/10'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end space-x-1.5">
                                <button 
                                  onClick={() => handleStartEditLead(lead, leads.findIndex(l => l.id === lead.id))}
                                  className="px-3.5 py-1.5 bg-[#2A4BFF] hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit details</span>
                                </button>
                                {!isBdaUser && (
                                  <button 
                                    onClick={() => handleDeleteLeadEntry(leads.findIndex(l => l.id === lead.id))}
                                    className="p-1.5 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded border border-white/10 transition-all cursor-pointer"
                                    title="Delete Lead"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Subtab 2: Kanban Board */}
            {leadsSubTab === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in text-white">
                {[
                  { id: 'overdue', name: 'Overdue Follow-ups', border: 'border-red-500/30', header: 'bg-red-500/10 text-red-400' },
                  { id: 'today', name: 'Due Today', border: 'border-[#2A4BFF]/30', header: 'bg-[#2A4BFF]/10 text-white' },
                  { id: 'tomorrow', name: 'Due Tomorrow', border: 'border-[#0EA5E9]/30', header: 'bg-[#0EA5E9]/10 text-slate-300' },
                  { id: 'later', name: 'Due Later', border: 'border-slate-700/50', header: 'bg-white/5 text-slate-400' }
                ].map((col) => {
                  const colLeads = getKanbanLeads(col.id);
                  return (
                    <div key={col.id} className={`bg-[#0A0E35] border ${col.border} rounded-2xl p-4 flex flex-col min-h-[500px] shadow-xl space-y-4`}>
                      <div className={`p-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-between ${col.header}`}>
                        <span>{col.name}</span>
                        <span className="font-mono bg-white/10 px-2.5 py-0.5 rounded-full text-[10px]">{colLeads.length}</span>
                      </div>
                      
                      <div className="flex-grow space-y-3 overflow-y-auto max-h-[500px]">
                        {colLeads.length === 0 ? (
                          <div className="text-center py-10 text-slate-500 text-[11px] italic font-mono">
                            No follow-ups scheduled
                          </div>
                        ) : (
                          colLeads.map((lead, idx) => (
                            <div key={idx} className="bg-[#050718] border border-white/5 hover:border-white/10 p-3.5 rounded-xl space-y-2 shadow transition-all hover:-translate-y-0.5 relative group">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-slate-500">{lead.id}</span>
                                <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider">{lead.subStatus}</span>
                              </div>
                              <h4 className="text-xs font-bold text-white">{lead.name}</h4>
                              <p className="text-[11px] text-slate-400 font-mono">{lead.phone}</p>
                              
                              <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                                <span>{lead.assignedBDA ? lead.assignedBDA.split(' ')[0] : 'Unallocated'}</span>
                                <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => {
                                      const updated = [...leads];
                                      const realIdx = leads.findIndex(l => l.id === lead.id);
                                      updated[realIdx].status = 'Contacted';
                                      saveLeadsToDb(updated);
                                      alert('Lead marked as successfully contacted!');
                                    }}
                                    className="text-[#4ADE80] hover:text-white"
                                    title="Mark Contacted"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleStartEditLead(lead, leads.findIndex(l => l.id === lead.id))}
                                    className="text-brand-cyan hover:text-white"
                                    title="Edit Details Panel"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* -------------------- MAIN TAB 3: ASSIGNED & ALLOCATION -------------------- */}
        {activeMainTab === 'allocation' && !isBdaUser && (
          <div className="space-y-6 animate-fade-in text-white">
            
            {/* Allocation Sub-tabs */}
            <div className="flex border-b border-slate-200 mb-6 gap-6 text-sm">
              <button 
                onClick={() => setAllocationSubTab('assigned')}
                className={`pb-3 font-bold border-b-2 transition-all ${
                  allocationSubTab === 'assigned' ? 'border-[#2A4BFF] text-[#2A4BFF]' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Roster Allocation Stats
              </button>
              <button 
                onClick={() => setAllocationSubTab('bulk')}
                className={`pb-3 font-bold border-b-2 transition-all ${
                  allocationSubTab === 'bulk' ? 'border-[#2A4BFF] text-[#2A4BFF]' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Auto & Manual Lead Allocation
              </button>
              <button 
                onClick={() => setAllocationSubTab('archived')}
                className={`pb-3 font-bold border-b-2 transition-all ${
                  allocationSubTab === 'archived' ? 'border-[#2A4BFF] text-[#2A4BFF]' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Archived & Reallocation Board
              </button>
            </div>

            {/* Subtab 1: Assigned stats */}
            {allocationSubTab === 'assigned' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest">Total CRM Records</span>
                      <p className="text-3xl font-extrabold font-mono mt-1 text-white">{leads.length}</p>
                    </div>
                    <Inbox className="w-5 h-5 text-[#2A4BFF]" />
                  </div>
                  <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest">Unassigned leads</span>
                      <p className="text-3xl font-extrabold font-mono mt-1 text-red-400">
                        {leads.filter(l => !l.assignedBDM && !l.assignedBDA).length}
                      </p>
                    </div>
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest">With BDM Managers</span>
                      <p className="text-3xl font-extrabold font-mono mt-1 text-brand-cyan">
                        {leads.filter(l => l.assignedBDM).length}
                      </p>
                    </div>
                    <Users className="w-5 h-5 text-brand-cyan" />
                  </div>
                  <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest">Allocated to BDAs</span>
                      <p className="text-3xl font-extrabold font-mono mt-1 text-orange-400">
                        {leads.filter(l => l.assignedBDA).length}
                      </p>
                    </div>
                    <Award className="w-5 h-5 text-orange-400" />
                  </div>
                </div>

                <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-4">Roster Allocation Status</h3>
                  
                  {leads.length === 0 ? (
                    <div className="text-center py-10 text-slate-555 text-xs italic font-mono">
                      Database is empty. Set BDM / BDA details in Leads tab or click "Seed Demo Data".
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 pb-2 uppercase text-[9px] tracking-wider font-mono">
                            <th className="py-2 px-3">Lead ID</th>
                            <th className="py-2 px-3">Prospect Name</th>
                            <th className="py-2 px-3">Contact</th>
                            <th className="py-2 px-3">Assigned BDM</th>
                            <th className="py-2 px-3">Assigned BDA</th>
                            <th className="py-2 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.map((lead, idx) => (
                            <tr key={idx} className="border-b border-white/5 text-slate-300 hover:bg-white/5 transition-colors">
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{lead.id}</td>
                              <td className="py-2.5 px-3 font-semibold text-white">{lead.name}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-400">{lead.phone}</td>
                              <td className="py-2.5 px-3 text-brand-cyan">{lead.assignedBDM || 'Unassigned'}</td>
                              <td className="py-2.5 px-3 text-slate-300">{lead.assignedBDA || 'Unassigned'}</td>
                              <td className="py-2.5 px-3 text-right">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                  lead.status === 'New' ? 'bg-blue-500/10 text-blue-400' :
                                  lead.status === 'Enrolled' ? 'bg-[#4ADE80]/10 text-[#4ADE80]' :
                                  'bg-white/5 text-slate-400'
                                }`}>
                                  {lead.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Subtab 2: Auto & Manual lead allocation split */}
            {allocationSubTab === 'bulk' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                
                {/* Manual Allocation column */}
                <div className="lg:col-span-2 bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-4">Unassigned Lead Queue</h3>
                  
                  {leads.filter(l => !l.assignedBDM && !l.assignedBDA).length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs italic font-mono">
                      All lead records in the CRM database are fully allocated to business associates!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-400 leading-normal">
                        Select candidates below to manually allocate to selected BDMs and BDAs, or trigger auto distribution.
                      </p>
                      
                      <div className="overflow-y-auto max-h-[350px] border border-white/10 rounded-xl p-2.5 space-y-2">
                        {leads.filter(l => !l.assignedBDM && !l.assignedBDA).map((lead, idx) => {
                          const realIdx = leads.findIndex(l => l.id === lead.id);
                          return (
                            <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 text-xs">
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                  type="checkbox"
                                  checked={selectedLeadIndexes.includes(realIdx)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedLeadIndexes([...selectedLeadIndexes, realIdx]);
                                    } else {
                                      setSelectedLeadIndexes(selectedLeadIndexes.filter(i => i !== realIdx));
                                    }
                                  }}
                                  className="cursor-pointer"
                                />
                                <div>
                                  <p className="font-bold text-white">{lead.name}</p>
                                  <span className="text-[10px] text-slate-400 font-mono">Type: {lead.type} | Program: {lead.program?.split('-')[0]}</span>
                                </div>
                              </label>
                              <span className="font-mono text-slate-500 text-[10px]">{lead.id}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Auto distribute side controls */}
                <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-4">Allocation Board</h3>
                    
                    <div className="space-y-4 pt-4 text-xs">
                      <div className="bg-slate-950/40 border border-white/5 p-3 rounded-lg">
                        <p className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-widest">Active queue summary</p>
                        <p className="text-xl font-bold mt-1 text-white">{selectedLeadIndexes.length} leads selected</p>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Select Target BDM Manager</label>
                        <select 
                          value={bulkBDM}
                          onChange={(e) => setBulkBDM(e.target.value)}
                          className="w-full bg-[#05092A] border border-white/15 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                        >
                          <option value="">-- Select BDM --</option>
                          {crmUsers.filter(u => u.role === 'BDM').map((bdm, i) => (
                            <option key={i} value={bdm.name}>{bdm.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Select Target BDA Associate</label>
                        <select 
                          value={bulkBDA}
                          onChange={(e) => setBulkBDA(e.target.value)}
                          className="w-full bg-[#05092A] border border-white/15 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                        >
                          <option value="">-- Select BDA --</option>
                          {crmUsers.filter(u => u.role === 'BDA').map((bda, i) => (
                            <option key={i} value={bda.name}>{bda.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button 
                      onClick={handleBulkReallocate}
                      className="w-full bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
                    >
                      Confirm Assignments
                    </button>
                    <button 
                      onClick={() => {
                        const unassigned = leads.filter(l => !l.assignedBDM && !l.assignedBDA);
                        const bdas = crmUsers.filter(u => u.role === 'BDA');
                        if (unassigned.length === 0 || bdas.length === 0) return;
                        
                        const updated = [...leads];
                        unassigned.forEach((lead, i) => {
                          const targetBda = bdas[i % bdas.length];
                          const realIdx = leads.findIndex(l => l.id === lead.id);
                          updated[realIdx].assignedBDA = targetBda.name;
                          updated[realIdx].assignedBDM = targetBda.reportsTo;
                        });
                        saveLeadsToDb(updated);
                        alert(`Auto distributed ${unassigned.length} leads evenly among ${bdas.length} active BDAs!`);
                      }}
                      className="w-full bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Auto Distribute Queue
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Subtab 3: Archived / Removed Associate leads reallocation */}
            {allocationSubTab === 'archived' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl text-xs space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-4 text-white">Roster of Inactive Associates</h3>
                  <p className="text-slate-400 leading-normal">
                    This section maps leads that are currently locked under former / deactivated team associates.
                  </p>
                  
                  <div className="bg-[#050718] border border-white/5 p-4 rounded-xl space-y-2 text-slate-300 font-mono">
                    <p className="font-bold text-brand-cyan border-b border-white/10 pb-1">Sample Removed BDA</p>
                    <p>Name: Saurav Sinha (Former)</p>
                    <p>Email: saurav.ex@gradus.live</p>
                    <p>Total Locked Leads: {leads.filter(l => l.assignedBDA === 'Saurav Sinha').length}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (leads.length === 0) return;
                      const updated = [...leads];
                      // Assign first 2 leads to inactive BDA Saurav Sinha for demo purposes
                      updated[0].assignedBDA = 'Saurav Sinha';
                      updated[0].assignedBDM = 'Abhishek Manager';
                      if (updated[1]) {
                        updated[1].assignedBDA = 'Saurav Sinha';
                        updated[1].assignedBDM = 'Abhishek Manager';
                      }
                      saveLeadsToDb(updated);
                      alert('Simulated 2 locked leads from deactivated associate Saurav Sinha!');
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[10px] font-bold uppercase py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Simulate Locked Leads
                  </button>
                </div>

                <div className="lg:col-span-2 bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4 gap-2 text-white">
                    <h3 className="text-sm font-bold uppercase tracking-wider">Archived Leads Reallocation Board</h3>
                    <span className="font-mono text-red-400 text-xs">
                      {leads.filter(l => l.assignedBDA === 'Saurav Sinha').length} Inactive locked leads
                    </span>
                  </div>

                  {leads.filter(l => l.assignedBDA === 'Saurav Sinha').length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs italic font-mono">
                      No archived leads currently locked under deactivated associates.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Select Active Target BDM</label>
                          <select 
                            value={bulkBDM}
                            onChange={(e) => setBulkBDM(e.target.value)}
                            className="w-full bg-[#05092A] border border-white/15 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                          >
                            <option value="">-- Select Active BDM --</option>
                            {crmUsers.filter(u => u.role === 'BDM').map((bdm, i) => (
                              <option key={i} value={bdm.name}>{bdm.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Select Active Target BDA</label>
                          <select 
                            value={bulkBDA}
                            onChange={(e) => setBulkBDA(e.target.value)}
                            className="w-full bg-[#05092A] border border-white/15 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                          >
                            <option value="">-- Select Active BDA --</option>
                            {crmUsers.filter(u => u.role === 'BDA').map((bda, i) => (
                              <option key={i} value={bda.name}>{bda.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto border border-white/10 rounded-xl p-2.5">
                        {leads.filter(l => l.assignedBDA === 'Saurav Sinha').map((lead, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 text-xs text-white">
                            <div>
                              <p className="font-bold">{lead.name}</p>
                              <span className="text-[10px] text-slate-400 font-mono">Former BDA: Saurav Sinha | ID: {lead.id}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => {
                          if (!bulkBDA) {
                            alert('Please select a target active BDA to reallocate leads!');
                            return;
                          }
                          const updated = [...leads];
                          updated.forEach(l => {
                            if (l.assignedBDA === 'Saurav Sinha') {
                              l.assignedBDA = bulkBDA;
                              l.assignedBDM = bulkBDM || crmUsers.find(u => u.name === bulkBDA)?.reportsTo || '';
                            }
                          });
                          saveLeadsToDb(updated);
                          setBulkBDA('');
                          setBulkBDM('');
                          alert('Deactivated associate locked leads reallocated successfully!');
                        }}
                        className="w-full bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md"
                      >
                        Confirm Reassign & Unlock Leads
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* -------------------- MAIN TAB 4: BDA PERFORMANCE -------------------- */}
        {activeMainTab === 'bda_performance' && !isBdaUser && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-white">
            
            {/* Associates Roster sidebar */}
            <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-4">Roster of Associates</h3>
              
              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                {crmUsers.filter(u => u.role === 'BDA').map((bda, idx) => {
                  const bdaLeadsCount = leads.filter(l => l.assignedBDA === bda.name).length;
                  const bdaEnrolls = leads.filter(l => l.assignedBDA === bda.name && l.status === 'Enrolled').length;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedBdaName(bda.name)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedBdaName === bda.name 
                          ? 'bg-[#2A4BFF]/25 border-[#2A4BFF] shadow-md shadow-[#2A4BFF]/10' 
                          : 'bg-[#050718] border-white/5 hover:border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{bda.name}</h4>
                        <span className="text-[10px] text-brand-cyan font-mono font-bold">BDA</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{bda.email}</p>
                      <div className="border-t border-white/10 pt-2 mt-2.5 flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>Reports to BDM: {bda.reportsTo?.split(' ')[0] || 'Admin'}</span>
                        <span className="text-slate-300 font-bold">{bdaLeadsCount} Leads / {bdaEnrolls} Enrolled</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Associate Details and Sub-status metrics */}
            <div className="lg:col-span-2 bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-widest font-mono">Associate KPI Details</span>
                  <h3 className="text-base font-extrabold text-white mt-0.5">{selectedBdaName || 'No Associate Selected'}</h3>
                </div>
                <div className="bg-[#2A4BFF]/10 text-[#2A4BFF] border border-[#2A4BFF]/25 px-3 py-1.5 rounded-lg text-xs font-mono">
                  Manager: {crmUsers.find(u => u.name === selectedBdaName)?.reportsTo || 'Unspecified'}
                </div>
              </div>

              {selectedBdaName ? (
                <div className="space-y-8">
                  {/* KPI mini grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-[#050718] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase font-mono block">Total Leads</span>
                      <p className="text-xl font-bold font-mono text-white mt-1">
                        {leads.filter(l => l.assignedBDA === selectedBdaName).length}
                      </p>
                    </div>
                    <div className="bg-[#050718] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase font-mono block">Enrolled</span>
                      <p className="text-xl font-bold font-mono text-[#4ADE80] mt-1">
                        {leads.filter(l => l.assignedBDA === selectedBdaName && l.status === 'Enrolled').length}
                      </p>
                    </div>
                    <div className="bg-[#050718] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase font-mono block">Conversion</span>
                      <p className="text-xl font-bold font-mono text-brand-cyan mt-1">
                        {leads.filter(l => l.assignedBDA === selectedBdaName).length > 0 
                          ? ((leads.filter(l => l.assignedBDA === selectedBdaName && l.status === 'Enrolled').length / 
                              leads.filter(l => l.assignedBDA === selectedBdaName).length) * 100).toFixed(1) 
                          : '0.0'}%
                      </p>
                    </div>
                    <div className="bg-[#050718] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase font-mono block">Follow Up</span>
                      <p className="text-xl font-bold font-mono text-orange-400 mt-1">
                        {leads.filter(l => l.assignedBDA === selectedBdaName && l.status === 'Follow Up').length}
                      </p>
                    </div>
                  </div>

                  {/* Call Attempts logs details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">BDA Call Attempts (Status 1–6 Fill Rate)</h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
                      {[
                        { label: 'Status 1 Attempt', key: 's1' },
                        { label: 'Status 2 Attempt', key: 's2' },
                        { label: 'Status 3 Attempt', key: 's3' },
                        { label: 'Status 4 Attempt', key: 's4' },
                        { label: 'Status 5 Attempt', key: 's5' },
                        { label: 'Status 6 Attempt', key: 's6' }
                      ].map((status, i) => {
                        const totalLeadsForBda = leads.filter(l => l.assignedBDA === selectedBdaName);
                        // Count attempts that are not empty '-'
                        const filledCalls = totalLeadsForBda.filter(l => l.callAttempts && l.callAttempts[status.key] && l.callAttempts[status.key] !== '-').length;
                        const pct = totalLeadsForBda.length > 0 ? ((filledCalls / totalLeadsForBda.length) * 100).toFixed(0) : 0;
                        return (
                          <div key={i} className="bg-[#050718] border border-white/5 p-3 rounded-lg flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 block">{status.label}</span>
                              <span className="font-bold text-white">{filledCalls} Dialed</span>
                            </div>
                            <span className="text-[10px] text-brand-cyan font-bold">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pipeline funnel distribution */}
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Associate Funnel distribution</h4>
                    
                    <div className="space-y-2.5">
                      {[
                        { name: 'New Leads', status: 'New', color: 'from-blue-500 to-indigo-500' },
                        { name: 'Contacted', status: 'Contacted', color: 'from-[#0EA5E9] to-cyan-500' },
                        { name: 'Follow Up', status: 'Follow Up', color: 'from-orange-500 to-amber-500' },
                        { name: 'Not Interested', status: 'Not Interested', color: 'from-slate-650 to-slate-800' }
                      ].map((step, i) => {
                        const totalLeadsForBda = leads.filter(l => l.assignedBDA === selectedBdaName).length;
                        const count = leads.filter(l => l.assignedBDA === selectedBdaName && l.status === step.status).length;
                        const pct = totalLeadsForBda > 0 ? ((count / totalLeadsForBda) * 100).toFixed(1) : 0;
                        return (
                          <div key={i} className="text-xs">
                            <div className="flex justify-between items-center mb-1 font-mono">
                              <span className="text-slate-300">{step.name}</span>
                              <span>{count} / {totalLeadsForBda} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                              <div className={`bg-gradient-to-r ${step.color} h-full`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500 text-xs italic font-mono">
                  Select a business associate from the left roster to view performance parameters.
                </div>
              )}
            </div>

          </div>
        )}

        {/* -------------------- MAIN TAB: LEAD ANALYSIS -------------------- */}
        {activeMainTab === 'lead_analysis' && !isBdaUser && (
          <div className="space-y-8 animate-fade-in text-white">
            <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wider text-brand-cyan">Lead Source & Page Analytics</h2>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Cross-referencing campaign channels, landing pages, and BDA allocation performance.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#2A4BFF]/20 text-[#2A4BFF] border border-[#2A4BFF]/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase">
                    Total Captured: {accessibleLeads.length}
                  </span>
                </div>
              </div>

              {/* Lead Channels Summary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Meta & Google Ads */}
                <div 
                  onClick={() => {
                    setActiveMainTab('leads_manager');
                    setLeadsSubTab('list');
                    setLeadChannelTab('ads');
                    setFilterType('Ads Leads');
                    setFilterProgram('');
                  }}
                  className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-3 cursor-pointer hover:bg-white/10 hover:border-brand-cyan/40 transition-all duration-305 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Meta & Google Ads</span>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-black text-white">
                        {accessibleLeads.filter(l => l.type === 'Ads Leads').length}
                      </p>
                      <span className="text-xs text-slate-400 font-bold font-mono">
                        ({accessibleLeads.length > 0 ? ((accessibleLeads.filter(l => l.type === 'Ads Leads').length / accessibleLeads.length) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-cyan h-full rounded-full" 
                        style={{ width: `${accessibleLeads.length > 0 ? (accessibleLeads.filter(l => l.type === 'Ads Leads').length / accessibleLeads.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-brand-cyan uppercase font-mono font-bold tracking-wider hover:underline">Click to view leads &rarr;</span>
                  </div>
                </div>

                {/* Google Sheets Forms */}
                <div 
                  onClick={() => {
                    setActiveMainTab('leads_manager');
                    setLeadsSubTab('list');
                    setLeadChannelTab('google');
                    setFilterType('Google Form Leads');
                    setFilterProgram('');
                  }}
                  className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-3 cursor-pointer hover:bg-white/10 hover:border-[#0EA5E9]/40 transition-all duration-305 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Google Sheets Forms</span>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-black text-[#0EA5E9]">
                        {accessibleLeads.filter(l => l.type === 'Google Form Leads').length}
                      </p>
                      <span className="text-xs text-slate-400 font-bold font-mono">
                        ({accessibleLeads.length > 0 ? ((accessibleLeads.filter(l => l.type === 'Google Form Leads').length / accessibleLeads.length) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#0EA5E9] h-full rounded-full" 
                        style={{ width: `${accessibleLeads.length > 0 ? (accessibleLeads.filter(l => l.type === 'Google Form Leads').length / accessibleLeads.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-[#0EA5E9] uppercase font-mono font-bold tracking-wider hover:underline">Click to view leads &rarr;</span>
                  </div>
                </div>

                {/* WhatsApp Campaigns */}
                <div 
                  onClick={() => {
                    setActiveMainTab('leads_manager');
                    setLeadsSubTab('list');
                    setLeadChannelTab('whatsapp');
                    setFilterType('WhatsApp Marketing Leads');
                    setFilterProgram('');
                  }}
                  className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-3 cursor-pointer hover:bg-white/10 hover:border-[#4ADE80]/40 transition-all duration-305 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">WhatsApp Campaigns</span>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-black text-[#4ADE80]">
                        {accessibleLeads.filter(l => l.type === 'WhatsApp Marketing Leads').length}
                      </p>
                      <span className="text-xs text-slate-400 font-bold font-mono">
                        ({accessibleLeads.length > 0 ? ((accessibleLeads.filter(l => l.type === 'WhatsApp Marketing Leads').length / accessibleLeads.length) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#4ADE80] h-full rounded-full" 
                        style={{ width: `${accessibleLeads.length > 0 ? (accessibleLeads.filter(l => l.type === 'WhatsApp Marketing Leads').length / accessibleLeads.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-[#4ADE80] uppercase font-mono font-bold tracking-wider hover:underline">Click to view leads &rarr;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Landing Pages / Program Sheet breakdown */}
            <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-4">Landing Page Breakdown</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-300 text-[11px] sm:text-xs uppercase font-bold tracking-wider">
                      <th className="py-4 px-4">Landing Page Program</th>
                      <th className="py-4 px-4 text-center">Total Leads</th>
                      <th className="py-4 px-4 text-center">Ads Campaign</th>
                      <th className="py-4 px-4 text-center">Google Form</th>
                      <th className="py-4 px-4 text-center">WhatsApp</th>
                      <th className="py-4 px-4 text-center">Enrolled</th>
                      <th className="py-4 px-4 text-center">Conversion</th>
                      <th className="py-4 px-4 text-right">Lead Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'artificial-intelligence', name: 'AI & Data Science' },
                      { id: 'machine-learning', name: 'Machine Learning' },
                      { id: 'data-science', name: 'Data Science' },
                      { id: 'data-analytics', name: 'Data Analytics' },
                      { id: 'full-stack-web', name: 'Full Stack Development' },
                      { id: 'cyber-security', name: 'Cyber Security' },
                      { id: 'cloud-computing', name: 'Cloud Computing' },
                      { id: 'digital-marketing-cert', name: 'Digital Marketing' },
                      { id: 'hr-mgmt', name: 'HR Management' },
                      { id: 'stock-market', name: 'Stock Market' }
                    ].map((prog, idx) => {
                      const progLeads = accessibleLeads.filter(l => l.program === prog.id);
                      const adsCount = progLeads.filter(l => l.type === 'Ads Leads').length;
                      const formCount = progLeads.filter(l => l.type === 'Google Form Leads').length;
                      const waCount = progLeads.filter(l => l.type === 'WhatsApp Marketing Leads').length;
                      const enrolledCount = progLeads.filter(l => l.status === 'Enrolled').length;
                      const conv = progLeads.length > 0 ? ((enrolledCount / progLeads.length) * 100).toFixed(1) : '0.0';
                      const percentageShare = accessibleLeads.length > 0 ? ((progLeads.length / accessibleLeads.length) * 100).toFixed(1) : 0;

                      return (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 text-slate-350 transition-colors">
                          {/* Program Name click filters program */}
                          <td 
                            onClick={() => {
                              setActiveMainTab('leads_manager');
                              setLeadsSubTab('list');
                              setLeadChannelTab('all');
                              setFilterType('');
                              setFilterProgram(prog.id);
                            }}
                            className="py-4 px-4 font-bold text-white hover:text-brand-cyan cursor-pointer transition-colors text-xs sm:text-sm font-mono"
                          >
                            {prog.name}
                          </td>
                          {/* Total Leads click filters program */}
                          <td 
                            onClick={() => {
                              setActiveMainTab('leads_manager');
                              setLeadsSubTab('list');
                              setLeadChannelTab('all');
                              setFilterType('');
                              setFilterProgram(prog.id);
                            }}
                            className="py-4 px-4 text-center font-bold text-white hover:text-[#2A4BFF] hover:scale-[1.05] transition-all cursor-pointer text-xs sm:text-sm font-mono"
                          >
                            {progLeads.length}
                          </td>
                          {/* Ads click filters program and Ads type */}
                          <td 
                            onClick={() => {
                              setActiveMainTab('leads_manager');
                              setLeadsSubTab('list');
                              setLeadChannelTab('ads');
                              setFilterType('Ads Leads');
                              setFilterProgram(prog.id);
                            }}
                            className="py-4 px-4 text-center font-mono text-slate-300 hover:text-brand-cyan hover:scale-[1.05] transition-all cursor-pointer text-xs sm:text-sm font-semibold"
                          >
                            {adsCount}
                          </td>
                          {/* Google click filters program and Google type */}
                          <td 
                            onClick={() => {
                              setActiveMainTab('leads_manager');
                              setLeadsSubTab('list');
                              setLeadChannelTab('google');
                              setFilterType('Google Form Leads');
                              setFilterProgram(prog.id);
                            }}
                            className="py-4 px-4 text-center font-mono text-slate-300 hover:text-[#0EA5E9] hover:scale-[1.05] transition-all cursor-pointer text-xs sm:text-sm font-semibold"
                          >
                            {formCount}
                          </td>
                          {/* WhatsApp click filters program and WhatsApp type */}
                          <td 
                            onClick={() => {
                              setActiveMainTab('leads_manager');
                              setLeadsSubTab('list');
                              setLeadChannelTab('whatsapp');
                              setFilterType('WhatsApp Marketing Leads');
                              setFilterProgram(prog.id);
                            }}
                            className="py-4 px-4 text-center font-mono text-slate-300 hover:text-[#4ADE80] hover:scale-[1.05] transition-all cursor-pointer text-xs sm:text-sm font-semibold"
                          >
                            {waCount}
                          </td>
                          {/* Enrolled click filters program and Enrolled status */}
                          <td 
                            onClick={() => {
                              setActiveMainTab('leads_manager');
                              setLeadsSubTab('list');
                              setLeadChannelTab('all');
                              setFilterType('');
                              setFilterProgram(prog.id);
                              setFilterStatus('Enrolled');
                            }}
                            className="py-4 px-4 text-center font-mono text-[#4ADE80] font-bold hover:scale-[1.05] transition-all cursor-pointer text-xs sm:text-sm"
                          >
                            {enrolledCount}
                          </td>
                          <td className="py-4 px-4 text-center font-mono font-bold text-brand-cyan text-xs sm:text-sm">{conv}%</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <span className="font-mono text-slate-300 font-bold text-xs sm:text-sm">{percentageShare}%</span>
                              <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-brand-cyan h-full rounded-full" 
                                  style={{ width: `${percentageShare}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeMainTab === 'users' && !isBdaUser && (
          <div className="space-y-8 animate-fade-in text-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Context manual setup */}
              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-4">CRM Organizational Roster</h3>
                <p className="text-slate-400 leading-normal">
                  Build BDA and Administrator credentials here. When created, they will log in using their custom email and password.
                </p>
                
                <div className="bg-[#050718] border border-white/5 p-4 rounded-xl space-y-3 font-mono text-[11px] text-slate-300">
                  <p className="font-bold text-brand-cyan border-b border-white/10 pb-1">Gradus CRM Tree Setup</p>
                  <div className="flex items-center">
                    <span>Sales Head</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 mx-1" />
                    <span className="text-brand-cyan font-bold">BDM Manager</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 mx-1" />
                    <span>BDA Associate</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="w-full bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account / Role</span>
                </button>
              </div>

              {/* Users Roster Table */}
              <div className="lg:col-span-2 bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-4">Team Associate Roster</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 pb-2 uppercase text-[9px] tracking-wider font-mono">
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Email Address</th>
                        <th className="py-2 px-3">Role</th>
                        <th className="py-2 px-3">Password</th>
                        <th className="py-2 px-3">Reports To (Manager)</th>
                        <th className="py-2 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crmUsers.map((user, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 text-slate-300 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-white">{user.name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{user.email}</td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wide ${
                              user.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                              user.role === 'BDM' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/30' :
                              'bg-[#2A4BFF]/10 text-slate-200 border border-white/10'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#4ADE80] font-bold">{user.password || 'Gradus@123'}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-400">{user.reportsTo || 'N/A'}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button 
                              onClick={() => handleRemoveUser(idx)}
                              className="p-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/20 transition-all cursor-pointer"
                              title="Remove Associate"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Registered Student Accounts (For Promotion) */}
            <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-cyan">Registered Student Accounts</h3>
                <p className="text-[11px] text-slate-400 mt-1">List of all registered students. Promote them to BDA/BDM/Admin roles to grant them console access.</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 pb-2 uppercase text-[9px] tracking-wider font-mono">
                      <th className="py-2 px-3">Avatar</th>
                      <th className="py-2 px-3">Student ID</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Email Address</th>
                      <th className="py-2 px-3">Phone</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">College / University</th>
                      <th className="py-2 px-3">Enrolled Courses</th>
                      <th className="py-2 px-3 text-right">Promote / Assign Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-10 text-slate-500 italic font-mono">
                          No student accounts found in database.
                        </td>
                      </tr>
                    ) : (
                      students.map((student, idx) => {
                        const isAlreadyCrm = crmUsers.some(u => u.email.trim().toLowerCase() === student.email.trim().toLowerCase());
                        return (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 text-slate-300 transition-colors">
                            <td className="py-2.5 px-3">
                              {student.avatar ? (
                                <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#2A4BFF]/20 text-[#0EA5E9] font-bold flex items-center justify-center border border-[#2A4BFF]/25 font-mono text-[10px]">
                                  {student.name ? student.name[0].toUpperCase() : 'S'}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{student.studentId || 'N/A'}</td>
                            <td className="py-2.5 px-3 font-semibold text-white">{student.name}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{student.email}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-400">{student.phone || student.contact || 'N/A'}</td>
                            <td className="py-2.5 px-3">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wide ${
                                student.status === 'Graduate' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/30' :
                                'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                              }`}>
                                {student.status || 'Student'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-400 max-w-[150px] truncate" title={student.college || 'N/A'}>
                              {student.college || 'N/A'}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[10px] text-[#4ADE80]">
                              {student.activeCourses && student.activeCourses.length > 0 
                                ? student.activeCourses.join(', ')
                                : 'None'}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {isAlreadyCrm ? (
                                <span className="text-[10px] font-bold text-slate-500 bg-white/5 border border-white/5 px-2.5 py-1 rounded">
                                  Already CRM User
                                </span>
                              ) : (
                                <button 
                                  onClick={() => {
                                    setNewUserForm({
                                      name: student.name,
                                      email: student.email,
                                      password: student.password || 'Gradus@123',
                                      role: 'Admin',
                                      reportsTo: ''
                                    });
                                    setShowAddUserModal(true);
                                  }}
                                  className="bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wide px-3 py-1.5 rounded transition-all cursor-pointer"
                                >
                                  Make Admin/BDA
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- MAIN TAB: ACCESS LOGS -------------------- */}
        {activeMainTab === 'access_logs' && currentUser.email === 'beyondskills.ai@gmail.com' && (
          <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6 text-white animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-cyan">System Access & Audit Logs</h3>
                <p className="text-[11px] text-slate-400">Security audit history of user logins, registrations, and profile updates.</p>
              </div>
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear all access logs?")) {
                    setDbItem('beyondskills_access_logs', []);
                    setLogs([]);
                  }
                }}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                Clear Audit Trail
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 pb-2 uppercase text-[9px] tracking-wider font-mono">
                    <th className="py-2 px-3">Log ID</th>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Email Address</th>
                    <th className="py-2 px-3">Event Action</th>
                    <th className="py-2 px-3">Browser Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-slate-500 italic font-mono">
                        No security logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log, idx) => (
                      <tr key={log.id || idx} className="border-b border-white/5 hover:bg-white/5 text-slate-300 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{log.id}</td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-[#0EA5E9]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-white">{log.name}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{log.email}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide ${
                            log.action.includes('Logged In') ? 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/30' :
                            log.action.includes('Logged Out') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                            log.action.includes('Profile Updated') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                            'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[10px] text-slate-400 max-w-[200px] truncate" title={log.userAgent}>
                          {log.userAgent}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- MAIN TAB: MANAGE BLOGS -------------------- */}
        {activeMainTab === 'blogs_manager' && !isBdaUser && (
          <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6 text-white animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-cyan">Blog Post Manager</h3>
              <button 
                onClick={() => {
                  setBlogForm({ title: '', category: 'Artificial Intelligence', author: '', date: '', summary: '', image: '', content: '' });
                  setShowAddBlogModal(true);
                }}
                className="bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Blog Post</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-350 min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 pb-2 uppercase text-[9px] tracking-wider font-mono">
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Author</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((b, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 text-slate-300 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white max-w-xs truncate" title={b.title}>{b.title}</td>
                      <td className="py-3 px-3">
                        <span className="text-[9px] font-bold bg-[#2A4BFF]/10 text-brand-cyan border border-brand-cyan/20 px-2.5 py-0.5 rounded uppercase">
                          {b.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">{b.author}</td>
                      <td className="py-3 px-3 font-mono text-xs">{b.date}</td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button 
                          onClick={() => handleEditBlog(idx)}
                          className="p-1 bg-[#2A4BFF]/10 hover:bg-[#2A4BFF]/25 text-[#0EA5E9] rounded border border-brand-cyan/20 transition-all cursor-pointer inline-flex"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteBlog(idx)}
                          className="p-1 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded border border-red-500/25 transition-all cursor-pointer inline-flex"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- MAIN TAB: MANAGE MENTORS -------------------- */}
        {activeMainTab === 'mentors_manager' && !isBdaUser && (
          <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6 text-white animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-cyan">Mentor Roster Manager</h3>
              <button 
                onClick={() => {
                  setMentorForm({ name: '', role: '', org: '', exp: '', image: '' });
                  setShowAddMentorModal(true);
                }}
                className="bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Mentor Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors.map((m, idx) => (
                <div key={idx} className="bg-[#050718] border border-white/5 rounded-2xl p-5 text-center relative group">
                  <div className="absolute top-4 right-4 flex space-x-1.5">
                    <button 
                      onClick={() => handleEditMentor(idx)}
                      className="p-1.5 bg-[#2A4BFF]/20 hover:bg-[#2A4BFF]/35 text-[#0EA5E9] border border-brand-cyan/25 rounded-lg transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDeleteMentor(idx)}
                      className="p-1.5 bg-red-500/20 hover:bg-red-500/35 text-red-400 border border-red-500/25 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <img src={m.image} alt={m.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border border-white/10" />
                  <h4 className="font-bold text-sm text-white">{m.name}</h4>
                  <p className="text-xs text-brand-purple font-medium mt-0.5">{m.role}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{m.org} • {m.exp} Exp</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- MAIN TAB: LANDING PAGE EDITOR -------------------- */}
        {activeMainTab === 'landing_pages_manager' && !isBdaUser && (
          <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6 text-white animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-cyan">Landing Page Config Editor</h3>
              <button 
                onClick={() => {
                  setLpForm({ slug: '', courseId: 'full-stack-web', heroHeadline: '', heroSubheadline: '', ctaText: 'Apply Now', highlights: '', faqs: '' });
                  setShowAddLpModal(true);
                }}
                className="bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Landing Page</span>
              </button>
            </div>

            {/* Special production-ready landing pages */}
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-xs space-y-3.5 mb-2 text-slate-300">
              <p className="font-bold text-white flex items-center space-x-1.5 uppercase text-[10px] tracking-wider font-mono">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Dedicated Production-Ready Landing Pages</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white/5 border border-white/5 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white text-[11px]">Full Stack Web (MERN)</p>
                    <a href="/full-stack-web-development-landing-page" target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] hover:underline font-mono text-[10px]">
                      /full-stack-web-development-landing-page
                    </a>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-450" />
                </div>
                
                <div className="bg-white/5 border border-white/5 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white text-[11px]">AI, ML & Data Science</p>
                    <a href="/ai-ml-data-science-landing-page" target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] hover:underline font-mono text-[10px]">
                      /ai-ml-data-science-landing-page
                    </a>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-455" />
                </div>

                <div className="bg-white/5 border border-white/5 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white text-[11px]">Paid Digital Marketing</p>
                    <a href="/digital-marketing-landing-page" target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] hover:underline font-mono text-[10px]">
                      /digital-marketing-landing-page
                    </a>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-455" />
                </div>

                <div className="bg-white/5 border border-white/5 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white text-[11px]">Cloud Computing & AWS</p>
                    <a href="/cloud-computing-landing-page" target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] hover:underline font-mono text-[10px]">
                      /cloud-computing-landing-page
                    </a>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-455" />
                </div>

                <div className="bg-white/5 border border-white/5 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white text-[11px]">Cybersecurity & CEH</p>
                    <a href="/cybersecurity-landing-page" target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] hover:underline font-mono text-[10px]">
                      /cybersecurity-landing-page
                    </a>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-455" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-355 min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 pb-2 uppercase text-[9px] tracking-wider font-mono">
                    <th className="py-2.5 px-3">Live URL Slug</th>
                    <th className="py-2.5 px-3">Target Course</th>
                    <th className="py-2.5 px-3">Hero Headline</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {landingPages.map((lp, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 text-slate-300 transition-colors">
                      <td className="py-3 px-3 font-mono text-brand-cyan font-bold">
                        <a href={`/lp/${lp.slug}`} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center space-x-1.5">
                          <span>/lp/{lp.slug}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 inline text-slate-400" />
                        </a>
                      </td>
                      <td className="py-3 px-3 uppercase text-[10px] font-mono text-slate-400">{lp.courseId}</td>
                      <td className="py-3 px-3 max-w-xs truncate" title={lp.heroHeadline}>{lp.heroHeadline}</td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button 
                          onClick={() => handleEditLp(idx)}
                          className="p-1.5 bg-[#2A4BFF]/10 hover:bg-[#2A4BFF]/25 text-[#0EA5E9] rounded border border-brand-cyan/20 transition-all cursor-pointer inline-flex"
                          title="Edit Landing Page"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteLp(idx)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded border border-red-500/25 transition-all cursor-pointer inline-flex"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* -------------------- MODAL: ADD LEAD -------------------- */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-white relative">
            <button 
              onClick={() => setShowAddLeadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Create CRM Lead</h3>
            
            <form onSubmit={handleAddLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Prospect Full Name</label>
                  <input 
                    type="text" required
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    placeholder="e.g. Roshan Kumar"
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Phone Number</label>
                  <input 
                    type="text" required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Email Address</label>
                <input 
                  type="email" required
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  placeholder="e.g. roshan@gmail.com"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Lead Campaign Type</label>
                  <select 
                    value={newLeadForm.type}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, type: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="Ads Leads">Ads Leads</option>
                    <option value="Google Form Leads">Google Form Leads</option>
                    <option value="WhatsApp Marketing Leads">WhatsApp Marketing Leads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Interest Program</label>
                  <select 
                    value={newLeadForm.program}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, program: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="artificial-intelligence">Artificial Intelligence</option>
                    <option value="machine-learning">Machine Learning</option>
                    <option value="data-science-analytics">Data Science & Analytics</option>
                    <option value="full-stack-web-development">Full Stack Web (MERN)</option>
                    <option value="stock-market">Stock Market</option>
                    <option value="digital-marketing-cert">Digital Marketing</option>
                    <option value="hr-mgmt">HR Management</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Additional Consultation Notes</label>
                <textarea 
                  value={newLeadForm.message}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                  placeholder="Paste details or specific client requests..."
                  rows="3"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Confirm Add Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: GOOGLE SHEETS SYNC MANAGER -------------------- */}
      {showSheetsSyncModal && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-white relative">
            <button 
              onClick={() => setShowSheetsSyncModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider text-[#0EA5E9] flex items-center space-x-1.5">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Google Sheet Sync Console</span>
            </h3>
            
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Google Form Leads CSV Link</label>
                <input 
                  type="text"
                  value={googleFormSheetUrl}
                  onChange={(e) => {
                    setGoogleFormSheetUrl(e.target.value);
                    localStorage.setItem('beyondskills_sheet_google_form', e.target.value);
                  }}
                  placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Meta Ads Leads CSV Link</label>
                <input 
                  type="text"
                  value={adsSheetUrl}
                  onChange={(e) => {
                    setAdsSheetUrl(e.target.value);
                    localStorage.setItem('beyondskills_sheet_ads', e.target.value);
                  }}
                  placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono text-[11px]"
                />
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-1.5 leading-relaxed text-slate-350">
                <p className="font-bold text-slate-300">How to publish your Sheets for Direct Integration:</p>
                <ol className="list-decimal list-inside space-y-1 font-mono text-[10px]">
                  <li>Open your Google Sheet linked with Google Forms / FB Ads.</li>
                  <li>Click <strong className="text-white">File &gt; Share &gt; Publish to web</strong>.</li>
                  <li>Select the targets and choose format: <strong className="text-white">Comma-separated values (.csv)</strong>.</li>
                  <li>Copy and paste the published link in the input fields above.</li>
                </ol>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleSyncGoogleSheets}
                  disabled={isSyncing}
                  className="flex-grow bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing Leads...' : 'Sync Active Sheets'}</span>
                </button>
                <button 
                  onClick={handleSimulateSync}
                  className="bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs uppercase tracking-wider px-4 rounded-xl transition-all cursor-pointer"
                  title="Test immediately with demo mock CSV rows"
                >
                  Simulate Sync
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: IMPORT LEADS -------------------- */}
      {showImportLeadModal && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-white relative">
            <button 
              onClick={() => setShowImportLeadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Import Bulk Leads Queue</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Paste comma-separated rows. Formats must follow: <br />
              <span className="font-mono text-[#0EA5E9]">Name, Email, Phone, CampaignType, CourseId, Notes</span>
            </p>
            
            <div className="space-y-4 text-xs">
              <textarea 
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Rohit Verma, rohit@gmail.com, 9922883344, Ads Leads, ai-data-science, Facebook Campaign"
                rows="6"
                className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2.5 text-white outline-none focus:border-[#2A4BFF] font-mono leading-relaxed"
              ></textarea>
              
              <button 
                onClick={handleBulkImport}
                className="w-full bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Confirm Bulk Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: EDIT LEAD (DETAILED LEAD DETAILS PANEL CLONE) -------------------- */}
      {showEditLeadModal && selectedLead && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-3xl p-6 shadow-2xl text-white relative my-8 space-y-6">
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowEditLeadModal(false);
                setSelectedLead(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Header: Name, Profession Dropdown & Status Dropdown */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between border-b border-white/10 pb-5 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center space-x-1.5">
                  <ClipboardList className="w-4.5 h-4.5 text-brand-cyan" />
                  <span>Lead Details Panel</span>
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1 leading-tight tracking-tight max-w-md">
                  {selectedLead.name}
                </h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Profession Dropdown */}
                <div>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Profession</span>
                  <select 
                    value={selectedLead.profession}
                    onChange={(e) => setSelectedLead({ ...selectedLead, profession: e.target.value })}
                    className="bg-[#05092A] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#2A4BFF] font-semibold cursor-pointer"
                  >
                    <option value="Unspecified">Unspecified</option>
                    <option value="Student">Student</option>
                    <option value="Working Professional (< 30k) [WP-1]">Working Professional (&lt; 30k) [WP-1]</option>
                    <option value="Working Professional (>= 30k) [WP-2]">Working Professional (&gt;= 30k) [WP-2]</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>

                {/* Pipeline Status Dropdown */}
                <div>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Pipeline Status</span>
                  <select 
                    value={selectedLead.status}
                    onChange={(e) => setSelectedLead({ ...selectedLead, status: e.target.value })}
                    className="bg-[#05092A] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#2A4BFF] font-semibold cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow Up">Follow Up</option>
                    <option value="Not Connected">Not Connected</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact details metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono py-2 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{selectedLead.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px] block">Lead Date</span>
                <span className="text-slate-200 font-semibold">{selectedLead.date}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px] block">Campaign Type</span>
                <span className="text-[#0EA5E9] font-bold">{selectedLead.type}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px] block">Program Enrolled</span>
                <span className="text-white uppercase truncate block font-bold max-w-[120px]" title={selectedLead.program}>
                  {selectedLead.program?.replace(/-/g, ' ')}
                </span>
              </div>
            </div>

            {/* Course, Mentor, Duration detail tags */}
            <div className="flex flex-wrap gap-2 text-[10px] py-1 border-b border-white/5">
              <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-slate-300 font-mono">
                Mentor: <strong className="text-white">None</strong>
              </span>
              <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-slate-300 font-mono">
                Duration: <strong className="text-white">None</strong>
              </span>
            </div>

            {/* Owner BDM & Handler BDA details banner */}
            <div className="bg-[#050718] border border-white/5 p-4 rounded-xl flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest block mb-0.5">Owner (BDM)</span>
                <span className="text-brand-cyan font-bold">{selectedLead.assignedBDM || 'Unassigned'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <div className="text-right">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest block mb-0.5">Handler (BDA)</span>
                <span className="text-white font-bold">{selectedLead.assignedBDA || 'Unassigned'}</span>
              </div>
            </div>

            {/* Student Submission & Campaign Details Section */}
            <div className="bg-[#050718] border border-white/5 p-4 rounded-xl space-y-3.5 text-xs">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-white/10 pb-1">Student Details & Campaign Tags</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block">Prospect Email</span>
                  <span className="text-white break-all">{selectedLead.email || 'Unspecified'}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block">Highest Qualification</span>
                  <span className="text-white">{selectedLead.college || selectedLead.qualification || 'Unspecified'}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block">Experience / Status</span>
                  <span className="text-white">
                    {selectedLead.profession || selectedLead.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block">Preferred Contact Time</span>
                  <span className="text-white">{selectedLead.preferredContactTime || 'Unspecified'}</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-2 space-y-2">
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block font-mono">Goal / Message Submitted</span>
                  <p className="text-slate-200 leading-normal bg-white/5 p-2 rounded border border-white/5 italic font-mono text-[11px] whitespace-pre-line">
                    {selectedLead.message || selectedLead.careerGoal || 'No goal statement submitted.'}
                  </p>
                </div>
                {selectedLead.remarks && (
                  <div>
                    <span className="text-slate-500 uppercase text-[9px] block font-mono">System Remarks</span>
                    <p className="text-slate-400 text-[11px] leading-normal">{selectedLead.remarks}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] text-slate-450 font-mono border-t border-white/10 pt-2">
                <div>
                  <span className="text-slate-500 uppercase text-[8px] block">UTM Source</span>
                  <span className="text-slate-200">{selectedLead.source || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[8px] block">UTM Medium</span>
                  <span className="text-slate-200">{selectedLead.utmMedium || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[8px] block">UTM Campaign</span>
                  <span className="text-brand-cyan font-bold">{selectedLead.campaign || selectedLead.utmCampaign || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[8px] block">UTM Content</span>
                  <span className="text-slate-200">{selectedLead.utmContent || '-'}</span>
                </div>
              </div>
            </div>

            {/* SUB-STATUS FUNNELS SECTION */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-white/5 pb-2">Sub-Status Funnels</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {[
                  { label: 'Status 1', key: 's1' },
                  { label: 'Status 2', key: 's2' },
                  { label: 'Status 3', key: 's3' },
                  { label: 'Status 4', key: 's4' },
                  { label: 'Status 5', key: 's5' },
                  { label: 'Status 6', key: 's6' }
                ].map((status) => (
                  <div key={status.key} className="space-y-1">
                    <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-widest font-mono">{status.label}</span>
                    <select 
                      value={selectedLead.callAttempts ? selectedLead.callAttempts[status.key] : '-'}
                      onChange={(e) => {
                        const attempts = selectedLead.callAttempts || { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' };
                        setSelectedLead({
                          ...selectedLead,
                          callAttempts: { ...attempts, [status.key]: e.target.value }
                        });
                      }}
                      className="w-full bg-[#05092A] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-[#2A4BFF] font-mono cursor-pointer"
                    >
                      <option value="-">-</option>
                      <option value="DNP">DNP</option>
                      <option value="CB">CB</option>
                      <option value="NI">NI</option>
                      <option value="QUALIFIED">QUALIFIED</option>
                      <option value="CNC">CNC</option>
                      <option value="Already Paid">Already Paid</option>
                      <option value="Switched Off">Switched Off</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* VIDEO CALL (VC) FEEDBACK LOGS & HISTORIES */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-white/5 pb-2">Video Call (VC) Feedback Logs</h4>
              
              <div className="space-y-3">
                <textarea 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record summary of VC discussions, student profiles, and batch matches..."
                  rows="3.5"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF] leading-relaxed"
                ></textarea>
                
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-555 font-mono italic">
                    Press Log Note to permanently capture dial call history timeline update tags.
                  </span>
                  <button 
                    type="button"
                    onClick={handleAddHistoryNote}
                    className="bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Log VC Summary
                  </button>
                </div>
              </div>

              {/* Feed History logs list */}
              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                {selectedLead.history && selectedLead.history.length > 0 ? (
                  selectedLead.history.map((log, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 text-xs relative font-mono">
                      <p className="text-slate-350 italic">"{log.note}"</p>
                      <span className="text-[10px] text-slate-555 mt-1 block">
                        Logged date: {new Date(log.date).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs italic font-mono">
                    No VC discussions or history log comments configured for this lead candidate.
                  </div>
                )}
              </div>
            </div>

            {/* Save All Details action button */}
            <div className="flex space-x-3 pt-3 border-t border-white/10">
              <button 
                type="button"
                onClick={handleSaveEditLead}
                className="flex-grow bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirm All Details</span>
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowEditLeadModal(false);
                  setSelectedLead(null);
                }}
                className="px-6 bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- MODAL: ADD BLOG POST -------------------- */}
      {showAddBlogModal && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 text-white relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddBlogModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Create Blog Post</h3>
            
            <form onSubmit={handleAddBlog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Blog Title</label>
                  <input 
                    type="text" required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="e.g. Introduction to React 19"
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Category</label>
                  <select 
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Developer Tips">Developer Tips</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Author Name</label>
                  <input 
                    type="text" required
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    placeholder="e.g. Nitin Sir"
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Cover Image URL</label>
                  <input 
                    type="url" required
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Short Summary</label>
                <textarea 
                  required rows={2}
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  placeholder="Summarize the article in 2 sentences..."
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Markdown Content</label>
                <textarea 
                  required rows={8}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Write the full post contents here..."
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono leading-relaxed"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Publish Blog Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: EDIT BLOG POST -------------------- */}
      {showEditBlogModal && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 text-white relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => {
                setShowEditBlogModal(false);
                setSelectedBlogIdx(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Edit Blog Post</h3>
            
            <form onSubmit={handleSaveEditBlog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Blog Title</label>
                  <input 
                    type="text" required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Category</label>
                  <select 
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Developer Tips">Developer Tips</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Author Name</label>
                  <input 
                    type="text" required
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Cover Image URL</label>
                  <input 
                    type="url" required
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Short Summary</label>
                <textarea 
                  required rows={2}
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Markdown Content</label>
                <textarea 
                  required rows={8}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono leading-relaxed"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: ADD MENTOR -------------------- */}
      {showAddMentorModal && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-white relative">
            <button 
              onClick={() => setShowAddMentorModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Add Mentor Profile</h3>
            
            <form onSubmit={handleAddMentor} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Mentor Name</label>
                <input 
                  type="text" required
                  value={mentorForm.name}
                  onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                  placeholder="e.g. Sanchit Sir"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Role/Designation</label>
                  <input 
                    type="text" required
                    value={mentorForm.role}
                    onChange={(e) => setMentorForm({ ...mentorForm, role: e.target.value })}
                    placeholder="e.g. Director, Web Division"
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Experience Duration</label>
                  <input 
                    type="text" required
                    value={mentorForm.exp}
                    onChange={(e) => setMentorForm({ ...mentorForm, exp: e.target.value })}
                    placeholder="e.g. 8+ Years"
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Background / Company Org</label>
                <input 
                  type="text" required
                  value={mentorForm.org}
                  onChange={(e) => setMentorForm({ ...mentorForm, org: e.target.value })}
                  placeholder="e.g. Ex-Microsoft, Founder"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Photo URL</label>
                <input 
                  type="url" required
                  value={mentorForm.image}
                  onChange={(e) => setMentorForm({ ...mentorForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Confirm Add Mentor
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: EDIT MENTOR -------------------- */}
      {showEditMentorModal && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-white relative">
            <button 
              onClick={() => {
                setShowEditMentorModal(false);
                setSelectedMentorIdx(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Edit Mentor Profile</h3>
            
            <form onSubmit={handleSaveEditMentor} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Mentor Name</label>
                <input 
                  type="text" required
                  value={mentorForm.name}
                  onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Role/Designation</label>
                  <input 
                    type="text" required
                    value={mentorForm.role}
                    onChange={(e) => setMentorForm({ ...mentorForm, role: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Experience Duration</label>
                  <input 
                    type="text" required
                    value={mentorForm.exp}
                    onChange={(e) => setMentorForm({ ...mentorForm, exp: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Background / Company Org</label>
                <input 
                  type="text" required
                  value={mentorForm.org}
                  onChange={(e) => setMentorForm({ ...mentorForm, org: e.target.value })}
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Photo URL</label>
                <input 
                  type="url" required
                  value={mentorForm.image}
                  onChange={(e) => setMentorForm({ ...mentorForm, image: e.target.value })}
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: ADD LANDING PAGE -------------------- */}
      {showAddLpModal && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 text-white relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddLpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Create Custom Landing Page</h3>
            
            <form onSubmit={handleAddLp} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">URL Slug Path</label>
                  <input 
                    type="text" required
                    value={lpForm.slug}
                    onChange={(e) => setLpForm({ ...lpForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') })}
                    placeholder="e.g. artificial-intelligence-cohort"
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono text-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Target Course Binding</label>
                  <select 
                    value={lpForm.courseId}
                    onChange={(e) => setLpForm({ ...lpForm, courseId: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="full-stack-web">Full Stack Web Development</option>
                    <option value="artificial-intelligence">Artificial Intelligence & Data Science</option>
                    <option value="digital-marketing">Digital Marketing Performance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Hero Title Headline</label>
                <input 
                  type="text" required
                  value={lpForm.heroHeadline}
                  onChange={(e) => setLpForm({ ...lpForm, heroHeadline: e.target.value })}
                  placeholder="e.g. Master Practical Artificial Intelligence. Live."
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Hero Subheadline</label>
                <textarea 
                  required rows={2}
                  value={lpForm.heroSubheadline}
                  onChange={(e) => setLpForm({ ...lpForm, heroSubheadline: e.target.value })}
                  placeholder="Provide a compelling secondary pitch for the cohort..."
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">CTA Button Label</label>
                  <input 
                    type="text" required
                    value={lpForm.ctaText}
                    onChange={(e) => setLpForm({ ...lpForm, ctaText: e.target.value })}
                    placeholder="e.g. Apply For Cohort"
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Highlights (One highlight per line)</label>
                <textarea 
                  required rows={4}
                  value={lpForm.highlights}
                  onChange={(e) => setLpForm({ ...lpForm, highlights: e.target.value })}
                  placeholder="Beginner Friendly&#10;Live Sessions&#10;Real Projects"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">FAQs (Format: Q: Question&#10;A: Answer separated by double newlines)</label>
                <textarea 
                  required rows={6}
                  value={lpForm.faqs}
                  onChange={(e) => setLpForm({ ...lpForm, faqs: e.target.value })}
                  placeholder="Q: Who is this program for?&#10;A: Beginners and experts alike.&#10;&#10;Q: How to apply?&#10;A: Fill this form."
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono leading-relaxed"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Create Landing Page Config
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: EDIT LANDING PAGE -------------------- */}
      {showEditLpModal && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 text-white relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => {
                setShowEditLpModal(false);
                setSelectedLpIdx(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Edit Landing Page Config</h3>
            
            <form onSubmit={handleSaveEditLp} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">URL Slug Path</label>
                  <input 
                    type="text" required
                    value={lpForm.slug}
                    onChange={(e) => setLpForm({ ...lpForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono text-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Target Course Binding</label>
                  <select 
                    value={lpForm.courseId}
                    onChange={(e) => setLpForm({ ...lpForm, courseId: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="full-stack-web">Full Stack Web Development</option>
                    <option value="artificial-intelligence">Artificial Intelligence & Data Science</option>
                    <option value="digital-marketing">Digital Marketing Performance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Hero Title Headline</label>
                <input 
                  type="text" required
                  value={lpForm.heroHeadline}
                  onChange={(e) => setLpForm({ ...lpForm, heroHeadline: e.target.value })}
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Hero Subheadline</label>
                <textarea 
                  required rows={2}
                  value={lpForm.heroSubheadline}
                  onChange={(e) => setLpForm({ ...lpForm, heroSubheadline: e.target.value })}
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">CTA Button Label</label>
                  <input 
                    type="text" required
                    value={lpForm.ctaText}
                    onChange={(e) => setLpForm({ ...lpForm, ctaText: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Highlights (One highlight per line)</label>
                <textarea 
                  required rows={4}
                  value={lpForm.highlights}
                  onChange={(e) => setLpForm({ ...lpForm, highlights: e.target.value })}
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">FAQs (Format: Q: Question&#10;A: Answer separated by double newlines)</label>
                <textarea 
                  required rows={6}
                  value={lpForm.faqs}
                  onChange={(e) => setLpForm({ ...lpForm, faqs: e.target.value })}
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono leading-relaxed"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: ADD USER / TEAM MEMBER -------------------- */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-white relative">
            <button 
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Create Console Role Account</h3>
            
            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Full Name</label>
                <input 
                  type="text" required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Muskan Gupta"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Email Address</label>
                <input 
                  type="email" required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="e.g. muskan.g@gradus.live"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Login Password</label>
                <input 
                  type="text" required
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="e.g. Muskan@123"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono font-bold text-[#4ADE80]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Organizational Role</label>
                  <select 
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="BDA">BDA (Associate)</option>
                    <option value="BDM">BDM (Manager)</option>
                    <option value="Admin">Admin (Full Access)</option>
                    <option value="Sales Head">Sales Head</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Reports To (Manager)</label>
                  <select 
                    value={newUserForm.reportsTo}
                    onChange={(e) => setNewUserForm({ ...newUserForm, reportsTo: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="">None / Sales Head</option>
                    {crmUsers.filter(u => u.role === 'BDM').map((bdm, i) => (
                      <option key={i} value={bdm.name}>{bdm.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Confirm Add Associate
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
