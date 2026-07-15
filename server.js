import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import fs from 'fs';

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.error('Error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in environment variables.');
  process.exit(1);
}

// Initialize Razorpay SDK instance
const razorpayInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

/**
 * STEP 1: Create Order
 * Endpoint: POST /api/create-order
 * Request body: { amount (paise), receipt }
 * Response: { order_id, amount, currency }
 */
app.post('/api/create-order', async (req, res) => {
  try {
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
const LEADS_FILE = './leads_db.json';

// GET: Fetch all webhook leads
app.get('/api/webhook/leads', (req, res) => {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      return res.status(200).json([]);
    }
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    res.status(200).json(JSON.parse(data || '[]'));
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to retrieve leads from database.' });
  }
});

// POST: Add new lead (from Google Apps Script webhook / Ads triggers)
app.post('/api/webhook/leads', (req, res) => {
  try {
    const { name, email, phone, type, program, notes } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and Phone fields are required.' });
    }

    let existingLeads = [];
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      existingLeads = JSON.parse(data || '[]');
    }

    // Check if phone already exists in server webhook DB
    if (existingLeads.some(l => l.phone === phone)) {
      return res.status(200).json({ success: false, message: 'Lead with this phone number already exists.' });
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
      profession: 'Unspecified',
      mentor: 'None',
      duration: 'None',
      callAttempts: { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
      history: notes ? [{ note: notes, date: new Date().toISOString() }] : []
    };

    existingLeads.push(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(existingLeads, null, 2), 'utf-8');

    res.status(201).json({ success: true, message: 'Lead recorded successfully.', lead: newLead });
  } catch (error) {
    console.error('Error saving lead via webhook:', error);
    res.status(500).json({ error: 'Internal server error while processing webhook.' });
  }
});

// Start listening
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
