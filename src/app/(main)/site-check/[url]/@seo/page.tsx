import { analyzeSEO } from "@/app/utils/siteCheck";
import { AnalysisCardWithScoreReport } from "@/components/site-check/AnalysisCardWithScoreReport";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function SEOSlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeSEO(decodedUrl);

  const items = [
    results.title,
    results.description,
    results.headings,
    results.images,
    results.links,
    results.sitemap,
    results.robots,
    results.viewport,
    results.structuredData,
    results.ogTags,
  ];

  return (
    <AnalysisCardWithScoreReport
      category="seo"
      title="SEO"
      icon="search"
      score={results.score}
      items={items}
    />
  );
}
