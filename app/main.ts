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
      
          socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
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
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${contentLength}\r\n\r\n${endPoint}`)
    }
    else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }


    socket.end();
    buffer = Buffer.alloc(0);
  } catch {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
      socket.end();
      buffer = Buffer.alloc(0);
      
  }
  }
)

  socket.on('error', () => socket.destroy())

});
server.listen(4221, "localhost");
server.on('error', (err) => {})



