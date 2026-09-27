/* Shared domain types for the UIET E-Cell platform */

export interface NavLink {
  href: string;
  label: string;
}

export interface Pillar {
  number: string;
  title: string;
  description: string;
  image: string;
}

export interface CoreValue {
  number: string;
  label: string;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type EventCategory = 'orange' | 'blue' | 'pink' | 'green' | 'lilac';

export interface EventItem {
  id: number;
  title: string;
  tagline?: string;
  description?: string;
  date: string;
  time?: string;
  venue?: string;
  mode?: string;
  status?: 'upcoming' | 'past';
  tags?: string[];
  registrationUrl?: string | null;
  accentColor?: string;
  category?: EventCategory | string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  year?: string;
  linkedin?: string | null;
  email?: string | null;
  photo?: string | null;
  order?: number;
}

export interface Founder {
  id: number;
  name: string;
  role: string;
  batch?: string;
  contribution?: string;
  linkedin?: string | null;
  photo?: string | null;
  badge?: string;
}

export interface Faculty {
  name: string;
  role?: string;
  designation?: string;
  email?: string;
  photo?: string;
  bio?: string;
}

export interface Sponsor {
  id: number;
  name: string;
  url?: string;
  tier?: string;
  initials?: string;
  color?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
}

export interface StatEntry {
  value: number;
  label: string;
  suffix?: string;
}

export interface SiteStats {
  members: StatEntry;
  events: StatEntry;
  startups: StatEntry;
  years: StatEntry;
}

export interface AnnouncementBanner {
  enabled: boolean;
  text: string;
  linkText?: string;
  linkUrl?: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface SiteSettings {
  announcementBanner: AnnouncementBanner;
  web3formsKey: string;
  siteInfo: {
    email: string;
    phone: string;
    address: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  emailTemplates?: Record<string, EmailTemplate>;
}

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export interface Application {
  id: number;
  name: string;
  enrollment?: string;
  email?: string;
  phone?: string;
  branchYear?: string;
  branchyear?: string;
  deptInterest?: string;
  deptinterest?: string;
  whyJoin?: string;
  whyjoin?: string;
  linkedin?: string | null;
  status?: string;
  submittedOn?: string;
  submittedon?: string;
  notes?: string;
  history?: Array<{ status: string; by: string; date: string }>;
  [key: string]: unknown;
}

export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  additional_images?: string[];
  category: string;
  tags: string[];
  author_name: string;
  author_designation: string | null;
  source_url: string | null;
  source_name: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  status: BlogStatus;
  is_featured: boolean;
  reading_time: number | null;
  seo_title: string | null;
  seo_description: string | null;
}

export type BlogFormData = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;

