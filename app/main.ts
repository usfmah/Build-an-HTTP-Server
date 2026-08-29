import * as net from "net";
import { buildResponse } from "./response.ts";
import { route } from "./router.ts";
import { parseRequest } from "./parser.ts";

console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  let buffer = Buffer.alloc(0);

  socket.on('data', (data: Buffer) => {
    try {
      buffer = Buffer.concat([buffer, data]);
      if (!buffer.toString().includes('\r\n\r\n')) return;
      const req = buffer.toString('utf8');
      const parsed = parseRequest(req);
      if ('error' in parsed) {
        socket.write(buildResponse(400, "Bad Request"));
        buffer = Buffer.alloc(0);
        return socket.end();
      }
      const path = parsed.path;
      const res = route(path);
      socket.write(buildResponse(res.status, res.text, res.body));

      socket.end();
      buffer = Buffer.alloc(0);
    } catch {
      socket.write(buildResponse(400, "Bad Request"));
      socket.end();
      buffer = Buffer.alloc(0);
    }
  });

  socket.on('error', () => socket.destroy());
});

server.listen(4221, "localhost");

server.on('error', (err) => {});


