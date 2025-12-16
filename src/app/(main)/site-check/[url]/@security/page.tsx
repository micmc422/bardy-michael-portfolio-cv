import { analyzeSecurity } from "@/app/utils/siteCheck";
import { AnalysisCard } from "@/components/site-check/AnalysisCard";

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
    <AnalysisCard
      title="Sécurité"
      icon="shield"
      score={results.score}
      items={items}
    />
  );
}
