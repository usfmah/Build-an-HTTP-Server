# Build an HTTP Server

[![progress-banner](assets/progress-banner.svg)](https://app.codecrafters.io/users/usfmah?r=2qF)

A minimal HTTP/1.1 server built from scratch in TypeScript (Bun) for the [CodeCrafters "Build Your Own HTTP Server" challenge](https://app.codecrafters.io/courses/http-server/overview). No HTTP framework — just raw TCP via `node:net`, with parsing, routing, and response framing all handwritten.

## Features

- Routing: `GET /` → `200`, `GET /echo/<str>` echoes the path segment, `GET /user-agent` reflects the header, `GET /files/<name>` serves bytes from `--directory`, `POST /files/<name>` writes the raw body → `201`, anything else → `404`
- Gzip negotiation: `Accept-Encoding: <list containing gzip>` → `gzipSync`-compressed body with `Content-Encoding: gzip` and matching `Content-Length`
- Persistent connections: keep-alive by default with pipelining support; `Connection: close` is echoed and honored
- Binary-safe bodies (`Buffer` end to end), path-traversal-safe file serving, per-socket buffers for concurrent clients

## Architecture

- `app/main.ts` — TCP server on `localhost:4221`. Each socket gets its own byte buffer; a `while` loop drains every complete request in it, so sequential and pipelined requests are all answered. Sockets stay open unless `Connection: close` or an error occurs.
- `app/parser.ts` — splits the request line and headers into a case-insensitive map; bodies are sliced by `Content-Length` bytes.
- `app/router.ts` — route matching, file I/O, and gzip negotiation.
- `app/response.ts` — status line + headers built as text, concatenated with the body as a raw `Buffer`.

## Install

Requires [Bun](https://bun.sh) 1.3+ (see `codecrafters.yml`).

```sh
git clone git@github.com:usfmah/Build-an-HTTP-Server.git
cd Build-an-HTTP-Server
./your_program.sh [--directory /tmp/data]
```

## Test

```sh
curl -v http://localhost:4221/echo/hello
curl -H "Accept-Encoding: gzip" --compressed http://localhost:4221/echo/hello
curl --http1.1 http://localhost:4221/echo/a --next http://localhost:4221/ -H "Connection: close"
```

Submit to CodeCrafters with `codecrafters submit`.

## Progress

14/14 stages complete.

- [x] Bind to a port
- [x] Respond with 200
- [x] Extract URL path
- [x] Respond with body
- [x] Read header (`/user-agent`)
- [x] Concurrent connections (per-socket buffer + event loop)
- [x] Return a file (`GET /files/<filename>`)
- [x] Read request body (`POST /files/<filename>` → `201`)
- [x] HTTP Compression
  - [x] Compression headers
  - [x] Multiple compression schemes
  - [x] Gzip compression
- [x] Persistent Connections
  - [x] Persistent connections
  - [x] Concurrent persistent connections
  - [x] Connection closure
