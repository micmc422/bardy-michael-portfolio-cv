"use client";

import { Column, Row, Text, Heading } from "@once-ui-system/core";

interface OverallScoreProps {
  scores: {
    performance?: number;
    seo?: number;
    security?: number;
    accessibility?: number;
    mobile?: number;
  };
}

function getOverallColor(score: number): string {
  if (score >= 80) return "var(--success-solid-strong)";
  if (score >= 50) return "var(--warning-solid-strong)";
  return "var(--danger-solid-strong)";
}

function getOverallLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bon";
  if (score >= 40) return "À améliorer";
  return "Critique";
}

export function OverallScore({ scores }: OverallScoreProps) {
  const validScores = Object.values(scores).filter((s): s is number => s !== undefined);
  const overallScore = validScores.length > 0
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : 0;

  const categories = [
    { key: "performance", label: "Performance", score: scores.performance },
    { key: "seo", label: "SEO", score: scores.seo },
    { key: "security", label: "Sécurité", score: scores.security },
    { key: "accessibility", label: "Accessibilité", score: scores.accessibility },
    { key: "mobile", label: "Mobile", score: scores.mobile },
  ];

  const size = 200;
  const center = size / 2;
  const radius = 80;
  const angleStep = (2 * Math.PI) / categories.length;
  const startAngle = -Math.PI / 2; // Start from top

  // Generate points for the radar polygon
  const points = categories.map((cat, index) => {
    const angle = startAngle + index * angleStep;
    const value = cat.score ?? 0;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 20) * Math.cos(angle),
      labelY: center + (radius + 20) * Math.sin(angle),
      label: cat.label,
      score: cat.score,
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Generate grid circles
  const gridCircles = [25, 50, 75, 100].map((level) => ({
    r: (level / 100) * radius,
  }));

  // Generate grid lines
  const gridLines = categories.map((_, index) => {
    const angle = startAngle + index * angleStep;
    return {
      x2: center + radius * Math.cos(angle),
      y2: center + radius * Math.sin(angle),
    };
  });

  return (
    <Column
      padding="l"
      gap="m"
      background="surface"
      radius="l"
      border="neutral-alpha-weak"
      fillWidth
      horizontal="center"
    >
      <Row gap="l" vertical="center" fillWidth horizontal="center" wrap>
        {/* Radar Chart */}
        <Column horizontal="center">
          <svg width={size} height={size}>
            {/* Grid circles */}
            {gridCircles.map((circle, i) => (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={circle.r}
                fill="none"
                stroke="var(--neutral-alpha-weak)"
                strokeWidth="1"
              />
            ))}

            {/* Grid lines */}
            {gridLines.map((line, i) => (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={line.x2}
                y2={line.y2}
                stroke="var(--neutral-alpha-weak)"
                strokeWidth="1"
              />
            ))}

            {/* Score polygon */}
            <polygon
              points={polygonPoints}
              fill="var(--accent-alpha-weak)"
              stroke="var(--accent-solid-strong)"
              strokeWidth="2"
              style={{ transition: "all 0.3s ease" }}
            />

            {/* Data points */}
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="var(--accent-solid-strong)"
              />
            ))}
          </svg>
        </Column>

        {/* Score Summary */}
        <Column gap="m" horizontal="center">
          <Column horizontal="center" gap="xs">
            <Text
              variant="display-strong-xl"
              style={{ color: getOverallColor(overallScore) }}
            >
              {overallScore}
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              Score global
            </Text>
            <Heading
              as="span"
              variant="heading-strong-s"
              style={{ color: getOverallColor(overallScore) }}
            >
              {getOverallLabel(overallScore)}
            </Heading>
          </Column>

          <Column gap="xs">
            {categories.map((cat) => (
              <Row key={cat.key} gap="m" vertical="center" horizontal="between" minWidth={10}>
                <Text variant="body-default-s">{cat.label}</Text>
                <Text
                  variant="label-strong-s"
                  style={{ color: cat.score !== undefined ? getOverallColor(cat.score) : "var(--neutral-weak)" }}
                >
                  {cat.score !== undefined ? `${cat.score}/100` : "..."}
                </Text>
              </Row>
            ))}
          </Column>
        </Column>
      </Row>
    </Column>
  );
}
