import { createClient } from '@supabase/supabase-js'


export async function getGallery() {
  const { data, error } = await supabase
    .from("gallery")
    .select("image_url, caption, category, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data; 
}