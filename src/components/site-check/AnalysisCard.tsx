import { Column, Row, Text, Icon, Tag, Heading, type ColorScheme } from "@once-ui-system/core";
import type { AnalysisItem, AnalysisStatus } from "@/app/utils/types";

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

// Format value for display - French labels for consistency with rest of codebase
function formatValue(value: string | number | boolean): string {
  if (typeof value === "boolean") {
    return value ? "Oui" : "Non";
  }
  return String(value);
}

export function AnalysisCard({ title, icon, score, items }: AnalysisCardProps) {
  const scoreColor = getScoreColor(score);

  return (
    <Column
      padding="l"
      gap="m"
      background="surface"
      radius="l"
      border="neutral-alpha-weak"
      fillWidth
    >
      <Row gap="m" vertical="center" horizontal="between" fillWidth>
        <Row gap="s" vertical="center">
          <Icon name={icon} onBackground="accent-weak" />
          <Heading as="h2" variant="heading-strong-m">{title}</Heading>
        </Row>
        <Tag variant="neutral" size="l" label={`${score}/100`} onBackground={`${scoreColor}-weak`} />
      </Row>

      <Column gap="s" fillWidth>
        {items.map((item, index) => (
          <AnalysisItemRow key={index} item={item} />
        ))}
      </Column>
    </Column>
  );
}

interface AnalysisItemRowProps {
  item: AnalysisItem;
}

function AnalysisItemRow({ item }: AnalysisItemRowProps) {
  const statusColor = getStatusColor(item.status);
  const statusIcon = getStatusIcon(item.status);

  return (
    <Row
      gap="m"
      vertical="center"
      padding="s"
      radius="m"
      fillWidth
      background="page"
    >
      <Icon
        name={statusIcon}
        size="s"
        onBackground={`${statusColor}-weak`}
      />
      <Column flex={1} gap="2">
        <Row gap="s" vertical="center" horizontal="between" fillWidth>
          <Text variant="label-default-s">{item.label}</Text>
          <Text variant="body-default-s" onBackground={`${statusColor}-weak`}>
            {formatValue(item.value)}
          </Text>
        </Row>
        {item.description && (
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {item.description}
          </Text>
        )}
      </Column>
    </Row>
  );
}
