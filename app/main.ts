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
    buffer = Buffer.concat([buffer, data]);
    while (true) {
      try {
        const headerEnd = buffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) return;
        const headerText = buffer.subarray(0, headerEnd + 4).toString('utf8');

        const parsed = parseRequest(headerText);
        if ('error' in parsed) {
          socket.write(buildResponse(400, "Bad Request"));
          buffer = Buffer.alloc(0);
          socket.end();
          break;
        }

        const rawLength = parsed.headers?.get('content-length') ?? '0';
        const contentLength = rawLength === '' ? 0 : parseInt(rawLength, 10);
        if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
          socket.write(buildResponse(400, "Bad Request"));
          buffer = Buffer.alloc(0);
          socket.end();
          break;
        }

        const bodyStart = headerEnd + 4;
        if (buffer.length - bodyStart < contentLength) return;
        const body = buffer.subarray(bodyStart, bodyStart + contentLength);
        const { method, path, headers } = parsed;
        const res = await route(method, path, body, headers, dir);
        const connection = headers?.get('connection');
        socket.write(buildResponse(res.status, res.statusText, res.body, res.contentType, res.contentEncoding, connection));

        buffer = buffer.subarray(bodyStart + contentLength);
        if (connection?.toLowerCase() === 'close') {
          buffer = Buffer.alloc(0);
          socket.end();
          break;
        }

      } catch (err) {
        console.log(err);
        socket.write(buildResponse(400, "Bad Request"));
        buffer = Buffer.alloc(0);
        socket.end();
        break;
      }
    }
  });

  socket.on('error', () => socket.destroy());
});

server.listen(4221, "localhost");

server.on('error', (err) => {
  console.log(err);
});