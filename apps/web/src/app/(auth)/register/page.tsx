import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from '@/components/auth/auth-forms';

export const metadata: Metadata = {
  title: 'Create Account | CEE Medical Prep',
  description: 'Create a secure student account for your CEE Medical Prep journey.',
};

export default function RegisterPage() {
  return (
    <AuthShell mode="register">
      <RegisterForm />
    </AuthShell>
  );
}
