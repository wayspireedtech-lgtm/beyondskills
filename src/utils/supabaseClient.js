import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
} else {
  console.warn(
    'Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your env settings. Operations will mock-succeed locally.'
  );
}

import { getDbItem } from './dbHelpers';
import { sendLeadWelcomeEmail } from './sendEmail';

export function getISTDateTimeString(dateVal = new Date()) {
  if (!dateVal) return '';
  const d = typeof dateVal === 'number' || typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
  if (isNaN(d.getTime())) {
    return String(dateVal);
  }
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }).format(d);
}

/**
 * Saves a brochure lead to Supabase 'leads' table
 */
export async function saveLeadToSupabase(lead) {
  if (!lead) return { data: null, error: null };



  // 2. Trigger automatic welcome email directly (with keepalive)
  if (lead && lead.email && !lead.email.includes('no-email')) {
    const rawProg = lead.course_title || lead.program || lead.type || '';
    const pLower = String(rawProg).toLowerCase();
    
    let displayProgram = 'Live Career Cohort';
    if (pLower.includes('ai') || pLower.includes('data-science') || pLower.includes('intelligence')) {
      displayProgram = 'Artificial Intelligence & Data Science Program';
    } else if (pLower.includes('full') || pLower.includes('stack') || pLower.includes('web')) {
      displayProgram = 'Full Stack Web Development Program';
    } else if (pLower.includes('cyber') || pLower.includes('security')) {
      displayProgram = 'Cybersecurity & Ethical Hacking Program';
    } else if (pLower.includes('cloud') || pLower.includes('devops')) {
      displayProgram = 'Cloud Computing & AWS Program';
    } else if (pLower.includes('digital') || pLower.includes('marketing')) {
      displayProgram = 'Digital Marketing Performance Program';
    } else if (rawProg) {
      displayProgram = rawProg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    sendLeadWelcomeEmail({
      name: lead.name,
      email: lead.email,
      program: displayProgram
    }).catch(err => console.error('[Resend Welcome Email Error]:', err));
  }

  // 3. Post to webhook in background (non-blocking with fast 1.2s timeout)
  setTimeout(() => {
    try {
      const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? (window.location.port === '5173' ? 'http://localhost:5001' : 'http://localhost:5000')
        : window.location.origin;

      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 1200);

      fetch(`${apiHost}/api/webhook/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
        signal: controller.signal
      }).then(() => clearTimeout(tid)).catch(() => clearTimeout(tid));
    } catch (e) {
      // Ignore background webhook timeout
    }
  }, 0);

  if (!supabase) {
    console.log('[Supabase MOCK] Saved lead to local database:', lead);
    return { data: lead, error: null };
  }

  // 4. Perform Supabase insert with 1.5s fast timeout to prevent UI lag
  try {
    const courseId = lead.program || lead.course_id || 'artificial-intelligence';
    const courseTitle = lead.course_title || lead.course || '';

    const leadDateTimeStr = getISTDateTimeString(new Date());

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          id: lead.id || `LD${Date.now()}`,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          status: lead.status || 'New',
          sub_status: lead.subStatus || 'QUALIFIED',
          assigned_bdm: lead.assignedBDM || '',
          assigned_bda: lead.assignedBDA || '',
          date: lead.date || leadDateTimeStr,
          type: lead.type || 'Organic Leads',
          program: courseId,
          course_id: courseId,
          course_title: courseTitle,
          profession: lead.profession || lead.job_role || 'Unspecified',
          job_role: lead.profession || lead.job_role || 'Unspecified',
          college: lead.college || lead.student_details || 'Unspecified',
          student_details: lead.college || lead.student_details || 'Unspecified',
          qualification: lead.qualification || lead.college || 'Unspecified',
          experience: lead.experience || lead.profession || 'Unspecified',
          contact_time: lead.contactTime || lead.preferredContactTime || 'Anytime',
          career_goal: lead.careerGoal || lead.goal || 'Unspecified',
          message: lead.message || '',
          mentor: lead.mentor || 'None',
          duration: lead.duration || 'None',
          call_attempts: lead.callAttempts || { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
          history: lead.history || [],
          campaign: lead.campaign || lead.utmCampaign || '',
          source: lead.source || '',
          utm_medium: lead.utmMedium || '',
          utm_campaign: lead.utmCampaign || '',
          utm_content: lead.utmContent || '',
          remarks: lead.remarks || lead.message || ''
        }
      ]);

    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ data: lead, error: null }), 1200));
    const result = await Promise.race([insertPromise, timeoutPromise]);
    
    return result;
  } catch (err) {
    console.error('[Supabase Exception] Error saving lead:', err);
    return { data: lead, error: null };
  }
}

/**
 * Fetches all leads from Supabase 'leads' table
 */
export async function getLeadsFromSupabase() {
  if (!supabase) {
    console.log('[Supabase MOCK] Fetching leads from localStorage fallback...');
    return { data: getDbItem('beyondskills_leads', []), error: null };
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[Supabase Error] Failed to fetch leads:', error);
      return { data: [], error };
    }
    
    // Map database columns to front-end lead schema
    const mappedData = data.map(dbLead => ({
      id: dbLead.id,
      name: dbLead.name,
      email: dbLead.email,
      phone: dbLead.phone,
      date: dbLead.date || new Date(dbLead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: dbLead.type || 'Ads Leads',
      program: dbLead.program || dbLead.course_id || 'artificial-intelligence',
      assignedBDM: dbLead.assigned_bdm || '',
      assignedBDA: dbLead.assigned_bda || '',
      status: dbLead.status || 'New',
      subStatus: dbLead.sub_status || 'QUALIFIED',
      profession: dbLead.profession || dbLead.job_role || 'Unspecified',
      college: dbLead.college || dbLead.student_details || 'Unspecified',
      qualification: dbLead.qualification || dbLead.college || 'Unspecified',
      experience: dbLead.experience || dbLead.profession || 'Unspecified',
      contactTime: dbLead.contact_time || dbLead.message || 'Anytime',
      goal: dbLead.career_goal || 'Unspecified',
      message: dbLead.message || '',
      mentor: dbLead.mentor || 'None',
      duration: dbLead.duration || 'None',
      callAttempts: dbLead.call_attempts || { s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', s6: '-' },
      history: dbLead.history || [],
      campaign: dbLead.campaign || dbLead.utm_campaign || '',
      source: dbLead.source || '',
      utmMedium: dbLead.utm_medium || '',
      utmCampaign: dbLead.utm_campaign || '',
      utmContent: dbLead.utm_content || '',
      remarks: dbLead.remarks || ''
    }));

    return { data: mappedData, error: null };
  } catch (err) {
    console.error('[Supabase Exception] Error fetching leads:', err);
    return { data: [], error: err };
  }
}

/**
 * Updates a lead in Supabase 'leads' table
 */
export async function updateLeadInSupabase(lead) {
  if (!supabase) {
    console.log('[Supabase MOCK] Updated lead in local database:', lead);
    return { data: lead, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .update({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        sub_status: lead.subStatus,
        assigned_bdm: lead.assignedBDM,
        assigned_bda: lead.assignedBDA,
        profession: lead.profession,
        college: lead.college,
        qualification: lead.qualification || lead.college || 'Unspecified',
        experience: lead.experience || lead.profession || 'Unspecified',
        contact_time: lead.contactTime || 'Anytime',
        career_goal: lead.goal || 'Unspecified',
        message: lead.message,
        mentor: lead.mentor,
        duration: lead.duration,
        call_attempts: lead.callAttempts,
        history: lead.history,
        remarks: lead.remarks
      })
      .eq('id', lead.id);

    if (error) {
      console.error('[Supabase Error] Failed to update lead:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('[Supabase Exception] Error updating lead:', err);
    return { data: null, error: err };
  }
}

/**
 * Saves a registered user to Supabase 'users' table
 */
export async function saveUserToSupabase(user) {
  if (!supabase) {
    console.log('[Supabase MOCK] Saved user to local database:', user);
    return { data: user, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
          student_id: user.studentId,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('[Supabase Error] Failed to insert user:', error);
      return { data: null, error };
    }
    
    console.log('[Supabase Success] User logged:', data);
    return { data, error: null };
  } catch (err) {
    console.error('[Supabase Exception] Error saving user:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetches all CRM users from Supabase 'crm_users' table
 */
export async function getCrmUsersFromSupabase() {
  if (!supabase) {
    console.log('[Supabase MOCK] Fetching CRM users from localStorage fallback...');
    return { data: getDbItem('beyondskills_crm_users', []), error: null };
  }

  try {
    const { data, error } = await supabase
      .from('crm_users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[Supabase Error] Failed to fetch CRM users:', error);
      return { data: [], error };
    }

    const mappedData = data.map(u => ({
      name: u.name,
      email: u.email,
      role: u.role,
      reportsTo: u.reports_to || '',
      password: u.password
    }));

    return { data: mappedData, error: null };
  } catch (err) {
    console.error('[Supabase Exception] Error fetching CRM users:', err);
    return { data: [], error: err };
  }
}

/**
 * Saves a CRM user to Supabase 'crm_users' table
 */
export async function saveCrmUserToSupabase(user) {
  if (!supabase) {
    console.log('[Supabase MOCK] Saved CRM user to local database:', user);
    return { data: user, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('crm_users')
      .upsert([
        {
          name: user.name,
          email: user.email,
          role: user.role,
          reports_to: user.reportsTo || '',
          password: user.password,
          created_at: new Date().toISOString()
        }
      ], { onConflict: 'email' });
    
    if (error) {
      console.error('[Supabase Error] Failed to save CRM user:', error);
      return { data: null, error };
    }
    
    console.log('[Supabase Success] CRM User saved:', data);
    return { data, error: null };
  } catch (err) {
    console.error('[Supabase Exception] Error saving CRM user:', err);
    return { data: null, error: err };
  }
}

/**
 * Deletes a CRM user from Supabase 'crm_users' table by email
 */
export async function deleteCrmUserFromSupabase(email) {
  if (!supabase) {
    console.log('[Supabase MOCK] Deleted CRM user from local database:', email);
    return { data: email, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('crm_users')
      .delete()
      .eq('email', email);
    
    if (error) {
      console.error('[Supabase Error] Failed to delete CRM user:', error);
      return { data: null, error };
    }
    
    console.log('[Supabase Success] CRM User deleted:', data);
    return { data, error: null };
  } catch (err) {
    console.error('[Supabase Exception] Error deleting CRM user:', err);
    return { data: null, error: err };
  }
}

