import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getSupabaseImageUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('events').getPublicUrl(path)
  return data.publicUrl
}
