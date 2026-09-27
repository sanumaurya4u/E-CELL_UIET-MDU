import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';

interface FacultyMember {
  name?: string;
  designation?: string;
}

export default function TestimonialSection({ faculty }: { faculty?: FacultyMember }) {
  return (
    <section className="py-[clamp(56px,7vw,80px)]">
      <div className="max-w-[1272px] mx-auto px-6">
        <SectionHeader
          badge="Guidance & Voices"
          title="What our mentors & student founders say"
          italicTitle="about us"
          subtitle="Hear from our faculty advisors and student innovators who have grown, built, and led with E-Cell | UIET MDU Rohtak."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Faculty Advisor — white card */}
          <div className="reveal bg-white border border-border rounded-card p-8 min-h-[460px] flex flex-col justify-between gap-6 transition-all duration-200 hover:-translate-y-1 hover:border-borderstrong">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[#f8fafc]">
              <img src="/gallery/page_28.jpg" alt="Faculty Advisor" className="w-full h-full object-cover object-center" />
            </div>
            <p className="text-[19px] font-medium leading-[1.45] tracking-[-0.015em] text-ink flex-1">
              &ldquo;E-Cell | UIET MDU Rohtak provides a vital platform for students to learn real-world execution,
              collaborate across engineering and management disciplines, and cultivate innovation on campus.&rdquo;
            </p>
            <div className="border-t border-border pt-4">
              <div className="font-sans font-medium text-base tracking-[-0.01em] text-ink mb-0.5">
                {faculty?.name || 'Dr. Rajesh Kumar'}
              </div>
              <div className="text-sm text-secondary leading-[1.4]">
                {faculty?.designation || 'Faculty Advisor, E-Cell | UIET MDU Rohtak'}
              </div>
            </div>
          </div>

          {/* Card 2: Signature warm-yellow metric card — reference #F6E683 */}
          <div className="reveal bg-sun rounded-card p-8 min-h-[460px] flex flex-col justify-between gap-6 transition-transform duration-200 hover:-translate-y-1">
            <div className="font-sans font-medium text-[clamp(64px,7.5vw,88px)] leading-none tracking-[-0.04em] text-ink">
              100%
            </div>
            <p className="text-[17px] font-medium leading-[1.45] tracking-[-0.01em] text-ink">
              Student-led campus ecosystem offering free access to workshops, mentorship, and pitch
              showcases for all MDU innovators.
            </p>
          </div>

          {/* Card 3: Student winner — dark ink card (reference pattern) */}
          <div className="reveal bg-ink rounded-card p-8 min-h-[460px] flex flex-col justify-between gap-6 transition-transform duration-200 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[#f8fafc]">
              <img src="/gallery/page_3.jpg" alt="Student Founder" className="w-full h-full object-cover object-center" />
            </div>
            <p className="text-[19px] font-medium leading-[1.45] tracking-[-0.015em] text-white flex-1">
              &ldquo;Participating in Eureka Pitching gave our team the initial validation, mentorship, and
              confidence to take our prototype to state and national entrepreneurship forums.&rdquo;
            </p>
            <div className="border-t border-white/15 pt-4">
              <div className="font-sans font-medium text-base tracking-[-0.01em] text-white mb-0.5">
                Eureka Pitch Winner
              </div>
              <div className="text-sm text-white/60 leading-[1.4]">Student Founder · Batch 2025</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
