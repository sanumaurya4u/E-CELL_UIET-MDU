'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastProvider';
import { supabase } from '@/lib/supabase';
import { departments } from '@/data/team';
import { PageHeader, Modal, EmptyState, FilterPills, adminInput, adminLabel, adminCard, adminTd, adminTh } from './ui';

export interface AdminMember {
  id: number;
  name: string;
  role: string;
  department: string;
  year?: string;
  linkedin?: string;
  email?: string;
  photo?: string;
  order?: number;
}

const BLANK: Omit<AdminMember, 'id'> = {
  name: '',
  role: '',
  department: 'Leadership',
  year: '3rd Year, B.Tech CSE',
  linkedin: '',
  email: '',
  photo: '',
  order: 99,
};

export default function TeamManager({
  team,
  setTeam,
}: {
  team: AdminMember[];
  setTeam?: (t: AdminMember[]) => void;
}) {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminMember | null>(null);
  const [form, setForm] = useState<Omit<AdminMember, 'id'>>(BLANK);
  const [deptFilter, setDeptFilter] = useState('All');

  const openCreate = () => {
    setEditing(null);
    setForm(BLANK);
    setModalOpen(true);
  };

  const openEdit = (m: AdminMember) => {
    setEditing(m);
    setForm({ ...BLANK, ...m });
    setModalOpen(true);
  };

  const persist = async (row: AdminMember, upsert: boolean) => {
    if (!supabase) return;
    try {
      const { id, ...fields } = row;
      if (upsert) await supabase.from('team').upsert({ id, ...fields });
      else await supabase.from('team').insert([fields]);
    } catch (e) {
      console.warn('[Admin] Supabase team persist warning:', e);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      showToast('Please enter name and role', 'error');
      return;
    }

    if (editing) {
      const updated = team.map((m) => (m.id === editing.id ? { ...m, ...form } : m));
      if (setTeam) setTeam(updated);
      try { localStorage.setItem('ECELL_TEAM', JSON.stringify(updated)); } catch {}
      persist({ ...editing, ...form }, true);
      showToast('Member updated!', 'success');
    } else {
      const created: AdminMember = { ...form, id: Date.now() };
      const updated = [...team, created];
      if (setTeam) setTeam(updated);
      try { localStorage.setItem('ECELL_TEAM', JSON.stringify(updated)); } catch {}
      persist(created, false);
      showToast('Team member added!', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Remove this team member?')) {
      const updated = team.filter((m) => m.id !== id);
      if (setTeam) setTeam(updated);
      try { localStorage.setItem('ECELL_TEAM', JSON.stringify(updated)); } catch {}
      if (supabase) supabase.from('team').delete().eq('id', id).then(undefined, () => {});
      showToast('Member removed', 'info');
    }
  };

  const filtered = deptFilter === 'All' ? team : team.filter((m) => m.department === deptFilter);

  return (
    <div>
      <PageHeader
        title="Team Roster Management"
        subtitle="Manage core executive members, departments, and roles."
        action={
          <Button onClick={openCreate} variant="primary" size="sm" arrow>
            Add Member
          </Button>
        }
      />

      {/* Department filter */}
      <div className="mb-4">
        <FilterPills options={['All', ...departments]} active={deptFilter} onChange={setDeptFilter} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Member' : 'Add Team Member'} wide>
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={adminLabel}>Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ananya Sharma"
                className={adminInput}
                required
              />
            </div>
            <div>
              <label className={adminLabel}>Role *</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. President"
                className={adminInput}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={adminLabel}>Department</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={adminInput}
              >
                {departments.map((d: string) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={adminLabel}>Year</label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="e.g. 3rd Year, B.Tech CSE"
                className={adminInput}
              />
            </div>
          </div>

          <div>
            <label className={adminLabel}>Photo URL (optional)</label>
            <input
              type="url"
              value={form.photo}
              onChange={(e) => setForm({ ...form, photo: e.target.value })}
              placeholder="https://… or /gallery/photo.jpg"
              className={adminInput}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={adminLabel}>LinkedIn URL</label>
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/…"
                className={adminInput}
              />
            </div>
            <div>
              <label className={adminLabel}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="member@ecell.in"
                className={adminInput}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" arrow className="justify-center">
            {editing ? 'Save Changes' : 'Add Member'}
          </Button>
        </form>
      </Modal>

      <div className={adminCard}>
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={adminTh}>Member</th>
                  <th className={adminTh}>Role</th>
                  <th className={adminTh}>Department</th>
                  <th className={adminTh}>Year</th>
                  <th className={adminTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id}>
                    <td className={adminTd}>
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=1b1d1e&color=fff&size=64`}
                          alt={m.name}
                          className="w-9 h-9 rounded-full object-cover bg-soft"
                        />
                        <span className="font-medium text-ink">{m.name}</span>
                      </div>
                    </td>
                    <td className={adminTd}>{m.role}</td>
                    <td className={adminTd}>{m.department}</td>
                    <td className={adminTd}>{m.year || '—'}</td>
                    <td className={adminTd}>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(m)}
                          className="text-[13px] font-medium text-ink underline underline-offset-2 decoration-[rgba(27,29,30,0.3)] hover:decoration-ink"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(m.id)}
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
            <EmptyState text={`No members in "${deptFilter}".`} />
          </div>
        )}
      </div>
    </div>
  );
}
