#!/usr/bin/env node
/**
 * VEILLE TECHNOLOGIQUE — exécuté par l'agent Hermes en local (WSL), PAS par un cron serveur.
 *
 * Lit des flux RSS tech pertinents pour l'activité Occitaweb, filtre par pertinence métier,
 * dédupe par URL, et stocke les sujets dans content/ideas.json.
 *
 * Usage : node scripts/tech-watch.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const IDEAS_FILE = path.join(ROOT, "content", "ideas.json");
const MAX_IDEAS = 120;

const FEEDS = [
  "https://nextjs.org/feed.xml",
  "https://vercel.com/atom",
  "https://web.dev/feed.xml",
  "https://developer.mozilla.org/en-US/blog/rss.xml",
  "https://css-tricks.com/feed/",
  "https://www.smashingmagazine.com/feed/",
  "https://dev.to/feed",
  "https://www.reddit.com/r/nextjs/search/.rss?q=nextjs&restrict_sr=1",
  "https://www.reddit.com/r/webdev/search/.rss?q=web&restrict_sr=1",
  "https://github.blog/feed/",
];

const KEYWORDS = [
  "next.js", "nextjs", "react", "typescript", "javascript", "performance",
  "core web vitals", "lighthouse", "seo", "geo", "search", "accessibilité",
  "a11y", "css", "tailwind", "design", "ux", "ui", "image", "webp", "avif",
  "vercel", "edge", "serverless", "ssg", "ssr", "cache", "sécurité", "security",
  "e-commerce", "vitrine", "portfolio", "freelance", "ia", "ai", "llm", "gpt",
  "chatgpt", "perplexity", "schema", "json-ld", "structured data", "mobile",
  "responsive", "framework", "astro", "svelte", "nuxt", "wordpress",
];

function slugifyUrl(url) {
  return url.replace(/[^a-z0-9]/gi, "").toLowerCase();
}
function scoreRelevance(text) {
  const lower = text.toLowerCase();
  return KEYWORDS.filter((k) => lower.includes(k));
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.text();
}

function parseRSSItems(xml) {
  const items = [];
  const titleRe = /<title[^>]*>([\s\S]*?)<\/title>/gi;
  const linkRe = /<link[^>]*>([\s\S]*?)<\/link>/gi;
  const descRe = /<(?:content|description|summary)[^>]*>([\s\S]*?)<\/(?:content|description|summary)>/gi;
  const titles = [];
  const links = [];
  const descs = [];
  let m;
  while ((m = titleRe.exec(xml))) {
    titles.push(m[1].replace(/<[^>]+>/g, "").trim());
  }
  while ((m = linkRe.exec(xml))) {
    links.push(m[1].replace(/<[^>]+>/g, "").trim());
  }
  while ((m = descRe.exec(xml))) {
    descs.push(m[1].replace(/<[^>]+>/g, "").trim().slice(0, 400));
  }
  const len = Math.min(titles.length, links.length);
  for (let i = 0; i < len; i++) {
    items.push({ title: titles[i], link: links[i], contentSnippet: descs[i] || "" });
  }
  return items;
}

async function parseFeed(feed) {
  const xml = await fetchText(feed);
  const items = parseRSSItems(xml);
  const source = (xml.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1]
    ?.replace(/<[^>]+>/g, "").trim() || feed;
  return { source, items };
}

async function main() {
  let existing = [];
  if (fs.existsSync(IDEAS_FILE)) {
    try { existing = JSON.parse(fs.readFileSync(IDEAS_FILE, "utf8")); } catch {}
  }
  const seen = new Set(existing.map((e) => e.url));
  const newIdeas = [];
  let fetched = 0;

  for (const feed of FEEDS) {
    try {
      const { source, items } = await parseFeed(feed);
      for (const item of items) {
        fetched++;
        const title = item.title ?? "";
        const url = item.link ?? "";
        if (!url || seen.has(url)) continue;
        const summary = (item.contentSnippet || "").trim();
        const tags = scoreRelevance(`${title} ${summary}`);
        if (tags.length === 0) continue;
        newIdeas.push({
          id: slugifyUrl(url),
          title,
          url,
          source,
          summary: summary.replace(/\s+/g, " ").trim(),
          tags,
          foundAt: new Date().toISOString(),
          used: false,
        });
        seen.add(url);
      }
      console.log(`✓ ${source}: ${items.length} items`);
    } catch (e) {
      console.error(`⚠️ Flux ignoré ${feed}:`, e.message);
    }
  }

  newIdeas.sort((a, b) => b.tags.length - a.tags.length);
  const merged = [...newIdeas, ...existing]
    .filter((v, i, arr) => arr.findIndex((x) => x.url === v.url) === i)
    .slice(0, MAX_IDEAS);

  fs.mkdirSync(path.dirname(IDEAS_FILE), { recursive: true });
  fs.writeFileSync(IDEAS_FILE, JSON.stringify(merged, null, 2));

  console.log(`\n✅ Veille terminée : ${fetched} items lus, ${newIdeas.length} nouveaux, ${merged.length} total → content/ideas.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
