'use client';

import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import {
  RiLightbulbFlashLine,
  RiSlideshow3Line,
  RiTrophyLine,
  RiRocket2Line,
} from 'react-icons/ri';

const pillars = [
  {
    icon: RiLightbulbFlashLine,
    title: 'Entrepreneurial Mindset',
    description: 'Inspiring students to think creatively, embrace innovation, and explore new ideas beyond traditional career paths.',
    iconClass: 'bg-porangebg text-porangedeep',
    link: '/about',
    linkText: 'Learn About E-Cell',
  },
  {
    icon: RiSlideshow3Line,
    title: 'Workshops & Masterclasses',
    description: 'Hands-on workshops, technical frameworks, and actionable skills to empower students across campus.',
    iconClass: 'bg-pbluebg text-pbluedeep',
    link: '/events',
    linkText: 'Explore Workshops',
  },
  {
    icon: RiTrophyLine,
    title: 'Ideathons & Competitions',
    description: 'Student ideathons, pitch showcases, and speaker sessions designed to share knowledge and inspire.',
    iconClass: 'bg-ppinkbg text-ppinkdeep',
    link: '/events',
    linkText: 'See Events',
  },
  {
    icon: RiRocket2Line,
    title: 'Startup Incubation & Mentorship',
    description: 'Bringing together students across engineering, management, and science streams to build ventures together.',
    iconClass: 'bg-plilacbg text-plilacdeep',
    link: '/contact',
    linkText: 'Get Mentorship',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-[clamp(56px,7vw,80px)]">
      <div className="max-w-[1272px] mx-auto px-6">
        <SectionHeader
          badge="E-Cell | UIET MDU Rohtak"
          title="Turning student ideas into"
          italicTitle="real-world impact"
          subtitle="Promoting entrepreneurship & innovation at UIET through startup workshops, events, hackathons, mentorship, and student-led ventures."
        />

        {/* Services inside one big bordered container — reference layout */}
        <div className="reveal bg-white border border-border rounded-panel p-[clamp(28px,4vw,48px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(32px,5vw,72px)] gap-y-[clamp(32px,4vw,56px)] mb-[clamp(36px,5vw,56px)]">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="flex flex-col gap-5">
                  <div className={`flex items-center justify-center w-[60px] h-[60px] rounded-card shrink-0 ${p.iconClass}`}>
                    <Icon size={28} />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <h3 className="font-sans font-medium text-[clamp(22px,2.4vw,28px)] tracking-[-0.025em] leading-[1.2] text-ink">
                      {p.title}
                    </h3>
                    <p className="text-[15px] leading-[1.6] text-secondary max-w-[440px]">{p.description}</p>
                    <a
                      href={p.link}
                      className="text-[15px] font-medium text-ink underline underline-offset-4 decoration-[rgba(27,29,30,0.3)] w-fit transition-[text-decoration-color] duration-200 hover:decoration-ink"
                    >
                      {p.linkText}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dark CTA banner inside the same container */}
          <div className="bg-ink text-white rounded-card py-8 px-10 flex items-center justify-between gap-6 flex-wrap">
            <div className="flex flex-col gap-1.5">
              <div className="text-[13px] text-white/55 font-medium uppercase tracking-[0.06em]">
                Ideas into Impact
              </div>
              <h3 className="font-sans font-medium text-[clamp(20px,2.5vw,28px)] tracking-[-0.03em] text-white">
                Start Your Entrepreneurial Journey with E-Cell | UIET MDU Rohtak!
              </h3>
            </div>
            <div className="flex items-center gap-3.5 flex-wrap">
              <Button href="/contact" variant="white" size="md" arrow>
                Join E-Cell UIET MDU
              </Button>
              <Button href="/events" variant="outline" size="md" arrow onDark>
                Explore Events
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
