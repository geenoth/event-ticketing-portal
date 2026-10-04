/**
 * Web3Forms (https://web3forms.com) Integration
 * Automatically delivers Cham's date RSVP, chosen day, time, and custom wishes directly to Gee's email.
 */

export interface Web3FormDatePayload {
  recipientName: string;
  senderName: string;
  venueName: string;
  venueLocation?: string;
  daySelectionLabel?: string;
  timeSlot?: string;
  cartActivities?: string[];
  specialWish?: string;
  acceptedAt?: string;
}

export interface Web3FormsResponse {
  success: boolean;
  message: string;
}

export async function submitDateSelectionsToWeb3Forms(
  data: Web3FormDatePayload,
  overrideKey?: string
): Promise<Web3FormsResponse> {
  // Retrieve access key from Vite environment variable or manual override
  const accessKey =
    overrideKey ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WEB3FORMS_ACCESS_KEY) ||
    '';

  if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
    console.warn(
      '[Web3Forms] Notice: VITE_WEB3FORMS_ACCESS_KEY is not configured yet. Set it in .env or your Vercel project environment variables to receive submissions in your email.'
    );
    return {
      success: false,
      message: 'Web3Forms access key not set',
    };
  }

  try {
    const formattedActivities =
      data.cartActivities && data.cartActivities.length > 0
        ? data.cartActivities.join(', ')
        : 'None selected';

    const payload = {
      access_key: accessKey,
      subject: `💖 Cham Accepted! Date RSVP for ${data.venueName}`,
      from_name: `A Date With ${data.recipientName}`,
      recipient_name: data.recipientName,
      sender_name: data.senderName,
      status: 'ACCEPTED (YES!)',
      venue: `${data.venueName}${data.venueLocation ? ` (${data.venueLocation})` : ''}`,
      chosen_date: data.daySelectionLabel || 'Any Weekend Afternoon (Flexible)',
      chosen_time: data.timeSlot || '3:00 PM - 5:00 PM (Afternoon)',
      extra_activities: formattedActivities,
      special_note: data.specialWish?.trim() || 'No special note provided',
      confirmed_at: data.acceptedAt || new Date().toLocaleString(),
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      console.log('[Web3Forms] Form successfully delivered to your email!');
      return { success: true, message: 'Form submitted successfully' };
    } else {
      console.warn('[Web3Forms] API returned error:', result.message);
      return { success: false, message: result.message || 'Submission failed' };
    }
  } catch (error) {
    console.error('[Web3Forms] Submission network error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
}
