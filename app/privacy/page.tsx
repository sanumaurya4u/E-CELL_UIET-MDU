import React from 'react';

export const metadata = {
  title: 'Privacy Policy | E-Cell | UIET MDU Rohtak',
};

const sectionClass = 'font-sans font-bold text-lg tracking-tight text-warm-primary mb-3';
const textClass = 'text-sm leading-relaxed text-warm-secondary';

export default function PrivacyPage() {
  return (
    <div className="pt-12 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto card-warm p-8 sm:p-12 shadow-xs">
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight text-warm-primary mb-3">
          Privacy Policy
        </h1>
        <p className="text-xs text-warm-muted mb-8 pb-4 border-b border-warm">
          Last updated: 2026 · E-Cell | UIET MDU Rohtak (Entrepreneurship Cell of UIET, MDU, Rohtak)
        </p>

        <div className="flex flex-col gap-6">
          <section>
            <h2 className={sectionClass}>1. Overview</h2>
            <p className={textClass}>
              E-Cell | UIET MDU Rohtak (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the official platform for the
              Entrepreneurship Cell of UIET, Maharshi Dayanand University (MDU), Rohtak. This Privacy
              Policy explains how we collect, use, and protect your information when you interact with
              our platform, register for events, or apply for mentorship and student-led venture support.
            </p>
          </section>

          <section>
            <h2 className={sectionClass}>2. Information We Collect</h2>
            <p className={textClass}>
              When you submit an application, register for an event, or create a profile, we may collect your full
              name, student roll number, college email address, phone number, branch/year of study,
              startup details, and LinkedIn profile URL.
            </p>
          </section>

          <section>
            <h2 className={sectionClass}>3. How We Use Information &amp; Contact</h2>
            <p className={textClass}>
              Information collected is strictly used for organizing campus entrepreneurship events, workshops,
              and hackathons, facilitating mentor connections, and supporting student-led ventures. For any questions,
              contact us at{' '}
              <a href="mailto:ecellmdu@gmail.com" className="text-orange-accent font-semibold hover:underline">
                ecellmdu@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
