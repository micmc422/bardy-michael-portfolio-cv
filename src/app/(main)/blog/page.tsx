"use server"

import { PageHeader } from "@/shared/components/PageHeader";
import { PageShell } from "@/shared/components/PageShell";
import { Mailchimp } from "@/shared/components";
import dynamic from "next/dynamic";
// Importation dynamique pour Posts
const Posts = dynamic(() => import('@/modules/blog/views/Posts').then(mod => mod.Posts), {
  loading: () => <SkeletonPosts />,
});

import { baseURL } from "@/core/config";
import { blog, person, newsletter } from "@/core/config/content";
 import Meta from "@/modules/seo/Meta";
import { SkeletonPosts } from "@/modules/blog/views/Posts";
import Schema from "@/modules/seo/Schema";


export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default async function Blog() {
  return (
    <PageShell labelledBy="blog-page-title">
      <Schema
        as="blog"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`${baseURL}/og?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <PageHeader
        id="blog-page-title"
        eyebrow="Journal technique"
        title={blog.title}
        lead="Retours d'expérience, guides et analyses sur Next.js, la performance web, le SEO et l'accessibilité."
      />
      <Posts featured />
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </PageShell>
  );
}


