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