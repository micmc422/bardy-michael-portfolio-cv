"use server"

import { Column } from "@once-ui-system/core";
import Meta from "@/modules/seo/Meta";
import { baseURL, routes } from "@/core/config";
import { home, about, person } from "@/core/config/content";
import { AvisClient } from "@/shared/components/AvisClients";
import { Tarifs } from "@/modules/estimation/views/Tarifs";
import Schema from "@/modules/seo/Schema";
import { Hero, Metrics, Expertise, TechStack, Process, GlobeSection, PerformanceCharts, FeaturedProjects, LatestPosts, Solutions, FaqSection } from "@/modules/home";


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
      <AvisClient />
      <FaqSection />
    </>
  );
}
