export function parseRequest(
  raw: string,
):
  | { method: string; path: string; headers?: Map<string, string> }
  | { error: 400 } {
  const lines = raw.split("\r\n");
  const startLine = lines[0];
  const parts = startLine.split(" ");
  const headers = new Map<string, string>();
  if (!startLine || parts.length !== 3 || !parts[1]) return { error: 400 };

  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "") break;
    const colon = lines[i].indexOf(":");
    if (colon === -1) continue;
    const name = lines[i].slice(0, colon).toLowerCase().trim();
    const value = lines[i].slice(colon + 1).trim();
    headers.set(name, value);
  }

  return { method: parts[0], path: parts[1], headers };
}

// Support post method for file
// Should respond with 201
// Create a new files in the file directory with the same name of filename (writefile)
// file contents = request body

// algorithm:
// Return type of request from parse.
// Check if the body is ended using content-length
// in router.ts in files branch if methos is post => write file
// Make contnet type, contnet length optional in build response
