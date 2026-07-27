"use client";

import { useTheme } from "@once-ui-system/core";
import { useEffect, useRef } from "react";

/**
 * Commentaires 100 % GitHub via Giscus (Discussions GitHub).
 * Aucun SaaS externe. Nécessite :
 *  - Discussions activées sur le repo GitHub
 *  - L'app Giscus installée sur le repo
 *  - data-repo-id et data-category-id récupérés sur https://giscus.app
 *    (à renseigner ci-dessous, ou via les variables d'env GISCUS_REPO_ID / GISCUS_CATEGORY_ID).
 */
const GISCUS_REPO = "micmc422/bardy-michael-portfolio-cv";
const GISCUS_REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "REPO_ID_A_REMPLACER";
const GISCUS_CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "CATEGORY_ID_A_REMPLACER";

interface CommentSectionProps {
  slug: string;
  comments?: unknown[];
}

export default function CommentSection({ slug }: CommentSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const resolved = theme === "dark" ? "dark" : "light";
  const themeAttr = resolved;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", GISCUS_REPO);
    script.setAttribute("data-repo-id", GISCUS_REPO_ID);
    script.setAttribute("data-category", "Commentaires");
    script.setAttribute("data-category-id", GISCUS_CATEGORY_ID);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", themeAttr);
    script.setAttribute("data-lang", "fr");
    script.setAttribute("data-loading", "lazy");
    container.appendChild(script);

    // Met à jour le thème si le mode change
    const sendTheme = (t: string) => {
      window.postMessage({ giscus: { setConfig: { theme: t } } }, "*");
    };
    return () => sendTheme(themeAttr);
  }, [themeAttr, slug]);

  // Re-configure le thème au changement
  useEffect(() => {
    const t = themeAttr;
    const id = setInterval(() => {
      window.postMessage({ giscus: { setConfig: { theme: t } } }, "*");
    }, 300);
    return () => clearInterval(id);
  }, [themeAttr]);

  return (
    <section style={{ marginTop: "2rem", minHeight: 200 }} aria-label="Commentaires">
      <div ref={ref} />
    </section>
  );
}
