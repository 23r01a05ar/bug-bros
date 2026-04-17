'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trophy } from 'lucide-react';
import { Badge, getAchievementBadgeVariant } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import type { AchievementWithParticipants } from '@/lib/types/database';

const filters = [
  { value: 'all', label: 'All' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'ctf', label: 'CTF' },
  { value: 'other', label: 'Other' },
];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementWithParticipants[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, [typeFilter]);

  async function fetchAchievements() {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from('achievements')
      .select('*, participants(users(*))')
      .order('date', { ascending: false });

    if (typeFilter !== 'all') {
      query = query.eq('type', typeFilter);
    }

    const { data } = await query;
    setAchievements((data as unknown as AchievementWithParticipants[]) || []);
    setLoading(false);
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium mb-3">
            Recognition
          </p>
          <h1 className="text-hero mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Achievements
          </h1>
          <p className="text-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] leading-relaxed">
            Our wins across hackathons, CTF competitions, and more.
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-12">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                typeFilter === f.value
                  ? 'bg-[var(--color-accent)] text-[var(--color-fg)]'
                  : 'border border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card p-6 space-y-4">
                <div className="skeleton" style={{ height: '24px', width: '100px' }} />
                <div className="skeleton" style={{ height: '20px', width: '80%' }} />
                <div className="skeleton" style={{ height: '14px', width: '100%' }} />
              </div>
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-24">
            <Trophy size={56} className="mx-auto mb-4 text-[var(--color-muted-light)]" />
            <p className="text-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
              {typeFilter !== 'all' ? `No ${typeFilter} achievements yet` : 'Achievements will appear here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((ach) => (
              <div key={ach.id} className="card overflow-hidden">
                {/* Badge Image */}
                {ach.badge_url && (
                  <div className="relative h-48 bg-[var(--color-surface-raised)] dark:bg-[var(--color-dark-surface-raised)]">
                    <Image
                      src={ach.badge_url}
                      alt={ach.title}
                      fill
                      className="object-contain p-6"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant={getAchievementBadgeVariant(ach.type)}>
                      {ach.type}
                    </Badge>
                    {ach.date && (
                      <span className="text-xs text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                        {new Date(ach.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-xl font-semibold mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {ach.title}
                  </h3>

                  {ach.description && (
                    <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-4 leading-relaxed">
                      {ach.description}
                    </p>
                  )}

                  {/* Participant avatars */}
                  {ach.participants && ach.participants.length > 0 && (
                    <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
                      <div className="flex -space-x-2">
                        {ach.participants.slice(0, 5).map((p: any) => (
                          <div
                            key={p.users.id}
                            className="w-8 h-8 rounded-full border-2 border-[var(--color-surface)] dark:border-[var(--color-dark-surface)] overflow-hidden bg-[var(--color-surface-raised)]"
                          >
                            {p.users.avatar_url ? (
                              <Image
                                src={p.users.avatar_url}
                                alt={p.users.full_name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-medium text-[var(--color-muted)]">
                                {p.users.full_name?.charAt(0)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                        {ach.participants.length} participant{ach.participants.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
