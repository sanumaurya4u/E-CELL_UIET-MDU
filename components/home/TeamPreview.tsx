import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';

const teamMembers = [
  { id: 1, name: 'Ananya Sharma', role: 'President', year: '4th Year, B.Tech CSE', image: '/gallery/page_10.jpg', badge: 'Leadership' },
  { id: 2, name: 'Rohan Mehta', role: 'Vice President', year: '3rd Year, MBA', image: '/gallery/page_12.jpg', badge: 'Leadership' },
  { id: 3, name: 'Lakshay', role: 'Tech & Product Lead', year: '3rd Year, B.Tech CSE', image: '/gallery/page_20.jpg', badge: 'Design & Tech' },
  { id: 4, name: 'Priya Verma', role: 'Secretary', year: '3rd Year, B.Com (Hons)', image: '/gallery/page_6.jpg', badge: 'Leadership' },
];

const FOUNDERS = ['Nitigya', 'Shashwat Thakur', 'Deepanshu', 'Azriel'];

export default function TeamPreview() {
  return (
    <section className="py-[clamp(56px,7vw,80px)]">
      <div className="max-w-[1272px] mx-auto px-6">
        <SectionHeader
          badge="Leadership & Pioneers"
          title="Meet the creative minds behind"
          italicTitle="our success"
          subtitle="A dedicated group of student leaders, developers, and founding pioneers driving entrepreneurship across MDU."
        />

        {/* Big photo cards — reference: large portrait imagery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {teamMembers.map((m) => (
            <div
              key={m.id}
              className="reveal group flex flex-col bg-white border border-border rounded-panel overflow-hidden transition-all duration-200 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-borderstrong"
            >
              <div className="relative w-full h-[clamp(260px,22vw,340px)] overflow-hidden bg-[#f8fafc]">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover object-[center_25%] transition-transform duration-400 group-hover:scale-[1.05]"
                />
                <span className="absolute bottom-3 left-3 bg-white/90 [backdrop-filter:blur(8px)] text-ink text-[11px] font-medium py-1 px-3 rounded-pill whitespace-nowrap">
                  {m.badge}
                </span>
              </div>

              <div className="flex flex-col items-start gap-0.5 p-5">
                <h3 className="font-sans font-medium text-xl tracking-[-0.02em] text-ink">{m.name}</h3>
                <p className="text-sm font-normal text-secondary">{m.role}</p>
                <p className="text-xs text-muted mt-0.5">{m.year}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Founding Pioneers — clean recognition strip */}
        <div className="reveal bg-soft border border-bordersubtle rounded-card py-4 px-6 mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3 flex-wrap">
            <span className="text-[13px] font-medium text-ink uppercase tracking-[0.04em]">
              Founding Pioneers of E-Cell | UIET MDU Rohtak
            </span>
            <div className="flex gap-2.5 flex-wrap justify-center">
              {FOUNDERS.map((name) => (
                <span
                  key={name}
                  className="text-[13px] font-medium text-ink bg-white py-1 px-3 rounded-pill border border-border"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="reveal text-center">
          <Button href="/team" variant="outline" size="lg" arrow>
            Meet the Full Team &amp; Founders
          </Button>
        </div>
      </div>
    </section>
  );
}
