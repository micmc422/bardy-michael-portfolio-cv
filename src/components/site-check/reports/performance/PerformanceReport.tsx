"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import type { PerformanceAnalysis, AnalysisItem } from "@/app/utils/types";
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

export function PerformanceReport({ results }: { results: PerformanceAnalysis }) {
  const items: AnalysisItem[] = [
    withLinks(results.loadTime, [{ label: "Performance web (web.dev)", href: "https://web.dev/performance-scoring/" }]),
    withLinks(results.pageSize, [{ label: "Poids de page (web.dev)", href: "https://web.dev/learn/performance/optimize-webfont-loading" }]),
    withLinks(results.requestCount, [{ label: "Moins de requêtes (web.dev)", href: "https://web.dev/rail/" }]),
    withLinks(results.compression, [{ label: "Compression (MDN)", href: "https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding" }]),
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
