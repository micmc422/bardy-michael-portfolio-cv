"use client";

import { Column, Text, type ColorScheme } from "@once-ui-system/core";

interface ScoreGaugeProps {
  score: number;
  color: ColorScheme;
  size?: number;
}

export function ScoreGauge({ score, color, size = 100 }: ScoreGaugeProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Half circle
  const progress = (score / 100) * circumference;

  // Get CSS variable for the color
  const getColorVar = (colorScheme: ColorScheme) => {
    switch (colorScheme) {
      case "success":
        return "var(--success-solid-strong)";
      case "warning":
        return "var(--warning-solid-strong)";
      case "danger":
        return "var(--danger-solid-strong)";
      default:
        return "var(--neutral-solid-strong)";
    }
  };

  return (
    <Column center style={{ position: "relative", width: size, height: size / 2 + 20 }}>
      <svg
        width={size}
        height={size / 2 + strokeWidth}
        style={{ transform: "rotate(0deg)" }}
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="var(--neutral-alpha-weak)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={getColorVar(color)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.5s ease-in-out" }}
        />
      </svg>
      <Column
        center
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Text
          variant="display-strong-l"
          onBackground={`${color}-weak`}
          style={{
            textShadow:
              "0 2px 0 var(--page-background), 0 -2px 0 var(--page-background), 2px 0 0 var(--page-background), -2px 0 0 var(--page-background), 0 0 2px var(--page-background)",
          }}
        >
          {score}
        </Text>
        <Text variant="body-default-xs" onBackground="neutral-weak">
          / 100
        </Text>
      </Column>
    </Column>
  );
}
