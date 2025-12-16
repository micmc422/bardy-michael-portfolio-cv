import { analyzeSecurity } from "@/app/utils/siteCheck";
import { AnalysisCardWithScoreReport } from "@/components/site-check/AnalysisCardWithScoreReport";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function SecuritySlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeSecurity(decodedUrl);

  const items = [
    results.https,
    results.hsts,
    results.csp,
    results.xFrameOptions,
    results.xContentTypeOptions,
    results.mixedContent,
  ];

  return (
    <AnalysisCardWithScoreReport
      category="security"
      title="Sécurité"
      icon="shield"
      score={results.score}
      items={items}
    />
  );
}
