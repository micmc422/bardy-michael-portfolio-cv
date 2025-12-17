"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import type { AccessibilityAnalysis, AnalysisItem } from "@/app/utils/types";
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
                  ♿ {source.label}
                </Text>
              ))}
            </Row>
          </Column>
        )}
      </Column>
    ),
  };
}

export function AccessibilityReport({ results }: { results: AccessibilityAnalysis }) {
  const items: AnalysisItem[] = [
    createDetailedContent(
      results.language,
      [
        { text: "L'attribut lang aide les lecteurs d'écran à prononcer correctement", type: "info" },
        { text: "Affecte aussi la césure automatique des mots", type: "info" },
        { text: "Format ISO 639-1 : fr, en, de, es, etc.", type: "tip" },
        { text: "Peut être appliqué localement : <span lang=\"en\">Hello</span>", type: "tip" },
        { text: "15% des internautes utilisent des technologies d'assistance", type: "info" },
      ],
      [
        { label: "Attribut lang (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang" },
        { label: "Langue (WCAG)", href: "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html" },
        { label: "Codes ISO 639-1", href: "https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1" },
      ]
    ),
    createDetailedContent(
      results.ariaAttributes,
      [
        { text: "ARIA enrichit l'accessibilité des composants interactifs", type: "info" },
        { text: "Première règle ARIA : ne pas utiliser ARIA si HTML natif suffit", type: "warning" },
        { text: "aria-label : nom accessible pour les éléments sans texte visible", type: "tip" },
        { text: "aria-hidden=\"true\" : cache l'élément aux lecteurs d'écran", type: "tip" },
        { text: "role : définit le rôle sémantique (button, dialog, tab...)", type: "info" },
      ],
      [
        { label: "ARIA (MDN)", href: "https://developer.mozilla.org/docs/Web/Accessibility/ARIA" },
        { label: "ARIA Authoring Practices", href: "https://www.w3.org/WAI/ARIA/apg/" },
        { label: "5 règles ARIA", href: "https://www.w3.org/TR/using-aria/" },
      ]
    ),
    createDetailedContent(
      results.formLabels,
      [
        { text: "Chaque champ doit avoir un label explicite", type: "warning" },
        { text: "Le label cliquable augmente la zone de clic (+30%)", type: "info" },
        { text: "Utilisez for=\"id\" pour associer label et input", type: "tip" },
        { text: "aria-label pour les champs avec placeholder uniquement", type: "tip" },
        { text: "aria-describedby pour les messages d'aide/erreur", type: "tip" },
      ],
      [
        { label: "Label (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Element/label" },
        { label: "Formulaires accessibles (WAI)", href: "https://www.w3.org/WAI/tutorials/forms/labels/" },
        { label: "Conception de formulaires", href: "https://www.nngroup.com/articles/form-design-placeholders/" },
      ]
    ),
    createDetailedContent(
      results.altTexts,
      [
        { text: "Alt décrit l'image pour les lecteurs d'écran et le SEO", type: "info" },
        { text: "alt=\"\" (vide) = image décorative, ignorée par les lecteurs", type: "tip" },
        { text: "Décrivez ce que montre l'image, pas son format", type: "tip" },
        { text: "Évitez 'image de...' ou 'photo de...' (redondant)", type: "warning" },
        { text: "Pour les images complexes, utilisez longdesc ou un lien", type: "info" },
      ],
      [
        { label: "Alt text (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Element/img#alt" },
        { label: "Images (WAI)", href: "https://www.w3.org/WAI/tutorials/images/" },
        { label: "Rédiger des alt", href: "https://axesslab.com/alt-texts/" },
      ]
    ),
    createDetailedContent(
      results.landmarks,
      [
        { text: "Les landmarks permettent une navigation rapide au clavier", type: "info" },
        { text: "Éléments HTML5 : header, nav, main, footer, aside, section, article", type: "tip" },
        { text: "Équivalents ARIA : role=\"banner\", role=\"navigation\", role=\"main\"...", type: "info" },
        { text: "Un seul <main> par page", type: "warning" },
        { text: "Les lecteurs d'écran listent les landmarks pour navigation", type: "info" },
      ],
      [
        { label: "Landmarks (WAI)", href: "https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/" },
        { label: "HTML5 sémantique (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Element#content_sectioning" },
        { label: "Structure de page (web.dev)", href: "https://web.dev/learn/html/semantic-html" },
      ]
    ),
  ];

  return (
    <AnalysisCard
      title="Accessibilité"
      icon="users"
      score={results.score}
      items={items}
    />
  );
}
