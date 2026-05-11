"use server"

import { Heading, Flex, Text, Avatar, RevealFx, Column, Badge, IconButton, Icon, Meta } from "@once-ui-system/core";
import { baseURL, routes } from "@/app/resources";
import { home, about, person } from "@/app/resources/content";
import { Projects } from "@/components/realisations/Projects";
import { Faq } from "@/components";
import { AvisClient } from "@/components/AvisClients";
import { Posts } from "@/components/blog/Posts";
import { Tarifs } from "@/components/tarif/Tarifs";
import Schema from "@/modules/seo/Schema";


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
    <>
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
      <Column as="section" maxWidth={"xl"}>
        <Column maxWidth="s" aria-labelledby="entete-title">
          <RevealFx fillWidth horizontal="start" paddingTop="16" paddingBottom="32" paddingLeft="8">
            <Badge
              background="brand-alpha-weak" paddingX="xs" paddingY="4" onBackground="brand-strong"
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
                variant="ghost"
                icon="chevronRight"
              />
            </Badge>
          </RevealFx>
          <Heading as="h1" id="hero-title" wrap="balance" variant="display-strong-l" paddingX="xs" fillWidth paddingBottom="16">
            {home.headline}
          </Heading>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl" paddingX="xs">
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
      <Column as="section" paddingY="m" gap="m" maxWidth={"m"} aria-labelledby="fonctionnalites-title">
        <RevealFx translateY="16" delay={0.6}>
          <Projects range={[1, 1]} />
        </RevealFx>
        {routes["/blog"] && (
          <Flex as="section" fillWidth gap="24" s={{ direction: "column" }} aria-labelledby="blog-title">
            <Flex flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" id="blog-title" variant="display-strong-xs" wrap="balance">
                Dernières actualités
              </Heading>
            </Flex>
            <Flex flex={3} paddingX="20">
              <Posts range={[1, 2]} columns="2" />
            </Flex>
          </Flex>
        )}
        <Projects range={[2]} />
        <Heading as="h2" id="fonctionnalites-title" wrap="balance" variant="display-strong-m" align="center">
          🎯 Fonctionnalités ciblées pour booster votre activité
        </Heading>
        <Text wrap="balance" onBackground="neutral-weak" variant="body-default-m" align="center">
          {`Artisans, commerçants, formateurs ou indépendants, je développe des fonctionnalités web concrètes et personnalisées pour vous : formulaires de devis, gestion des rendez-vous, catalogues interactifs, accès client sécurisé, ou encore outils d'automatisation. L'objectif est simple : optimiser votre temps, enrichir l'expérience de vos utilisateurs et faire de votre site un moteur essentiel à votre développement.`}
        </Text>

        <RevealFx fillWidth horizontal="center" paddingTop="16" paddingBottom="32" paddingLeft="8">
          <Badge
            background="neutral-medium" paddingX="8" paddingY="4" onBackground="brand-strong"
            arrow={false}
            href={"/solutions"}
            center
            gap="s"
            id="solutions-btn"
            aria-label="Découvrez les solutions proposées"
          >
            <Icon paddingLeft="12" name="smile" onBackground="brand-strong" />
            <Text paddingTop="2">Découvrez les solutions que je propose</Text>
            <IconButton
              variant="ghost"
              icon="chevronRight"
            />
          </Badge>
        </RevealFx>
        <Tarifs />
      </Column>
      <Column as="section" maxWidth={"s"} aria-label="Questions fréquentes">
        <Faq faqData={JSON.stringify({
          "title": "",
          "faq": [
            {
              "title": "Quels types de sites proposez-vous ?",
              "content": "Je conçois des sites vitrines, e-commerce, blogs et des applications web personnalisées, avec un fort accent sur la performance, l’accessibilité et l’expérience utilisateur. Chaque projet est adapté aux besoins spécifiques de mes clients."
            },
            {
              "title": "Travaillez-vous avec des agences ou directement avec des clients ?",
              "content": "Les deux ! Je collabore régulièrement avec des agences en tant que développeur freelance, mais j'accompagne aussi directement des entreprises, artisans ou indépendants pour la création et la gestion de leur site web."
            },
            {
              "title": "Quels sont vos délais de réalisation ?",
              "content": "Cela dépend de la complexité du projet. Un site vitrine simple peut être prêt en 2 à 3 semaines, tandis qu’un site plus technique ou une refonte complète peuvent prendre plusieurs mois. Je m’engage toujours sur un planning réaliste dès le départ."
            },
            {
              "title": "Est-ce que vous assurez la maintenance après livraison ?",
              "content": "Oui, je propose des forfaits de maintenance pour assurer la sécurité, les mises à jour techniques et les améliorations continues du site, selon les besoins."
            },
            {
              "title": "Est-ce que vous proposez des formations ou un accompagnement à l'utilisation du site ?",
              "content": "Tout à fait. Je propose des sessions de prise en main, à distance, pour que mes clients puissent gérer eux-mêmes leur contenu ou leur boutique en ligne en toute autonomie."
            },
            {
              "title": "Prenez-vous des stagiaires ?",
              "content": "Non, je ne prends pas de stagiaires. Je travaille depuis mon domicile dans un environnement de télétravail optimisé pour la concentration et la productivité. Cela ne permet malheureusement pas d'assurer un encadrement de qualité, nécessaire à une expérience de stage enrichissante. Je préfère consacrer mon temps à mes clients et à la qualité des projets livrés."
            }
          ]
        })
        } />
      </Column>
      <Column as="section" aria-label="Avis clients">
        <AvisClient />
      </Column>
    </>
  );
}
