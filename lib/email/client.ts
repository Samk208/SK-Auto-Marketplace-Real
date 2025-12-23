/**
 * Resend Email Client
 * 
 * Configured to use Resend API for sending transactional emails
 * API Key should be set in RESEND_API_KEY environment variable
 */

import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('Warning: RESEND_API_KEY is not set. Email sending will fail.');
}

export const resend = new Resend(process.env.RESEND_API_KEY || '');

// Default sender email
export const FROM_EMAIL = 'SK AutoSphere <noreply@skautosphere.com>';

// You can configure this based on your domain
export const REPLY_TO_EMAIL = 'support@skautosphere.com';
