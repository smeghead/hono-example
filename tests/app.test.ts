import { assertStrictEquals } from "https://deno.land/std@0.199.0/assert/mod.ts";
import { app } from "../src/app.tsx";

// filepath: /app/tests/app.test.ts

Deno.test("GET /", async (t) => {
  const res = await app.request("/");

  await t.step("ステータスコードは200", () => {
    assertStrictEquals(res.status, 200);
  });

  await t.step("レスポンスボディはHello Hono!", async () => {
    assertStrictEquals(await res.text(), "Hello Hono!");
  });

  await t.step("Content-Typeヘッダが正しい", () => {
    assertStrictEquals(
      res.headers.get("content-type"),
      "text/plain;charset=UTF-8",
    );
  });
});