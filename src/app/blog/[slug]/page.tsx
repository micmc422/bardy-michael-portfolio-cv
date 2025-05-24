"use server"

import { getPost, getPosts } from "@/app/utils/serverActions";
import { blog, baseURL } from "@/app/resources";
import { Metadata } from 'next';
import { Meta } from "@/once-ui/modules";
import { PostPage } from "./postPage";
import { notFound } from "next/navigation";
/*
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getPosts(["src", "app", "blog", "posts"])

  return posts.map((post) => ({
    slug: post.slug,
  }));
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image ? `${baseURL}${post.metadata.image}` : `${baseURL}/og?title=${post.metadata.title}`,
    path: `${blog.path}/${post.slug}`,
  });
}
*/

export default async function Blog({
  params
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return notFound();
  }
  return (<PostPage post={post} />);
}
