import { Hono } from 'hono'
import articles from './routes/articles'
import { requestLogger } from './middleware/requestLogger'

const app = new Hono<{
  Bindings: CloudflareBindings
}>()

app.use(requestLogger)

app.onError((err, c) => {
  console.error(err)
  return c.json({ 
    error: 'Internal Server Error' 
  }, 500)
})

app.get('/healthz', (c) => {
  return c.json({ status: 'ok' })
})

app.route('/articles', articles)

export default app
