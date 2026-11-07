import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/auth-shell';
import { ResetPasswordForm } from '@/components/auth/auth-forms';

export const metadata: Metadata = {
  title: 'Set New Password | CEE Medical Prep',
};

export default function ResetPasswordPage() {
  return (
    <AuthShell mode="recovery">
      <ResetPasswordForm />
    </AuthShell>
  );
}
