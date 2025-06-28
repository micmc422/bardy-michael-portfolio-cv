"use server"

import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getProject, getProjects } from "@/app/utils/serverActions";
import { AvatarGroup, Button, Column, Flex, Heading, OgCard, SmartImage, Text } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { about, person, work } from "@/app/resources/content";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { Meta, Schema } from "@/once-ui/modules";
import type { Metadata } from "next";


async function getAllprojectsSlugs(): Promise<{ slug: string }[]> {
  const projects = await getProjects({});
  return projects.map(({ slug }) => ({ slug }));
}

async function getprojectData(slug: string) {
  try {
    const localProject = await getProject(slug);
    if (localProject) {
      return localProject;
    }

    return await getProject(slug);
  }
  catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
}


export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return await getAllprojectsSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getprojectData(slug)

  if (!post) notFound();

  return Meta.generate({
    title: post.metadata.title as string,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: `${baseURL}/og?slug=${post.slug}&type=project`,
    path: `${work.path}/${post.slug}`,
  });
}

export default async function Project({
  params
}: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';
  const post = await getprojectData(slugPath);
  if (!post) notFound();

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];
  const publishedAt = post.metadata.publishedAt ? new Date(post.metadata.publishedAt) : new Date();
  const ModifiedAt = post.metadata.updatedAt ? new Date(post.metadata.updatedAt) : new Date();
  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${post.slug}`}
        title={post.metadata.title as string}
        description={post.metadata.summary}
        datePublished={`${publishedAt.getFullYear()}-${publishedAt.getMonth() + 1}-${publishedAt.getDate()}`}
        dateModified={`${ModifiedAt.getFullYear()}-${ModifiedAt.getMonth() + 1}-${ModifiedAt.getDate()}`}
        image={`${baseURL}/og?title=${encodeURIComponent(post.metadata.title as string)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="xs" gap="16">
        <Button data-border="rounded" href="/realisations" variant="tertiary" weight="default" size="s" prefixIcon="chevronLeft">
          Projets
        </Button>
        <Heading variant="display-strong-s">{post.metadata.title as string}</Heading>
      </Column>
      {post.metadata.image && (
        <SmartImage
          priority
          aspectRatio="16 / 9"
          radius="m"
          alt={`Aperçu du projet : ${post.metadata.title}`}
          src={post?.metadata?.image}
        />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <Flex gap="12" marginBottom="24" vertical="center">
          {post.metadata.team && <AvatarGroup reverse avatars={avatars} size="m" />}
          <Text variant="body-default-s" onBackground="neutral-weak">
            {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
          </Text>
        </Flex>
        <CustomMDX source={post.content || ""} />
        <OgCard
          url={post.metadata.projectURL}
        />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
