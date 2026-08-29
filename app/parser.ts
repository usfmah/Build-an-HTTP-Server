export function parseRequest(raw: string): { path: string } | { error: 400 } {
  const startLine = raw.split('\r\n')[0];
  const parts = startLine.split(' ');
  if (!startLine || parts.length !== 3 || !parts[1]) return { error: 400 };
  return { path: parts[1] };
}