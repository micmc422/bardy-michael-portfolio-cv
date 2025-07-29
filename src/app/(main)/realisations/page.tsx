"use server"

import { Column, Heading, Meta, Row, Skeleton } from "@once-ui-system/core";
import { baseURL } from "@/app/resources";
import { about, person, work } from "@/app/resources/content";
import dynamic from "next/dynamic";
import { SkeletonProjects } from "@/components/realisations/Projects";
import Schema from "@/modules/seo/Schema";
// Importation dynamique pour Projects
const Projects = dynamic(() => import('@/components/realisations/Projects').then(mod => mod.Projects), {
  loading: () => <SkeletonProjects />,
});
// Importation dynamique pour Tarifs
const Tarifs = dynamic(() => import('@/components/tarif/Tarifs').then(mod => mod.Tarifs), {
  loading: () => <Row gap="s" paddingBottom="l" mobileDirection="column">
    <Column>
      <Skeleton shape="block" width="l" minHeight={"40"} radius="l" />
      <Skeleton shape="line" height="xl" width="l" />
      <Skeleton shape="line" height="m" width="m" />
    </Column>
    <Column>
      <Skeleton shape="block" width="l" minHeight={"40"} />
      <Skeleton shape="line" height="xl" width="l" />
      <Skeleton shape="line" height="m" width="m" />
    </Column>
    <Column>
      <Skeleton shape="block" width="l" minHeight={"40"} />
      <Skeleton shape="line" height="xl" width="l" />
      <Skeleton shape="line" height="m" width="m" />
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
    <Column maxWidth="m">
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
      <Heading as="h1" variant="display-strong-l" align="center" paddingBottom="l">Dernières réalistions</Heading>
      <Projects />
      <Tarifs />
    </Column>
  );
}
