import { analyzeSecurity } from "@/modules/site-check/services";
import { SecurityReport } from "@/modules/site-check/views";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function SecuritySlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeSecurity(decodedUrl);

  return <SecurityReport results={results} />;
}
