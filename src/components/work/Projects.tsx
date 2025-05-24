"use client";

import { Column } from "@/once-ui/components";
import { ProjectCard } from "@/components";
import useSWR from "swr";
import { Metadata } from "next";

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

export const fetcher = (url: string) => fetch(url).then((res) => res.json());


export function Projects({ range }: ProjectsProps) {
  const { data, error, isLoading } = useSWR<Projects[]>('/api/projects', fetcher)
  console.log(data);
  if (!data || isLoading) {
    return <>loading</>
  }
  const sortedProjects = data.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
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
          images={post.metadata.images}
          title={post.metadata.title as string}
          description={post.metadata.summary}
          content={post.content}
          avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ""}
        />
      ))}
    </Column>
  );
}
