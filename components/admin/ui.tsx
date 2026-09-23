'use client';

import React from 'react';

/* Shared admin UI primitives — Editorial Campus design language, warm tokens */

export const adminInput =
  'w-full bg-warm-secondary border border-warm rounded-xl px-3.5 py-2.5 text-sm text-warm-primary placeholder:text-warm-muted outline-none transition-colors duration-200 focus:border-orange-accent focus:ring-1 focus:ring-orange-accent';

export const adminLabel = 'block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5';

export const adminCard = 'bg-warm-surface border border-warm rounded-2xl';

export const adminTh =
  'text-left text-xs font-bold uppercase tracking-wider text-warm-muted px-4 py-3 border-b border-warm bg-warm-secondary/60';

export const adminTd = 'px-4 py-3 text-sm text-warm-primary align-middle border-b border-warm';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
      <div>
        <h1 className="font-sans font-extrabold text-2xl leading-tight tracking-tight text-warm-primary">{title}</h1>
        <p className="text-sm text-warm-secondary mt-1">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-warm-surface border border-warm rounded-2xl w-full ${wide ? 'max-w-xl' : 'max-w-md'} my-8 shadow-md`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm">
          <h2 className="font-sans font-bold text-base tracking-tight text-warm-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-warm-secondary text-warm-primary hover:bg-warm-surface transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-[#FDF0EA] text-[#E96832] border-[#E96832]/30',
  Shortlisted: 'bg-[#e2f0ff] text-[#1d6fb3] border-[#70b5ff]/40',
  Accepted: 'bg-[#e4f6df] text-[#2f7a1d] border-[#79d45e]/40',
  Rejected: 'bg-[#fde7eb] text-[#c74a62] border-[#f4889a]/40',
  upcoming: 'bg-[#e4f6df] text-[#2f7a1d] border-[#79d45e]/40',
  past: 'bg-warm-secondary text-warm-muted border-warm',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex py-0.5 px-2.5 rounded-full border text-[11px] font-bold whitespace-nowrap ${
        STATUS_STYLES[status] || 'bg-warm-secondary text-warm-muted border-warm'
      }`}
    >
      {status}
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="bg-warm-surface border border-dashed border-warm rounded-2xl py-10 px-5 text-center text-xs font-medium text-warm-muted">
      {text}
    </div>
  );
}

export function FilterPills({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-warm-secondary border border-warm rounded-full p-1 w-fit flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`py-1 px-3.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap cursor-pointer ${
            active === opt ? 'bg-[#211B17] text-[#FCFAF6] shadow-2xs' : 'text-warm-secondary hover:text-warm-primary hover:bg-warm-surface'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
