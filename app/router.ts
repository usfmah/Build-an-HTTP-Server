import * as path from "node:path";
import * as fs from "node:fs/promises";


export async function route(method: string,  reqPath: string, body?: Buffer, headers?: Map<string, string>, dir?: string): Promise<{ status: number; statusText: string; body?: string | Buffer; contentType?: string }> {
  if (reqPath === '/') return { status: 200, statusText: "OK" };

  if (reqPath.startsWith('/echo/')) {
    const pathOnly = reqPath.split('?')[0];
    let param: string;
    try {
      param = decodeURIComponent(pathOnly.slice(6));
    } catch {
      return { status: 400, statusText: "Bad Request" };
    }
    return { status: 200, statusText: "OK", body: param };
  }

  if (reqPath === '/user-agent') {
    return { status: 200, statusText: "OK", body: headers?.get("user-agent") ?? '' };
  }

  if (reqPath.startsWith('/files/')) {
    const rawName = reqPath.slice(7).split('?')[0];
    let filename: string;
    try {
      filename = decodeURIComponent(rawName);
    } catch {
      return { status: 400, statusText: "Bad Request" };
    }
    
    if (!dir) return { status: 404, statusText: "Not Found" };

    const baseDir = path.resolve(dir);
    const fullPath = path.resolve(baseDir, filename); 

    if (fullPath !== baseDir && !fullPath.startsWith(baseDir + path.sep)) {
      return {status: 404, statusText: "Not Found"};
    }
    if (fullPath === baseDir) {
      return { status: 404, statusText: "Not Found" };
    }

    if (method === 'POST') {
      await fs.writeFile(fullPath, body ?? Buffer.alloc(0));
      return { status: 201, statusText: "Created" };
    }

    try {
      const file = await fs.readFile(fullPath);
      return { status: 200, statusText: "OK", body: file, contentType: "application/octet-stream" };
    } catch {
      return { status: 404, statusText: "Not Found" };
    }
  }
  return { status: 404, statusText: "Not Found" };
}
