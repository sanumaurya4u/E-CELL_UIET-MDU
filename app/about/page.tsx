'use client';

import React from 'react';
import VisionMission from '@/components/about/VisionMission';
import OurStory from '@/components/about/OurStory';
import CoreValues from '@/components/about/CoreValues';
import GalleryGrid from '@/components/about/GalleryGrid';
import CTABanner from '@/components/home/CTABanner';
import { useData } from '@/context/DataProvider';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ECELL_INFO } from '@/lib/constants';

export default function AboutPage() {
  const { gallery } = useData();
  useScrollReveal();

  return (
    <div className="pb-20">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-warm-bg pt-12 pb-14 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-warm-primary text-xs font-semibold tracking-wide mb-5">
          <span className="w-2 h-2 rounded-full bg-orange-accent" />
          <span>{ECELL_INFO.name}</span>
        </div>
        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-warm-primary mb-5 leading-tight">
          Ideas into <span className="text-orange-accent">Impact</span>
        </h1>
        <p className="text-base sm:text-lg text-warm-primary font-semibold mb-3">
          {ECELL_INFO.primaryIdentity} — {ECELL_INFO.description}
        </p>
        <p className="text-sm sm:text-base text-warm-secondary leading-relaxed max-w-2xl mx-auto">
          E-Cell, UIET MDU is a student-driven entrepreneurship and innovation platform focused on
          encouraging students to transform ideas into meaningful ventures through mentorship,
          collaboration, and entrepreneurial learning.
        </p>
      </section>

      <VisionMission />
      <OurStory />
      <CoreValues />
      <GalleryGrid gallery={gallery} />
      <CTABanner />
    </div>
  );
}
