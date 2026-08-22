# Build an HTTP Server — TypeScript (Bun)

[![progress-banner](assets/progress-banner.svg)](https://app.codecrafters.io/users/usfmah?r=2qF)

TypeScript implementation of a minimal HTTP/1.1 server from scratch — [CodeCrafters "Build Your Own HTTP Server" Challenge](https://app.codecrafters.io/courses/http-server/overview).

> **Current state:** Stage 4 — TCP server, URL routing, response headers/body handling implemented.

## Current Features

- TCP server via `node:net` listening on `localhost:4221`
- Manual HTTP request parsing (splits on `\r\n`, extracts `method`, `request-target`, `HTTP-version` from request-line)
- Routing:
  - `GET /` → `HTTP/1.1 200 OK`
  - any other path → `HTTP/1.1 404 Not Found`
- Single-response-per-connection (writes header + `socket.end()`)
- Debug logging of start-line and URL

## Not Yet Implemented

- Header parsing / validation (`Host`, `Content-Length`, etc.)
- Request body handling, concurrency / keep-alive, persistent connections
- Methods other than `GET`, file serving (`--directory`), compression, etc.

## Tech Stack

- **Runtime:** [Bun 1.3](https://bun.sh) (see `codecrafters.yml` `buildpack: bun-1.3`)
- **Language:** TypeScript (ESNext, `bundler` resolution, `strict` — `tsconfig.json`)
- **Core API:** `node:net`

## Project Structure

```
app/main.ts          # Entry point — TCP server + routing
your_program.sh      # Local runner: bun run app/main.ts
.codecrafters/run.sh # Remote runner (CodeCrafters)
codecrafters.yml     # Buildpack config
```

`app/main.ts` overview:
```ts
net.createServer(socket => {
  socket.on('data', data => {
    const startLine = req.split('\r\n')[0];
    const URL = startLine.split(' ')[1];
    if (URL === '/') socket.write("HTTP/1.1 200 OK\r\n\r\n");
    else socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    socket.end();
  });
}).listen(4221, "localhost");
```

## Getting Started

### Prerequisites

- `bun >= 1.3`
  ```sh
  curl -fsSL https://bun.sh/install | bash
  bun --version
  ```

### Run Locally

```sh
./your_program.sh
# or
bun run app/main.ts
```

Server starts at `http://localhost:4221`.

Quick test:
```sh
curl -v http://localhost:4221/
curl -v http://localhost:4221/unknown  # -> 404
```

Future stages will use:
```sh
./your_program.sh --directory /tmp/files
```

### Submit to CodeCrafters

```sh
codecrafters submit
```

Install CLI if needed: `curl https://codecrafters.io/install.sh | bash`
If remote is missing: `git remote add codecrafters <your-codecrafters-git-url>` (from course dashboard).

## Development Notes

- See inline comments in `app/main.ts` for HTTP/1.1 spec notes (request-line, headers, whitespace handling, `Host` requirement).
- `npm run dev` alias for `bun run app/main.ts` (defined in `package.json`).

## Roadmap

- [x] Bind to port 4221
- [x] Extract URL path / respond 200/404
- [x] Respond with `200` + body / headers (echo)
- [x] Stage 4 — User-Agent / headers handling
- [ ] Concurrent connections, proper header parsing, body streaming
- [ ] Handle `--directory`, gzip, etc. (per CodeCrafters stages)

## License

MIT — CodeCrafters challenge scaffold.
