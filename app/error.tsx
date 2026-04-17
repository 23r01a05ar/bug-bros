'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="text-center max-w-md">
        <AlertCircle size={56} className="mx-auto mb-6 text-[var(--color-error)]" />
        <h2
          className="text-h2 mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Something went wrong
        </h2>
        <p className="text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button onClick={reset} className="btn-gold">
          Try Again
        </button>
      </div>
    </section>
  );
}
