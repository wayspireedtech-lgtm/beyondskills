import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { COURSES, getDbItem } from '../utils/mockDb';
import { CheckCircle, Download, FileText, ArrowRight, ShieldCheck, Mail, Calendar, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const courseId = searchParams.get('courseId');
  const payId = searchParams.get('payId');
  const studentId = searchParams.get('studentId');

  const [course, setCourse] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  useEffect(() => {
    if (courseId) {
      const match = COURSES.find(c => c.id === courseId);
      setCourse(match);
    }

    // Trigger confetti on successful payment load
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  }, [courseId]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (!course) {
    return (
      <div className="text-slate-900 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Onboarding Record Not Found</h2>
        <Link to="/courses" className="bg-brand-purple text-white font-bold px-6 py-2 rounded-lg text-xs uppercase">
          Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="text-slate-900 min-h-screen relative pt-12 pb-24 print:bg-white print:text-black">
      {/* Glow Blur */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] z-0 print:hidden"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative print:p-0">
        
        {/* Onboarding Header */}
        <div className="text-center mb-10 print:hidden">
          <div className="bg-brand-purple/15 border border-brand-purple/30 text-brand-purple p-3.5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold tracking-widest text-brand-purple uppercase">Instant Provision Success</span>
          <h1 className="logo-font text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Welcome to BeyondSkills Academy!
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Account setup completed within 14 seconds (Target SLA: 5 minutes).
          </p>
        </div>

        {/* Portal Workspace Details Card */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-200 space-y-6 print:hidden">
          
          <div className="border-b border-slate-200/60 pb-6 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned Student ID</span>
              <span className="text-lg font-bold text-brand-purple font-mono">{studentId || 'BS-2026-1004'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Course Allocated</span>
              <span className="text-sm font-bold text-slate-900 leading-tight block mt-1">{course.title}</span>
            </div>
          </div>

          {/* Onboarding Checklist */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Your Onboarding Checklist
            </h3>
            
            <div className="space-y-3.5 text-xs text-slate-700">
              <div className="flex items-start space-x-3 bg-slate-100 p-3 rounded-lg border border-slate-200/60">
                <CheckCircle className="w-5 h-5 text-brand-purple mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Temporary Credentials Issued</p>
                  <p className="text-slate-500 mt-0.5">Use your checkout email and temporary password <strong>"password"</strong> to login.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-slate-100 p-3 rounded-lg border border-slate-200/60">
                <CheckCircle className="w-5 h-5 text-brand-purple mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Watch Recorded Module 1</p>
                  <p className="text-slate-500 mt-0.5">Start recorded lessons in your dashboard workspace area to unlock syllabus projects.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-slate-100 p-3 rounded-lg border border-slate-200/60">
                <CheckCircle className="w-5 h-5 text-brand-purple mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Review Live Mentor Calendar</p>
                  <p className="text-slate-500 mt-0.5">Check dashboard notifications for weekly live Zoom meetings with Dr. Aris Rawat and team.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button onClick={() => setInvoiceOpen(true)} className="w-full sm:w-auto bg-slate-100 hover:bg-white/10 border border-slate-200 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2">
              <FileText className="w-4.5 h-4.5 text-brand-purple" />
              <span>Generate PDF Invoice</span>
            </button>

            <button onClick={handleGoToDashboard} className="w-full sm:w-auto bg-gradient-to-r from-[#1B2A8A] to-[#2563EB] hover:brightness-110 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-brand-purple/15 hover:scale-105 transition-all">
              <span>Go to Study Dashboard</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>

        {/* PRINTABLE INVOICE MODAL MODULE */}
        {invoiceOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-white/90 flex items-center justify-center p-4 print:relative print:bg-white print:text-black print:p-0">
            <div className="bg-white text-black rounded-xl max-w-2xl w-full p-8 shadow-2xl space-y-6 relative border border-gray-200 print:shadow-none print:border-0 print:p-0">
              
              {/* Close / Action tools (hidden on print) */}
              <div className="absolute top-4 right-4 flex items-center space-x-2 print:hidden">
                <button onClick={handlePrintInvoice} className="bg-brand-purple text-white font-bold p-2.5 rounded-lg text-xs uppercase flex items-center space-x-1.5 shadow">
                  <Download className="w-4 h-4" />
                  <span>Print / Save</span>
                </button>
                <button onClick={() => setInvoiceOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold p-2.5 rounded-lg text-xs uppercase">
                  Close
                </button>
              </div>

              {/* Invoice Layout */}
              <div className="border-b border-gray-200 pb-6 flex justify-between items-start">
                <div>
                  <h2 className="logo-font text-3xl font-extrabold tracking-tight text-black">
                    Beyond<span className="text-brand-purple">Skills</span>
                  </h2>
                  <p className="text-xs text-slate-500 uppercase font-semibold mt-1">Upskilling Academy Division</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <h4 className="font-bold text-black text-sm uppercase">Tax Invoice / Receipt</h4>
                  <p className="mt-1">Date: {new Date().toLocaleDateString()}</p>
                  <p>Invoice No: INV-BS-2026-{payId ? payId.slice(-4) : '9827'}</p>
                </div>
              </div>

              {/* Billed To / From */}
              <div className="grid grid-cols-2 gap-6 text-xs border-b border-gray-100 pb-6">
                <div>
                  <h4 className="font-bold text-slate-500 uppercase mb-2">Billed From:</h4>
                  <p className="font-bold text-gray-800">BeyondSkills Tech Services Pvt Ltd</p>
                  <p className="text-slate-500">Sector 62, Electronic City, Noida</p>
                  <p className="text-slate-500">GSTIN: 09AAECD9832K1ZP</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-500 uppercase mb-2">Billed To (Learner):</h4>
                  <p className="font-bold text-gray-800">Student ID: {studentId || 'BS-2026-1004'}</p>
                  <p className="text-slate-500">Receipt Ref: {payId || 'pay_mock_12345'}</p>
                  <p className="text-slate-500">Registered Onboarding Address</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-slate-500 uppercase font-bold">
                    <th className="py-2.5">Syllabus Program / Certification Course</th>
                    <th className="py-2.5 text-center">Duration</th>
                    <th className="py-2.5 text-right">Fee (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 text-gray-700">
                    <td className="py-3 font-semibold text-gray-800">{course.title}</td>
                    <td className="py-3 text-center text-slate-500">{course.duration}</td>
                    <td className="py-3 text-right font-mono">₹{course.fee.toLocaleString()}.00</td>
                  </tr>
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="flex justify-end pt-4">
                <div className="w-64 text-xs space-y-2.5">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{(course.fee * 0.82).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>CGST (9%):</span>
                    <span className="font-mono">₹{(course.fee * 0.09).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>SGST (9%):</span>
                    <span className="font-mono">₹{(course.fee * 0.09).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm text-gray-800">
                    <span>Grand Total Paid:</span>
                    <span className="font-mono text-brand-purple">₹{course.fee.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>

              {/* Compliance note in invoice */}
              <div className="border-t border-gray-100 pt-6 text-[9px] text-slate-500 text-justify leading-relaxed">
                <strong>Important Scope Disclaimer:</strong> Completed payments grant 100% access to study area videos, live sessions schedules, and certificates download metrics. BeyondSkills Academy operates as an educational provider and explicitly does not guarantee employment offers, corporate placements, or job interviews.
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
