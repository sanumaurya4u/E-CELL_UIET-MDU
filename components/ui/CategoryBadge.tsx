import React from 'react';

type BadgeColor = 'orange' | 'blue' | 'pink' | 'green' | 'lilac' | 'purple' | 'neutral';

interface CategoryBadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const COLORS: Record<BadgeColor, string> = {
  orange: 'bg-[#FDF0EA] text-[#E96832] border-[#E96832]/30 dark:bg-[#F2763E]/10 dark:text-[#F2763E]',
  blue: 'bg-[#e2f0ff] text-[#1d6fb3] border-[#70b5ff]/40 dark:bg-[#1d6fb3]/10 dark:text-[#70b5ff]',
  pink: 'bg-[#fde7eb] text-[#c74a62] border-[#f4889a]/40 dark:bg-[#c74a62]/10 dark:text-[#f4889a]',
  green: 'bg-[#e4f6df] text-[#2f7a1d] border-[#79d45e]/40 dark:bg-[#2f7a1d]/10 dark:text-[#79d45e]',
  lilac: 'bg-[#f1e6fb] text-[#6b3fa8] border-[#ba81ee]/40 dark:bg-[#6b3fa8]/10 dark:text-[#ba81ee]',
  purple: 'bg-[#f1e6fb] text-[#6b3fa8] border-[#ba81ee]/40 dark:bg-[#6b3fa8]/10 dark:text-[#ba81ee]',
  neutral: 'bg-warm-secondary text-warm-primary border-warm',
};

export default function CategoryBadge({ children, color = 'neutral', className = '' }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-tight ${COLORS[color] || COLORS.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
