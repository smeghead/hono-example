import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'

// Todo storage definitions
interface Todo { id: number; title: string; completed: boolean }
const todos: Todo[] = []
let nextId = 1

export const app = new Hono()

app.use('/', serveStatic({ root: './static/' }))

// Todos routes
app.get('/todos', (c) => {
  return c.json(todos)
})

app.post('/todos', async (c) => {
  const { title } = await c.req.json() as { title: string }
  const todo: Todo = { id: nextId++, title, completed: false }
  todos.push(todo)
  return c.json(todo, 201)
})

app.put('/todos/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const index = todos.findIndex((t) => t.id === id)
  if (index === -1) {
    return c.text('Not found', 404)
  }
  const { title, completed } = await c.req.json() as { title?: string; completed?: boolean }
  const existing = todos[index]
  const updated: Todo = {
    id,
    title: title ?? existing.title,
    completed: completed ?? existing.completed,
  }
  todos[index] = updated
  return c.json(updated)
})