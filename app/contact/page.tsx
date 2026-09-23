'use client';

import React from 'react';
import ApplicationForm from '@/components/contact/ApplicationForm';
import { useData } from '@/context/DataProvider';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Sparkles } from 'lucide-react';

export default function ContactPage() {
  const { settings } = useData();
  useScrollReveal();

  return (
    <div className="pb-20">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-warm-bg pt-12 pb-16 text-center max-w-5xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-orange-accent text-xs font-bold tracking-wider uppercase mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>UIET E-CELL · RECRUITMENT 2026</span>
        </div>
        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-warm-primary mb-5 leading-tight">
          Love to have you with us — <span className="text-orange-accent">join UIET E-Cell</span>
        </h1>
        <p className="text-base sm:text-lg text-warm-secondary leading-relaxed max-w-2xl mx-auto">
          Fill out your details below. Join 6 active departments and help build the premier student
          entrepreneurial ecosystem at MDU Rohtak.
        </p>
      </section>

      {/* Application Form Section */}
      <section className="pb-16 max-w-4xl mx-auto px-4 sm:px-6">
        <ApplicationForm settings={settings} />
      </section>
    </div>
  );
}
