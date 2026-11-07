import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotPasswordForm } from '@/components/auth/auth-forms';

export const metadata: Metadata = {
  title: 'Recover Account | CEE Medical Prep',
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell mode="recovery">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
