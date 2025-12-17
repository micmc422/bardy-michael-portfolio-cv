import { analyzeMobile } from "@/app/utils/siteCheck";
import { MobileReport } from "@/components/site-check";

interface PageParams {
  params: Promise<{ url: string }>;
}

export default async function MobileSlot({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  const results = await analyzeMobile(decodedUrl);

  return <MobileReport results={results} />;
}
