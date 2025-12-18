"use client";

import { useEffect, useState, type ReactNode } from "react";
import { OverallScore } from "@/components/site-check/OverallScore";

interface AnalysisScoreTrackerProps {
  children: ReactNode;
}

// Custom event types for score updates
declare global {
  interface WindowEventMap {
    "analysis-score-update": CustomEvent<{ category: string; score: number }>;
  }
}

export function AnalysisScoreTracker({ children }: AnalysisScoreTrackerProps) {
  const [scores, setScores] = useState<{
    performance?: number;
    seo?: number;
    security?: number;
    accessibility?: number;
    mobile?: number;
  }>({});

  useEffect(() => {
    const handleScoreUpdate = (event: CustomEvent<{ category: string; score: number }>) => {
      const { category, score } = event.detail;
      setScores((prev) => ({ ...prev, [category]: score }));
    };

    window.addEventListener("analysis-score-update", handleScoreUpdate);
    return () => {
      window.removeEventListener("analysis-score-update", handleScoreUpdate);
    };
  }, []);

  const hasScores = Object.keys(scores).length > 0;

  return (
    <>
      {hasScores && <OverallScore scores={scores} />}
      {children}
    </>
  );
}

// Hook for slots to report their scores
export function useReportScore(category: string, score: number | undefined) {
  useEffect(() => {
    if (score !== undefined && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("analysis-score-update", {
          detail: { category, score },
        })
      );
    }
  }, [category, score]);
}
