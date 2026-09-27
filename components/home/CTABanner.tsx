import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { ECELL_INFO } from '@/lib/constants';

export default function CTABanner() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal bg-[#120F0D] border border-[#39322C] rounded-3xl p-8 sm:p-14 text-center text-[#F5EFE5] shadow-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D1815] border border-[#39322C] text-orange-accent text-xs font-bold uppercase tracking-wider mb-5">
            <span>{ECELL_INFO.name}</span>
          </div>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white mb-4 max-w-2xl mx-auto">
            Turn your <span className="text-orange-accent">ideas into impact</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-[#C9BFB3] max-w-xl mx-auto mb-8">
            {ECELL_INFO.description}. Join {ECELL_INFO.name} to collaborate on student-led ventures,
            participate in campus events, and learn with fellow innovators.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#120F0D] hover:bg-neutral-100 text-sm font-semibold transition-all shadow-xs"
            >
              <span>Join E-Cell</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={ECELL_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-[#39322C] bg-[#1D1815] text-sm font-semibold text-[#F5EFE5] hover:border-orange-accent transition-colors"
            >
              <span>Instagram {ECELL_INFO.instagramHandle}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
