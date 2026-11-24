"use server"

import { Column } from "@once-ui-system/core";
import Meta from "@/modules/seo/Meta";
import { baseURL, routes } from "@/core/config";
import { home, about, person } from "@/core/config/content";
import { Faq } from "@/shared/components";
import { AvisClient } from "@/shared/components/AvisClients";
import { Tarifs } from "@/modules/estimation/views/Tarifs";
import Schema from "@/modules/seo/Schema";
import { Hero, Metrics, Expertise, TechStack, Process, GlobeSection, PerformanceCharts, FeaturedProjects, LatestPosts, Solutions } from "@/modules/home";


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
      <GlobeSection />
      <Expertise />
      <PerformanceCharts />
      <TechStack />
      <Process />
      <FeaturedProjects />
      {routes["/blog"] && <LatestPosts />}
      <Solutions />
      <Tarifs />
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
