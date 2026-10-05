"use server"

import { Column, Heading, Row, Skeleton } from "@once-ui-system/core";
import Meta from "@/modules/seo/Meta";
import { baseURL } from "@/core/config";
import { about, person, work } from "@/core/config/content";
import dynamic from "next/dynamic";
import { SkeletonProjects } from "@/modules/projects/views/Projects";
import Schema from "@/modules/seo/Schema";
// Importation dynamique pour Projects
const Projects = dynamic(() => import('@/modules/projects/views/Projects').then(mod => mod.Projects), {
  loading: () => <SkeletonProjects />,
});
// Importation dynamique pour Tarifs
const Tarifs = dynamic(() => import('@/modules/estimation/views/Tarifs').then(mod => mod.Tarifs), {
  loading: () => <Row gap="s" paddingBottom="l" s={{direction: "column"}}>
    <Column>
      <Skeleton shape="block" minHeight={"40"} radius="l" />
      <Skeleton shape="line" size="xl" width="75%" />
      <Skeleton shape="line" size="m" width="50%" />
    </Column>
    <Column>
      <Skeleton shape="block" minHeight={"40"} />
      <Skeleton shape="line" size="xl" width="75%" />
      <Skeleton shape="line" size="m" width="50%" />
    </Column>
    <Column>
      <Skeleton shape="block" minHeight={"40"} />
      <Skeleton shape="line" size="xl" width="75%" />
      <Skeleton shape="line" size="m" width="50%" />
    </Column>
  </Row>, // Composant optionnel affiché pendant le chargement
});


export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default async function Work() {
  return (
    <Column as="section" maxWidth="m" aria-labelledby="realisations-page-title">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`${baseURL}/og?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading as="h1" id="realisations-page-title" variant="display-strong-l" align="center" paddingBottom="l">Dernières réalisations</Heading>
      <Projects />
      <Tarifs />
    </Column>
  );
}
