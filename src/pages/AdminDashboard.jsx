import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDbItem, setDbItem, logUserAccess, COURSES } from '../utils/mockDb';
import { 
  getLeadsFromSupabase, 
  saveLeadToSupabase, 
  updateLeadInSupabase,
  getCrmUsersFromSupabase,
  saveCrmUserToSupabase,
  deleteCrmUserFromSupabase,
  getISTDateTimeString
} from '../utils/supabaseClient';
import { validateEmail, validatePhone } from '../utils/validationHelpers';
import { 
  BarChart3, LineChart, PieChart, Inbox, Users, DollarSign, Percent, 
  Globe, Star, Trash2, ArrowUpRight, Award, ShieldAlert, Plus, 
  FileSpreadsheet, ClipboardList, CheckSquare, BarChart, Settings, 
  UserPlus, RefreshCw, Eye, Edit2, X, Check, CheckCircle2, ChevronRight,
  TrendingUp, Calendar, AlertCircle, Sparkles, Phone, ShieldCheck, LogOut,
  FileText, BookOpen, Mail, Lock, ArrowRight, ChevronDown, MessageSquare, Megaphone, Sun, Moon, Flame, Target
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const targetEmail = 'beyondskills.ai@gmail.com';
    const savedPassword = localStorage.getItem('beyondskills_admin_password') || '9953607074';
    
    // Fetch latest users from Supabase to ensure fresh credentials check
    let usersList = [];
    try {
      const { data, error } = await getCrmUsersFromSupabase();
      if (!error && data) {
        usersList = data;
        setCrmUsers(data);
        setDbItem('beyondskills_crm_users', data);
      }
    } catch (err) {
      console.error('Failed to fetch CRM users during login validation:', err);
    }
    
    if (usersList.length === 0) {
      usersList = crmUsers.length > 0 ? crmUsers : getDbItem('beyondskills_crm_users', []);
    }

    const matchingUser = usersList.find(u => u.email.trim().toLowerCase() === loginEmail.trim().toLowerCase());

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
      
      // Seed default CRM Users to Supabase if none exist
      fetchCrmUsers().then(users => {
        if (users.length === 0) {
          const defaultCrmUsers = [
            { name: 'Abhishek Manager', email: 'abhishek.mgr@gradus.live', role: 'BDM', reportsTo: 'Sales Head', password: 'Abhishek@123' },
            { name: 'Khushi Manager', email: 'khushi.mgr@gradus.live', role: 'BDM', reportsTo: 'Sales Head', password: 'Khushi@123' },
            { name: 'Muskan Gupta', email: 'muskan.g@gradus.live', role: 'BDA', reportsTo: 'Abhishek Manager', password: '7982738724' },
            { name: 'Deepak Gupta', email: 'deepak.g@gradus.live', role: 'BDA', reportsTo: 'Abhishek Manager', password: 'Deepak@123' },
            { name: 'Shubham Tyagi', email: 'shubham.t@gradus.live', role: 'BDA', reportsTo: 'Khushi Manager', password: 'Shubham@123' },
            { name: 'Jatin BDA', email: 'jatin.b@gradus.live', role: 'BDA', reportsTo: 'Khushi Manager', password: 'Jatin@123' }
          ];
          setDbItem('beyondskills_crm_users', defaultCrmUsers);
          localStorage.setItem('beyondskills_crm_users_seeded', 'true');
          
          Promise.all(defaultCrmUsers.map(u => saveCrmUserToSupabase(u))).then(() => {
            fetchCrmUsers().then(newUsers => {
              if (newUsers.length > 0) {
                if (!selectedBdaName) {
                  const firstBda = newUsers.find(u => u.role === 'BDA');
                  if (firstBda) setSelectedBdaName(firstBda.name);
                }
                if (!selectedBdmName) {
                  const firstBdm = newUsers.find(u => u.role === 'BDM');
                  if (firstBdm) setSelectedBdmName(firstBdm.name);
                }
              }
            });
          });
        } else {
          if (users.length > 0) {
            if (!selectedBdaName) {
              const firstBda = users.find(u => u.role === 'BDA');
              if (firstBda) setSelectedBdaName(firstBda.name);
            }
            if (!selectedBdmName) {
              const firstBdm = users.find(u => u.role === 'BDM');
              if (firstBdm) setSelectedBdmName(firstBdm.name);
            }
          }
        }
      });
      
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
  const [googleFormSheetUrl, setGoogleFormSheetUrl] = useState(
    localStorage.getItem('beyondskills_sheet_google_form') || 
    'https://docs.google.com/spreadsheets/d/1Oypek5ZrY7GiaeENqox1t-PN2DQDKCJBo7g1uGcU4jU/export?format=csv'
  );
  const [googleSheetWebhookUrl, setGoogleSheetWebhookUrl] = useState('');
  const [adsSheetUrl, setAdsSheetUrl] = useState(
    localStorage.getItem('beyondskills_sheet_ads') || 
    'https://docs.google.com/spreadsheets/d/1Oypek5ZrY7GiaeENqox1t-PN2DQDKCJBo7g1uGcU4jU/export?format=csv'
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // Selected Lead state for Details Modal
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeadIdx, setSelectedLeadIdx] = useState(null);
  const [logs, setLogs] = useState([]);

  // Student Roster Management States
  const [usersSubTab, setUsersSubTab] = useState('students'); // 'students' or 'crm'
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showStudentLogsModal, setShowStudentLogsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    name: '', email: '', phone: '', status: 'College Student',
    college: '', gradYear: '', bio: '', accountStatus: 'Active',
    password: '', activeCourses: []
  });
  const [newStudentForm, setNewStudentForm] = useState({
    name: '', email: '', phone: '', status: 'College Student',
    college: '', gradYear: '', bio: '', password: '', activeCourses: []
  });
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterStatus, setStudentFilterStatus] = useState('');
  const [studentFilterAcademic, setStudentFilterAcademic] = useState('');
  
  // Filters
  const [leadSearch, setLeadSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterProgram, setFilterProgram] = useState('');

  // Helper to determine if a lead is a WhatsApp / Meta WA campaign lead
  const isWhatsAppLead = (lead) => {
    if (!lead) return false;
    const typeStr = (lead.type || '').toLowerCase();
    const campStr = (lead.campaign || '').toLowerCase();
    const remStr = (lead.remarks || lead.notes || lead.message || '').toLowerCase();
    
    return (
      typeStr.includes('whatsapp') || typeStr.includes('meta/wa') || typeStr.includes('meta wa') ||
      campStr.includes('whatsapp') || campStr.includes('meta/wa') || campStr.includes('meta wa') ||
      remStr.includes('whatsapp campaign') || remStr.includes('meta/wa') || remStr.includes('meta wa')
    );
  };
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

  // Selected BDM for detailed BDM Performance view
  const [selectedBdmName, setSelectedBdmName] = useState('');

  const handleSaveWebhookUrl = async (url) => {
    setGoogleSheetWebhookUrl(url);
    try {
      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : window.location.origin;
      await fetch(`${apiHost}/api/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ googleSheetWebhookUrl: url })
      });
    } catch (err) {
      console.error('Error saving config:', err);
    }
  };

  const handleSaveGoogleFormSheetUrl = async (url) => {
    setGoogleFormSheetUrl(url);
    localStorage.setItem('beyondskills_sheet_google_form', url);
    try {
      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : window.location.origin;
      await fetch(`${apiHost}/api/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ googleFormSheetUrl: url })
      });
    } catch (err) {
      console.error('Error saving config:', err);
    }
  };

  const handleSaveAdsSheetUrl = async (url) => {
    setAdsSheetUrl(url);
    localStorage.setItem('beyondskills_sheet_ads', url);
    try {
      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : window.location.origin;
      await fetch(`${apiHost}/api/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adsSheetUrl: url })
      });
    } catch (err) {
      console.error('Error saving config:', err);
    }
  };

  const fetchCrmUsers = async () => {
    try {
      const { data, error } = await getCrmUsersFromSupabase();
      if (!error && data) {
        setCrmUsers(data);
        setDbItem('beyondskills_crm_users', data);
        return data;
      }
    } catch (err) {
      console.error('Failed to fetch CRM users from Supabase:', err);
    }
    const fallback = getDbItem('beyondskills_crm_users', []);
    setCrmUsers(fallback);
    return fallback;
  };

  const fetchWebhookLeads = async () => {
    try {
      // 1. Fetch Google Sheet leads (Master source)
      let sheetLeads = [];
      let sheetFetched = false;

      // Fetch Ads Leads
      if (adsSheetUrl) {
        try {
          const res = await fetch(adsSheetUrl);
          if (res.ok) {
            const csvText = await res.text();
            const parsed = parseSheetCSV(csvText);
            parsed.forEach(p => { 
              if (!p.type || p.type === 'Unspecified' || p.type === 'Google Form Leads') {
                if (p.campaign && (p.campaign.toUpperCase().includes('META/WA') || p.campaign.toLowerCase().includes('whatsapp'))) {
                  p.type = p.campaign;
                } else {
                  p.type = 'Ads Leads'; 
                }
              }
            });
            sheetLeads = [...sheetLeads, ...parsed];
            sheetFetched = true;
          }
        } catch (sheetErr) {
          console.warn('Failed to fetch Ads sheet CSV:', sheetErr);
        }
      }

      // Fetch Google Form Leads
      if (googleFormSheetUrl) {
        try {
          const res = await fetch(googleFormSheetUrl);
          if (res.ok) {
            const csvText = await res.text();
            const parsed = parseSheetCSV(csvText);
            parsed.forEach(p => { 
              if (!p.type || p.type === 'Unspecified' || p.type === 'Ads Leads') {
                if (p.campaign && (p.campaign.toUpperCase().includes('META/WA') || p.campaign.toLowerCase().includes('whatsapp'))) {
                  p.type = p.campaign;
                } else {
                  p.type = 'Organic Leads'; 
                }
              }
            });
            sheetLeads = [...sheetLeads, ...parsed];
            sheetFetched = true;
          }
        } catch (sheetErr) {
          console.warn('Failed to fetch Google Form sheet CSV:', sheetErr);
        }
      }

      // 2. Fetch leads from Supabase
      let supabaseLeads = [];
      try {
        const { data, error } = await getLeadsFromSupabase();
        if (!error && data) {
          supabaseLeads = data;
        }
      } catch (sbErr) {
        console.warn('Failed to fetch from Supabase:', sbErr);
      }

      // If we couldn't load/fetch the sheet, fallback to show Supabase directly
      if (!sheetFetched) {
        if (supabaseLeads.length > 0) {
          setLeads(supabaseLeads);
          setDbItem('beyondskills_leads', supabaseLeads);
        }
        return;
      }

      const sheetPhones = new Set(sheetLeads.map(l => l.phone.toString().trim()));
      
      // Map leads and mark them as Deleted from Sheet in Supabase if they are missing from sheet
      let activeLeads = await Promise.all(supabaseLeads.map(async (l) => {
        const isPresentInSheet = sheetPhones.has(l.phone.toString().trim());
        if (!isPresentInSheet && l.status !== 'Deleted from Sheet') {
          const updated = { ...l, status: 'Deleted from Sheet' };
          try {
            await updateLeadInSupabase(updated);
          } catch (err) {
            console.error('Failed to update deleted lead status in Supabase:', err);
          }
          return updated;
        } else if (isPresentInSheet && l.status === 'Deleted from Sheet') {
          const updated = { ...l, status: 'New' };
          try {
            await updateLeadInSupabase(updated);
          } catch (err) {
            console.error('Failed to restore deleted lead status in Supabase:', err);
          }
          return updated;
        }
        return l;
      }));

      // Merge sheet leads
      for (const sLead of sheetLeads) {
        const phoneKey = sLead.phone.toString().trim();
        const existingLeadIndex = activeLeads.findIndex(l => l.phone.toString().trim() === phoneKey);
        
        if (existingLeadIndex === -1) {
          // Lead does not exist -> Append
          const newLead = {
            id: `LD${String(activeLeads.length + 101).padStart(3, '0')}`,
            name: sLead.name,
            email: sLead.email,
            phone: sLead.phone,
            date: sLead.date,
            type: sLead.type || 'Ads Leads',
            program: sLead.program || 'full-stack-web',
            assignedBDM: '',
            assignedBDA: '',
            status: 'New',
            subStatus: 'QUALIFIED',
            profession: sLead.profession || 'Unspecified',
            college: sLead.college || 'Unspecified',
            qualification: sLead.qualification || 'Unspecified',
            experience: sLead.experience || 'Unspecified',
            contactTime: sLead.contactTime || 'Anytime',
            goal: sLead.goal || 'Unspecified',
            mentor: 'None',
            duration: 'None',
            callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
            history: sLead.notes ? [{ note: sLead.notes, date: new Date().toISOString() }] : []
          };
          
          activeLeads.push(newLead);
          
          try {
            await saveLeadToSupabase(newLead);
          } catch (e) {
            console.error('Failed to sync new sheet lead to Supabase:', e);
          }
        } else {
          // Lead exists -> Update only unspecified fields
          const existingLead = activeLeads[existingLeadIndex];
          let updated = false;
          const updatedLead = { ...existingLead };
          
          if ((!updatedLead.college || updatedLead.college === 'Unspecified') && sLead.college && sLead.college !== 'Unspecified') {
            updatedLead.college = sLead.college;
            updatedLead.qualification = sLead.college;
            updated = true;
          }
          if ((!updatedLead.profession || updatedLead.profession === 'Unspecified') && sLead.profession && sLead.profession !== 'Unspecified') {
            updatedLead.profession = sLead.profession;
            updatedLead.experience = sLead.profession;
            updated = true;
          }
          if ((!updatedLead.goal || updatedLead.goal === 'Unspecified') && sLead.goal && sLead.goal !== 'Unspecified') {
            updatedLead.goal = sLead.goal;
            updated = true;
          }
          if ((!updatedLead.contactTime || updatedLead.contactTime === 'Anytime' || updatedLead.contactTime === 'Anytime between 10am to 8pm') && sLead.contactTime && sLead.contactTime !== 'Anytime') {
            updatedLead.contactTime = sLead.contactTime;
            updated = true;
          }
          if (sLead.email && sLead.email !== 'no-email@beyondskills.com' && (!updatedLead.email || updatedLead.email === 'no-email@beyondskills.com')) {
            updatedLead.email = sLead.email;
            updated = true;
          }
          
          if (updated) {
            activeLeads[existingLeadIndex] = updatedLead;
            try {
              await updateLeadInSupabase(updatedLead);
            } catch (e) {
              console.error('Failed to update existing lead details from sheet sync:', e);
            }
          }
        }
      }

      // Set the clean list to state and local storage fallback
      setLeads(activeLeads);
      setDbItem('beyondskills_leads', activeLeads);
    } catch (e) {
      console.error('Error in fetchWebhookLeads strict sheet sync:', e);
    }
  };

  useEffect(() => {
    // Fetch configuration from backend
    const fetchConfig = async () => {
      try {
        const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:5000'
          : window.location.origin;
        const res = await fetch(`${apiHost}/api/config`);
        if (res.ok) {
          const config = await res.json();
          if (config.googleSheetWebhookUrl) {
            setGoogleSheetWebhookUrl(config.googleSheetWebhookUrl);
          }
          if (config.googleFormSheetUrl) {
            setGoogleFormSheetUrl(config.googleFormSheetUrl);
            localStorage.setItem('beyondskills_sheet_google_form', config.googleFormSheetUrl);
          }
          if (config.adsSheetUrl) {
            setAdsSheetUrl(config.adsSheetUrl);
            localStorage.setItem('beyondskills_sheet_ads', config.adsSheetUrl);
          }
        }
      } catch (err) {
        console.error('Error fetching config:', err);
      }
    };
    fetchConfig();

    // Fetch CRM Users from Supabase on mount
    fetchCrmUsers().then(users => {
      if (users && users.length > 0) {
        if (!selectedBdaName) {
          const firstBda = users.find(u => u.role === 'BDA');
          if (firstBda) setSelectedBdaName(firstBda.name);
        }
        if (!selectedBdmName) {
          const firstBdm = users.find(u => u.role === 'BDM');
          if (firstBdm) setSelectedBdmName(firstBdm.name);
        }
      }
    });

    // Check if logged in user is admin or BDA
    const loggedInUser = getDbItem('beyondskills_current_user', null);
    if (!loggedInUser || !['Admin', 'BDA', 'BDM', 'Sales Head'].includes(loggedInUser.role)) {
      setCurrentUser(null);
      return;
    }
    setCurrentUser(loggedInUser);

    setLeads([]);
    setPayments(getDbItem('beyondskills_payments', []));
    setStudents(getDbItem('beyondskills_users', []));
    setBlogs(getDbItem('beyondskills_blogs', []));
    setMentors(getDbItem('beyondskills_mentors', []));
    setLandingPages(getDbItem('beyondskills_landing_pages', []));
    setLogs(getDbItem('beyondskills_access_logs', []));

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
  const activeAccessibleLeads = accessibleLeads.filter(l => l.status !== 'Deleted from Sheet');

  // Helper to filter leads and navigate to list view
  const filterLeadsAndNavigate = (filterName, filterValue) => {
    // Reset all filters first
    setLeadSearch('');
    setFilterStatus('');
    setFilterType('');
    setFilterProgram('');
    setFilterBDA('');
    setFilterBDM('');
    setFilterSubStatus('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setLeadChannelTab('all');
    setLeadAdsSubTab('all');

    // Apply specific filter
    if (filterName === 'status') {
      setFilterStatus(filterValue);
    } else if (filterName === 'type') {
      setFilterType(filterValue);
      if (filterValue === 'Organic Leads' || filterValue === 'Google Form Leads') {
        setLeadChannelTab('organic');
      } else if (filterValue === 'Ads Leads') {
        setLeadChannelTab('ads');
      } else if (filterValue === 'WhatsApp Marketing Leads' || filterValue === 'META/WA CAMPAIGN LEADS' || filterValue === 'Meta WA Leads') {
        setLeadChannelTab('whatsapp');
      }
    } else if (filterName === 'program') {
      setFilterProgram(filterValue);
    } else if (filterName === 'subStatus') {
      setFilterSubStatus(filterValue);
    }

    // Switch view to Leads List
    setActiveMainTab('leads_manager');
    setLeadsSubTab('list');
  };

  // Save changes helper
  const saveLeadsToDb = async (updatedLeads) => {
    const prevLeads = leads;
    setLeads(updatedLeads);
    setDbItem('beyondskills_leads', updatedLeads);

    try {
      if (prevLeads.length === 0) {
        for (const lead of updatedLeads) {
          await saveLeadToSupabase(lead);
        }
      } else if (updatedLeads.length > prevLeads.length) {
        const newLeads = updatedLeads.filter(l => !prevLeads.some(pl => pl.id === l.id || pl.phone === l.phone));
        for (const lead of newLeads) {
          await saveLeadToSupabase(lead);
        }
      } else {
        const modifiedLeads = updatedLeads.filter(l => {
          const prev = prevLeads.find(pl => pl.id === l.id);
          return !prev || JSON.stringify(prev) !== JSON.stringify(l);
        });
        for (const lead of modifiedLeads) {
          await updateLeadInSupabase(lead);
        }
      }
    } catch (err) {
      console.error('Failed to sync CRM updates to Supabase:', err);
    }
  };

  // Seed demo data helper with new campaign categories
  const handleSeedDemoData = () => {
    const demoLeads = [
      { id: 'LD001', name: 'Roshan Kumar maharana', email: 'roshan.k@gmail.com', phone: '9776741640', date: '25 Jun 2026', type: 'Organic Leads', program: 'DA FLAGSHIP - UTTAM', assignedBDM: 'Abhishek Manager', assignedBDA: 'Muskan Gupta', status: 'New', subStatus: 'QUALIFIED', profession: 'Unspecified', mentor: 'None', duration: 'None', callAttempts: { s1: 'DNP', s2: 'CB', s3: 'CB', s4: '-', s5: '-', s6: '-' }, history: [{ note: 'Status 1 DNP, Status 2 CB: Scheduled call back.', date: new Date().toISOString() }] },
      { id: 'LD002', name: 'Pooja Sharma', email: 'pooja.s@yahoo.com', phone: '8765432109', date: new Date(Date.now() - 3600000 * 10).toISOString(), type: 'Organic Leads', program: 'ai-data-science', assignedBDM: 'Abhishek Manager', assignedBDA: 'Deepak Gupta', status: 'New', subStatus: 'QUALIFIED', profession: 'Student', mentor: 'None', duration: 'None', callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' }, history: [] },
      { id: 'LD003', name: 'Rohit Verma', email: 'rohit@gradus.live', phone: '7654321098', date: new Date(Date.now() - 3600000 * 25).toISOString(), type: 'Ads Leads', program: 'full-stack-web-development', assignedBDM: 'Khushi Manager', assignedBDA: 'Shubham Tyagi', status: 'Not Connected', subStatus: 'DNP', profession: 'Working Professional (< 30k) [WP-1]', mentor: 'None', duration: 'None', callAttempts: { s1: 'DNP', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' }, history: [{ note: 'Attempt 1: No answer / Ringing.', date: new Date().toISOString() }] },
      { id: 'LD004', name: 'Karan Mehra', email: 'karan@gmail.com', phone: '9988776655', date: new Date(Date.now() - 3600000 * 48).toISOString(), type: 'WhatsApp Marketing Leads', program: 'ai-data-science', assignedBDM: 'Khushi Manager', assignedBDA: 'Jatin BDA', status: 'Enrolled', subStatus: 'Already Paid', profession: 'Student', mentor: 'None', duration: 'None', callAttempts: { s1: 'QUALIFIED', s2: 'Already Paid', s3: '-', s4: '-', s5: '-', s6: '-' }, history: [{ note: 'Enrollment confirmed, LMS username set.', date: new Date().toISOString() }] },
      { id: 'LD005', name: 'Sneha Roy', email: 'sneha@outlook.com', phone: '9112233445', date: new Date(Date.now() - 3600000 * 60).toISOString(), type: 'Ads Leads', program: 'ai-data-science', assignedBDM: '', assignedBDA: '', status: 'New', subStatus: 'QUALIFIED', profession: 'Unemployed', mentor: 'None', duration: 'None', callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' }, history: [] },
      { id: 'LD006', name: 'Aakash Verma', email: 'aakash@meta.com', phone: '9888777666', date: new Date(Date.now() - 3600000 * 12).toISOString(), type: 'Meta WA Leads', program: 'full-stack-web-development', assignedBDM: 'Abhishek Manager', assignedBDA: 'Muskan Gupta', status: 'New', subStatus: 'QUALIFIED', profession: 'Working Professional', mentor: 'None', duration: 'None', callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' }, history: [{ note: 'Lead captured via Meta WhatsApp Ad campaign.', date: new Date().toISOString() }] }
    ];
    saveLeadsToDb(demoLeads);
    alert('Demo CRM Leads seeded successfully with Ads, Organic, and WhatsApp campaigns!');
  };

  // Add lead action
  const handleAddLead = (e) => {
    e.preventDefault();
    if (!validateEmail(newLeadForm.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(newLeadForm.phone)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
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
    const qualificationIdx = headers.findIndex(h => h.includes('qual') || h.includes('coll') || h.includes('degree') || h.includes('class') || h.includes('edu'));
    const experienceIdx = headers.findIndex(h => h.includes('exp') || h.includes('prof') || h.includes('work') || h.includes('job') || h.includes('role'));
    const goalIdx = headers.findIndex(h => h.includes('goal') || h.includes('career') || h.includes('target') || h.includes('why'));
    const contactTimeIdx = headers.findIndex(h => h.includes('time') || h.includes('slot') || h.includes('contact') || h.includes('call') || h.includes('window'));
    const campaignIdx = headers.findIndex(h => h.includes('campaign') || h.includes('source') || h.includes('utm'));
    const typeIdx = headers.findIndex(h => h.includes('type') || h.includes('channel') || h.includes('category'));

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
        const parsedCollege = qualificationIdx !== -1 ? cols[qualificationIdx] : 'Unspecified';
        const parsedProfession = experienceIdx !== -1 ? cols[experienceIdx] : 'Unspecified';
        const parsedGoal = goalIdx !== -1 ? cols[goalIdx] : 'Unspecified';
        const parsedContactTime = contactTimeIdx !== -1 ? cols[contactTimeIdx] : 'Anytime';
        const parsedCampaign = campaignIdx !== -1 ? cols[campaignIdx] : '';
        const parsedType = typeIdx !== -1 ? cols[typeIdx] : '';

        let derivedType = parsedType || parsedCampaign || 'Google Form Leads';
        if (parsedCampaign.toUpperCase().includes('META/WA') || parsedCampaign.toLowerCase().includes('whatsapp') || parsedCampaign.toLowerCase().includes('meta wa')) {
          derivedType = parsedCampaign || 'META/WA CAMPAIGN LEADS';
        }

        parsedRecords.push({
          name: parsedName,
          email: emailIdx !== -1 ? cols[emailIdx] : 'no-email@beyondskills.com',
          phone: phoneIdx !== -1 ? cols[phoneIdx] : '0000000000',
          date: dateIdx !== -1 ? cols[dateIdx] : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: derivedType,
          campaign: parsedCampaign,
          program: programIdx !== -1 ? cols[programIdx] : 'ai-data-science',
          notes: notesIdx !== -1 ? cols[notesIdx] : 'Synced from sheet',
          college: parsedCollege,
          qualification: parsedCollege,
          profession: parsedProfession,
          experience: parsedProfession,
          goal: parsedGoal,
          contactTime: parsedContactTime
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
            const existingIndex = currentLeadsList.findIndex(l => l.phone === row.phone);
            if (existingIndex === -1) {
              currentLeadsList.push({
                id: `LD${String(currentLeadsList.length + 1).padStart(3, '0')}`,
                name: row.name,
                email: row.email,
                phone: row.phone,
                date: row.date,
                type: row.type || row.campaign || 'Organic Leads',
                campaign: row.campaign || '',
                program: row.program,
                assignedBDM: '',
                assignedBDA: '',
                status: 'New',
                subStatus: 'QUALIFIED',
                profession: row.profession || 'Unspecified',
                college: row.college || 'Unspecified',
                qualification: row.qualification || 'Unspecified',
                experience: row.experience || 'Unspecified',
                contactTime: row.contactTime || 'Anytime',
                goal: row.goal || 'Unspecified',
                mentor: 'None',
                duration: 'None',
                callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
                history: [{ note: row.notes, date: new Date().toISOString() }]
              });
              formLeadsAdded++;
            } else {
              // Update existing lead's unspecified fields
              const existingLead = currentLeadsList[existingIndex];
              let updated = false;
              if ((!existingLead.college || existingLead.college === 'Unspecified') && row.college && row.college !== 'Unspecified') {
                existingLead.college = row.college;
                existingLead.qualification = row.college;
                updated = true;
              }
              if ((!existingLead.profession || existingLead.profession === 'Unspecified') && row.profession && row.profession !== 'Unspecified') {
                existingLead.profession = row.profession;
                existingLead.experience = row.profession;
                updated = true;
              }
              if ((!existingLead.goal || existingLead.goal === 'Unspecified') && row.goal && row.goal !== 'Unspecified') {
                existingLead.goal = row.goal;
                updated = true;
              }
              if ((!existingLead.contactTime || existingLead.contactTime === 'Anytime' || existingLead.contactTime === 'Anytime between 10am to 8pm') && row.contactTime && row.contactTime !== 'Anytime') {
                existingLead.contactTime = row.contactTime;
                updated = true;
              }
              if (row.email && row.email !== 'no-email@beyondskills.com' && (!existingLead.email || existingLead.email === 'no-email@beyondskills.com')) {
                existingLead.email = row.email;
                updated = true;
              }
              if (updated) {
                currentLeadsList[existingIndex] = existingLead;
              }
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
            const existingIndex = currentLeadsList.findIndex(l => l.phone === row.phone);
            if (existingIndex === -1) {
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
                profession: row.profession || 'Unspecified',
                college: row.college || 'Unspecified',
                qualification: row.qualification || 'Unspecified',
                experience: row.experience || 'Unspecified',
                contactTime: row.contactTime || 'Anytime',
                goal: row.goal || 'Unspecified',
                mentor: 'None',
                duration: 'None',
                callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
                history: [{ note: row.notes, date: new Date().toISOString() }]
              });
              adsLeadsAdded++;
            } else {
              // Update existing lead's unspecified fields
              const existingLead = currentLeadsList[existingIndex];
              let updated = false;
              if ((!existingLead.college || existingLead.college === 'Unspecified') && row.college && row.college !== 'Unspecified') {
                existingLead.college = row.college;
                existingLead.qualification = row.college;
                updated = true;
              }
              if ((!existingLead.profession || existingLead.profession === 'Unspecified') && row.profession && row.profession !== 'Unspecified') {
                existingLead.profession = row.profession;
                existingLead.experience = row.profession;
                updated = true;
              }
              if ((!existingLead.goal || existingLead.goal === 'Unspecified') && row.goal && row.goal !== 'Unspecified') {
                existingLead.goal = row.goal;
                updated = true;
              }
              if ((!existingLead.contactTime || existingLead.contactTime === 'Anytime' || existingLead.contactTime === 'Anytime between 10am to 8pm') && row.contactTime && row.contactTime !== 'Anytime') {
                existingLead.contactTime = row.contactTime;
                updated = true;
              }
              if (row.email && row.email !== 'no-email@beyondskills.com' && (!existingLead.email || existingLead.email === 'no-email@beyondskills.com')) {
                existingLead.email = row.email;
                updated = true;
              }
              if (updated) {
                currentLeadsList[existingIndex] = existingLead;
              }
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
    const mockGoogleFormCSV = `Timestamp,Full Name,Email,Mobile,Course Program,Query Notes,Qualification,Experience,Goal,Preferred Call Time\n2026-07-15 14:02,Rajesh Kumar,rajesh.k@gmail.com,9898980011,ai-data-science,Wants to apply for scholarship,Undergraduate,Beginner - No Coding,Land a Tech Job,Afternoon 12 PM - 4 PM\n2026-07-15 14:25,Anjali Mehta,anjali@yahoo.com,8787870022,full-stack-web-development,Inquired on MERN stack fee structure,Fresh Graduate,Basic - Little Coding,Freelancing/Independent,Evening 4 PM - 8 PM`;
    const mockAdsCSV = `Lead ID,Ad Name,Full Name,Email,Phone,Program Interested,Qualification,Experience,Goal,Preferred Call Time\nld_ads_445,AI_Lead_Generation,Vikram Aditya,vikram@outlook.com,7676760033,ai-data-science,Working Professional,Basic - Little Coding,Land a Tech Job,Morning 10 AM - 1 PM\nld_ads_446,Fullstack_Camp,Priya Verma,priya@gmail.com,9595950044,full-stack-web-development,Postgraduate,Intermediate Developer,Upskill/Promotion,Evening 4 PM - 8 PM`;

    let addedCount = 0;
    const currentLeadsList = [...leads];

    // Parse Google Form mock
    const formParsed = parseSheetCSV(mockGoogleFormCSV);
    formParsed.forEach(row => {
      const existingIndex = currentLeadsList.findIndex(l => l.phone === row.phone);
      if (existingIndex === -1) {
        currentLeadsList.push({
          id: `LD${String(currentLeadsList.length + 1).padStart(3, '0')}`,
          name: row.name,
          email: row.email,
          phone: row.phone,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: 'Organic Leads',
          program: row.program,
          assignedBDM: '',
          assignedBDA: '',
          status: 'New',
          subStatus: 'QUALIFIED',
          profession: row.profession || 'Unspecified',
          college: row.college || 'Unspecified',
          qualification: row.qualification || 'Unspecified',
          experience: row.experience || 'Unspecified',
          contactTime: row.contactTime || 'Anytime',
          goal: row.goal || 'Unspecified',
          mentor: 'None',
          duration: 'None',
          callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
          history: [{ note: row.notes, date: new Date().toISOString() }]
        });
        addedCount++;
      } else {
        const existingLead = currentLeadsList[existingIndex];
        let updated = false;
        if ((!existingLead.college || existingLead.college === 'Unspecified') && row.college && row.college !== 'Unspecified') {
          existingLead.college = row.college;
          existingLead.qualification = row.college;
          updated = true;
        }
        if ((!existingLead.profession || existingLead.profession === 'Unspecified') && row.profession && row.profession !== 'Unspecified') {
          existingLead.profession = row.profession;
          existingLead.experience = row.profession;
          updated = true;
        }
        if ((!existingLead.goal || existingLead.goal === 'Unspecified') && row.goal && row.goal !== 'Unspecified') {
          existingLead.goal = row.goal;
          updated = true;
        }
        if ((!existingLead.contactTime || existingLead.contactTime === 'Anytime') && row.contactTime && row.contactTime !== 'Anytime') {
          existingLead.contactTime = row.contactTime;
          updated = true;
        }
        if (row.email && row.email !== 'no-email@beyondskills.com' && (!existingLead.email || existingLead.email === 'no-email@beyondskills.com')) {
          existingLead.email = row.email;
          updated = true;
        }
        if (updated) {
          currentLeadsList[existingIndex] = existingLead;
        }
      }
    });

    // Parse Ads mock
    const adsParsed = parseSheetCSV(mockAdsCSV);
    adsParsed.forEach(row => {
      const existingIndex = currentLeadsList.findIndex(l => l.phone === row.phone);
      if (existingIndex === -1) {
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
          profession: row.profession || 'Unspecified',
          college: row.college || 'Unspecified',
          qualification: row.qualification || 'Unspecified',
          experience: row.experience || 'Unspecified',
          contactTime: row.contactTime || 'Anytime',
          goal: row.goal || 'Unspecified',
          mentor: 'None',
          duration: 'None',
          callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
          history: [{ note: 'Imported from mock Facebook/Instagram Campaign', date: new Date().toISOString() }]
        });
        addedCount++;
      } else {
        const existingLead = currentLeadsList[existingIndex];
        let updated = false;
        if ((!existingLead.college || existingLead.college === 'Unspecified') && row.college && row.college !== 'Unspecified') {
          existingLead.college = row.college;
          existingLead.qualification = row.college;
          updated = true;
        }
        if ((!existingLead.profession || existingLead.profession === 'Unspecified') && row.profession && row.profession !== 'Unspecified') {
          existingLead.profession = row.profession;
          existingLead.experience = row.profession;
          updated = true;
        }
        if ((!existingLead.goal || existingLead.goal === 'Unspecified') && row.goal && row.goal !== 'Unspecified') {
          existingLead.goal = row.goal;
          updated = true;
        }
        if ((!existingLead.contactTime || existingLead.contactTime === 'Anytime') && row.contactTime && row.contactTime !== 'Anytime') {
          existingLead.contactTime = row.contactTime;
          updated = true;
        }
        if (row.email && row.email !== 'no-email@beyondskills.com' && (!existingLead.email || existingLead.email === 'no-email@beyondskills.com')) {
          existingLead.email = row.email;
          updated = true;
        }
        if (updated) {
          currentLeadsList[existingIndex] = existingLead;
        }
      }
    });

    saveLeadsToDb(currentLeadsList);
    alert(`Mock Sheet Sync Simulation Successful!\nAdded or updated leads in the database.`);
    setShowSheetsSyncModal(false);
  };

  // Delete lead
  const handleDeleteLeadEntry = (idx) => {
    const updated = leads.filter((_, i) => i !== idx);
    saveLeadsToDb(updated);
  };

  // Edit lead action trigger (Opens detailed Lead Details Panel)
  const handleStartEditLead = (lead, idx) => {
    const attempts = lead.callAttempts || { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' };
    const computedSub = lead.subStatus || (['s6', 's5', 's4', 's3', 's2', 's1'].map(k => attempts[k]).find(v => v && v !== '-') || 'QUALIFIED');
    setSelectedLead({
      ...lead,
      subStatus: computedSub,
      profession: lead.profession || 'Unspecified',
      callAttempts: attempts
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
    const updated = leads.map(lead => {
      if (selectedLeadIndexes.includes(lead.id)) {
        const updatedLead = { ...lead };
        if (bulkBDM) updatedLead.assignedBDM = bulkBDM;
        if (bulkBDA) updatedLead.assignedBDA = bulkBDA;
        if (bulkStatus) updatedLead.status = bulkStatus;
        return updatedLead;
      }
      return lead;
    });
    saveLeadsToDb(updated);
    setSelectedLeadIndexes([]);
    setBulkBDA('');
    setBulkBDM('');
    setBulkStatus('');
    alert('Selected leads successfully reallocated!');
  };

  // Manage users
  const handleAddUser = async (e) => {
    e.preventDefault();
    const updatedUser = { ...newUserForm };
    
    // Save to local storage state first as cache/fallback
    const updated = [...crmUsers, updatedUser];
    setCrmUsers(updated);
    setDbItem('beyondskills_crm_users', updated);

    // Save to Supabase
    try {
      await saveCrmUserToSupabase(updatedUser);
    } catch (err) {
      console.error('Failed to save CRM user to Supabase:', err);
    }
    
    logUserAccess(updatedUser.email, updatedUser.name, `CRM User Created: ${updatedUser.role}`);
    setShowAddUserModal(false);
    setNewUserForm({ name: '', email: '', role: 'BDA', reportsTo: '', password: '' });
  };

  const handleRemoveUser = async (idx) => {
    const targetUser = crmUsers[idx];
    if (!targetUser) return;
    
    const updated = crmUsers.filter((_, i) => i !== idx);
    setCrmUsers(updated);
    setDbItem('beyondskills_crm_users', updated);
    
    // Delete from Supabase
    try {
      await deleteCrmUserFromSupabase(targetUser.email);
    } catch (err) {
      console.error('Failed to delete CRM user from Supabase:', err);
    }
    
    logUserAccess(targetUser.email, targetUser.name, `CRM User Revoked: ${targetUser.role}`);
  };

  // Student Action Handlers
  const handleAddStudent = (e) => {
    e.preventDefault();
    const studentsList = getDbItem('beyondskills_users', []);
    
    // Check duplicate
    if (studentsList.some(s => s.email.trim().toLowerCase() === newStudentForm.email.trim().toLowerCase())) {
      alert('A student account with this email address already exists.');
      return;
    }

    const createdStudent = {
      ...newStudentForm,
      email: newStudentForm.email.trim().toLowerCase(),
      studentId: `BS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      accountStatus: 'Active',
      activeCourses: newStudentForm.activeCourses || []
    };

    const updated = [...studentsList, createdStudent];
    setStudents(updated);
    setDbItem('beyondskills_users', updated);
    logUserAccess(createdStudent.email, createdStudent.name, 'Student Registered Manually');
    
    setShowAddStudentModal(false);
    setNewStudentForm({ name: '', email: '', phone: '', status: 'College Student', college: '', gradYear: '', bio: '', password: '', activeCourses: [] });
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const studentsList = getDbItem('beyondskills_users', []);
    const updated = studentsList.map(s => {
      if (s.email.toLowerCase() === selectedStudent.email.toLowerCase()) {
        return {
          ...s,
          name: studentForm.name,
          phone: studentForm.phone,
          status: studentForm.status,
          college: studentForm.status === 'College Student' ? studentForm.college : '',
          gradYear: studentForm.gradYear,
          bio: studentForm.bio,
          accountStatus: studentForm.accountStatus,
          password: studentForm.password,
          activeCourses: studentForm.activeCourses
        };
      }
      return s;
    });

    setStudents(updated);
    setDbItem('beyondskills_users', updated);
    logUserAccess(selectedStudent.email, studentForm.name, `Student Profile Updated by Admin (${studentForm.accountStatus})`);
    
    // If the edited student is the current logged-in user, refresh their session
    const loggedInUser = getDbItem('beyondskills_current_user', null);
    if (loggedInUser && loggedInUser.email.toLowerCase() === selectedStudent.email.toLowerCase()) {
      const refreshedUser = updated.find(s => s.email.toLowerCase() === loggedInUser.email.toLowerCase());
      setDbItem('beyondskills_current_user', refreshedUser);
      window.dispatchEvent(new Event('auth_change'));
    }

    setShowEditStudentModal(false);
    setSelectedStudent(null);
  };

  const handleDeleteStudent = (email) => {
    if (!window.confirm(`Are you sure you want to delete the student account for ${email}? This action is irreversible.`)) return;

    const studentsList = getDbItem('beyondskills_users', []);
    const targetStudent = studentsList.find(s => s.email.toLowerCase() === email.toLowerCase());
    const updated = studentsList.filter(s => s.email.toLowerCase() !== email.toLowerCase());

    setStudents(updated);
    setDbItem('beyondskills_users', updated);
    
    if (targetStudent) {
      logUserAccess(targetStudent.email, targetStudent.name, 'Student Account Deleted by Admin');
    }

    // Deselect from bulk list
    setSelectedStudentIds(prev => prev.filter(id => id !== email));
  };

  const handleBulkStudentAction = (actionType) => {
    if (selectedStudentIds.length === 0) return;
    
    if (actionType === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${selectedStudentIds.length} selected student account(s)? This action is irreversible.`)) return;
      
      const studentsList = getDbItem('beyondskills_users', []);
      const updated = studentsList.filter(s => !selectedStudentIds.includes(s.email));
      
      setStudents(updated);
      setDbItem('beyondskills_users', updated);
      
      logUserAccess(currentUser.email, currentUser.name, `Bulk Deleted ${selectedStudentIds.length} Student Accounts`);
      setSelectedStudentIds([]);
      alert('Selected student accounts successfully deleted!');
    } else if (actionType === 'suspend' || actionType === 'activate') {
      const statusValue = actionType === 'suspend' ? 'Suspended' : 'Active';
      const studentsList = getDbItem('beyondskills_users', []);
      
      const updated = studentsList.map(s => {
        if (selectedStudentIds.includes(s.email)) {
          return { ...s, accountStatus: statusValue };
        }
        return s;
      });

      setStudents(updated);
      setDbItem('beyondskills_users', updated);
      
      logUserAccess(currentUser.email, currentUser.name, `Bulk Updated status to ${statusValue} for ${selectedStudentIds.length} Student Accounts`);
      
      // Refresh current session if admin suspended their own account (highly unlikely, but safe)
      const loggedInUser = getDbItem('beyondskills_current_user', null);
      if (loggedInUser && selectedStudentIds.includes(loggedInUser.email)) {
        const refreshedUser = updated.find(s => s.email.toLowerCase() === loggedInUser.email.toLowerCase());
        setDbItem('beyondskills_current_user', refreshedUser);
        window.dispatchEvent(new Event('auth_change'));
      }
      
      setSelectedStudentIds([]);
      alert(`Selected student accounts status successfully set to ${statusValue}!`);
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
      const matchStatus = filterStatus 
        ? lead.status === filterStatus 
        : lead.status !== 'Deleted from Sheet';
      
      // Filter by dynamic channel tabs
      let matchType = filterType ? (lead.type === filterType || isWhatsAppLead(lead)) : true;
      if (leadChannelTab === 'organic' || leadChannelTab === 'google') {
        matchType = (lead.type === 'Organic Leads' || lead.type === 'Google Form Leads') && !isWhatsAppLead(lead);
      } else if (leadChannelTab === 'ads') {
        matchType = lead.type === 'Ads Leads' && !isWhatsAppLead(lead);
      } else if (leadChannelTab === 'whatsapp') {
        if (filterType) {
          matchType = lead.type === filterType || isWhatsAppLead(lead);
        } else {
          matchType = isWhatsAppLead(lead);
        }
      }

      // Filter by dynamic sub-tabs under ads
      let matchProgram = filterProgram 
        ? (lead.program === filterProgram || 
           (filterProgram.includes('full-stack') && lead.program?.includes('full-stack')) ||
           (filterProgram.includes('ai') && (lead.program?.includes('ai') || lead.program?.includes('artificial') || lead.program?.includes('data')))) 
        : true;
      if (leadChannelTab === 'ads') {
        if (leadAdsSubTab === 'aimlds') {
          matchProgram = ['artificial-intelligence', 'machine-learning', 'data-science', 'ai-data-science', 'data-analytics', 'DA FLAGSHIP - UTTAM'].includes(lead.program);
        } else if (leadAdsSubTab === 'cloud') {
          matchProgram = lead.program === 'cloud-computing' || lead.program === 'cloud';
        } else if (leadAdsSubTab === 'cyber') {
          matchProgram = lead.program === 'cyber-security' || lead.program === 'cyber';
        } else if (leadAdsSubTab === 'fullstack') {
          matchProgram = lead.program === 'full-stack-web' || lead.program === 'full-stack-web-development';
        } else if (leadAdsSubTab === 'digimar') {
          matchProgram = lead.program === 'digital-marketing-cert' || lead.program === 'digital-marketing';
        }
      }

      const matchBDA = filterBDA ? lead.assignedBDA === filterBDA : true;
      const matchBDM = filterBDM ? lead.assignedBDM === filterBDM : true;
      const leadSub = lead.subStatus || (lead.callAttempts ? (['s6', 's5', 's4', 's3', 's2', 's1'].map(k => lead.callAttempts[k]).find(v => v && v !== '-') || 'QUALIFIED') : 'QUALIFIED');
      const matchSub = filterSubStatus ? leadSub === filterSubStatus : true;
      
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

    return activeAccessibleLeads.filter(l => {
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
  const activeStatsLeads = accessibleLeads.filter(l => l.status !== 'Deleted from Sheet');
  const statsTotalLeads = activeStatsLeads.length;
  const statsWhatsAppLeads = activeStatsLeads.filter(l => isWhatsAppLead(l) || l.type === 'WhatsApp Marketing Leads' || l.type === 'META/WA CAMPAIGN LEADS').length;
  const statsAdLeads = activeStatsLeads.filter(l => l.type === 'Ads Leads' && !isWhatsAppLead(l)).length;
  const statsConversionRate = statsTotalLeads > 0 ? ((activeStatsLeads.filter(l => l.status === 'Enrolled').length / statsTotalLeads) * 100).toFixed(1) : 0;
  const statsSuccessfulEnrollments = activeStatsLeads.filter(l => l.status === 'Enrolled').length;
  const statsHotLeads = activeStatsLeads.filter(l => l.status === 'Follow Up').length;

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
                onClick={() => setActiveMainTab('bdm_performance')}
                className={`w-full flex items-center space-x-3 px-4.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeMainTab === 'bdm_performance'
                    ? 'bg-white/5 border border-white/5 text-[#0EA5E9]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>BDMs Performance</span>
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
              {/* Theme Toggle Button */}
              <button 
                type="button"
                onClick={() => toggleTheme(!isDarkMode)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer border ${
                  isDarkMode 
                    ? 'bg-white/10 text-yellow-300 border-white/15 hover:bg-white/20' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-sm'
                }`}
                title="Toggle Dark / Light Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                <span>{isDarkMode ? 'Light Theme' : 'Dark Theme'}</span>
              </button>

              {isAdminUser && (
                <>
                  <button 
                    onClick={() => {
                      setLeads([]);
                      setDbItem('beyondskills_leads', []);
                      alert('All leads database deleted successfully!');
                    }}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer"
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
            {/* KPI statistics - Grid Layout (4 upper cards, 2 lower cards) */}
            <div className="space-y-6">
              {/* Upper Grid: 4 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* TOTAL LEADS */}
                <div 
                  onClick={() => filterLeadsAndNavigate('all', '')}
                  className={`p-6 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border transition-all duration-300 hover:scale-[1.02] ${
                    isDarkMode 
                      ? 'bg-[#0E1526] border-blue-500/20 text-white hover:border-blue-500/50 hover:bg-blue-950/20 shadow-blue-500/5' 
                      : 'bg-white border-blue-200 text-slate-900 hover:border-blue-400 hover:bg-blue-50/50 shadow-slate-200/80'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-blue-500 uppercase font-bold tracking-widest font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      Total Leads
                    </span>
                    <p className={`text-3xl font-extrabold font-mono mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{statsTotalLeads}</p>
                    <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest mt-1.5 inline-block font-mono">
                      Live Pipeline
                    </span>
                  </div>
                  <div className="bg-blue-500/10 text-blue-500 p-3.5 rounded-2xl border border-blue-500/20 shadow-sm">
                    <Inbox className="w-6 h-6" />
                  </div>
                </div>
                
                {/* WHATSAPP LEADS */}
                <div 
                  onClick={() => filterLeadsAndNavigate('type', 'WhatsApp Marketing Leads')}
                  className={`p-6 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border transition-all duration-300 hover:scale-[1.02] ${
                    isDarkMode 
                      ? 'bg-[#0E1526] border-emerald-500/20 text-white hover:border-emerald-500/50 hover:bg-emerald-950/20 shadow-emerald-500/5' 
                      : 'bg-white border-emerald-200 text-slate-900 hover:border-emerald-400 hover:bg-emerald-50/50 shadow-slate-200/80'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      WhatsApp Leads
                    </span>
                    <p className={`text-3xl font-extrabold font-mono mt-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{statsWhatsAppLeads}</p>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest mt-1.5 inline-block font-mono">
                      WhatsApp Marketing
                    </span>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-500 p-3.5 rounded-2xl border border-emerald-500/20 shadow-sm">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                </div>

                {/* AD LEADS */}
                <div 
                  onClick={() => filterLeadsAndNavigate('type', 'Ads Leads')}
                  className={`p-6 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border transition-all duration-300 hover:scale-[1.02] ${
                    isDarkMode 
                      ? 'bg-[#0E1526] border-cyan-500/20 text-white hover:border-cyan-500/50 hover:bg-cyan-950/20 shadow-cyan-500/5' 
                      : 'bg-white border-cyan-200 text-slate-900 hover:border-cyan-400 hover:bg-cyan-50/50 shadow-slate-200/80'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-cyan-500 uppercase font-bold tracking-widest font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                      Ad Leads
                    </span>
                    <p className={`text-3xl font-extrabold font-mono mt-1 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{statsAdLeads}</p>
                    <span className="text-[9px] font-bold text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-widest mt-1.5 inline-block font-mono">
                      Meta & Google Ads
                    </span>
                  </div>
                  <div className="bg-cyan-500/10 text-cyan-500 p-3.5 rounded-2xl border border-cyan-500/20 shadow-sm">
                    <Megaphone className="w-6 h-6" />
                  </div>
                </div>

                {/* CONVERSION RATE */}
                <div 
                  onClick={() => filterLeadsAndNavigate('status', 'Enrolled')}
                  className={`p-6 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border transition-all duration-300 hover:scale-[1.02] ${
                    isDarkMode 
                      ? 'bg-[#0E1526] border-rose-500/20 text-white hover:border-rose-500/50 hover:bg-rose-950/20 shadow-rose-500/5' 
                      : 'bg-white border-rose-200 text-slate-900 hover:border-rose-400 hover:bg-rose-50/50 shadow-slate-200/80'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-rose-500 uppercase font-bold tracking-widest font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                      Conversion Rate
                    </span>
                    <p className={`text-3xl font-extrabold font-mono mt-1 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>{statsConversionRate}%</p>
                    <span className="text-[9px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-widest mt-1.5 inline-block font-mono">
                      Needs Review
                    </span>
                  </div>
                  <div className="bg-rose-500/10 text-rose-500 p-3.5 rounded-2xl border border-rose-500/20 shadow-sm">
                    <Percent className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Lower Grid: 2 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* SUCCESSFUL ENROLMENTS */}
                <div 
                  onClick={() => filterLeadsAndNavigate('status', 'Enrolled')}
                  className={`p-6 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border transition-all duration-300 hover:scale-[1.01] ${
                    isDarkMode 
                      ? 'bg-[#0E1526] border-emerald-500/20 text-white hover:border-emerald-500/50 hover:bg-emerald-950/20' 
                      : 'bg-white border-emerald-200 text-slate-900 hover:border-emerald-400 hover:bg-emerald-50/50 shadow-slate-200/80'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Successful Enrolments
                    </span>
                    <p className={`text-3xl font-extrabold font-mono mt-1 ${isDarkMode ? 'text-[#4ADE80]' : 'text-emerald-600'}`}>{statsSuccessfulEnrollments}</p>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/15 px-2.5 py-0.5 rounded border border-emerald-500/25 uppercase tracking-widest mt-1.5 inline-block font-mono">
                      +{statsSuccessfulEnrollments} Enrolled
                    </span>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-500 p-3.5 rounded-2xl border border-emerald-500/20 shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                {/* ACTIVE HOT LEADS */}
                <div 
                  onClick={() => filterLeadsAndNavigate('status', 'Follow Up')}
                  className={`p-6 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border transition-all duration-300 hover:scale-[1.01] ${
                    isDarkMode 
                      ? 'bg-[#0E1526] border-amber-500/20 text-white hover:border-amber-500/50 hover:bg-amber-950/20' 
                      : 'bg-white border-amber-200 text-slate-900 hover:border-amber-400 hover:bg-amber-50/50 shadow-slate-200/80'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-amber-500 uppercase font-bold tracking-widest font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Active Hot Leads
                    </span>
                    <p className={`text-3xl font-extrabold font-mono mt-1 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{statsHotLeads}</p>
                    <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest mt-1.5 inline-block font-mono">
                      In Progress
                    </span>
                  </div>
                  <div className="bg-amber-500/10 text-amber-500 p-3.5 rounded-2xl border border-amber-500/20 shadow-sm">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Distribution & Source Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Funnel chart widget */}
              <div className={`p-6 rounded-2xl shadow-xl border transition-all ${
                isDarkMode ? 'bg-[#0A0E35] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/80'
              }`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center justify-between border-b pb-4 mb-4 ${
                  isDarkMode ? 'border-white/10 text-white' : 'border-slate-100 text-slate-900'
                }`}>
                  <div className="flex items-center space-x-2">
                    <LineChart className="w-4.5 h-4.5 text-[#2A4BFF]" />
                    <span>My Pipeline Funnel Stage View</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">Click stage to view leads</span>
                </h3>
                
                <div className="space-y-4 pt-2">
                  {[
                    { name: 'New Leads', status: 'New', count: accessibleLeads.filter(l => l.status === 'New').length, color: 'from-cyan-500 to-blue-500' },
                    { name: 'Connected / Contacted', status: 'Contacted', count: accessibleLeads.filter(l => l.status === 'Contacted').length, color: 'from-purple-500 to-indigo-500' },
                    { name: 'Follow Up (Pending Dial)', status: 'Follow Up', count: accessibleLeads.filter(l => l.status === 'Follow Up').length, color: 'from-amber-500 to-orange-500' },
                    { name: 'Not Connected (DNP/SO)', status: 'Not Connected', count: accessibleLeads.filter(l => l.status === 'Not Connected').length, color: 'from-rose-500 to-red-500' },
                    { name: 'Enrolled (Closed Success)', status: 'Enrolled', count: accessibleLeads.filter(l => l.status === 'Enrolled').length, color: 'from-emerald-500 to-teal-500' },
                    { name: 'Not Interested (Closed Lost)', status: 'Not Interested', count: accessibleLeads.filter(l => l.status === 'Not Interested').length, color: 'from-slate-500 to-slate-600' }
                  ].map((step, idx) => {
                    const percentage = statsTotalLeads > 0 ? ((step.count / statsTotalLeads) * 100).toFixed(1) : 0;
                    return (
                      <div 
                        key={idx} 
                        onClick={() => filterLeadsAndNavigate('status', step.status)}
                        className={`relative cursor-pointer group p-2 rounded-xl transition-all duration-200 ${
                          isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                          <span className={`font-medium transition-colors ${
                            isDarkMode ? 'text-slate-300 group-hover:text-cyan-400' : 'text-slate-700 group-hover:text-[#2A4BFF]'
                          }`}>{step.name}</span>
                          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{step.count} ({percentage}%)</span>
                        </div>
                        <div className={`w-full h-2.5 rounded-full overflow-hidden border transition-all ${
                          isDarkMode ? 'bg-white/5 border-white/5 group-hover:border-cyan-500/30' : 'bg-slate-100 border-slate-200 group-hover:border-blue-300'
                        }`}>
                          <div className={`bg-gradient-to-r ${step.color} h-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Marketing Lead Source Breakdown */}
              <div className={`p-6 rounded-2xl shadow-xl border flex flex-col justify-between transition-all ${
                isDarkMode ? 'bg-[#0A0E35] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/80'
              }`}>
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center justify-between border-b pb-4 mb-4 ${
                    isDarkMode ? 'border-white/10 text-white' : 'border-slate-100 text-slate-900'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <PieChart className="w-4.5 h-4.5 text-[#2A4BFF]" />
                      <span>Lead Campaign Categories</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono font-normal">Click source to view leads</span>
                  </h3>
                  
                  <div className="space-y-3 pt-2 text-xs font-mono">
                    {[
                      { name: 'Ads Campaign Leads', type: 'Ads Leads', count: accessibleLeads.filter(l => l.type === 'Ads Leads' && !isWhatsAppLead(l)).length, icon: Megaphone, color: 'text-cyan-500' },
                      { name: 'Organic Leads', type: 'Organic Leads', count: accessibleLeads.filter(l => (l.type === 'Organic Leads' || l.type === 'Google Form Leads') && !isWhatsAppLead(l)).length, icon: Globe, color: 'text-purple-500' },
                      { name: 'WhatsApp Marketing Leads', type: 'WhatsApp Marketing Leads', count: accessibleLeads.filter(l => l.type === 'WhatsApp Marketing Leads' && !isWhatsAppLead(l)).length, icon: MessageSquare, color: 'text-emerald-500' },
                      { name: 'META/WA Campaign Leads', type: 'META/WA CAMPAIGN LEADS', count: accessibleLeads.filter(l => isWhatsAppLead(l)).length, icon: Phone, color: 'text-green-500' }
                    ].map((src, idx) => {
                      const IconComp = src.icon;
                      const pct = statsTotalLeads > 0 ? ((src.count / statsTotalLeads) * 100).toFixed(1) : 0;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => filterLeadsAndNavigate('type', src.type)}
                          className={`flex items-center justify-between border-b pb-3 pt-1.5 cursor-pointer group px-3 rounded-xl transition-all duration-200 ${
                            isDarkMode 
                              ? 'border-white/5 hover:bg-white/5' 
                              : 'border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`flex items-center transition-colors ${
                            isDarkMode ? 'text-slate-300 group-hover:text-cyan-400' : 'text-slate-600 group-hover:text-[#2A4BFF]'
                          }`}>
                            <IconComp className={`w-4 h-4 mr-2.5 ${src.color}`} />
                            {src.name}
                          </span>
                          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{src.count} ({pct}%)</span>
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
                      setLeadChannelTab('organic');
                      setFilterType('Organic Leads');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      leadChannelTab === 'organic'
                        ? 'bg-[#2A4BFF] text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Organic Leads
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
                      setFilterType('');
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
                        <option value="Organic Leads">Organic Leads</option>
                        <option value="WhatsApp Marketing Leads">WhatsApp Marketing Leads</option>
                        <option value="Meta WA Leads">Meta WA Leads</option>
                        <option value="META/WA CAMPAIGN LEADS">META/WA CAMPAIGN LEADS</option>
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
                        <option value="Deleted from Sheet">Deleted from Sheet</option>
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
                              checked={filteredLeads.length > 0 && filteredLeads.every(l => selectedLeadIndexes.includes(l.id))}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLeadIndexes(filteredLeads.map(l => l.id));
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
                                checked={selectedLeadIndexes.includes(lead.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedLeadIndexes([...selectedLeadIndexes, lead.id]);
                                  } else {
                                    setSelectedLeadIndexes(selectedLeadIndexes.filter(id => id !== lead.id));
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
                                Date: {getISTDateTimeString(lead.date)}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-xs">
                              <p className="text-white">{lead.phone}</p>
                              <p className="text-slate-400 text-[10px]">{lead.email}</p>
                            </td>
                            <td className="py-3.5 px-4 font-mono uppercase text-[10px]">{lead.type}</td>
                            <td className="py-3.5 px-4 font-semibold text-white text-[10px] uppercase max-w-[120px] truncate" title={lead.program}>
                              {lead.program
                                ? lead.program.replace(/-/g, ' ')
                                : (lead.remarks?.toLowerCase().includes('ai/ml') || lead.campaign?.toLowerCase().includes('ai ml')
                                    ? 'artificial intelligence'
                                    : (lead.remarks?.toLowerCase().includes('full stack') || lead.campaign?.toLowerCase().includes('full stack')
                                        ? 'full-stack-web'
                                        : (lead.remarks?.toLowerCase().includes('cloud') || lead.campaign?.toLowerCase().includes('cloud')
                                            ? 'cloud-computing'
                                            : (lead.remarks?.toLowerCase().includes('cyber') || lead.campaign?.toLowerCase().includes('cyber')
                                                ? 'cyber-security'
                                                : (lead.remarks?.toLowerCase().includes('digital') || lead.campaign?.toLowerCase().includes('digital')
                                                    ? 'digital-marketing-cert'
                                                    : 'Unspecified')))))}
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
                              {(() => {
                                const currentSub = lead.subStatus || (lead.callAttempts ? (['s6', 's5', 's4', 's3', 's2', 's1'].map(k => lead.callAttempts[k]).find(v => v && v !== '-') || 'QUALIFIED') : 'QUALIFIED');
                                return (
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wider ${
                                    currentSub === 'QUALIFIED' ? 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20' :
                                    currentSub === 'DNP' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    currentSub === 'Already Paid' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20' :
                                    currentSub === 'CB' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    currentSub === 'NI' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                    currentSub === 'CNC' || currentSub === 'SO' || currentSub === 'Switched Off' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                    'bg-white/5 text-slate-300 border border-white/10'
                                  }`}>
                                    {currentSub}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={lead.status || 'New'}
                                onChange={(e) => {
                                  const updated = leads.map(l => l.id === lead.id ? { ...l, status: e.target.value } : l);
                                  saveLeadsToDb(updated);
                                }}
                                className={`text-[10px] font-extrabold px-2 py-1 rounded uppercase bg-[#05092A] border outline-none cursor-pointer transition-all ${
                                  lead.status === 'New' ? 'text-cyan-400 border-cyan-500/30' :
                                  lead.status === 'Contacted' ? 'text-purple-400 border-purple-500/30' :
                                  lead.status === 'Follow Up' ? 'text-amber-400 border-amber-500/30' :
                                  lead.status === 'Not Connected' ? 'text-rose-400 border-rose-500/30' :
                                  lead.status === 'Enrolled' ? 'text-emerald-400 border-emerald-500/30' :
                                  'text-slate-400 border-white/10'
                                }`}
                              >
                                <option value="New" className="bg-[#0A0E35] text-cyan-400">New</option>
                                <option value="Contacted" className="bg-[#0A0E35] text-purple-400">Contacted</option>
                                <option value="Follow Up" className="bg-[#0A0E35] text-amber-400">Follow Up</option>
                                <option value="Not Connected" className="bg-[#0A0E35] text-rose-400">Not Connected</option>
                                <option value="Enrolled" className="bg-[#0A0E35] text-emerald-400">Enrolled</option>
                                <option value="Not Interested" className="bg-[#0A0E35] text-slate-400">Not Interested</option>
                              </select>
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
                                  checked={selectedLeadIndexes.includes(lead.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedLeadIndexes([...selectedLeadIndexes, lead.id]);
                                    } else {
                                      setSelectedLeadIndexes(selectedLeadIndexes.filter(id => id !== lead.id));
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

        {/* -------------------- MAIN TAB 4B: BDM PERFORMANCE -------------------- */}
        {activeMainTab === 'bdm_performance' && !isBdaUser && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-white">
            
            {/* BDMs Roster sidebar */}
            <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-4">Roster of Managers</h3>
              
              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                {crmUsers.filter(u => u.role === 'BDM').map((bdm, idx) => {
                  const bdmLeadsCount = leads.filter(l => l.assignedBDM === bdm.name).length;
                  const bdmEnrolls = leads.filter(l => l.assignedBDM === bdm.name && l.status === 'Enrolled').length;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedBdmName(bdm.name)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedBdmName === bdm.name 
                          ? 'bg-[#2A4BFF]/25 border-[#2A4BFF] shadow-md shadow-[#2A4BFF]/10' 
                          : 'bg-[#050718] border-white/5 hover:border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{bdm.name}</h4>
                        <span className="text-[10px] text-brand-cyan font-mono font-bold">BDM</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{bdm.email}</p>
                      <div className="border-t border-white/10 pt-2 mt-2.5 flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>Reports to: {bdm.reportsTo || 'Sales Head'}</span>
                        <span className="text-slate-300 font-bold">{bdmLeadsCount} Leads / {bdmEnrolls} Enrolled</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected BDM Details and metrics */}
            <div className="lg:col-span-2 bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-widest font-mono">Manager KPI Details</span>
                  <h3 className="text-base font-extrabold text-white mt-0.5">{selectedBdmName || 'No Manager Selected'}</h3>
                </div>
                <div className="bg-[#2A4BFF]/10 text-[#2A4BFF] border border-[#2A4BFF]/25 px-3 py-1.5 rounded-lg text-xs font-mono">
                  Role: Business Development Manager (BDM)
                </div>
              </div>

              {selectedBdmName ? (
                <div className="space-y-8">
                  {/* KPI mini grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-[#050718] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase font-mono block">Total Team Leads</span>
                      <p className="text-xl font-bold font-mono text-white mt-1">
                        {leads.filter(l => l.assignedBDM === selectedBdmName).length}
                      </p>
                    </div>
                    <div className="bg-[#050718] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase font-mono block">Team Enrolled</span>
                      <p className="text-xl font-bold font-mono text-[#4ADE80] mt-1">
                        {leads.filter(l => l.assignedBDM === selectedBdmName && l.status === 'Enrolled').length}
                      </p>
                    </div>
                    <div className="bg-[#050718] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase font-mono block">Team Conversion</span>
                      <p className="text-xl font-bold font-mono text-brand-cyan mt-1">
                        {leads.filter(l => l.assignedBDM === selectedBdmName).length > 0 
                          ? ((leads.filter(l => l.assignedBDM === selectedBdmName && l.status === 'Enrolled').length / 
                              leads.filter(l => l.assignedBDM === selectedBdmName).length) * 100).toFixed(1) 
                          : '0.0'}%
                      </p>
                    </div>
                    <div className="bg-[#050718] border border-white/5 p-4 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase font-mono block">Team Follow Up</span>
                      <p className="text-xl font-bold font-mono text-orange-400 mt-1">
                        {leads.filter(l => l.assignedBDM === selectedBdmName && l.status === 'Follow Up').length}
                      </p>
                    </div>
                  </div>

                  {/* BDAs reporting to this BDM */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Assigned Business Associates (BDAs) Performance</h4>
                    
                    <div className="space-y-3">
                      {crmUsers.filter(u => u.role === 'BDA' && u.reportsTo === selectedBdmName).length > 0 ? (
                        crmUsers.filter(u => u.role === 'BDA' && u.reportsTo === selectedBdmName).map((bda, i) => {
                          const bdaLeads = leads.filter(l => l.assignedBDA === bda.name);
                          const bdaEnrolls = bdaLeads.filter(l => l.status === 'Enrolled').length;
                          const bdaConvPct = bdaLeads.length > 0 ? ((bdaEnrolls / bdaLeads.length) * 100).toFixed(1) : '0.0';
                          return (
                            <div key={i} className="bg-[#050718] border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                              <div>
                                <h5 className="font-bold text-white text-sm">{bda.name}</h5>
                                <span className="text-[10px] text-slate-400 font-mono">{bda.email}</span>
                              </div>
                              <div className="flex gap-4 font-mono text-[11px] text-slate-300">
                                <div>Leads: <span className="font-bold text-white">{bdaLeads.length}</span></div>
                                <div>Enrolled: <span className="font-bold text-[#4ADE80]">{bdaEnrolls}</span></div>
                                <div>Conv. Rate: <span className="font-bold text-brand-cyan">{bdaConvPct}%</span></div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-slate-500 text-xs italic font-mono p-4 border border-white/5 rounded-xl text-center bg-[#050718]">
                          No BDAs are currently assigned to report to this BDM.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Funnel distribution */}
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Manager Team Funnel distribution</h4>
                    
                    <div className="space-y-2.5">
                      {[
                        { name: 'New Leads', status: 'New', color: 'from-blue-500 to-indigo-500' },
                        { name: 'Contacted', status: 'Contacted', color: 'from-[#0EA5E9] to-cyan-500' },
                        { name: 'Follow Up', status: 'Follow Up', color: 'from-orange-500 to-amber-500' },
                        { name: 'Not Interested', status: 'Not Interested', color: 'from-slate-650 to-slate-800' }
                      ].map((step, i) => {
                        const totalLeadsForBdm = leads.filter(l => l.assignedBDM === selectedBdmName).length;
                        const count = leads.filter(l => l.assignedBDM === selectedBdmName && l.status === step.status).length;
                        const pct = totalLeadsForBdm > 0 ? ((count / totalLeadsForBdm) * 100).toFixed(1) : 0;
                        return (
                          <div key={i} className="text-xs">
                            <div className="flex justify-between items-center mb-1 font-mono">
                              <span className="text-slate-300">{step.name}</span>
                              <span>{count} / {totalLeadsForBdm} ({pct}%)</span>
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
                  Select a business development manager from the left roster to view team performance parameters.
                </div>
              )}
            </div>

          </div>
        )}

        {/* -------------------- MAIN TAB: LEAD ANALYSIS -------------------- */}
        {activeMainTab === 'lead_analysis' && !isBdaUser && (() => {
          // Dynamic filtering based on analysis dropdowns
          const filteredAnalysisLeads = activeAccessibleLeads.filter(l => {
            let matchProg = true;
            if (filterProgram) {
              if (filterProgram === 'full-stack-web') {
                matchProg = l.program?.includes('full-stack') || l.remarks?.toLowerCase().includes('full stack') || l.campaign?.toLowerCase().includes('full stack');
              } else if (filterProgram === 'artificial-intelligence') {
                matchProg = ['artificial-intelligence', 'machine-learning', 'data-science', 'ai-data-science'].includes(l.program) || l.remarks?.toLowerCase().includes('ai');
              } else if (filterProgram === 'cloud-computing') {
                matchProg = l.program === 'cloud-computing' || l.program === 'cloud';
              } else if (filterProgram === 'cyber-security') {
                matchProg = l.program === 'cyber-security' || l.program === 'cyber';
              } else if (filterProgram === 'digital-marketing-cert') {
                matchProg = l.program === 'digital-marketing-cert' || l.program === 'digital-marketing';
              } else {
                matchProg = l.program === filterProgram;
              }
            }

            let matchChannel = true;
            if (leadChannelTab === 'ads') {
              matchChannel = l.type === 'Ads Leads' && !isWhatsAppLead(l);
            } else if (leadChannelTab === 'whatsapp') {
              matchChannel = isWhatsAppLead(l);
            } else if (leadChannelTab === 'organic' || leadChannelTab === 'google') {
              matchChannel = (l.type === 'Organic Leads' || l.type === 'Google Form Leads') && !isWhatsAppLead(l);
            }

            return matchProg && matchChannel;
          });

          const totalLeadsCount = filteredAnalysisLeads.length;
          const totalOverallCount = activeAccessibleLeads.length || 1;

          // Course metrics
          const coursesList = [
            { id: 'full-stack-web', name: 'Full Stack Web Development (MERN)', color: '#0EA5E9', bg: 'bg-[#0EA5E9]' },
            { id: 'artificial-intelligence', name: 'AI & Data Science', color: '#8B5CF6', bg: 'bg-[#8B5CF6]' },
            { id: 'cloud-computing', name: 'Cloud Computing', color: '#10B981', bg: 'bg-[#10B981]' },
            { id: 'cyber-security', name: 'Cyber Security', color: '#F43F5E', bg: 'bg-[#F43F5E]' },
            { id: 'digital-marketing-cert', name: 'Digital Marketing', color: '#F59E0B', bg: 'bg-[#F59E0B]' }
          ];

          // Channel metrics
          const adsLeadsCount = filteredAnalysisLeads.filter(l => l.type === 'Ads Leads' && !isWhatsAppLead(l)).length;
          const waLeadsCount = filteredAnalysisLeads.filter(l => isWhatsAppLead(l)).length;
          const formLeadsCount = filteredAnalysisLeads.filter(l => (l.type === 'Organic Leads' || l.type === 'Google Form Leads') && !isWhatsAppLead(l)).length;

          const adsPct = totalLeadsCount > 0 ? ((adsLeadsCount / totalLeadsCount) * 100).toFixed(1) : 0;
          const waPct = totalLeadsCount > 0 ? ((waLeadsCount / totalLeadsCount) * 100).toFixed(1) : 0;
          const formPct = totalLeadsCount > 0 ? ((formLeadsCount / totalLeadsCount) * 100).toFixed(1) : 0;

          // Pipeline Status metrics
          const statusNewCount = filteredAnalysisLeads.filter(l => l.status === 'New').length;
          const statusContactedCount = filteredAnalysisLeads.filter(l => l.status === 'Contacted').length;
          const statusFollowUpCount = filteredAnalysisLeads.filter(l => l.status === 'Follow Up').length;
          const statusNotConnectedCount = filteredAnalysisLeads.filter(l => l.status === 'Not Connected' || l.subStatus === 'DNP').length;
          const statusEnrolledCount = filteredAnalysisLeads.filter(l => l.status === 'Enrolled' || l.subStatus === 'Already Paid').length;
          const statusCbCount = filteredAnalysisLeads.filter(l => l.subStatus === 'CB').length;

          const overallConvRate = totalLeadsCount > 0 ? ((statusEnrolledCount / totalLeadsCount) * 100).toFixed(1) : 0;

          return (
            <div className="space-y-8 animate-fade-in text-white">
              
              {/* Top Banner & Interactive Filters */}
              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-6 h-6 text-brand-cyan" />
                      <h2 className="text-xl font-black uppercase tracking-wider text-white">Lead Analysis & Campaign Performance Charts</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Visual percentage analytics for campaign channels, course programs (Full Stack, AI, Cloud), and pipeline conversion funnels.
                    </p>
                  </div>

                  {/* Quick Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Course Selector */}
                    <div>
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Filter Course</span>
                      <select 
                        value={filterProgram}
                        onChange={(e) => setFilterProgram(e.target.value)}
                        className="bg-[#05092A] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-cyan-300 outline-none focus:border-brand-cyan font-bold cursor-pointer"
                      >
                        <option value="">All Courses</option>
                        <option value="full-stack-web">Full Stack Web (MERN)</option>
                        <option value="artificial-intelligence">AI & Data Science</option>
                        <option value="cloud-computing">Cloud Computing</option>
                        <option value="cyber-security">Cyber Security</option>
                        <option value="digital-marketing-cert">Digital Marketing</option>
                      </select>
                    </div>

                    {/* Campaign Channel Selector */}
                    <div>
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Filter Channel</span>
                      <select 
                        value={leadChannelTab}
                        onChange={(e) => setLeadChannelTab(e.target.value)}
                        className="bg-[#05092A] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-brand-cyan font-bold cursor-pointer"
                      >
                        <option value="all">All Campaign Channels</option>
                        <option value="ads">Meta & Google Ads</option>
                        <option value="whatsapp">WhatsApp / Meta WA</option>
                        <option value="organic">Organic Sheet Forms</option>
                      </select>
                    </div>

                    {/* Reset Button */}
                    {(filterProgram || leadChannelTab !== 'all') && (
                      <button 
                        onClick={() => { setFilterProgram(''); setLeadChannelTab('all'); }}
                        className="mt-4 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-mono font-bold rounded-lg text-slate-300 transition-all cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* KPI Overview Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Card 1: Total Analysed Leads */}
                  <div 
                    onClick={() => filterLeadsAndNavigate('all', '')}
                    className="bg-[#050718] border border-white/10 p-5 rounded-xl space-y-2 relative overflow-hidden cursor-pointer hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Total Analysed Leads</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-white">{totalLeadsCount}</span>
                      <span className="text-xs font-mono font-bold text-brand-cyan">({((totalLeadsCount / totalOverallCount) * 100).toFixed(1)}% of total)</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3">
                      <div className="bg-brand-cyan h-full rounded-full" style={{ width: `${(totalLeadsCount / totalOverallCount) * 100}%` }}></div>
                    </div>
                  </div>

                  {/* Card 2: Interactive Course Performance Focus */}
                  {(() => {
                    const activeProgSlug = filterProgram || 'full-stack-web';
                    const activeProgName = 
                      activeProgSlug === 'full-stack-web' ? 'Full Stack Web (MERN)' :
                      activeProgSlug === 'artificial-intelligence' ? 'AI & Data Science' :
                      activeProgSlug === 'cloud-computing' ? 'Cloud Computing' :
                      activeProgSlug === 'cyber-security' ? 'Cyber Security' :
                      activeProgSlug === 'digital-marketing-cert' ? 'Digital Marketing' : 'All Courses Combined';

                    const progLeads = activeAccessibleLeads.filter(l => {
                      if (!filterProgram) return true;
                      if (activeProgSlug === 'full-stack-web') return l.program?.includes('full-stack') || l.remarks?.toLowerCase().includes('full stack') || l.campaign?.toLowerCase().includes('full stack');
                      if (activeProgSlug === 'artificial-intelligence') return ['artificial-intelligence', 'machine-learning', 'data-science', 'ai-data-science'].includes(l.program) || l.remarks?.toLowerCase().includes('ai');
                      if (activeProgSlug === 'cloud-computing') return l.program === 'cloud-computing' || l.program === 'cloud';
                      if (activeProgSlug === 'cyber-security') return l.program === 'cyber-security' || l.program === 'cyber';
                      if (activeProgSlug === 'digital-marketing-cert') return l.program === 'digital-marketing-cert' || l.program === 'digital-marketing';
                      return l.program === activeProgSlug;
                    });

                    const progEnrolled = progLeads.filter(l => l.status === 'Enrolled' || l.subStatus === 'Already Paid').length;
                    const progPct = totalOverallCount > 0 ? ((progLeads.length / totalOverallCount) * 100).toFixed(1) : 0;
                    
                    return (
                      <div 
                        onClick={() => filterLeadsAndNavigate('program', activeProgSlug)}
                        className="bg-[#050718] border border-[#0EA5E9]/40 p-5 rounded-xl space-y-2 relative overflow-hidden shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all cursor-pointer hover:border-cyan-300"
                      >
                        <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#0EA5E9] font-bold block">Course Focus</span>
                          <select
                            value={filterProgram}
                            onChange={(e) => setFilterProgram(e.target.value)}
                            className="bg-[#0A0E35] border border-[#0EA5E9]/50 rounded px-2 py-0.5 text-[10px] text-cyan-300 font-bold outline-none cursor-pointer hover:border-cyan-400"
                          >
                            <option value="full-stack-web">Full Stack Web (MERN)</option>
                            <option value="artificial-intelligence">AI & Data Science</option>
                            <option value="cloud-computing">Cloud Computing</option>
                            <option value="cyber-security">Cyber Security</option>
                            <option value="digital-marketing-cert">Digital Marketing</option>
                            <option value="">All Courses Combined</option>
                          </select>
                        </div>
                        <div className="flex items-baseline space-x-2 pt-1">
                          <span className="text-3xl font-black text-white">{progLeads.length}</span>
                          <span className="text-xs font-mono font-bold text-[#0EA5E9]">({progPct}% share)</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1">
                          <span>Enrolled: <strong className="text-[#4ADE80]">{progEnrolled}</strong></span>
                          <span>Conv: <strong className="text-brand-cyan">{progLeads.length > 0 ? ((progEnrolled / progLeads.length) * 100).toFixed(1) : 0}%</strong></span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#0EA5E9] h-full rounded-full" style={{ width: `${progPct}%` }}></div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Card 3: Top Channel Share */}
                  <div 
                    onClick={() => filterLeadsAndNavigate('type', 'Ads Leads')}
                    className="bg-[#050718] border border-white/10 p-5 rounded-xl space-y-2 cursor-pointer hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Highest Channel Share</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-white">
                        {adsLeadsCount >= waLeadsCount && adsLeadsCount >= formLeadsCount ? 'Ads Campaigns' : (waLeadsCount >= formLeadsCount ? 'WhatsApp' : 'Organic Forms')}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#4ADE80]">
                        ({Math.max(adsPct, waPct, formPct)}%)
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 pt-1">
                      <span className="text-[#0EA5E9]">Ads: {adsPct}%</span>
                      <span>•</span>
                      <span className="text-[#4ADE80]">WA: {waPct}%</span>
                      <span>•</span>
                      <span className="text-[#8B5CF6]">Form: {formPct}%</span>
                    </div>
                  </div>

                  {/* Card 4: Overall Conversion Rate */}
                  <div 
                    onClick={() => filterLeadsAndNavigate('status', 'Enrolled')}
                    className="bg-[#050718] border border-[#4ADE80]/30 p-5 rounded-xl space-y-2 shadow-[0_0_15px_rgba(74,222,128,0.1)] cursor-pointer hover:border-[#4ADE80] transition-all duration-200"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#4ADE80] font-bold block">Overall CRM Conversion Rate</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-[#4ADE80]">{overallConvRate}%</span>
                      <span className="text-xs font-mono text-slate-300 font-bold">({statusEnrolledCount} Enrolled)</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3">
                      <div className="bg-[#4ADE80] h-full rounded-full" style={{ width: `${overallConvRate}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Chart Row 1: Course Breakdown & Campaign Share */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* CHART 1: Course / Program Percentage Distribution */}
                <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-2">
                      <BarChart className="w-5 h-5 text-brand-cyan" />
                      <h3 className="text-base font-bold uppercase tracking-wider text-white">Course Wise Lead & Percentage Share</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Percentage Distribution</span>
                  </div>

                  <div className="space-y-5">
                    {coursesList.map((course, idx) => {
                      const courseLeads = filteredAnalysisLeads.filter(l => {
                        if (course.id === 'full-stack-web') {
                          return l.program?.includes('full-stack') || l.remarks?.toLowerCase().includes('full stack') || l.campaign?.toLowerCase().includes('full stack');
                        }
                        if (course.id === 'artificial-intelligence') {
                          return ['artificial-intelligence', 'machine-learning', 'data-science', 'ai-data-science'].includes(l.program) || l.remarks?.toLowerCase().includes('ai');
                        }
                        if (course.id === 'cloud-computing') {
                          return l.program === 'cloud-computing' || l.program === 'cloud';
                        }
                        if (course.id === 'cyber-security') {
                          return l.program === 'cyber-security' || l.program === 'cyber';
                        }
                        return l.program === course.id;
                      });

                      const count = courseLeads.length;
                      const sharePct = totalLeadsCount > 0 ? ((count / totalLeadsCount) * 100).toFixed(1) : 0;
                      const enrolled = courseLeads.filter(l => l.status === 'Enrolled' || l.subStatus === 'Already Paid').length;
                      const cAds = courseLeads.filter(l => l.type === 'Ads Leads' && !isWhatsAppLead(l)).length;
                      const cWa = courseLeads.filter(l => isWhatsAppLead(l)).length;
                      const cForm = courseLeads.filter(l => (l.type === 'Organic Leads' || l.type === 'Google Form Leads') && !isWhatsAppLead(l)).length;

                      return (
                        <div 
                          key={idx} 
                          onClick={() => filterLeadsAndNavigate('program', course.id)}
                          className="space-y-2 bg-white/5 border border-white/5 p-4 rounded-xl hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center space-x-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: course.color }}></span>
                              <span className="font-bold text-white text-sm">{course.name}</span>
                              {course.id === 'full-stack-web' && (
                                <span className="bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30 text-[9px] px-2 py-0.5 rounded font-bold uppercase">Popular</span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="font-extrabold text-white text-sm mr-2">{count} Leads</span>
                              <span className="font-bold text-slate-400">({sharePct}%)</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden flex">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sharePct}%`, backgroundColor: course.color }}></div>
                          </div>

                          {/* Channel Split Badges */}
                          <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                            <div className="flex items-center space-x-3">
                              <span>Ads: <strong className="text-white">{cAds}</strong></span>
                              <span>WA: <strong className="text-[#4ADE80]">{cWa}</strong></span>
                              <span>Form: <strong className="text-[#8B5CF6]">{cForm}</strong></span>
                            </div>
                            <div>
                              <span>Enrolled: <strong className="text-[#4ADE80]">{enrolled}</strong></span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CHART 2: Campaign Source Channel Share */}
                <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-2">
                      <PieChart className="w-5 h-5 text-[#4ADE80]" />
                      <h3 className="text-base font-bold uppercase tracking-wider text-white">Campaign Channel Percentage Share</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Source Share</span>
                  </div>

                  {/* Channel Breakdown Cards */}
                  <div className="space-y-4">
                    {/* Meta & Google Ads */}
                    <div 
                      onClick={() => filterLeadsAndNavigate('type', 'Ads Leads')}
                      className="bg-[#050718] border border-brand-cyan/30 p-4 rounded-xl space-y-2 cursor-pointer hover:border-brand-cyan hover:bg-white/5 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-brand-cyan" />
                          <span className="font-bold text-white text-xs">Meta & Google Ads Campaigns</span>
                        </div>
                        <span className="text-sm font-extrabold text-brand-cyan">{adsLeadsCount} Leads ({adsPct}%)</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-cyan h-full rounded-full" style={{ width: `${adsPct}%` }}></div>
                      </div>
                    </div>

                    {/* WhatsApp & Meta WA */}
                    <div 
                      onClick={() => filterLeadsAndNavigate('type', 'WhatsApp Marketing Leads')}
                      className="bg-[#050718] border border-[#4ADE80]/30 p-4 rounded-xl space-y-2 cursor-pointer hover:border-[#4ADE80] hover:bg-white/5 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-[#4ADE80]" />
                          <span className="font-bold text-white text-xs">WhatsApp & Meta WA Campaigns</span>
                        </div>
                        <span className="text-sm font-extrabold text-[#4ADE80]">{waLeadsCount} Leads ({waPct}%)</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#4ADE80] h-full rounded-full" style={{ width: `${waPct}%` }}></div>
                      </div>
                    </div>

                    {/* Organic Google Form */}
                    <div 
                      onClick={() => filterLeadsAndNavigate('type', 'Organic Leads')}
                      className="bg-[#050718] border border-[#8B5CF6]/30 p-4 rounded-xl space-y-2 cursor-pointer hover:border-[#8B5CF6] hover:bg-white/5 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-[#8B5CF6]" />
                          <span className="font-bold text-white text-xs">Organic Google Form Sheets</span>
                        </div>
                        <span className="text-sm font-extrabold text-[#8B5CF6]">{formLeadsCount} Leads ({formPct}%)</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#8B5CF6] h-full rounded-full" style={{ width: `${formPct}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-segmented Stacked Channel Bar */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Combined Channel Volume Share</span>
                    <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden flex">
                      <div style={{ width: `${adsPct}%` }} className="bg-brand-cyan h-full" title={`Ads: ${adsPct}%`}></div>
                      <div style={{ width: `${waPct}%` }} className="bg-[#4ADE80] h-full" title={`WhatsApp: ${waPct}%`}></div>
                      <div style={{ width: `${formPct}%` }} className="bg-[#8B5CF6] h-full" title={`Forms: ${formPct}%`}></div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Visual Chart Row 2: Pipeline Status & Call Outcome Funnel Analytics */}
              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold uppercase tracking-wider text-white">Pipeline Status & Call Outcome Funnel Analytics</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Status Conversion Funnel</span>
                </div>

                {/* Status Funnel Progress Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
                  {/* NEW */}
                  <div 
                    onClick={() => filterLeadsAndNavigate('status', 'New')}
                    className="bg-white/5 border border-cyan-500/30 p-4 rounded-xl space-y-2 cursor-pointer hover:border-cyan-400 hover:bg-white/10 transition-all"
                  >
                    <span className="text-[9px] uppercase font-bold text-cyan-400 block">NEW LEADS</span>
                    <span className="text-2xl font-black text-white">{statusNewCount}</span>
                    <span className="text-[10px] text-slate-400 block font-bold">({totalLeadsCount > 0 ? ((statusNewCount / totalLeadsCount) * 100).toFixed(1) : 0}%)</span>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${totalLeadsCount > 0 ? (statusNewCount / totalLeadsCount) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* CONTACTED */}
                  <div 
                    onClick={() => filterLeadsAndNavigate('status', 'Contacted')}
                    className="bg-white/5 border border-purple-500/30 p-4 rounded-xl space-y-2 cursor-pointer hover:border-purple-400 hover:bg-white/10 transition-all"
                  >
                    <span className="text-[9px] uppercase font-bold text-purple-400 block">CONTACTED</span>
                    <span className="text-2xl font-black text-white">{statusContactedCount}</span>
                    <span className="text-[10px] text-slate-400 block font-bold">({totalLeadsCount > 0 ? ((statusContactedCount / totalLeadsCount) * 100).toFixed(1) : 0}%)</span>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-purple-400 h-full rounded-full" style={{ width: `${totalLeadsCount > 0 ? (statusContactedCount / totalLeadsCount) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* FOLLOW UP */}
                  <div 
                    onClick={() => filterLeadsAndNavigate('status', 'Follow Up')}
                    className="bg-white/5 border border-amber-500/30 p-4 rounded-xl space-y-2 cursor-pointer hover:border-amber-400 hover:bg-white/10 transition-all"
                  >
                    <span className="text-[9px] uppercase font-bold text-amber-400 block">FOLLOW UP</span>
                    <span className="text-2xl font-black text-white">{statusFollowUpCount}</span>
                    <span className="text-[10px] text-slate-400 block font-bold">({totalLeadsCount > 0 ? ((statusFollowUpCount / totalLeadsCount) * 100).toFixed(1) : 0}%)</span>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${totalLeadsCount > 0 ? (statusFollowUpCount / totalLeadsCount) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* NOT CONNECTED (DNP) */}
                  <div 
                    onClick={() => filterLeadsAndNavigate('status', 'Not Connected')}
                    className="bg-white/5 border border-rose-500/30 p-4 rounded-xl space-y-2 cursor-pointer hover:border-rose-400 hover:bg-white/10 transition-all"
                  >
                    <span className="text-[9px] uppercase font-bold text-rose-400 block">NOT CONNECTED / DNP</span>
                    <span className="text-2xl font-black text-white">{statusNotConnectedCount}</span>
                    <span className="text-[10px] text-slate-400 block font-bold">({totalLeadsCount > 0 ? ((statusNotConnectedCount / totalLeadsCount) * 100).toFixed(1) : 0}%)</span>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-rose-400 h-full rounded-full" style={{ width: `${totalLeadsCount > 0 ? (statusNotConnectedCount / totalLeadsCount) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* CALL BACK (CB) */}
                  <div 
                    onClick={() => filterLeadsAndNavigate('subStatus', 'CB')}
                    className="bg-white/5 border border-blue-500/30 p-4 rounded-xl space-y-2 cursor-pointer hover:border-blue-400 hover:bg-white/10 transition-all"
                  >
                    <span className="text-[9px] uppercase font-bold text-blue-400 block">CALL BACK (CB)</span>
                    <span className="text-2xl font-black text-white">{statusCbCount}</span>
                    <span className="text-[10px] text-slate-400 block font-bold">({totalLeadsCount > 0 ? ((statusCbCount / totalLeadsCount) * 100).toFixed(1) : 0}%)</span>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-blue-400 h-full rounded-full" style={{ width: `${totalLeadsCount > 0 ? (statusCbCount / totalLeadsCount) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* ENROLLED / PAID */}
                  <div 
                    onClick={() => filterLeadsAndNavigate('status', 'Enrolled')}
                    className="bg-white/5 border border-emerald-500/30 p-4 rounded-xl space-y-2 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer hover:border-emerald-400 hover:bg-white/10 transition-all"
                  >
                    <span className="text-[9px] uppercase font-bold text-emerald-400 block">ENROLLED / PAID</span>
                    <span className="text-2xl font-black text-emerald-400">{statusEnrolledCount}</span>
                    <span className="text-[10px] text-slate-300 block font-bold">({totalLeadsCount > 0 ? ((statusEnrolledCount / totalLeadsCount) * 100).toFixed(1) : 0}%)</span>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${totalLeadsCount > 0 ? (statusEnrolledCount / totalLeadsCount) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Course & Campaign Analysis Table */}
              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Course & Campaign Performance Matrix Table</h3>
                  <span className="text-xs font-mono text-slate-400">Click any row to filter Leads Database</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-300 text-[11px] uppercase font-bold tracking-wider">
                        <th className="py-4 px-4">Course Program</th>
                        <th className="py-4 px-4 text-center">Total Leads</th>
                        <th className="py-4 px-4 text-center">Ads Leads</th>
                        <th className="py-4 px-4 text-center">WhatsApp Leads</th>
                        <th className="py-4 px-4 text-center">Organic Forms</th>
                        <th className="py-4 px-4 text-center">DNP Leads</th>
                        <th className="py-4 px-4 text-center">Enrolled</th>
                        <th className="py-4 px-4 text-center">Conversion %</th>
                        <th className="py-4 px-4 text-right">Volume Share %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursesList.map((course, idx) => {
                        const courseLeads = filteredAnalysisLeads.filter(l => {
                          if (course.id === 'full-stack-web') {
                            return l.program?.includes('full-stack') || l.remarks?.toLowerCase().includes('full stack') || l.campaign?.toLowerCase().includes('full stack');
                          }
                          if (course.id === 'artificial-intelligence') {
                            return ['artificial-intelligence', 'machine-learning', 'data-science', 'ai-data-science'].includes(l.program) || l.remarks?.toLowerCase().includes('ai');
                          }
                          if (course.id === 'cloud-computing') {
                            return l.program === 'cloud-computing' || l.program === 'cloud';
                          }
                          if (course.id === 'cyber-security') {
                            return l.program === 'cyber-security' || l.program === 'cyber';
                          }
                          return l.program === course.id;
                        });

                        const cTotal = courseLeads.length;
                        const cAds = courseLeads.filter(l => l.type === 'Ads Leads' && !isWhatsAppLead(l)).length;
                        const cWa = courseLeads.filter(l => isWhatsAppLead(l)).length;
                        const cForm = courseLeads.filter(l => (l.type === 'Organic Leads' || l.type === 'Google Form Leads') && !isWhatsAppLead(l)).length;
                        const cDnp = courseLeads.filter(l => l.subStatus === 'DNP' || l.status === 'Not Connected').length;
                        const cEnrolled = courseLeads.filter(l => l.status === 'Enrolled' || l.subStatus === 'Already Paid').length;
                        const cConv = cTotal > 0 ? ((cEnrolled / cTotal) * 100).toFixed(1) : '0.0';
                        const cShare = totalLeadsCount > 0 ? ((cTotal / totalLeadsCount) * 100).toFixed(1) : 0;

                        return (
                          <tr 
                            key={idx} 
                            onClick={() => {
                              setActiveMainTab('leads_manager');
                              setLeadsSubTab('list');
                              setFilterProgram(course.id);
                            }}
                            className="border-b border-white/5 hover:bg-white/5 text-slate-300 transition-colors cursor-pointer"
                          >
                            <td className="py-4 px-4 font-bold text-white flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: course.color }}></span>
                              <span>{course.name}</span>
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-white">{cTotal}</td>
                            <td className="py-4 px-4 text-center text-cyan-400 font-bold">{cAds}</td>
                            <td className="py-4 px-4 text-center text-[#4ADE80] font-bold">{cWa}</td>
                            <td className="py-4 px-4 text-center text-[#8B5CF6] font-bold">{cForm}</td>
                            <td className="py-4 px-4 text-center text-rose-400 font-bold">{cDnp}</td>
                            <td className="py-4 px-4 text-center text-emerald-400 font-bold">{cEnrolled}</td>
                            <td className="py-4 px-4 text-center text-cyan-300 font-extrabold">{cConv}%</td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <span className="font-bold text-white">{cShare}%</span>
                                <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${cShare}%`, backgroundColor: course.color }}></div>
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
          );
        })()}

        {activeMainTab === 'users' && !isBdaUser && (
          <div className="space-y-6 animate-fade-in text-white">
            
            {/* Sub-tabs Selection */}
            <div className="flex border-b border-white/10 mb-6 gap-6 text-sm">
              <button 
                onClick={() => setUsersSubTab('students')}
                className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
                  usersSubTab === 'students' ? 'border-[#2A4BFF] text-[#2A4BFF]' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Registered Student Accounts
              </button>
              <button 
                onClick={() => setUsersSubTab('crm')}
                className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
                  usersSubTab === 'crm' ? 'border-[#2A4BFF] text-[#2A4BFF]' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                CRM Team Associates
              </button>
            </div>

            {/* Sub-tab 1: Student Roster */}
            {usersSubTab === 'students' && (() => {
              const filteredStudents = students.filter(student => {
                const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                                      student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
                                      (student.phone && student.phone.includes(studentSearch)) ||
                                      (student.contact && student.contact.includes(studentSearch));
                const matchesAcademic = !studentFilterAcademic || student.status === studentFilterAcademic;
                const matchesStatus = !studentFilterStatus || (student.accountStatus || 'Active') === studentFilterStatus;
                return matchesSearch && matchesAcademic && matchesStatus;
              });

              const handleSelectStudent = (email) => {
                setSelectedStudentIds(prev => 
                  prev.includes(email) ? prev.filter(id => id !== email) : [...prev, email]
                );
              };

              const handleSelectAllStudents = (e) => {
                if (e.target.checked) {
                  setSelectedStudentIds(filteredStudents.map(s => s.email));
                } else {
                  setSelectedStudentIds([]);
                }
              };

              return (
                <div className="space-y-6">
                  
                  {/* Filters & Actions Header */}
                  <div className="bg-[#0A0E35] border border-white/10 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
                      <input 
                        type="text"
                        placeholder="Search student Name, Email, Phone..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                      />
                      <select 
                        value={studentFilterAcademic}
                        onChange={(e) => setStudentFilterAcademic(e.target.value)}
                        className="bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                      >
                        <option value="">All Academic Status</option>
                        <option value="College Student">College Student</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                      <select 
                        value={studentFilterStatus}
                        onChange={(e) => setStudentFilterStatus(e.target.value)}
                        className="bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                      >
                        <option value="">All Account Status</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>

                    <button 
                      onClick={() => {
                        setNewStudentForm({ name: '', email: '', phone: '', status: 'College Student', college: '', gradYear: '', bio: '', password: '', activeCourses: [] });
                        setShowAddStudentModal(true);
                      }}
                      className="w-full md:w-auto bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Student Account</span>
                    </button>
                  </div>

                  {/* Bulk Actions Panel */}
                  {selectedStudentIds.length > 0 && (
                    <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                      <span className="text-xs font-bold text-[#0EA5E9]">
                        Selected {selectedStudentIds.length} Student Account(s)
                      </span>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handleBulkStudentAction('activate')}
                          className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Activate Selected
                        </button>
                        <button 
                          onClick={() => handleBulkStudentAction('suspend')}
                          className="flex-1 sm:flex-initial bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Suspend Selected
                        </button>
                        <button 
                          onClick={() => handleBulkStudentAction('delete')}
                          className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Delete Selected
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Students Table */}
                  <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 pb-3.5 uppercase text-[9px] tracking-wider font-mono">
                            <th className="py-2 px-3 w-8">
                              <input 
                                type="checkbox"
                                checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                                onChange={handleSelectAllStudents}
                                className="rounded text-[#2A4BFF] focus:ring-0 border-white/20 bg-transparent"
                              />
                            </th>
                            <th className="py-2 px-3">Avatar</th>
                            <th className="py-2 px-3">Student ID</th>
                            <th className="py-2 px-3">Name</th>
                            <th className="py-2 px-3">Email Address</th>
                            <th className="py-2 px-3">Phone</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3">College / University</th>
                            <th className="py-2 px-3">Enrolled Courses</th>
                            <th className="py-2 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.length === 0 ? (
                            <tr>
                              <td colSpan="10" className="text-center py-10 text-slate-500 italic font-mono">
                                No student accounts found matching your search.
                              </td>
                            </tr>
                          ) : (
                            filteredStudents.map((student, idx) => {
                              const isAlreadyCrm = crmUsers.some(u => u.email.trim().toLowerCase() === student.email.trim().toLowerCase());
                              const isChecked = selectedStudentIds.includes(student.email);
                              const accountStatusVal = student.accountStatus || 'Active';
                              return (
                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 text-slate-300 transition-colors">
                                  <td className="py-2.5 px-3">
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleSelectStudent(student.email)}
                                      className="rounded text-[#2A4BFF] focus:ring-0 border-white/20 bg-transparent"
                                    />
                                  </td>
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
                                    <div className="flex flex-col space-y-1">
                                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wide w-max ${
                                        accountStatusVal === 'Active' ? 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/30' :
                                        'bg-red-500/10 text-red-400 border border-red-500/30'
                                      }`}>
                                        {accountStatusVal}
                                      </span>
                                      <span className={`text-[9px] font-medium px-2 py-0.5 rounded tracking-wide w-max text-slate-400 border border-white/5`}>
                                        {student.status || 'Student'}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-400 max-w-[120px] truncate" title={student.college || 'N/A'}>
                                    {student.college || 'N/A'}
                                  </td>
                                  <td className="py-2.5 px-3 font-mono text-[10px] text-[#4ADE80] max-w-[150px] truncate" title={student.activeCourses ? student.activeCourses.join(', ') : 'None'}>
                                    {student.activeCourses && student.activeCourses.length > 0 
                                      ? student.activeCourses.join(', ')
                                      : 'None'}
                                  </td>
                                  <td className="py-2.5 px-3 text-right">
                                    <div className="flex justify-end gap-1.5">
                                      <button 
                                        onClick={() => {
                                          setSelectedStudent(student);
                                          setStudentForm({
                                            name: student.name || '',
                                            phone: student.phone || student.contact || '',
                                            status: student.status || 'College Student',
                                            college: student.college || '',
                                            gradYear: student.gradYear || '',
                                            bio: student.bio || '',
                                            accountStatus: student.accountStatus || 'Active',
                                            password: student.password || '',
                                            activeCourses: student.activeCourses || []
                                          });
                                          setShowEditStudentModal(true);
                                        }}
                                        className="p-1 bg-white/5 hover:bg-white/10 text-slate-200 rounded border border-white/15 transition-all cursor-pointer"
                                        title="Edit Details"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setSelectedStudent(student);
                                          setShowStudentLogsModal(true);
                                        }}
                                        className="p-1 bg-blue-500/10 hover:bg-blue-500/20 text-[#0EA5E9] rounded border border-blue-500/20 transition-all cursor-pointer"
                                        title="Access Logs"
                                      >
                                        <ClipboardList className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteStudent(student.email)}
                                        className="p-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/20 transition-all cursor-pointer"
                                        title="Delete Student"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                      {isAlreadyCrm ? (
                                        <span className="p-1 bg-white/5 text-slate-500 rounded border border-white/5 text-[9px] font-bold font-mono">
                                          CRM
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
                                          className="p-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded border border-purple-500/20 transition-all cursor-pointer text-[9px] font-bold uppercase tracking-wider"
                                          title="Promote to CRM Roster"
                                        >
                                          +CRM
                                        </button>
                                      )}
                                    </div>
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
              );
            })()}

            {/* Sub-tab 2: CRM Associates */}
            {usersSubTab === 'crm' && (
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
            )}

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
                    <option value="Organic Leads">Organic Leads</option>
                    <option value="WhatsApp Marketing Leads">WhatsApp Marketing Leads</option>
                    <option value="Meta WA Leads">Meta WA Leads</option>
                    <option value="META/WA CAMPAIGN LEADS">META/WA CAMPAIGN LEADS</option>
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
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Organic Leads CSV Link</label>
                <input 
                  type="text"
                  value={googleFormSheetUrl}
                  onChange={(e) => handleSaveGoogleFormSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Meta Ads Leads CSV Link</label>
                <input 
                  type="text"
                  value={adsSheetUrl}
                  onChange={(e) => handleSaveAdsSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono text-[#0EA5E9]">
                  Google Sheet Webhook URL (Real-time React Form Writes)
                </label>
                <input 
                  type="text"
                  value={googleSheetWebhookUrl}
                  onChange={(e) => handleSaveWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-[#05092A] border border-[#0EA5E9]/20 rounded-lg px-3 py-2 text-white outline-none focus:border-[#0EA5E9] font-mono text-[11px]"
                />
                <span className="text-[9px] text-slate-500 mt-1 block">
                  Pushes student campaign form submissions directly to this Sheet in real-time.
                </span>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-2.5 leading-relaxed text-slate-350 max-h-[300px] overflow-y-auto">
                <p className="font-bold text-slate-300">How to publish your Sheets for Direct Integration:</p>
                <ol className="list-decimal list-inside space-y-1.5 font-mono text-[10px]">
                  <li>Open your Google Sheet linked with Google Forms / FB Ads.</li>
                  <li>Click <strong className="text-white">File &gt; Share &gt; Publish to web</strong>.</li>
                  <li>Select the targets and choose format: <strong className="text-white">Comma-separated values (.csv)</strong>.</li>
                  <li>Copy and paste the published link in the CSV Link inputs above.</li>
                </ol>

                <p className="font-bold text-[#0EA5E9] text-[10px] uppercase tracking-wider border-t border-white/10 pt-2.5 mt-2">
                  Direct Real-time Form Connection (Apps Script):
                </p>
                <ol className="list-decimal list-inside space-y-2 font-mono text-[10px]">
                  <li>Open your Google Sheet, click <strong className="text-white">Extensions &gt; Apps Script</strong>.</li>
                  <li>Clear default code and paste the following:
                    <pre className="bg-slate-950 p-2 rounded text-brand-cyan text-[9px] overflow-x-auto mt-1 block select-all font-sans font-mono whitespace-pre-wrap leading-tight">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.date || new Date().toLocaleDateString('en-GB'),
    data.name,
    data.phone,
    data.email,
    data.college,
    data.year,
    data.role,
    data.program,
    data.batch,
    data.projectExp,
    data.whyInterested
  ]);
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}`}
                    </pre>
                  </li>
                  <li>Click <strong className="text-white">Deploy &gt; New Deployment</strong>. Select type: <strong className="text-white">Web App</strong>.</li>
                  <li>Set "Execute as" to <strong className="text-white">Me</strong> and "Who has access" to <strong className="text-white">Anyone</strong>.</li>
                  <li>Click Deploy, authorize permissions, copy the Web App URL, and paste it into the Webhook input above.</li>
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
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <h3 className="text-2xl font-extrabold text-white leading-tight tracking-tight max-w-md">
                    {selectedLead.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    selectedLead.status === 'New' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                    selectedLead.status === 'Contacted' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    selectedLead.status === 'Follow Up' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    selectedLead.status === 'Not Connected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    selectedLead.status === 'Enrolled' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  }`}>
                    ● {selectedLead.status || 'New'}
                  </span>
                </div>
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
                  <span className="block text-[8px] font-bold text-cyan-400 uppercase tracking-widest mb-1 font-mono">Pipeline Status</span>
                  <select 
                    value={selectedLead.status}
                    onChange={(e) => setSelectedLead({ ...selectedLead, status: e.target.value })}
                    className="bg-[#05092A] border border-cyan-500/40 rounded-lg px-3 py-1.5 text-xs text-cyan-300 outline-none focus:border-cyan-400 font-bold cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow Up">Follow Up</option>
                    <option value="Not Connected">Not Connected</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>

                {/* Sub-Status Dropdown */}
                <div>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Sub-Status</span>
                  <select 
                    value={selectedLead.subStatus || 'QUALIFIED'}
                    onChange={(e) => setSelectedLead({ ...selectedLead, subStatus: e.target.value })}
                    className="bg-[#05092A] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#2A4BFF] font-semibold cursor-pointer"
                  >
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="DNP">DNP (Did Not Pick)</option>
                    <option value="CB">CB (Call Back)</option>
                    <option value="NI">NI (Not Interested)</option>
                    <option value="Switched Off">Switched Off</option>
                    <option value="CNC">CNC</option>
                    <option value="WFC">WFC</option>
                    <option value="NQ">NQ (Not Qualified)</option>
                    <option value="Already Paid">Already Paid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact details metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono py-2 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{selectedLead.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px] block">Pipeline Status</span>
                <span className={`font-bold uppercase ${
                  selectedLead.status === 'New' ? 'text-cyan-400' :
                  selectedLead.status === 'Contacted' ? 'text-purple-400' :
                  selectedLead.status === 'Follow Up' ? 'text-amber-400' :
                  selectedLead.status === 'Not Connected' ? 'text-rose-400' :
                  selectedLead.status === 'Enrolled' ? 'text-emerald-400' : 'text-slate-300'
                }`}>{selectedLead.status || 'New'}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px] block">Lead Date</span>
                <span className="text-slate-200 font-semibold">{getISTDateTimeString(selectedLead.date)}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px] block">Campaign Type</span>
                <span className="text-[#0EA5E9] font-bold">{selectedLead.type}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px] block">Program Enrolled</span>
                <span className="text-white uppercase truncate block font-bold max-w-[120px]" title={selectedLead.program}>
                  {selectedLead.program
                    ? selectedLead.program.replace(/-/g, ' ')
                    : (selectedLead.remarks?.toLowerCase().includes('ai/ml') || selectedLead.campaign?.toLowerCase().includes('ai ml')
                        ? 'artificial intelligence'
                        : (selectedLead.remarks?.toLowerCase().includes('full stack') || selectedLead.campaign?.toLowerCase().includes('full stack')
                            ? 'full-stack-web'
                            : (selectedLead.remarks?.toLowerCase().includes('cloud') || selectedLead.campaign?.toLowerCase().includes('cloud')
                                ? 'cloud-computing'
                                : (selectedLead.remarks?.toLowerCase().includes('cyber') || selectedLead.campaign?.toLowerCase().includes('cyber')
                                    ? 'cyber-security'
                                    : (selectedLead.remarks?.toLowerCase().includes('digital') || selectedLead.campaign?.toLowerCase().includes('digital')
                                        ? 'digital-marketing-cert'
                                        : 'Unspecified')))))}
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

            {/* Owner BDM, Main Pipeline Status & Handler BDA details banner */}
            <div className="bg-[#050718] border border-white/10 p-4 rounded-xl flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[8px] text-slate-400 uppercase tracking-widest block mb-0.5">Owner (BDM)</span>
                <span className="text-brand-cyan font-bold text-sm">{selectedLead.assignedBDM || 'Unassigned'}</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/5 px-3.5 py-1.5 rounded-lg border border-white/10">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Main Pipeline Status:</span>
                <select
                  value={selectedLead.status || 'New'}
                  onChange={(e) => setSelectedLead({ ...selectedLead, status: e.target.value })}
                  className={`px-3 py-1 rounded-lg text-[11px] font-extrabold font-mono uppercase tracking-wider outline-none cursor-pointer border transition-all ${
                    selectedLead.status === 'New' ? 'bg-[#05092A] text-cyan-400 border-cyan-500/40 focus:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' :
                    selectedLead.status === 'Contacted' ? 'bg-[#05092A] text-purple-400 border-purple-500/40 focus:border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]' :
                    selectedLead.status === 'Follow Up' ? 'bg-[#05092A] text-amber-400 border-amber-500/40 focus:border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                    selectedLead.status === 'Not Connected' ? 'bg-[#05092A] text-rose-400 border-rose-500/40 focus:border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]' :
                    selectedLead.status === 'Enrolled' ? 'bg-[#05092A] text-emerald-400 border-emerald-500/40 focus:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                    'bg-[#05092A] text-slate-300 border-slate-500/40'
                  }`}
                >
                  <option value="New" className="bg-[#0A0E35] text-cyan-400">● New</option>
                  <option value="Contacted" className="bg-[#0A0E35] text-purple-400">● Contacted</option>
                  <option value="Follow Up" className="bg-[#0A0E35] text-amber-400">● Follow Up</option>
                  <option value="Not Connected" className="bg-[#0A0E35] text-rose-400">● Not Connected</option>
                  <option value="Enrolled" className="bg-[#0A0E35] text-emerald-400">● Enrolled</option>
                  <option value="Not Interested" className="bg-[#0A0E35] text-slate-400">● Not Interested</option>
                </select>
              </div>

              <div className="text-right">
                <span className="text-[8px] text-slate-400 uppercase tracking-widest block mb-0.5">Handler (BDA)</span>
                <span className="text-white font-bold text-sm">{selectedLead.assignedBDA || 'Unassigned'}</span>
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
                    {selectedLead.profession || (!['New', 'Contacted', 'Follow Up', 'Not Connected', 'Enrolled', 'Not Interested'].includes(selectedLead.status) ? selectedLead.status : 'Unspecified')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block">Preferred Contact Time</span>
                  <span className="text-white">
                    {selectedLead.preferredContactTime && selectedLead.preferredContactTime !== 'Unspecified' && selectedLead.preferredContactTime !== 'Not Specified'
                      ? selectedLead.preferredContactTime
                      : (selectedLead.message && selectedLead.message.includes('• Contact: ')
                          ? selectedLead.message.split('• Contact: ')[1]?.trim()
                          : 'Unspecified')}
                  </span>
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
                        const val = e.target.value;
                        const attempts = selectedLead.callAttempts || { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' };
                        const newAttempts = { ...attempts, [status.key]: val };
                        
                        let updatedSub = val !== '-' ? val : (['s6', 's5', 's4', 's3', 's2', 's1'].map(k => newAttempts[k]).find(v => v && v !== '-') || 'QUALIFIED');
                        
                        setSelectedLead({
                          ...selectedLead,
                          subStatus: updatedSub,
                          callAttempts: newAttempts
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
                        Logged date: {getISTDateTimeString(log.date)}
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

      {/* -------------------- ADD STUDENT MODAL -------------------- */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#05071F] border border-white/10 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowAddStudentModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Create Student Account</h3>
              <p className="text-[11px] text-slate-400 mt-1">Add a new registered student to the database manually.</p>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={newStudentForm.name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                    placeholder="student@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Contact Number</label>
                  <input 
                    type="text"
                    required
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Password</label>
                  <input 
                    type="password"
                    required
                    value={newStudentForm.password}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, password: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                    placeholder="Set account password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Academic Status</label>
                  <select 
                    value={newStudentForm.status}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, status: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="College Student">College Student</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Graduation Year</label>
                  <input 
                    type="text"
                    value={newStudentForm.gradYear}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, gradYear: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                    placeholder="e.g. 2027"
                  />
                </div>
              </div>

              {newStudentForm.status === 'College Student' && (
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">College / University</label>
                  <input 
                    type="text"
                    value={newStudentForm.college}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, college: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                    placeholder="Enter College Name"
                  />
                </div>
              )}

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Personal Bio</label>
                <textarea 
                  value={newStudentForm.bio}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, bio: e.target.value })}
                  className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF] min-h-[60px]"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">Allocate Enrolled Courses</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto bg-[#0A0E35] p-3 rounded-lg border border-white/10">
                  {COURSES.map(course => {
                    const isChecked = (newStudentForm.activeCourses || []).includes(course.id);
                    return (
                      <label key={course.id} className="flex items-center space-x-2.5 cursor-pointer text-slate-300 hover:text-white select-none">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updatedCourses = e.target.checked 
                              ? [...(newStudentForm.activeCourses || []), course.id]
                              : (newStudentForm.activeCourses || []).filter(c => c !== course.id);
                            setNewStudentForm({ ...newStudentForm, activeCourses: updatedCourses });
                          }}
                          className="rounded text-[#2A4BFF] focus:ring-0 border-white/20 bg-transparent"
                        />
                        <span className="truncate">{course.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2A4BFF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Confirm Add Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- EDIT STUDENT MODAL -------------------- */}
      {showEditStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#05071F] border border-white/10 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <button 
              onClick={() => {
                setShowEditStudentModal(false);
                setSelectedStudent(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Edit Student Details</h3>
              <p className="text-[11px] text-slate-400 mt-1">Modify account parameters, status, and course allocations for {selectedStudent.email}.</p>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Account status</label>
                  <select 
                    value={studentForm.accountStatus}
                    onChange={(e) => setStudentForm({ ...studentForm, accountStatus: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="Active">Active (Console Allowed)</option>
                    <option value="Suspended">Suspended (Access Revoked)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Contact Number</label>
                  <input 
                    type="text"
                    required
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Password</label>
                  <input 
                    type="text"
                    required
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Academic Status</label>
                  <select 
                    value={studentForm.status}
                    onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="College Student">College Student</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Graduation Year</label>
                  <input 
                    type="text"
                    value={studentForm.gradYear}
                    onChange={(e) => setStudentForm({ ...studentForm, gradYear: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
              </div>

              {studentForm.status === 'College Student' && (
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">College / University</label>
                  <input 
                    type="text"
                    value={studentForm.college}
                    onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                    className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Personal Bio</label>
                <textarea 
                  value={studentForm.bio}
                  onChange={(e) => setStudentForm({ ...studentForm, bio: e.target.value })}
                  className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF] min-h-[60px]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">Enrolled Courses (Permissions)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto bg-[#0A0E35] p-3 rounded-lg border border-white/10">
                  {COURSES.map(course => {
                    const isChecked = (studentForm.activeCourses || []).includes(course.id);
                    return (
                      <label key={course.id} className="flex items-center space-x-2.5 cursor-pointer text-slate-300 hover:text-white select-none">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updatedCourses = e.target.checked 
                              ? [...(studentForm.activeCourses || []), course.id]
                              : (studentForm.activeCourses || []).filter(c => c !== course.id);
                            setStudentForm({ ...studentForm, activeCourses: updatedCourses });
                          }}
                          className="rounded text-[#2A4BFF] focus:ring-0 border-white/20 bg-transparent"
                        />
                        <span className="truncate">{course.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- STUDENT ACCESS LOGS MODAL -------------------- */}
      {showStudentLogsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#05071F] border border-white/10 rounded-3xl p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <button 
              onClick={() => {
                setShowStudentLogsModal(false);
                setSelectedStudent(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Student Audit Log Trail</h3>
              <p className="text-[11px] text-slate-400 mt-1">Access security history, session logins, and manual actions for: <strong className="text-white">{selectedStudent.name} ({selectedStudent.email})</strong></p>
            </div>

            <div className="bg-[#0A0E35] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto max-h-[50vh]">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#05071F] border-b border-white/10 sticky top-0">
                    <tr className="text-slate-400 uppercase text-[9px] tracking-wider font-mono">
                      <th className="py-3 px-3">Log ID</th>
                      <th className="py-3 px-3">Timestamp</th>
                      <th className="py-3 px-3">Action Description</th>
                      <th className="py-3 px-3">Client Agent Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.filter(l => l.email.toLowerCase() === selectedStudent.email.toLowerCase()).length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-10 text-slate-500 italic font-mono">
                          No logs recorded for this student account.
                        </td>
                      </tr>
                    ) : (
                      logs
                        .filter(l => l.email.toLowerCase() === selectedStudent.email.toLowerCase())
                        .map((log, i) => (
                          <tr key={log.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{log.id}</td>
                            <td className="py-2.5 px-3 font-mono text-[10px] text-[#0EA5E9]">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
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
          </div>
        </div>
      )}

    </div>
  );
}
