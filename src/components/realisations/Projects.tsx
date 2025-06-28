import { Column, Flex, Skeleton } from "@/once-ui/components";
import { ProjectCard } from "@/components";
// import type { Metadata } from "next";
import { getProjects } from "@/app/utils/serverActions";
import { use } from "react";

interface ProjectsProps {
  range?: [number, number?];
}
/*
interface Projects {
  metadata: Metadata & {
    projectURL?: string;
    publishedAt: string;
    summary: string;
    images: string[];
    team: {
      avatar: string;
    }[],
    link?: string;
  };
  slug: string;
  content: string;
}
*/
async function getWorks() {
  const data = await getProjects({});
  return data;
}

export function Projects({ range }: ProjectsProps) {
  const projects = use(getWorks());
  const sortedProjects = projects.sort((a, b) => {
    return new Date(b.metadata.publishedAt as string).getTime() - new Date(a.metadata.publishedAt as string).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          priority={index < 1}
          key={post.slug}
          href={`work/${post.slug}`}
          images={post.metadata.images || []}
          title={post.metadata.title as string}
          description={post.metadata.summary}
          content={post.content || ""}
          avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ""}
        />
      ))}
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
