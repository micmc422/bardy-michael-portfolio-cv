"use server"

import { Heading, Flex, Text, Avatar, RevealFx, Column, Badge, IconButton, Icon, Skeleton, Row } from "@/once-ui/components";
import { baseURL, routes } from "@/app/resources";
import { home, about, person } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import dynamic from "next/dynamic";
import { SkeletonProject } from "@/components/realisations/Projects";
import { Faq } from "@/components";
import { AvisClient } from "@/components/AvisClients";
import { getAvis } from "./utils/serverActions";
import { convertirTimestampGoogle } from "@/utils/utils";
import Script from "next/script";

// Importation dynamique pour Tarifs
const Tarifs = dynamic(() => import('@/components/tarif/Tarifs').then(mod => mod.Tarifs), {
  loading: () => <Row gap="s" paddingBottom="l" mobileDirection="column">
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
    <Column>
      <Skeleton shape="block" width="l" minHeight={"40"} />
      <Skeleton shape="line" height="xl" width="l" />
      <Skeleton shape="line" height="m" width="m" />
    </Column>
  </Row>, // Composant optionnel affiché pendant le chargement
});

// Importation dynamique pour Posts
const Posts = dynamic(() => import('@/components/blog/Posts').then(mod => mod.Posts), {
  loading: () => <Column>
    <Skeleton shape="block" width="l" minHeight={"40"} />
    <Skeleton shape="line" height="xl" width="l" />
    <Skeleton shape="line" height="m" width="m" />
  </Column>
  ,
});

// Importation dynamique pour Projects
const Projects = dynamic(() => import('@/components/realisations/Projects').then(mod => mod.Projects), {
  loading: () => <SkeletonProject />
  ,
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
  const { rating, reviews } = await getAvis();

  const reviewsArr = JSON.stringify(reviews.map((el) => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": el.author_name
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": el.rating,
      "bestRating": "5"
    },
    "reviewBody": el.text,
    "datePublished": convertirTimestampGoogle(el.time)
  })))


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
        <Projects range={[1, 1]} />
      </RevealFx>
      {routes["/blog"] && (
        <Flex fillWidth gap="24" mobileDirection="column">
          <Flex flex={1} paddingLeft="l" paddingTop="24">
            <Heading as="h2" variant="display-strong-xs" wrap="balance">
              Dernières actualités
            </Heading>
          </Flex>
          <Flex flex={3} paddingX="20">
            <Posts range={[1, 2]} columns="2" />
          </Flex>
        </Flex>
      )}
      <Projects range={[2]} />
      <Tarifs />
      <Column maxWidth={"s"}>
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
      <AvisClient />
      <Script id="LocalBusiness" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: `{
                  "@context": "https://schema.org",
                  "@type": "LocalBusiness",
                  "name": "Occitaweb",
                  "url": "https://occitaweb.fr",
                  "telephone": "+33 6 72 11 50 06",
                  "priceRange": "€€€",
                  "image": "https://occitaweb.fr/trademark/icon-dark.png",
                  "address": {
                  "@type": "PostalAddress",
                    "streetAddress": "25 avenue gambetta",
                    "addressLocality": "Albi",
                    "postalCode": "81000",
                    "addressCountry": "FR"
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": ${rating},
                    "reviewCount": ${reviews.length}
                  },
                  "review": ${reviewsArr}
                  }`
      }} />

    </Column>
  );
}
