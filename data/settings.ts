import type { SiteSettings } from '@/lib/types';

export const settings: SiteSettings = {
  announcementBanner: {
    enabled: false,
    text: 'Applications Open for Batch 2026-27',
    linkText: 'Apply Now ↗',
    linkUrl: '/contact',
  },
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'ca0b970d-2396-4be4-96d0-f4f2697acddc',
  siteInfo: {
    email: 'ecellmdu@gmail.com',
    phone: '',
    address: 'UIET Building, MDU Campus, Rohtak, Haryana - 124001',
    instagram: 'https://www.instagram.com/ecellmdu/',
    linkedin: '',
    twitter: '',
    youtube: '',
  },
  emailTemplates: {
    received: {
      subject: 'Application Received — E-Cell | UIET MDU Rohtak',
      body: 'Dear {{applicant_name}},\n\nThank you for applying to join E-Cell | UIET MDU Rohtak ({{department}} Department). We have received your application and our team is currently reviewing it.\n\nWe will update you shortly.\n\nBest regards,\nE-Cell | UIET MDU Rohtak\n{{ecell_email}}',
    },
    shortlisted: {
      subject: 'Interview Update — Shortlisted for E-Cell | UIET MDU Rohtak ({{department}})',
      body: 'Dear {{applicant_name}},\n\nCongratulations! Your application for the {{department}} Department at E-Cell | UIET MDU Rohtak has been shortlisted for an interaction.\n\nPlease reply to this email if you have any questions.\n\nBest of luck!\nE-Cell | UIET MDU Rohtak\n{{ecell_email}}',
    },
    accepted: {
      subject: 'Welcome to E-Cell | UIET MDU Rohtak',
      body: 'Dear {{applicant_name}},\n\nWe are glad to inform you that your application for the {{department}} Department at E-Cell | UIET MDU Rohtak has been accepted.\n\nWelcome to the team!\nE-Cell | UIET MDU Rohtak',
    },
    rejected: {
      subject: 'Update regarding your E-Cell | UIET MDU Rohtak Application',
      body: 'Dear {{applicant_name}},\n\nThank you for taking the time to apply for E-Cell | UIET MDU Rohtak. While we appreciated your interest, we are unable to offer a position in the {{department}} Department for this cycle.\n\nWe encourage you to participate in our upcoming workshops and events!\n\nWarm regards,\nE-Cell | UIET MDU Rohtak',
    },
  },
};
