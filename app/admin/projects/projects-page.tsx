'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { Modal } from '@/components/ui/modal';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TagsInput } from '@/components/admin/tags-input';
import { MultiSelect } from '@/components/admin/multi-select';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';
import type { Project, User } from '@/lib/types/database';
import { Badge } from '@/components/ui/badge';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [contributors, setContributors] = useState<string[]>([]);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    full_description: '',
    tech_stack: [] as string[],
    live_url: '',
    github_url: '',
    screenshots: [] as string[],
    is_featured: false,
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const supabase = createClient();
    const [{ data: proj }, { data: users }] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('users').select('*').eq('is_active', true),
    ]);
    setProjects(proj || []);
    setAllUsers(users || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({
      name: '', slug: '', description: '', full_description: '',
      tech_stack: [], live_url: '', github_url: '', screenshots: [], is_featured: false,
    });
    setContributors([]);
    setModalOpen(true);
  }

  async function openEdit(project: Project) {
    setEditing(project);
    setForm({
      name: project.name,
      slug: project.slug,
      description: project.description || '',
      full_description: project.full_description || '',
      tech_stack: project.tech_stack || [],
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      screenshots: project.screenshots || [],
      is_featured: project.is_featured,
    });
    const supabase = createClient()as any;
    const { data } = await supabase
      .from('contributors')
      .select('user_id')
      .eq('project_id', project.id);
    setContributors(data?.map((c) => c.user_id) || []);
    setModalOpen(true);
  }

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleSave() {
    if (!form.name || !form.slug) {
      showToast('Name and slug are required', 'error');
      return;
    }
    const supabase = createClient() as any;

    try {
      if (editing) {
        const { error } = await supabase
          .from('projects')
          .update({
            name: form.name,
            slug: form.slug,
            description: form.description || null,
            full_description: form.full_description || null,
            tech_stack: form.tech_stack,
            live_url: form.live_url || null,
            github_url: form.github_url || null,
            screenshots: form.screenshots,
            is_featured: form.is_featured,
          } as any)
          .eq('id', editing.id);
        if (error) throw error;

        await supabase.from('contributors').delete().eq('project_id', editing.id);
        if (contributors.length > 0) {
          await supabase.from('contributors').insert(
            contributors.map((uid) => ({ project_id: editing.id, user_id: uid })) as any
          );
        }
        showToast('Project updated', 'success');
      } else {
        const { data: newProject, error } = await supabase
          .from('projects')
          .insert({
            name: form.name,
            slug: form.slug,
            description: form.description || null,
            full_description: form.full_description || null,
            tech_stack: form.tech_stack,
            live_url: form.live_url || null,
            github_url: form.github_url || null,
            screenshots: form.screenshots,
            is_featured: form.is_featured,
          } as any)
          .select()
          .single();
        if (error) throw error;

        if (contributors.length > 0 && newProject) {
          await supabase.from('contributors').insert(
            contributors.map((uid) => ({ project_id: newProject.id, user_id: uid })) as any
          );
        }
        showToast('Project created', 'success');
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
      await supabase.from('contributors').delete().eq('project_id', id);
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      showToast('Project deleted', 'success');
      setDeleteConfirm(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug' },
    {
      key: 'tech_stack',
      label: 'Tech Stack',
      render: (item: Project) => (
        <div className="flex flex-wrap gap-1">
          {item.tech_stack?.slice(0, 3).map((t) => (
            <Badge key={t} variant="accent">{t}</Badge>
          ))}
          {(item.tech_stack?.length || 0) > 3 && (
            <Badge variant="default">+{item.tech_stack.length - 3}</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'is_featured',
      label: 'Featured',
      render: (item: Project) => (
        <span className={item.is_featured ? 'text-[var(--color-accent)] font-medium' : 'text-[var(--color-muted)]'}>
          {item.is_featured ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h2" style={{ fontFamily: 'var(--font-heading)' }}>Projects</h1>
          <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mt-1">Manage team projects</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus size={16} className="mr-2" />Add Project
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => <div key={n} className="skeleton" style={{ height: '52px' }} />)}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <DataTable
            columns={columns} data={projects}
            actions={(item) => (
              <>
                <button onClick={() => openEdit(item)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"><Pencil size={16} /></button>
                <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors"><Trash2 size={16} /></button>
              </>
            )}
          />
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Add Project'} size="lg">
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Project Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : generateSlug(e.target.value) })}
              required
            />
            <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <Input label="Short Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Textarea label="Full Description" value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} />
          <TagsInput label="Tech Stack" value={form.tech_stack} onChange={(tech_stack) => setForm({ ...form, tech_stack })} placeholder="Add technology..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Live URL" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." />
            <Input label="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
          </div>
          <TagsInput label="Screenshot URLs" value={form.screenshots} onChange={(screenshots) => setForm({ ...form, screenshots })} placeholder="Paste screenshot URL and press Enter..." />
          <MultiSelect
            label="Contributors"
            options={allUsers.map((u) => ({ value: u.id, label: u.full_name, avatar: u.avatar_url }))}
            selected={contributors} onChange={setContributors} placeholder="Select contributors..."
          />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4" />
            <label htmlFor="is_featured" className="text-sm font-medium">Featured Project</label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Create Project'}</Button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Project" size="sm">
        <p className="text-sm text-[var(--color-muted)] mb-6">Are you sure? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}