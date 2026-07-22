/**
 * Utility helper to send automatic emails via Resend API
 */

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || 're_2thGk4uo_PDZ6e9vPmAcU1Ytdne4siDAm';

export async function sendEmail({ to, subject, html, from = 'BeyondSkills <contact@beyondskills.in>' }) {
  const payload = { from, to, subject, html };

  if (!RESEND_API_KEY) {
    console.warn('[Resend Email Notice] VITE_RESEND_API_KEY is missing.');
    return { success: false, message: 'Resend API key missing' };
  }

  // 1. Send directly via Resend API with keepalive (Primary, fast & reliable)
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      keepalive: true,
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      console.log('[Resend Email Direct Success]:', data);
      return { success: true, data };
    } else {
      console.error('[Resend Email Error]:', data);
      
      if (data && data.name === 'validation_error' && from.includes('beyondskills.in')) {
        const fallbackRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          keepalive: true,
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'BeyondSkills <onboarding@resend.dev>',
            to,
            subject,
            html,
          }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok) {
          console.log('[Resend Fallback Email Sent Successfully]:', fallbackData);
          return { success: true, data: fallbackData };
        }
      }
    }
  } catch (directErr) {
    console.warn('[Direct Resend Fetch Warning]:', directErr);
  }

  // 2. Backup attempt via Express server proxy if direct fetch failed
  try {
    const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? (window.location.port === '5173' ? 'http://localhost:5001' : 'http://localhost:5000')
      : window.location.origin;

    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 1200);

    const proxyRes = await fetch(`${apiHost}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(tid);

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      console.log('[Resend Email via Server Proxy Success]:', data);
      return { success: true, data };
    }
  } catch (proxyErr) {
    // Ignore proxy error
  }

  return { success: false, message: 'Failed to send email' };
}

/**
 * Send Welcome / Lead Confirmation Email on Form Registration
 */
export async function sendLeadWelcomeEmail({ name, email, program = 'Artificial Intelligence & Data Science' }) {
  if (!email) return;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #050718; color: #ffffff; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <img src="https://www.beyondskills.in/logo.png" alt="BeyondSkills" style="max-height: 44px; width: auto; margin: 0 auto 8px auto; display: block;" />
        <p style="color: #94a3b8; font-size: 13px; margin-top: 6px; font-weight: 500;">Empowering Practical Industry Careers</p>
      </div>

      <div style="padding: 24px 0; font-size: 14px; line-height: 1.7; color: #cbd5e1;">
        <p style="font-size: 16px; color: #ffffff; font-weight: 600; margin-top: 0;">Hi <strong>${name || 'Learner'}</strong>,</p>
        
        <p style="font-size: 18px; color: #2A4BFF; font-weight: 700; margin: 12px 0;">Welcome to BeyondSkills 🎓</p>
        
        <p style="color: #cbd5e1; margin: 12px 0;">We’re really happy to have you here.</p>
        
        <p style="color: #cbd5e1; margin: 12px 0;">At BeyondSkills, we help you learn practical skills that actually matter in your career. Whether you’re just starting out or looking to upgrade your skills, you’re in the right place.</p>
        
        <div style="margin: 18px 0; background: rgba(42, 75, 255, 0.1); border-left: 4px solid #2A4BFF; padding: 12px 16px; border-radius: 6px;">
          <p style="margin: 0; color: #cbd5e1; font-size: 13px;">Website :- <a href="https://www.beyondskills.in" style="color: #0EA5E9; font-weight: bold; text-decoration: none;">https://www.beyondskills.in</a></p>
        </div>
        
        <p style="color: #cbd5e1; margin: 16px 0;">Let’s grow and achieve your goals together! 🚀</p>
        
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08);">
          <p style="margin: 2px 0; color: #ffffff; font-weight: 600;">Best Wishes,</p>
          <p style="margin: 2px 0; color: #2A4BFF; font-weight: 700; font-size: 15px;">BeyondSkills</p>
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #64748b; font-size: 12px;">
        <p style="margin: 4px 0;">© 2026 BeyondSkills / Wayspire EdTech. All rights reserved.</p>
        <p style="margin: 4px 0;">Support Email: <a href="mailto:contact@beyondskills.in" style="color: #2A4BFF; text-decoration: none;">contact@beyondskills.in</a></p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Welcome to BeyondSkills 🎓 | Registration Confirmed`,
    html,
    from: 'BeyondSkills <contact@beyondskills.in>'
  });
}

/**
 * Send Payment Confirmation & LMS Login Email on Checkout Purchase
 */
export async function sendPaymentReceiptEmail({ name, email, courseTitle, amount, paymentId, studentId, password }) {
  if (!email) return;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #050718; color: #ffffff; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <img src="https://www.beyondskills.in/logo.png" alt="BeyondSkills" style="max-height: 44px; width: auto; margin: 0 auto 8px auto; display: block;" />
        <h2 style="color: #4ADE80; font-size: 20px; font-weight: 800; margin: 8px 0 0 0; letter-spacing: -0.5px;">Payment Successful 🎉</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 6px; font-weight: 500;">Welcome to BeyondSkills Live Cohort</p>
      </div>

      <div style="padding: 24px 0;">
        <h3 style="color: #ffffff; font-size: 18px; margin-top: 0;">Dear ${name || 'Student'},</h3>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Congratulations! Your payment of <strong>₹${Number(amount).toLocaleString('en-IN')}</strong> for <strong>${courseTitle}</strong> has been successfully processed.</p>
        
        <div style="background-color: #0A0E35; border: 1px solid rgba(255,255,255,0.1); padding: 18px; border-radius: 12px; margin: 20px 0;">
          <h4 style="color: #0EA5E9; margin: 0 0 12px 0; font-size: 15px;">Payment Receipt Summary</h4>
          <p style="margin: 6px 0; color: #cbd5e1; font-size: 13px;"><strong>Transaction ID:</strong> <span style="font-family: monospace; color: #38bdf8;">${paymentId}</span></p>
          <p style="margin: 6px 0; color: #cbd5e1; font-size: 13px;"><strong>Student Roll ID:</strong> <span style="font-family: monospace; color: #38bdf8;">${studentId}</span></p>
          <p style="margin: 6px 0; color: #cbd5e1; font-size: 13px;"><strong>Total Amount Paid:</strong> ₹${Number(amount).toLocaleString('en-IN')}</p>
        </div>

        <div style="background-color: rgba(74, 222, 128, 0.08); border: 1px solid rgba(74, 222, 128, 0.25); padding: 18px; border-radius: 12px; margin: 20px 0;">
          <h4 style="color: #4ADE80; margin: 0 0 12px 0; font-size: 15px;">LMS Portal Access Credentials</h4>
          <p style="margin: 6px 0; color: #cbd5e1; font-size: 13px;"><strong>Login Email:</strong> ${email}</p>
          <p style="margin: 6px 0; color: #cbd5e1; font-size: 13px;"><strong>Temporary Password:</strong> <span style="background: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 4px; font-family: monospace; color: #ffffff;">${password}</span></p>
          <p style="margin: 12px 0 0 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">Use these credentials to log into your student dashboard to access batch schedules, live Google Meet/Zoom links, and curriculum recordings.</p>
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #64748b; font-size: 12px;">
        <p style="margin: 4px 0;">© 2026 Beyondskills / Wayspire EdTech. All rights reserved.</p>
        <p style="margin: 4px 0;">Billing Support: <a href="mailto:contact@beyondskills.in" style="color: #0EA5E9; text-decoration: none;">contact@beyondskills.in</a></p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `🧾 Payment Receipt & Access Granted - ${courseTitle} | Beyondskills`,
    html,
    from: 'Beyondskills Billing <contact@beyondskills.in>'
  });
}
