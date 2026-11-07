import type { Metadata } from 'next';
import { MockTestsCommandCenter } from '@/components/mock-tests/mock-tests-command-center';

export const metadata: Metadata = {
  title: 'Mock Examination Command Center | CEE Medical Prep',
  description:
    'Experience realistic Nepal Medical Education Commission (MEC) CEE computer-based test simulations with Mistake DNA diagnostics and intelligent performance tracking.',
};

export default function StudentMockTestsPage() {
  return <MockTestsCommandCenter />;
}
