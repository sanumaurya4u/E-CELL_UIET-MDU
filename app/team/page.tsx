'use client';

import React from 'react';
import TeamCard from '@/components/team/TeamCard';
import FounderCard from '@/components/team/FounderCard';
import FacultySection from '@/components/team/FacultySection';
import SectionHeader from '@/components/ui/SectionHeader';
import CTABanner from '@/components/home/CTABanner';
import { useData } from '@/context/DataProvider';
import { departments } from '@/data/team';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function TeamPage() {
  const { team, founders, faculty } = useData();
  useScrollReveal();

  return (
    <div className="pb-20">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-warm-bg pt-12 pb-16 text-center max-w-5xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-orange-accent text-xs font-bold tracking-wider uppercase mb-5">
          <span>E-CELL | UIET MDU ROHTAK · TEAM &amp; FOUNDERS</span>
        </div>
        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-warm-primary mb-5 leading-tight">
          The student team behind <span className="text-orange-accent">E-Cell UIET MDU</span>
        </h1>
        <p className="text-base sm:text-lg text-warm-secondary leading-relaxed max-w-2xl mx-auto">
          Meet the student leaders, department heads, and founding pioneers promoting entrepreneurship &amp; innovation at UIET, MDU, Rohtak.
        </p>
      </section>

      {/* Founding Members Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Founding Pioneers"
            title="Honoring the architects of"
            italicTitle="E-Cell UIET MDU"
            subtitle="The student visionaries who founded the Entrepreneurship Cell of UIET, MDU, Rohtak and laid the foundation for student-led ventures."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {founders.map((f) => (
              <FounderCard key={f.id} founder={f} />
            ))}
          </div>
        </div>
      </section>

      {/* Core Team by Department */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Current Executive Board"
            title="Active student leadership by"
            italicTitle="department"
            subtitle="Organized across 6 core functional areas to deliver campus-wide impact."
          />

          {departments.map((dept) => {
            const deptMembers = team
              .filter((m) => m.department === dept)
              .sort((a, b) => (a.order || 99) - (b.order || 99));

            if (deptMembers.length === 0) return null;

            return (
              <div key={dept} className="mb-12 last:mb-0">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-2 w-2 rounded-full bg-orange-accent" />
                  <h3 className="font-sans font-bold text-xl tracking-tight text-warm-primary">
                    {dept}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {deptMembers.map((member) => (
                    <TeamCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Faculty Advisor Section */}
      <FacultySection faculty={faculty} />

      <CTABanner />
    </div>
  );
}
