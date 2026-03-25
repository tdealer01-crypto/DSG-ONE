import fs from "fs";
import path from "path";

const ROOT = process.env.MCP_ROOT || process.cwd();

function safe(p: string) {
  const full = path.resolve(ROOT, p);
  if (!full.startsWith(ROOT)) {
    throw new Error("path escape blocked");
  }
  return full;
}

export function file_list({ dir = "." }: any) {
  const fullDir = safe(dir);
  const files = fs.readdirSync(fullDir).map((name) => {
    const stat = fs.statSync(path.join(fullDir, name));
    return {
      name,
      isDirectory: stat.isDirectory(),
      size: stat.size
    };
  });

  return {
    tool: "file.list",
    ok: true,
    data: { dir, files }
  };
}

export function file_read({ file }: any) {
  if (!file) {
    throw new Error("missing file");
  }

  const content = fs.readFileSync(safe(file), "utf-8");

  return {
    tool: "file.read",
    ok: true,
    data: {
      file,
      content
    }
  };
}

export function file_write({ file, content }: any) {
  if (!file) {
    throw new Error("missing file");
  }

  fs.writeFileSync(safe(file), String(content ?? ""));

  return {
    tool: "file.write",
    ok: true,
    data: {
      file,
      bytes: Buffer.byteLength(String(content ?? ""), "utf-8")
    }
  };
}
