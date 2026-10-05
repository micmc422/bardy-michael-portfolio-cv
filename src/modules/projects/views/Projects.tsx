import { Column, Flex, Skeleton } from "@once-ui-system/core";
import { ProjectCard } from "@/shared/components";
// import type { Metadata } from "next";
import { getProjects } from "@/modules/blog/controllers/serverActions";
import { use } from "react";
import { work } from "@/core/config";
import { getRandomSixDigitNumber } from "@/core/utils/utils";

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
    <Column maxWidth={"m"} gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          priority={index < 1}
          key={post.slug}
          href={`${work.path}/${post.slug}`}
          images={post.metadata.images || []}
          title={post.metadata.title as string}
          description={post.metadata.summary}
          content={post.content || ""}
          avatars={post.metadata.team?.map((member: { avatar: string }) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ""}
        />
      ))}
      <script id={`Projects-${typeof work.title === "string" ? work.title : `${getRandomSixDigitNumber()}`}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
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
      s={{direction: "column"}}
      fillWidth
      paddingX="s"
      paddingTop="12"
      paddingBottom="24"
      gap="l"
    >
      <Column gap="xs" flex={5} >
        <Skeleton shape="line" size="xl" fillWidth />
        <Skeleton shape="line" size="xl" width="50%" />
      </Column>
      <Column flex={7} gap="16">
        <Skeleton shape="circle" size="m" />
        <Skeleton shape="line" size="s" fillWidth />
        <Skeleton shape="line" size="s" fillWidth />
        <Skeleton shape="line" size="s" width="50%" />
      </Column>
    </Flex>
  </Column>
}
