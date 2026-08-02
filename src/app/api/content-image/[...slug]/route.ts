import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

/**
 * Proxy d'images de contenu dynamique.
 *
 * Les images de couverture / illustrations des articles et projets vivent dans le
 * depot de contenu `bardy-michael-content` (branche `main`) sous `blog/<slug>/...`,
 * et sont referees dans le frontmatter / corps MDX sous la forme `/blog/<slug>/<fichier>`.
 *
 * Cette route sert ces images SANS les copier dans `public/blog` au build :
 *   - en production -> redirection 302 vers `raw.githubusercontent.com` (publique, cache 1 an)
 *   - en developpement avec le sous-module local present -> lecture locale (sync-content.mjs)
 *
 * Seuls les chemins commencant par `blog/` sont autorises (pas d'acces arbitraire).
 */
const REPO_OWNER = process.env.CONTENT_REPO_OWNER || "micmc422";
const REPO_NAME = process.env.CONTENT_REPO_NAME || "bardy-michael-content";
const REPO_BRANCH = process.env.CONTENT_REPO_BRANCH || "main";

export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  // slug = ["blog", "<slug>", "<fichier>"] -> on reconstruit le chemin relatif
  const rel = slug.map((s) => decodeURIComponent(s)).join("/");
  if (!rel.startsWith("blog/") || rel.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Dev : sous-module local present -> servir le fichier copie dans public/blog
  const localPublic = path.join(process.cwd(), "public", rel);
  if (process.env.NODE_ENV !== "production" && fs.existsSync(localPublic)) {
    const ext = path.extname(localPublic).slice(1);
    const type = ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : "image/jpeg";
    const buf = fs.readFileSync(localPublic);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // Prod / fallback : redirection vers l'asset brut public de GitHub
  const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/${rel}`;
  return NextResponse.redirect(rawUrl, { status: 302 });
}
