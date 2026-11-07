import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AuthBoundary } from '@/components/auth/auth-boundary';
import { StudentDashboardShell } from '@/components/dashboard/student-dashboard-shell';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <AuthBoundary>
      <StudentDashboardShell>{children}</StudentDashboardShell>
    </AuthBoundary>
  );
}
