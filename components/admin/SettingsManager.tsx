'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastProvider';
import { PageHeader, adminInput, adminLabel, adminCard } from './ui';

interface AdminSettings {
  web3formsKey?: string;
  siteInfo?: { email?: string; phone?: string; address?: string };
  announcementBanner?: { text?: string; enabled?: boolean };
}

export default function SettingsManager({
  settings,
  setSettings,
}: {
  settings?: AdminSettings;
  setSettings?: React.Dispatch<React.SetStateAction<AdminSettings>>;
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    web3formsKey: settings?.web3formsKey || '',
    email: settings?.siteInfo?.email || 'ecellmdu@gmail.com',
    phone: settings?.siteInfo?.phone || '',
    address: settings?.siteInfo?.address || 'UIET, Maharshi Dayanand University (MDU), Rohtak, Haryana - 124001',
    bannerText: settings?.announcementBanner?.text || 'E-Cell | UIET MDU Rohtak · Ideas into Impact',
    bannerEnabled: settings?.announcementBanner?.enabled ?? true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (setSettings) {
      setSettings((prev: AdminSettings) => {
        const next = {
          ...prev,
          web3formsKey: form.web3formsKey,
          siteInfo: {
            ...prev.siteInfo,
            email: form.email,
            phone: form.phone,
            address: form.address,
          },
          announcementBanner: {
            ...prev.announcementBanner,
            text: form.bannerText,
            enabled: form.bannerEnabled,
          },
        };
        try { localStorage.setItem('ECELL_SETTINGS', JSON.stringify(next)); } catch {}
        return next;
      });
    }
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <div>
      <PageHeader title="Portal Settings" subtitle="Configure form API keys, campus contact info, and announcements." />

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${adminCard} p-6 md:p-8 flex flex-col gap-6`}>
          <h2 className="font-sans font-medium text-base tracking-[-0.015em] text-ink">Form Integrations</h2>

          <div>
            <label className={adminLabel}>Web3Forms Access Key</label>
            <input
              type="text"
              value={form.web3formsKey}
              onChange={(e) => setForm({ ...form, web3formsKey: e.target.value })}
              className={adminInput}
              placeholder="ca0b970d-2396-4be4-96d0-f4f2697acddc"
            />
            <p className="text-xs text-muted mt-1.5">
              Used for unlimited free forwarding to ecellmdu@gmail.com
            </p>
          </div>

          <div className="h-px bg-border" />

          <h2 className="font-sans font-medium text-base tracking-[-0.015em] text-ink">Contact &amp; Campus Info</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={adminLabel}>Official Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={adminInput}
              />
            </div>
            <div>
              <label className={adminLabel}>Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={adminInput}
              />
            </div>
          </div>

          <div>
            <label className={adminLabel}>Campus Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={adminInput}
            />
          </div>
        </div>

        <div className={`${adminCard} p-6 md:p-8 flex flex-col gap-6 h-fit`}>
          <h2 className="font-sans font-medium text-base tracking-[-0.015em] text-ink">Announcement Banner</h2>

          <div>
            <label className={adminLabel}>Banner Text</label>
            <input
              type="text"
              value={form.bannerText}
              onChange={(e) => setForm({ ...form, bannerText: e.target.value })}
              className={adminInput}
            />
          </div>

          <label className="flex items-center justify-between gap-4 bg-soft border border-bordersubtle rounded-card px-4 py-3.5 cursor-pointer">
            <div>
              <div className="text-sm font-medium text-ink">Show banner on site</div>
              <div className="text-xs text-muted mt-0.5">Displays a recruitment banner above the homepage</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.bannerEnabled}
              onClick={() => setForm({ ...form, bannerEnabled: !form.bannerEnabled })}
              className={`relative w-11 h-6 rounded-pill transition-colors duration-200 shrink-0 ${
                form.bannerEnabled ? 'bg-ink' : 'bg-[rgba(27,29,30,0.2)]'
              }`}
            >
              <span
                className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-200 ${
                  form.bannerEnabled ? 'left-[24px]' : 'left-[3px]'
                }`}
              />
            </button>
          </label>

          <div className="bg-[linear-gradient(71deg,rgba(217,243,252,0.5)_11%,rgba(235,248,253,0.6)_45.7%,rgba(255,255,255,0.6)_64.5%,rgba(253,241,211,0.7)_100%)] border border-border rounded-card px-5 py-4 text-center">
            <div className="text-xs font-medium uppercase tracking-[0.06em] text-muted mb-1">Preview</div>
            <div className="text-sm font-medium text-ink">
              {form.bannerEnabled ? form.bannerText : 'Banner hidden'}
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" arrow className="w-fit">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
