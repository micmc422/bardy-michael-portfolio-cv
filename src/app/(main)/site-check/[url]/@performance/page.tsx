import { analyzePerformance } from "@/app/utils/siteCheck";
import { AnalysisCardWithScoreReport } from "@/components/site-check/AnalysisCardWithScoreReport";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function PerformanceSlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzePerformance(decodedUrl);

  const items = [
    results.loadTime,
    results.pageSize,
    results.requestCount,
    results.compression,
  ];

  return (
    <AnalysisCardWithScoreReport
      category="performance"
      title="Performance"
      icon="zap"
      score={results.score}
      items={items}
    />
  );
}
