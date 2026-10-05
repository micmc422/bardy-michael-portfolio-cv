import { analyzeMobile } from "@/modules/site-check/services";
import { MobileReport } from "@/modules/site-check/views";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function MobileSlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeMobile(decodedUrl);

  return <MobileReport results={results} />;
}
