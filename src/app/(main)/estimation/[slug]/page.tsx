import { notFound } from "next/navigation";
import { OptionsForm } from "@/modules/estimation/components";
import { siteTypes } from "@/modules/estimation/models/estimationData";

export default async function EstimationTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activeSite = siteTypes.find((site) => site.slug === slug);
  if (!activeSite) notFound();

  return <OptionsForm options={activeSite.options} />;
}
