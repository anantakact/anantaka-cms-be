import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { createSupabaseClient } from '../lib/supabase'

const articles = new Hono<{ Bindings: CloudflareBindings }>()

const listQuerySchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
})

const getParamSchema = z.object({
  id: z.uuid(),
})

// GET /articles?status=draft -> list articles
articles.get('/',zValidator('query', listQuerySchema),
  async (c) => {
    const { status } = c.req.valid('query')
    const supabase = createSupabaseClient(c.env)

    let query = supabase.from('articles').select('*').order('created_at', { ascending: false })
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) return c.json({ error: error.message }, 500)

    return c.json({ data })
  }
)

// GET /articles/:id -> single article
articles.get('/:id',zValidator('param', getParamSchema),
  async (c) => {
    const { id } = c.req.valid('param')
    const supabase = createSupabaseClient(c.env)

    const { data, error } = await supabase.from('articles').select('*').eq('id', id).single()
    if (error) return c.json({ error: error.message }, 404)

    return c.json({ data })
  }
)

export default articles
