#!/usr/bin/env node
/**
 * Génère un brouillon d'article de blog planifié (MDX) avec :
 *  - une date de publication calculee (2 articles/semaine, mar. & jeu. 09:00,
 *    3 semaines d'avance minimum, sans collision avec une date existante)
 *  - un frontmatter (titre, description, publishedAt, image, tags, author)
 *  - un corps MDX a remplir (TODO) + emplacement image d'intro.
 *
 * L'image d'introduction est generee par IA (FLUX/FAL) par l'agent Hermes,
 * puis deposee dans public/blog/<slug>/cover.webp.
 *
 * Usage :
 *   node scripts/generate-article.mjs --title "..." --hook "..." --tags "Next.js,SEO" --url "https://..."
 *   node scripts/generate-article.mjs --from-ideas   # prend le 1er sujet de content/ideas.json non utilise
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const PUBLIC_BLOG = path.join(ROOT, "public", "blog");

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const m = argv[i].match(/^--([a-zA-Z-]+)$/);
    if (m) {
      const key = m[1];
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true;
      a[key] = val;
      if (val !== true) i++;
    }
  }
  return a;
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);
}

/** Prochaines dates de publication : mardi & jeudi a 09:00, au moins `minAdvanceDays` dans le futur. */
function nextPublishDates(minAdvanceDays = 21, count = 2) {
  const out = [];
  const now = new Date();
  const minDate = new Date(now.getTime() + minAdvanceDays * 86400000);
  // On part de minDate et on cherche les mar.(2) et jeu.(4) a 09:00
  const cursor = new Date(minDate);
  cursor.setHours(9, 0, 0, 0);
  let guard = 0;
  while (out.length < count && guard < 400) {
    const dow = cursor.getDay();
    if ((dow === 2 || dow === 4) && cursor >= minDate && cursor > now) {
      out.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
    guard++;
  }
  return out;
}

function existingSlugsByDate() {
  if (!fs.existsSync(BLOG_DIR)) return {};
  const map = {};
  for (const f of fs.readdirSync(BLOG_DIR).filter((x) => x.endsWith(".mdx"))) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf8");
    const m = raw.match(/publishedAt:\s*([0-9T:.\-Z]+)/);
    if (m) map[m[1]] = f;
  }
  return map;
}

function pickDate() {
  const taken = existingSlugsByDate();
  for (const d of nextPublishDates(21, 6)) {
    const iso = d.toISOString();
    if (!taken[iso]) return d;
  }
  return nextPublishDates(21, 2)[0];
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  let title, hook, tags, url, source;

  if (args["from-ideas"]) {
    const ideasPath = path.join(ROOT, "content", "ideas.json");
    if (!fs.existsSync(ideasPath)) {
      console.error("❌ content/ideas.json introuvable. Lance d'abord le cron de veille en dev.");
      process.exit(1);
    }
    const ideas = JSON.parse(fs.readFileSync(ideasPath, "utf8"));
    const idea = ideas.find((i) => !i.used) || ideas[0];
    if (!idea) {
      console.error("❌ Aucun sujet de veille disponible.");
      process.exit(1);
    }
    title = idea.title;
    hook = idea.summary;
    tags = idea.tags.slice(0, 4).join(",");
    url = idea.url;
    source = idea.source;
    // marque comme utilise (miroir local dev)
    idea.used = true;
    fs.writeFileSync(ideasPath, JSON.stringify(ideas, null, 2));
  } else {
    title = String(args.title || "");
    hook = String(args.hook || "");
    tags = String(args.tags || "");
    url = String(args.url || "");
    source = String(args.source || "Veille technologique");
  }

  if (!title) {
    console.error("❌ --title requis (ou --from-ideas).");
    process.exit(1);
  }

  const slug = slugify(title);
  const date = pickDate();
  const iso = date.toISOString();
  const tagList = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : ["Web"];
  const imgRel = `/blog/${slug}/cover.webp`;

  const mdx = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ndescription: "${hook.replace(/"/g, '\\"').slice(0, 200)}"\npublishedAt: ${iso}\nupdatedAt: ${iso}\nimage: "${imgRel}"\ntags: [${tagList.map((t) => `"${t}"`).join(", ")}]\nauthor: "michael Bardy"\n---\n\n![${title}](${imgRel})\n\n<!-- TODO: rédiger l'introduction (accroche liée à l'activité Occitaweb :\n     dev web freelance à Albi, Next.js, performance, SEO local). Source : ${url} -->\n\n## Contexte\n\nTODO\n\n## En pratique\n\nTODO (code inline en fence \`\`\`ts ... \`\`\` si pertinent, ou lien raw.githubusercontent)\n\n## Impact pour vos projets web\n\nTODO (mettre en lien avec les services Occitaweb : ${source})\n\n## Conclusion\n\nTODO\n`;

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.mkdirSync(path.join(PUBLIC_BLOG, slug), { recursive: true });
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  fs.writeFileSync(file, mdx);

  console.log("✅ Brouillon créé :", file);
  console.log("   slug      :", slug);
  console.log("   publishAt :", iso, "(dans ~" + Math.round((date - new Date()) / 86400000) + " j)");
  console.log("   image     :", `public${imgRel}`, "(à générer via FAL/FLUX puis déposer ici)");
  console.log("   tags      :", tagList.join(", "));
  console.log("\n→ Rédige le corps, génère l'image, puis commit.");
}

main();
