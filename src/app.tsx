import { Context, Hono } from 'hono'

// Todo storage definitions
interface Todo { id: number; title: string; completed: boolean }
const todos: Todo[] = []
let nextId = 1

export const app = new Hono()

// Root handler for Todo HTML page
app.get('/', (c: Context) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Todo App</title></head>
<body>
<h1>Todo App</h1>
<input id="newTodo" placeholder="New todo"><button onclick="addTodo()">Add</button>
<div id="todos"></div>
<script>
  async function getTodos() {
    const res = await fetch('/todos');
    const todos = await res.json();
    const container = document.getElementById('todos');
    container.innerHTML = '';
    todos.forEach(todo => {
      const div = document.createElement('div');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.onchange = () => toggle(todo.id, checkbox.checked);
      const span = document.createElement('span');
      span.textContent = todo.title;
      span.onclick = () => editTitle(todo.id, span);
      div.appendChild(checkbox);
      div.appendChild(span);
      container.appendChild(div);
    });
  }
  async function addTodo() {
    const input = document.getElementById('newTodo');
    const title = input.value;
    if (!title) return;
    await fetch('/todos', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title }) });
    input.value = '';
    getTodos();
  }
  async function toggle(id, completed) {
    await fetch('/todos/' + id, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ completed }) });
    getTodos();
  }
  function editTitle(id, span) {
    const newTitle = prompt('New title', span.innerText);
    if (newTitle != null) {
      fetch('/todos/' + id, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title: newTitle }) }).then(getTodos);
    }
  }
  window.onload = getTodos;
</script>
</body>
</html>`
  return c.body(html, { headers: { 'content-type': 'text/html;charset=UTF-8' } })
})

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