import { siteTypes } from "@/modules/estimation/models/estimationData";
import { PageHeader } from "@/shared/components/PageHeader";
import { Suspense } from "react";

export default async function HeadlineEstimationRoot({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const activeSiteType = siteTypes.find((site) => site.slug === slug);
    return (
        <Suspense>
            <PageHeader
                id="estimation-headline"
                align="center"
                eyebrow="Estimation en ligne"
                title={`Estimation de votre ${activeSiteType?.name ?? "projet"}`}
                lead={`Obtenez une estimation personnalisée pour votre site ${activeSiteType?.name ?? ""}.`.replace(" .", ".")}
            />
        </Suspense>
    );
}
