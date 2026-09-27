import type { TeamMember, Founder } from '@/lib/types';

export const team: TeamMember[] = [
  // Leadership
  { id: 1, name: 'Ananya Sharma', role: 'President', designation: 'President', department: 'Leadership', bio: 'Leading strategic initiatives, student entrepreneurship programs, and institutional partnerships at E-Cell UIET MDU.', year: '4th Year, B.Tech CSE', linkedin: '#', email: 'ecellmdu@gmail.com', photo: null, order: 1, display_order: 1, is_active: true },
  { id: 2, name: 'Rohan Mehta', role: 'Vice President', designation: 'Vice President', department: 'Leadership', bio: 'Overseeing cross-department operations, startup incubation support, and campus innovation drives.', year: '3rd Year, MBA', linkedin: '#', email: 'ecellmdu@gmail.com', photo: null, order: 2, display_order: 2, is_active: true },
  { id: 3, name: 'Priya Verma', role: 'General Secretary', designation: 'General Secretary', department: 'Leadership', bio: 'Coordinating executive board governance, campus outreach, and inter-department collaboration.', year: '3rd Year, B.Com (Hons)', linkedin: '#', email: null, photo: null, order: 3, display_order: 3, is_active: true },
  // Design and Tech
  { id: 4, name: 'Lakshay', role: 'Tech Lead', designation: 'Tech Lead', department: 'Design and Tech', bio: 'Architecting digital platforms, technical workshops, and product development initiatives for student builders.', year: '3rd Year, B.Tech CSE', linkedin: '#', email: 'ecellmdu@gmail.com', photo: null, order: 4, display_order: 4, is_active: true },
  { id: 5, name: 'Divya Singh', role: 'Frontend Developer', designation: 'Frontend Developer', department: 'Design and Tech', bio: 'Building responsive web experiences and interactive interfaces for E-Cell portals and campus events.', year: '2nd Year, B.Tech CSE', linkedin: '#', email: null, photo: null, order: 5, display_order: 5, is_active: true },
  { id: 6, name: 'Harsh Yadav', role: 'Backend Developer', designation: 'Backend Developer', department: 'Design and Tech', bio: 'Managing database systems, API integrations, and backend infrastructure for student startup tools.', year: '3rd Year, B.Tech CSE', linkedin: '#', email: null, photo: null, order: 6, display_order: 6, is_active: true },
  { id: 7, name: 'Kritika Jain', role: 'UI/UX Designer', designation: 'UI/UX Designer', department: 'Design and Tech', bio: 'Designing brand visuals, user experiences, and event creatives across E-Cell initiatives.', year: '2nd Year, B.Des', linkedin: '#', email: null, photo: null, order: 7, display_order: 7, is_active: true },
  // Social Media
  { id: 8, name: 'Sahil Arora', role: 'Social Media Lead', designation: 'Social Media Lead', department: 'Social Media', bio: 'Driving digital campaigns, founder spotlights, and community engagement across social channels.', year: '3rd Year, MBA', linkedin: '#', email: null, photo: null, order: 8, display_order: 8, is_active: true },
  { id: 9, name: 'Nidhi Chauhan', role: 'Video & Reels Editor', designation: 'Video & Reels Editor', department: 'Social Media', bio: 'Producing event highlights, speaker reels, and visual storytelling for campus entrepreneurship.', year: '2nd Year, BBA', linkedin: '#', email: null, photo: null, order: 9, display_order: 9, is_active: true },
  { id: 10, name: 'Varun Bhatia', role: 'Brand Manager', designation: 'Brand Manager', department: 'Social Media', bio: 'Ensuring consistent brand voice, public relations, and promotional outreach across MDU.', year: '3rd Year, BBA', linkedin: '#', email: null, order: 10, display_order: 10, is_active: true, photo: null },
  // Research and Content
  { id: 11, name: 'Tushar Garg', role: 'Research Lead', designation: 'Research Lead', department: 'Research and Content', bio: 'Curating startup case studies, market insights, and educational resources for student founders.', year: '4th Year, B.Com (Hons)', linkedin: '#', email: null, photo: null, order: 11, display_order: 11, is_active: true },
  { id: 12, name: 'Sneha Bansal', role: 'Content Strategist', designation: 'Content Strategist', department: 'Research and Content', bio: 'Crafting newsletters, event playbooks, and editorial narratives for E-Cell UIET MDU.', year: '3rd Year, B.Com', linkedin: '#', email: null, photo: null, order: 12, display_order: 12, is_active: true },
  // Event Management
  { id: 13, name: 'Karan Malik', role: 'Events Head', designation: 'Events Head', department: 'Event Management', bio: 'Spearheading flagship ideathons, Eureka pitching competitions, and speaker sessions on campus.', year: '3rd Year, B.Tech ECE', linkedin: '#', email: null, photo: null, order: 13, display_order: 13, is_active: true },
  { id: 14, name: 'Pooja Rawat', role: 'Event Coordinator', designation: 'Event Coordinator', department: 'Event Management', bio: 'Managing participant registrations, speaker hospitality, and on-ground workshop execution.', year: '2nd Year, B.Sc', linkedin: '#', email: null, photo: null, order: 14, display_order: 14, is_active: true },
  { id: 15, name: 'Deepak Kumar', role: 'Logistics Manager', designation: 'Logistics Manager', department: 'Event Management', bio: 'Handling venue setup, resource allocation, and operational logistics for campus events.', year: '3rd Year, B.Tech ME', linkedin: '#', email: null, photo: null, order: 15, display_order: 15, is_active: true },
  // Documentation
  { id: 16, name: 'Ritika Sharma', role: 'Documentation Lead', designation: 'Documentation Lead', department: 'Documentation', bio: 'Maintaining official records, event reports, and institutional documentation for E-Cell.', year: '2nd Year, BA (Mass Comm)', linkedin: '#', email: null, photo: null, order: 16, display_order: 16, is_active: true },
  { id: 17, name: 'Mohit Tanwar', role: 'Reports & NEC Writer', designation: 'Reports & NEC Writer', department: 'Documentation', bio: 'Compiling National Entrepreneurship Challenge submissions and annual impact reports.', year: '2nd Year, BA (English)', linkedin: '#', email: null, photo: null, order: 17, display_order: 17, is_active: true },
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
