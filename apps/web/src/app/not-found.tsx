import Link from 'next/link';
import { Container } from '@/components/ui/container';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <Container className="text-center">
        <p className="text-base font-semibold text-brand-600">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Sorry, we couldn’t find the page or medical study module you’re looking for.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Back to Home
          </Link>
          <Link
            href="/syllabus"
            className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            View CEE Syllabus
          </Link>
        </div>
      </Container>
    </div>
  );
}
