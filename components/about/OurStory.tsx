import React from 'react';
import { ECELL_INFO } from '@/lib/constants';

export default function OurStory() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal bg-warm-secondary border border-warm rounded-3xl p-8 md:p-12">
          <div className="text-xs font-bold text-orange-accent uppercase tracking-wider mb-3">
            Who We Are
          </div>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight text-warm-primary mb-5">
            About <span className="text-orange-accent">{ECELL_INFO.name}</span>
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-warm-primary font-medium max-w-3xl mb-4">
            E-Cell, UIET MDU is a student-driven entrepreneurship and innovation platform focused on
            encouraging students to transform ideas into meaningful ventures.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-warm-secondary max-w-3xl">
            As the {ECELL_INFO.primaryIdentity}, we bring together students from engineering and
            university departments to explore startup culture, participate in pitching competitions
            and campus ideathons, learn from mentors, and build student-led ventures together.
          </p>
        </div>
      </div>
    </section>
  );
}
