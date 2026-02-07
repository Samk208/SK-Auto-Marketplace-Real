/**
 * Resend Email Client
 *
 * Configured to use Resend API for sending transactional emails
 * API Key should be set in RESEND_API_KEY environment variable
 *
 * Uses lazy initialization to avoid build-time errors when the
 * API key is not available (e.g. in CI environments).
 */

import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      console.warn(
        "Warning: RESEND_API_KEY is not set. Email sending will fail.",
      );
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// Default sender email
export const FROM_EMAIL = "SK AutoSphere <noreply@skautosphere.com>";

// You can configure this based on your domain
export const REPLY_TO_EMAIL = "support@skautosphere.com";
