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
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiveSupabase = async () => {
    if (!supabase) return;
    try {
      setIsLoading(true);

      // 1. Team
      const { data: teamData, error: teamErr } = await supabase
        .from('team')
        .select('*')
        .order('order', { ascending: true });
      if (!teamErr && teamData && teamData.length > 0) {
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

      // 5. Applications
      const { data: appsData, error: appsErr } = await supabase
        .from('applications')
        .select('*')
        .order('id', { ascending: false });
      if (!appsErr && appsData) {
        setApplications(appsData);
      }
    } catch (err) {
      console.warn('[DataProvider] Supabase fetch fallback to static:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      // 1. Try loading cached local storage
      try {
        if (typeof window !== 'undefined') {
          const cachedApps = localStorage.getItem('ECELL_APPLICATIONS');
          if (cachedApps) setApplications(JSON.parse(cachedApps));

          const cachedEvents = localStorage.getItem('ECELL_EVENTS');
          if (cachedEvents) setEvents(JSON.parse(cachedEvents));

          const cachedTeam = localStorage.getItem('ECELL_TEAM');
          if (cachedTeam) setTeam(JSON.parse(cachedTeam));

          const cachedSponsors = localStorage.getItem('ECELL_SPONSORS');
          if (cachedSponsors) setSponsors(JSON.parse(cachedSponsors));

          const cachedStats = localStorage.getItem('ECELL_STATS');
          if (cachedStats) setStats(JSON.parse(cachedStats));

          const cachedGallery = localStorage.getItem('ECELL_GALLERY');
          if (cachedGallery) setGallery(JSON.parse(cachedGallery));

          const cachedSettings = localStorage.getItem('ECELL_SETTINGS');
          if (cachedSettings) setSettings(JSON.parse(cachedSettings));
        }
      } catch (e) {
        console.warn('[DataProvider] LocalStorage load note:', e);
      }

      // 2. Fetch live from Supabase if configured
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
