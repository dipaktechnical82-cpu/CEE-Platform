import type { Metadata } from 'next';
import React from 'react';
import { AdminDashboardShell } from '@/components/dashboard/admin-dashboard-shell';
import { AuthBoundary } from '@/components/auth/auth-boundary';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthBoundary>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </AuthBoundary>
  );
}
