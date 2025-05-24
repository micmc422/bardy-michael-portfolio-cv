"use server"
import { getPost, getPosts } from "@/app/utils/serverActions";
import { blog, baseURL } from "@/app/resources";
import { Metadata } from 'next';
import { Meta } from "@/once-ui/modules";
import { PostPage } from "./postPage";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getPosts(["src", "app", "blog", "posts"])

  return posts.map((post) => ({
    slug: post.slug,
  }));
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  const post = await getPost(slugPath);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image ? `${baseURL}${post.metadata.image}` : `${baseURL}/og?title=${post.metadata.title}`,
    path: `${blog.path}/${post.slug}`,
  });
}


export default async function Blog({
  params
}: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  const post = await getPost(slugPath);

  return (<PostPage post={post} />);
}
