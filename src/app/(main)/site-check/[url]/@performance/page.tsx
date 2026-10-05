import { analyzePerformance } from "@/modules/site-check/services";
import { PerformanceReport } from "@/modules/site-check/views";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function PerformanceSlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzePerformance(decodedUrl);

  return <PerformanceReport results={results} />;
}
