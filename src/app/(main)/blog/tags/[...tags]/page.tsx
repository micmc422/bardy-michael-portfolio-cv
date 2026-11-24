"use server"

import { Button, Column, Skeleton } from "@once-ui-system/core";
import { Mailchimp } from "@/shared/components";
import { PageHeader } from "@/shared/components/PageHeader";
import { PageShell } from "@/shared/components/PageShell";
// Importation dynamique pour Posts
const Posts = dynamic(() => import('@/modules/blog/views/Posts').then(mod => mod.Posts), {
  loading: () => <Column>
    <Skeleton shape="block" minHeight={"40"} />
    <Skeleton shape="line" size="xl" width="75%" />
    <Skeleton shape="line" size="m" width="50%" />
  </Column>,
});

import { baseURL } from "@/core/config";
import { blog, person, newsletter } from "@/core/config/content";
 import Meta from "@/modules/seo/Meta";
import dynamic from "next/dynamic";
import Schema from "@/modules/seo/Schema";


export async function generateMetadata({ params }: { params: Promise<{ tags: string[] }> }) {
  const { tags } = await params;

  return Meta.generate({
    title: `Mot${tags?.length > 1 ? "s" : ""}-clé : ${tags.join(", ")}`,
    description: `Articles du blog pour le${tags?.length > 1 ? "s" : ""} mot${tags?.length > 1 ? "s" : ""}-clé ${tags.join(", ")}`,
    baseURL,
    image: `/og?title=${encodeURIComponent(blog.title)}`,
    path: `${blog.path}/tags/${tags?.join("/")}`,
    noIndex: true,
  });
}

export default async function Blog({ params }: { params: Promise<{ tags: string[] }> }) {
  const { tags } = await params;
  return (
    <PageShell labelledBy="blog-tags-title">
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
      <Button rounded href="/blog" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
        Publications
      </Button>
      <PageHeader
        id="blog-tags-title"
        eyebrow="Mot-clé"
        title={tags.map((tag) => decodeURIComponent(tag)).join(" - ")}
      />
      <Posts tags={tags} />
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </PageShell>
  );
}

