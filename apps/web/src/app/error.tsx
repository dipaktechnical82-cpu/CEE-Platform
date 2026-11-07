'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to telemetry service in production
    console.error('App error boundary caught exception:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16" role="alert">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
          Application Error
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          An unexpected error occurred while processing your request. Our team has been notified.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="primary" onClick={() => reset()}>
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Go to Homepage
          </Button>
        </div>
      </Container>
    </div>
  );
}
