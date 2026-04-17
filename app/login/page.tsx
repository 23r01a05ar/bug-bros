'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bug, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const redirect = searchParams.get('redirect') || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      showToast('Logged in successfully', 'success');
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-16">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <Bug size={40} className="mx-auto mb-4 text-[var(--color-accent)]" />
          <h1 className="text-h2" style={{ fontFamily: 'var(--font-heading)' }}>
            Admin Login
          </h1>
          <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mt-2">
            Sign in to manage Bug Bros content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-[var(--color-error)]">
              {error}
            </div>
          )}

          <Input
            label="Email"
            id="login-email"
            type="email"
            placeholder="admin@bugbros.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn size={16} />
                Sign In
              </span>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
