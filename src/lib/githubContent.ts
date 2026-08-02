/**
 * Data layer 100 % GitHub : lit les articles/projets depuis des fichiers MDX
 * versionnés dans le sous-module de contenu (content/content/blog/*.mdx,
 * content/content/projects/*.mdx) via gray-matter.
 * Remplace l'intégration Wisp CMS. Aucun service externe.
 *
 * Le contenu vit dans le dépôt séparé `bardy-michael-content`, monté en
 * sous-module git dans `content/` (donc les MDX sont sous `content/content/...`).
 * Les images de couverture (`content/blog/<slug>/...`) sont copiées vers
 * `public/blog/<slug>/...` au build par `scripts/sync-content.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
// Sous-module `content` monté à la racine `content/` : on descend d'un niveau.
const CONTENT_REPO = path.join(ROOT, "content", "content");
const BLOG_DIR = path.join(CONTENT_REPO, "blog");
const PROJECT_DIR = path.join(CONTENT_REPO, "projects");

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

function readDirSafe(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
}

function parseFile(file: string, slug: string, isProject = false): LocalPostMeta {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    publishedAt: data.publishedAt ? String(data.publishedAt) : null,
    updatedAt: data.updatedAt ? String(data.updatedAt) : null,
    image: data.image ? String(data.image) : null,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    author: data.author ? String(data.author) : undefined,
    slug,
    body: content,
  };
}

function readAll(dir: string): LocalPostMeta[] {
  return readDirSafe(dir).map((f) => {
    const slug = f.replace(/\.mdx$/, "");
    return parseFile(path.join(dir, f), slug);
  });
}

/** Un article est "publié" si sa date de publication est dans le passé ou le présent.
 *  Les articles datés dans le futur ne doivent pas être visibles par les visiteurs. */
export function isPublished(meta: LocalPostMeta, now: Date = new Date()): boolean {
  if (!meta.publishedAt) return true; // pas de date => considéré comme déjà publié
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

export function getLocalPosts({
  limit = "all",
  page = 1,
  tags,
}: { limit?: number | "all"; page?: number; tags?: string[] } = {}): LocalPostMeta[] {
  let posts = sortByDateDesc(readAll(BLOG_DIR)).filter((p) => isPublished(p));
  if (tags && tags.length) {
    posts = posts.filter((p) => (p.tags || []).some((t) => tags.includes(t)));
  }
  if (limit !== "all" && limit > 0) {
    const start = (page - 1) * limit;
    posts = posts.slice(start, start + limit);
  }
  return posts;
}

export function getLocalPostBySlug(slug: string): LocalPostMeta | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const meta = parseFile(file, slug);
  if (!isPublished(meta)) return null; // article planifié dans le futur -> 404
  return meta;
}

export function getLocalProjects({ limit = "all" }: { limit?: number | "all" } = {}): LocalPostMeta[] {
  let projects = sortByDateDesc(readAll(PROJECT_DIR));
  if (limit !== "all") projects = projects.slice(0, limit);
  return projects;
}

export function getLocalProjectBySlug(slug: string): LocalPostMeta | null {
  const file = path.join(PROJECT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return parseFile(file, slug, true);
}

export function getLocalRelatedPosts(slug: string, limit = 4): LocalPostMeta[] {
  const all = sortByDateDesc(readAll(BLOG_DIR)).filter((p) => isPublished(p));
  const current = all.find((p) => p.slug === slug);
  const tagged = current?.tags || [];
  const others = all.filter((p) => p.slug !== slug);
  // Priorise les posts partageant un tag, sinon prend les plus récents
  const related = others
    .map((p) => ({ p, score: (p.tags || []).filter((t) => tagged.includes(t)).length }))
    .sort((a, b) => b.score - a.score || 0)
    .map((x) => x.p);
  return related.slice(0, limit);
}

export function getLocalTags(): { id: string; name: string }[] {
  const counts = new Map<string, number>();
  for (const p of readAll(BLOG_DIR)) {
    for (const t of p.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()].map(([name, count]) => ({ id: name, name: `${name} (${count})` }));
}
