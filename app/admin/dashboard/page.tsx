import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Users, FolderKanban, Trophy, MessageSquare } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient() as any;

  const [
    { count: membersCount },
    { count: projectsCount },
    { count: achievementsCount },
    { count: messagesCount },
    { count: unreadCount },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('achievements').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: 'Total Members', value: membersCount || 0, icon: Users, color: '#D4AF37' },
    { label: 'Projects', value: projectsCount || 0, icon: FolderKanban, color: '#2D6A4F' },
    { label: 'Achievements', value: achievementsCount || 0, icon: Trophy, color: '#E09F3E' },
    { label: 'Messages', value: messagesCount || 0, icon: MessageSquare, color: '#1565C0', extra: unreadCount ? `${unreadCount} unread` : undefined },
  ];

  return (
    <div>
      <h1
        className="text-h2 mb-8"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                {stat.label}
              </span>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.color + '15', color: stat.color }}
              >
                <stat.icon size={20} />
              </div>
            </div>
            <p
              className="text-3xl font-bold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {stat.value}
            </p>
            {stat.extra && (
              <p className="text-xs text-[var(--color-accent)] mt-1">{stat.extra}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Messages */}
      <div>
        <h2
          className="text-h4 mb-6"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Recent Messages
        </h2>
        {recentMessages && recentMessages.length > 0 ? (
          <div className="space-y-3">
            {recentMessages.map((msg: any) => (
              <div key={msg.id} className="card p-4 flex items-start gap-4">
                <div
                  className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    msg.is_read ? 'bg-[var(--color-muted-light)]' : 'bg-[var(--color-accent)]'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{msg.name}</span>
                    <span className="text-xs text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                      {msg.email}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] truncate">
                    {msg.message}
                  </p>
                </div>
                <span className="text-xs text-[var(--color-muted-light)] shrink-0">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-[var(--color-muted-light)]" />
            <p className="text-sm text-[var(--color-muted)]">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}