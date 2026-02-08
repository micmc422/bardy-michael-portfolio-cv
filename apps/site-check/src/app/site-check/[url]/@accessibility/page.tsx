import { analyzeAccessibility } from "@/app/utils/siteCheck";
import { AccessibilityReport } from "@/components/site-check";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function AccessibilitySlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeAccessibility(decodedUrl);

  return <AccessibilityReport results={results} />;
}
