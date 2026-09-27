import React from 'react';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';

interface GalleryItem {
  id: number | string;
  image: string;
  title: string;
  description?: string;
  category?: string;
}

interface GalleryGridProps {
  gallery?: GalleryItem[];
  className?: string;
  containerClassName?: string;
}

export default function GalleryGrid({
  gallery = [],
  className = 'py-[clamp(56px,7vw,80px)]',
  containerClassName = 'max-w-[1272px] mx-auto px-6',
}: GalleryGridProps) {
  return (
    <section className={className}>
      <div className={containerClassName}>
        <SectionHeader
          badge="Campus Moments"
          title="Life & energy at"
          italicTitle="E-Cell | UIET MDU Rohtak"
          subtitle="Glimpses of student pitch competitions, workshops, ceremonies, and team discussions on campus."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="reveal group bg-white dark:bg-[#171310] border border-border dark:border-[#39322C] rounded-panel p-3 transition-all duration-200 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-borderstrong shadow-2xs"
            >
              <div className="relative w-full h-[260px] overflow-hidden rounded-card bg-[#f8fafc] dark:bg-[#1F1A17]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1272px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-400 group-hover:scale-[1.05]"
                />
                <span className="absolute top-3 left-3 bg-white/90 dark:bg-[#171310]/90 [backdrop-filter:blur(8px)] text-ink dark:text-[#F5EFE5] text-[11px] font-medium py-1 px-3 rounded-pill shadow-xs">
                  {item.category}
                </span>
              </div>
              <div className="px-2 pt-4 pb-2 flex flex-col gap-1.5">
                <h4 className="font-sans font-semibold text-lg tracking-tight text-ink dark:text-[#F5EFE5]">{item.title}</h4>
                {item.description && (
                  <p className="text-sm leading-relaxed text-secondary dark:text-[#C9BFB3]">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
