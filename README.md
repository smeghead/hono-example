# Hono Docker Development Environment


## 開発環境

```bash
docker run -it -v $(pwd):/app -w /app denoland/deno:2.3.1 sh
```

```bash
docker build -t app . && docker run -it -p 8000:8000 app
```