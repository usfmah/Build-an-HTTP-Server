export function parseRequest(raw: string): { path: string, headers?:Map<string,string> } | { error: 400 } {
  const lines = raw.split('\r\n');
  const startLine = lines[0];
  const parts = startLine.split(' ');
  const headers = new Map<string,string>();
  if (!startLine || parts.length !== 3 || !parts[1]) return { error: 400 };

   for(let i=1; i<lines.length; i++){
     if(lines[i]==="") break;
      const colon = lines[i].indexOf(":");
      if(colon===-1) continue;
      const name = lines[i].slice(0,colon).toLowerCase().trim();
      const value = lines[i].slice(colon+1).trim();
       headers.set(name,value);
      }

  return { path: parts[1], headers};
}