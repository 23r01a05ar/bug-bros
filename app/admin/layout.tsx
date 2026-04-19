import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Trophy,
  Briefcase,
  MessageSquare,
  LogOut,
  Bug,
  ArrowLeft,
} from 'lucide-react';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { href: '/admin/experiences', label: 'Experiences', icon: Briefcase },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient() as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (!userData || userData.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen -mt-16 md:-mt-20 pt-16 md:pt-20">
      {/* Sidebar */}
      <aside className="admin-sidebar shrink-0 hidden md:block">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2.5 mb-1">
            <Bug size={20} className="text-[var(--color-accent)]" />
            <span className="text-sm font-bold text-[var(--color-bg)] dark:text-[var(--color-dark-fg)]">
              Bug Bros Admin
            </span>
          </div>
          <p className="text-xs text-[rgba(249,248,246,0.4)] dark:text-[var(--color-dark-muted-light)]">
            {userData.full_name}
          </p>
        </div>

        <nav className="flex flex-col gap-0.5">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group">
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <Link href="/" className="group">
            <ArrowLeft size={18} />
            Back to Site
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-6 py-3 text-sm text-[rgba(249,248,246,0.4)] hover:text-[var(--color-error)] transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
