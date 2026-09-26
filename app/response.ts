export function buildResponse(
  status: number,
  text: string,
  body?: string | Buffer,
  contentType: string = "text/plain",
  contentEncoding?: string,
): Buffer {
  if (body === undefined) {
    return Buffer.from(`HTTP/1.1 ${status} ${text}\r\n\r\n`);
  }

  if (typeof body === "string") {
    let header = `HTTP/1.1 ${status} ${text}\r\nContent-Type: ${contentType}\r\n`;
    if (contentEncoding) {
      header += `Content-Encoding: ${contentEncoding}\r\n`;
    }
    header += `Content-Length: ${Buffer.byteLength(body, "utf-8")}\r\n\r\n${body}`;
    return Buffer.from(header);
  }

  let header = `HTTP/1.1 ${status} ${text}\r\nContent-Type: ${contentType}\r\n`;
  if (contentEncoding) {
    header += `Content-Encoding: ${contentEncoding}\r\n`;
  }
  header += `Content-Length: ${body.length}\r\n\r\n`;
  return Buffer.concat([Buffer.from(header), body]);
}
