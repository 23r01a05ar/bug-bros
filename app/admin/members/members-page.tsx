'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { Modal } from '@/components/ui/modal';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUpload, FileUpload } from '@/components/admin/image-upload';
import { TagsInput } from '@/components/admin/tags-input';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@/lib/types/database';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    role: 'member' as 'admin' | 'member',
    short_bio: '',
    bio: '',
    avatar_url: '',
    skills: [] as string[],
    resume_url: '',
    github_url: '',
    linkedin_url: '',
    website_url: '',
    is_active: true,
  });

  useEffect(() => { fetchMembers(); }, []);

  async function fetchMembers() {
    const supabase = createClient();
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    setMembers(data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({
      full_name: '', email: '', role: 'member', short_bio: '', bio: '',
      avatar_url: '', skills: [], resume_url: '', github_url: '',
      linkedin_url: '', website_url: '', is_active: true,
    });
    setModalOpen(true);
  }

  function openEdit(member: User) {
    setEditing(member);
    setForm({
      full_name: member.full_name,
      email: member.email,
      role: member.role,
      short_bio: member.short_bio || '',
      bio: member.bio || '',
      avatar_url: member.avatar_url || '',
      skills: member.skills || [],
      resume_url: member.resume_url || '',
      github_url: member.github_url || '',
      linkedin_url: member.linkedin_url || '',
      website_url: member.website_url || '',
      is_active: member.is_active,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.full_name || !form.email) {
      showToast('Name and email are required', 'error');
      return;
    }
    const supabase = createClient()as any;

    try {
      if (editing) {
        const { error } = await supabase
          .from('users')
          .update({
            full_name: form.full_name,
            email: form.email,
            role: form.role,
            short_bio: form.short_bio || null,
            bio: form.bio || null,
            avatar_url: form.avatar_url || null,
            skills: form.skills,
            resume_url: form.resume_url || null,
            github_url: form.github_url || null,
            linkedin_url: form.linkedin_url || null,
            website_url: form.website_url || null,
            is_active: form.is_active,
          } as any)
          .eq('id', editing.id);
        if (error) throw error;
        showToast('Member updated', 'success');
      } else {
        showToast('To add new members, they must first sign up. Then edit their profile here.', 'error');
        return;
      }

      setModalOpen(false);
      fetchMembers();
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error');
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      showToast('Member deleted', 'success');
      setDeleteConfirm(null);
      fetchMembers();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  }

  const columns = [
    {
      key: 'avatar_url', label: '',
      render: (item: User) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-surface-raised)] dark:bg-[var(--color-dark-surface-raised)]">
          {item.avatar_url ? (
            <img src={item.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[var(--color-muted)]">
              {item.full_name?.charAt(0)}
            </div>
          )}
        </div>
      ),
    },
    { key: 'full_name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'is_active', label: 'Status',
      render: (item: User) => (
        <span className={`badge ${item.is_active ? 'badge-hackathon' : 'badge-other'}`}>
          {item.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h2" style={{ fontFamily: 'var(--font-heading)' }}>Members</h1>
          <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mt-1">Manage team members and their profiles</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus size={16} className="mr-2" />Add Member
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="skeleton" style={{ height: '52px' }} />)}</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <DataTable
            columns={columns} data={members}
            actions={(item) => (
              <>
                <button onClick={() => openEdit(item)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors" title="Edit"><Pencil size={16} /></button>
                <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors" title="Delete"><Trash2 size={16} /></button>
              </>
            )}
          />
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Member' : 'Add Member'} size="lg">
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Role</label>
              <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'admin' | 'member' })}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Status</label>
              <select className="input-field" value={form.is_active ? 'true' : 'false'} onChange={(e) => setForm({ ...form, is_active: e.target.value === 'true' })}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <Input label="Short Bio" value={form.short_bio} onChange={(e) => setForm({ ...form, short_bio: e.target.value })} placeholder="A brief one-liner..." />
          <Textarea label="Full Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Detailed biography..." />
          <TagsInput label="Skills" value={form.skills} onChange={(skills) => setForm({ ...form, skills })} placeholder="Add a skill..." />
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload bucket="profile-images" currentUrl={form.avatar_url} onUpload={(url) => setForm({ ...form, avatar_url: url })} label="Profile Image" />
            <FileUpload bucket="resumes" currentUrl={form.resume_url} onUpload={(url) => setForm({ ...form, resume_url: url })} label="Resume" accept=".pdf,.doc,.docx" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
            <Input label="LinkedIn URL" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." />
            <Input label="Website URL" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Create Member'}</Button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Member" size="sm">
        <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-6">Are you sure you want to delete this member? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}