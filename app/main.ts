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
      let stringfyBuffer = buffer.toString('utf8');
      const headerEnd = stringfyBuffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) return;
      const parsed = parseRequest(stringfyBuffer);
      if ('error' in parsed) {
        socket.write(buildResponse(400, "Bad Request"));
        buffer = Buffer.alloc(0);
        return socket.end();
      }
      const contentLength = parseInt(parsed.headers?.get('content-length') ?? '0', 10);
      const bodyStart = headerEnd + 4;
      const bodyReceived = stringfyBuffer.length - bodyStart; 
      if (bodyReceived < contentLength) return; 
      const body = stringfyBuffer.slice(bodyStart, bodyStart + contentLength);
      const { method, path, headers } = parsed;
      const res = await route(method, path, body, headers, dir);
      socket.write(buildResponse(res.status, res.statusText, res.body, res.contentType));

      socket.end();
      buffer = Buffer.alloc(0);
    } catch (err){
      console.log(err);
      socket.write(buildResponse(400, "Bad Request"));
      buffer = Buffer.alloc(0);
      socket.end();
    }
  });

  socket.on('error', () => socket.destroy());
});

server.listen(4221, "localhost");

server.on('error', (err) => {
  console.log(err);
});
