'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  RiDashboard3Line,
  RiFileList3Line,
  RiCalendarEventLine,
  RiTeamLine,
  RiImage2Line,
  RiBarChartBoxLine,
  RiHandHeartLine,
  RiSettings4Line,
  RiLogoutBoxRLine,
  RiExternalLinkLine,
} from 'react-icons/ri';
import { useAdminAuth } from '@/context/AdminAuthProvider';

export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: RiDashboard3Line }],
  },
  {
    label: 'Manage',
    items: [
      { id: 'applications', label: 'Applications', icon: RiFileList3Line },
      { id: 'events', label: 'Events', icon: RiCalendarEventLine },
      { id: 'team', label: 'Team', icon: RiTeamLine },
      { id: 'gallery', label: 'Gallery', icon: RiImage2Line },
      { id: 'partners', label: 'Partners', icon: RiHandHeartLine },
    ],
  },
  {
    label: 'Site',
    items: [
      { id: 'stats', label: 'Site Stats', icon: RiBarChartBoxLine },
      { id: 'settings', label: 'Settings', icon: RiSettings4Line },
    ],
  },
];

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingCount = 0,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  pendingCount?: number;
}) {
  const { user, logout } = useAdminAuth();

  return (
    <aside className="w-[272px] shrink-0 h-screen sticky top-0 flex flex-col bg-warm-surface border-r border-warm">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-warm-secondary border border-warm flex items-center justify-center shrink-0">
            <Image src="/logo.png" alt="UIET E-Cell" width={28} height={28} className="rounded-md" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="font-sans font-semibold text-[15px] tracking-[-0.015em] text-ink">E-Cell Admin</div>
            <div className="text-xs text-muted mt-0.5">UIET · MDU Rohtak</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted px-3 mb-1.5">
              {group.label}
            </div>
            {group.items.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 py-2.5 px-3.5 rounded-full text-xs font-semibold text-left transition-all ${
                    active
                      ? 'bg-[#211B17] text-[#FCFAF6] shadow-2xs'
                      : 'text-warm-secondary hover:text-warm-primary hover:bg-warm-secondary'
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="flex-1">{tab.label}</span>
                  {tab.id === 'applications' && pendingCount > 0 && (
                    <span
                      className={`text-[10px] font-bold py-0.5 px-2 rounded-full ${
                        active ? 'bg-white text-[#211B17]' : 'bg-orange-accent text-white'
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User & actions */}
      <div className="px-4 pb-5 pt-2 flex flex-col gap-3">
        <div className="flex items-center gap-3 bg-warm-secondary border border-warm rounded-2xl p-3">
          <div className="w-8 h-8 rounded-full bg-[#211B17] text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
            {(user?.name || 'A').charAt(0)}
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-xs font-bold text-warm-primary truncate">{user?.name || 'Admin'}</div>
            <div className="text-[10px] font-semibold text-orange-accent truncate">{user?.role || 'Super Admin'}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-warm-secondary bg-warm-secondary border border-warm py-2 rounded-full hover:text-warm-primary transition-colors"
          >
            <RiExternalLinkLine size={13} /> View Site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-[#211B17] py-2 rounded-full hover:bg-black transition-colors cursor-pointer"
          >
            <RiLogoutBoxRLine size={13} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
