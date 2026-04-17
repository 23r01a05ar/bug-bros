'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Mail } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';
import type { ContactMessage } from '@/lib/types/database';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => { fetchMessages(); }, []);

  async function fetchMessages() {
    const supabase = createClient();
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    const supabase = createClient();
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    fetchMessages();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      showToast('Message deleted', 'success');
      setDeleteConfirm(null);
      setViewing(null);
      fetchMessages();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  }

  function openMessage(msg: ContactMessage) {
    setViewing(msg);
    if (!msg.is_read) {
      markAsRead(msg.id);
    }
  }

  const columns = [
    {
      key: 'is_read',
      label: '',
      render: (item: ContactMessage) => (
        <div className={`w-2.5 h-2.5 rounded-full ${item.is_read ? 'bg-[var(--color-muted-light)]' : 'bg-[var(--color-accent)]'}`} />
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'message',
      label: 'Message',
      render: (item: ContactMessage) => (
        <span className="truncate block max-w-[300px]">{item.message}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (item: ContactMessage) => new Date(item.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-h2" style={{ fontFamily: 'var(--font-heading)' }}>Messages</h1>
        <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mt-1">
          Contact form submissions ({messages.filter((m) => !m.is_read).length} unread)
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="skeleton" style={{ height: '52px' }} />)}</div>
      ) : messages.length === 0 ? (
        <div className="card p-12 text-center">
          <Mail size={40} className="mx-auto mb-3 text-[var(--color-muted-light)]" />
          <p className="text-[var(--color-muted)]">No messages yet</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <DataTable
            columns={columns}
            data={messages}
            onRowClick={openMessage}
            actions={(item) => (
              <>
                <button onClick={() => openMessage(item)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                  <Eye size={16} />
                </button>
                <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors">
                  <Trash2 size={16} />
                </button>
              </>
            )}
          />
        </div>
      )}

      {/* View Message Modal */}
      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Message Details" size="md">
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">Name</p>
                <p className="font-medium">{viewing.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">Email</p>
                <a href={`mailto:${viewing.email}`} className="font-medium text-[var(--color-accent)] hover:underline">
                  {viewing.email}
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">Date</p>
              <p className="text-sm">{new Date(viewing.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">Message</p>
              <div className="p-4 bg-[var(--color-surface-raised)] dark:bg-[var(--color-dark-surface-raised)] rounded-lg">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{viewing.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <Button variant="danger" onClick={() => setDeleteConfirm(viewing.id)}>
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Message" size="sm">
        <p className="text-sm text-[var(--color-muted)] mb-6">Are you sure? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
