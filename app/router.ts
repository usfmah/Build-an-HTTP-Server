import * as fs from "node:fs/promises";

export async function route(path: string, headers?: Map<string, string>, dir?: string): Promise<{ status: number; text: string; body?: string; contentType?: string }> {
  if (path === '/') return { status: 200, text: "OK" };

  if (path.startsWith('/echo/')) {
    const pathOnly = path.split('?')[0];
    const param = pathOnly.slice(6);
    return { status: 200, text: "OK", body: param };
  }

  if (path === '/user-agent') {
    return { status: 200, text: "OK", body: headers?.get("user-agent") ?? '' };
  }

  if (path.startsWith('/files/')) {
    const filename = path.slice(7);
    
    if (!dir) return { status: 404, text: "Not Found" };

    const filePath = dir + "/" + filename;
    try {
      const file = await fs.readFile(filePath, "utf8");
      return { status: 200, text: "OK", body: file, contentType: "application/octet-stream" };
    } catch {
      return { status: 404, text: "Not Found" };
    }
  }
  return { status: 404, text: "Not Found" };
}
