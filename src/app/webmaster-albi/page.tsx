"use server"

import {
  Avatar,
  Badge,
  Card,
  Column,
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


import { about, home, person, webmasterAlbi } from "@/app/resources/content";
import React from "react";
import { Meta, Schema } from "@/once-ui/modules";
import { siteTypes } from "../estimation/estimationData";
import { StepsComponent } from "@/components/steps/Steps";
import { Faq } from "@/components";

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
      <Column maxWidth={"l"} gap="m" paddingTop="xl" center>
        <Column gap="s" maxWidth={"xs"} center>
          <Heading variant="display-strong-s">Services</Heading>
          <Text variant="label-default-l" onBackground="neutral-medium" align="center">De la création sur mesure (site vitrine, e-commerce, portfolio…) à la gestion quotidienne (mise à jour, sécurité, sauvegardes), je vous accompagne pour garantir la fiabilité et l’efficacité de votre présence en ligne. J’assure également l’optimisation des performances (vitesse, SEO, responsive design) afin d’offrir à vos visiteurs une expérience fluide et engageante, tout en maximisant votre visibilité sur les moteurs de recherche.</Text>
        </Column>
        <Grid columns={"3"} tabletColumns={"2"} mobileColumns={"1"} gap="xs">
          {siteTypes.map((service, i) => <Card key={i} radius="s-4" direction="column" border="neutral-alpha-medium" fillWidth href={`/estimation/${service.slug}`}>
            <Media src={`/og?type=estimation&slug=${service.slug}`} fillWidth aspectRatio="16/8" topLeftRadius="s" topRightRadius="s" />
            <Column fillWidth paddingX="20" paddingY="12" gap="8" vertical="center">
              <Heading as="h3">{service.name}</Heading>
              <Text variant="label-default-s">{service.description}</Text>
              <Column gap="4">{service.includes.map((inclu, i) => <Row key={i} vertical="center" gap="4">
                <Icon name="checkCircle" onBackground="success-medium" size="xs" />
                <Text variant="label-default-s" onBackground="neutral-weak">{inclu}</Text></Row>)}</Column>
            </Column>
          </Card>)}
        </Grid>
      </Column>
      <Column maxWidth={"l"} gap="m" paddingTop="xl" center>
        <Column gap="s" maxWidth={"xs"} center>
          <Heading variant="display-strong-s" align="center">Pourquoi Choisir Votre Webmaster à Albi ?</Heading>
          <Text variant="label-default-l" onBackground="neutral-medium" align="center">Choisir le bon partenaire digital est essentiel pour le succès de votre entreprise. En tant que webmaster basé à Albi, je ne me contente pas de créer des sites web ; je construis des solutions digitales adaptées aux spécificités de notre belle ville du Tarn. Découvrez pourquoi faire appel à un expert local fait toute la différence pour propulser votre visibilité en ligne et atteindre vos objectifs commerciaux, ici même, à Albi.</Text>
        </Column>
        <Grid columns={"4"} tabletColumns={2} mobileColumns={1} gap="xs" maxWidth={"l"}>
          {webmasterAlbi.pourquoi.map((service, i) => <Column key={i} maxWidth={30} paddingX="20" paddingY="12" gap="8" vertical="center">
            <Column gap="l">
              <Heading as="h3">{service.titre}</Heading>
            </Column>
            <Text variant="label-default-s">{service.description}</Text>
            <Column gap="4">{service.mots_cles_seo.map((inclu, i) => <Row key={i} gap="4">
              <Icon name="checkCircle" onBackground="success-medium" size="xs" />
              <Text variant="label-default-s" onBackground="neutral-weak">{inclu}</Text></Row>)}</Column>
          </Column>)}
        </Grid>
      </Column>
      <Column maxWidth={"l"} gap="m" paddingTop="xl" center>
        <Column gap="s" maxWidth={"xs"} center>
          <Heading variant="display-strong-s" align="center">{webmasterAlbi.process.title}</Heading>
          <Text variant="label-default-l" onBackground="neutral-medium" align="center">Pour vous garantir une collaboration fluide et des résultats à la hauteur de vos attentes, voici les étapes clés de notre processus de travail. De la première prise de contact à la livraison de votre projet web et au-delà, chaque phase est pensée pour l'efficacité et la transparence.</Text>
        </Column>
          <StepsComponent maxWidth={"xs"} data-props={JSON.stringify({ steps: webmasterAlbi.process.steps })} />
        <Faq data-props={JSON.stringify(webmasterAlbi.faq)} />
      </Column>
    </>
  );
}
