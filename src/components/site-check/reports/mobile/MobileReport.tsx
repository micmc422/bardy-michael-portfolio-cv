"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import type { MobileAnalysis, AnalysisItem } from "@/app/utils/types";
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

export function MobileReport({ results }: { results: MobileAnalysis }) {
  const items: AnalysisItem[] = [
    withLinks(results.viewport, [{ label: "Viewport (MDN)", href: "https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag" }]),
    withLinks(results.responsiveDesign, [{ label: "Responsive design (web.dev)", href: "https://web.dev/learn/design/responsive-web-design" }]),
    withLinks(results.touchTargets, [{ label: "Tailles des cibles tactiles (Material)", href: "https://m3.material.io/foundations/accessible-design/overview#dadbf7cf-8064-4a01-b5a0-a4f84ea7c9e6" }]),
    withLinks(results.fontSizes, [{ label: "Taille de police (WCAG)", href: "https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#text-spacing" }]),
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
