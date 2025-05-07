import { Context, Hono } from 'hono'

export const app = new Hono()

app.get('/', (c: Context) => {
  return c.text('Hello Hono!')
})