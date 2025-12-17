"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import type { SecurityAnalysis, AnalysisItem } from "@/app/utils/types";
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

export function SecurityReport({ results }: { results: SecurityAnalysis }) {
  const items: AnalysisItem[] = [
    withLinks(results.https, [{ label: "Pourquoi HTTPS", href: "https://web.dev/articles/why-https-matters" }]),
    withLinks(results.hsts, [{ label: "HSTS (MDN)", href: "https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security" }]),
    withLinks(results.csp, [{ label: "CSP (MDN)", href: "https://developer.mozilla.org/docs/Web/HTTP/CSP" }]),
    withLinks(results.xFrameOptions, [{ label: "X-Frame-Options (MDN)", href: "https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options" }]),
    withLinks(results.xContentTypeOptions, [{ label: "X-Content-Type-Options (MDN)", href: "https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options" }]),
    withLinks(results.mixedContent, [{ label: "Contenu mixte (MDN)", href: "https://developer.mozilla.org/docs/Web/Security/Mixed_content" }]),
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
