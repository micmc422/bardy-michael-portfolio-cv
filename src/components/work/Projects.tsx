import { Column, Flex, Media, SmartLink } from "@/once-ui/components";
import { ProjectCard } from "@/components";
import { Metadata } from "next";
import { getProjects } from "@/app/utils/serverActions";
import { use } from "react";

interface ProjectsProps {
  range?: [number, number?];
}
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
}[]

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
          priority={index < 2}
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

export function SkeletonProject({ direction = "column" }: { direction?: "row" | "column" }) {
  return (
    <SmartLink
      fillWidth
      unstyled
      style={{ borderRadius: 'var(--radius-l)' }}
    >
      <Flex
        position="relative"
        transition="micro-medium"
        direction={direction}
        radius="l"
        mobileDirection="column"
        fillWidth>
        <Media
          border="neutral-alpha-weak"
          radius="l"
          loading
          src='/images/eaa.jpg'
          aspectRatio="16 / 9"
        />
      </Flex>
    </SmartLink>
  );
}