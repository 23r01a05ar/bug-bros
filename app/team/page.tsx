import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getActiveMembers } from '@/lib/queries/users';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Team — Bug Bros',
  description: 'Meet the talented team behind Bug Bros. Developers, designers, and problem solvers.',
};

export default async function TeamPage() {
  let members: any[] = [];
  try {
    members = await getActiveMembers();
  } catch {}

  return (
    <section className="py-16 md:py-24">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium mb-3">
            Our Team
          </p>
          <h1 className="text-hero mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            The People Behind
            <br />
            the Code
          </h1>
          <p className="text-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] leading-relaxed">
            A diverse team of passionate individuals united by curiosity and craft.
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Members Grid */}
        {members.length === 0 ? (
          <div className="text-center py-24">
            <Users size={56} className="mx-auto mb-4 text-[var(--color-muted-light)]" />
            <p className="text-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
              Team members will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <Link
                key={member.id}
                href={`/team/${member.id}`}
                className="group"
              >
                <div className="card overflow-hidden">
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden bg-[var(--color-surface-raised)] dark:bg-[var(--color-dark-surface-raised)]">
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url}
                        alt={member.full_name}
                        fill
                        className="object-cover img-grayscale"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-[var(--color-muted-light)]">
                        {member.full_name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3
                      className="text-xl font-semibold mb-1 group-hover:text-[var(--color-accent)] transition-colors"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {member.full_name}
                    </h3>
                    <p className="text-sm text-[var(--color-accent)] mb-3">
                      {member.role === 'admin' ? 'Lead' : 'Member'}
                    </p>
                    {member.short_bio && (
                      <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-4 line-clamp-2">
                        {member.short_bio}
                      </p>
                    )}
                    {member.skills && member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {member.skills.slice(0, 5).map((skill: string) => (
                          <Badge key={skill} variant="default">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
