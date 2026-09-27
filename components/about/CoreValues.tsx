import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { CORE_VALUES } from '@/lib/constants';

export default function CoreValues() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Core Messaging"
          title="Principles that guide"
          italicTitle="our community"
          subtitle="How we collaborate, learn, and support student-led ventures at UIET MDU."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CORE_VALUES.map((val, idx) => (
            <div
              key={idx}
              className="reveal card-warm p-8 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-sans font-extrabold text-lg text-orange-accent">{val.number}</span>
                <span className="text-xs font-semibold text-warm-secondary bg-warm-secondary border border-warm py-1 px-3 rounded-full">
                  {val.label}
                </span>
              </div>
              <h3 className="font-sans font-bold text-xl tracking-tight text-warm-primary">
                {val.title}
              </h3>
              <p className="text-sm leading-relaxed text-warm-secondary">{val.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
