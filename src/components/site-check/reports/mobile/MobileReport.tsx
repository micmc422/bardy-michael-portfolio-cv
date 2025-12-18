"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import type { MobileAnalysis, AnalysisItem } from "@/app/utils/types";
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
                  📱 {source.label}
                </Text>
              ))}
            </Row>
          </Column>
        )}
      </Column>
    ),
  };
}

export function MobileReport({ results }: { results: MobileAnalysis }) {
  const items: AnalysisItem[] = [
    createDetailedContent(
      results.viewport,
      [
        { text: "60% du trafic web mondial provient des mobiles (Statcounter 2024)", type: "info" },
        { text: "width=device-width : adapte la largeur à l'écran", type: "tip" },
        { text: "initial-scale=1 : zoom initial normal", type: "tip" },
        { text: "user-scalable=no est déconseillé (problème accessibilité)", type: "warning" },
        { text: "Google utilise le mobile-first indexing depuis 2021", type: "info" },
      ],
      [
        { label: "Viewport (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag" },
        { label: "Mobile-First (Google)", href: "https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing" },
        { label: "Test mobile (Google)", href: "https://search.google.com/test/mobile-friendly" },
      ]
    ),
    createDetailedContent(
      results.responsiveDesign,
      [
        { text: "Media queries : adaptent le CSS selon la taille d'écran", type: "info" },
        { text: "Flexbox/Grid : créent des mises en page fluides", type: "info" },
        { text: "Breakpoints courants : 576px, 768px, 992px, 1200px", type: "tip" },
        { text: "Mobile-first : commencez par les styles mobile", type: "tip" },
        { text: "Évitez les largeurs fixes (px), préférez %, vw, rem", type: "warning" },
      ],
      [
        { label: "Responsive Design (web.dev)", href: "https://web.dev/learn/design/responsive-web-design" },
        { label: "Media Queries (MDN)", href: "https://developer.mozilla.org/docs/Web/CSS/CSS_media_queries/Using_media_queries" },
        { label: "Flexbox (CSS-Tricks)", href: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
        { label: "Grid (CSS-Tricks)", href: "https://css-tricks.com/snippets/css/complete-guide-grid/" },
      ]
    ),
    createDetailedContent(
      results.touchTargets,
      [
        { text: "Taille minimum recommandée : 48x48px (WCAG/Google)", type: "warning" },
        { text: "Apple recommande 44x44 points (88x88px sur écrans Retina)", type: "info" },
        { text: "Espacement entre cibles : au moins 8px", type: "tip" },
        { text: "Les liens texte trop proches sont difficiles à toucher", type: "warning" },
        { text: "Pensez au 'fat finger' : les pouces sont imprécis", type: "info" },
      ],
      [
        { label: "Touch Targets (Material)", href: "https://m3.material.io/foundations/accessible-design/overview" },
        { label: "Target Size (WCAG 2.2)", href: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" },
        { label: "Human Interface (Apple)", href: "https://developer.apple.com/design/human-interface-guidelines/buttons" },
      ]
    ),
    createDetailedContent(
      results.fontSizes,
      [
        { text: "Taille de base recommandée : 16px minimum", type: "tip" },
        { text: "Utilisez rem/em pour les tailles relatives", type: "tip" },
        { text: "Hauteur de ligne : 1.5 pour une bonne lisibilité", type: "info" },
        { text: "Contrastes : ratio minimum 4.5:1 (WCAG AA)", type: "warning" },
        { text: "Évitez les polices légères (< 400) sur mobile", type: "tip" },
      ],
      [
        { label: "Typographie (web.dev)", href: "https://web.dev/learn/design/typography" },
        { label: "Text Spacing (WCAG)", href: "https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html" },
        { label: "Contrast Checker", href: "https://webaim.org/resources/contrastchecker/" },
        { label: "Fluid Typography", href: "https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/" },
      ]
    ),
  ];

  return (
    <AnalysisCard
      title="Mobile"
      icon="mobile"
      score={results.score}
      items={items}
    />
  );
}
