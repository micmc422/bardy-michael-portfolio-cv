/**
 * Synchronise les assets du contenu (sous-module `bardy-michael-content`)
 * vers le dossier `public/` du site, avant dev/build.
 *
 * Le sous-module est monté dans `content/` ; il expose à sa racine :
 *   - `blog/<slug>/...`  -> images de couverture (à copier dans public/blog)
 *   - `content/blog`     -> markdown des articles (lu directement par githubContent.ts)
 *   - `content/projects` -> markdown des projets (lu directement par githubContent.ts)
 *
 * Seules les images de `content/blog/<slug>` sont copiées vers `public/blog/<slug>`
 * (Next.js ne sert que `public/` en statique). Le markdown reste dans le sous-module.
 *
 * Idempotent : recrée public/blog à chaque exécution (dossier ignoré par git).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "content", "blog"); // racine images du sous-module
const DEST = path.join(ROOT, "public", "blog");

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

try {
  if (!fs.existsSync(SRC)) {
    console.warn(`⚠ sync-content: source introuvable (${SRC}). Sous-module 'content' non initialisé ?`);
    process.exit(0);
  }
  fs.rmSync(DEST, { recursive: true, force: true });
  copyDirRecursive(SRC, DEST);
  const slugs = fs.readdirSync(DEST).filter((n) =>
    fs.statSync(path.join(DEST, n)).isDirectory()
  );
  console.log(`✅ sync-content: ${slugs.length} dossier(s) d'images copié(s) -> public/blog`);
} catch (e) {
  console.error("❌ sync-content a échoué:", e.message);
  process.exit(1);
}
