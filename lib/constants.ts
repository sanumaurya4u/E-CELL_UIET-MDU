export const ECELL_INFO = {
  name: 'E-Cell | UIET MDU Rohtak',
  shortName: 'E-Cell UIET MDU',
  primaryIdentity: 'Entrepreneurship Cell of UIET, MDU, Rohtak',
  tagline: 'Ideas into Impact',
  description: 'Promoting entrepreneurship & innovation at UIET',
  focus: 'Student-led ventures',
  coreMessaging:
    'E-Cell, UIET MDU is the student-driven Entrepreneurship Cell of UIET, Maharshi Dayanand University, Rohtak — focused on building startup culture, promoting innovation, and encouraging students to transform ideas into meaningful ventures.',
  email: 'ecellmdu@gmail.com',
  instagramHandle: '@ecellmdu',
  instagram: 'https://www.instagram.com/ecellmdu/',
  website: 'https://ecellmdu.vercel.app/',
  address: 'UIET Building, MDU Campus, Rohtak, Haryana - 124001',
  logo: '/logo.png',
  favicon: '/favicon.png',
} as const;

export const SITE = {
  name: ECELL_INFO.name,
  shortName: ECELL_INFO.shortName,
  fullName: ECELL_INFO.primaryIdentity,
  tagline: ECELL_INFO.tagline,
  description: ECELL_INFO.description,
  focus: ECELL_INFO.focus,
  vision: 'Ideas into Impact',
  mission: 'Promoting entrepreneurship & innovation at UIET',
  email: ECELL_INFO.email,
  instagram: ECELL_INFO.instagram,
  instagramHandle: ECELL_INFO.instagramHandle,
  url: ECELL_INFO.website,
  address: ECELL_INFO.address,
};

import type { NavLink, Pillar, CoreValue, FAQItem } from './types';

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/startups', label: 'Startups' },
  { href: '/mentorship', label: 'Mentorship' },
  { href: '/resources', label: 'Resources' },
  { href: '/team', label: 'Team' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const PILLARS: Pillar[] = [
  {
    number: '01',
    title: 'Ideas into Impact',
    description: 'Encouraging students across UIET to explore practical problem-solving and transform early concepts into meaningful ventures.',
    image: '/gallery/page_32.jpg',
  },
  {
    number: '02',
    title: 'Entrepreneurial Learning',
    description: 'Hands-on workshops, speaker sessions, and technical masterclasses that build real-world startup and execution skills.',
    image: '/gallery/page_43.jpg',
  },
  {
    number: '03',
    title: 'Student-Led Ventures',
    description: 'Pitch competitions, campus ideathons, and peer feedback circles to help student teams validate and launch their projects.',
    image: '/gallery/page_3.jpg',
  },
  {
    number: '04',
    title: 'Mentorship & Collaboration',
    description: 'Connecting aspiring student founders across engineering and university departments with alumni mentors and faculty advisors.',
    image: '/gallery/page_20.jpg',
  },
];

export const CORE_VALUES: CoreValue[] = [
  {
    number: '01',
    label: 'Ideas into Impact',
    title: 'Learning by Building',
    description: 'We encourage students to test ideas early, build working prototypes, and solve real problems starting right on campus.',
  },
  {
    number: '02',
    label: 'Collaboration',
    title: 'Cross-Branch Teamwork',
    description: 'Strong student ventures bring together engineering, design, operations, and research minds across UIET and MDU.',
  },
  {
    number: '03',
    label: 'Student-Led Culture',
    title: 'Consistent Ownership',
    description: 'Every workshop, pitching competition, and campus initiative is planned and executed by students for the student community.',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is E-Cell | UIET MDU Rohtak?',
    answer: 'E-Cell, UIET MDU is the student-driven Entrepreneurship Cell of UIET, Maharshi Dayanand University, Rohtak — focused on promoting entrepreneurship & innovation at UIET and encouraging students to transform ideas into meaningful ventures.',
  },
  {
    question: 'Who can join E-Cell | UIET MDU Rohtak?',
    answer: 'Any student enrolled at UIET or MDU Rohtak across engineering, management, commerce, or science streams can apply to join the team or participate in our events.',
  },
  {
    question: 'How do I apply to become a team member?',
    answer: 'Visit our Contact / Join page and submit the membership application form. The executive board reviews applications and reaches out via email.',
  },
  {
    question: 'Which teams operate within E-Cell?',
    answer: 'Our student team is organized across Leadership, Social Media, Design & Tech, Research & Content, Event Management, and Documentation.',
  },
  {
    question: 'Are there any membership fees?',
    answer: 'No. Membership in E-Cell | UIET MDU Rohtak is completely free for students.',
  },
  {
    question: 'How can I stay updated on upcoming events?',
    answer: 'Check our Events page on the website or follow our official Instagram handle @ecellmdu for event announcements, workshops, and pitching competitions.',
  },
];
