import Link from 'next/link';
import { Bug } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="text-center">
        <Bug size={56} className="mx-auto mb-6 text-[var(--color-accent)]" />
        <h1
          className="text-display mb-4"
          style={{ fontFamily: 'var(--font-heading)', fontSize: '6rem' }}
        >
          404
        </h1>
        <p className="text-xl text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-8">
          This page seems to have been squashed.
        </p>
        <Link href="/" className="btn-gold">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
