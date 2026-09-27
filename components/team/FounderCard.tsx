import React from 'react';
import { avatarUrl } from '@/lib/utils';
import type { Founder } from '@/lib/types';

export default function FounderCard({ founder }: { founder: Founder }) {
  return (
    <div className="reveal group card-warm overflow-hidden transition-all duration-200 hover:-translate-y-1">
      <div className="relative w-full h-[300px] overflow-hidden bg-warm-secondary border-b border-warm">
        <img
          src={founder.photo || avatarUrl(founder.name)}
          alt={founder.name}
          loading="lazy"
          className="w-full h-full object-cover object-[center_20%] transition-transform duration-400 group-hover:scale-[1.05]"
        />
        <span className="absolute top-3 left-3 bg-warm-surface/90 backdrop-blur-xs border border-warm text-warm-primary text-[11px] font-semibold py-1 px-3 rounded-full whitespace-nowrap">
          {founder.badge || 'Founding Pioneer'}
        </span>
      </div>

      <div className="p-5 flex flex-col items-start gap-1">
        <h3 className="font-sans font-bold text-lg tracking-tight text-warm-primary">{founder.name}</h3>
        <p className="text-sm font-medium text-orange-accent">{founder.role}</p>
        {founder.batch && <p className="text-xs text-warm-muted">{founder.batch}</p>}
        {founder.contribution && (
          <p className="text-[13px] leading-relaxed text-warm-secondary mt-1">{founder.contribution}</p>
        )}
      </div>
    </div>
  );
}
