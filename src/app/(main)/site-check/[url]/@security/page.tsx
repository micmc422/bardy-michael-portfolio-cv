import { analyzeSecurity } from "@/app/utils/siteCheck";
import { SecurityReport } from "@/components/site-check";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function SecuritySlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeSecurity(decodedUrl);

  return <SecurityReport results={results} />;
}
