import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET;

let razorpayInstance = null;

if (keyId && keySecret) {
  // Initialize Razorpay SDK instance
  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
} else {
  console.warn('[WARNING] Razorpay is disabled because keyId or keySecret are not configured in environment variables.');
}

/**
 * STEP 1: Create Order
 * Endpoint: POST /api/create-order
 * Request body: { amount (paise), receipt }
 * Response: { order_id, amount, currency }
 */
app.post('/api/create-order', async (req, res) => {
  try {
    if (!razorpayInstance) {
      return res.status(500).json({ error: 'Razorpay keys are not configured on this server.' });
    }
    const { amount, receipt } = req.body;

    if (amount === undefined || isNaN(amount)) {
      return res.status(400).json({ error: 'Amount is required and must be a number.' });
    }

    const amountInPaise = Math.round(Number(amount));

    if (amountInPaise < 100) {
      return res.status(400).json({ error: 'Minimum amount must be at least 100 paise (₹1).' });
    }

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `receipt_order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    // Handle auth failures (return 401)
    if (error.statusCode === 401 || (error.error && error.error.code === 'BAD_REQUEST_ERROR' && error.error.description.includes('API key'))) {
      return res.status(401).json({ error: 'Razorpay authentication failed. Please verify API keys.' });
    }
    // Handle Razorpay API errors (return 500)
    res.status(500).json({ error: 'Failed to create order on Razorpay server.', details: error.message || error });
  }
});

/**
 * STEP 3: Verify Signature
 * Endpoint: POST /api/verify-payment
 * Request body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Response: { success, message }
 */
app.post('/api/verify-payment', (req, res) => {
  try {
    if (!keySecret) {
      return res.status(500).json({ error: 'Razorpay secret key is not configured on this server.' });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Missing fields: return 400
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are all required.' });
    }

    // Generate expected signature using HMAC-SHA256
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    // Compare generated signature with razorpay_signature
    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment signature verified successfully.' });
    } else {
      console.warn('Signature Verification Failed. Expected:', expectedSignature, 'Received:', razorpay_signature);
      // Signature mismatch: return 400
      res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
    }
  } catch (error) {
    console.error('Payment Signature Verification Error:', error);
    res.status(500).json({ error: 'An error occurred during payment signature verification.' });
  }
});

// Webhook leads database helper path
// Resolve relative to process.cwd() so it works robustly in Vercel lambda (which copies root files to process.cwd())
const LEADS_FILE = path.join(process.cwd(), 'leads_db.json');
const CONFIG_FILE = path.join(process.cwd(), 'config.json');

// Helper to write JSON files robustly (falls back to /tmp/ if root is read-only like on Vercel)
const writeJsonFileSync = (filepath, data) => {
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn(`[WARNING] Failed to write to ${filepath}. Retrying with /tmp fallback...`, err);
    try {
      const filename = filepath.split(path.sep).pop() || filepath.split('/').pop();
      fs.writeFileSync(`/tmp/${filename}`, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (tmpErr) {
      console.error(`[ERROR] Fallback write to /tmp failed for ${filepath}:`, tmpErr);
      return false;
    }
  }
};

// Helper to read JSON files robustly (checks root first, then /tmp/ fallback)
const readJsonFileSync = (filepath, defaultValue = []) => {
  try {
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath, 'utf-8');
      return JSON.parse(data || '[]');
    }
  } catch (err) {
    console.warn(`[WARNING] Failed to read from ${filepath}. Checking /tmp fallback...`, err);
  }

  try {
    const filename = filepath.split(path.sep).pop() || filepath.split('/').pop();
    const tmpPath = `/tmp/${filename}`;
    if (fs.existsSync(tmpPath)) {
      const data = fs.readFileSync(tmpPath, 'utf-8');
      return JSON.parse(data || '[]');
    }
  } catch (tmpErr) {
    console.error(`[ERROR] Fallback read from /tmp failed for ${filepath}:`, tmpErr);
  }

  return defaultValue;
};

// GET: Fetch config settings
app.get('/api/config', (req, res) => {
  try {
    const config = readJsonFileSync(CONFIG_FILE, {});
    const googleSheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEET_WEBHOOK_URL || config.googleSheetWebhookUrl || '';
    const googleFormSheetUrl = config.googleFormSheetUrl || '';
    const adsSheetUrl = config.adsSheetUrl || '';
    res.status(200).json({ googleSheetWebhookUrl, googleFormSheetUrl, adsSheetUrl });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: 'Failed to retrieve configuration.' });
  }
});

// POST: Save config settings
app.post('/api/config', (req, res) => {
  try {
    const { googleSheetWebhookUrl, googleFormSheetUrl, adsSheetUrl } = req.body;
    const config = readJsonFileSync(CONFIG_FILE, {});
    
    if (googleSheetWebhookUrl !== undefined) config.googleSheetWebhookUrl = googleSheetWebhookUrl;
    if (googleFormSheetUrl !== undefined) config.googleFormSheetUrl = googleFormSheetUrl;
    if (adsSheetUrl !== undefined) config.adsSheetUrl = adsSheetUrl;
    
    writeJsonFileSync(CONFIG_FILE, config);
    res.status(200).json({ success: true, message: 'Configuration saved successfully.' });
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({ error: 'Failed to save configuration.' });
  }
});

// GET: Fetch all webhook leads
app.get('/api/webhook/leads', (req, res) => {
  try {
    const leads = readJsonFileSync(LEADS_FILE, []);
    res.status(200).json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to retrieve leads from database.' });
  }
});

// POST: Add new lead (from Google Apps Script webhook / Ads triggers)
app.post('/api/webhook/leads', async (req, res) => {
  try {
    const { 
      name, email, phone, type, program, notes,
      college, profession, message, batch, projectExp, whyInterested, year,
      preferredContactTime, careerGoal,
      campaign, source, utmMedium, utmCampaign, utmContent, remarks,
      qualification, experience, contactTime, goal
    } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and Phone fields are required.' });
    }

    let existingLeads = readJsonFileSync(LEADS_FILE, []);

    // Check if phone already exists in server webhook DB
    const existingIndex = existingLeads.findIndex(l => l.phone === phone);
    if (existingIndex !== -1) {
      const existingLead = existingLeads[existingIndex];
      let updated = false;
      
      const newCollege = college || qualification || 'Unspecified';
      if ((!existingLead.college || existingLead.college === 'Unspecified') && newCollege !== 'Unspecified') {
        existingLead.college = newCollege;
        existingLead.qualification = newCollege;
        updated = true;
      }
      const newProfession = profession || experience || 'Unspecified';
      if ((!existingLead.profession || existingLead.profession === 'Unspecified') && newProfession !== 'Unspecified') {
        existingLead.profession = newProfession;
        existingLead.experience = newProfession;
        updated = true;
      }
      const newGoal = goal || careerGoal || 'Unspecified';
      if ((!existingLead.goal || existingLead.goal === 'Unspecified') && newGoal !== 'Unspecified') {
        existingLead.goal = newGoal;
        updated = true;
      }
      const newContactTime = contactTime || preferredContactTime || 'Anytime';
      if ((!existingLead.contactTime || existingLead.contactTime === 'Anytime' || existingLead.contactTime === 'Anytime between 10am to 8pm') && newContactTime !== 'Anytime') {
        existingLead.contactTime = newContactTime;
        updated = true;
      }
      if (email && email !== 'no-email@beyondskills.com' && (!existingLead.email || existingLead.email === 'no-email@beyondskills.com')) {
        existingLead.email = email;
        updated = true;
      }
      if (notes) {
        if (!existingLead.history) existingLead.history = [];
        existingLead.history.push({ note: notes, date: new Date().toISOString() });
        updated = true;
      }
      
      if (updated) {
        existingLeads[existingIndex] = existingLead;
        writeJsonFileSync(LEADS_FILE, existingLeads);
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Lead updated with new details.', 
        lead: existingLead,
        updated
      });
    }

    const newLead = {
      id: `LD${String(existingLeads.length + 101).padStart(3, '0')}`,
      name,
      email: email || 'no-email@beyondskills.com',
      phone,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: type || 'Google Form Leads',
      program: program || 'artificial-intelligence',
      assignedBDM: '',
      assignedBDA: '',
      status: 'New',
      subStatus: 'QUALIFIED',
      profession: profession || experience || 'Unspecified',
      college: college || qualification || 'Unspecified',
      qualification: college || qualification || 'Unspecified',
      experience: profession || experience || 'Unspecified',
      contactTime: contactTime || preferredContactTime || 'Anytime',
      goal: goal || careerGoal || 'Unspecified',
      message: message || remarks || '',
      campaign: campaign || utmCampaign || '',
      source: source || '',
      utmMedium: utmMedium || '',
      utmCampaign: utmCampaign || '',
      utmContent: utmContent || '',
      remarks: remarks || message || '',
      mentor: 'None',
      duration: 'None',
      callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
      history: notes ? [{ note: notes, date: new Date().toISOString() }] : []
    };

    existingLeads.push(newLead);
    writeJsonFileSync(LEADS_FILE, existingLeads);

    // Forward to Google Sheet Webhook if configured
    let forwardedToSheet = false;
    let googleSheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || 
                               process.env.VITE_GOOGLE_SHEET_WEBHOOK_URL ||
                               'https://script.google.com/macros/s/AKfycbwHEer3vmt4NNgpx_-aq7Zbl4QIYM2Buk_l-UrdisUJqLAukqTwKa8XTh2hQWI8LibmZg/exec';

    if (googleSheetWebhookUrl) {
      try {
        const webhookPayload = {
          name,
          phone,
          email,
          college: college || 'N/A',
          year: year || 'N/A',
          role: profession || 'N/A',
          program: program || 'N/A',
          batch: batch || 'N/A',
          projectExp: projectExp || 'N/A',
          whyInterested: whyInterested || 'N/A',
          preferredContactTime: preferredContactTime || req.body.preferredContactTime || 'Not Specified',
          careerGoal: careerGoal || req.body.careerGoal || 'Not Specified',
          date: newLead.date
        };
        
        const sheetRes = await fetch(googleSheetWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(webhookPayload)
        });
        
        if (sheetRes.ok) {
          forwardedToSheet = true;
          console.log(`Successfully forwarded lead to Google Sheet Webhook: ${name}`);
        } else {
          console.warn(`Google Sheet Webhook returned status: ${sheetRes.status}`);
        }
      } catch (err) {
        console.error('Error forwarding lead to Google Sheet Webhook:', err);
      }
    }

    // Send automatic email notification backup to admin
    try {
      if (smtpUser && smtpPass) {
        const alertMailOptions = {
          from: `"BeyondSkills Lead Alert" <${smtpUser}>`,
          to: 'beyondskills.ai@gmail.com',
          subject: `🚨 NEW LEAD: ${name} (${program || 'full-stack-web'})`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; max-width: 500px;">
              <h2 style="color: #2563eb; margin-top: 0;">New Lead Registered!</h2>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 15px;" />
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>Email:</strong> ${email || 'None'}</p>
              <p><strong>Program:</strong> ${program || 'full-stack-web'}</p>
              <p><strong>College:</strong> ${college || 'Unspecified'}</p>
              <p><strong>Date:</strong> ${newLead.date}</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 15px;" />
              <p style="font-size: 11px; color: #64748b;">This is an automated safety alert from BeyondSkills Server.</p>
            </div>
          `
        };
        await transporter.sendMail(alertMailOptions);
        console.log(`[SMTP Backup] Lead email notification sent for ${name}`);
      }
    } catch (mailErr) {
      console.error('Failed to send SMTP backup lead email:', mailErr);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Lead recorded successfully.', 
      lead: newLead,
      forwardedToSheet
    });
  } catch (error) {
    console.error('Error saving lead via webhook:', error);
    res.status(500).json({ error: 'Internal server error while processing webhook.' });
  }
});


// Temporary in-memory store for SMS OTPs
const otpStore = new Map();

/**
 * Endpoint: POST /api/send-otp
 * Request body: { phone }
 * Response: { success, message, otp }
 */
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store in-memory with 5 minutes expiry
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    console.log(`[SMS OTP DEBUG] Phone: ${phone} -> Generated OTP: ${otp}`);

    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    let smsSent = false;

    if (fast2smsKey) {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': fast2smsKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: otp,
            numbers: phone
          })
        });
        const result = await response.json();
        if (result && result.return === true) {
          smsSent = true;
          console.log(`[Fast2SMS] SMS OTP sent successfully to ${phone}`);
        } else {
          console.error('[Fast2SMS] Send failure response:', result);
        }
      } catch (err) {
        console.error('[Fast2SMS] Fetch error:', err);
      }
    } else if (twilioSid && twilioToken && twilioPhone) {
      try {
        const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            Body: `Your BeyondSkills verification code is: ${otp}`,
            To: phone.startsWith('+') ? phone : `+91${phone}`,
            From: twilioPhone
          })
        });
        const result = await response.json();
        if (response.ok) {
          smsSent = true;
          console.log(`[Twilio] SMS OTP sent successfully to ${phone}`);
        } else {
          console.error('[Twilio] Send failure response:', result);
        }
      } catch (err) {
        console.error('[Twilio] Fetch error:', err);
      }
    }

    res.status(200).json({
      success: true,
      message: smsSent ? 'OTP sent successfully.' : 'OTP sent (Demo Mode). Please check server terminal logs.',
      otp: smsSent ? undefined : otp // Only return OTP to client if real SMS gateways are not configured
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Internal server error while sending OTP.' });
  }
});

/**
 * Endpoint: POST /api/verify-otp
 * Request body: { phone, otp }
 * Response: { success, message }
 */
app.post('/api/verify-otp', (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP code are required.' });
    }

    const record = otpStore.get(phone);
    if (!record) {
      return res.status(400).json({ error: 'No OTP requested for this phone number.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    if (record.otp !== otp.toString().trim()) {
      return res.status(400).json({ error: 'Invalid OTP code.' });
    }

    // Success -> clear OTP
    otpStore.delete(phone);
    res.status(200).json({ success: true, message: 'OTP verified successfully.' });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error while verifying OTP.' });
  }
});

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';

// Transporter configuration
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for 587
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

/**
 * Endpoint: POST /api/send-email-otp
 * Request body: { email, name, otp }
 * Response: { success, message, isDemo, otp }
 */
app.post('/api/send-email-otp', async (req, res) => {
  try {
    const { email, name, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required parameters.' });
    }

    // Fallback to Demo Mode if credentials are not configured yet
    if (!smtpUser || !smtpPass) {
      console.warn('[SMTP WARNING] SMTP_USER or SMTP_PASS is not configured. Falling back to Demo Mode.');
      return res.status(200).json({
        success: true,
        message: 'OTP sent (Demo Mode). Please check console logs.',
        isDemo: true,
        otp
      });
    }

    const mailOptions = {
      from: `"BeyondSkills Support" <${smtpUser}>`,
      to: email,
      subject: `Your BeyondSkills Verification Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0f5cfc; text-align: center; margin-bottom: 5px;">BeyondSkills</h2>
          <p style="text-align: center; color: #718096; font-size: 14px; margin-top: 0;">Empowering Learning & Skills</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 25px;" />
          <p style="font-size: 15px; color: #2d3748; line-height: 1.6;">Hi <strong>${name || 'User'}</strong>,</p>
          <p style="font-size: 15px; color: #2d3748; line-height: 1.6;">We received a request to log in to your BeyondSkills account. Use the following security verification code to proceed:</p>
          <div style="background-color: #f7fafc; border: 1px dashed #cbd5e0; padding: 15px; border-radius: 8px; text-align: center; margin: 25px 0;">
            <p style="font-size: 11px; color: #718096; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Security OTP Code</p>
            <span style="font-size: 32px; font-weight: bold; color: #0f5cfc; letter-spacing: 5px; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #718096; font-size: 13px; line-height: 1.6;">This code is valid for 5 minutes. If you did not make this request, please ignore this email or contact support.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          <p style="font-size: 11px; color: #a0aec0; text-align: center;">&copy; 2026 BeyondSkills Platform. All rights reserved.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Verification email sent successfully to ${email}`);

    res.status(200).json({
      success: true,
      message: 'Verification OTP sent to your email address successfully.',
      isDemo: false
    });

  } catch (error) {
    console.error('SMTP Email sending error:', error);
    res.status(500).json({ error: 'Failed to send verification email. Please check server SMTP configuration.' });
  }
});

// Start listening if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}

export default app;
