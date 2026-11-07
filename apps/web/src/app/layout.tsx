import type { Metadata, Viewport } from 'next';
import './globals.css';
import { DomReconciliationPatch } from '@/components/providers/dom-reconciliation-patch';
import { SkipLink } from '@/components/ui/skip-link';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Nepal CEE Medical Entrance Preparation',
    default: 'Nepal CEE Preparation | AI-Powered Medical Entrance Platform',
  },
  description:
    'Comprehensive, high-yield preparation platform for Nepal Medical Education Commission Common Entrance Examination (CEE) for MBBS, BDS, BSc Nursing, and allied health programs.',
  keywords: [
    'Nepal CEE',
    'CEE medical entrance Nepal',
    'MBBS entrance Nepal',
    'MEC entrance examination',
    'BDS entrance Nepal',
    'Nepal CEE syllabus',
    'medical mock tests Nepal',
  ],
  authors: [{ name: 'Nepal CEE Editorial & Academic Faculty' }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col font-sans antialiased text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950">
        <DomReconciliationPatch />
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
