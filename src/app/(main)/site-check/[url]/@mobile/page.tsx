import { analyzeMobile } from "@/app/utils/siteCheck";
import { AnalysisCard } from "@/components/site-check/AnalysisCard";

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
    <AnalysisCard
      title="Mobile"
      icon="mobile"
      score={results.score}
      items={items}
    />
  );
}
