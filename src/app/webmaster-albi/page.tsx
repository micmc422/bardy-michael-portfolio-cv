"use server"

import {
  Avatar,
  Background,
  Badge,
  Card,
  Column,
  CompareImage,
  Grid,
  Heading,
  Icon,
  IconButton,
  Media,
  RevealFx,
  Row,
  Text
} from "@/once-ui/components";
import { baseURL } from "@/app/resources";


import { about, person, webmasterAlbi } from "@/app/resources/content";
import React from "react";
import { Meta, Schema } from "@/once-ui/modules";
import { siteTypes } from "../estimation/estimationData";
import { StepsComponent } from "@/components/steps/Steps";
import { Faq } from "@/components";
import type { opacity } from "@/once-ui/types";

export async function generateMetadata() {
  return Meta.generate({
    title: webmasterAlbi.title,
    description: webmasterAlbi.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(webmasterAlbi.title)}`,
    path: webmasterAlbi.path,
  });
}
export default async function About() {
  return (
    <>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={webmasterAlbi.path}
        title={webmasterAlbi.title}
        description={webmasterAlbi.description}
        image={`${baseURL}/og?title=${encodeURIComponent(webmasterAlbi.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${webmasterAlbi.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="xl" paddingY="24" gap="m">
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
            <Heading as="h1" wrap="balance" variant="display-strong-l">
              {webmasterAlbi.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {webmasterAlbi.subline}
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
        </Column>
      </Column>
      <Grid maxWidth={"l"} gap="l" columns={2} tabletColumns="1">
        <Column flex={2} gap="m" padding="l" fill>
          <Heading variant="display-strong-m" onBackground="brand-weak">Offrez une Nouvelle Vie à Votre Présence en Ligne</Heading>
          <Text onBackground="neutral-medium">
            Votre site web est le reflet de votre entreprise à <strong>Albi</strong>, et un design vieillissant ou des performances lentes peuvent nuire à votre image et à votre référencement. Il est temps de le moderniser ! Je vous propose des solutions de refonte adaptées à vos besoins, que vous souhaitiez une mise à jour esthétique ou une transformation technologique complète.
          </Text>
          <Text onBackground="neutral-medium">
            Que votre site ait simplement besoin d&apos;un coup de frais ou d&apos;une refonte en profondeur, je suis là pour vous accompagner. Voici comment nous pouvons redonner de l&apos;éclat et de l&apos;efficacité à votre plateforme digitale :
          </Text>
          <Column gap="s" background="overlay" radius="l" padding="m" border="neutral-alpha-weak" overflow="hidden" isolate>
            <Background
              zIndex={-1}
              fill
              position="absolute"
              mask={{
                cursor: true,
                x: 50,
                y: 25,
                radius: 70
              }}
              gradient={{
                display: true,
                opacity: 1 as opacity,
                x: 50,
                y: 0,
                colorStart: "accent-alpha-strong",
                colorEnd: "brand-alpha-weak"
              }}
            />
            <Heading as="h3" variant="display-default-xs" onBackground="brand-weak">
              Refonte Graphique Complète : Design et Technologie Modernisés
            </Heading>
            <Text onBackground="neutral-medium">
              Si votre site web ne répond plus aux standards actuels en termes d&apos;esthétique, d&apos;expérience utilisateur ou de performance, une refonte totale est la solution idéale. Nous repensons l&apos;intégralité de votre site, de son design à sa structure technique. L&apos;objectif est de créer une interface moderne et intuitive qui captive vos visiteurs et met en valeur vos services à <strong>Albi</strong>. Cela inclut une nouvelle charte graphique, une ergonomie optimisée et l&apos;intégration des dernières technologies pour un site rapide, sécurisé et parfaitement adapté aux mobiles.
            </Text>
          </Column>
          <Column gap="s" background="overlay" radius="l" padding="m" border="neutral-alpha-weak" overflow="hidden" isolate>
            <Background
              zIndex={-1}
              fill
              position="absolute"
              mask={{
                cursor: true,
                x: 50,
                y: 25,
                radius: 70
              }}
              gradient={{
                display: true,
                opacity: 1 as opacity,
                x: 50,
                y: 0,
                colorStart: "accent-alpha-strong",
                colorEnd: "brand-alpha-weak"
              }}
            />
            <Heading as="h3" variant="display-default-xs" onBackground="brand-weak">
              Modernisation avec WordPress Headless et React : Le Meilleur des Deux Mondes
            </Heading>
            <Text onBackground="neutral-medium">
              Vous appréciez la facilité d&apos;édition de votre ancien site WordPress mais rêvez d&apos;une expérience utilisateur ultra-rapide et moderne pour vos visiteurs ? La solution WordPress Headless couplée à une interface en React est faite pour vous.
            </Text>
          </Column>
        </Column>
        <Column flex={2} overflow="hidden" center>
          <CompareImage
            fillWidth
            radius="xl"
            maxWidth={"xs"}
            fill
            border="neutral-alpha-weak"
            overflow="hidden"
            minHeight={32}
            // aspectRatio="5 / 10"
            leftContent={{ src: "/images/enduitsancien.png", alt: "Exemple design viellisant." }}
            rightContent={{ src: "/images/enduitsancien_v2.png", alt: "Design mis à jour." }}
          />
        </Column>
      </Grid>
      <Column maxWidth={"xl"} gap="l" paddingTop="xl" center>
        <Column gap="m" center maxWidth={"s"}>
          <Heading variant="display-strong-m" align="center">SEO Approfondi : Au-delà des Bases pour une Visibilité Maximale</Heading>
          <Text variant="body-default-l" onBackground="neutral-weak" align="center">Pour qu&apos;un site se distingue sur les moteurs de recherche et les réseaux sociaux, il faut aller au-delà du contenu visible. L&apos;optimisation des métadonnées, l&apos;intégration des Open Graph et l&apos;utilisation des JSON-LD sont cruciales pour une présence en ligne performante à <strong>Albi</strong>.</Text>
        </Column>
        <Row tabletDirection="column" radius="s" background="overlay" overflow="hidden" isolate>
          <Background
            zIndex={-1}
            fill
            position="absolute"
            mask={{
              cursor: true,
              x: 50,
              y: 25,
              radius: 70
            }}
            gradient={{
              display: true,
              opacity: 1 as opacity,
              x: 50,
              y: 0,
              colorStart: "accent-alpha-medium",
              colorEnd: "accent-alpha-weak"
            }}
          />
          <Column gap="xs" padding="m" isolate>
            <Heading as="h3" variant="body-strong-xl" onBackground="accent-weak">Meta Descriptions & Title Tags</Heading>
            <Text>Les métadonnées historiques comme la balise {`<title>`} et la méta-description sont les premières informations que Google et les utilisateurs voient de votre page.</Text>
            <ul>
              <li>Bénéfice : Elles influencent directement le taux de clics (CTR) depuis les pages de résultats de recherche (SERP). Un titre accrocheur et une description pertinente incitent davantage les internautes à visiter votre site plutôt que celui d&apos;un concurrent à <strong>Albi</strong>.</li>
              <li>Intérêt : Elles sont la carte de visite de votre contenu, signalant clairement aux moteurs de recherche le sujet de votre page et donnant envie aux utilisateurs de découvrir ce que vous proposez.</li>
            </ul>
          </Column>
          <Column gap="xs" padding="m" isolate>
            <Heading as="h3" variant="body-strong-xl" onBackground="accent-weak">Données Open Graph (OG)</Heading>
            <Text>Les données Open Graph sont un protocole développé par Facebook, mais largement adopté par tous les réseaux sociaux (LinkedIn, Twitter, etc.). Elles permettent de contrôler précisément l&apos;apparence de votre contenu lorsqu&apos;il est partagé en ligne.</Text>
            <ul>
              <li>Bénéfice : Elles garantissent un affichage attrayant et cohérent de vos liens partagés, avec une image, un titre et une description choisis par vous. Cela augmente l&apos;engagement et la visibilité de votre entreprise d&apos;<strong>Albi</strong> sur les plateformes sociales.</li>
              <li>Intérêt : Sans elles, les réseaux sociaux peuvent choisir une image ou un texte non pertinents, ce qui réduit l&apos;impact de votre partage. Les données OG assurent un branding optimal et une meilleure attractivité.</li>
            </ul>
          </Column>
          <Column gap="xs" padding="m" isolate>
            <Heading as="h3" variant="body-strong-xl" onBackground="accent-weak">Données Structurées (JSON-LD)</Heading>
            <Text>Les données structurées JSON-LD sont un format recommandé par Google pour fournir des informations spécifiques sur le contenu de votre page de manière compréhensible pour les moteurs de recherche. Elles permettent d&apos;obtenir des Rich Snippets (extraits enrichis) dans les résultats de recherche.</Text>
            <ul>
              <li>Bénéfice : Elles améliorent la visibilité de votre site sur les SERP grâce à des étoiles d&apos;évaluation, des prix, des horaires ou d&apos;autres détails pertinents directement sous votre lien. Cela augmente considérablement votre CTR et votre crédibilité pour les recherches effectuées à <strong>Albi</strong>.</li>
              <li>Intérêt : Ces informations supplémentaires captent l&apos;attention des utilisateurs et leur donnent une meilleure idée de ce qu&apos;ils trouveront sur votre page avant même de cliquer, favorisant un trafic plus qualifié.</li>
            </ul>
          </Column>
        </Row>
      </Column>
      <Column maxWidth={"l"} gap="m" paddingTop="xl" center>
        <Column gap="s" maxWidth={"xs"} center>
          <Heading variant="display-strong-s">Services</Heading>
          <Text variant="body-default-l" onBackground="neutral-weak" align="center">De la création sur mesure (site vitrine, e-commerce, portfolio…) à la gestion quotidienne (mise à jour, sécurité, sauvegardes), je vous accompagne pour garantir la fiabilité et l’efficacité de votre présence en ligne. J’assure également l’optimisation des performances (vitesse, SEO, responsive design) afin d’offrir à vos visiteurs une expérience fluide et engageante, tout en maximisant votre visibilité sur les moteurs de recherche.</Text>
        </Column>
        <Grid columns={"3"} tabletColumns={"2"} mobileColumns={"1"} gap="xs">
          {siteTypes.map((service, i) => <Card key={i} radius="s-4" direction="column" border="neutral-alpha-medium" fillWidth href={`/estimation/${service.slug}`}>
            <Media src={`/og?type=estimation&slug=${service.slug}`} fillWidth aspectRatio="16/8" topLeftRadius="s" topRightRadius="s" />
            <Column fillWidth paddingX="20" paddingY="12" gap="8" vertical="center">
              <Heading as="h3" variant="body-strong-xl" onBackground="accent-weak">{service.name}</Heading>
              <Text variant="label-default-s">{service.description}</Text>
              <Column gap="4">{service.includes.map((inclu, i) => <Row key={i} vertical="center" gap="4">
                <Icon name="checkCircle" onBackground="success-medium" size="xs" />
                <Text variant="label-default-xs" onBackground="neutral-weak">{inclu}</Text></Row>)}</Column>
            </Column>
          </Card>)}
        </Grid>
      </Column>
      <Column maxWidth={"l"} gap="m" paddingTop="xl" center>
        <Column gap="s" maxWidth={"xs"} center>
          <Heading variant="display-strong-s" align="center">Pourquoi Choisir Votre Webmaster à <strong>Albi</strong> ?</Heading>
          <Text variant="body-default-l" onBackground="neutral-weak" align="center">Choisir le bon partenaire digital est essentiel pour le succès de votre entreprise. En tant que webmaster basé à Albi, je ne me contente pas de créer des sites web ; je construis des solutions digitales adaptées aux spécificités de notre belle ville du Tarn. Découvrez pourquoi faire appel à un expert local fait toute la différence pour propulser votre visibilité en ligne et atteindre vos objectifs commerciaux, ici même, à Albi.</Text>
        </Column>
        <Grid columns={"4"} tabletColumns={2} mobileColumns={1} gap="xs" maxWidth={"l"}>
          {webmasterAlbi.pourquoi.map((service, i) => <Column key={i} maxWidth={30} paddingX="20" paddingY="12" gap="8" background="overlay" padding="xs" vertical="center" radius="xs">
            <Column gap="l">
              <Heading as="h3" variant="label-strong-xl" onBackground="accent-weak">{service.titre}</Heading>
            </Column>
            <Text variant="label-default-m">{service.description}</Text>
            <Column gap="4">{service.mots_cles_seo.map((inclu, i) => <Row key={i} gap="4">
              <Icon name="checkCircle" onBackground="success-medium" size="xs" />
              <Text variant="label-default-s" onBackground="neutral-weak">{inclu}</Text></Row>)}</Column>
          </Column>)}
        </Grid>
      </Column>
      <Column maxWidth={"l"} gap="m" paddingTop="xl" center>
        <Column gap="s" maxWidth={"xs"} center>
          <Heading variant="display-strong-s" align="center">{webmasterAlbi.process.title}</Heading>
          <Text variant="body-default-l" onBackground="neutral-weak" align="center">Pour vous garantir une collaboration fluide et des résultats à la hauteur de vos attentes, voici les étapes clés de notre processus de travail. De la première prise de contact à la livraison de votre projet web et au-delà, chaque phase est pensée pour l’efficacité et la transparence.</Text>
        </Column>
        <StepsComponent maxWidth={"xs"} data-props={JSON.stringify({ steps: webmasterAlbi.process.steps })} />
        <Faq maxWidth={"xs"} data-props={JSON.stringify(webmasterAlbi.faq)} />
      </Column>
    </>
  );
}
