import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.end("HTTP/1.1 200 OK\r\n\r\n");

});

server.listen(4221, "localhost");
