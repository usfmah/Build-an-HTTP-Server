import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
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
      
          socket.write(buildResponse(400, "Bad"));
          buffer = Buffer.alloc(0);
          return socket.end();
      
    }
    const URL = parts[1];

  

    if (URL === '/') {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } 
    else if (URL.startsWith('/echo/')) {
    const pathOnly = URL.split('?')[0]
    const endPoint = pathOnly.slice(6);
    const contentLength = Buffer.byteLength(endPoint, 'utf8')
      socket.write(buildResponse(200, "ok", endPoint))
    }
    else {
      socket.write(buildResponse(404, "Not Found"));
    }


    socket.end();
    buffer = Buffer.alloc(0);
  } catch {
    socket.write(buildResponse(400, "Bad"));
      socket.end();
      buffer = Buffer.alloc(0);
      
  }
  }
)

  socket.on('error', () => socket.destroy())

});
server.listen(4221, "localhost");

function buildResponse (status: number, text:string, body?:string) {
  return `HTTP/1.1 ${status} ${text}\r\nContent-Type…\r\nContent-Length: ${Buffer.byteLength(body ?? "")}\r\n\r\n${body}`
}

server.on('error', (err) => {})



