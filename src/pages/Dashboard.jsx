import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDbItem, setDbItem } from '../utils/mockDb';
import { BookOpen, Video, Calendar, Award, User, Clock, CheckCircle, ExternalLink, Download, ShieldCheck, PlayCircle, Menu, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_LECTURES = {
  'ai-ml-ds': [
    { id: 'ai-1', title: 'Lecture 1: Python Basics & Pandas Data Manipulation', duration: '45 mins', comp: true },
    { id: 'ai-2', title: 'Lecture 2: Scikit-Learn: Regression Models', duration: '55 mins', comp: false },
    { id: 'ai-3', title: 'Lecture 3: Neural Networks Fundamentals & Keras layers', duration: '60 mins', comp: false },
    { id: 'ai-4', title: 'Lecture 4: Data Storytelling & Portfolio Dashboard Project', duration: '50 mins', comp: false }
  ],
  'full-stack-web': [
    { id: 'fs-1', title: 'Lecture 1: React Components & State Management Hooks', duration: '50 mins', comp: true },
    { id: 'fs-2', title: 'Lecture 2: React Router & Single Page Application builds', duration: '45 mins', comp: false },
    { id: 'fs-3', title: 'Lecture 3: REST API creation in Node & Express servers', duration: '55 mins', comp: false },
    { id: 'fs-4', title: 'Lecture 4: MongoDB Atlas cluster setup & Mongoose operations', duration: '60 mins', comp: false }
  ],
  'digital-marketing-cert': [
    { id: 'dm-1', title: 'Lecture 1: Meta Pixels & Conversion tracking setups', duration: '40 mins', comp: true },
    { id: 'dm-2', title: 'Lecture 2: Google Search Ad structures & targeting campaigns', duration: '50 mins', comp: false },
    { id: 'dm-3', title: 'Lecture 3: Copywriting, headlines, and landing page wireframes', duration: '35 mins', comp: false }
  ]
};

const LIVE_MEETINGS = [
  { topic: 'Weekly Live Project Review & Doubt Resolution', date: 'Next Saturday', time: '10:00 AM - 12:00 PM', expert: 'Vikram Aditya', link: 'https://zoom.us/mock' },
  { topic: 'HR Placement Prep, Resumes & ATS Screening Tricks', date: 'Next Wednesday', time: '06:00 PM - 07:30 PM', expert: 'Meenakshi Iyer', link: 'https://zoom.us/mock' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('recorded');
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  
  // Mobile sidebar states
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loggedInUser = getDbItem('beyondskills_current_user', null);
    if (!loggedInUser) {
      navigate('/auth');
      return;
    }
    setUser(loggedInUser);

    // Default to first active course
    if (loggedInUser.activeCourses && loggedInUser.activeCourses.length > 0) {
      const firstCourse = loggedInUser.activeCourses[0];
      setActiveCourseId(firstCourse);
      
      // Load or set mock lectures progress
      const storageKey = `lectures_progress_${loggedInUser.studentId}_${firstCourse}`;
      const savedProgress = getDbItem(storageKey, SAMPLE_LECTURES[firstCourse] || [
        { id: 'c3-1', title: 'Lecture 1: Fundamental Concepts & Setup', duration: '35 mins', comp: true },
        { id: 'c3-2', title: 'Lecture 2: Operational Methods & Live Demo', duration: '45 mins', comp: false },
        { id: 'c3-3', title: 'Lecture 3: Course Summary & Assessment', duration: '50 mins', comp: false }
      ]);
      setLectures(savedProgress);
      if (savedProgress.length > 0) {
        setActiveVideo(savedProgress[0]);
      }
    }
  }, []);

  const handleToggleLecture = (lecId) => {
    if (!user || !activeCourseId) return;

    const updated = lectures.map(l => l.id === lecId ? { ...l, comp: !l.comp } : l);
    setLectures(updated);
    
    const storageKey = `lectures_progress_${user.studentId}_${activeCourseId}`;
    setDbItem(storageKey, updated);
  };

  const handleSelectVideo = (lec) => {
    setActiveVideo(lec);
  };

  const handleGenerateCertificate = () => {
    if (!user || !activeCourseId) return;

    const incomplete = lectures.some(l => !l.comp);
    if (incomplete) {
      alert('You must mark all lectures as completed to trigger certificate generation!');
      return;
    }

    // Add to digital certificates DB
    const certs = getDbItem('beyondskills_certificates', []);
    const newCertId = `CERT-BS-${activeCourseId.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Check if certificate already exists
    const exists = certs.find(c => c.studentId === user.studentId && c.courseId === activeCourseId);
    if (exists) {
      alert('Certificate already generated! Check the Certificates & Badges section.');
      setActiveTab('certificates');
      return;
    }

    const courseTitleMap = {
      'ai-ml-ds': 'Artificial Intelligence, Machine Learning & Data Science',
      'full-stack-web': 'Full Stack Web Development (MERN)',
      'digital-marketing-cert': 'Performance Digital Marketing & Ads'
    };

    const newRecord = {
      id: newCertId,
      studentName: user.name,
      studentId: user.studentId,
      courseId: activeCourseId,
      courseTitle: courseTitleMap[activeCourseId] || 'BeyondSkills Academy Graduate Cert',
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      verificationUrl: `${window.location.origin}/verify?certId=${newCertId}`
    };

    certs.push(newRecord);
    setDbItem('beyondskills_certificates', certs);

    confetti({
      particleCount: 200,
      spread: 90
    });

    alert(`Congratulations! Your certificate ${newCertId} has been successfully generated.`);
    setActiveTab('certificates');
  };

  // Fetch certificates matching the student
  const studentCerts = getDbItem('beyondskills_certificates', []).filter(c => c.studentId === (user?.studentId || ''));

  if (!user) return null;

  return (
    <div className="text-slate-900 min-h-screen flex flex-col md:flex-row relative">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-slate-50/70 border border-slate-200/40 border-r border-slate-200 md:min-h-screen flex flex-col justify-between p-6">
        <div>
          {/* User profile brief */}
          <div className="border-b border-slate-200/60 pb-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-brand-purple/10 border border-brand-purple/30 text-brand-purple p-2 rounded-xl">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-none">{user.name}</h4>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">ID: {user.studentId}</span>
              </div>
            </div>
          </div>

          <nav className="space-y-2 text-xs">
            <button onClick={() => setActiveTab('recorded')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors ${activeTab === 'recorded' ? 'bg-brand-purple text-black' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
              <Video className="w-4 h-4" />
              <span>Recorded Area</span>
            </button>

            <button onClick={() => setActiveTab('live')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors ${activeTab === 'live' ? 'bg-brand-purple text-black' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
              <Calendar className="w-4 h-4" />
              <span>Live Schedule</span>
            </button>

            <button onClick={() => setActiveTab('certificates')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors ${activeTab === 'certificates' ? 'bg-brand-purple text-black' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
              <Award className="w-4 h-4" />
              <span>Certificates</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200/60 text-[10px] text-slate-500 leading-normal">
          BeyondSkills Student Workspace V1.0. Verified Sandbox Session.
        </div>
      </aside>

      {/* Main Workspace content */}
      <main className="flex-grow p-6 sm:p-10 relative">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

        <div className="z-10 relative space-y-8">
          
          {/* Dashboard Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-6 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-purple uppercase">Student Study Dashboard</span>
              <h1 className="logo-font text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Learning Workspace
              </h1>
            </div>

            {user.activeCourses && user.activeCourses.length === 0 ? (
              <Link to="/courses" className="bg-brand-purple text-black font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider">
                Enroll in a Course
              </Link>
            ) : (
              <div className="text-xs text-slate-500">
                Course: <span className="font-bold text-slate-900 uppercase">{activeCourseId?.replace(/-/g, ' ')}</span>
              </div>
            )}
          </div>

          {user.activeCourses && user.activeCourses.length === 0 ? (
            /* IF STUDENT HAS NO ACTIVE COURSES */
            <div className="glass-panel p-8 rounded-2xl text-center max-w-xl mx-auto space-y-6">
              <Award className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">No Allocated Courses Found</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You are registered in the student login database, but have not completed checkout payments for any certification program. Navigate to our catalog to select courses.
              </p>
              <Link to="/courses" className="inline-block bg-brand-purple text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all">
                Browse Course Catalog
              </Link>
            </div>
          ) : (
            /* ACTIVE STUDENT TAB CONTENT */
            <>
              {activeTab === 'recorded' && (
                /* RECORDED LECTURES SCREEN */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Left Player Workspace */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="aspect-video w-full bg-[#1A1A1A] border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 relative group overflow-hidden">
                      <PlayCircle className="w-16 h-16 text-brand-purple group-hover:scale-110 transition-transform cursor-pointer" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-500 bg-white/60 px-4 py-2.5 rounded-lg">
                        <span className="font-medium text-slate-900 truncate max-w-xs">{activeVideo?.title || 'Loading Lecture Video...'}</span>
                        <span className="font-mono">{activeVideo?.duration || '00:00'}</span>
                      </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Lecture Summary</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        This class covers code implementation patterns matching active development stacks. 
                        Review curriculum assessments on git commits to earn certificate credentials.
                      </p>
                      
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Status: {activeVideo?.comp ? 'Completed' : 'Pending'}</span>
                        <button onClick={() => activeVideo && handleToggleLecture(activeVideo.id)} className="bg-slate-100 border border-slate-200 hover:bg-white/10 text-slate-900 font-bold px-4 py-2 rounded-lg text-[10px] uppercase">
                          {activeVideo?.comp ? 'Mark Incomplete' : 'Mark Completed'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Lectures Progress List */}
                  <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-6">
                    <div className="border-b border-slate-200/60 pb-4">
                      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Module Classes ({lectures.filter(l => l.comp).length}/{lectures.length})</h3>
                      <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-brand-purple h-full" style={{ width: `${(lectures.filter(l => l.comp).length / lectures.length) * 100}%` }}></div>
                      </div>
                    </div>

                    <div className="space-y-3.5 max-h-[350px] overflow-y-auto">
                      {lectures.map((lec) => (
                        <div key={lec.id} className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${activeVideo?.id === lec.id ? 'border-brand-purple/40 bg-brand-purple/5' : 'border-slate-200/60 hover:bg-slate-100'}`} onClick={() => handleSelectVideo(lec)}>
                          <div className="flex items-center space-x-2.5 truncate">
                            <input type="checkbox" checked={lec.comp} onChange={() => handleToggleLecture(lec.id)} onClick={(e) => e.stopPropagation()} className="accent-brand-purple h-4 w-4 rounded flex-shrink-0" />
                            <span className={`truncate ${lec.comp ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{lec.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 ml-2">{lec.duration}</span>
                        </div>
                      ))}
                    </div>

                    {/* Certificate issuance trigger */}
                    {lectures.every(l => l.comp) ? (
                      <button onClick={handleGenerateCertificate} className="w-full bg-gradient-to-r from-brand-purple to-brand-blue hover:brightness-110 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-brand-purple/20 animate-bounce">
                        Generate Certificate
                      </button>
                    ) : (
                      <button disabled className="w-full bg-slate-100 border border-slate-200/60 text-slate-500 font-bold py-3.5 rounded-xl text-xs uppercase cursor-not-allowed">
                        Syllabus Incomplete
                      </button>
                    )}
                  </div>

                </div>
              )}

              {activeTab === 'live' && (
                /* LIVE SESSION MEETING LINKS GRID */
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-2 border-brand-purple pl-3">Upcoming Zoom Mentor Sessions</h3>
                  <p className="text-xs text-slate-500">Weekly live code reviews and career workshops designed to guide your portfolio.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {LIVE_MEETINGS.map((mtg, idx) => (
                      <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                        <div>
                          <span className="text-[9px] font-bold text-brand-purple uppercase border border-brand-purple/30 px-2 py-0.5 rounded bg-brand-purple/5">
                            Live Zoom Link
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight mt-3">{mtg.topic}</h4>
                          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono mt-3">
                            <Clock className="w-4 h-4 text-brand-purple" />
                            <span>{mtg.date} • {mtg.time}</span>
                          </div>
                        </div>

                        <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between">
                          <span className="text-xs text-slate-500">Mentor: {mtg.expert}</span>
                          <a href={mtg.link} target="_blank" rel="noreferrer" className="bg-brand-purple hover:bg-brand-purple/90 text-black font-bold text-xs uppercase px-4 py-2 rounded-lg flex items-center space-x-1">
                            <span>Join</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'certificates' && (
                /* DIGITAL CERTIFICATE AND VERIFICATIONS MODULE */
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-2 border-brand-purple pl-3">My Academic Credentials</h3>
                  
                  {studentCerts.length === 0 ? (
                    <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto">
                      <Award className="w-10 h-10 text-slate-500 mx-auto" />
                      <h4 className="font-bold text-slate-900 text-sm">No Issued Certificates Found</h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        To earn your certificate, navigate to "Recorded Area" tab and check off all available syllabus lectures.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {studentCerts.map((cert) => (
                        <div key={cert.id} className="glass-panel p-6 rounded-2xl border border-brand-purple/20 relative space-y-6">
                          <span className="absolute -top-3 -left-3 bg-brand-purple text-black text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-widest shadow">
                            Verified Cert
                          </span>
                          
                          <div className="border-b border-slate-200/60 pb-4">
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{cert.courseTitle}</h4>
                            <p className="text-xs text-brand-purple mt-1">Ref ID: {cert.id}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">Issued: {cert.issueDate}</p>
                          </div>

                          <div className="flex items-center space-x-3 bg-slate-100 p-3 rounded-lg text-xs text-slate-700">
                            <ShieldCheck className="w-5 h-5 text-brand-purple flex-shrink-0" />
                            <span>This certificate contains a mock verification URL active on our verification page.</span>
                          </div>

                          <div className="flex items-center space-x-2 pt-2">
                            <Link to={`/verify?certId=${cert.id}`} className="flex-1 text-center bg-slate-100 border border-slate-200 hover:bg-white/10 text-slate-900 font-bold py-2.5 rounded-lg text-[10px] uppercase">
                              Verify Link
                            </Link>
                            <button onClick={() => navigate(`/verify?certId=${cert.id}&dl=1`)} className="flex-1 bg-brand-purple text-black font-bold py-2.5 rounded-lg text-[10px] uppercase flex items-center justify-center space-x-1">
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </main>

    </div>
  );
}
