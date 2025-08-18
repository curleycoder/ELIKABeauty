import { supabase } from '../supabaseClient'

export async function getSlots(isoDate, durationMinutes = 60) {
  const { data, error } = await supabase.rpc('generate_time_slots', {
    p_date: isoDate,                 // '2025-08-27'
    p_duration_minutes: durationMinutes
  })
  if (error) throw error
  return data
}
