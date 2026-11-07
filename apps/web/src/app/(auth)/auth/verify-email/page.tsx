import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/auth-shell';
import { VerifyEmailForm } from '@/components/auth/auth-forms';

export const metadata: Metadata = {
  title: 'Verify Email | CEE Medical Prep',
};

export default function VerifyEmailPage() {
  return (
    <AuthShell mode="recovery">
      <VerifyEmailForm />
    </AuthShell>
  );
}
