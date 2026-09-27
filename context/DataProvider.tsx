'use client';

import React, { createContext, useContext, useState, useEffect, type Dispatch, type SetStateAction, type ReactNode } from 'react';
import { events as defaultEvents } from '@/data/events';
import { team as defaultTeam, founders as defaultFounders } from '@/data/team';
import { sponsors as defaultSponsors } from '@/data/sponsors';
import { stats as defaultStats } from '@/data/stats';
import { gallery as defaultGallery } from '@/data/gallery';
import { faculty as defaultFaculty } from '@/data/faculty';
import { settings as defaultSettings } from '@/data/settings';
import { supabase } from '@/lib/supabase';
import type {
  EventItem,
  TeamMember,
  Founder,
  Sponsor,
  SiteStats,
  GalleryItem,
  Faculty,
  SiteSettings,
  Application,
  BlogPost,
} from '@/lib/types';

interface DataContextValue {
  events: EventItem[];
  setEvents: Dispatch<SetStateAction<EventItem[]>>;
  team: TeamMember[];
  setTeam: Dispatch<SetStateAction<TeamMember[]>>;
  founders: Founder[];
  setFounders: Dispatch<SetStateAction<Founder[]>>;
  sponsors: Sponsor[];
  setSponsors: Dispatch<SetStateAction<Sponsor[]>>;
  stats: SiteStats;
  setStats: Dispatch<SetStateAction<SiteStats>>;
  gallery: GalleryItem[];
  setGallery: Dispatch<SetStateAction<GalleryItem[]>>;
  faculty: Faculty;
  setFaculty: Dispatch<SetStateAction<Faculty>>;
  settings: SiteSettings;
  setSettings: Dispatch<SetStateAction<SiteSettings>>;
  applications: Application[];
  setApplications: Dispatch<SetStateAction<Application[]>>;
  blogs: BlogPost[];
  setBlogs: Dispatch<SetStateAction<BlogPost[]>>;
  isLoading: boolean;
  refreshData: () => void;
}

const DataContext = createContext<DataContextValue>({
  events: defaultEvents,
  setEvents: () => {},
  team: defaultTeam,
  setTeam: () => {},
  founders: defaultFounders,
  setFounders: () => {},
  sponsors: defaultSponsors,
  setSponsors: () => {},
  stats: defaultStats,
  setStats: () => {},
  gallery: defaultGallery,
  setGallery: () => {},
  faculty: defaultFaculty,
  setFaculty: () => {},
  settings: defaultSettings,
  setSettings: () => {},
  applications: [],
  setApplications: () => {},
  blogs: [],
  setBlogs: () => {},
  isLoading: false,
  refreshData: () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>(defaultEvents);
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);
  const [founders, setFounders] = useState<Founder[]>(defaultFounders);
  const [sponsors, setSponsors] = useState<Sponsor[]>(defaultSponsors);
  const [stats, setStats] = useState<SiteStats>(defaultStats);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [faculty, setFaculty] = useState<Faculty>(defaultFaculty);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [applications, setApplications] = useState<Application[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiveSupabase = async () => {
    if (!supabase) return;
    try {
      setIsLoading(true);

      // 1. Team (active members ordered by display_order)
      const { data: teamData, error: teamErr } = await supabase
        .from('team')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('order', { ascending: true });
      if (!teamErr && teamData) {
        setTeam(teamData);
      }

      // 2. Events
      const { data: eventsData, error: eventsErr } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });
      if (!eventsErr && eventsData && eventsData.length > 0) {
        setEvents(eventsData);
      }

      // 3. Sponsors
      const { data: sponsorsData, error: sponsorsErr } = await supabase
        .from('sponsors')
        .select('*');
      if (!sponsorsErr && sponsorsData && sponsorsData.length > 0) {
        setSponsors(sponsorsData);
      }

      // 4. Stats
      const { data: statsData, error: statsErr } = await supabase
        .from('stats')
        .select('*')
        .limit(1)
        .single();
      if (!statsErr && statsData) {
        setStats({
          members: { value: statsData.members || 15, label: 'Active Student Members', suffix: '+' },
          events: { value: statsData.events || 5, label: 'Events & Workshops', suffix: '+' },
          startups: { value: statsData.startups || 2, label: 'Student Startups', suffix: '+' },
          years: { value: statsData.years || 2, label: 'Years of Activity', suffix: '+' },
        });
      }

      // 5. Site Images / Gallery
      const { data: imgData, error: imgErr } = await supabase
        .from('site_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (!imgErr && imgData && imgData.length > 0) {
        setGallery(
          imgData.map((img: any) => ({
            id: img.id,
            title: img.title,
            category: img.category || 'Events',
            image: img.image_url,
            description: img.description || '',
          }))
        );
      }

      // 6. Blogs
      const { data: blogsData, error: blogsErr } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!blogsErr && blogsData) {
        setBlogs(blogsData);
      }
    } catch (err) {
      console.warn('[DataProvider] Supabase fetch fallback to static:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (supabase) {
        await fetchLiveSupabase();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DataContext.Provider
      value={{
        events,
        setEvents,
        team,
        setTeam,
        founders,
        setFounders,
        sponsors,
        setSponsors,
        stats,
        setStats,
        gallery,
        setGallery,
        faculty,
        setFaculty,
        settings,
        setSettings,
        applications,
        setApplications,
        blogs,
        setBlogs,
        isLoading,
        refreshData: fetchLiveSupabase,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
