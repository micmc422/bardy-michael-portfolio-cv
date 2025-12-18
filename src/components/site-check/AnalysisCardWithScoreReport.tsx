"use client";

import { useEffect } from "react";
import { AnalysisCard } from "./AnalysisCard";
import type { AnalysisItem } from "@/app/utils/types";

interface AnalysisCardWithScoreReportProps {
  category: string;
  title: string;
  icon: string;
  score: number;
  items: AnalysisItem[];
}

export function AnalysisCardWithScoreReport({
  category,
  title,
  icon,
  score,
  items,
}: AnalysisCardWithScoreReportProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("analysis-score-update", {
          detail: { category, score },
        })
      );
    }
  }, [category, score]);

  return <AnalysisCard title={title} icon={icon} score={score} items={items} />;
}
