'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useAdminAuth } from '@/context/AdminAuthProvider';
import { useToast } from '@/context/ToastProvider';
import { adminInput, adminLabel } from './ui';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      showToast('Signed into Admin Board', 'success');
    } else {
      setError(res.error || 'Invalid credentials.');
      showToast('Login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[linear-gradient(71deg,rgba(217,243,252,0.38)_11%,rgba(235,248,253,0.45)_45.7%,rgba(255,255,255,0.54)_64.5%,rgba(253,241,211,0.66)_100%)]">
      <div className="w-full max-w-md bg-white border border-border rounded-panel p-8 shadow-[0_8px_32px_rgba(27,29,30,0.08)]">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 px-4 rounded-2xl bg-white border border-warm flex items-center justify-center mb-4 shadow-2xs">
            <Image src="/logo.png" alt="E-Cell | UIET MDU Rohtak Logo" width={120} height={58} className="h-9 w-auto object-contain" />
          </div>
          <h1 className="font-sans font-bold text-2xl tracking-tight text-ink">E-Cell | UIET MDU Rohtak</h1>
          <p className="text-sm text-secondary mt-1">Admin Board &amp; Content Management</p>
        </div>

        {error && (
          <div className="bg-[#fde7eb] border border-[#f4889a]/40 text-[#c74a62] text-sm rounded-card px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className={adminLabel} htmlFor="admin-email">
              Admin Email
            </label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ecell.in"
              className={adminInput}
              required
            />
          </div>

          <div>
            <label className={adminLabel} htmlFor="admin-password">
              Password
            </label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className={adminInput}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" arrow disabled={loading} className="justify-center">
            {loading ? 'Signing in…' : 'Sign In to Dashboard'}
          </Button>
        </form>

        <p className="text-xs text-muted text-center mt-6">
          Access restricted to the E-Cell executive board · Unauthorized access is logged.
        </p>
      </div>
    </div>
  );
}
