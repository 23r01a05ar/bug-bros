import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getProjectBySlug } from '@/lib/queries/projects';
import { Badge } from '@/components/ui/badge';
import { ScreenshotCarousel } from '@/components/ui/carousel';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  return {
    title: project ? `${project.name} — Bug Bros` : 'Project — Bug Bros',
    description: project?.description || 'Bug Bros project',
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container-main">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] hover:text-[var(--color-accent)] transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-hero mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {project.name}
          </h1>
          <p className="text-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] max-w-2xl leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech_stack?.map((tech) => (
              <Badge key={tech} variant="accent">{tech}</Badge>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                <ExternalLink size={16} className="mr-2" />
                Live Demo
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
              >
                <Github size={16} />
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* Screenshots Carousel */}
        {project.screenshots && project.screenshots.length > 0 && (
          <div className="mb-16">
            <ScreenshotCarousel images={project.screenshots} alt={project.name} />
          </div>
        )}

        {/* Full Description */}
        {project.full_description && (
          <div className="max-w-3xl mb-16">
            <h2 className="text-h3 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              About This Project
            </h2>
            <div className="text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] leading-relaxed space-y-4">
              {project.full_description.split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* Contributors */}
        {project.contributors && project.contributors.length > 0 && (
          <div>
            <h2 className="text-h3 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              Contributors
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {project.contributors.map((c: any) => (
                <Link key={c.users.id} href={`/team/${c.users.id}`} className="group text-center">
                  <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-[var(--color-surface-raised)] dark:bg-[var(--color-dark-surface-raised)] mb-3">
                    {c.users.avatar_url ? (
                      <Image
                        src={c.users.avatar_url}
                        alt={c.users.full_name}
                        fill
                        className="object-cover img-grayscale"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[var(--color-muted-light)]">
                        {c.users.full_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold group-hover:text-[var(--color-accent)] transition-colors">
                    {c.users.full_name}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
