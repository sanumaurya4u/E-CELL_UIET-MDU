import type { TeamMember, Founder } from '@/lib/types';

export const team: TeamMember[] = [
  // Leadership
  { id: 1, name: 'Ananya Sharma', role: 'President', department: 'Leadership', year: '4th Year, B.Tech CSE', linkedin: '#', email: 'ecellmdu@gmail.com', photo: null, order: 1 },
  { id: 2, name: 'Rohan Mehta', role: 'Vice President', department: 'Leadership', year: '3rd Year, MBA', linkedin: '#', email: 'ecellmdu@gmail.com', photo: null, order: 2 },
  { id: 3, name: 'Priya Verma', role: 'Secretary', department: 'Leadership', year: '3rd Year, B.Com (Hons)', linkedin: '#', email: null, photo: null, order: 3 },
  // Design and Tech
  { id: 4, name: 'Lakshay', role: 'Tech Lead', department: 'Design and Tech', year: '3rd Year, B.Tech CSE', linkedin: '#', email: 'ecellmdu@gmail.com', photo: null, order: 1 },
  { id: 5, name: 'Divya Singh', role: 'Frontend Developer', department: 'Design and Tech', year: '2nd Year, B.Tech CSE', linkedin: '#', email: null, photo: null, order: 2 },
  { id: 6, name: 'Harsh Yadav', role: 'Backend Developer', department: 'Design and Tech', year: '3rd Year, B.Tech CSE', linkedin: '#', email: null, photo: null, order: 3 },
  { id: 7, name: 'Kritika Jain', role: 'UI/UX Designer', department: 'Design and Tech', year: '2nd Year, B.Des', linkedin: '#', email: null, photo: null, order: 4 },
  // Social Media
  { id: 8, name: 'Sahil Arora', role: 'Social Media Lead', department: 'Social Media', year: '3rd Year, MBA', linkedin: '#', email: null, photo: null, order: 1 },
  { id: 9, name: 'Nidhi Chauhan', role: 'Video & Reels Editor', department: 'Social Media', year: '2nd Year, BBA', linkedin: '#', email: null, photo: null, order: 2 },
  { id: 10, name: 'Varun Bhatia', role: 'Brand Manager', department: 'Social Media', year: '3rd Year, BBA', linkedin: '#', email: null, photo: null, order: 3 },
  // Research and Content
  { id: 11, name: 'Tushar Garg', role: 'Research Lead', department: 'Research and Content', year: '4th Year, B.Com (Hons)', linkedin: '#', email: null, photo: null, order: 1 },
  { id: 12, name: 'Sneha Bansal', role: 'Content Strategist', department: 'Research and Content', year: '3rd Year, B.Com', linkedin: '#', email: null, photo: null, order: 2 },
  // Event Management
  { id: 13, name: 'Karan Malik', role: 'Events Head', department: 'Event Management', year: '3rd Year, B.Tech ECE', linkedin: '#', email: null, photo: null, order: 1 },
  { id: 14, name: 'Pooja Rawat', role: 'Event Coordinator', department: 'Event Management', year: '2nd Year, B.Sc', linkedin: '#', email: null, photo: null, order: 2 },
  { id: 15, name: 'Deepak Kumar', role: 'Logistics Manager', department: 'Event Management', year: '3rd Year, B.Tech ME', linkedin: '#', email: null, photo: null, order: 3 },
  // Documentation
  { id: 16, name: 'Ritika Sharma', role: 'Documentation Lead', department: 'Documentation', year: '2nd Year, BA (Mass Comm)', linkedin: '#', email: null, photo: null, order: 1 },
  { id: 17, name: 'Mohit Tanwar', role: 'Reports & NEC Writer', department: 'Documentation', year: '2nd Year, BA (English)', linkedin: '#', email: null, photo: null, order: 2 },
];

export const founders: Founder[] = [
  {
    id: 101,
    name: 'Nitigya',
    role: 'Founding Member',
    batch: 'Founding Pioneer, UIET MDU',
    contribution: 'Co-founded E-Cell | UIET MDU Rohtak, establishing organizational structures and early campus initiatives.',
    linkedin: '#',
    photo: null,
    badge: 'Founding Member',
  },
  {
    id: 102,
    name: 'Shashwat Thakur',
    role: 'Founding Member',
    batch: 'Founding Pioneer, UIET MDU',
    contribution: 'Co-founded E-Cell | UIET MDU Rohtak, driving strategic execution, campus outreach, and student leadership.',
    linkedin: '#',
    photo: null,
    badge: 'Founding Member',
  },
  {
    id: 103,
    name: 'Deepanshu',
    role: 'Founding Member',
    batch: 'Founding Pioneer, UIET MDU',
    contribution: 'Co-founded E-Cell | UIET MDU Rohtak, building core student community networks and ecosystem partnerships.',
    linkedin: '#',
    photo: null,
    badge: 'Founding Member',
  },
  {
    id: 104,
    name: 'Azriel',
    role: 'Founding Member',
    batch: 'Founding Pioneer, UIET MDU',
    contribution: 'Co-founded E-Cell | UIET MDU Rohtak, pioneering event operations and student engagement programs.',
    linkedin: '#',
    photo: null,
    badge: 'Founding Member',
  },
];

export const departments: string[] = [
  'Leadership',
  'Social Media',
  'Design and Tech',
  'Research and Content',
  'Event Management',
  'Documentation',
];
