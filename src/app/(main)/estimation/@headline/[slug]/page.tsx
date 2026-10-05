import { Heading, Text } from "@once-ui-system/core";
import { siteTypes } from "@/modules/estimation/models/estimationData";
import { Suspense } from "react";

export default async function HeadlineEstimationRoot({params}: {params: Promise<{slug:string}>}) {
    const { slug } = await params
    const activeSiteType = siteTypes.find((site)=> site.slug === slug)
    return <Suspense>
        <Heading as="h1" variant="display-strong-xl" align="center">Estimation de votre <Text onBackground="brand-weak">{activeSiteType?.name}</Text></Heading>
        <Text variant="body-default-xl" align="center" wrap="balance" onBackground="neutral-weak">Obtenez une estimation personnalisée pour votre site {activeSiteType?.name}.</Text>
    </Suspense>
}