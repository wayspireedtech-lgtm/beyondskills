import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDbItem, setDbItem } from '../utils/mockDb';
import { BarChart3, LineChart, PieChart, Inbox, Users, DollarSign, Percent, Globe, Star, Trash2, ArrowUpRight, Award, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('analytics');

  const [editingStudentIdx, setEditingStudentIdx] = useState(null);
  const [lmsForm, setLmsForm] = useState({ lmsUsername: '', lmsPassword: '' });

  useEffect(() => {
    // Check if logged in user is admin
    const loggedInUser = getDbItem('beyondskills_current_user', null);
    if (!loggedInUser || loggedInUser.email !== 'admin@beyondskills.in') {
      navigate('/auth');
      return;
    }

    setLeads(getDbItem('beyondskills_leads', []));
    setPayments(getDbItem('beyondskills_payments', []));
    setStudents(getDbItem('beyondskills_users', []));
  }, [navigate]);

  const handleDeleteLead = (idxToDelete) => {
    const updatedLeads = leads.filter((_, idx) => idx !== idxToDelete);
    setLeads(updatedLeads);
    setDbItem('beyondskills_leads', updatedLeads);
  };

  const startEditingLms = (idx, student) => {
    setEditingStudentIdx(idx);
    setLmsForm({
      lmsUsername: student.lmsUsername || student.email || '',
      lmsPassword: student.lmsPassword || ''
    });
  };

  const handleSaveLmsCredentials = (idx) => {
    const updatedStudents = [...students];
    updatedStudents[idx] = {
      ...updatedStudents[idx],
      lmsUsername: lmsForm.lmsUsername,
      lmsPassword: lmsForm.lmsPassword
    };
    setStudents(updatedStudents);
    setDbItem('beyondskills_users', updatedStudents);
    setEditingStudentIdx(null);
    alert('Wayspire LMS credentials saved and allocated successfully!');
  };

  // Calculations for stats
  const totalRevenue = payments.reduce((acc, p) => acc + (p.status === 'Success' ? p.amount : 0), 0);
  const totalEnrollments = payments.filter(p => p.status === 'Success').length;
  
  // Analytics Mock Data
  const paymentSuccessRate = 96.2;
  const engagementRate = 78.4;
  const completionRate = 42.5;

  const funnelSteps = [
    { name: 'Website Visitors', value: '12,500', pct: '100%' },
    { name: 'Syllabus Page Views', value: '4,200', pct: '33.6%' },
    { name: 'Initiated Checkout', value: '850', pct: '6.8%' },
    { name: 'Enrolled Students', value: totalEnrollments + 120, pct: '1.2%' } // Combined mock + active
  ];

  const leadSources = [
    { name: 'Google Search Ads', value: 45 },
    { name: 'Meta Performance Ads', value: 30 },
    { name: 'Organic SEO', value: 15 },
    { name: 'Direct Referrals', value: 10 }
  ];

  const mentorPerformance = [
    { name: 'Dr. Aris Rawat', course: 'AI & Data Science', rating: 4.8, count: 58 },
    { name: 'Vikram Aditya', course: 'Full Stack Development', rating: 4.7, count: 72 },
    { name: 'Kunal Sen', course: 'Digital Marketing', rating: 4.6, count: 35 },
    { name: 'Meenakshi Iyer', course: 'HR Management', rating: 4.5, count: 20 }
  ];

  return (
    <div className="text-slate-900 min-h-screen relative pt-12 pb-24">
      {/* Background glow */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-cyan uppercase">BeyondSkills Admin Center</span>
            <h1 className="logo-font text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Analytics & CRM Console
            </h1>
          </div>
          
          {/* Action Tabs */}
          <div className="flex space-x-2">
            <button onClick={() => setActiveSubTab('analytics')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${activeSubTab === 'analytics' ? 'bg-brand-cyan text-black' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'}`}>
              Analytics Report
            </button>
            <button onClick={() => setActiveSubTab('leads')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${activeSubTab === 'leads' ? 'bg-brand-cyan text-black' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'}`}>
              Leads Inbox ({leads.length})
            </button>
            <button onClick={() => setActiveSubTab('students')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${activeSubTab === 'students' ? 'bg-brand-cyan text-black' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'}`}>
              Students & LMS ({students.length})
            </button>
          </div>
        </div>

        {activeSubTab === 'analytics' ? (
          /* ANALYTICS DASHBOARD VIEW */
          <div className="space-y-10 animate-fade-in">
            
            {/* Stat Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Total Revenue</span>
                  <p className="text-2xl font-extrabold font-mono mt-1">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-[#4ADE80]/15 text-[#4ADE80] p-2.5 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Success Enrollments</span>
                  <p className="text-2xl font-extrabold font-mono mt-1">{totalEnrollments}</p>
                </div>
                <div className="bg-brand-purple/15 text-brand-purple p-2.5 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Payment Success Rate</span>
                  <p className="text-2xl font-extrabold font-mono mt-1">{paymentSuccessRate}%</p>
                </div>
                <div className="bg-[#60A5FA]/15 text-[#60A5FA] p-2.5 rounded-xl">
                  <Percent className="w-5 h-5" />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Academy Leads</span>
                  <p className="text-2xl font-extrabold font-mono mt-1">{leads.length}</p>
                </div>
                <div className="bg-brand-cyan/15 text-brand-cyan p-2.5 rounded-xl">
                  <Inbox className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Traffic & Conversion Funnels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Conversion Funnel */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <LineChart className="w-4.5 h-4.5 text-brand-cyan" />
                  <span>Interactive Conversion Funnel</span>
                </h3>
                <div className="space-y-3.5 pt-4">
                  {funnelSteps.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-700 font-medium">{step.name}</span>
                        <span className="font-mono text-slate-900 font-bold">{step.value} ({step.pct})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-brand-purple to-brand-cyan h-full" style={{ width: step.pct }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Source Breakdown */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <PieChart className="w-4.5 h-4.5 text-brand-cyan" />
                  <span>Lead Attribution Sources</span>
                </h3>
                <div className="space-y-3.5 pt-4 text-xs">
                  {leadSources.map((src, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 flex items-center">
                        <Globe className="w-4 h-4 text-brand-purple mr-2" />
                        {src.name}
                      </span>
                      <span className="font-bold text-slate-900">{src.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Mentor Performance and Engagement Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Mentor Stats */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Mentor Performance Ratings</h3>
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200/60 text-slate-500 pb-2">
                      <th className="py-2">Mentor Name</th>
                      <th className="py-2">Course Module</th>
                      <th className="py-2 text-center">Avg Rating</th>
                      <th className="py-2 text-right">Reviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentorPerformance.map((m, idx) => (
                      <tr key={idx} className="border-b border-slate-200/60 last:border-b-0 text-slate-700">
                        <td className="py-2.5 font-semibold text-slate-900">{m.name}</td>
                        <td className="py-2.5 text-slate-500">{m.course}</td>
                        <td className="py-2.5 text-center font-bold text-brand-cyan flex items-center justify-center">
                          <Star className="w-3.5 h-3.5 fill-current mr-1" />
                          <span>{m.rating}</span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-500">{m.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Engagement & Completion Rates */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Syllabus Progress Metrics</h3>
                  <div className="mt-6 text-center space-y-2">
                    <span className="text-4xl font-extrabold font-mono text-slate-900">{completionRate}%</span>
                    <p className="text-xs text-slate-500">Course Completion Rate</p>
                  </div>
                  <div className="mt-6 text-center space-y-2">
                    <span className="text-4xl font-extrabold font-mono text-slate-900">{engagementRate}%</span>
                    <p className="text-xs text-slate-500">Active Weekly Interaction Rate</p>
                  </div>
                </div>
                <div className="border-t border-slate-200/60 pt-4 text-[10px] text-slate-500 leading-normal text-justify">
                  Measurements reflect student ticks in recorded lecture modules and mock exam assessment logs.
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* LEADS CRM INBOX VIEW */
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-2 border-brand-cyan pl-3">Lead Submission Inbox</h3>
            
            {leads.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center max-w-md mx-auto space-y-4">
                <Inbox className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Leads Inbox is Empty</h4>
                <p className="text-xs text-slate-500">No new client consultation or academy registration request found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {leads.map((lead, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-xl border border-slate-200 relative space-y-4">
                    
                    {/* Badge header */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded tracking-widest ${lead.type === 'Agency' ? 'bg-[#3399FF]/10 border border-[#3399FF]/30 text-[#3399FF]' : 'bg-brand-purple/10 border border-brand-purple/30 text-brand-purple'}`}>
                        {lead.type} Request
                      </span>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                        <span>{new Date(lead.date).toLocaleDateString()} {new Date(lead.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <button onClick={() => handleDeleteLead(idx)} className="text-slate-500 hover:text-brand-blue p-1 rounded focus:outline-none transition-colors" title="Delete Inquiry">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Contact Name:</span>
                        <span className="text-slate-900 font-medium">{lead.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Email Address:</span>
                        <span className="text-slate-900 font-mono">{lead.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Phone Number:</span>
                        <span className="text-slate-900 font-mono">{lead.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs border-t border-slate-200/60 pt-3">
                      {lead.type === 'Agency' ? (
                        <>
                          <div>
                            <span className="text-slate-500 block uppercase text-[9px] font-bold">Company Name:</span>
                            <span className="text-slate-900">{lead.company}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase text-[9px] font-bold">Service Category:</span>
                            <span className="text-slate-900">{lead.service}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase text-[9px] font-bold">Project Budget:</span>
                            <span className="text-brand-cyan font-bold font-mono">{lead.budget}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-slate-500 block uppercase text-[9px] font-bold">College / Org:</span>
                            <span className="text-slate-900">{lead.college}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase text-[9px] font-bold">Interest Program:</span>
                            <span className="text-slate-900 uppercase font-mono">{lead.course}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase text-[9px] font-bold">Current Status:</span>
                            <span className="text-slate-900">{lead.status}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Messages briefs */}
                    {lead.message && (
                      <div className="bg-slate-100 border border-slate-200/60 p-3 rounded-lg text-xs text-slate-700">
                        <strong className="text-[9px] text-slate-500 block uppercase mb-1">Message Content:</strong>
                        <p className="italic">"{lead.message}"</p>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'students' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-2 border-brand-cyan pl-3">Registered Students & LMS Credentials</h3>
            
            {students.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center max-w-md mx-auto space-y-4">
                <Users className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">No Students Registered</h4>
                <p className="text-xs text-slate-550">No student accounts have been created in the database yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {students.map((student, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-xl border border-slate-200 space-y-4">
                    
                    {/* Header with Name & Student ID */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">{student.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {student.studentId || 'N/A'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold tracking-widest text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-2.5 py-0.5 rounded uppercase">
                          Active Student
                        </span>
                      </div>
                    </div>

                    {/* Contact & Allocated Courses info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Email Address:</span>
                        <span className="text-slate-900 font-mono font-medium">{student.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Phone Number:</span>
                        <span className="text-slate-900 font-mono">{student.phone || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Enrolled Program(s):</span>
                        <span className="text-slate-900 uppercase font-mono font-semibold">
                          {student.activeCourses && student.activeCourses.length > 0 
                            ? student.activeCourses.join(', ') 
                            : 'None'}
                        </span>
                      </div>
                    </div>

                    {/* LMS Credentials Setup Section */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wayspire LMS Credentials</span>
                        {student.lmsUsername && student.lmsPassword ? (
                          <span className="text-[8px] font-bold text-[#4ADE80] uppercase bg-[#4ADE80]/15 px-2 py-0.5 rounded tracking-widest border border-[#4ADE80]/20">Active</span>
                        ) : (
                          <span className="text-[8px] font-bold text-amber-500 uppercase bg-amber-500/15 px-2 py-0.5 rounded tracking-widest border border-amber-500/20">Pending Upload</span>
                        )}
                      </div>

                      {editingStudentIdx === idx ? (
                        /* Editing LMS Form */
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">LMS Username / Email</label>
                            <input 
                              type="text" 
                              value={lmsForm.lmsUsername}
                              onChange={(e) => setLmsForm({ ...lmsForm, lmsUsername: e.target.value })}
                              placeholder="e.g. jatin@gmail.com"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-brand-purple"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">LMS Password</label>
                            <input 
                              type="text" 
                              value={lmsForm.lmsPassword}
                              onChange={(e) => setLmsForm({ ...lmsForm, lmsPassword: e.target.value })}
                              placeholder="e.g. Wayspire@2026"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-brand-purple"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              type="button"
                              onClick={() => handleSaveLmsCredentials(idx)}
                              className="flex-grow bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-black font-bold py-2 rounded-lg text-xs uppercase"
                            >
                              Save
                            </button>
                            <button 
                              type="button"
                              onClick={() => setEditingStudentIdx(null)}
                              className="px-3 bg-slate-800 hover:bg-slate-750 text-slate-400 font-bold py-2 rounded-lg text-xs uppercase"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Read-only Credentials Display */
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
                            <div>
                              <span className="text-[8px] text-slate-500 uppercase tracking-wider block">Username</span>
                              <span className="text-xs font-mono text-slate-300 font-semibold">{student.lmsUsername || 'Not Configured'}</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-slate-500 uppercase tracking-wider block">Password</span>
                              <span className="text-xs font-mono text-slate-300 font-semibold">{student.lmsPassword || 'Not Configured'}</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => startEditingLms(idx, student)}
                            className="bg-brand-purple hover:bg-brand-purple/90 text-white text-[10px] font-bold px-4 py-2 rounded-lg uppercase tracking-wider self-start sm:self-center transition-colors"
                          >
                            Set Credentials
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
