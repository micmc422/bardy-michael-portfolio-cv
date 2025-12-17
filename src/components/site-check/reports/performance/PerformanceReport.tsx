"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import type { PerformanceAnalysis, AnalysisItem } from "@/app/utils/types";
import { AnalysisCard } from "../../AnalysisCard";

interface SourceLink {
  label: string;
  href: string;
}

interface DetailItem {
  text: string;
  type?: "info" | "warning" | "tip";
}

function createDetailedContent(
  item: AnalysisItem,
  details: DetailItem[],
  sources: SourceLink[]
): AnalysisItem {
  return {
    ...item,
    contentComponent: (
      <Column gap="m" paddingLeft="l">
        {/* Description */}
        {item.description && (
          <Row gap="xs" vertical="start">
            <Icon name="infoCircle" size="xs" onBackground="neutral-weak" />
            <Text variant="body-default-s" onBackground="neutral-weak">
              {item.description}
            </Text>
          </Row>
        )}

        {/* Detailed Points */}
        {details.length > 0 && (
          <Column gap="xs" padding="s" radius="s" background="neutral-alpha-weak">
            <Text variant="label-default-xs" onBackground="neutral-strong">Détails</Text>
            <Column as="ul" gap="2" style={{ paddingLeft: "1rem", margin: 0 }}>
              {details.map((detail, i) => (
                <Text
                  key={i}
                  as="li"
                  variant="body-default-xs"
                  onBackground={detail.type === "warning" ? "warning-weak" : detail.type === "tip" ? "success-weak" : "neutral-weak"}
                >
                  {detail.text}
                </Text>
              ))}
            </Column>
          </Column>
        )}

        {/* Impact */}
        {item.impact && (
          <Row gap="xs" vertical="start" padding="s" radius="s" background="danger-alpha-weak">
            <Icon name="warningTriangle" size="xs" onBackground="danger-weak" />
            <Column gap="2">
              <Text variant="label-default-xs" onBackground="danger-weak">Impact</Text>
              <Text variant="body-default-s">{item.impact}</Text>
            </Column>
          </Row>
        )}

        {/* Recommendation */}
        {item.recommendation && (
          <Row gap="xs" vertical="start" padding="s" radius="s" background="success-alpha-weak">
            <Icon name="lightbulb" size="xs" onBackground="success-weak" />
            <Column gap="2">
              <Text variant="label-default-xs" onBackground="success-weak">Recommandation</Text>
              <Text variant="body-default-s">{item.recommendation}</Text>
            </Column>
          </Row>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <Column gap="xs">
            <Text variant="label-default-xs" onBackground="neutral-weak">Sources & Documentation</Text>
            <Row gap="s" wrap>
              {sources.map((source) => (
                <Text
                  key={source.href}
                  as="a"
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body-default-xs"
                  onBackground="accent-weak"
                  style={{ textDecoration: "underline" }}
                >
                  📖 {source.label}
                </Text>
              ))}
            </Row>
          </Column>
        )}
      </Column>
    ),
  };
}

export function PerformanceReport({ results }: { results: PerformanceAnalysis }) {
  const items: AnalysisItem[] = [
    createDetailedContent(
      results.loadTime,
      [
        { text: "Temps de réponse serveur (TTFB) : mesure la rapidité du serveur", type: "info" },
        { text: "First Contentful Paint (FCP) : premier affichage visible", type: "info" },
        { text: "Largest Contentful Paint (LCP) : élément principal affiché", type: "info" },
        { text: "Objectif Google : LCP < 2.5s pour un bon score Core Web Vitals", type: "tip" },
        { text: "53% des utilisateurs quittent une page qui met plus de 3s à charger (source: Google)", type: "warning" },
      ],
      [
        { label: "Core Web Vitals (web.dev)", href: "https://web.dev/articles/vitals" },
        { label: "Mesurer les performances (MDN)", href: "https://developer.mozilla.org/docs/Web/Performance" },
        { label: "PageSpeed Insights", href: "https://pagespeed.web.dev/" },
      ]
    ),
    createDetailedContent(
      results.pageSize,
      [
        { text: `HTML: ${Math.round(results.resources.html / 1024)} KB`, type: "info" },
        { text: `CSS: ${results.resources.css} fichier(s)`, type: "info" },
        { text: `JavaScript: ${results.resources.js} fichier(s)`, type: "info" },
        { text: `Images: ${results.resources.images} fichier(s)`, type: "info" },
        { text: `Fonts: ${results.resources.fonts} police(s)`, type: "info" },
        { text: "Taille idéale d'une page : < 500 KB pour une expérience optimale", type: "tip" },
        { text: "Les images représentent souvent 60-70% du poids total", type: "warning" },
      ],
      [
        { label: "Optimiser les ressources (web.dev)", href: "https://web.dev/learn/performance/optimize-resource-delivery" },
        { label: "Compression d'images", href: "https://squoosh.app/" },
        { label: "Bundlephobia (taille packages JS)", href: "https://bundlephobia.com/" },
      ]
    ),
    createDetailedContent(
      results.requestCount,
      [
        { text: "Chaque requête HTTP ajoute de la latence (DNS, TCP, TLS)", type: "info" },
        { text: "HTTP/2 multiplex les requêtes mais le bundling reste utile", type: "info" },
        { text: "Recommandation : < 30 requêtes pour le chargement initial", type: "tip" },
        { text: "Utilisez le lazy loading pour les ressources non critiques", type: "tip" },
      ],
      [
        { label: "Réduire les requêtes (web.dev)", href: "https://web.dev/articles/reduce-network-payloads-using-text-compression" },
        { label: "HTTP/2 (MDN)", href: "https://developer.mozilla.org/docs/Glossary/HTTP_2" },
        { label: "Lazy Loading (web.dev)", href: "https://web.dev/articles/lazy-loading" },
      ]
    ),
    createDetailedContent(
      results.compression,
      [
        { text: "Gzip : réduction de 70-90% pour fichiers texte (HTML, CSS, JS)", type: "info" },
        { text: "Brotli : 15-25% plus efficace que Gzip (supporté par tous navigateurs modernes)", type: "info" },
        { text: "La compression est configurée côté serveur (Apache, Nginx, CDN)", type: "tip" },
        { text: "Vérifiez l'en-tête Content-Encoding dans les DevTools", type: "tip" },
      ],
      [
        { label: "Content-Encoding (MDN)", href: "https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding" },
        { label: "Activer Gzip/Brotli", href: "https://web.dev/articles/reduce-network-payloads-using-text-compression" },
        { label: "Test de compression", href: "https://www.giftofspeed.com/gzip-test/" },
      ]
    ),
  ];

  return (
    <AnalysisCard
      title="Performance"
      icon="zap"
      score={results.score}
      items={items}
    />
  );
}
