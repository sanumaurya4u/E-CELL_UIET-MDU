import React from 'react';
import { avatarUrl } from '@/lib/utils';
import type { TeamMember } from '@/lib/types';

export default function TeamCard({ member }: { member: TeamMember; bgColor?: string }) {
  const imageSrc = member.profile_image_url || member.photo || avatarUrl(member.name);
  const designation = member.designation || member.role;
  const linkedinUrl = member.linkedin_url || member.linkedin;
  const instagramUrl = member.instagram_url;
  const githubUrl = member.github_url;

  return (
    <div className="reveal group card-warm overflow-hidden transition-all duration-200 hover:-translate-y-1">
      <div className="relative w-full h-[300px] overflow-hidden bg-warm-secondary border-b border-warm">
        <img
          src={imageSrc}
          alt={member.name}
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            const fallback = avatarUrl(member.name);
            if (target.src !== fallback) {
              target.src = fallback;
            }
          }}
          className="w-full h-full object-cover object-[center_20%] transition-transform duration-400 group-hover:scale-[1.05]"
        />
      </div>

      <div className="p-5 flex flex-col items-start gap-1">
        <h3 className="font-sans font-bold text-lg tracking-tight text-warm-primary">{member.name}</h3>
        <p className="text-sm font-medium text-orange-accent">{designation}</p>
        {member.year && <p className="text-xs text-warm-muted">{member.year}</p>}
        {member.bio && (
          <p className="text-[13px] leading-relaxed text-warm-secondary mt-1">{member.bio}</p>
        )}

        <div className="flex gap-2 mt-2">
          {linkedinUrl && linkedinUrl !== '#' && (
            <a
              href={linkedinUrl}
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
          {instagramUrl && instagramUrl !== '#' && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full border border-warm text-warm-secondary transition-all duration-200 hover:bg-orange-accent hover:border-orange-accent hover:text-white"
              aria-label={`${member.name} Instagram`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          )}
          {githubUrl && githubUrl !== '#' && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full border border-warm text-warm-secondary transition-all duration-200 hover:bg-orange-accent hover:border-orange-accent hover:text-white"
              aria-label={`${member.name} GitHub`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
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
