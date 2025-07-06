import { Column, Flex, Skeleton } from "@/once-ui/components";
import { ProjectCard } from "@/components";
// import type { Metadata } from "next";
import { getProjects } from "@/app/utils/serverActions";
import { use } from "react";
import Script from "next/script";
import { work } from "@/app/resources";
import { getRandomSixDigitNumber } from "@/utils/utils";

interface ProjectsProps {
  range?: [number, number?];
}

export function Projects({ range }: ProjectsProps) {
  const projects = use(getProjects({}));
  const sortedProjects = projects.sort((a, b) => {
    return new Date(b.metadata.publishedAt as string).getTime() - new Date(a.metadata.publishedAt as string).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: work.title,
    description: work.description,
    "itemListOrder": "https://schema.org/ItemListOrderUnordered",
    numberOfItems: displayedProjects.length,
    itemListElement: displayedProjects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: p.metadata.title,
        url: p.metadata.projectURL,
        description: p.metadata.summary,
        image: p.metadata.image,
      }
    }))
  };
  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          priority={index < 1}
          key={post.slug}
          href={`${work.path}/${post.slug}`}
          images={post.metadata.images || []}
          title={post.metadata.title as string}
          description={post.metadata.summary}
          content={post.content || ""}
          avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ""}
        />
      ))}
      <Script id={`Projects-${typeof work.title === "string" ? work.title : `${getRandomSixDigitNumber()}`}`} type="application/ld+json">{JSON.stringify(jsonLd)}</Script>
    </Column>
  );
}

export function SkeletonProjects() {
  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {[0, 1, 2].map(el => <SkeletonProject key={el} />)}
    </Column>
  );
}

export function SkeletonProject() {
  return <Column fillWidth gap="m">
    <Skeleton shape="block" fillWidth minHeight={"xl"} style={{ borderRadius: "16px" }} />
    <Flex
      mobileDirection="column"
      fillWidth
      paddingX="s"
      paddingTop="12"
      paddingBottom="24"
      gap="l"
    >
      <Column gap="xs" flex={5} >
        <Skeleton shape="line" height="xl" fillWidth />
        <Skeleton shape="line" height="xl" width="m" />
      </Column>
      <Column flex={7} gap="16">
        <Skeleton shape="circle" width="m" />
        <Skeleton shape="line" height="s" fillWidth />
        <Skeleton shape="line" height="s" fillWidth />
        <Skeleton shape="line" height="s" width="m" />
      </Column>
    </Flex>
  </Column>
}
