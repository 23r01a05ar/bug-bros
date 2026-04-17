import { createClient } from '@/lib/supabase/server';
import type { ExperienceInsert, ExperienceUpdate } from '@/lib/types/database';

export async function getExperiencesByUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllExperiences() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('experiences')
    .select(`
      *,
      users(id, full_name, avatar_url)
    `)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createExperience(experience: ExperienceInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateExperience(id: string, updates: ExperienceUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('experiences')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
