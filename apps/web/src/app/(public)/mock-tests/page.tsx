import type { Metadata } from 'next';
import { StudentThemeProvider } from '@/components/dashboard/theme-context';
import { MockTestsCommandCenter } from '@/components/mock-tests/mock-tests-command-center';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'CEE Mock Test Center | Full Examination Simulations & Performance Intelligence',
  description:
    'Experience authentic Nepal Medical Education Commission (MEC) CEE mock tests with 200 MCQs, timed computer-based interface, Mistake DNA error diagnostics, and recovery plans.',
  path: '/mock-tests',
});

export default function PublicMockTestsPage() {
  return (
    <StudentThemeProvider>
      <MockTestsCommandCenter />
    </StudentThemeProvider>
  );
}
