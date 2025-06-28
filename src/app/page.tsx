"use server"

import { Heading, Flex, Text, Avatar, RevealFx, Column, Badge, IconButton, Icon } from "@/once-ui/components";
import { baseURL, routes } from "@/app/resources";
import { home, about, person } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Importation dynamique pour Tarifs
const Tarifs = dynamic(() => import('@/components/tarif/Tarifs').then(mod => mod.Tarifs), {
  loading: () => <p>Chargement des tarifs...</p>, // Composant optionnel affiché pendant le chargement
});

// Importation dynamique pour Posts
const Posts = dynamic(() => import('@/components/blog/Posts').then(mod => mod.Posts), {
  loading: () => <p>Chargement des articles...</p>,
});

// Importation dynamique pour Projects
const Projects = dynamic(() => import('@/components/realisations/Projects').then(mod => mod.Projects), {
  loading: () => <p>Chargement des projets...</p>,
});

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
    path: home.path,
  });
}

export default async function Home() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`${baseURL}/og?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column fillWidth paddingY="24" gap="m">
        <Column maxWidth="s">
          <RevealFx fillWidth horizontal="start" paddingTop="16" paddingBottom="32" paddingLeft="8">
            <Badge
              background="brand-alpha-weak" paddingX="8" paddingY="4" onBackground="brand-strong"
              arrow={false}
              href={about.calendar.link}
              center
              gap="s"
              id="RDVBtn"
              aria-label="Lien vers la prise de rendez-vous"
            >
              <Icon paddingLeft="12" name="calendar" onBackground="brand-strong" />
              <Text paddingTop="4">Planifier un RDV</Text>
              <IconButton
                data-border="rounded"
                variant="ghost"
                icon="chevronRight"
              />
            </Badge>
          </RevealFx>
          <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="start" paddingLeft="8">
            <Badge background="brand-weak" onBackground="neutral-weak" border="accent-alpha-weak" gap="8" vertical="center" paddingY="4" marginBottom="m" href={about.path} effect={false} id="auteur" aria-label="liens vers la page à propos de l'auteur" arrow={false}
            >
              {about.avatar.display && (
                <Avatar
                  style={{ marginLeft: "-0.75rem", marginRight: "0.25rem" }}
                  src={person.avatar}
                  size="m"
                />
              )}
              {about.title}
            </Badge>
          </RevealFx>
          {home.featured.display && (
            <RevealFx fillWidth horizontal="start" paddingLeft="8">
              <Badge background="brand-alpha-weak" paddingX="4" paddingBottom="2" paddingTop="4" onBackground="neutral-strong" textVariant="body-default-s"
                href={home.featured.href} marginBottom="m" aria-label={`lire : ${home.featured.title}`} arrow={false}>
                <Text paddingY="2">{home.featured.title}</Text>
              </Badge>
            </RevealFx>
          )}

        </Column>
      </Column>
      <RevealFx translateY="16" delay={0.6}>
        <Suspense>
          <Projects range={[1, 1]} />
        </Suspense>
      </RevealFx>
      {routes["/blog"] && (
        <Flex fillWidth gap="24" mobileDirection="column">
          <Flex flex={1} paddingLeft="l" paddingTop="24">
            <Heading as="h2" variant="display-strong-xs" wrap="balance">
              Dernières actualités
            </Heading>
          </Flex>
          <Flex flex={3} paddingX="20">
            <Suspense>
              <Posts range={[1, 2]} columns="2" />
            </Suspense>
          </Flex>
        </Flex>
      )}
      <Projects range={[2]} />
      <Tarifs />

    </Column>
  );
}
