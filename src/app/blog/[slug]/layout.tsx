import { baseURL, blog } from "@/app/resources";
import { getPost } from "@/app/utils/serverActions";
import { getPosts } from "@/app/utils/utils";
import { Meta } from "@/once-ui/modules";
import { Metadata } from "next";

async function getAllPostsSlugs(): Promise<{ slug: string }[]> {
    const posts = await getPosts(["src", "app", "blog", "posts"]);
    return posts.map(({ slug }) => ({ slug }));
}

async function getPostData(slug: string) {
    return await getPost(slug);
}


export async function generateStaticParams(): Promise<{ slug: string }[]> {
    return await getAllPostsSlugs();
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostData(slug)

    if (!post) return {};

    return Meta.generate({
        title: post.metadata.title,
        description: post.metadata.summary,
        baseURL: baseURL,
        image: post.metadata.image ? `${baseURL}${post.metadata.image}` : `${baseURL}/og?title=${post.metadata.title}`,
        path: `${blog.path}/${post.slug}`,
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