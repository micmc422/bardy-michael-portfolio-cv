import { analyzePerformance } from "@/app/utils/siteCheck";
import { PerformanceReport } from "@/components/site-check";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function PerformanceSlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzePerformance(decodedUrl);

  return <PerformanceReport results={results} />;
}
