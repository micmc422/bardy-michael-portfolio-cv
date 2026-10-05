import { analyzeAccessibility } from "@/modules/site-check/services";
import { AccessibilityReport } from "@/modules/site-check/views";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function AccessibilitySlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeAccessibility(decodedUrl);

  return <AccessibilityReport results={results} />;
}
