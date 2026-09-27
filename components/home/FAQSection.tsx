import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import AccordionItem from '@/components/ui/AccordionItem';
import { FAQ_ITEMS } from '@/lib/constants';

export default function FAQSection() {
  return (
    <section className="py-[clamp(56px,7vw,80px)]">
      <div className="max-w-[1272px] mx-auto px-6">
        <SectionHeader
          badge="Frequently Asked"
          title="Got questions? We've got"
          italicTitle="answers"
          subtitle="Everything you need to know about joining, participating, and getting involved with E-Cell | UIET MDU Rohtak."
        />

        {/* Wide accordion — reference spans the content column */}
        <div className="w-full">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className="reveal">
              <AccordionItem question={item.question} answer={item.answer} defaultOpen={idx === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
