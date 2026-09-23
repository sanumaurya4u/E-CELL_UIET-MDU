'use client';

import React from 'react';
import VisionMission from '@/components/about/VisionMission';
import OurStory from '@/components/about/OurStory';
import CoreValues from '@/components/about/CoreValues';
import GalleryGrid from '@/components/about/GalleryGrid';
import CTABanner from '@/components/home/CTABanner';
import { useData } from '@/context/DataProvider';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Sparkles } from 'lucide-react';

export default function AboutPage() {
  const { gallery } = useData();
  useScrollReveal();

  return (
    <div className="pb-20">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-warm-bg pt-12 pb-16 text-center max-w-5xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-orange-accent text-xs font-bold tracking-wider uppercase mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>UIET E-CELL · OVERVIEW</span>
        </div>
        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-warm-primary mb-5 leading-tight">
          Inspiring a generation of <span className="text-orange-accent">changemakers</span>
        </h1>
        <p className="text-base sm:text-lg text-warm-secondary leading-relaxed max-w-2xl mx-auto">
          Learn. Collaborate. Showcase. The official Entrepreneurship Cell of UIET, Maharshi Dayanand
          University, Rohtak — building a high-impact founder culture on campus.
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
