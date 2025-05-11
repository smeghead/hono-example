import { assertStrictEquals, assertStringIncludes } from "https://deno.land/std@0.199.0/assert/mod.ts";
import { app } from "../src/app.tsx";

// filepath: /app/tests/app.test.ts

Deno.test("GET /", async (t) => {
  const res = await app.request("/");

  await t.step("ステータスコードは200", () => {
    assertStrictEquals(res.status, 200);
  });

  await t.step("レスポンスボディにTodo Appの見出しが含まれる", async () => {
    const body = await res.text();
    assertStringIncludes(body, '<h1>Todo App</h1>');
  });

  await t.step("Content-Typeヘッダが正しい", () => {
    assertStrictEquals(
      res.headers.get("content-type"),
      "text/html;charset=UTF-8",
    );
  });
});