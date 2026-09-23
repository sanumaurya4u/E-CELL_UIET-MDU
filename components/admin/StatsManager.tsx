'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastProvider';
import { supabase } from '@/lib/supabase';
import { PageHeader, adminInput, adminLabel, adminCard } from './ui';
import type { SiteStats } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';

interface StatField {
  key: 'members' | 'events' | 'startups' | 'years';
  label: string;
  hint: string;
}

const FIELDS: StatField[] = [
  { key: 'members', label: 'Active Student Members', hint: 'Shown as +N on the homepage counters' },
  { key: 'events', label: 'Events & Workshops', hint: 'Total events and masterclasses hosted' },
  { key: 'startups', label: 'Student Startups', hint: 'Student ventures incubated' },
  { key: 'years', label: 'Years of Activity', hint: 'Since E-Cell was founded' },
];

export default function StatsManager({
  stats,
  setStats,
}: {
  stats: SiteStats;
  setStats?: Dispatch<SetStateAction<SiteStats>>;
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    members: stats?.members?.value ?? 15,
    events: stats?.events?.value ?? 5,
    startups: stats?.startups?.value ?? 2,
    years: stats?.years?.value ?? 2,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const next = {
      members: { value: Number(form.members) || 0, label: 'Active Student Members', suffix: '+' },
      events: { value: Number(form.events) || 0, label: 'Events & Workshops', suffix: '+' },
      startups: { value: Number(form.startups) || 0, label: 'Student Startups', suffix: '+' },
      years: { value: Number(form.years) || 0, label: 'Years of Activity', suffix: '+' },
    };

    if (setStats) setStats(next);
    try { localStorage.setItem('ECELL_STATS', JSON.stringify(next)); } catch {}

    if (supabase) {
      supabase
        .from('stats')
        .upsert({ id: 1, members: next.members.value, events: next.events.value, startups: next.startups.value, years: next.years.value })
        .then(undefined, (err: unknown) => console.warn('[Admin] Supabase stats persist warning:', err));
    }

    showToast('Homepage counters updated!', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Site Stats"
        subtitle="Edit the animated counters displayed on the homepage."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSave} className={`${adminCard} p-6 md:p-8 flex flex-col gap-6`}>
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className={adminLabel} htmlFor={`stat-${f.key}`}>
                {f.label}
              </label>
              <input
                id={`stat-${f.key}`}
                type="number"
                min={0}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) })}
                className={`${adminInput} max-w-[160px] [font-variant-numeric:tabular-nums]`}
              />
              <p className="text-xs text-muted mt-1.5">{f.hint}</p>
            </div>
          ))}

          <Button type="submit" variant="primary" size="md" arrow className="w-fit">
            Save Counters
          </Button>
        </form>

        {/* Live preview */}
        <div className={`${adminCard} p-6 md:p-8`}>
          <h2 className="font-sans font-medium text-base tracking-[-0.015em] text-ink mb-6">Live Preview</h2>
          <div className="grid grid-cols-2 gap-6">
            {FIELDS.map((f) => (
              <div key={f.key} className="text-center bg-soft rounded-card py-6 px-3">
                <div className="font-sans font-medium text-[clamp(32px,4vw,48px)] leading-none tracking-[-0.04em] text-ink [font-variant-numeric:tabular-nums]">
                  +{form[f.key]}
                </div>
                <div className="text-[13px] text-secondary mt-2">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
