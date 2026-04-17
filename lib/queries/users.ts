import { createClient } from '@/lib/supabase/server';
import type { UserInsert, UserUpdate, UserWithRelations } from '@/lib/types/database';

export async function getActiveMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('is_active', true)
    .order('full_name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getMemberById(id: string): Promise<UserWithRelations | null> {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !user) return null;

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', id)
    .order('start_date', { ascending: false });

  const { data: contributedProjects } = await supabase
    .from('contributors')
    .select('projects(*)')
    .eq('user_id', id);

  const { data: userAchievements } = await supabase
    .from('participants')
    .select('achievements(*)')
    .eq('user_id', id);

  return {
    ...user,
    experiences: experiences || [],
    contributors: (contributedProjects as unknown as { projects: any }[]) || [],
    participants: (userAchievements as unknown as { achievements: any }[]) || [],
  };
}

export async function getAllMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createMember(member: UserInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .insert(member)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMember(id: string, updates: UserUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMember(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
