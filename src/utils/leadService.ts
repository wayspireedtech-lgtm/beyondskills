import { saveLeadToSupabase } from './supabaseClient';

export interface LeadData {
  formId: string;
  [key: string]: any;
}

export interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class LeadService {
  private static getUTMParams(): Record<string, string> {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmTerm: params.get('utm_term') || '',
      utmContent: params.get('utm_content') || ''
    };
  }

  public static async submitLead(formData: LeadData): Promise<WebhookResponse> {
    const utmParams = this.getUTMParams();
    
    // Prepare complete payload
    const payload = {
      ...formData,
      ...utmParams,
      pageUrl: window.location.href,
      pageName: document.title,
      referrer: document.referrer || '',
      leadSource: utmParams.utmSource || 'Organic'
    };

    // 1. Centralized Supabase save
    try {
      await saveLeadToSupabase({
        ...payload,
        type: formData.formId, // Match Supabase column types
        program: formData.program || formData.course || 'General'
      });
    } catch (sbErr) {
      console.error('Error saving lead to Supabase inside LeadService:', sbErr);
    }

    // 2. Webhook post to Google Sheets with retry configuration
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? (window.location.port === '5173' ? 'http://localhost:5001' : 'http://localhost:5000')
          : window.location.origin;

        const response = await fetch(`${apiHost}/api/webhook/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP Error Status: ${response.status}`);
        }

        const resData: WebhookResponse = await response.json();
        if (resData.success) {
          return resData;
        } else {
          throw new Error(resData.error || 'Server returned failure response.');
        }
      } catch (err) {
        attempt++;
        console.warn(`[Lead Capture Attempt ${attempt}/${maxRetries} failed]:`, err);
        if (attempt >= maxRetries) {
          console.error('[Lead Capture Failed completely after max retries]');
          return { success: false, error: err instanceof Error ? err.message : String(err) };
        }
        // Small exponential delay before retry
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }

    return { success: false, error: 'Maximum attempts reached.' };
  }
}
