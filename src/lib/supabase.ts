import { createClient } from '@supabase/supabase-js'

// client untuk connect ke supabase, misal ketika butuh query maka buat client dulu lalu baru query 
export function createSupabaseClient(env: CloudflareBindings) {
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
    {
      auth: {
        // cloudflare worker kan serverless maka gk perlu simpan session, soalnya nanti ilang
        persistSession: false,
        autoRefreshToken: false, // gk perlu dulu pake refresh token, access token = 8 jam, kalau habis maka login lagi
      },
    }
  )
}