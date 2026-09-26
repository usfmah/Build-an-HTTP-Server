import * as path from "node:path";
import * as fs from "node:fs/promises";
import * as zlib from "node:zlib";

export async function route(
  method: string,
  reqPath: string,
  body?: Buffer,
  headers?: Map<string, string>,
  dir?: string,
): Promise<{
  status: number;
  statusText: string;
  body?: string | Buffer;
  contentType?: string;
  contentEncoding?: string;
}> {
  let result: {
    status: number;
    statusText: string;
    body?: string | Buffer;
    contentType?: string;
    contentEncoding?: string;
  };

  if (reqPath === "/") {
    result = { status: 200, statusText: "OK" };
  } else if (reqPath.startsWith("/echo/")) {
    const pathOnly = reqPath.split("?")[0];
    let param: string;
    try {
      param = decodeURIComponent(pathOnly.slice(6));
    } catch {
      result = { status: 400, statusText: "Bad Request" };
      return result;
    }
    result = { status: 200, statusText: "OK", body: param };
  } else if (reqPath === "/user-agent") {
    result = {
      status: 200,
      statusText: "OK",
      body: headers?.get("user-agent") ?? "",
    };
  } else if (reqPath.startsWith("/files/")) {
    const rawName = reqPath.slice(7).split("?")[0];
    let filename: string;
    try {
      filename = decodeURIComponent(rawName);
    } catch {
      result = { status: 400, statusText: "Bad Request" };
      return result;
    }

    if (!dir) {
      result = { status: 404, statusText: "Not Found" };
      return result;
    }

    const baseDir = path.resolve(dir);
    const fullPath = path.resolve(baseDir, filename);

    if (
      (fullPath !== baseDir && !fullPath.startsWith(baseDir + path.sep)) ||
      fullPath === baseDir
    ) {
      result = { status: 404, statusText: "Not Found" };
      return result;
    }

    if (method === "POST") {
      await fs.writeFile(fullPath, body ?? Buffer.alloc(0));
      result = { status: 201, statusText: "Created" };
      return result;
    }

    try {
      const file = await fs.readFile(fullPath);
      result = {
        status: 200,
        statusText: "OK",
        body: file,
        contentType: "application/octet-stream",
      };
    } catch {
      result = { status: 404, statusText: "Not Found" };
      return result;
    }
  } else {
    result = { status: 404, statusText: "Not Found" };
    return result;
  }

  if (result.body !== undefined) {
    const acceptEncoding = headers?.get("accept-encoding") ?? "";
    const encodings = acceptEncoding
      .split(",")
      .map((s) => s.trim().toLowerCase());
    if (encodings.includes("gzip")) {
      result.contentEncoding = "gzip";
      const rawBytes: Buffer =
        typeof result.body === "string"
          ? Buffer.from(result.body, "utf-8")
          : result.body;
      const compressed = zlib.gzipSync(rawBytes);
      result.body = compressed;
    }
  }

  return result;
}
