import { createClient } from '@/lib/supabase/server';
import type { AboutContentInsert, AboutContentUpdate } from '@/lib/types/database';

export async function getAboutContent() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getAboutBySection(section: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .eq('section', section)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createAboutContent(content: AboutContentInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('about_content')
    .insert(content)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAboutContent(id: string, updates: AboutContentUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('about_content')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAboutContent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('about_content')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
