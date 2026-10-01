import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://cms.yayasananantaka.org',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)
    const url = new URL(request.url)

    if (url.pathname === '/articles' && request.method === 'GET') {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: corsHeaders
      })

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })
  }
}