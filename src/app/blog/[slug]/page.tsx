import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { AvatarGroup, Button, Column, Heading, HeadingNav, Icon, Row, Text } from "@/once-ui/components";
import { about, blog, person, baseURL } from "@/app/resources";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { Meta, Schema } from "@/once-ui/modules";
import { getPost, getPosts } from "@/app/utils/serverActions";
import { Metadata } from "next";


async function getAllPostsSlugs(): Promise<{ slug: string }[]> {
  const projects = await getPosts();
  return projects.map(({ slug }) => ({ slug }));
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
  const project = await getPostData(slug)

  if (!project) return {};

  return Meta.generate({
    title: project.metadata.title,
    description: project.metadata.summary,
    baseURL: baseURL,
    image: project.metadata.image ? `${baseURL}${project.metadata.image}` : `${baseURL}/og?title=${project.metadata.title}`,
    path: `${blog.path}/${project.slug}`,
  });
}

export default async function Blog({
  params
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug)

  if (!post) {
    notFound();
  }

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
          <Icon name="document" size="xs" />
          Navigation
        </Row>
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}