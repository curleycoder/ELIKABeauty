import { supabase } from '../supabaseClient';

export async function listWeeklyAvailability() {
  const { data, error } = await supabase
    .from('availability_rules')
    .select('*')
    .order('day_of_week', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function listSpecialHours() {
  const { data, error } = await supabase
    .from('special_hours')
    .select('*')
    .order('date', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function listBlackouts() {
  const { data, error } = await supabase
    .from('blackout_dates')
    .select('*')
    .order('date', { ascending: true });
  if (error) throw error;
  return data || [];
}
