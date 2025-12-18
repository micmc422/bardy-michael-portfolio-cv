import { analyzeSEO } from "@/app/utils/siteCheck";
import { SEOReport } from "@/components/site-check";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function SEOSlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeSEO(decodedUrl);

  return <SEOReport results={results} />;
}
