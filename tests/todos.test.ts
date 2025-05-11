import { assertEquals, assertStrictEquals } from "https://deno.land/std@0.199.0/assert/mod.ts";
import { app } from "../src/app.tsx";

Deno.test("Todos API", async (t: Deno.TestContext) => {
  await t.step("GET /todos returns empty array", async () => {
    const res = await app.request("/todos");
    assertStrictEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data, []);
  });

  let created: any;
  await t.step("POST /todos creates a new todo", async () => {
    const res = await app.request("/todos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Test todo" }),
    });
    assertStrictEquals(res.status, 201);
    created = await res.json();
    assertEquals(created, { id: 1, title: "Test todo", completed: false });
  });

  await t.step("GET /todos shows created todo", async () => {
    const res = await app.request("/todos");
    assertStrictEquals(res.status, 200);
    const list = await res.json();
    assertEquals(list.length, 1);
    assertEquals(list[0], created);
  });

  await t.step("PUT /todos/:id updates title and completed", async () => {
    const res = await app.request(`/todos/${created.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Updated", completed: true }),
    });
    assertStrictEquals(res.status, 200);
    const updated = await res.json();
    assertEquals(updated, { id: 1, title: "Updated", completed: true });
  });

  await t.step("PUT /todos/:id returns 404 for missing id", async () => {
    const res = await app.request("/todos/999", { method: "PUT" });
    assertStrictEquals(res.status, 404);
  });
});