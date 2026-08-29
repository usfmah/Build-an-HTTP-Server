export function buildResponse(status: number, text: string, body?: string) {
  return `HTTP/1.1 ${status} ${text}\r\nContent-Type: text/plain\r\nContent-Length: ${Buffer.byteLength(body ?? "", 'utf-8')}\r\n\r\n${body ?? ""}`;
}