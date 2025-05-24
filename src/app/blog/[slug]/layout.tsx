"use server"

import { baseURL, blog } from "@/app/resources";
import { getPost } from "@/app/utils/serverActions";
import { getPosts } from "@/app/utils/utils";
import { Meta } from "@/once-ui/modules";
import { Metadata } from "next";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    "use server"
    const posts = await getPosts(["src", "app", "blog", "posts"]);
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const {slug} = await params;
    console.log("Blog params:", slug);


    const post = await getPost(slug)

    if (!post) return {};
    console.log("post", post);

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
    return <div style={{border: "1px solid red", padding: "20px"}}>
        {children}
    </div>
}