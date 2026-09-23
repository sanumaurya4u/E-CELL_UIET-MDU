'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastProvider';
import { supabase } from '@/lib/supabase';
import { PageHeader, Modal, EmptyState, adminInput, adminLabel, adminCard, adminTd, adminTh } from './ui';

export interface Sponsor {
  id: number;
  name: string;
  url?: string;
  tier?: string;
  initials?: string;
  color?: string;
}

const TIERS = ['gold', 'silver', 'community'];
const BLANK: Omit<Sponsor, 'id'> = { name: '', url: '#', tier: 'community', initials: '', color: '#4928fd' };

export default function PartnersManager({
  sponsors,
  setSponsors,
}: {
  sponsors: Sponsor[];
  setSponsors?: (s: Sponsor[]) => void;
}) {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [form, setForm] = useState<Omit<Sponsor, 'id'>>(BLANK);

  const openCreate = () => {
    setEditing(null);
    setForm(BLANK);
    setModalOpen(true);
  };

  const openEdit = (s: Sponsor) => {
    setEditing(s);
    setForm({ ...BLANK, ...s });
    setModalOpen(true);
  };

  const persist = async (row: Sponsor, upsert: boolean) => {
    if (!supabase) return;
    try {
      const { id, ...fields } = row;
      if (upsert) await supabase.from('sponsors').upsert({ id, ...fields });
      else await supabase.from('sponsors').insert([fields]);
    } catch (e) {
      console.warn('[Admin] Supabase sponsors persist warning:', e);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      showToast('Partner name is required', 'error');
      return;
    }

    const withInitials = {
      ...form,
      initials: form.initials || form.name.split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase(),
    };

    if (editing) {
      const updated = sponsors.map((s) => (s.id === editing.id ? { ...s, ...withInitials } : s));
      if (setSponsors) setSponsors(updated);
      try { localStorage.setItem('ECELL_SPONSORS', JSON.stringify(updated)); } catch {}
      persist({ ...editing, ...withInitials }, true);
      showToast('Partner updated!', 'success');
    } else {
      const created: Sponsor = { ...withInitials, id: Date.now() };
      const updated = [...sponsors, created];
      if (setSponsors) setSponsors(updated);
      try { localStorage.setItem('ECELL_SPONSORS', JSON.stringify(updated)); } catch {}
      persist(created, false);
      showToast('Partner added!', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Remove this partner?')) {
      const updated = sponsors.filter((s) => s.id !== id);
      if (setSponsors) setSponsors(updated);
      try { localStorage.setItem('ECELL_SPONSORS', JSON.stringify(updated)); } catch {}
      if (supabase) supabase.from('sponsors').delete().eq('id', id).then(undefined, () => {});
      showToast('Partner removed', 'info');
    }
  };

  return (
    <div>
      <PageHeader
        title="Partners & Sponsors"
        subtitle="Manage institutional partners shown in the homepage logo strip."
        action={
          <Button onClick={openCreate} variant="primary" size="sm" arrow>
            Add Partner
          </Button>
        }
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Partner' : 'Add Partner'}>
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div>
            <label className={adminLabel}>Partner Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Startup Haryana"
              className={adminInput}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={adminLabel}>Website URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://…"
                className={adminInput}
              />
            </div>
            <div>
              <label className={adminLabel}>Tier</label>
              <select
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                className={adminInput}
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={adminLabel}>Logo Initials</label>
              <input
                type="text"
                value={form.initials}
                onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase() })}
                placeholder="Auto-generated from name"
                className={adminInput}
                maxLength={4}
              />
            </div>
            <div>
              <label className={adminLabel}>Accent Color</label>
              <input
                type="color"
                value={form.color || '#4928fd'}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className={`${adminInput} h-[42px] p-1 cursor-pointer`}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" arrow className="justify-center">
            {editing ? 'Save Changes' : 'Add Partner'}
          </Button>
        </form>
      </Modal>

      <div className={adminCard}>
        {sponsors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={adminTh}>Mark</th>
                  <th className={adminTh}>Name</th>
                  <th className={adminTh}>Tier</th>
                  <th className={adminTh}>URL</th>
                  <th className={adminTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map((s) => (
                  <tr key={s.id}>
                    <td className={adminTd}>
                      <span
                        className="inline-flex items-center justify-center w-9 h-9 rounded-card text-xs font-semibold text-white"
                        style={{ backgroundColor: s.color || '#1b1d1e' }}
                      >
                        {s.initials || s.name.slice(0, 2).toUpperCase()}
                      </span>
                    </td>
                    <td className={`${adminTd} font-medium`}>{s.name}</td>
                    <td className={adminTd}>
                      <span className="inline-flex py-1 px-2.5 rounded-pill text-xs font-medium bg-soft text-secondary capitalize">
                        {s.tier}
                      </span>
                    </td>
                    <td className={adminTd}>
                      {s.url && s.url !== '#' ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 text-[13px]">
                          Visit
                        </a>
                      ) : (
                        <span className="text-muted text-[13px]">—</span>
                      )}
                    </td>
                    <td className={adminTd}>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="text-[13px] font-medium text-ink underline underline-offset-2 decoration-[rgba(27,29,30,0.3)] hover:decoration-ink"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          className="text-[13px] font-medium text-[#c74a62] underline underline-offset-2 decoration-[#f4889a]/50 hover:decoration-[#c74a62]"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState text="No partners yet — add your institutional partners." />
          </div>
        )}
      </div>
    </div>
  );
}
