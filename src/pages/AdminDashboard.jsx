import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDbItem, setDbItem } from '../utils/mockDb';
import { 
  BarChart3, LineChart, PieChart, Inbox, Users, DollarSign, Percent, 
  Globe, Star, Trash2, ArrowUpRight, Award, ShieldAlert, Plus, 
  FileSpreadsheet, ClipboardList, CheckSquare, BarChart, Settings, 
  UserPlus, RefreshCw, Eye, Edit2, X, Check, CheckCircle2, ChevronRight,
  TrendingUp, Calendar, AlertCircle, Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // CRM States
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [crmUsers, setCrmUsers] = useState([]);
  
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
  const [showLeadHistoryModal, setShowLeadHistoryModal] = useState(false);
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeadIdx, setSelectedLeadIdx] = useState(null);
  
  // Form Bindings
  const [newLeadForm, setNewLeadForm] = useState({
    name: '', email: '', phone: '', type: 'Inbound', program: 'artificial-intelligence', 
    budget: '₹14,000', college: '', message: '', status: 'New', subStatus: 'QUALIFIED'
  });
  const [importText, setImportText] = useState('');
  const [newUserForm, setNewUserForm] = useState({
    name: '', email: '', role: 'BDA', reportsTo: ''
  });
  const [noteText, setNoteText] = useState('');
  
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
  
  // Bulk actions selection
  const [selectedLeadIndexes, setSelectedLeadIndexes] = useState([]);
  const [bulkBDM, setBulkBDM] = useState('');
  const [bulkBDA, setBulkBDA] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');

  // Selected BDA for detailed sub-status view
  const [selectedBdaName, setSelectedBdaName] = useState('');

  useEffect(() => {
    // Check if logged in user is admin
    const loggedInUser = getDbItem('beyondskills_current_user', null);
    if (!loggedInUser || loggedInUser.email !== 'beyondskills.ai@gmail.com') {
      navigate('/auth');
      return;
    }

    setLeads(getDbItem('beyondskills_leads', []));
    setPayments(getDbItem('beyondskills_payments', []));
    setStudents(getDbItem('beyondskills_users', []));
    
    // Seed default CRM Users if none exist
    let existingCrmUsers = getDbItem('beyondskills_crm_users', []);
    if (existingCrmUsers.length === 0) {
      existingCrmUsers = [
        { name: 'Abhishek Manager', email: 'abhishek.mgr@gradus.live', role: 'BDM', reportsTo: 'Sales Head' },
        { name: 'Khushi Manager', email: 'khushi.mgr@gradus.live', role: 'BDM', reportsTo: 'Sales Head' },
        { name: 'Muskan Gupta', email: 'muskan.g@gradus.live', role: 'BDA', reportsTo: 'Abhishek Manager' },
        { name: 'Deepak Gupta', email: 'deepak.g@gradus.live', role: 'BDA', reportsTo: 'Abhishek Manager' },
        { name: 'Shubham Tyagi', email: 'shubham.t@gradus.live', role: 'BDA', reportsTo: 'Khushi Manager' },
        { name: 'Jatin BDA', email: 'jatin.b@gradus.live', role: 'BDA', reportsTo: 'Khushi Manager' }
      ];
      setDbItem('beyondskills_crm_users', existingCrmUsers);
    }
    setCrmUsers(existingCrmUsers);
    if (existingCrmUsers.length > 0 && !selectedBdaName) {
      const firstBda = existingCrmUsers.find(u => u.role === 'BDA');
      if (firstBda) setSelectedBdaName(firstBda.name);
    }
  }, [navigate]);

  // Save changes helper
  const saveLeadsToDb = (updatedLeads) => {
    setLeads(updatedLeads);
    setDbItem('beyondskills_leads', updatedLeads);
  };

  // Seed demo data helper
  const handleSeedDemoData = () => {
    const demoLeads = [
      { id: 'LD001', name: 'Jatin Rawat', email: 'jatin@gmail.com', phone: '9876543210', date: new Date(Date.now() - 3600000 * 2).toISOString(), type: 'High Intent Leads', program: 'full-stack-web-development', assignedBDM: 'Abhishek Manager', assignedBDA: 'Muskan Gupta', status: 'Follow Up', subStatus: 'CB', message: 'Interested in MERN stack, call at 5 PM', history: [{ note: 'Expressed high intent. Target pricing details sent.', date: new Date().toISOString() }], callAttempts: { s1: true, s2: true, s3: false, s4: false, s5: false, s6: false } },
      { id: 'LD002', name: 'Pooja Sharma', email: 'pooja.s@yahoo.com', phone: '8765432109', date: new Date(Date.now() - 3600000 * 10).toISOString(), type: 'SOP Screening', program: 'ai-data-science', assignedBDM: 'Abhishek Manager', assignedBDA: 'Deepak Gupta', status: 'New', subStatus: 'QUALIFIED', message: 'Wants AI course syllabus', history: [], callAttempts: { s1: false, s2: false, s3: false, s4: false, s5: false, s6: false } },
      { id: 'LD003', name: 'Rohit Verma', email: 'rohit@gradus.live', phone: '7654321098', date: new Date(Date.now() - 3600000 * 25).toISOString(), type: 'Duration', program: 'full-stack-web-development', assignedBDM: 'Khushi Manager', assignedBDA: 'Shubham Tyagi', status: 'Not Connected', subStatus: 'DNP', message: 'No answer', history: [{ note: 'Attempt 1: No answer / Ringing.', date: new Date().toISOString() }], callAttempts: { s1: true, s2: false, s3: false, s4: false, s5: false, s6: false } },
      { id: 'LD004', name: 'Karan Mehra', email: 'karan@gmail.com', phone: '9988776655', date: new Date(Date.now() - 3600000 * 48).toISOString(), type: 'Inbound', program: 'ai-data-science', assignedBDM: 'Khushi Manager', assignedBDA: 'Jatin BDA', status: 'Enrolled', subStatus: 'Already Paid', message: 'Paid via razorpay', history: [{ note: 'Enrollment confirmed, LMS username set.', date: new Date().toISOString() }], callAttempts: { s1: true, s2: true, s3: true, s4: false, s5: false, s6: false } },
      { id: 'LD005', name: 'Sneha Roy', email: 'sneha@outlook.com', phone: '9112233445', date: new Date(Date.now() - 3600000 * 60).toISOString(), type: 'Chat', program: 'ai-data-science', assignedBDM: '', assignedBDA: '', status: 'New', subStatus: 'QUALIFIED', message: 'Chatbot query on payment plans', history: [], callAttempts: { s1: false, s2: false, s3: false, s4: false, s5: false, s6: false } }
    ];
    saveLeadsToDb(demoLeads);
    alert('Demo CRM Leads seeded successfully!');
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
      date: new Date().toISOString(),
      type: newLeadForm.type,
      program: newLeadForm.program,
      assignedBDM: '',
      assignedBDA: '',
      status: newLeadForm.status,
      subStatus: newLeadForm.subStatus,
      message: newLeadForm.message,
      history: [],
      callAttempts: { s1: false, s2: false, s3: false, s4: false, s5: false, s6: false }
    };
    saveLeadsToDb([...leads, leadEntry]);
    setShowAddLeadModal(false);
    setNewLeadForm({
      name: '', email: '', phone: '', type: 'Inbound', program: 'artificial-intelligence', 
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
            date: new Date().toISOString(),
            type: cols[3] || 'Inbound',
            program: cols[4] || 'ai-data-science',
            assignedBDM: '',
            assignedBDA: '',
            status: 'New',
            subStatus: 'QUALIFIED',
            message: cols[5] || 'Bulk imported record',
            history: [],
            callAttempts: { s1: false, s2: false, s3: false, s4: false, s5: false, s6: false }
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

  // Delete lead
  const handleDeleteLeadEntry = (idx) => {
    const updated = leads.filter((_, i) => i !== idx);
    saveLeadsToDb(updated);
  };

  // Edit lead action trigger
  const handleStartEditLead = (lead, idx) => {
    setSelectedLead(lead);
    setSelectedLeadIdx(idx);
    setShowEditLeadModal(true);
  };

  const handleSaveEditLead = (e) => {
    e.preventDefault();
    const updated = [...leads];
    updated[selectedLeadIdx] = selectedLead;
    saveLeadsToDb(updated);
    setShowEditLeadModal(false);
    setSelectedLead(null);
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
    setShowAddUserModal(false);
    setNewUserForm({ name: '', email: '', role: 'BDA', reportsTo: '' });
  };

  const handleRemoveUser = (idx) => {
    const updated = crmUsers.filter((_, i) => i !== idx);
    setCrmUsers(updated);
    setDbItem('beyondskills_crm_users', updated);
  };

  // Call history and attempts logs
  const handleOpenCallLogs = (lead, idx) => {
    setSelectedLead(lead);
    setSelectedLeadIdx(idx);
    setShowLeadHistoryModal(true);
  };

  const handleAddHistoryNote = () => {
    if (!noteText.trim()) return;
    const updated = [...leads];
    if (!updated[selectedLeadIdx].history) updated[selectedLeadIdx].history = [];
    updated[selectedLeadIdx].history.unshift({
      note: noteText,
      date: new Date().toISOString()
    });
    saveLeadsToDb(updated);
    setSelectedLead(updated[selectedLeadIdx]);
    setNoteText('');
  };

  const toggleCallAttempt = (attemptKey) => {
    const updated = [...leads];
    if (!updated[selectedLeadIdx].callAttempts) {
      updated[selectedLeadIdx].callAttempts = { s1: false, s2: false, s3: false, s4: false, s5: false, s6: false };
    }
    updated[selectedLeadIdx].callAttempts[attemptKey] = !updated[selectedLeadIdx].callAttempts[attemptKey];
    saveLeadsToDb(updated);
    setSelectedLead(updated[selectedLeadIdx]);
  };

  // Filtering leads calculation
  const getFilteredLeads = () => {
    return leads.filter((lead, idx) => {
      const matchSearch = lead.name.toLowerCase().includes(leadSearch.toLowerCase()) || 
                          lead.phone.includes(leadSearch) ||
                          lead.id.toLowerCase().includes(leadSearch.toLowerCase());
      const matchStatus = filterStatus ? lead.status === filterStatus : true;
      const matchType = filterType ? lead.type === filterType : true;
      const matchProgram = filterProgram ? lead.program === filterProgram : true;
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

  // Kanban column placements calculations
  const getKanbanLeads = (col) => {
    // Col is 'overdue', 'today', 'tomorrow', 'later'
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    return leads.filter(l => {
      if (l.status !== 'Follow Up') return false;
      const date = l.date ? new Date(l.date) : new Date();
      if (col === 'overdue') return date < today;
      if (col === 'today') return date >= today && date < tomorrow;
      if (col === 'tomorrow') return date >= tomorrow && date < dayAfter;
      if (col === 'later') return date >= dayAfter;
      return false;
    });
  };

  // CRM Statistics calculations
  const statsTotalLeads = leads.length;
  const statsMasterclassLeads = leads.filter(l => l.type === 'Masterclass Leads' || l.type === 'SOP Screening').length;
  const statsConversionRate = statsTotalLeads > 0 ? ((leads.filter(l => l.status === 'Enrolled').length / statsTotalLeads) * 100).toFixed(1) : 0;
  const statsSuccessfulEnrollments = leads.filter(l => l.status === 'Enrolled').length;
  const statsHotLeads = leads.filter(l => l.status === 'Follow Up').length;

  return (
    <div className="text-slate-800 min-h-screen relative pt-24 pb-24 overflow-x-hidden bg-white">
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        
        {/* Banner Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#2A4BFF] uppercase tracking-widest font-mono flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gradus CRM Console</span>
            </span>
            <h1 className="logo-font text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Lead Management & Performance Roster
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleSeedDemoData} 
              className="bg-[#050718] hover:bg-[#0A0E35] text-white border border-white/10 px-4.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Seed Demo Data</span>
            </button>
            <button 
              onClick={() => {
                setLeads([]);
                setDbItem('beyondskills_leads', []);
                alert('All leads database deleted successfully!');
              }}
              className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 px-4.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Leads</span>
            </button>
          </div>
        </div>

        {/* Navigation Sidebar Tabs equivalence */}
        <div className="flex flex-wrap gap-2 mb-8 bg-[#050718]/5 p-1.5 rounded-2xl max-w-fit border border-slate-100 shadow-inner">
          <button 
            onClick={() => setActiveMainTab('analytics')} 
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeMainTab === 'analytics' 
                ? 'bg-[#2A4BFF] text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <BarChart className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveMainTab('leads_manager')} 
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeMainTab === 'leads_manager' 
                ? 'bg-[#2A4BFF] text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Leads Manager</span>
          </button>
          <button 
            onClick={() => setActiveMainTab('allocation')} 
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeMainTab === 'allocation' 
                ? 'bg-[#2A4BFF] text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Assigned & Allocation</span>
          </button>
          <button 
            onClick={() => setActiveMainTab('bda_performance')} 
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeMainTab === 'bda_performance' 
                ? 'bg-[#2A4BFF] text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>BDA Performance</span>
          </button>
          <button 
            onClick={() => setActiveMainTab('users')} 
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeMainTab === 'users' 
                ? 'bg-[#2A4BFF] text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Manage Users</span>
          </button>
        </div>

        {/* -------------------- MAIN TAB 1: DASHBOARD ANALYTICS -------------------- */}
        {activeMainTab === 'analytics' && (
          <div className="space-y-10 animate-fade-in">
            {/* KPI statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between text-white">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-mono">Total CRM Leads</span>
                  <p className="text-3xl font-extrabold font-mono mt-1 text-white">{statsTotalLeads}</p>
                </div>
                <div className="bg-[#2A4BFF]/15 text-[#2A4BFF] p-2.5 rounded-xl border border-[#2A4BFF]/30">
                  <Inbox className="w-5 h-5" />
                </div>
              </div>
              
              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between text-white">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-mono">Masterclass Leads</span>
                  <p className="text-3xl font-extrabold font-mono mt-1 text-white">{statsMasterclassLeads}</p>
                </div>
                <div className="bg-amber-500/15 text-amber-500 p-2.5 rounded-xl border border-amber-500/30">
                  <Star className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between text-white">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-mono">Conversion Ratio</span>
                  <p className="text-3xl font-extrabold font-mono mt-1 text-white">{statsConversionRate}%</p>
                </div>
                <div className="bg-[#0EA5E9]/15 text-[#0EA5E9] p-2.5 rounded-xl border border-[#0EA5E9]/30">
                  <Percent className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between text-white">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-mono">Enrolled Students</span>
                  <p className="text-3xl font-extrabold font-mono mt-1 text-white">{statsSuccessfulEnrollments}</p>
                </div>
                <div className="bg-[#4ADE80]/15 text-[#4ADE80] p-2.5 rounded-xl border border-[#4ADE80]/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between text-white text-right col-span-2 lg:col-span-1">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-mono">Active Hot Leads</span>
                  <p className="text-3xl font-extrabold font-mono mt-1 text-orange-400">{statsHotLeads}</p>
                </div>
                <div className="bg-orange-500/15 text-orange-500 p-2.5 rounded-xl border border-orange-500/30">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Pipeline Distribution & Source Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Funnel chart widget */}
              <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl text-white">
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center space-x-2 border-b border-white/10 pb-4 mb-4">
                  <LineChart className="w-4.5 h-4.5 text-brand-cyan" />
                  <span>Conversion Pipeline progression</span>
                </h3>
                
                <div className="space-y-4 pt-2">
                  {[
                    { name: 'New Leads', count: leads.filter(l => l.status === 'New').length },
                    { name: 'Connected / Contacted', count: leads.filter(l => l.status === 'Contacted').length },
                    { name: 'Follow Up (Pending Dial)', count: leads.filter(l => l.status === 'Follow Up').length },
                    { name: 'Not Connected (DNP/SO)', count: leads.filter(l => l.status === 'Not Connected').length },
                    { name: 'Enrolled (Closed Success)', count: leads.filter(l => l.status === 'Enrolled').length },
                    { name: 'Not Interested (Closed Lost)', count: leads.filter(l => l.status === 'Not Interested').length }
                  ].map((step, idx) => {
                    const percentage = leads.length > 0 ? ((step.count / leads.length) * 100).toFixed(1) : 0;
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
                      { name: 'High Intent Leads', count: leads.filter(l => l.type === 'High Intent Leads').length },
                      { name: 'SOP Screening Candidates', count: leads.filter(l => l.type === 'SOP Screening').length },
                      { name: 'Inbound Campaigns', count: leads.filter(l => l.type === 'Inbound').length },
                      { name: 'Duration Tracking Leads', count: leads.filter(l => l.type === 'Duration').length },
                      { name: 'Consultation Chat logs', count: leads.filter(l => l.type === 'Chat').length }
                    ].map((src, idx) => {
                      const pct = leads.length > 0 ? ((src.count / leads.length) * 100).toFixed(1) : 0;
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
                
                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 text-[10px] text-slate-400 font-mono mt-4 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-brand-cyan inline-block mr-1.5 align-text-bottom" />
                  Real-time pipeline calculations tracking active allocation splits among registered BDMs and BDAs.
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
              <button 
                onClick={() => setLeadsSubTab('tasks')}
                className={`pb-3 font-bold border-b-2 transition-all ${
                  leadsSubTab === 'tasks' ? 'border-[#2A4BFF] text-[#2A4BFF]' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Action Items (Tasks)
              </button>
            </div>

            {/* Subtab 1: Leads List */}
            {leadsSubTab === 'list' && (
              <div className="space-y-6">
                
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
                        <option value="Inbound">Inbound</option>
                        <option value="High Intent Leads">High Intent Leads</option>
                        <option value="SOP Screening">SOP Screening</option>
                        <option value="Duration">Duration</option>
                        <option value="Chat">Chat</option>
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
                {selectedLeadIndexes.length > 0 && (
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
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 text-slate-300 transition-colors">
                            <td className="py-3.5 px-4">
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
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{lead.id}</td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-white">{lead.name}</p>
                              <span className="text-[9px] text-slate-500 font-mono">
                                Date: {new Date(lead.date).toLocaleDateString()}
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
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button 
                                  onClick={() => handleOpenCallLogs(lead, idx)}
                                  className="p-1.5 bg-white/5 hover:bg-[#2A4BFF]/20 text-slate-300 hover:text-white rounded border border-white/10 transition-all cursor-pointer"
                                  title="View Comments & Dial History"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleStartEditLead(lead, idx)}
                                  className="p-1.5 bg-white/5 hover:bg-[#0EA5E9]/20 text-slate-300 hover:text-white rounded border border-white/10 transition-all cursor-pointer"
                                  title="Edit Lead Details"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteLeadEntry(idx)}
                                  className="p-1.5 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded border border-white/10 transition-all cursor-pointer"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
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
                                    title="Edit Lead Date/Status"
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

            {/* Subtab 3: Tasks */}
            {leadsSubTab === 'tasks' && (
              <div className="space-y-6 animate-fade-in text-white">
                
                {/* Summary widgets row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#0A0E35] border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest">Pending Tasks</span>
                      <p className="text-2xl font-bold font-mono mt-1 text-white">{leads.filter(l => l.status === 'Follow Up').length}</p>
                    </div>
                    <ClipboardList className="w-5 h-5 text-[#2A4BFF]" />
                  </div>
                  <div className="bg-[#0A0E35] border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest">Overdue Alerts</span>
                      <p className="text-2xl font-bold font-mono mt-1 text-red-500">
                        {leads.filter(l => l.status === 'Follow Up' && l.date && new Date(l.date) < new Date().setHours(0,0,0,0)).length}
                      </p>
                    </div>
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="bg-[#0A0E35] border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest">Due Today</span>
                      <p className="text-2xl font-bold font-mono mt-1 text-brand-cyan">
                        {leads.filter(l => l.status === 'Follow Up' && l.date && new Date(l.date).toDateString() === new Date().toDateString()).length}
                      </p>
                    </div>
                    <Calendar className="w-5 h-5 text-brand-cyan" />
                  </div>
                  <div className="bg-[#0A0E35] border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest">Completed Actions</span>
                      <p className="text-2xl font-bold font-mono mt-1 text-[#4ADE80]">{leads.filter(l => l.status === 'Enrolled').length}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-[#4ADE80]" />
                  </div>
                </div>

                {/* Tasks list */}
                <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-4">Required BDA Action Items</h3>
                  
                  {leads.filter(l => l.status === 'Follow Up').length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-xs italic font-mono">
                      No pending tasks found. All follow-up actions completed!
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 pb-2 uppercase text-[9px] tracking-wider font-mono">
                            <th className="py-2 px-3">Lead Name</th>
                            <th className="py-2 px-3">Assigned Associate</th>
                            <th className="py-2 px-3">Required Action</th>
                            <th className="py-2 px-3">Follow Up Date</th>
                            <th className="py-2 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.filter(l => l.status === 'Follow Up').map((lead, idx) => (
                            <tr key={idx} className="border-b border-white/5 text-slate-300">
                              <td className="py-2.5 px-3 font-semibold text-white">{lead.name}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-400">{lead.assignedBDA || 'Unassigned'}</td>
                              <td className="py-2.5 px-3 text-brand-cyan">Call Candidate (Substatus: {lead.subStatus})</td>
                              <td className="py-2.5 px-3 font-mono text-slate-400">{lead.date ? new Date(lead.date).toLocaleDateString() : 'N/A'}</td>
                              <td className="py-2.5 px-3 text-right font-mono text-xs">
                                <span className="text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded tracking-wide font-bold">PENDING</span>
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

          </div>
        )}

        {/* -------------------- MAIN TAB 3: ASSIGNED & ALLOCATION -------------------- */}
        {activeMainTab === 'allocation' && (
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
                    <div className="text-center py-10 text-slate-500 text-xs italic font-mono">
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
        {activeMainTab === 'bda_performance' && (
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
                        const filledCalls = totalLeadsForBda.filter(l => l.callAttempts && l.callAttempts[status.key]).length;
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

        {/* -------------------- MAIN TAB 5: MANAGE USERS -------------------- */}
        {activeMainTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-white">
            
            {/* Context manual setup */}
            <div className="bg-[#0A0E35] border border-white/10 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-4">CRM Organizational Roster</h3>
              <p className="text-slate-400 leading-normal">
                Build your team hierarchy here. Accounts of type <strong>BDM</strong> serve as managers, and <strong>BDA</strong> as sales executives.
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
                <span>Add Team Associate</span>
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
                            user.role === 'BDM' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/30' :
                            'bg-[#2A4BFF]/10 text-slate-200 border border-white/10'
                          }`}>
                            {user.role}
                          </span>
                        </td>
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
                    placeholder="e.g. Jatin Rawat"
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
                  placeholder="e.g. jatin@gmail.com"
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
                    <option value="Inbound">Inbound</option>
                    <option value="High Intent Leads">High Intent Leads</option>
                    <option value="SOP Screening">SOP Screening</option>
                    <option value="Duration">Duration</option>
                    <option value="Chat">Chat</option>
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
                placeholder="Rohit Verma, rohit@gmail.com, 9922883344, Inbound, ai-data-science, Needs evening batch&#10;Sneha Roy, sneha@yahoo.com, 8833772211, Chat, full-stack-web-development, Inquired on EMI plans"
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

      {/* -------------------- MODAL: EDIT LEAD -------------------- */}
      {showEditLeadModal && selectedLead && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-white relative">
            <button 
              onClick={() => setShowEditLeadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Edit Lead Details</h3>
            
            <form onSubmit={handleSaveEditLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Prospect Name</label>
                  <input 
                    type="text" required
                    value={selectedLead.name}
                    onChange={(e) => setSelectedLead({ ...selectedLead, name: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Phone</label>
                  <input 
                    type="text" required
                    value={selectedLead.phone}
                    onChange={(e) => setSelectedLead({ ...selectedLead, phone: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Email Address</label>
                <input 
                  type="email" required
                  value={selectedLead.email}
                  onChange={(e) => setSelectedLead({ ...selectedLead, email: e.target.value })}
                  className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Sales Pipeline Status</label>
                  <select 
                    value={selectedLead.status}
                    onChange={(e) => setSelectedLead({ ...selectedLead, status: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
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
                    value={selectedLead.subStatus}
                    onChange={(e) => setSelectedLead({ ...selectedLead, subStatus: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Assign BDM Manager</label>
                  <select 
                    value={selectedLead.assignedBDM || ''}
                    onChange={(e) => setSelectedLead({ ...selectedLead, assignedBDM: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {crmUsers.filter(u => u.role === 'BDM').map((bdm, i) => (
                      <option key={i} value={bdm.name}>{bdm.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Assign BDA Associate</label>
                  <select 
                    value={selectedLead.assignedBDA || ''}
                    onChange={(e) => setSelectedLead({ ...selectedLead, assignedBDA: e.target.value })}
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF] cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {crmUsers.filter(u => u.role === 'BDA').map((bda, i) => (
                      <option key={i} value={bda.name}>{bda.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg"
              >
                Save Details
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
            <h3 className="text-base font-bold uppercase tracking-wider text-brand-cyan">Add Team Associate</h3>
            
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
                className="w-full bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg"
              >
                Confirm Add Associate
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: LEAD HISTORY / COMMENT LOGS -------------------- */}
      {showLeadHistoryModal && selectedLead && (
        <div className="fixed inset-0 z-50 bg-[#050718]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0E35] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6 text-white relative max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => {
                setShowLeadHistoryModal(false);
                setSelectedLead(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div>
              <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest font-mono">Dial history & updates log</span>
              <h3 className="text-base font-extrabold text-white mt-1">{selectedLead.name} ({selectedLead.phone})</h3>
            </div>

            {/* Status Dial checklist */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Call Attempt Checklist</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { label: 'Status 1 Attempt', key: 's1' },
                  { label: 'Status 2 Attempt', key: 's2' },
                  { label: 'Status 3 Attempt', key: 's3' },
                  { label: 'Status 4 Attempt', key: 's4' },
                  { label: 'Status 5 Attempt', key: 's5' },
                  { label: 'Status 6 Attempt', key: 's6' }
                ].map((s) => (
                  <button 
                    key={s.key}
                    type="button"
                    onClick={() => toggleCallAttempt(s.key)}
                    className={`p-2 rounded-lg border text-left font-mono transition-all flex items-center justify-between cursor-pointer ${
                      selectedLead.callAttempts && selectedLead.callAttempts[s.key]
                        ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30 text-[#4ADE80]'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <span>{s.label}</span>
                    {selectedLead.callAttempts && selectedLead.callAttempts[s.key] ? (
                      <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity History Logs */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">History Log Notes</h4>
              
              {/* Add Note form */}
              <div className="flex gap-3 items-end text-xs">
                <div className="flex-grow">
                  <input 
                    type="text" 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter call outcome summary..."
                    className="w-full bg-[#05092A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#2A4BFF]"
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleAddHistoryNote}
                  className="bg-[#2A4BFF] hover:bg-[#2A4BFF]/95 text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Log Note
                </button>
              </div>

              {/* Feed list */}
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                {selectedLead.history && selectedLead.history.length > 0 ? (
                  selectedLead.history.map((log, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 text-xs">
                      <p className="text-slate-200">"{log.note}"</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        Logged on: {new Date(log.date).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-550 text-xs italic font-mono">
                    No timeline notes logged yet for this candidate.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
