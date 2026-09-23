'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastProvider';
import { supabase } from '@/lib/supabase';
import { PageHeader, Modal, EmptyState, adminInput, adminLabel, adminCard, adminTd, adminTh } from './ui';

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
}

const CATEGORIES = ['Events', 'Competitions', 'Workshops', 'Team'];
const BLANK: Omit<GalleryItem, 'id'> = { title: '', category: 'Events', image: '', description: '' };

export default function GalleryManager({
  gallery,
  setGallery,
}: {
  gallery: GalleryItem[];
  setGallery?: (g: GalleryItem[]) => void;
}) {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Omit<GalleryItem, 'id'>>(BLANK);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image) {
      showToast('Title and image URL are required', 'error');
      return;
    }

    const created: GalleryItem = { ...form, id: Date.now() };
    const next = [created, ...gallery];
    if (setGallery) setGallery(next);
    try { localStorage.setItem('ECELL_GALLERY', JSON.stringify(next)); } catch {}

    if (supabase) {
      supabase
        .from('gallery')
        .insert([created])
        .then(undefined, (err: unknown) => console.warn('[Admin] Supabase gallery persist warning:', err));
    }

    setModalOpen(false);
    setForm(BLANK);
    showToast('Photo added to gallery!', 'success');
  };

  const handleDelete = (id: number) => {
    if (confirm('Remove this photo from the gallery?')) {
      const updated = gallery.filter((g) => g.id !== id);
      if (setGallery) setGallery(updated);
      try { localStorage.setItem('ECELL_GALLERY', JSON.stringify(updated)); } catch {}
      if (supabase) supabase.from('gallery').delete().eq('id', id).then(undefined, () => {});
      showToast('Photo removed', 'info');
    }
  };

  return (
    <div>
      <PageHeader
        title="Gallery Management"
        subtitle="Curate the campus moments shown on the About page."
        action={
          <Button onClick={() => setModalOpen(true)} variant="primary" size="sm" arrow>
            Add Photo
          </Button>
        }
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Gallery Photo">
        <form onSubmit={handleAdd} className="flex flex-col gap-5">
          <div>
            <label className={adminLabel}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Eureka Pitching Finals"
              className={adminInput}
              required
            />
          </div>

          <div>
            <label className={adminLabel}>Image URL *</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="/gallery/photo.jpg or https://…"
              className={adminInput}
              required
            />
          </div>

          <div>
            <label className={adminLabel}>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={adminInput}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={adminLabel}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="A short caption for this moment…"
              className={`${adminInput} resize-none`}
            />
          </div>

          <Button type="submit" variant="primary" size="md" arrow className="justify-center">
            Add to Gallery
          </Button>
        </form>
      </Modal>

      <div className={adminCard}>
        {gallery.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={adminTh}>Preview</th>
                  <th className={adminTh}>Title</th>
                  <th className={adminTh}>Category</th>
                  <th className={adminTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gallery.map((g) => (
                  <tr key={g.id}>
                    <td className={adminTd}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.image} alt={g.title} className="w-16 h-11 rounded-sm2 object-cover bg-soft" />
                    </td>
                    <td className={adminTd}>
                      <div className="font-medium text-ink">{g.title}</div>
                      {g.description && <div className="text-xs text-muted truncate max-w-xs">{g.description}</div>}
                    </td>
                    <td className={adminTd}>{g.category}</td>
                    <td className={adminTd}>
                      <button
                        type="button"
                        onClick={() => handleDelete(g.id)}
                        className="text-[13px] font-medium text-[#c74a62] underline underline-offset-2 decoration-[#f4889a]/50 hover:decoration-[#c74a62]"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState text="No gallery photos yet." />
          </div>
        )}
      </div>
    </div>
  );
}
