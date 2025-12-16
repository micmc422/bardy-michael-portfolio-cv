import { analyzeMobile } from "@/app/utils/siteCheck";
import { AnalysisCardWithScoreReport } from "@/components/site-check/AnalysisCardWithScoreReport";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function MobileSlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeMobile(decodedUrl);

  const items = [
    results.viewport,
    results.responsiveDesign,
    results.touchTargets,
    results.fontSizes,
  ];

  return (
    <AnalysisCardWithScoreReport
      category="mobile"
      title="Mobile"
      icon="mobile"
      score={results.score}
      items={items}
    />
  );
}
