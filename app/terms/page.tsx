import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | E-Cell | UIET MDU Rohtak',
};

const sectionClass = 'font-sans font-bold text-lg tracking-tight text-warm-primary mb-3';
const textClass = 'text-sm leading-relaxed text-warm-secondary';

export default function TermsPage() {
  return (
    <div className="pt-12 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto card-warm p-8 sm:p-12 shadow-xs">
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight text-warm-primary mb-3">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-warm-muted mb-8 pb-4 border-b border-warm">
          Last updated: 2026 · E-Cell | UIET MDU Rohtak (Entrepreneurship Cell of UIET, MDU, Rohtak)
        </p>

        <div className="flex flex-col gap-6">
          <section>
            <h2 className={sectionClass}>1. Acceptance of Terms</h2>
            <p className={textClass}>
              By accessing or using the E-Cell | UIET MDU Rohtak platform and participating in our
              events, workshops, hackathons, and mentorship initiatives, you agree to comply with these terms.
            </p>
          </section>

          <section>
            <h2 className={sectionClass}>2. Student Conduct &amp; Submissions</h2>
            <p className={textClass}>
              All startup pitches, project repositories, and competition entries must be original works of the
              participating students. Plagiarism or misrepresentation will result in immediate disqualification.
            </p>
          </section>

          <section>
            <h2 className={sectionClass}>3. Intellectual Property</h2>
            <p className={textClass}>
              E-Cell | UIET MDU Rohtak asserts no ownership over student startup intellectual property. All inventions, code,
              and pitch decks remain 100% the property of their respective student founders.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
