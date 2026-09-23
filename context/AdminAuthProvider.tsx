'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { AdminUser } from '@/lib/types';

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AdminAuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ECELL_ADMIN_SESSION') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => {
          setUser(parsed);
        });
      }
    } catch (e) {
      console.warn('[AdminAuth] LocalStorage parse note:', e);
    }
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Supabase auth attempt
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (!error && data?.user) {
          const authUser = {
            email: data.user.email,
            name: data.user.email.split('@')[0],
            role: 'Super Admin',
          };
          setUser(authUser);
          localStorage.setItem('ECELL_ADMIN_SESSION', JSON.stringify(authUser));
          return { success: true };
        }
      } catch (err) {
        console.warn('[AdminAuth] Supabase attempt note, trying local fallback:', err);
      }
    }

    // 2. Local Fallback authentication
    const allowedAdmins = [
      { email: 'ecelluietfs@gmail.com', password: 'ecell@admin2026', name: 'Lakshay', role: 'Super Admin' },
      { email: 'ananya@ecell.in', password: 'ecell@admin2026', name: 'Ananya Sharma', role: 'President / Admin' },
      { email: 'admin@ecell.in', password: 'ecell@admin2026', name: 'Admin', role: 'Admin' },
    ];

    const match = allowedAdmins.find(
      (a) => a.email === cleanEmail && a.password === password
    );

    if (match) {
      const authUser = {
        email: match.email,
        name: match.name,
        role: match.role,
      };
      setUser(authUser);
      localStorage.setItem('ECELL_ADMIN_SESSION', JSON.stringify(authUser));
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials. Please verify your email and password.' };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('ECELL_ADMIN_SESSION');
      if (supabase) supabase.auth.signOut();
    } catch (e) {}
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
