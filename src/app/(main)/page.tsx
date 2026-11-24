"use server"

import { Heading, Flex, Text, Avatar, Column, Tag, IconButton, Icon, Row } from "@once-ui-system/core";
import { RevealFx } from "@once-ui-system/fx";
import Meta from "@/modules/seo/Meta";
import { baseURL, routes } from "@/core/config";
import { home, about, person } from "@/core/config/content";
import { Projects } from "@/modules/projects/views/Projects";
import { Faq } from "@/shared/components";
import { AvisClient } from "@/shared/components/AvisClients";
import { Posts } from "@/modules/blog/views/Posts";
import { Tarifs } from "@/modules/estimation/views/Tarifs";
import Schema from "@/modules/seo/Schema";
import { Hero, Metrics, Expertise, TechStack, Process } from "@/modules/home";


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
      <Column as="section" fillWidth maxWidth={"xl"} aria-labelledby="hero-title">
        <Hero />
      </Column>
      <Metrics />
      <Expertise />
      <TechStack />
      <Process />
      <Column as="section" paddingY="m" gap="m" maxWidth={"m"} aria-labelledby="fonctionnalites-title">
        <Column gap="12" paddingX="l" paddingBottom="16">
          <Text variant="label-default-s" onBackground="brand-strong" style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Réalisations
          </Text>
          <Heading as="h2" id="realisations-title" textVariant="display-strong-s" wrap="balance">
            Des projets concrets, livrés et en production.
          </Heading>
        </Column>
        <RevealFx translateY="16" delay={600}>
          <Projects range={[1, 1]} />
        </RevealFx>
        {routes["/blog"] && (
          <Flex as="section" fillWidth gap="24" s={{ direction: "column" }} aria-labelledby="blog-title">
            <Flex flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" id="blog-title" textVariant="display-strong-xs" wrap="balance">
                Dernières actualités
              </Heading>
            </Flex>
            <Flex flex={3} paddingX="20">
              <Posts range={[1, 2]} columns="2" />
            </Flex>
          </Flex>
        )}
        <Projects range={[2]} />
        <Heading as="h2" id="fonctionnalites-title" wrap="balance" textVariant="display-strong-m" align="center">
          🎯 Fonctionnalités ciblées pour booster votre activité
        </Heading>
        <Text wrap="balance" onBackground="neutral-weak" textVariant="body-default-m" align="center">
          {`Artisans, commerçants, formateurs ou indépendants, je développe des fonctionnalités web concrètes et personnalisées pour vous : formulaires de devis, gestion des rendez-vous, catalogues interactifs, accès client sécurisé, ou encore outils d'automatisation. L'objectif est simple : optimiser votre temps, enrichir l'expérience de vos utilisateurs et faire de votre site un moteur essentiel à votre développement.`}
        </Text>

        <RevealFx fillWidth horizontal="center" paddingTop="16" paddingBottom="32" paddingLeft="8">
          <Tag
            variant="announce"
            background="neutral-medium" paddingX="8" paddingY="4" onBackground="brand-strong"
            arrow={false}
            href={"/solutions"}
            center
            gap="s"
            id="solutions-btn"
            aria-label="Découvrez les solutions proposées"
          >
            <Row as="span" inline fit paddingLeft="12">
              <Icon name="smile" onBackground="brand-strong" />
            </Row>
            <Text style={{ paddingTop: "var(--static-space-2)" }}>Découvrez les solutions que je propose</Text>
            <IconButton
              variant="ghost"
              icon="chevronRight"
            />
          </Tag>
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
