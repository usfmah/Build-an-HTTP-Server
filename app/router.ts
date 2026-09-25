import * as path from "node:path";
import * as fs from "node:fs/promises";


export async function route(reqPath: string, headers?: Map<string, string>, dir?: string): Promise<{ status: number; text: string; body?: string; contentType?: string }> {
  if (reqPath === '/') return { status: 200, text: "OK" };

  if (reqPath.startsWith('/echo/')) {
    const pathOnly = reqPath.split('?')[0];
    const param = pathOnly.slice(6);
    return { status: 200, text: "OK", body: param };
  }

  if (reqPath === '/user-agent') {
    return { status: 200, text: "OK", body: headers?.get("user-agent") ?? '' };
  }

  if (reqPath.startsWith('/files/')) {
    const filename = reqPath.slice(7);
    
    if (!dir) return { status: 404, text: "Not Found" };

    const baseDir = path.resolve(dir);
    const fullPath = path.resolve(baseDir, filename); 

    if (!fullPath.startsWith(baseDir + path.sep)) {
      return {status: 404, text: "Not Found"};
    }
    try {
      const file = await fs.readFile(fullPath, "utf8");
      return { status: 200, text: "OK", body: file, contentType: "application/octet-stream" };
    } catch {
      return { status: 404, text: "Not Found" };
    }
  }
  return { status: 404, text: "Not Found" };
}
