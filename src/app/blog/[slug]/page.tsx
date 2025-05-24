import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getPostBySlug, getPosts } from "@/app/utils/serverActions";
import { AvatarGroup, Button, Column, Heading, HeadingNav, Icon, Row, Text } from "@/once-ui/components";
import { about, blog, person, baseURL } from "@/app/resources";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { Metadata } from 'next';
import { Meta, Schema } from "@/once-ui/modules";
import { use } from "react";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getPosts(["src", "app", "blog", "posts"])

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function getPost(slug: string) {
  "use server";
  const post = await getPostBySlug(slug, ["src", "app", "blog", "posts"]);

  if (!post) {
    notFound();
  }

  return post;
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


export default function Blog({
  params
}: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = use(params);
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  const post = use(getPost(slugPath));


  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  return (
    <Row fillWidth>
      <Row maxWidth={12} hide="m" />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="xs" gap="l">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.slug}`}
            title={post.metadata.title}
            description={post.metadata.summary}
            datePublished={post.metadata.publishedAt}
            dateModified={post.metadata.publishedAt}
            image={`${baseURL}/og?title=${encodeURIComponent(post.metadata.title)}`}
            author={{
              name: person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />
          <Button data-border="rounded" href="/blog" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
            Publications
          </Button>
          <Heading variant="display-strong-s">{post.metadata.title}</Heading>
          <Row gap="12" vertical="center">
            {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} />}
            <Text variant="body-default-s" onBackground="neutral-weak">
              {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
            </Text>
          </Row>
          <Column as="article" fillWidth>
            <CustomMDX source={post.content} />
          </Column>
          <ScrollToHash />
        </Column>
      </Row>
      <Column maxWidth={12} paddingLeft="40" fitHeight position="sticky" top="80" gap="16" hide="m">
        <Row
          gap="12"
          paddingLeft="2"
          vertical="center"
          onBackground="neutral-medium"
          textVariant="label-default-s"
        >
          <Icon name="chevronDown" size="xs" />
          Navigation
        </Row>
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
