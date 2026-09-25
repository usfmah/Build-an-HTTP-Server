export function buildResponse(status: number, text: string, body?: string, contentType: string = "text/plain") {
  if (body === undefined) {
    return `HTTP/1.1 ${status} ${text}\r\n\r\n`;
  }
  return `HTTP/1.1 ${status} ${text}\r\nContent-Type: ${contentType}\r\nContent-Length: ${Buffer.byteLength(body, 'utf-8')}\r\n\r\n${body}`;
}