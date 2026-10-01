import type { MiddlewareHandler } from 'hono'

export const requestLogger: MiddlewareHandler = async (c, next) => {
  const { method, path } = c.req
  const query = { ...c.req.query() }
  const body = c.req.header('content-type')?.includes('application/json')
    ? await c.req.raw.clone().json().catch(() => undefined)
    : undefined

  await next()

  const responseBody = await c.res.clone().text()
  console.log(JSON.stringify({
    method,
    path,
    status: c.res.status,
    ...(Object.keys(query).length > 0 && { query }),
    ...(body !== undefined && { requestBody: body }),
    responseBody,
  }))
}
