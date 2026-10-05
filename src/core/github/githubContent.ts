/**
 * Data layer 100 % GitHub : lit les articles/projets depuis les fichiers MDX
 * versionnes dans le depot de contenu `bardy-michael-content`
 * (https://github.com/micmc422/bardy-michael-content, branche `main`),
 * via l'API GitHub + raw.githubusercontent.com — a l'execution, sans
 * avoir a rebuilder le site.
 *
 * Remplace l'ancienne lecture `fs` du sous-module git (qui figeait le contenu
 * au build). Le contenu est desormais recupere dynamiquement (avec cache ISR
 * cote serveur via `unstable_cache` dans serverActions.ts et `revalidate`).
 *
 * Structure distante du depot de contenu :
 *   - `content/blog/*.mdx`     -> articles
 *   - `content/projects/*.mdx` -> projets
 *   - `blog/<slug>/...`        -> images de couverture (servies via /api/content-image)
 *
 * En developpement, si le sous-module local `content/` est present, on l'utilise
 * en fallback (plus rapide, pas d'appel reseau). En production on passe par GitHub.
 *
 * Nouveaute : les images de couverture (`/blog/...`) sont reecrites en
 * `/api/content-image/...` pour etre servies dynamiquement depuis le depot
 * distant, sans copie dans `public/blog`.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// --- Configuration du depot distant de contenu ---
const REPO_OWNER = process.env.CONTENT_REPO_OWNER || "micmc422";
const REPO_NAME = process.env.CONTENT_REPO_NAME || "bardy-michael-content";
const REPO_BRANCH = process.env.CONTENT_REPO_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.CONTENT_REPO_TOKEN || "";
const GITHUB_API = "https://api.github.com";

// Prefixe interne ou vivent les MDX dans le depot de contenu
const CONTENT_PREFIX = "content";
const BLOG_DIR = `${CONTENT_PREFIX}/blog`;
const PROJECT_DIR = `${CONTENT_PREFIX}/projects`;

// Chemin local du sous-module (utilise uniquement en fallback dev)
const LOCAL_CONTENT = path.join(process.cwd(), "content");

export interface LocalPostMeta {
  title: string;
  description: string;
  publishedAt: string | null;
  updatedAt: string | null;
  image: string | null;
  tags: string[];
  author?: string;
  slug: string;
  /** Corps MDX brut (sans le frontmatter) */
  body: string;
}

// --- Helpers internes ----------------------------------------------------

function localBasePath(sub: "blog" | "projects"): string {
  // Le sous-module monte le repo a la racine `content/` ; les MDX y sont dans
  // `content/content/<blog|projects>`. On verifie les deux organisations.
  const candidates = [
    path.join(LOCAL_CONTENT, CONTENT_PREFIX, sub),
    path.join(LOCAL_CONTENT, sub),
  ];
  return candidates.find((p) => fs.existsSync(p)) ?? candidates[0]!;
}

/** Convertit un chemin d'image local `/blog/...` en proxy dynamique. */
function rewriteImage(image: string | null): string | null {
  if (!image) return null;
  if (!image.startsWith("/blog/")) return image;
  return `/api/content-image${image}`;
}

/** Parse le frontmatter + corps d'un document MDX (string). */
function parseRaw(raw: string, slug: string): LocalPostMeta {
  const { data, content } = matter(raw);
  return {
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    publishedAt: data.publishedAt ? String(data.publishedAt) : null,
    updatedAt: data.updatedAt ? String(data.updatedAt) : null,
    image: rewriteImage(data.image ? String(data.image) : null),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    author: data.author ? String(data.author) : undefined,
    slug,
    body: content,
  };
}

/** Recupere le contenu brut d'un fichier MDX, soit localement, soit via GitHub. */
async function readPostRaw(
  sub: "blog" | "projects",
  slug: string,
  useLocal: boolean
): Promise<string | null> {
  const file = `${slug}.mdx`;
  if (useLocal) {
    const dir = localBasePath(sub);
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, "utf8");
  }
  const apiPath = `${sub === "blog" ? BLOG_DIR : PROJECT_DIR}/${file}`;
  return fetchFileFromGitHub(apiPath);
}

/** Liste tous les slugs MDX d'un dossier, soit localement, soit via GitHub. */
async function listSlugs(
  sub: "blog" | "projects",
  useLocal: boolean
): Promise<string[]> {
  if (useLocal) {
    const dir = localBasePath(sub);
    try {
      return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(/\.mdx$/, ""));
    } catch {
      return [];
    }
  }
  const apiPath = sub === "blog" ? BLOG_DIR : PROJECT_DIR;
  return listDirFromGitHub(apiPath);
}

// --- Acces GitHub (API + raw) -------------------------------------------

function githubHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (GITHUB_TOKEN) h.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return h;
}

/** Recupere le contenu decode d'un fichier via l'API GitHub (base64). */
async function fetchFileFromGitHub(apiPath: string): Promise<string | null> {
  const url = `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${apiPath}?ref=${REPO_BRANCH}`;
  const res = await fetch(url, { headers: githubHeaders(), next: { revalidate: 3600 } });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} pour ${apiPath}: ${(await res.text()).slice(0, 200)}`);
  }
  const data = (await res.json()) as { content?: string; encoding?: string };
  if (!data.content) return null;
  const buf = Buffer.from(data.content, (data.encoding as BufferEncoding) || "base64");
  return buf.toString("utf8");
}

/** Liste les noms de fichiers `.mdx` d'un dossier via l'API GitHub. */
async function listDirFromGitHub(apiPath: string): Promise<string[]> {
  const url = `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${apiPath}?ref=${REPO_BRANCH}`;
  const res = await fetch(url, { headers: githubHeaders(), next: { revalidate: 3600 } });
  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} pour ${apiPath}: ${(await res.text()).slice(0, 200)}`);
  }
  const data = (await res.json()) as Array<{ name: string; type: string }>;
  return data
    .filter((e) => e.type === "file" && e.name.endsWith(".mdx"))
    .map((e) => e.name.replace(/\.mdx$/, ""));
}

/** URL brute (publique, sans token) d'un asset d'image du depot de contenu. */
export function rawContentImageUrl(imagePath: string): string {
  // imagePath attendu sous la forme "/blog/<slug>/<fichier>"
  const clean = imagePath.replace(/^\//, "");
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/${clean}`;
}

// --- Logique de decision local vs distant -------------------------------

/**
 * En dev, on privilegie le sous-module local (s'il existe) pour la vitesse.
 * En prod / build, on passe par GitHub pour ne pas dependre du sous-module fige.
 */
function shouldUseLocal(): boolean {
  const localExists =
    fs.existsSync(localBasePath("blog")) || fs.existsSync(localBasePath("projects"));
  // Forcer le distant si explicitement demande, ou si pas de local en prod.
  if (process.env.CONTENT_SOURCE === "local") return localExists;
  if (process.env.CONTENT_SOURCE === "remote") return false;
  return process.env.NODE_ENV !== "production" && localExists;
}

// --- API publique (signatures conservees) ------------------------------

/** Un article est "publie" si sa date de publication est dans le passe/present. */
export function isPublished(meta: LocalPostMeta, now: Date = new Date()): boolean {
  if (!meta.publishedAt) return true;
  const d = new Date(meta.publishedAt);
  return !isNaN(d.getTime()) && d.getTime() <= now.getTime();
}

function sortByDateDesc(posts: LocalPostMeta[]): LocalPostMeta[] {
  return [...posts].sort((a, b) => {
    const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return db - da;
  });
}

async function readAll(sub: "blog" | "projects"): Promise<LocalPostMeta[]> {
  const useLocal = shouldUseLocal();
  const slugs = await listSlugs(sub, useLocal);
  const metas = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readPostRaw(sub, slug, useLocal);
      return raw ? parseRaw(raw, slug) : null;
    })
  );
  return metas.filter((m): m is LocalPostMeta => m !== null);
}

export async function getLocalPosts({
  limit = "all",
  page = 1,
  tags,
}: { limit?: number | "all"; page?: number; tags?: string[] } = {}): Promise<LocalPostMeta[]> {
  let posts = sortByDateDesc(await readAll("blog")).filter((p) => isPublished(p));
  if (tags && tags.length) {
    posts = posts.filter((p) => (p.tags || []).some((t) => tags.includes(t)));
  }
  if (limit !== "all" && limit > 0) {
    const start = (page - 1) * limit;
    posts = posts.slice(start, start + limit);
  }
  return posts;
}

export async function getLocalPostBySlug(slug: string): Promise<LocalPostMeta | null> {
  const raw = await readPostRaw("blog", slug, shouldUseLocal());
  if (!raw) return null;
  const meta = parseRaw(raw, slug);
  if (!isPublished(meta)) return null; // article planifie dans le futur -> 404
  return meta;
}

export async function getLocalProjects({ limit = "all" }: { limit?: number | "all" } = {}): Promise<LocalPostMeta[]> {
  let projects = sortByDateDesc(await readAll("projects"));
  if (limit !== "all") projects = projects.slice(0, limit);
  return projects;
}

export async function getLocalProjectBySlug(slug: string): Promise<LocalPostMeta | null> {
  const raw = await readPostRaw("projects", slug, shouldUseLocal());
  if (!raw) return null;
  return parseRaw(raw, slug);
}

export async function getLocalRelatedPosts(slug: string, limit = 4): Promise<LocalPostMeta[]> {
  const all = sortByDateDesc(await readAll("blog")).filter((p) => isPublished(p));
  const current = all.find((p) => p.slug === slug);
  const tagged = current?.tags || [];
  const others = all.filter((p) => p.slug !== slug);
  const related = others
    .map((p) => ({ p, score: (p.tags || []).filter((t) => tagged.includes(t)).length }))
    .sort((a, b) => b.score - a.score || 0)
    .map((x) => x.p);
  return related.slice(0, limit);
}

export async function getLocalTags(): Promise<{ id: string; name: string }[]> {
  const counts = new Map<string, number>();
  for (const p of await readAll("blog")) {
    for (const t of p.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()].map(([name, count]) => ({ id: name, name: `${name} (${count})` }));
}
