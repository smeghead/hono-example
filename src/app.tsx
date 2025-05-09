import { Context, Hono } from 'hono'

export const app = new Hono()

app.get('/', (c: Context) => {
    return c.html(
      <div>
        <h1>Hello</h1>
        {c.req.url}
      </div>
    )
  }
)