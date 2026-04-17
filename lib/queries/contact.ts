import { createClient } from '@/lib/supabase/server';
import type { ContactMessageInsert } from '@/lib/types/database';

export async function submitContactMessage(message: ContactMessageInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMessages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function markMessageRead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getUnreadCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
}
