'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Code2, ExternalLink, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import type { ProjectWithContributors } from '@/lib/types/database';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithContributors[]>([]);
  const [search, setSearch] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [allTech, setAllTech] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [search, techFilter]);

  async function fetchProjects() {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from('projects')
      .select('*, contributors(users(*))')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (techFilter) {
      query = query.contains('tech_stack', [techFilter]);
    }

    const { data } = await query;
    setProjects((data as unknown as ProjectWithContributors[]) || []);

    // Get all tech stacks for filter
    if (allTech.length === 0) {
      const { data: allProjects } = await supabase.from('projects').select('tech_stack');
      const tech = new Set<string>();
      allProjects?.forEach((p) => p.tech_stack?.forEach((t) => tech.add(t)));
      setAllTech(Array.from(tech).sort());
    }

    setLoading(false);
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium mb-3">
            Our Work
          </p>
          <h1 className="text-hero mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Projects
          </h1>
          <p className="text-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] leading-relaxed">
            Explore our collection of projects spanning various technologies and domains.
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="input-field max-w-[200px]"
          >
            <option value="">All Technologies</option>
            {allTech.map((tech) => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="card p-0 overflow-hidden">
                <div className="skeleton" style={{ height: '200px' }} />
                <div className="p-6 space-y-3">
                  <div className="skeleton" style={{ height: '20px', width: '60%' }} />
                  <div className="skeleton" style={{ height: '14px', width: '100%' }} />
                  <div className="skeleton" style={{ height: '14px', width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24">
            <Code2 size={56} className="mx-auto mb-4 text-[var(--color-muted-light)]" />
            <p className="text-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
              {search || techFilter ? 'No projects match your search' : 'Projects will appear here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <div className="card group overflow-hidden h-full">
                  {/* Screenshot */}
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
                    <h3
                      className="text-lg font-semibold mb-2 group-hover:text-[var(--color-accent)] transition-colors"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {project.name}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech_stack?.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="accent">{tech}</Badge>
                      ))}
                      {project.tech_stack?.length > 4 && (
                        <Badge variant="default">+{project.tech_stack.length - 4}</Badge>
                      )}
                    </div>

                    {/* Links & Contributors */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                            <ExternalLink size={16} />
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                            <Github size={16} />
                          </a>
                        )}
                      </div>

                      {/* Contributor avatars */}
                      {project.contributors?.length > 0 && (
                        <div className="flex -space-x-2">
                          {project.contributors.slice(0, 3).map((c: any) => (
                            <div key={c.users.id} className="w-7 h-7 rounded-full border-2 border-[var(--color-surface)] dark:border-[var(--color-dark-surface)] overflow-hidden bg-[var(--color-surface-raised)]">
                              {c.users.avatar_url ? (
                                <Image src={c.users.avatar_url} alt={c.users.full_name} width={28} height={28} className="object-cover w-full h-full" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-medium">
                                  {c.users.full_name?.charAt(0)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
