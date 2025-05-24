import { baseURL, blog } from "@/app/resources";
import { getProject } from "@/app/utils/serverActions";
import { getProjects } from "@/app/utils/serverActions";
import { Meta } from "@/once-ui/modules";
import { Metadata } from "next";

async function getAllprojectsSlugs(): Promise<{ slug: string }[]> {
    const projects = await getProjects();
    return projects.map(({ slug }) => ({ slug }));
}

async function getprojectData(slug: string) {
    return await getProject(slug);
}


export async function generateStaticParams(): Promise<{ slug: string }[]> {
    return await getAllprojectsSlugs();
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const project = await getprojectData(slug)

    if (!project) return {};

    return Meta.generate({
        title: project.metadata.title,
        description: project.metadata.summary,
        baseURL: baseURL,
        image: project.metadata.image ? `${baseURL}${project.metadata.image}` : `${baseURL}/og?title=${project.metadata.title}`,
        path: `${blog.path}/${project.slug}`,
    });
}

export default async function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>
        {children}
    </>
}