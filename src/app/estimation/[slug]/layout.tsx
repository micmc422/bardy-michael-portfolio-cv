import { baseURL } from "@/app/resources";
import { estimation, person } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import { Suspense, type ReactNode } from "react";
import { siteTypes } from "../estimationData";
import { notFound } from "next/navigation";

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

    return <Suspense>
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
        {children}</Suspense>
}