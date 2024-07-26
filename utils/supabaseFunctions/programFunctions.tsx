import { createClient } from '@/utils/supabase/client';
import { Program } from '@/types';

export const fetchUserPrograms = async (userId: string): Promise<Program[]> => {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user programs:', error);
    throw error;
  }
};

export async function insertProgram(name: string, description: string, userId: string): Promise<Program | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('programs')
    .insert([
      { name, description, user_id: userId }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting program:', error);
    return null;
  }

  return data;
}


export async function deleteProgram(programId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', programId);

  if (error) {
    console.error('Error deleting program:', error);
    return false;
  }

  return true;
}