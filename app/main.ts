import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {

  socket.on('data', (data: Buffer) => {
    const req = data.toString('utf8');
    
    const startLine = req.split('\r\n')[0];

    const parts = startLine.split(' ');

    const URL = parts[1];

  

    if (URL === '/') {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } 
    else if (URL.startsWith('/echo/')) {
    const endPoint = URL.split('/')[2];
    const contentLength = endPoint.length;
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${contentLength}\r\n\r\n${endPoint}`)
    }
    else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }


    socket.end();
  })

  

});

server.listen(4221, "localhost");



// Starter line (either request or response)
// CLRF
// Headers separated with CLRF Between each other
// CLRF 
// Body 

// Algorithm:
// Read the starter Line to know if it's request or response
// Read the each header field until empty line 
// Is there a body?
// if yes, read it as streams, comapre based on the headers, until the body ends

// Tehre is no whitespace between the start-line and the first header field.
// if there is a whaitespace the recipient must reject the message as invalid or consume each whitespace-preceded line without further processing of it (i.e., ignore the entire line, along with any subsequent lines preceded by whitespace, until a properly formed header field is received or the header section is terminated)ز
// If the server recived a format that is not an HTTP request it returns 404

// HTTP-version = HTTP-name "/" DIGIT "." DIGIT
// HTTP/1.1 should communicate with older or unknown HTTP versions in a way they can still understand, using newer features only after confirming the recipient supports them.


// request-line   = method SP request-target SP HTTP-version
// A request-line contains the **method, request-target, and HTTP version**, separated by spaces; parsers may allow other whitespace, with a recommended minimum length of **8000 bytes**,
//  while unsupported methods return **501** and overly long targets return **414**.


// Method: Token, either get, head, put, patch, delete...etc, 
// Request Target: The request-target identifies the target resource upon which to apply the request
// No whitespace is allowed in the request-target.
// Recipients of an invalid request-line SHOULD respond with either a 400 (Bad Request) error
// or a 301 (Moved Permanently) redirect with the request-target properly encoded.
// In HTTP/1.1, the client **must include a `Host` header** in every request.
// If the `Host` header is missing, duplicated, or invalid, the server **must respond with `400 Bad Request`**.


