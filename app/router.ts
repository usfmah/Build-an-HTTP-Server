import * as path from "node:path";
import * as fs from "node:fs/promises";


export async function route(method: string, reqPath: string, body?: string, headers?: Map<string, string>, dir?: string): Promise<{ status: number; statusText: string; body?: string; contentType?: string }> {
  if (reqPath === '/') return { status: 200, statusText: "OK" };

  if (reqPath.startsWith('/echo/')) {
    const pathOnly = reqPath.split('?')[0];
    const param = decodeURIComponent(pathOnly.slice(6));
    return { status: 200, statusText: "OK", body: param };
  }

  if (reqPath === '/user-agent') {
    return { status: 200, statusText: "OK", body: headers?.get("user-agent") ?? '' };
  }

  if (reqPath.startsWith('/files/')) {
    const filename = reqPath.slice(7);
    
    if (!dir) return { status: 404, statusText: "Not Found" };

    const baseDir = path.resolve(dir);
    const fullPath = path.resolve(baseDir, filename); 

    if (!fullPath.startsWith(baseDir + path.sep)) {
      return {status: 404, statusText: "Not Found"};
    }

    if (method === 'POST') {
    await fs.writeFile(fullPath, body ?? '');
    return { status: 201, statusText: "Created" };
  }

    try {
      const file = await fs.readFile(fullPath, "utf8");
      return { status: 200, statusText: "OK", body: file, contentType: "application/octet-stream" };
    } catch {
      return { status: 404, statusText: "Not Found" };
    }
  }
  return { status: 404, statusText: "Not Found" };
}
