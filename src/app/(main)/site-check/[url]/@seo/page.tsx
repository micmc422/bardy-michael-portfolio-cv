import { analyzeSEO } from "@/modules/site-check/services";
import { SEOReport } from "@/modules/site-check/views";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function SEOSlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeSEO(decodedUrl);

  return <SEOReport results={results} />;
}
