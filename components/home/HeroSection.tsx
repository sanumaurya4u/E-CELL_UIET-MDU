'use client';

import React, { useRef } from 'react';
import Button from '@/components/ui/Button';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '[data-hero="headline"]',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.9 }
      )
        .fromTo(
          '[data-hero="subtitle"]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          '[data-hero="actions"]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="hero" className="relative block w-full overflow-hidden bg-white">
      {/* Full-bleed ambient background — gradient + mesh together fade
          out toward the bottom so the hero blends into the page */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[linear-gradient(71deg,rgba(217,243,252,0.38)_11%,rgba(235,248,253,0.45)_45.7%,rgba(255,255,255,0.54)_64.5%,rgba(253,241,211,0.66)_100%)] [mask-image:linear-gradient(to_bottom,black_55%,transparent_92%)] [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_92%)]" />

      <div className="relative z-[1] max-w-[1000px] mx-auto text-center flex flex-col items-center pt-[clamp(150px,18vw,190px)] pb-[clamp(72px,9vw,110px)] px-6">
        <h1
          data-hero="headline"
          className="font-sans font-medium text-[clamp(42px,7.4vw,96px)] leading-[1.05] tracking-[-0.045em] text-ink mb-[26px] [text-wrap:balance]"
        >
          Turning student{' '}
          <span className="font-serif italic font-normal tracking-[-0.01em] text-ink text-[1.05em]">
            Ideas into Impact
          </span>
        </h1>

        <p
          data-hero="subtitle"
          className="text-[clamp(16px,1.8vw,18px)] font-normal leading-[1.6] text-secondary max-w-[660px] mb-[38px]"
        >
          Entrepreneurship Cell of UIET, MDU, Rohtak — promoting entrepreneurship &amp; innovation at UIET through startup workshops, events, hackathons, mentorship, and student-led ventures.
        </p>

        <div data-hero="actions" className="flex items-center justify-center gap-3.5 flex-wrap">
          <Button href="/contact" variant="blue" size="lg" arrow>
            Join E-Cell UIET MDU
          </Button>
          <Button href="/events" variant="white" size="lg" arrow>
            Explore Events &amp; Workshops
          </Button>
        </div>
      </div>
    </section>
  );
}
