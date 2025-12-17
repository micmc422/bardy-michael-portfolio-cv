"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import type { SEOAnalysis, AnalysisItem } from "@/app/utils/types";
import { AnalysisCard } from "../../AnalysisCard";

function withLinks(item: AnalysisItem, links: { label: string; href: string }[]): AnalysisItem {
  return {
    ...item,
    contentComponent: (
      <Column gap="s" paddingLeft="l">
        {item.description && (
          <Row gap="xs" vertical="start">
            <Icon name="infoCircle" size="xs" onBackground="neutral-weak" />
            <Text variant="body-default-s" onBackground="neutral-weak">
              {item.description}
            </Text>
          </Row>
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
              <Row gap="xs" wrap>
                {links.map((l) => (
                  <Text
                    key={l.href}
                    as="a"
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    {l.label}
                  </Text>
                ))}
              </Row>
            </Column>
          </Row>
        )}
      </Column>
    ),
  };
}

export function SEOReport({ results }: { results: SEOAnalysis }) {
  const items: AnalysisItem[] = [
    withLinks(results.title, [{ label: "Title (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Element/title" }]),
    withLinks(results.description, [{ label: "Meta description (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Element/meta/name" }]),
    withLinks(results.headings, [{ label: "Headings (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements" }]),
    withLinks(results.images, [{ label: "Images SEO (web.dev)", href: "https://web.dev/learn/image/seo" }]),
    withLinks(results.links, [{ label: "Liens internes (web.dev)", href: "https://web.dev/learn/seo/internal-links" }]),
    withLinks(results.sitemap, [{ label: "Sitemaps (Google)", href: "https://developers.google.com/search/docs/crawling-indexing/sitemaps" }]),
    withLinks(results.robots, [{ label: "robots.txt (Google)", href: "https://developers.google.com/search/docs/crawling-indexing/robots/intro" }]),
    withLinks(results.viewport, [{ label: "Viewport (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag" }]),
    withLinks(results.structuredData, [{ label: "Schema.org (Google)", href: "https://developers.google.com/search/docs/appearance/structured-data" }]),
    withLinks(results.ogTags, [{ label: "Open Graph (ogp.me)", href: "https://ogp.me/" }]),
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
