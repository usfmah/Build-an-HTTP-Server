import * as net from "net";
import {buildResponse} from './response.ts'

console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  let buffer = Buffer.alloc(0);

  socket.on('data', (data: Buffer) => {
    try {
      buffer = Buffer.concat([buffer, data]);
      if (!buffer.toString().includes('\r\n\r\n')) return;
      const req = buffer.toString('utf8');
      const startLine = req.split('\r\n')[0];
      const parts = startLine.split(' ');
      if (!startLine || parts.length !== 3 || !parts[1]) {
        socket.write(buildResponse(400, "Bad Request"));
        buffer = Buffer.alloc(0);
        return socket.end();
      }
      const path = parts[1];

      if (path === '/') {
        socket.write(buildResponse(200, "OK"));
      } else if (path.startsWith('/echo/')) {
        const pathOnly = path.split('?')[0];
        const endPoint = pathOnly.slice(6);
        socket.write(buildResponse(200, "OK", endPoint));
      } else {
        socket.write(buildResponse(404, "Not Found"));
      }

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
