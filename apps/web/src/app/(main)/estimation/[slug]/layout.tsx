import { baseURL } from "@/app/resources";
import { estimation, person } from "@/app/resources/content";
 import Meta from "@/modules/seo/Meta";
import { Suspense, type ReactNode } from "react";
import { siteTypes } from "../estimationData";
import { notFound } from "next/navigation";
import { DraggableFlexRow } from "@/components/DraggableRow";
import { Row, ToggleButton } from "@once-ui-system/core";
import Schema from "@/modules/seo/Schema";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    return siteTypes.map(({ slug }) => ({ slug }));

}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const activeSite = siteTypes.find((site) => site.slug === slug)
    if (!activeSite) notFound()
    return Meta.generate({
        title: `Estimation : ${activeSite.name} | occitaweb.fr`,
        description: activeSite.description,
        baseURL: baseURL,
        image: `${baseURL}/og?type=estimation&slug=${activeSite.slug}`,
        path: `${estimation.path}/${slug}`,
    });
}

export default async function EstimationSlugLayout({ children, params }: { children: ReactNode, params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const activeSite = siteTypes.find((site) => site.slug === slug)
    if (!activeSite) notFound()

    return <>
        <Schema
            as="webPage"
            baseURL={baseURL}
            path={`${estimation.path}/${slug}`}
            title={`Estimation : ${activeSite.name}`}
            description={estimation.description}
            image={`${baseURL}/og?type=estimation&slug=${slug}`}
            author={{
                name: person.name,
                url: `${baseURL}${estimation.path}`,
                image: `${baseURL}${person.avatar}`,
            }}
        />
        <Schema as={"service"} title={activeSite.name} description={activeSite.description} path={`estimation/${activeSite.slug}`} offerSlug={activeSite.slug} />
        <DraggableFlexRow>
            <Row wrap={false} gap="s">
                {siteTypes.map((site) => <ToggleButton prefixIcon={site.icon} key={site.slug} label={site.name} selected={site.slug === slug} href={`/estimation/${site.slug}`} size="s" />)}
            </Row>
        </DraggableFlexRow>
        <Suspense>{children}</Suspense>
    </>
}