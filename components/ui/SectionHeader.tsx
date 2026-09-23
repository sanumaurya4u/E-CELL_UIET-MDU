import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  italicTitle?: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  italicTitle,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <div
      className={`reveal mb-10 md:mb-14 ${centered ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl'} ${className}`}
    >
      {badge && (
        <div className="inline-flex items-center gap-1.5 bg-warm-secondary border border-warm rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-accent mb-4">
          {badge}
        </div>
      )}

      <h2 className="font-sans font-extrabold text-[clamp(30px,4.4vw,48px)] leading-[1.1] tracking-tight text-warm-primary mb-4">
        {title}{' '}
        {italicTitle && (
          <span className="font-sans text-orange-accent">
            {italicTitle}
          </span>
        )}
      </h2>

      {subtitle && (
        <p className="text-[clamp(15px,1.8vw,17px)] font-normal leading-[1.6] text-warm-secondary">
          {subtitle}
        </p>
      )}
    </div>
  );
}
