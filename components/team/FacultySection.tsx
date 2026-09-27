import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import type { Faculty } from '@/lib/types';

export default function FacultySection({ faculty }: { faculty: Faculty }) {
  if (!faculty) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal card-warm p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-40 h-40 rounded-2xl overflow-hidden shrink-0 bg-warm-secondary border border-warm">
            <Image
              src={faculty.photo || '/gallery/page_28.jpg'}
              alt={faculty.name}
              width={160}
              height={160}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <span className="badge-pill text-xs font-semibold text-orange-accent">
              Faculty Advisor · E-Cell | UIET MDU Rohtak
            </span>
            <h3 className="font-sans font-bold text-2xl tracking-tight text-warm-primary">{faculty.name}</h3>
            <p className="text-sm font-medium text-warm-secondary">{faculty.designation}</p>
            {faculty.bio && <p className="text-sm leading-relaxed text-warm-secondary max-w-2xl mt-2">{faculty.bio}</p>}

            {faculty.email && (
              <div className="mt-4">
                <Button href={`mailto:${faculty.email}`} variant="primary" size="sm" arrow>
                  Contact Advisor
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
