# Build an HTTP Server

[![progress-banner](assets/progress-banner.svg)](https://app.codecrafters.io/users/usfmah?r=2qF)

A minimal HTTP/1.1 server built from scratch in TypeScript (Bun) for the [CodeCrafters "Build Your Own HTTP Server" challenge](https://app.codecrafters.io/courses/http-server/overview).

## Features

- TCP server on `localhost:4221` using `node:net`
- Manual HTTP request parsing (request-line)
- Routing:
  - `GET /` → `200 OK`
  - `GET /echo/<str>` → `200 OK` with the string echoed back as body
  - `GET /user-agent` → `200 OK` with `User-Agent` header value
  - `GET /files/<filename>` → `200 OK` with file bytes as `application/octet-stream`, else `404`
  - `POST /files/<filename>` → `201 Created`, writes raw request body to file
  - anything else → `404 Not Found`
- Concurrent connections via Node event loop (per-socket buffer)
- Binary-safe request/response handling (byte-based `Content-Length`, `Buffer` bodies)
- Compression: `Accept-Encoding: <list containing gzip>` → `Content-Encoding: gzip` with `gzipSync`-compressed body (`Content-Length` = compressed size), otherwise uncompressed with no encoding

## Run

```sh
./your_program.sh
```

Then test with:

```sh
curl -v http://localhost:4221/
curl -v http://localhost:4221/echo/hello
```

## Submit

```sh
codecrafters submit
```

## Progress

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
- [ ] Persistent Connections
  - [ ] Persistent connections
  - [ ] Concurrent persistent connections
  - [ ] Connection closure
