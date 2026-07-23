import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ArrowLeft, Calendar, ShieldAlert } from 'lucide-react';

export default function ReturnRefundPolicy() {
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-brand-purple transition-all group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero header */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center space-x-3 text-brand-purple mb-4">
            <CreditCard className="w-6 h-6" />
            <span className="text-xs font-extrabold uppercase tracking-widest bg-brand-purple/10 px-2.5 py-1 rounded-full">
              Transaction Rules & Refunds
            </span>
          </div>
          
          <h1 className="logo-font text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Return & Refund Policy
          </h1>
          
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last Updated: January 31, 2026</span>
            </span>
          </div>
        </div>

        {/* Refund Policy Content */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200/80 space-y-12 text-slate-600 leading-relaxed text-sm">
          
          <div>
            <p className="text-base text-slate-700 font-medium">
              This Return & Refund Policy sets the terms regarding payments, tax calculations, and cancellation requests when enrolling in BeyondSkills academic programs or purchasing our digital services.
            </p>
          </div>

          <hr className="border-slate-200" />

          {/* Section 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">1</span>
              <span>Payments & Billing</span>
            </h3>
            <p>To buy any course program or digital service from BeyondSkills, you agree to complete full payment according to the selected structure (one-time pricing or structured installments):</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-500">
              <li>All billing and profile credentials must be valid and legally authorized.</li>
              <li>Your encrypted token details may be stored securely by our checkout gateway (e.g., Razorpay) for transaction execution.</li>
              <li>Syllabus fee rates may fluctuate depending on ongoing promotional discounts, localization factors, or tax changes.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">2</span>
              <span>Taxes</span>
            </h3>
            <p>
              Educational or promotional fees calculated during the checkout cycle are subject to applicable legal taxes (e.g., standard Goods and Services Tax - GST in India). You agree to bear all tax items appended by regulatory mandates.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-rose-500/15 text-rose-600 font-mono text-xs font-bold">3</span>
              <span className="text-rose-950 font-extrabold">General Refund Policy (No Refunds)</span>
            </h3>
            <div className="space-y-3 text-slate-700">
              <p><strong>Strict No-Refund Standard:</strong> Once a purchase transaction completes, the amount is completely non-refundable for any reason. Dissatisfaction with materials, schedule changes, or personal conflicts do not justify a refund request.</p>
              <p><strong>No Refunds for Partial Use:</strong> If you stop attending weekly mentor sessions or fail to complete modules, no partial or prorated refunds will be issued.</p>
              <p><strong>No Refunds for Slot Booking Fees:</strong> Any temporary reservation tokens or booking fees paid to hold seats are strictly non-refundable.</p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">4</span>
              <span>Duplicate Charge Technical Correction Only</span>
            </h3>
            <p>BeyondSkills operates a strict no-refund policy. In the event of a technical duplicate charge, the extra payment is corrected:</p>
            <div className="bg-slate-100 border border-slate-200/60 p-4 rounded-xl flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 mb-1">Duplicate Charge Processing</p>
                <p className="text-xs text-slate-500">
                  If your payment source is charged more than once for the same enrollment order due to network gateway timeouts or bank API failures, the extra transaction value will be automatically reversed or refunded after verification. The funds will be processed back to your original payment method within 7 to 8 business days. This does not constitute a refund policy for voluntary withdrawals or cancellations.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-mono text-xs font-bold">5</span>
              <span>Third-Party Purchases</span>
            </h3>
            <p>
              If you purchase a BeyondSkills program or enrollment seat from a partner organization, their distinct refund framework applies. BeyondSkills is not responsible for handling, auditing, or processing refunds for sales made outside our direct billing gateway.
            </p>
          </div>

          <hr className="border-slate-200" />
          
          <div className="text-center text-xs text-slate-400">
            <p>For refund audits and technical ticket verification, please contact <a href="mailto:support@beyondskills.in" className="text-brand-purple hover:underline">support@beyondskills.in</a>.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
