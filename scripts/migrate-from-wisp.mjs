/**
 * Migration Wisp CMS -> fichiers MDX locaux (100 % GitHub).
 * Génère content/blog/<slug>.mdx et content/projects/<slug>.mdx
 * avec frontmatter + corps MDX (code inliné en fence, images rapatriées).
 *
 * Usage (depuis la racine du projet, WSL/Node 22) :
 *   node scripts/migrate-from-wisp.mjs
 * Nécessite WISP_BLOG_ID dans .env.local (lu directement).
 */
import { buildWispClient } from "@wisp-cms/client";
import TurndownService from "turndown";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");
const PROJECT_DIR = path.join(ROOT, "content", "projects");
const PUBLIC_BLOG = path.join(ROOT, "public", "blog");

// --- lecture .env.local ---
async function loadEnv() {
  try {
    const raw = await fs.readFile(path.join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/i);
      if (m) process.env[m[1]] = m[2];
    }
  } catch (e) {
    console.warn("⚠ .env.local introuvable:", e.message);
  }
}
await loadEnv();

if (!process.env.WISP_BLOG_ID) {
  console.error("WISP_BLOG_ID manquant dans .env.local");
  process.exit(1);
}
const wisp = buildWispClient({
  baseUrl: "https://www.wisp.blog",
  blogId: process.env.WISP_BLOG_ID,
});

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// Plugin GFM minimal (tables) — turndown-gfm indisponible sur ce registry.
// Convertit <table> en bloc Markdown GFM (header | --- | rows) sans ligne vide
// intercalée (sinon remarkGfm ne reconnaît pas le tableau).
function gfmTables(turndownService) {
  turndownService.addRule("gfmTable", {
    filter: "table",
    replacement: (_content, node) => {
      const rows = Array.from(node.querySelectorAll("tr"));
      if (!rows.length) return "";
      const cellText = (tr) =>
        Array.from(tr.children)
          .map((c) => (c.textContent || "").replace(/\s+/g, " ").trim())
          .join(" | ");
      const lines = [];
      const headerCells = Array.from(rows[0].children).length;
      lines.push("| " + cellText(rows[0]) + " |");
      lines.push("| " + Array(headerCells).fill("---").join(" | ") + " |");
      for (let i = 1; i < rows.length; i++) {
        lines.push("| " + cellText(rows[i]) + " |");
      }
      return "\n" + lines.join("\n") + "\n";
    },
  });
}
gfmTables(turndown);

const EXT_BY_LANG = {
  ts: "ts", tsx: "tsx", js: "js", jsx: "jsx", json: "json",
  html: "html", css: "css", scss: "scss", md: "md", mdx: "mdx",
  yml: "yml", yaml: "yaml", sh: "bash", bash: "bash", py: "py",
};

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function slugifyImageName(url, i) {
  const u = new URL(url);
  const seg = u.pathname.split("/").pop() || `img-${i}`;
  // imagedelivery.net/<id>/<uuid>/public  -> on garde l'uuid
  const parts = u.pathname.split("/").filter(Boolean);
  const uuid = parts.find((p) => /^[0-9a-f]{8}-/.test(p)) || seg;
  return `${uuid}.jpg`;
}

/** Post-traite le Markdown généré :
 * - nettoie les lignes vides intercalées dans les tables GFM
 * - déséchappe les # échappés par Turndown (\## -> ##) et autres
 * - convertit les <div data-wisp-react-component> en composants MDX (<Steps .../>)
 */
function postProcessMarkdown(md) {
  // 1) Tables GFM : recolle les lignes de tableau (commençant par |)
  const lines = md.split("\n");
  const isTableRow = (l) => /^\s*\|/.test(l);
  const cleaned = [];
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i] ?? "";
    if (isTableRow(cur) && cleaned.length >= 2) {
      const maybeEmpty = cleaned[cleaned.length - 1] ?? "";
      const beforeEmpty = cleaned[cleaned.length - 2] ?? "";
      if (maybeEmpty.trim() === "" && isTableRow(beforeEmpty)) {
        cleaned.pop();
      }
    }
    cleaned.push(cur);
  }
  let out = cleaned.join("\n");

  // 2) Déséchappe les # en début de ligne (\## -> ##, \### -> ###)
  out = out.replace(/^\\#/gm, "#");

  // 3) <div data-wisp-react-component="true" data-name="X" data-props="<enc>">
  //    -> <X data-props="<enc>" />
  //    (StepsComponent/Faq lisent data-props = JSON encodé en URI)
  out = out.replace(
    /<div\s+([^>]*?)data-wisp-react-component=["']true["']([^>]*?)\/?>(?:<\/div>)?/gi,
    (_m, before, after) => {
      const full = (before + " " + after).trim();
      const nameMatch = full.match(/data-name=["']([^"']+)["']/);
      const name = nameMatch ? nameMatch[1] : "WispComponent";
      const propsMatch = full.match(/data-props=["']([^"']+)["']/);
      const dataProps = propsMatch ? propsMatch[1] : "";
      return `<${name} data-props="${dataProps}" />`;
    }
  );

  return out;
}

async function inlineRawGithubLinks(markdown, slug) {
  const linkRe = /\[([^\]]*)\]\((https:\/\/raw\.githubusercontent\.com\/[^)]+)\)/g;
  const out = [];
  let last = 0;
  let m;
  while ((m = linkRe.exec(markdown)) !== null) {
    out.push(markdown.slice(last, m.index));
    const label = m[1];
    const url = m[2];
    try {
      const code = await fetchText(url);
      const ext = (url.split(".").pop() || "txt").toLowerCase();
      const lang = EXT_BY_LANG[ext] || ext;
      const filename = url.split("/").pop();
      out.push(`\n// ${filename}${label ? " — " + label : ""}\n\`\`\`${lang}\n${code.trim()}\n\`\`\`\n`);
    } catch (e) {
      console.warn(`  ⚠ impossible de récupérer ${url}: ${e.message}`);
      out.push(m[0]); // garde le lien tel quel
    }
    last = m.index + m[0].length;
  }
  out.push(markdown.slice(last));
  return out.join("");
}

/** Rapatrie les images et remplace les URLs par des chemins locaux */
async function inlineImages(html, slug) {
  if (typeof html !== "string") return html || "";
  const imgRe = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  let out = html;
  const images = [...html.matchAll(imgRe)].map((x) => x[1]);
  const seen = new Map();
  for (let i = 0; i < images.length; i++) {
    const url = images[i];
    try {
      const name = slugifyImageName(url, i);
      const dir = path.join(PUBLIC_BLOG, slug);
      await fs.mkdir(dir, { recursive: true });
      const buf = await fetchBuffer(url);
      await fs.writeFile(path.join(dir, name), buf);
      const local = `/blog/${slug}/${name}`;
      seen.set(url, local);
      console.log(`  🖼 ${url} -> ${local}`);
    } catch (e) {
      console.warn(`  ⚠ image ${url}: ${e.message}`);
    }
  }
  for (const [url, local] of seen) {
    out = out.split(url).join(local);
  }
  return out;
}

function yamlStr(v) {
  if (v === null || v === undefined) return '""';
  return JSON.stringify(String(v));
}

async function writePostMdx({ slug, title, description, publishedAt, updatedAt, image, tags, author, contentHtml, dir }) {
  await fs.mkdir(dir, { recursive: true });
  // images d'abord (cover + inline)
  let html = contentHtml || "";
  html = await inlineImages(html, slug);
  // convertit le HTML (avec images déjà locales) en MD
  let md = turndown.turndown(html);
  // code inline
  md = await inlineRawGithubLinks(md, slug);
  // nettoyage tableaux / déséchappement # / composants Wisp -> MDX
  md = postProcessMarkdown(md);
  const coverLocal = image ? await (async () => {
    try {
      const name = slugifyImageName(image, "cover");
      const d = path.join(PUBLIC_BLOG, slug);
      await fs.mkdir(d, { recursive: true });
      const buf = await fetchBuffer(image);
      await fs.writeFile(path.join(d, name), buf);
      console.log(`  🖼 cover ${image} -> /blog/${slug}/${name}`);
      return `/blog/${slug}/${name}`;
    } catch (e) {
      console.warn(`  ⚠ cover ${image}: ${e.message}`);
      return image;
    }
  })() : null;

  const tagList = (tags || []).map((t) => (typeof t === "string" ? t : t.name)).filter(Boolean);
  const front = [
    "---",
    `title: ${yamlStr(title)}`,
    `description: ${yamlStr(description || "")}`,
    `publishedAt: ${publishedAt ? new Date(publishedAt).toISOString() : '""'}`,
    `updatedAt: ${updatedAt ? new Date(updatedAt).toISOString() : '""'}`,
    `image: ${coverLocal ? yamlStr(coverLocal) : '""'}`,
    `tags:${tagList.length ? " " + JSON.stringify(tagList) : " []"}`,
    author ? `author: ${yamlStr(author)}` : null,
    "---",
    "",
  ].filter((l) => l !== null).join("\n");

  const finalMd = front + md.trim() + "\n";
  const file = path.join(dir, `${slug}.mdx`);
  await fs.writeFile(file, finalMd, "utf8");
  console.log(`  ✅ ${file} (${finalMd.length} octets)`);
}

async function paginate(fn) {
  const all = [];
  let page = 1;
  const limit = 50;
  while (true) {
    const res = await fn({ page, limit });
    const items = res.posts || res.contents || [];
    if (!items.length) break;
    all.push(...items);
    if (items.length < limit) break;
    page++;
  }
  return all;
}

async function main() {
  await fs.mkdir(BLOG_DIR, { recursive: true });
  await fs.mkdir(PROJECT_DIR, { recursive: true });

  console.log("📥 Posts Wisp...");
  const postsMeta = await paginate((p) => wisp.getPosts(p));
  console.log(`  ${postsMeta.length} posts trouvés`);
  for (const meta of postsMeta) {
    const slug = meta.slug;
    console.log(`\n→ ${slug}`);
    const { post } = await wisp.getPost(slug);
    if (!post) { console.warn("  ⚠ post introuvable"); continue; }
    const author = post.author?.name || post.metadata?.team?.[0]?.name || "Michaël Bardy";
    await writePostMdx({
      slug,
      title: post.title,
      description: post.description || post.metadata?.summary || "",
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      image: post.image,
      tags: post.tags || [],
      author,
      contentHtml: post.content || "",
      dir: BLOG_DIR,
    });
  }

  console.log("\n📥 Projets Wisp...");
  const projMeta = await paginate((p) => wisp.getContents({ contentTypeSlug: "projects", ...p }));
  console.log(`  ${projMeta.length} projets trouvés`);
  for (const meta of projMeta) {
    const slug = meta.slug || meta.contentSlug;
    console.log(`\n→ ${slug}`);
    const { content: wipContent } = await wisp.getContent({ contentTypeSlug: "projects", contentSlug: slug });
    if (!wipContent) { console.warn("  ⚠ projet introuvable"); continue; }
    const inner = wipContent.content || wipContent; // getContent renvoie {content:{title,image,content(HTML)}}
    const projHtml = inner.content || inner.body || inner.html || "";
    await writePostMdx({
      slug,
      title: inner.title,
      description: inner.description || "",
      publishedAt: inner.publishedAt || wipContent.publishedAt,
      updatedAt: inner.updatedAt || wipContent.updatedAt,
      image: inner.image,
      tags: inner.tags || [],
      author: "Michaël Bardy",
      contentHtml: typeof projHtml === "string" ? projHtml : "",
      dir: PROJECT_DIR,
    });
  }

  console.log("\n✅ Migration terminée.");
  console.log(`   Blog : ${BLOG_DIR}`);
  console.log(`   Projets : ${PROJECT_DIR}`);
  console.log(`   Images : ${PUBLIC_BLOG}`);
}

main().catch((e) => {
  console.error("💥 Erreur migration:", e);
  process.exit(1);
});
