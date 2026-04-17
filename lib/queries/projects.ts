import { createClient } from '@/lib/supabase/server';
import type { ProjectInsert, ProjectUpdate, ProjectWithContributors } from '@/lib/types/database';

export async function getFeaturedProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      contributors(users(*))
    `)
    .or('is_featured.eq.true')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) throw error;
  return data as unknown as ProjectWithContributors[];
}

export async function getAllProjects(search?: string, techFilter?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('projects')
    .select(`
      *,
      contributors(users(*))
    `)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (techFilter) {
    query = query.contains('tech_stack', [techFilter]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as ProjectWithContributors[];
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithContributors | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      contributors(users(*))
    `)
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as unknown as ProjectWithContributors;
}

export async function getProjectsAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProject(project: ProjectInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: string, updates: ProjectUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function setProjectContributors(projectId: string, userIds: string[]) {
  const supabase = await createClient();

  // Remove existing contributors
  await supabase.from('contributors').delete().eq('project_id', projectId);

  // Insert new contributors
  if (userIds.length > 0) {
    const rows = userIds.map((userId) => ({ project_id: projectId, user_id: userId }));
    const { error } = await supabase.from('contributors').insert(rows);
    if (error) throw error;
  }
}

export async function getUniqueTechStacks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('tech_stack');

  if (error) throw error;

  const allTech = new Set<string>();
  data?.forEach((p) => p.tech_stack?.forEach((t) => allTech.add(t)));
  return Array.from(allTech).sort();
}
