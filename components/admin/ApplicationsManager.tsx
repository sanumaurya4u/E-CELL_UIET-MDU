'use client';

import React, { useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastProvider';
import { supabase } from '@/lib/supabase';
import { PageHeader, StatusBadge, EmptyState, FilterPills, adminCard, adminTd, adminTh } from './ui';
import type { Application } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';

const FILTERS = ['All', 'Pending', 'Shortlisted', 'Accepted', 'Rejected'];

export default function ApplicationsManager({
  applications,
  setApplications,
}: {
  applications: Application[];
  setApplications?: Dispatch<SetStateAction<Application[]>>;
}) {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = applications.filter((a) => {
    if (filter !== 'All' && (a.status || 'Pending') !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.enrollment?.toLowerCase().includes(q) ||
      (a.deptInterest || a.deptinterest || '').toLowerCase().includes(q)
    );
  });

  const selectedApp = applications.find((a) => a.id === selectedId) || null;

  const updateStatus = async (appId: number, newStatus: string) => {
    const updated = applications.map((a) => (a.id === appId ? { ...a, status: newStatus } : a));
    if (setApplications) setApplications(updated);
    try {
      localStorage.setItem('ECELL_APPLICATIONS', JSON.stringify(updated));
    } catch {}

    if (supabase) {
      try {
        await supabase.from('applications').update({ status: newStatus }).eq('id', appId);
      } catch (e) {
        console.warn('[Admin] Supabase update warning:', e);
      }
    }

    showToast(`Application marked as "${newStatus}"`, 'success');
  };

  const exportCSV = () => {
    if (!applications.length) {
      showToast('No applications to export', 'error');
      return;
    }
    const headers = ['ID,Name,Enrollment,Email,Phone,Branch & Year,Department,Status,Submitted On'];
    const rows = applications.map((a) =>
      `"${a.id}","${a.name}","${a.enrollment || ''}","${a.email}","${a.phone}","${a.branchYear || a.branchyear || ''}","${a.deptInterest || a.deptinterest || ''}","${a.status || 'Pending'}","${a.submittedOn || a.submittedon || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `ecell_applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('CSV exported successfully', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Membership Applications"
        subtitle="Review, evaluate, and manage candidate recruitment submissions."
        action={
          <Button onClick={exportCSV} variant="outline" size="sm" arrow>
            Export CSV
          </Button>
        }
      />

      {/* Filters + search */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <FilterPills options={FILTERS} active={filter} onChange={setFilter} />

        <div className="relative">
          <RiSearchLine size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, enrollment…"
            className="w-64 lg:w-72 pl-9 pr-3.5 py-1.5 bg-white border border-border rounded-pill text-[13px] text-ink placeholder:text-muted outline-none focus:border-ink transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Table */}
        <div className={`${adminCard} overflow-hidden xl:col-span-3`}>
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={adminTh}>Candidate</th>
                    <th className={adminTh}>Department</th>
                    <th className={adminTh}>Branch &amp; Year</th>
                    <th className={adminTh}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedId(app.id)}
                      className={`cursor-pointer transition-colors duration-150 hover:bg-soft ${
                        selectedId === app.id ? 'bg-soft' : ''
                      }`}
                    >
                      <td className={adminTd}>
                        <div className="font-medium text-ink">{app.name}</div>
                        <div className="text-xs text-muted">{app.email}</div>
                      </td>
                      <td className={adminTd}>{app.deptInterest || app.deptinterest}</td>
                      <td className={adminTd}>{app.branchYear || app.branchyear}</td>
                      <td className={adminTd}>
                        <StatusBadge status={app.status || 'Pending'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5">
              <EmptyState text={`No applications matching "${filter}"${query ? ` and "${query}"` : ''}.`} />
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="xl:col-span-2">
          {selectedApp ? (
            <div className="bg-white border border-border rounded-panel p-5 xl:sticky xl:top-6">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-sans font-medium text-lg tracking-[-0.015em] text-ink">
                    {selectedApp.name}
                  </h2>
                  <div className="text-[13px] text-secondary mt-0.5">
                    {selectedApp.email}
                    {selectedApp.phone ? ` · ${selectedApp.phone}` : ''}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="w-8 h-8 rounded-full bg-soft text-ink hover:bg-softhover transition-colors flex items-center justify-center shrink-0"
                  aria-label="Close details"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                <Detail label="Enrollment No:" value={selectedApp.enrollment || 'N/A'} />
                <Detail label="Branch & Year:" value={selectedApp.branchYear || selectedApp.branchyear || 'N/A'} />
                <Detail label="Preferred Dept:" value={selectedApp.deptInterest || selectedApp.deptinterest || 'N/A'} />
                <Detail
                  label="Submitted:"
                  value={
                    selectedApp.submittedOn || selectedApp.submittedon
                      ? new Date(selectedApp.submittedOn || selectedApp.submittedon!).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'N/A'
                  }
                />
                {selectedApp.linkedin && (
                  <Detail
                    label="LinkedIn:"
                    value={
                      <a href={selectedApp.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink font-medium underline underline-offset-2">
                        View Profile
                      </a>
                    }
                  />
                )}
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.05em] text-muted mb-1.5">
                    Statement of Purpose
                  </div>
                  <p className="bg-soft border border-bordersubtle rounded-card p-4 text-sm leading-[1.6] text-ink">
                    &ldquo;{selectedApp.whyJoin || selectedApp.whyjoin || 'N/A'}&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-border">
                <div className="text-xs font-medium uppercase tracking-[0.05em] text-muted mb-3">
                  Update Recruitment Status
                </div>
                <div className="flex gap-2 flex-wrap">
                  <ActionBtn onClick={() => updateStatus(selectedApp.id, 'Shortlisted')} className="bg-[#e2f0ff] text-[#1d6fb3] hover:bg-[#cfe4fb]">
                    Shortlist
                  </ActionBtn>
                  <ActionBtn onClick={() => updateStatus(selectedApp.id, 'Accepted')} className="bg-[#e4f6df] text-[#2f7a1d] hover:bg-[#d4eecb">
                    Accept
                  </ActionBtn>
                  <ActionBtn onClick={() => updateStatus(selectedApp.id, 'Rejected')} className="bg-[#fde7eb] text-[#c74a62] hover:bg-[#fbd4da">
                    Reject
                  </ActionBtn>
                </div>
              </div>
            </div>
          ) : (
            <div className="xl:sticky xl:top-6">
              <EmptyState text="Select an application from the table to inspect the candidate profile." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs font-medium uppercase tracking-[0.05em] text-muted whitespace-nowrap">{label}</span>
      <span className="text-sm text-ink font-medium text-right">{value}</span>
    </div>
  );
}

function ActionBtn({ children, onClick, className }: { children: React.ReactNode; onClick: () => void; className: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2 px-4 rounded-pill text-[13px] font-medium transition-colors duration-200 ${className}`}
    >
      {children}
    </button>
  );
}
