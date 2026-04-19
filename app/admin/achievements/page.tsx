'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { Modal } from '@/components/ui/modal';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/admin/multi-select';
import { ImageUpload } from '@/components/admin/image-upload';
import { Badge, getAchievementBadgeVariant } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';
import type { Achievement, User } from '@/lib/types/database';

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'hackathon' as 'hackathon' | 'ctf' | 'other',
    badge_url: '',
    date: '',
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const supabase = createClient() as any;
    const [{ data: ach }, { data: users }] = await Promise.all([
      supabase.from('achievements').select('*').order('date', { ascending: false }),
      supabase.from('users').select('*').eq('is_active', true),
    ]);
    setAchievements(ach || []);
    setAllUsers(users || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ title: '', description: '', type: 'hackathon', badge_url: '', date: '' });
    setParticipants([]);
    setModalOpen(true);
  }

  async function openEdit(ach: Achievement) {
    setEditing(ach);
    setForm({
      title: ach.title,
      description: ach.description || '',
      type: ach.type,
      badge_url: ach.badge_url || '',
      date: ach.date || '',
    });
    const supabase = createClient() as any;
    const { data } = await supabase
      .from('participants')
      .select('user_id')
      .eq('achievement_id', ach.id);
    setParticipants(data?.map((p: { user_id: string }) => p.user_id) || []);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.title) { showToast('Title is required', 'error'); return; }
    const supabase = createClient() as any;

    try {
      if (editing) {
        const { error } = await supabase.from('achievements').update({
          title: form.title,
          description: form.description || null,
          type: form.type,
          badge_url: form.badge_url || null,
          date: form.date || null,
        } as any).eq('id', editing.id);
        if (error) throw error;

        await supabase.from('participants').delete().eq('achievement_id', editing.id);
        if (participants.length > 0) {
          await supabase.from('participants').insert(
            participants.map((uid) => ({ achievement_id: editing.id, user_id: uid })) as any
          );
        }
        showToast('Achievement updated', 'success');
      } else {
        const { data: newAch, error } = await supabase
          .from('achievements')
          .insert({
            title: form.title,
            description: form.description || null,
            type: form.type,
            badge_url: form.badge_url || null,
            date: form.date || null,
          } as any)
          .select()
          .single();
        if (error) throw error;

        if (participants.length > 0 && newAch) {
          await supabase.from('participants').insert(
            participants.map((uid) => ({ achievement_id: newAch.id, user_id: uid })) as any
          );
        }
        showToast('Achievement created', 'success');
      }

      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error');
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    try {
      await supabase.from('participants').delete().eq('achievement_id', id);
      const { error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
      showToast('Achievement deleted', 'success');
      setDeleteConfirm(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  }

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    {
      key: 'type', label: 'Type', sortable: true,
      render: (item: Achievement) => <Badge variant={getAchievementBadgeVariant(item.type)}>{item.type}</Badge>,
    },
    {
      key: 'date', label: 'Date', sortable: true,
      render: (item: Achievement) => item.date ? new Date(item.date).toLocaleDateString() : '—',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h2" style={{ fontFamily: 'var(--font-heading)' }}>Achievements</h1>
          <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mt-1">Manage team achievements</p>
        </div>
        <Button variant="primary" onClick={openCreate}><Plus size={16} className="mr-2" />Add Achievement</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="skeleton" style={{ height: '52px' }} />)}</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <DataTable
            columns={columns} data={achievements}
            actions={(item) => (
              <>
                <button onClick={() => openEdit(item)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"><Pencil size={16} /></button>
                <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors"><Trash2 size={16} /></button>
              </>
            )}
          />
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Achievement' : 'Add Achievement'} size="md">
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Type</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                <option value="hackathon">Hackathon</option>
                <option value="ctf">CTF</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <ImageUpload bucket="project-assets" currentUrl={form.badge_url} onUpload={(url) => setForm({ ...form, badge_url: url })} label="Badge Image" />
          <MultiSelect
            label="Participants"
            options={allUsers.map((u) => ({ value: u.id, label: u.full_name, avatar: u.avatar_url }))}
            selected={participants}
            onChange={setParticipants}
            placeholder="Select participants..."
          />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Create'}</Button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Achievement" size="sm">
        <p className="text-sm text-[var(--color-muted)] mb-6">Are you sure? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}