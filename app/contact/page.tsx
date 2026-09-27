'use client';

import React from 'react';
import ApplicationForm from '@/components/contact/ApplicationForm';
import { useData } from '@/context/DataProvider';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ECELL_INFO } from '@/lib/constants';
import { Mail, Globe, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const { settings } = useData();
  useScrollReveal();

  return (
    <div className="pb-20">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-warm-bg pt-12 pb-12 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-warm-primary text-xs font-semibold tracking-wide mb-5">
          <span className="w-2 h-2 rounded-full bg-orange-accent" />
          <span>{ECELL_INFO.name} · CONTACT &amp; RECRUITMENT</span>
        </div>
        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-warm-primary mb-4 leading-tight">
          Connect with <span className="text-orange-accent">{ECELL_INFO.name}</span>
        </h1>
        <p className="text-base sm:text-lg text-warm-secondary leading-relaxed max-w-2xl mx-auto">
          Reach out to the {ECELL_INFO.primaryIdentity} for collaborations, event inquiries, or apply below to join our student organizing team.
        </p>
      </section>

      {/* Official Contact Channels */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href={`mailto:${ECELL_INFO.email}`}
            className="card-warm p-5 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-warm-muted">Official Email</span>
              <Mail className="w-4 h-4 text-orange-accent" />
            </div>
            <div className="text-sm font-bold text-warm-primary group-hover:text-orange-accent transition-colors break-all">
              {ECELL_INFO.email}
            </div>
            <div className="text-xs text-warm-secondary mt-1">Send us an email ↗</div>
          </a>

          <a
            href={ECELL_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="card-warm p-5 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-warm-muted">Instagram</span>
              <ExternalLink className="w-4 h-4 text-orange-accent" />
            </div>
            <div className="text-sm font-bold text-warm-primary group-hover:text-orange-accent transition-colors">
              {ECELL_INFO.instagramHandle}
            </div>
            <div className="text-xs text-warm-secondary mt-1">Follow on Instagram ↗</div>
          </a>

          <a
            href={ECELL_INFO.website}
            target="_blank"
            rel="noopener noreferrer"
            className="card-warm p-5 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-warm-muted">Website</span>
              <Globe className="w-4 h-4 text-orange-accent" />
            </div>
            <div className="text-sm font-bold text-warm-primary group-hover:text-orange-accent transition-colors">
              ecellmdu.vercel.app
            </div>
            <div className="text-xs text-warm-secondary mt-1">{ECELL_INFO.tagline}</div>
          </a>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="pb-16 max-w-4xl mx-auto px-4 sm:px-6">
        <ApplicationForm settings={settings} />
      </section>
    </div>
  );
}
