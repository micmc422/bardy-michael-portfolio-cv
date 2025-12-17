"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import type { SEOAnalysis, AnalysisItem } from "@/app/utils/types";
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

export function SEOReport({ results }: { results: SEOAnalysis }) {
  const items: AnalysisItem[] = [
    createDetailedContent(
      results.title,
      [
        { text: "Le title apparaît dans l'onglet du navigateur et les résultats Google", type: "info" },
        { text: "Longueur optimale : 50-60 caractères (Google tronque au-delà)", type: "tip" },
        { text: "Incluez votre mot-clé principal au début du titre", type: "tip" },
        { text: "Chaque page doit avoir un titre unique", type: "warning" },
        { text: "Un bon titre augmente le CTR (taux de clic) de 20-30%", type: "info" },
      ],
      [
        { label: "Guide Title (Google)", href: "https://developers.google.com/search/docs/appearance/title-link" },
        { label: "Balise title (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Element/title" },
        { label: "Outil SERP Preview", href: "https://www.seobility.net/en/serp-snippet-generator/" },
      ]
    ),
    createDetailedContent(
      results.description,
      [
        { text: "La meta description apparaît sous le titre dans les résultats Google", type: "info" },
        { text: "Longueur optimale : 150-160 caractères", type: "tip" },
        { text: "Incluez un appel à l'action (CTA) pour inciter au clic", type: "tip" },
        { text: "Google peut remplacer votre description par un extrait de la page", type: "warning" },
        { text: "N'affecte pas directement le classement mais impacte le CTR", type: "info" },
      ],
      [
        { label: "Meta Description (Google)", href: "https://developers.google.com/search/docs/appearance/snippet" },
        { label: "Balise meta (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Element/meta/name" },
      ]
    ),
    createDetailedContent(
      results.headings,
      [
        { text: "Un seul H1 par page : le titre principal de votre contenu", type: "warning" },
        { text: "Hiérarchie logique : H1 > H2 > H3 (pas de saut de niveau)", type: "tip" },
        { text: "Les titres aident Google à comprendre la structure de votre page", type: "info" },
        { text: "Utilisez des mots-clés pertinents dans vos titres", type: "tip" },
        { text: "Les lecteurs d'écran utilisent les titres pour la navigation", type: "info" },
      ],
      [
        { label: "Headings (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements" },
        { label: "Structure de page (web.dev)", href: "https://web.dev/learn/html/headings-and-sections" },
        { label: "SEO des titres (Moz)", href: "https://moz.com/learn/seo/title-tag" },
      ]
    ),
    createDetailedContent(
      results.images,
      [
        { text: "L'attribut alt décrit l'image pour les lecteurs d'écran", type: "info" },
        { text: "Google Images utilise l'alt pour indexer vos images", type: "info" },
        { text: "Alt vide (alt=\"\") = image décorative, OK pour le SEO", type: "tip" },
        { text: "Incluez des mots-clés naturellement dans les alt", type: "tip" },
        { text: "Nommez vos fichiers images de façon descriptive (ex: logo-entreprise.png)", type: "tip" },
      ],
      [
        { label: "Images SEO (web.dev)", href: "https://web.dev/learn/images" },
        { label: "Alt text (WCAG)", href: "https://www.w3.org/WAI/tutorials/images/" },
        { label: "Google Images (Google)", href: "https://developers.google.com/search/docs/appearance/google-images" },
      ]
    ),
    createDetailedContent(
      results.links,
      [
        { text: "Les liens internes distribuent l'autorité SEO entre vos pages", type: "info" },
        { text: "Utilisez des ancres descriptives (pas \"cliquez ici\")", type: "tip" },
        { text: "Recommandation : 5-10 liens internes minimum par page", type: "tip" },
        { text: "Vérifiez régulièrement les liens cassés (404)", type: "warning" },
        { text: "Les liens externes vers des sources fiables sont bénéfiques", type: "info" },
      ],
      [
        { label: "Liens internes (Google)", href: "https://developers.google.com/search/docs/crawling-indexing/links-crawlable" },
        { label: "Maillage interne (Moz)", href: "https://moz.com/learn/seo/internal-link" },
      ]
    ),
    createDetailedContent(
      results.sitemap,
      [
        { text: "Le sitemap liste toutes les pages à indexer", type: "info" },
        { text: "Format XML standard, généré automatiquement par la plupart des CMS", type: "info" },
        { text: "Soumettez-le dans Google Search Console", type: "tip" },
        { text: "Mettez à jour le sitemap quand vous ajoutez/supprimez des pages", type: "tip" },
        { text: "Incluez les dates de modification (lastmod)", type: "tip" },
      ],
      [
        { label: "Sitemaps (Google)", href: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview" },
        { label: "Générateur sitemap", href: "https://www.xml-sitemaps.com/" },
        { label: "Search Console", href: "https://search.google.com/search-console/" },
      ]
    ),
    createDetailedContent(
      results.robots,
      [
        { text: "robots.txt contrôle l'accès des robots aux ressources", type: "info" },
        { text: "Placez-le à la racine : https://example.com/robots.txt", type: "tip" },
        { text: "Incluez l'URL de votre sitemap dans robots.txt", type: "tip" },
        { text: "Attention : Disallow ne supprime pas une page de Google", type: "warning" },
        { text: "Testez votre robots.txt dans Search Console", type: "tip" },
      ],
      [
        { label: "robots.txt (Google)", href: "https://developers.google.com/search/docs/crawling-indexing/robots/intro" },
        { label: "Testeur robots.txt", href: "https://en.ryte.com/free-tools/robots-txt/" },
      ]
    ),
    createDetailedContent(
      results.viewport,
      [
        { text: "Obligatoire pour un affichage correct sur mobile", type: "warning" },
        { text: "Google utilise l'index mobile-first depuis 2021", type: "info" },
        { text: "Configuration standard : width=device-width, initial-scale=1", type: "tip" },
        { text: "Ne bloquez pas le zoom utilisateur (maximum-scale=1)", type: "warning" },
      ],
      [
        { label: "Viewport (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag" },
        { label: "Mobile-First (Google)", href: "https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing" },
      ]
    ),
    createDetailedContent(
      results.structuredData,
      [
        { text: "Schema.org permet d'obtenir des résultats enrichis (étoiles, prix, FAQ...)", type: "info" },
        { text: "Format recommandé : JSON-LD (plus simple à maintenir)", type: "tip" },
        { text: "Types courants : LocalBusiness, Product, Article, FAQPage", type: "info" },
        { text: "Testez avec l'outil de test de Google", type: "tip" },
        { text: "Les résultats enrichis peuvent augmenter le CTR de 30%", type: "info" },
      ],
      [
        { label: "Données structurées (Google)", href: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" },
        { label: "Schema.org", href: "https://schema.org/" },
        { label: "Test Rich Results", href: "https://search.google.com/test/rich-results" },
      ]
    ),
    createDetailedContent(
      results.ogTags,
      [
        { text: "Open Graph contrôle l'aperçu lors du partage sur Facebook/LinkedIn", type: "info" },
        { text: "Balises essentielles : og:title, og:description, og:image", type: "tip" },
        { text: "Image recommandée : 1200x630 pixels", type: "tip" },
        { text: "Twitter Cards : utilisez twitter:card, twitter:image", type: "info" },
        { text: "Testez l'aperçu avec les outils de debug des réseaux sociaux", type: "tip" },
      ],
      [
        { label: "Open Graph Protocol", href: "https://ogp.me/" },
        { label: "Facebook Debugger", href: "https://developers.facebook.com/tools/debug/" },
        { label: "Twitter Card Validator", href: "https://cards-dev.twitter.com/validator" },
        { label: "LinkedIn Post Inspector", href: "https://www.linkedin.com/post-inspector/" },
      ]
    ),
  ];

  return (
    <AnalysisCard
      title="SEO"
      icon="search"
      score={results.score}
      items={items}
    />
  );
}
