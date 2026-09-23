import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'blue' | 'outline' | 'white' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
  onDark?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
}

const VARIANT_CLASSES: Record<ButtonVariant, { base: string; icon: string }> = {
  primary: {
    base: 'bg-[#211B17] text-[#FCFAF6] border-[#211B17] hover:bg-black hover:border-black dark:bg-[#F5EFE5] dark:text-[#120F0D] dark:border-[#F5EFE5] dark:hover:bg-white',
    icon: 'bg-white text-[#211B17] dark:bg-[#120F0D] dark:text-[#F5EFE5]',
  },
  blue: {
    base: 'bg-[#E96832] text-white border-[#E96832] hover:bg-[#D95725] hover:border-[#D95725]',
    icon: 'bg-white text-[#E96832] group-hover:bg-[#E96832] group-hover:text-white',
  },
  outline: {
    base: 'bg-transparent text-warm-primary border-warm hover:bg-warm-secondary hover:border-warm-strong',
    icon: 'bg-warm-secondary text-warm-primary group-hover:bg-white group-hover:text-[#211B17]',
  },
  white: {
    base: 'bg-warm-surface text-warm-primary border-warm hover:bg-warm-secondary hover:border-warm-strong',
    icon: 'bg-[#211B17] text-white dark:bg-white dark:text-[#120F0D]',
  },
  ghost: {
    base: 'bg-transparent text-warm-secondary border-transparent hover:text-warm-primary hover:bg-warm-secondary',
    icon: 'bg-warm-secondary text-warm-primary group-hover:bg-white group-hover:text-[#211B17]',
  },
};

const OUTLINE_ON_DARK = {
  base: 'bg-transparent text-white border-white/40 hover:bg-white hover:text-ink hover:border-white',
  icon: 'bg-white/15 text-white group-hover:bg-ink group-hover:text-white',
};

/* Reference padding: rest = roomy label side / tight circle side;
   hover mirrors it so the circle hugs the LEFT edge tightly. */
const SIZE_CLASSES: Record<
  ButtonSize,
  { base: string; icon: string; svg: string; padRest: string; padHover: string }
> = {
  sm: {
    base: 'py-[5px] text-[13px]',
    icon: 'h-[26px] w-[26px]',
    svg: 'h-3 w-3',
    padRest: 'pl-4 pr-[6px]',
    padHover: 'pl-[6px] pr-4',
  },
  md: {
    base: 'py-[7px] text-sm',
    icon: 'h-8 w-8',
    svg: 'h-[15px] w-[15px]',
    padRest: 'pl-[18px] pr-[7px]',
    padHover: 'pl-[7px] pr-[18px]',
  },
  lg: {
    base: 'py-[9px] text-[15px]',
    icon: 'h-[38px] w-[38px]',
    svg: 'h-[17px] w-[17px]',
    padRest: 'pl-[22px] pr-[9px]',
    padHover: 'pl-[9px] pr-[22px]',
  },
};

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  arrow = true,
  onDark = false,
  className = '',
  type = 'button',
  disabled = false,
  target,
  rel,
  style,
  ...props
}: ButtonProps) {
  const resolvedVariant = VARIANT_CLASSES[variant] ? variant : 'primary';
  const v = variant === 'outline' && onDark ? OUTLINE_ON_DARK : VARIANT_CLASSES[resolvedVariant];
  const s = SIZE_CLASSES[size];

  const rootClass = [
    'group inline-flex items-center rounded-pill border font-medium tracking-[-0.01em] whitespace-nowrap cursor-pointer transition-colors duration-300 select-none',
    v.base,
    s.base,
    disabled ? 'opacity-50 pointer-events-none' : '',
    className,
  ].join(' ');

  const swapEase =
    'transition-all duration-[350ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]';

  const circleClass = `inline-flex items-center justify-center rounded-full shrink-0 ${v.icon} ${s.icon}`;
  const childEase = 'transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]';

  const content = arrow ? (
    /* Reference swap: text travels RIGHT, arrow circle travels LEFT —
       two mirrored layers crossfade while their children glide in
       opposite directions. Identical widths, so the button never
       moves or resizes. */
    <span className="relative inline-flex">
      {/* Rest layer: text left (roomy), circle right (tight) */}
      <span className={`flex items-center gap-3 opacity-100 ${s.padRest} ${swapEase} group-hover:opacity-0`}>
        <span className={`${childEase} group-hover:translate-x-5`}>{children}</span>
        <span className={`${circleClass} ${childEase} group-hover:-translate-x-5`}>
          <ArrowIcon className={s.svg} />
        </span>
      </span>

      {/* Hover layer: circle left (tight), text right (roomy) — mirrored */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 flex items-center gap-3 opacity-0 pointer-events-none ${s.padHover} ${swapEase} group-hover:opacity-100`}
      >
        <span className={`${circleClass} ${childEase} translate-x-5 group-hover:translate-x-0`}>
          <ArrowIcon className={s.svg} />
        </span>
        <span className={`${childEase} -translate-x-5 group-hover:translate-x-0`}>{children}</span>
      </span>
    </span>
  ) : (
    <span className={s.padRest}>{children}</span>
  );

  if (href) {
    if (href.startsWith('http') || target === '_blank') {
      return (
        <a href={href} className={rootClass} target={target} rel={rel || 'noopener noreferrer'} style={style} {...props}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={rootClass} style={style} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={rootClass} onClick={onClick} disabled={disabled} style={style} {...props}>
      {content}
    </button>
  );
}
