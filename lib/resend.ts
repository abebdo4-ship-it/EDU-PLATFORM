import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_fallback_key')

// The default sender email address based on your domain setup in Resend
export const defaultSender = "Acme <onboarding@resend.dev>" // Replace with your verified domain (e.g. notifications@antigravity.edu) when going to production
