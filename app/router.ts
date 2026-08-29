export function route(path: string): { status: number; text: string; body?: string } {
  if (path === '/') return { status: 200, text: "OK" };
  if (path.startsWith('/echo/')) {
    const pathOnly = path.split('?')[0];
    const param = pathOnly.slice(6); // after /echo/
    return { status: 200, text: "OK", body: param };
  }
  return { status: 404, text: "Not Found" };
}