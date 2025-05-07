# Hono Docker Development Environment


## 開発環境

```bash
docker run -it -v $(pwd):/app -w /app denoland/deno:2.3.1 sh
```

```bash
docker compose build
docker compose run --rm -P app bash
# deno run --allow-net --watch main.ts
```

```bash
docker compose exec app bash
# deno test
```