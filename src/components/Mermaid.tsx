"use client";

import { useEffect, useRef } from "react";

/**
 * Rend un diagramme Mermaid côté client via le CDN mermaid (pas de dépendance npm).
 * Usage MDX : <Mermaid chart={`graph TD; A-->B`} />
 */
let mermaidPromise: Promise<unknown> | null = null;

async function loadMermaid() {
  if (typeof window === "undefined") return null;
  if (mermaidPromise) return mermaidPromise;
  mermaidPromise = new Promise((resolve, reject) => {
    const id = "mermaid-cdn";
    if (document.getElementById(id)) {
      // déjà chargé
      // @ts-expect-error global injecté
      return resolve(window.mermaid);
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    s.async = true;
    s.onload = () => {
      // @ts-expect-error global injecté
      const m = window.mermaid;
      m.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" });
      resolve(m);
    };
    s.onerror = () => reject(new Error("Échec chargement Mermaid CDN"));
    document.head.appendChild(s);
  });
  return mermaidPromise;
}

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadMermaid()
      .then((m: any) => {
        if (cancelled || !ref.current || !m) return;
        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        m.render(id, chart)
          .then(({ svg }: { svg: string }) => {
            if (ref.current) ref.current.innerHTML = svg;
          })
          .catch((e: Error) => {
            if (ref.current) ref.current.textContent = `Erreur Mermaid: ${e.message}`;
          });
      })
      .catch((e: Error) => {
        if (ref.current) ref.current.textContent = `Erreur Mermaid: ${e.message}`;
      });
    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <div
      ref={ref}
      style={{
        margin: "1.5rem 0",
        padding: "1rem",
        borderRadius: "var(--radius-m, 12px)",
        border: "1px solid var(--neutral-alpha-medium, #ddd)",
        background: "var(--surface-background, #fff)",
        overflowX: "auto",
      }}
      role="img"
      aria-label="Diagramme Mermaid"
    />
  );
}

export default Mermaid;
