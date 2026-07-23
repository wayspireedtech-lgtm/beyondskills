import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getDbItem } from '../utils/dbHelpers';
import { ShieldCheck, ShieldAlert, Award, ArrowLeft, Search, Download, Sparkles } from 'lucide-react';

export default function Verification() {
  const [searchParams] = useSearchParams();
  // Support both ?id= (QR codes) and ?certId= (legacy)
  const certIdParam = searchParams.get('id') || searchParams.get('certId');
  const dlParam = searchParams.get('dl');

  const [searchQuery, setSearchQuery] = useState('');
  const [cert, setCert] = useState(null);
  const [searched, setSearched] = useState(false);
  const [isSample, setIsSample] = useState(false);

  // ── Hardcoded SAMPLE certificates (always verifiable) ──
  const SAMPLE_CERTS = {
    'BS-TC-S001': {
      id: 'BS-TC-S001',
      studentName: 'Rahul Kumar Sharma',
      studentId: 'BS-STU-2025-001',
      courseTitle: 'Artificial Intelligence, Machine Learning & Data Science',
      type: 'Training Completion',
      issueDate: '25 Jul 2025',
      grade: 'A+ (Distinction)',
      duration: '6 Months',
      status: 'SAMPLE',
    },
    'BS-INT-S001': {
      id: 'BS-INT-S001',
      studentName: 'Priya Anjali Nair',
      studentId: 'BS-STU-2025-002',
      courseTitle: 'Full Stack Web Development (MERN)',
      type: 'Internship Completion',
      issueDate: '25 Jul 2025',
      grade: 'Excellent',
      duration: '6 Months',
      status: 'SAMPLE',
    },
    'BS-PC-S001': {
      id: 'BS-PC-S001',
      studentName: 'Arjun Dev Mehta',
      studentId: 'BS-STU-2025-003',
      courseTitle: 'Artificial Intelligence & Machine Learning',
      type: 'Project Completion',
      issueDate: '25 Jul 2025',
      grade: 'A+ (Outstanding)',
      duration: '45 Days',
      status: 'SAMPLE',
    },
    'BS-LOR-S001': {
      id: 'BS-LOR-S001',
      studentName: 'Karan Raj Patel',
      studentId: 'BS-STU-2025-004',
      courseTitle: 'Digital Marketing',
      type: 'Letter of Recommendation',
      issueDate: '25 Jul 2025',
      grade: 'Excellent',
      duration: '6 Months',
      status: 'SAMPLE',
    },
  };

  useEffect(() => {
    if (certIdParam) {
      setSearchQuery(certIdParam);
      handleSearch(certIdParam);
    }
  }, [certIdParam]);

  const handleSearch = (id) => {
    setSearched(true);
    const normalized = id.trim().toUpperCase();

    // 1. Check hardcoded samples first
    if (SAMPLE_CERTS[normalized]) {
      setCert(SAMPLE_CERTS[normalized]);
      setIsSample(true);
      return;
    }

    // 2. Check localStorage (real issued certs)
    const certs = getDbItem('beyondskills_certificates', []);
    const match = certs.find(c => c.id.toLowerCase() === id.trim().toLowerCase());
    setCert(match || null);
    setIsSample(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  // IF DLPARAM IS TRIGGERED: Render full screen printable certificate style!
  if (dlParam && cert) {
    return (
      <div className="bg-white text-slate-900 min-h-screen flex flex-col items-center justify-center p-4 print:bg-white print:text-black print:p-0">
        
        {/* Actions header (hidden on print) */}
        <div className="mb-6 flex space-x-3 print:hidden">
          <button onClick={handlePrintCertificate} className="bg-brand-purple hover:bg-brand-purple/90 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-brand-purple/20">
            <Download className="w-4 h-4" />
            <span>Download PDF / Print</span>
          </button>
          <Link to="/dashboard" className="bg-slate-100 border border-slate-200 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider">
            Back to Dashboard
          </Link>
        </div>

        {/* Certificate Frame */}
        <div className="max-w-4xl w-full bg-white border-[12px] border-brand-purple/20 rounded-2xl p-12 text-center relative overflow-hidden shadow-2xl print:border-brand-purple/40 print:shadow-none print:p-8 print:w-full print:bg-white print:text-black">
          
          {/* Subtle logo bg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-9xl font-extrabold select-none print:opacity-[0.01]">
            BEYONDSKILLS
          </div>

          <div className="border border-brand-purple/20 p-8 space-y-8 print:border-brand-purple/10">
            
            {/* Header */}
            <div>
              <h2 className="logo-font text-3xl font-extrabold tracking-tight uppercase text-slate-900 print:text-black">
                Beyond<span className="text-brand-purple">Skills</span>
              </h2>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1 block">Upskilling Academy Division</span>
            </div>

            {/* Title Statement */}
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-serif text-slate-700 italic print:text-gray-700">Certificate of Completion</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider">This is proudly presented to</p>
            </div>

            {/* Student name */}
            <h1 className="logo-font text-3xl sm:text-4xl font-extrabold text-slate-900 border-b border-brand-purple/20 pb-4 max-w-xl mx-auto print:text-black print:border-gray-200">
              {cert.studentName}
            </h1>

            {/* Achievement text */}
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed print:text-gray-600">
              for successfully completing the structured requirements and practical project modules of the basic-to-intermediate certification course in
            </p>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wider print:text-black">
              {cert.courseTitle}
            </h2>

            {/* Signatures / Details */}
            <div className="grid grid-cols-3 gap-6 pt-10 text-left border-t border-slate-200/60 print:border-gray-100">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Issue Date</span>
                <span className="text-xs font-bold text-slate-700 print:text-black block mt-1">{cert.issueDate}</span>
              </div>
              <div className="text-center flex flex-col items-center">
                {/* Mock QR code block */}
                <div className="w-12 h-12 bg-white border border-gray-200 p-1 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? 'bg-white' : 'bg-white'}`}></div>
                    ))}
                  </div>
                </div>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-1 block">Scan to Verify</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Verification Ref</span>
                <span className="text-xs font-bold text-brand-purple font-mono block mt-1">{cert.id}</span>
              </div>
            </div>

            {/* Compliance Disclaimer at the bottom of the certificate */}
            <p className="text-[8px] text-gray-600 leading-normal text-justify max-w-2xl mx-auto pt-6 border-t border-slate-200/60 print:border-gray-100">
              <strong>Educational Scope Policy:</strong> This certificate verifies syllabus participation and project-based coursework in the designated course. It is issued for skill development purposes and does not imply advanced competency or guarantee placement outcomes.
            </p>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-900 min-h-[80vh] flex items-center justify-center p-6 relative">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0"></div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-200 max-w-xl w-full z-10 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <span className="text-brand-purple text-xs font-bold tracking-widest uppercase border border-brand-purple/30 px-3 py-1 rounded bg-brand-purple/5">
            BeyondSkills Academy
          </span>
          <h1 className="logo-font text-3xl font-extrabold text-slate-900 mt-4">
            Certificate Verification Portal
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Verify academic certificate authentication codes and reference values.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleFormSubmit} className="flex space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input type="text" required value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200/80 shadow-sm border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:border-brand-purple outline-none shadow-sm focus:border-brand-purple outline-none focus:border-brand-purple outline-none" placeholder="Enter Certificate Reference ID..." />
          </div>
          <button type="submit" className="bg-brand-purple hover:bg-brand-purple/90 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-colors">
            Verify
          </button>
        </form>

        {/* Verification Results Panel */}
        {searched && (
          <div className="pt-6 border-t border-slate-200/60">
            {cert ? (
              /* MATCH FOUND */
              <div className="bg-brand-indigo/60 backdrop-blur-md border border-brand-purple/30 rounded-2xl p-6 space-y-6">
                <div className="flex items-center space-x-3 text-brand-purple">
                  <ShieldCheck className="w-8.5 h-8.5 flex-shrink-0 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm uppercase">
                      {isSample ? '✅ Sample Certificate – Verified' : 'Certificate Verified'}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {isSample
                        ? 'This is an official BeyondSkills sample certificate for demonstration purposes.'
                        : 'Authentic academic record found in BeyondSkills database.'}
                    </p>
                  </div>
                </div>

                {isSample && (
                  <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl px-4 py-2.5 text-[10px] text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                    This is a SAMPLE certificate. Real certificates issued to enrolled students carry unique IDs and full student details.
                  </div>
                )}

                <div className="space-y-3.5 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-slate-400">Student Name:</span>
                    <span className="font-bold text-slate-100">{cert.studentName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-slate-400">Certificate Type:</span>
                    <span className="font-bold text-slate-100">{cert.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-slate-400">Program:</span>
                    <span className="font-bold text-slate-100 text-right max-w-xs">{cert.courseTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-slate-400">Issue Date:</span>
                    <span className="font-mono text-slate-100">{cert.issueDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-slate-400">Grade:</span>
                    <span className="font-bold text-slate-100">{cert.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Certificate Status:</span>
                    <span className="font-bold text-brand-cyan uppercase">
                      {isSample ? 'Sample / Demo' : 'Active & Valid'}
                    </span>
                  </div>
                </div>

                {!isSample && (
                  <Link to={`/verify?certId=${cert.id}&dl=1`} className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-2.5 rounded-lg text-xs uppercase flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-brand-purple/20">
                    <Award className="w-4 h-4 text-white" />
                    <span>View Printable Certificate</span>
                  </Link>
                )}
              </div>
            ) : (
              /* MATCH NOT FOUND */
              <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-2xl p-6 text-center space-y-4">
                <ShieldAlert className="w-10 h-10 text-brand-blue mx-auto" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm uppercase">Invalid Certificate Code</h3>
                  <p className="text-[10px] text-slate-500 mt-1">We could not locate reference record <strong>"{searchQuery}"</strong> in our active list.</p>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Double check characters and hyphen spacing. Contact admissions support at connect@beyondskills.in or +91 7982119571 if you believe this is an error.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
