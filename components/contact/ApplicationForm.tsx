'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastProvider';
import { useData } from '@/context/DataProvider';
import { supabase } from '@/lib/supabase';

interface AppSettings {
  web3formsKey?: string;
}

interface ApplicationFormData {
  fullName: string;
  enrollment: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  department: string;
  linkedin: string;
  whyJoin: string;
}

const inputClass =
  'w-full bg-white border border-border rounded-card px-4 py-3 text-[15px] text-ink placeholder:text-muted outline-none transition-colors duration-200 focus:border-ink';

const labelClass = 'block text-sm font-medium text-ink mb-2';

export default function ApplicationForm({ settings }: { settings?: AppSettings }) {
  const { showToast } = useToast();
  const { applications, setApplications } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    enrollment: '',
    email: '',
    phone: '',
    branch: '',
    year: '',
    department: '',
    linkedin: '',
    whyJoin: '',
  });

  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 300;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'whyJoin' && value.length > MAX_CHARS) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'whyJoin') setCharCount(value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.enrollment ||
      !formData.email ||
      !formData.phone ||
      !formData.branch ||
      !formData.year ||
      !formData.department ||
      !formData.whyJoin
    ) {
      showToast('Please fill in all required fields marked with *', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const branchYear = `${formData.year}, ${formData.branch}`;
      const submittedOn = new Date().toISOString();

      const newApp = {
        id: Date.now(),
        name: formData.fullName,
        enrollment: formData.enrollment,
        branchYear: branchYear,
        branchyear: branchYear,
        deptInterest: formData.department,
        deptinterest: formData.department,
        email: formData.email,
        phone: formData.phone,
        whyJoin: formData.whyJoin,
        whyjoin: formData.whyJoin,
        linkedin: formData.linkedin || null,
        submittedOn: submittedOn,
        submittedon: submittedOn,
        status: 'Pending',
        notes: '',
        history: [{ status: 'Pending', by: 'System (Public Form)', date: submittedOn }],
      };
 
      // Update local state and cache
      const nextApps = [newApp, ...applications];
      setApplications(nextApps);
      try {
        localStorage.setItem('ECELL_APPLICATIONS', JSON.stringify(nextApps));
      } catch {}

      // 1. Supabase insert
      if (supabase) {
        try {
          await supabase.from('applications').insert([newApp]);
        } catch (dbErr) {
          console.warn('[Application] Supabase insert warning:', dbErr);
        }
      }

      // 2. Web3Forms email forwarding
      try {
        const web3Key = settings?.web3formsKey || process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'ca0b970d-2396-4be4-96d0-f4f2697acddc';
        const web3Body = new FormData();
        web3Body.append('access_key', web3Key);
        web3Body.append('subject', `New UIET E-Cell Application: ${formData.fullName} (${formData.department})`);
        web3Body.append('name', formData.fullName);
        web3Body.append('email', formData.email);
        web3Body.append('phone', formData.phone);
        web3Body.append('enrollment', formData.enrollment);
        web3Body.append('branch_year', branchYear);
        web3Body.append('department', formData.department);
        web3Body.append('linkedin', formData.linkedin || 'N/A');
        web3Body.append('message', formData.whyJoin);

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: web3Body,
          headers: { Accept: 'application/json' },
        });
      } catch (w3Err) {
        console.warn('[Application] Web3Forms forward warning:', w3Err);
      }

      // 3. EmailJS auto-confirmation
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) {
        try {
          const emailjs = await import('@emailjs/browser');
          emailjs.init({ publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! });
          await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
            {
              to_email: formData.email,
              applicant_name: formData.fullName,
              department: formData.department,
              ecell_email: 'ecelluietfs@gmail.com',
            }
          );
        } catch (eJsErr) {
          console.warn('[Application] EmailJS confirmation warning:', eJsErr);
        }
      }

      setIsSuccess(true);
      showToast('Application submitted successfully!', 'success');
      setFormData({
        fullName: '',
        enrollment: '',
        email: '',
        phone: '',
        branch: '',
        year: '',
        department: '',
        linkedin: '',
        whyJoin: '',
      });
      setCharCount(0);
    } catch (err) {
      console.error('[Application Submission Error]:', err);
      showToast('Submission failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-border rounded-panel p-6 md:p-10 max-w-[900px] mx-auto">
      {isSuccess && (
        <div className="bg-pgreenbg border border-pgreen/40 rounded-card p-6 mb-8">
          <h3 className="font-sans font-medium text-lg text-ink mb-1">Application Received!</h3>
          <p className="text-[15px] leading-[1.6] text-secondary">
            Thank you for applying to UIET E-Cell. Our leadership board reviews applications on a rolling
            basis and will reach out to you via email within 5-7 days.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* Row 1: Name & Enrollment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass} htmlFor="fullName">
              Full Name <span className="text-ink">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Ananya Sharma"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="enrollment">
              Enrollment Number <span className="text-ink">*</span>
            </label>
            <input
              type="text"
              id="enrollment"
              name="enrollment"
              value={formData.enrollment}
              onChange={handleChange}
              placeholder="e.g. 22MDU001234"
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Row 2: Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass} htmlFor="email">
              Email Address <span className="text-ink">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="phone">
              Phone Number <span className="text-ink">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Row 3: Branch & Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass} htmlFor="branch">
              Branch &amp; Course <span className="text-ink">*</span>
            </label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. B.Tech CSE"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="year">
              Year of Study <span className="text-ink">*</span>
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`${inputClass} ${!formData.year ? 'text-muted' : ''}`}
              required
            >
              <option value="" disabled>Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        {/* Row 4: Preferred Department */}
        <div>
          <label className={labelClass} htmlFor="department">
            Preferred Department <span className="text-ink">*</span>
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`${inputClass} ${!formData.department ? 'text-muted' : ''}`}
            required
          >
            <option value="" disabled>Select Department</option>
            <option value="Social Media">Social Media Team (Content, Reels, Posts, Brand)</option>
            <option value="Design and Tech">Design &amp; Tech Team (Web, UI/UX, Graphics)</option>
            <option value="Research and Content">Research &amp; Content Team (Startup Trends, Write-ups)</option>
            <option value="Event Management">Event Management Team (Planning, Logistics)</option>
            <option value="Documentation">Documentation Team (Photos, Videos, Reports)</option>
          </select>
        </div>

        {/* Row 5: LinkedIn URL */}
        <div>
          <label className={labelClass} htmlFor="linkedin">
            LinkedIn Profile URL (Optional)
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/your-profile"
            className={inputClass}
          />
        </div>

        {/* Row 6: Statement of Purpose */}
        <div>
          <label className={labelClass} htmlFor="whyJoin">
            Why do you want to join UIET E-Cell? <span className="text-ink">*</span>
          </label>
          <textarea
            id="whyJoin"
            name="whyJoin"
            value={formData.whyJoin}
            onChange={handleChange}
            placeholder="Tell us what excites you about entrepreneurship and what skills you bring to the team (max 300 characters)..."
            rows={4}
            className={`${inputClass} resize-none`}
            required
          />
          <div className="text-right text-xs text-muted mt-1.5">
            {charCount} / {MAX_CHARS}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          arrow
          disabled={isSubmitting}
          className="w-fit"
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
        </Button>
      </form>
    </div>
  );
}
