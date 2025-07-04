"use server"

import { Column, Heading } from "@/once-ui/components";
import { Mailchimp } from "@/components";
import dynamic from "next/dynamic";
// Importation dynamique pour Posts
const Posts = dynamic(() => import('@/components/blog/Posts').then(mod => mod.Posts), {
  loading: () => <SkeletonPosts />,
});

import { baseURL } from "@/app/resources";
import { blog, person, newsletter } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import { SkeletonPosts } from "@/components/blog/Posts";


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
      <Heading as="h1" marginBottom="l" variant="display-strong-s">
        {blog.title}
      </Heading>
      <Column
        fillWidth flex={1}>
        <Posts range={[1, 1]} thumbnail direction="column" />
        <Posts range={[2, 3]} thumbnail />
        <Posts range={[4]} columns="2" />
      </Column>
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}


