'use client';

import React, { createContext, useContext, type ReactNode } from 'react';
import { signout } from '@/app/auth/actions';
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
  login: async () => ({
    success: false,
    error: 'Please sign in via the server-protected /login page.',
  }),
  logout: () => {},
});

export function AdminAuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: AdminUser | null;
}) {
  const logout = () => {
    signout();
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user: initialUser,
        isAuthenticated: !!initialUser,
        login: async () => ({
          success: false,
          error: 'Please sign in via the server-protected /login page.',
        }),
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
