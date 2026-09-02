import * as net from "net";
import { buildResponse } from "./response.ts";
import { route } from "./router.ts";
import { parseRequest } from "./parser.ts";

console.log("Logs from your program will appear here!");

const dirIndex = process.argv.indexOf("--directory");
const dir = dirIndex !== -1 ? process.argv[dirIndex + 1] : undefined;

const server = net.createServer((socket) => {
  let buffer = Buffer.alloc(0);

  socket.on('data', async (data: Buffer) => {
    try {
      buffer = Buffer.concat([buffer, data]);
      if (!buffer.toString('utf8').includes('\r\n\r\n')) return;
      const req = buffer.toString('utf8');
      const parsed = parseRequest(req);
      if ('error' in parsed) {
        socket.write(buildResponse(400, "Bad Request"));
        buffer = Buffer.alloc(0);
        return socket.end();
      }
      const { path, headers } = parsed;
      const res = await route(path, headers, dir);
      socket.write(buildResponse(res.status, res.text, res.body, res.contentType));

      socket.end();
      buffer = Buffer.alloc(0);
    } catch {
      socket.write(buildResponse(400, "Bad Request"));
      buffer = Buffer.alloc(0);
      socket.end();
    }
  });

  socket.on('error', () => socket.destroy());
});

server.listen(4221, "localhost");

server.on('error', (err) => {});
