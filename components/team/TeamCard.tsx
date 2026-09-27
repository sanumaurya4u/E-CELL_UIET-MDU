import React from 'react';
import { avatarUrl } from '@/lib/utils';
import type { TeamMember } from '@/lib/types';

export default function TeamCard({ member }: { member: TeamMember; bgColor?: string }) {
  return (
    <div className="reveal group card-warm overflow-hidden transition-all duration-200 hover:-translate-y-1">
      <div className="relative w-full h-[300px] overflow-hidden bg-warm-secondary border-b border-warm">
        <img
          src={member.photo || avatarUrl(member.name)}
          alt={member.name}
          loading="lazy"
          className="w-full h-full object-cover object-[center_20%] transition-transform duration-400 group-hover:scale-[1.05]"
        />
      </div>

      <div className="p-5 flex flex-col items-start gap-1">
        <h3 className="font-sans font-bold text-lg tracking-tight text-warm-primary">{member.name}</h3>
        <p className="text-sm font-medium text-orange-accent">{member.role}</p>
        {member.year && <p className="text-xs text-warm-muted">{member.year}</p>}

        <div className="flex gap-2 mt-2">
          {member.linkedin && member.linkedin !== '#' && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full border border-warm text-warm-secondary transition-all duration-200 hover:bg-orange-accent hover:border-orange-accent hover:text-white"
              aria-label={`${member.name} LinkedIn`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
              </svg>
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-warm text-warm-secondary transition-all duration-200 hover:bg-orange-accent hover:border-orange-accent hover:text-white"
              aria-label={`Email ${member.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
