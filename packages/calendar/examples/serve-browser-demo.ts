/**
 * Serves this package directory so `examples/browser-demo.html` can load the bundle at `dist/anglicana.js`.
 * Run: `deno task calendar:browser-demo` from the repository root.
 */
import { dirname, extname, fromFileUrl, relative, resolve } from "jsr:@std/path@^1";

const ROOT = resolve(dirname(fromFileUrl(import.meta.url)), "..");
const PORT = 8765;

const MIME: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function safeResolvedPath(pathname: string): string | null {
  const path = pathname.replace(/^\/+/, "");
  const abs = resolve(ROOT, path);
  const rel = relative(ROOT, abs);
  if (rel.startsWith("..") || rel === "..") return null;
  return abs;
}

console.log(`Anglicana browser demo: http://localhost:${PORT}/ (redirects to /examples/browser-demo.html)`);

Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);
  if (url.pathname === "/") {
    return Response.redirect(new URL("/examples/browser-demo.html", url.origin).href, 302);
  }

  const fsPath = safeResolvedPath(url.pathname);
  if (!fsPath) {
    return new Response("Forbidden", { status: 403 });
  }

  let stat: Deno.FileInfo;
  try {
    stat = await Deno.stat(fsPath);
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return new Response("Not Found", { status: 404 });
    }
    throw e;
  }

  if (!stat.isFile) {
    return new Response("Not Found", { status: 404 });
  }

  const data = await Deno.readFile(fsPath);
  const ext = extname(fsPath);
  const type = MIME[ext] ?? "application/octet-stream";
  return new Response(data, { headers: { "content-type": type } });
});
