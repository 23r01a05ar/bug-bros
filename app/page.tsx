import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trophy, Code2, Users } from 'lucide-react';
import { getFeaturedProjects } from '@/lib/queries/projects';
import { getLatestAchievements } from '@/lib/queries/achievements';
import { getActiveMembers } from '@/lib/queries/users';
import { Badge, getAchievementBadgeVariant } from '@/components/ui/badge';

export default async function HomePage() {
  let featuredProjects: any[] = [];
  let latestAchievements: any[] = [];
  let activeMembers: any[] = [];

  try {
    [featuredProjects, latestAchievements, activeMembers] = await Promise.all([
      getFeaturedProjects(),
      getLatestAchievements(3),
      getActiveMembers(),
    ]);
  } catch {
    // Will show empty states
  }

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="container-main w-full">
          <div className="max-w-4xl">
            {/* Vertical label */}
            <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2">
              <span className="vertical-text">EST. 2024 — PORTFOLIO</span>
            </div>

            <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-accent)] font-medium mb-6">
              Team Portfolio
            </p>

            <h1 className="text-display mb-8">
              Breaking Bugs,
              <br />
              <span className="text-[var(--color-accent)]">Building</span> the
              <br />
              Future
            </h1>

            <p className="text-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] max-w-lg mb-10 leading-relaxed">
              We are a collective of developers, designers, and problem solvers
              pushing the boundaries of what&apos;s possible.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/projects" className="btn-gold">
                View Our Work
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium tracking-wide text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] hover:text-[var(--color-fg)] dark:hover:text-[var(--color-dark-fg)] transition-colors"
              >
                Meet the Team
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-30" />
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="py-24">
        <div className="container-main">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium mb-3">
                Featured Work
              </p>
              <h2 className="text-h2" style={{ fontFamily: 'var(--font-heading)' }}>
                Selected Projects
              </h2>
              <div className="section-divider mt-4" />
            </div>
            <Link
              href="/projects"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {featuredProjects.length === 0 ? (
            <div className="text-center py-16">
              <Code2 size={48} className="mx-auto mb-4 text-[var(--color-muted-light)]" />
              <p className="text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                Projects coming soon
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <div className="card group overflow-hidden">
                    {project.screenshots?.[0] ? (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={project.screenshots[0]}
                          alt={project.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-52 bg-[var(--color-surface-raised)] dark:bg-[var(--color-dark-surface-raised)] flex items-center justify-center">
                        <Code2 size={32} className="text-[var(--color-muted-light)]" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        {project.name}
                      </h3>
                      <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack?.slice(0, 4).map((tech: string) => (
                          <Badge key={tech} variant="accent">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== LATEST ACHIEVEMENTS ===== */}
      <section className="py-24 bg-[var(--color-surface-raised)] dark:bg-[var(--color-dark-surface-raised)]">
        <div className="container-main">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium mb-3">
                Recognition
              </p>
              <h2 className="text-h2" style={{ fontFamily: 'var(--font-heading)' }}>
                Latest Achievements
              </h2>
              <div className="section-divider mt-4" />
            </div>
            <Link
              href="/achievements"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {latestAchievements.length === 0 ? (
            <div className="text-center py-16">
              <Trophy size={48} className="mx-auto mb-4 text-[var(--color-muted-light)]" />
              <p className="text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                Achievements coming soon
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestAchievements.map((ach) => (
                <div key={ach.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant={getAchievementBadgeVariant(ach.type)}>
                      {ach.type}
                    </Badge>
                    {ach.date && (
                      <span className="text-xs text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                        {new Date(ach.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {ach.title}
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-4 line-clamp-2">
                    {ach.description}
                  </p>
                  {ach.participants?.length > 0 && (
                    <div className="flex -space-x-2">
                      {ach.participants.slice(0, 5).map((p: any) => (
                        <div key={p.users.id} className="w-8 h-8 rounded-full border-2 border-[var(--color-surface)] dark:border-[var(--color-dark-surface)] overflow-hidden bg-[var(--color-surface-raised)]">
                          {p.users.avatar_url ? (
                            <Image src={p.users.avatar_url} alt={p.users.full_name} width={32} height={32} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-medium text-[var(--color-muted)]">
                              {p.users.full_name?.charAt(0)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== ACTIVE MEMBERS GRID ===== */}
      <section className="py-24">
        <div className="container-main">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium mb-3">
              Our People
            </p>
            <h2 className="text-h2" style={{ fontFamily: 'var(--font-heading)' }}>
              The Team
            </h2>
            <div className="section-divider mx-auto mt-4" />
          </div>

          {activeMembers.length === 0 ? (
            <div className="text-center py-16">
              <Users size={48} className="mx-auto mb-4 text-[var(--color-muted-light)]" />
              <p className="text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                Team members coming soon
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {activeMembers.map((member) => (
                <Link key={member.id} href={`/team/${member.id}`} className="group text-center">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-[var(--color-surface-raised)] dark:bg-[var(--color-dark-surface-raised)]">
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url}
                        alt={member.full_name}
                        fill
                        className="object-cover img-grayscale"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[var(--color-muted-light)]">
                        {member.full_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold group-hover:text-[var(--color-accent)] transition-colors">
                    {member.full_name}
                  </h4>
                  <p className="text-xs text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                    {member.short_bio}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/team" className="btn-gold">
              View Full Team
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ABOUT TEASER ===== */}
      <section className="py-24 bg-[var(--color-fg)] dark:bg-[var(--color-dark-surface)] text-[var(--color-bg)] dark:text-[var(--color-dark-fg)]">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium mb-3">
                About Us
              </p>
              <h2 className="text-h2 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                More Than Just
                <br />
                a Team
              </h2>
              <p className="text-[rgba(249,248,246,0.7)] dark:text-[var(--color-dark-muted)] leading-relaxed mb-8">
                We&apos;re a collective of curious minds who believe in the power of
                collaboration. From hackathons to production systems, we build things
                that matter.
              </p>
              <Link href="/about" className="btn-gold">
                Our Story
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-8 border border-[rgba(249,248,246,0.1)] rounded-lg">
                <p className="text-display text-[var(--color-accent)]" style={{ fontSize: '3rem' }}>
                  {activeMembers.length || '0'}
                </p>
                <p className="text-sm text-[rgba(249,248,246,0.5)] mt-2">Members</p>
              </div>
              <div className="text-center p-8 border border-[rgba(249,248,246,0.1)] rounded-lg">
                <p className="text-display text-[var(--color-accent)]" style={{ fontSize: '3rem' }}>
                  {featuredProjects.length || '0'}+
                </p>
                <p className="text-sm text-[rgba(249,248,246,0.5)] mt-2">Projects</p>
              </div>
              <div className="text-center p-8 border border-[rgba(249,248,246,0.1)] rounded-lg">
                <p className="text-display text-[var(--color-accent)]" style={{ fontSize: '3rem' }}>
                  {latestAchievements.length || '0'}+
                </p>
                <p className="text-sm text-[rgba(249,248,246,0.5)] mt-2">Awards</p>
              </div>
              <div className="text-center p-8 border border-[rgba(249,248,246,0.1)] rounded-lg">
                <p className="text-display text-[var(--color-accent)]" style={{ fontSize: '3rem' }}>
                  ∞
                </p>
                <p className="text-sm text-[rgba(249,248,246,0.5)] mt-2">Bugs Fixed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
