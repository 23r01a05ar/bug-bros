import React from 'react';
import Link from 'next/link';
import { Bug, Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] mt-24">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Bug size={24} className="text-[var(--color-accent)]" />
              <span
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Bug Bros
              </span>
            </div>
            <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] max-w-sm leading-relaxed">
              Breaking Bugs, Building the Future. A team of passionate developers
              crafting innovative solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-4 text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]"
            >
              Navigation
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: '/team', label: 'Team' },
                { href: '/projects', label: 'Projects' },
                { href: '/achievements', label: 'Achievements' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-4 text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]"
            >
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2.5 rounded-full border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-muted-light)] dark:text-[var(--color-dark-muted-light)]">
            &copy; {new Date().getFullYear()} Bug Bros. All rights reserved.
          </p>
          <Link
            href="/login"
            className="text-xs text-[var(--color-muted-light)] dark:text-[var(--color-dark-muted-light)] hover:text-[var(--color-accent)] transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
