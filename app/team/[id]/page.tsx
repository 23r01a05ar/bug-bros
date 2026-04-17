import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getMemberById } from '@/lib/queries/users';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Github, Linkedin, Globe, Download, Calendar, Briefcase } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = await getMemberById(params.id);
  return {
    title: member ? `${member.full_name} — Bug Bros` : 'Member — Bug Bros',
    description: member?.short_bio || 'Bug Bros team member profile',
  };
}

export default async function MemberDetailPage({ params }: Props) {
  const member = await getMemberById(params.id);

  if (!member) {
    notFound();
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container-main">
        {/* Back link */}
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] hover:text-[var(--color-accent)] transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          Back to Team
        </Link>

        {/* Profile Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Avatar */}
          <div className="md:col-span-1">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[var(--color-surface-raised)] dark:bg-[var(--color-dark-surface-raised)]">
              {member.avatar_url ? (
                <Image
                  src={member.avatar_url}
                  alt={member.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl font-bold text-[var(--color-muted-light)]">
                  {member.full_name?.charAt(0)}
                </div>
              )}
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {member.github_url && (
                <a
                  href={member.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                >
                  <Github size={18} />
                </a>
              )}
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {member.website_url && (
                <a
                  href={member.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                >
                  <Globe size={18} />
                </a>
              )}
            </div>

            {/* Resume */}
            {member.resume_url && (
              <div className="mt-6">
                <a
                  href={member.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full text-center"
                >
                  <Download size={16} className="mr-2" />
                  Download Resume
                </a>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-accent)] font-medium mb-2">
              {member.role === 'admin' ? 'Team Lead' : 'Team Member'}
            </p>
            <h1 className="text-hero mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              {member.full_name}
            </h1>
            {member.bio && (
              <div className="prose prose-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] leading-relaxed mb-8">
                {member.bio.split('\n').map((p, i) => (
                  <p key={i} className="mb-4">{p}</p>
                ))}
              </div>
            )}
            {member.skills && member.skills.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-3">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <Badge key={skill} variant="accent">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Experience Timeline */}
        {member.experiences.length > 0 && (
          <div className="mb-20">
            <h2 className="text-h3 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              <Briefcase size={24} className="inline mr-3 text-[var(--color-accent)]" />
              Experience
            </h2>
            <div className="timeline">
              {member.experiences.map((exp) => (
                <div key={exp.id} className="timeline-item">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                      {exp.title}
                    </h3>
                    <span className="text-xs text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] flex items-center gap-1 shrink-0 ml-4">
                      <Calendar size={12} />
                      {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      {' — '}
                      {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-accent)] mb-2">{exp.company}</p>
                  {exp.description && (
                    <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Contributed */}
        {member.contributors.length > 0 && (
          <div className="mb-20">
            <h2 className="text-h3 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {member.contributors.map((c: any) => (
                <Link key={c.projects.id} href={`/projects/${c.projects.slug}`}>
                  <div className="card p-6 group">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--color-accent)] transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                      {c.projects.name}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] line-clamp-2">
                      {c.projects.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {member.participants.length > 0 && (
          <div>
            <h2 className="text-h3 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {member.participants.map((p: any) => (
                <div key={p.achievements.id} className="card p-6">
                  <Badge variant={p.achievements.type === 'hackathon' ? 'hackathon' : p.achievements.type === 'ctf' ? 'ctf' : 'other'} className="mb-3">
                    {p.achievements.type}
                  </Badge>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {p.achievements.title}
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                    {p.achievements.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume Viewer */}
        {member.resume_url && (
          <div className="mt-20">
            <h2 className="text-h3 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              Resume
            </h2>
            <div className="border border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded-lg overflow-hidden" style={{ height: '800px' }}>
              <iframe
                src={member.resume_url}
                className="w-full h-full"
                title={`${member.full_name}'s Resume`}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
