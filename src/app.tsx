import { Context, Hono } from 'hono'
import { renderToReadableStream, Suspense } from 'hono/jsx/streaming'

export const app = new Hono()

const AsyncComponent = async () => {
  await new Promise((r) => setTimeout(r, 1000)) // sleep 1s
  return <div>Done!</div>
}

app.get('/', (c: Context) => {
    const stream = renderToReadableStream(
      <div>
        <h1>Hello</h1>
        <Suspense fallback={<div>loading...</div>}>
          <AsyncComponent />
        </Suspense>
      </div>
    )
    return c.body(stream, {
      headers: {
        'Transfer-Encoding': 'chunked',
      }
    })
  }
)