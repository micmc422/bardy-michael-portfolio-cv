"use client";

import { Column, Row, Text, Icon, Heading, AccordionGroup, type ColorScheme } from "@once-ui-system/core";
import type { AnalysisItem, AnalysisStatus } from "@/app/utils/types";
import { ScoreGauge } from "./ScoreGauge";

interface AnalysisCardProps {
  title: string;
  icon: string;
  score: number;
  items: AnalysisItem[];
}

function getStatusColor(status: AnalysisStatus): ColorScheme {
  switch (status) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "error":
      return "danger";
    default:
      return "neutral";
  }
}

function getStatusIcon(status: AnalysisStatus): string {
  switch (status) {
    case "success":
      return "checkCircle";
    case "warning":
      return "warningTriangle";
    case "error":
      return "errorCircle";
    default:
      return "infoCircle";
  }
}

function getScoreColor(score: number): ColorScheme {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bon";
  if (score >= 40) return "À améliorer";
  return "Critique";
}

// Format value for display - French labels for consistency with rest of codebase
function formatValue(value: string | number | boolean): string {
  if (typeof value === "boolean") {
    return value ? "Oui" : "Non";
  }
  return String(value);
}

export function AnalysisCard({ title, icon, score, items }: AnalysisCardProps) {
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  // Transform items into accordion format
  const accordionItems = items.map((item) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);
    
    return {
      title: (
        <Row gap="s" vertical="center" fillWidth>
          <Icon name={statusIcon} size="s" onBackground={`${statusColor}-weak`} />
          <Text variant="label-default-s">{item.label}</Text>
          {item.valueComponent ? (
            <Row style={{ marginLeft: "auto" }}>{item.valueComponent}</Row>
          ) : (
            <Text variant="body-default-xs" onBackground={`${statusColor}-weak`} style={{ marginLeft: "auto" }}>
              {formatValue(item.value)}
            </Text>
          )}
        </Row>
      ),
      content: item.contentComponent ?? (
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
              </Column>
            </Row>
          )}
        </Column>
      ),
    };
  });

  // Count issues
  const errorCount = items.filter(item => item.status === "error").length;
  const warningCount = items.filter(item => item.status === "warning").length;
  const successCount = items.filter(item => item.status === "success").length;

  return (
    <Column
      padding="l"
      gap="l"
      background="surface"
      radius="l"
      border="neutral-alpha-weak"
      fillWidth
    >
      {/* Header with Score */}
      <Row gap="l" vertical="center" fillWidth s={{ direction: "column" }}>
        {/* Score Gauge */}
        <Column horizontal="center" gap="xs" minWidth={8}>
          <ScoreGauge score={score} color={scoreColor} />
          <Text variant="label-strong-m" onBackground={`${scoreColor}-weak`}>{scoreLabel}</Text>
        </Column>

        {/* Title and Summary */}
        <Column gap="s" flex={1}>
          <Row gap="s" vertical="center">
            <Icon name={icon} size="l" onBackground="accent-weak" />
            <Heading as="h2" variant="heading-strong-l">{title}</Heading>
          </Row>
          
          <Row gap="m" wrap>
            {successCount > 0 && (
              <Row gap="xs" vertical="center">
                <Icon name="checkCircle" size="xs" onBackground="success-weak" />
                <Text variant="body-default-s" onBackground="success-weak">{successCount} OK</Text>
              </Row>
            )}
            {warningCount > 0 && (
              <Row gap="xs" vertical="center">
                <Icon name="warningTriangle" size="xs" onBackground="warning-weak" />
                <Text variant="body-default-s" onBackground="warning-weak">{warningCount} attention</Text>
              </Row>
            )}
            {errorCount > 0 && (
              <Row gap="xs" vertical="center">
                <Icon name="errorCircle" size="xs" onBackground="danger-weak" />
                <Text variant="body-default-s" onBackground="danger-weak">{errorCount} critique{errorCount > 1 ? "s" : ""}</Text>
              </Row>
            )}
          </Row>
        </Column>
      </Row>

      {/* Accordion Items */}
      <AccordionGroup items={accordionItems} />
    </Column>
  );
}
