'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { Modal } from '@/components/ui/modal';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';
import type { Experience, User } from '@/lib/types/database';

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<(Experience & { users?: { full_name: string } })[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    user_id: '',
    title: '',
    company: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const supabase = createClient();
    const [{ data: exp }, { data: users }] = await Promise.all([
      supabase.from('experiences').select('*, users(full_name)').order('start_date', { ascending: false }),
      supabase.from('users').select('*'),
    ]);
    setExperiences(exp || []);
    setAllUsers(users || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ user_id: '', title: '', company: '', description: '', start_date: '', end_date: '', is_current: false });
    setModalOpen(true);
  }

  function openEdit(exp: Experience) {
    setEditing(exp);
    setForm({
      user_id: exp.user_id,
      title: exp.title,
      company: exp.company,
      description: exp.description || '',
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.user_id || !form.title || !form.company || !form.start_date) {
      showToast('User, title, company, and start date are required', 'error');
      return;
    }
    const supabase = createClient();

    try {
      const payload = {
        user_id: form.user_id,
        title: form.title,
        company: form.company,
        description: form.description || null,
        start_date: form.start_date,
        end_date: form.is_current ? null : (form.end_date || null),
        is_current: form.is_current,
      };

      if (editing) {
        const { error } = await supabase.from('experiences').update(payload as any).eq('id', editing.id);
        if (error) throw error;
        showToast('Experience updated', 'success');
      } else {
        const { error } = await supabase.from('experiences').insert(payload as any);
        if (error) throw error;
        showToast('Experience created', 'success');
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
      const { error } = await supabase.from('experiences').delete().eq('id', id);
      if (error) throw error;
      showToast('Experience deleted', 'success');
      setDeleteConfirm(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  }

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    {
      key: 'user_id', label: 'Member',
      render: (item: any) => item.users?.full_name || '—',
    },
    {
      key: 'start_date', label: 'Period', sortable: true,
      render: (item: Experience) => {
        const start = new Date(item.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        const end = item.is_current ? 'Present' : item.end_date ? new Date(item.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '—';
        return `${start} — ${end}`;
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h2" style={{ fontFamily: 'var(--font-heading)' }}>Experiences</h1>
          <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mt-1">Manage team members&apos; experiences</p>
        </div>
        <Button variant="primary" onClick={openCreate}><Plus size={16} className="mr-2" />Add Experience</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="skeleton" style={{ height: '52px' }} />)}</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <DataTable columns={columns} data={experiences}
            actions={(item) => (
              <>
                <button onClick={() => openEdit(item)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"><Pencil size={16} /></button>
                <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors"><Trash2 size={16} /></button>
              </>
            )}
          />
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Experience' : 'Add Experience'} size="md">
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Member</label>
            <select className="input-field" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} required>
              <option value="">Select member...</option>
              {allUsers.map((u) => <option key={u.id} value={u.id}>{u.full_name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
            {!form.is_current && (
              <Input label="End Date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
            <input type="checkbox" id="is_current" checked={form.is_current} onChange={(e) => setForm({ ...form, is_current: e.target.checked })} className="w-4 h-4" />
            <label htmlFor="is_current" className="text-sm font-medium">Currently working here</label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Create'}</Button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Experience" size="sm">
        <p className="text-sm text-[var(--color-muted)] mb-6">Are you sure? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}