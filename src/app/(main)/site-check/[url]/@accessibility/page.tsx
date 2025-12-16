import { analyzeAccessibility } from "@/app/utils/siteCheck";
import { AnalysisCardWithScoreReport } from "@/components/site-check/AnalysisCardWithScoreReport";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function AccessibilitySlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeAccessibility(decodedUrl);

  const items = [
    results.language,
    results.ariaAttributes,
    results.formLabels,
    results.altTexts,
    results.landmarks,
  ];

  return (
    <AnalysisCardWithScoreReport
      category="accessibility"
      title="Accessibilité"
      icon="users"
      score={results.score}
      items={items}
    />
  );
}
