import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-6">
      <div className="text-center max-w-lg card-warm p-10 sm:p-14 shadow-xs">
        
        {/* 404 Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-orange-accent text-xs font-bold tracking-wider uppercase mb-6">
          <span>PAGE NOT FOUND</span>
        </div>

        <div className="font-sans font-extrabold text-7xl sm:text-8xl leading-none tracking-tight text-warm-primary mb-6">
          404
        </div>

        <h1 className="font-sans font-bold text-2xl tracking-tight text-warm-primary mb-3">
          Oops! The page you are looking for <span className="text-orange-accent">doesn&apos;t exist</span>
        </h1>

        <p className="text-sm text-warm-secondary mb-8 leading-relaxed">
          The URL may have been moved, deleted, or entered incorrectly. Let&apos;s get you back to the campus hub.
        </p>

        <div className="flex justify-center">
          <Link href="/" className="btn-pill-primary text-sm px-6 py-3 font-semibold shadow-xs">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back To Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
