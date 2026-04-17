import React from 'react';
import type { Metadata } from 'next';
import { getAboutContent } from '@/lib/queries/about';
import { Target, Eye, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About — Bug Bros',
  description: 'Learn about Bug Bros — our story, mission, vision, and journey.',
};

export default async function AboutPage() {
  let aboutData: any[] = [];
  try {
    aboutData = await getAboutContent();
  } catch {}

  const story = aboutData.filter((a) => a.section === 'story');
  const mission = aboutData.filter((a) => a.section === 'mission');
  const vision = aboutData.filter((a) => a.section === 'vision');
  const timeline = aboutData.filter((a) => a.section === 'timeline');

  return (
    <section className="py-16 md:py-24">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium mb-3">
            About Us
          </p>
          <h1 className="text-hero mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Story
          </h1>
          <div className="section-divider" />
        </div>

        {/* Story */}
        {story.length > 0 && (
          <div className="max-w-3xl mb-24">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={24} className="text-[var(--color-accent)]" />
              <h2 className="text-h3" style={{ fontFamily: 'var(--font-heading)' }}>
                {story[0].title || 'The Beginning'}
              </h2>
            </div>
            <div className="text-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] leading-relaxed space-y-4">
              {story.map((s) => (
                <p key={s.id}>{s.content}</p>
              ))}
            </div>
          </div>
        )}

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* Mission */}
          <div className="p-8 border border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--color-accent-light)] dark:bg-[var(--color-dark-accent-light)] flex items-center justify-center">
                <Target size={24} className="text-[var(--color-accent)]" />
              </div>
              <h2 className="text-h4 font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                {mission.length > 0 ? mission[0].title || 'Our Mission' : 'Our Mission'}
              </h2>
            </div>
            <div className="text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] leading-relaxed space-y-3">
              {mission.length > 0 ? (
                mission.map((m) => <p key={m.id}>{m.content}</p>)
              ) : (
                <p className="text-sm italic">Mission content will appear here once added via admin panel.</p>
              )}
            </div>
          </div>

          {/* Vision */}
          <div className="p-8 border border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--color-accent-light)] dark:bg-[var(--color-dark-accent-light)] flex items-center justify-center">
                <Eye size={24} className="text-[var(--color-accent)]" />
              </div>
              <h2 className="text-h4 font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                {vision.length > 0 ? vision[0].title || 'Our Vision' : 'Our Vision'}
              </h2>
            </div>
            <div className="text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] leading-relaxed space-y-3">
              {vision.length > 0 ? (
                vision.map((v) => <p key={v.id}>{v.content}</p>)
              ) : (
                <p className="text-sm italic">Vision content will appear here once added via admin panel.</p>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="max-w-3xl">
            <h2 className="text-h2 mb-12" style={{ fontFamily: 'var(--font-heading)' }}>
              Our Journey
            </h2>
            <div className="timeline">
              {timeline.map((item) => (
                <div key={item.id} className="timeline-item">
                  {item.date && (
                    <p className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-medium mb-1">
                      {item.date}
                    </p>
                  )}
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h3>
                  {item.content && (
                    <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] leading-relaxed">
                      {item.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no content */}
        {aboutData.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={56} className="mx-auto mb-4 text-[var(--color-muted-light)]" />
            <p className="text-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-2">
              About content will appear here
            </p>
            <p className="text-sm text-[var(--color-muted-light)]">
              Add story, mission, vision, and timeline items via the admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
