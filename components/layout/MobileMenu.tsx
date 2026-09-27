'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  currentPath: string;
}

export default function MobileMenu({ isOpen, onClose, links, currentPath }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-ink/40 [backdrop-filter:blur(6px)]" onClick={onClose}>
      <div
        className="absolute top-20 left-4 right-4 bg-white border border-border rounded-panel p-6 shadow-[0_4px_16px_rgba(27,29,30,0.06)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 px-4 rounded-cta font-medium no-underline transition-colors duration-200 ${
                  isActive ? 'bg-soft text-ink' : 'text-secondary hover:text-ink hover:bg-soft'
                }`}
                onClick={onClose}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-bordersubtle">
          <Button href="/contact" variant="primary" size="lg" arrow onClick={onClose} className="!w-full" style={{ width: '100%' }}>
            Join E-Cell UIET MDU
          </Button>
        </div>
      </div>
    </div>
  );
}
