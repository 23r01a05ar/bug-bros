import { createClient } from '@/lib/supabase/server';
import type { AchievementInsert, AchievementUpdate, AchievementWithParticipants } from '@/lib/types/database';

export async function getLatestAchievements(limit: number = 3) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('achievements')
    .select(`
      *,
      participants(users(*))
    `)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as unknown as AchievementWithParticipants[];
}

export async function getAllAchievements(typeFilter?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('achievements')
    .select(`
      *,
      participants(users(*))
    `)
    .order('date', { ascending: false });

  if (typeFilter && typeFilter !== 'all') {
    query = query.eq('type', typeFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as AchievementWithParticipants[];
}

export async function getAchievementsAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createAchievement(achievement: AchievementInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('achievements')
    .insert(achievement)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAchievement(id: string, updates: AchievementUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('achievements')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAchievement(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function setAchievementParticipants(achievementId: string, userIds: string[]) {
  const supabase = await createClient();

  await supabase.from('participants').delete().eq('achievement_id', achievementId);

  if (userIds.length > 0) {
    const rows = userIds.map((userId) => ({ achievement_id: achievementId, user_id: userId }));
    const { error } = await supabase.from('participants').insert(rows);
    if (error) throw error;
  }
}
