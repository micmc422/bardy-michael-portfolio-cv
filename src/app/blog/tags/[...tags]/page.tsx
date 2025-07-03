"use server"

import { Button, Column, Heading, Skeleton } from "@/once-ui/components";
import { Mailchimp } from "@/components";
// Importation dynamique pour Posts
const Posts = dynamic(() => import('@/components/blog/Posts').then(mod => mod.Posts), {
  loading: () => <Column>
    <Skeleton shape="block" width="l" minHeight={"40"} />
    <Skeleton shape="line" height="xl" width="l" />
    <Skeleton shape="line" height="m" width="m" />
  </Column>,
});

import { baseURL } from "@/app/resources";
import { blog, person, newsletter } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import dynamic from "next/dynamic";


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
    <Column maxWidth="s">
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
      <Button data-border="rounded" href="/blog" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
        Publications
      </Button>
      <Heading marginTop="l" marginBottom="l" variant="display-strong-s">
        Mot-clé : {tags.join(" - ")}
      </Heading>

      <Column
        fillWidth flex={1}>
        <Posts range={[1, 1]} thumbnail direction="column" tags={tags} />
        <Posts range={[2, 3]} thumbnail tags={tags} />
        <Posts range={[4]} columns="2" tags={tags} />
      </Column>
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}

