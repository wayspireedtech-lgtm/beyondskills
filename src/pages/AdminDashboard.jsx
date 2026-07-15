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
    if (!loggedInUser || loggedInUser.email !== 'beyondskills.ai@gmail.com') {
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

  const handleAllocateCourse = (idx, courseId) => {
    if (!courseId) return;
    const updatedStudents = [...students];
    if (!updatedStudents[idx].activeCourses) {
      updatedStudents[idx].activeCourses = [];
    }
    if (!updatedStudents[idx].activeCourses.includes(courseId)) {
      updatedStudents[idx].activeCourses.push(courseId);
    }
    setStudents(updatedStudents);
    setDbItem('beyondskills_users', updatedStudents);
    alert(`Program ${courseId} manually allocated to student successfully!`);
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
    <div className="text-slate-900 min-h-screen relative pt-24 pb-24 overflow-x-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#2A4BFF] uppercase tracking-widest font-mono">BeyondSkills Admin Center</span>
            <h1 className="logo-font text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Analytics & CRM Console
            </h1>
          </div>
          
          {/* Action Tabs */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveSubTab('analytics')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${activeSubTab === 'analytics' ? 'bg-[#2A4BFF] text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 border border-slate-200/80 text-slate-655 hover:bg-slate-100 hover:text-slate-900'}`}>
              Analytics
            </button>
            <button onClick={() => setActiveSubTab('leads')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${activeSubTab === 'leads' ? 'bg-[#2A4BFF] text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 border border-slate-200/80 text-slate-655 hover:bg-slate-100 hover:text-slate-900'}`}>
              Leads Inbox ({leads.length})
            </button>
            <button onClick={() => setActiveSubTab('students')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${activeSubTab === 'students' ? 'bg-[#2A4BFF] text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 border border-slate-200/80 text-slate-655 hover:bg-slate-100 hover:text-slate-900'}`}>
              Students ({students.length})
            </button>
            <button onClick={() => setActiveSubTab('enrollments')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${activeSubTab === 'enrollments' ? 'bg-[#2A4BFF] text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 border border-slate-200/80 text-slate-655 hover:bg-slate-100 hover:text-slate-900'}`}>
              Enrollments ({payments.length})
            </button>
          </div>
        </div>

        {activeSubTab === 'analytics' ? (
          /* ANALYTICS DASHBOARD VIEW */
          <div className="space-y-10 animate-fade-in">
            
            {/* Stat Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-[#0A0E35]/65 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-mono">Total Revenue</span>
                  <p className="text-2xl font-extrabold font-mono mt-1 text-white">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 p-2.5 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#0A0E35]/65 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-mono">Success Enrollments</span>
                  <p className="text-2xl font-extrabold font-mono mt-1 text-white">{totalEnrollments}</p>
                </div>
                <div className="bg-[#2A4BFF]/10 text-[#2A4BFF] border border-[#2A4BFF]/20 p-2.5 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#0A0E35]/65 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-mono">Payment Success Rate</span>
                  <p className="text-2xl font-extrabold font-mono mt-1 text-white">{paymentSuccessRate}%</p>
                </div>
                <div className="bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20 p-2.5 rounded-xl">
                  <Percent className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#0A0E35]/65 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-mono">Academy Leads</span>
                  <p className="text-2xl font-extrabold font-mono mt-1 text-white">{leads.length}</p>
                </div>
                <div className="bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20 p-2.5 rounded-xl">
                  <Inbox className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Traffic & Conversion Funnels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Conversion Funnel */}
              <div className="bg-[#0A0E35]/65 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <LineChart className="w-4.5 h-4.5 text-brand-cyan" />
                  <span>Interactive Conversion Funnel</span>
                </h3>
                <div className="space-y-3.5 pt-4">
                  {funnelSteps.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-300 font-mono">{step.name}</span>
                        <span className="font-mono text-white font-bold">{step.value} ({step.pct})</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                        <div className="bg-gradient-to-r from-[#2A4BFF] to-[#0EA5E9] h-full" style={{ width: step.pct }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Source Breakdown */}
              <div className="bg-[#0A0E35]/65 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <PieChart className="w-4.5 h-4.5 text-brand-cyan" />
                  <span>Lead Attribution Sources</span>
                </h3>
                <div className="space-y-3.5 pt-4 text-xs">
                  {leadSources.map((src, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-white/10 pb-2 text-slate-300">
                      <span className="text-slate-400 flex items-center">
                        <Globe className="w-4 h-4 text-[#2A4BFF] mr-2" />
                        {src.name}
                      </span>
                      <span className="font-bold text-white">{src.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Mentor Performance and Engagement Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Mentor Stats */}
              <div className="lg:col-span-2 bg-[#0A0E35]/65 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Mentor Performance Ratings</h3>
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 pb-2 uppercase text-[9px] font-mono tracking-widest">
                      <th className="py-2">Mentor Name</th>
                      <th className="py-2">Course Module</th>
                      <th className="py-2 text-center">Avg Rating</th>
                      <th className="py-2 text-right">Reviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentorPerformance.map((m, idx) => (
                      <tr key={idx} className="border-b border-white/10 last:border-b-0 text-slate-300">
                        <td className="py-2.5 font-semibold text-white">{m.name}</td>
                        <td className="py-2.5 text-slate-400">{m.course}</td>
                        <td className="py-2.5 text-center font-bold text-[#0EA5E9] flex items-center justify-center">
                          <Star className="w-3.5 h-3.5 fill-current mr-1 text-amber-400" />
                          <span>{m.rating}</span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-400">{m.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Engagement & Completion Rates */}
              <div className="bg-[#0A0E35]/65 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Syllabus Progress Metrics</h3>
                  <div className="mt-6 text-center space-y-2">
                    <span className="text-4xl font-extrabold font-mono text-white">{completionRate}%</span>
                    <p className="text-xs text-slate-400">Course Completion Rate</p>
                  </div>
                  <div className="mt-6 text-center space-y-2">
                    <span className="text-4xl font-extrabold font-mono text-white">{engagementRate}%</span>
                    <p className="text-xs text-slate-400">Active Weekly Interaction Rate</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 text-[10px] text-slate-500 leading-normal text-justify font-mono">
                  Measurements reflect student ticks in recorded lecture modules and mock exam assessment logs.
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* LEADS CRM INBOX VIEW */
          activeSubTab === 'leads' ? (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-2 border-[#2A4BFF] pl-3">Lead Submission Inbox</h3>
              
              {leads.length === 0 ? (
                <div className="bg-[#0A0E35]/65 border border-white/10 p-8 rounded-2xl text-center max-w-md mx-auto space-y-4">
                  <Inbox className="w-10 h-10 text-slate-500 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Leads Inbox is Empty</h4>
                  <p className="text-xs text-slate-400">No new client consultation or academy registration request found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {leads.map((lead, idx) => (
                    <div key={idx} className="bg-[#0A0E35]/65 border border-white/10 p-6 rounded-xl relative space-y-4 shadow-xl">
                      
                      {/* Badge header */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded tracking-widest ${lead.type === 'Agency' ? 'bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#0EA5E9]' : 'bg-[#2A4BFF]/10 border border-[#2A4BFF]/30 text-[#2A4BFF]'}`}>
                          {lead.type} Request
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                          <span>{new Date(lead.date).toLocaleDateString()} {new Date(lead.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <button onClick={() => handleDeleteLead(idx)} className="text-slate-400 hover:text-red-500 p-1 rounded focus:outline-none transition-colors cursor-pointer" title="Delete Inquiry">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Metadata fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Contact Name:</span>
                          <span className="text-white font-medium">{lead.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Email Address:</span>
                          <span className="text-white font-mono">{lead.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Phone Number:</span>
                          <span className="text-white font-mono">{lead.phone}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs border-t border-white/10 pt-3">
                        {lead.type === 'Agency' ? (
                          <>
                            <div>
                              <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Company Name:</span>
                              <span className="text-white">{lead.company}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Service Category:</span>
                              <span className="text-white">{lead.service}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Project Budget:</span>
                              <span className="text-brand-cyan font-bold font-mono">{lead.budget}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">College / Org:</span>
                              <span className="text-white">{lead.college}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Interest Program:</span>
                              <span className="text-white uppercase font-mono">{lead.course}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Current Status:</span>
                              <span className="text-white">{lead.status}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Messages briefs */}
                      {lead.message && (
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-xs text-slate-200">
                          <strong className="text-[9px] text-slate-400 block uppercase font-mono tracking-wider mb-1">Message Content:</strong>
                          <p className="italic">"{lead.message}"</p>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeSubTab === 'students' ? (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-2 border-[#2A4BFF] pl-3">Registered Students & LMS Credentials</h3>
              
              {students.length === 0 ? (
                <div className="bg-[#0A0E35]/65 border border-white/10 p-8 rounded-2xl text-center max-w-md mx-auto space-y-4">
                  <Users className="w-10 h-10 text-slate-500 mx-auto" />
                  <h4 className="font-bold text-white text-sm">No Students Registered</h4>
                  <p className="text-xs text-slate-400">No student accounts have been created in the database yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {students.map((student, idx) => (
                    <div key={idx} className="bg-[#0A0E35]/65 border border-white/10 p-6 rounded-xl space-y-4 shadow-xl">
                      
                      {/* Header with Name & Student ID */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3 gap-2">
                        <div>
                          <h4 className="text-sm font-extrabold text-white">{student.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {student.studentId || 'N/A'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold tracking-widest text-[#4ADE80] bg-[#4ADE80]/15 border border-[#4ADE80]/30 px-2.5 py-0.5 rounded uppercase">
                            Active Student
                          </span>
                        </div>
                      </div>

                      {/* Contact & Allocated Courses info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Email Address:</span>
                          <span className="text-slate-200 font-mono font-medium">{student.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Phone Number:</span>
                          <span className="text-slate-200 font-mono">{student.phone || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Enrolled Program(s):</span>
                          <span className="text-white uppercase font-mono font-semibold">
                            {student.activeCourses && student.activeCourses.length > 0 
                              ? student.activeCourses.join(', ') 
                              : 'None'}
                          </span>
                        </div>
                      </div>

                      {/* Manual Course Allocation Option */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs">
                        <div>
                          <span className="text-slate-400 block uppercase text-[9px] font-bold font-mono tracking-wider">Manual Course Management:</span>
                          <p className="text-[11px] text-slate-400 mt-0.5">Assign a new course program to this student's profile directly.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select 
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAllocateCourse(idx, e.target.value);
                                e.target.value = ''; // Reset select
                              }
                            }}
                            className="bg-[#0A0E35] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-brand-cyan cursor-pointer"
                          >
                            <option value="">-- Choose Course to Allocate --</option>
                            <option value="artificial-intelligence">Artificial Intelligence</option>
                            <option value="machine-learning">Machine Learning</option>
                            <option value="data-science-analytics">Data Science & Analytics</option>
                            <option value="full-stack-web">Full Stack Web (MERN)</option>
                            <option value="stock-market">Stock Market</option>
                            <option value="digital-marketing-cert">Digital Marketing</option>
                            <option value="hr-mgmt">HR Management</option>
                            <option value="cyber-security">Cyber Security</option>
                            <option value="cloud-computing">Cloud Computing</option>
                          </select>
                        </div>
                      </div>

                      {/* LMS Credentials Setup Section */}
                      <div className="bg-slate-950/60 border border-white/5 p-4 rounded-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Wayspire LMS Credentials</span>
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
                              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">LMS Username / Email</label>
                              <input 
                                type="text" 
                                value={lmsForm.lmsUsername}
                                onChange={(e) => setLmsForm({ ...lmsForm, lmsUsername: e.target.value })}
                                placeholder="e.g. jatin@gmail.com"
                                className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">LMS Password</label>
                              <input 
                                type="text" 
                                value={lmsForm.lmsPassword}
                                onChange={(e) => setLmsForm({ ...lmsForm, lmsPassword: e.target.value })}
                                placeholder="e.g. Wayspire@2026"
                                className="w-full bg-[#0A0E35] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2A4BFF]"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                type="button"
                                onClick={() => handleSaveLmsCredentials(idx)}
                                className="flex-grow bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-black font-bold py-2 rounded-lg text-xs uppercase cursor-pointer"
                              >
                                Save
                              </button>
                              <button 
                                type="button"
                                onClick={() => setEditingStudentIdx(null)}
                                className="px-3 bg-white/10 hover:bg-white/15 text-slate-300 font-bold py-2 rounded-lg text-xs uppercase cursor-pointer"
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
                                <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Username</span>
                                <span className="text-xs font-mono text-slate-200 font-semibold">{student.lmsUsername || 'Not Configured'}</span>
                              </div>
                              <div>
                                <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Password</span>
                                <span className="text-xs font-mono text-slate-200 font-semibold">{student.lmsPassword || 'Not Configured'}</span>
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => startEditingLms(idx, student)}
                              className="bg-[#2A4BFF] hover:brightness-110 text-white text-[10px] font-bold px-4 py-2 rounded-lg uppercase tracking-wider self-start sm:self-center transition-colors cursor-pointer"
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
          ) : (
            /* ENROLLMENTS VIEW */
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-2 border-[#2A4BFF] pl-3">Successful Course Enrollments</h3>
              
              {payments.length === 0 ? (
                <div className="bg-[#0A0E35]/65 border border-white/10 p-8 rounded-2xl text-center max-w-md mx-auto space-y-4">
                  <Users className="w-10 h-10 text-slate-500 mx-auto" />
                  <h4 className="font-bold text-white text-sm">No Enrollments Found</h4>
                  <p className="text-xs text-slate-400">No students have purchased any certification program yet.</p>
                </div>
              ) : (
                <div className="bg-[#0A0E35]/65 border border-white/10 rounded-2xl p-6 shadow-xl overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 pb-2 uppercase text-[9px] tracking-wider font-mono">
                        <th className="py-3 px-4">Student ID</th>
                        <th className="py-3 px-4">Name / Email</th>
                        <th className="py-3 px-4">Course Enrolled</th>
                        <th className="py-3 px-4">Format</th>
                        <th className="py-3 px-4">Payment Ref</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p, idx) => {
                        const users = getDbItem('beyondskills_users', []);
                        const stu = users.find(u => u.studentId === p.studentId || u.email === p.email);
                        return (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 text-slate-350 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{p.studentId || 'N/A'}</td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-white">{stu?.name || p.email.split('@')[0]}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.email}</p>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-white uppercase">{p.courseId?.replace(/-/g, ' ')}</td>
                            <td className="py-3.5 px-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.mode === 'self-paced' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-[#2A4BFF]/10 text-[#2A4BFF] border border-[#2A4BFF]/20'}`}>
                                {p.mode === 'self-paced' ? 'Self Paced' : 'Mentor Led'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-450">{p.paymentId || 'N/A'}</td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-brand-cyan">₹{p.amount?.toLocaleString()}</td>
                            <td className="py-3.5 px-4 text-right text-slate-450 font-mono">
                              {new Date(p.date).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        )}

      </div>
    </div>
  );
}
