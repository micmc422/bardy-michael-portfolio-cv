"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import type { SecurityAnalysis, AnalysisItem } from "@/app/utils/types";
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
        {item.description && (
          <Row gap="xs" vertical="start">
            <Icon name="infoCircle" size="xs" onBackground="neutral-weak" />
            <Text variant="body-default-s" onBackground="neutral-weak">
              {item.description}
            </Text>
          </Row>
        )}

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

        {item.impact && (
          <Row gap="xs" vertical="start" padding="s" radius="s" background="danger-alpha-weak">
            <Icon name="warningTriangle" size="xs" onBackground="danger-weak" />
            <Column gap="2">
              <Text variant="label-default-xs" onBackground="danger-weak">Impact</Text>
              <Text variant="body-default-s">{item.impact}</Text>
            </Column>
          </Row>
        )}

        {item.recommendation && (
          <Row gap="xs" vertical="start" padding="s" radius="s" background="success-alpha-weak">
            <Icon name="lightbulb" size="xs" onBackground="success-weak" />
            <Column gap="2">
              <Text variant="label-default-xs" onBackground="success-weak">Recommandation</Text>
              <Text variant="body-default-s">{item.recommendation}</Text>
            </Column>
          </Row>
        )}

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
                  🔒 {source.label}
                </Text>
              ))}
            </Row>
          </Column>
        )}
      </Column>
    ),
  };
}

export function SecurityReport({ results }: { results: SecurityAnalysis }) {
  const items: AnalysisItem[] = [
    createDetailedContent(
      results.https,
      [
        { text: "HTTPS chiffre toutes les données entre le navigateur et le serveur", type: "info" },
        { text: "Certificat SSL/TLS gratuit avec Let's Encrypt", type: "tip" },
        { text: "Google classe mieux les sites HTTPS depuis 2014", type: "info" },
        { text: "Les navigateurs affichent 'Non sécurisé' sans HTTPS", type: "warning" },
        { text: "Obligatoire pour les formulaires et les paiements", type: "warning" },
      ],
      [
        { label: "Pourquoi HTTPS (web.dev)", href: "https://web.dev/articles/why-https-matters" },
        { label: "Let's Encrypt", href: "https://letsencrypt.org/" },
        { label: "SSL Labs Test", href: "https://www.ssllabs.com/ssltest/" },
      ]
    ),
    createDetailedContent(
      results.hsts,
      [
        { text: "HSTS force les navigateurs à utiliser HTTPS automatiquement", type: "info" },
        { text: "Protège contre les attaques de type 'downgrade'", type: "info" },
        { text: "max-age recommandé : 31536000 (1 an minimum)", type: "tip" },
        { text: "includeSubDomains : protège aussi les sous-domaines", type: "tip" },
        { text: "preload : inscription sur la liste HSTS préchargée de Chrome", type: "info" },
      ],
      [
        { label: "HSTS (MDN)", href: "https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security" },
        { label: "HSTS Preload List", href: "https://hstspreload.org/" },
        { label: "Test HSTS", href: "https://securityheaders.com/" },
      ]
    ),
    createDetailedContent(
      results.csp,
      [
        { text: "CSP empêche l'exécution de scripts malveillants (XSS)", type: "info" },
        { text: "Définit les sources autorisées pour scripts, styles, images, etc.", type: "info" },
        { text: "Commencez par Content-Security-Policy-Report-Only pour tester", type: "tip" },
        { text: "Évitez 'unsafe-inline' et 'unsafe-eval' si possible", type: "warning" },
        { text: "Utilisez des nonces ou hashes pour les scripts inline", type: "tip" },
      ],
      [
        { label: "CSP (MDN)", href: "https://developer.mozilla.org/docs/Web/HTTP/CSP" },
        { label: "CSP Evaluator (Google)", href: "https://csp-evaluator.withgoogle.com/" },
        { label: "Report URI", href: "https://report-uri.com/" },
      ]
    ),
    createDetailedContent(
      results.xFrameOptions,
      [
        { text: "Empêche votre site d'être intégré dans des iframes tierces", type: "info" },
        { text: "Protège contre les attaques de clickjacking", type: "info" },
        { text: "DENY : interdit complètement l'intégration en iframe", type: "tip" },
        { text: "SAMEORIGIN : autorise uniquement votre propre domaine", type: "tip" },
        { text: "Préférez CSP frame-ancestors pour plus de flexibilité", type: "info" },
      ],
      [
        { label: "X-Frame-Options (MDN)", href: "https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options" },
        { label: "Clickjacking (OWASP)", href: "https://owasp.org/www-community/attacks/Clickjacking" },
      ]
    ),
    createDetailedContent(
      results.xContentTypeOptions,
      [
        { text: "Empêche le navigateur de deviner le type MIME", type: "info" },
        { text: "Protège contre les attaques MIME sniffing", type: "info" },
        { text: "Valeur unique : nosniff", type: "tip" },
        { text: "Simple à implémenter, aucun effet secondaire", type: "tip" },
        { text: "Recommandé par tous les guides de sécurité", type: "info" },
      ],
      [
        { label: "X-Content-Type-Options (MDN)", href: "https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options" },
        { label: "MIME Sniffing (OWASP)", href: "https://owasp.org/www-project-secure-headers/" },
      ]
    ),
    createDetailedContent(
      results.mixedContent,
      [
        { text: "Le contenu mixte = ressources HTTP sur une page HTTPS", type: "info" },
        { text: "Les navigateurs bloquent les scripts et iframes HTTP", type: "warning" },
        { text: "Les images HTTP sont chargées mais avec avertissement", type: "warning" },
        { text: "Utilisez des URLs relatives ou protocol-relative (//)", type: "tip" },
        { text: "CSP upgrade-insecure-requests peut aider temporairement", type: "tip" },
      ],
      [
        { label: "Contenu mixte (MDN)", href: "https://developer.mozilla.org/docs/Web/Security/Mixed_content" },
        { label: "Mixed Content (web.dev)", href: "https://web.dev/articles/what-is-mixed-content" },
        { label: "Why No HTTPS?", href: "https://whynohttps.com/" },
      ]
    ),
  ];

  return (
    <AnalysisCard
      title="Sécurité"
      icon="shield"
      score={results.score}
      items={items}
    />
  );
}
