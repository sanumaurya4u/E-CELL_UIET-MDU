import React from 'react';

export default function VisionMission() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision Card */}
          <div className="reveal card-warm p-8 md:p-10">
            <span className="text-xs font-bold text-orange-accent uppercase tracking-wider">
              Our Vision
            </span>
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl leading-snug tracking-tight text-warm-primary my-3">
              Ideas into <span className="text-orange-accent">Impact</span>
            </h3>
            <p className="text-sm text-warm-secondary leading-relaxed mb-5">
              Promoting entrepreneurship &amp; innovation at UIET by building a supportive environment where student ideas can grow into real-world solutions.
            </p>
            <ul className="flex flex-col gap-3.5 text-sm leading-relaxed text-warm-secondary">
              <li>
                <strong className="text-warm-primary font-semibold">1. Entrepreneurship &amp; Innovation:</strong>{' '}
                Encouraging students across UIET to explore creative problem-solving and practical innovation.
              </li>
              <li>
                <strong className="text-warm-primary font-semibold">2. Student-Led Ventures:</strong>{' '}
                Providing early feedback, peer collaboration, and a platform to showcase student startups.
              </li>
              <li>
                <strong className="text-warm-primary font-semibold">3. Startup Culture:</strong>{' '}
                Cultivating an approachable, action-oriented entrepreneurial community on the MDU Rohtak campus.
              </li>
            </ul>
          </div>

          {/* Mission Card */}
          <div className="reveal card-warm p-8 md:p-10">
            <span className="text-xs font-bold text-orange-accent uppercase tracking-wider">
              Our Focus
            </span>
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl leading-snug tracking-tight text-warm-primary my-3">
              Learn, Collaborate &amp; <span className="text-orange-accent">Build</span>
            </h3>
            <p className="text-sm text-warm-secondary leading-relaxed mb-5">
              Supporting the Entrepreneurship Cell of UIET, MDU, Rohtak through hands-on programs and peer-to-peer learning.
            </p>
            <ul className="flex flex-col gap-3.5 text-sm leading-relaxed text-warm-secondary">
              <li>
                <strong className="text-warm-primary font-semibold">• Entrepreneurial Learning:</strong>{' '}
                Organizing practical workshops, speaker talks, and skill-building sessions on campus.
              </li>
              <li>
                <strong className="text-warm-primary font-semibold">• Mentorship:</strong>{' '}
                Connecting aspiring student founders with alumni mentors and faculty advisors.
              </li>
              <li>
                <strong className="text-warm-primary font-semibold">• Pitching &amp; Ideathons:</strong>{' '}
                Hosting campus competitions such as the Eureka Pitching Competition and Campus Fix Challenge.
              </li>
              <li>
                <strong className="text-warm-primary font-semibold">• Cross-Department Collaboration:</strong>{' '}
                Bringing together students from engineering, management, commerce, and sciences.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
