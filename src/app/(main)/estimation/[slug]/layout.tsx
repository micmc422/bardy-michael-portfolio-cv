import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { baseURL } from "@/core/config";
import { estimation, person } from "@/core/config/content";
import { EstimationSteps, ResumePanel, SiteTypeNav } from "@/modules/estimation/components";
import styles from "@/modules/estimation/estimation.module.scss";
import { siteTypes } from "@/modules/estimation/models/estimationData";
import Meta from "@/modules/seo/Meta";
import Schema from "@/modules/seo/Schema";
import { PageHeader } from "@/shared/components/PageHeader";
import panel from "@/shared/components/PageHeader.module.scss";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return siteTypes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const activeSite = siteTypes.find((site) => site.slug === slug);
  if (!activeSite) notFound();
  return Meta.generate({
    title: `Estimation : ${activeSite.name} | occitaweb.fr`,
    description: activeSite.description,
    baseURL,
    image: `${baseURL}/og?type=estimation&slug=${activeSite.slug}`,
    path: `${estimation.path}/${slug}`,
  });
}

export default async function EstimationSlugLayout({ children, params }: Params & { children: ReactNode }) {
  const { slug } = await params;
  const activeSite = siteTypes.find((site) => site.slug === slug);
  if (!activeSite) notFound();

  return (
    <>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`${estimation.path}/${slug}`}
        title={`Estimation : ${activeSite.name}`}
        description={activeSite.description}
        image={`${baseURL}/og?type=estimation&slug=${slug}`}
        author={{
          name: person.name,
          url: `${baseURL}${estimation.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Schema
        as="service"
        title={activeSite.name}
        description={activeSite.description}
        path={`estimation/${activeSite.slug}`}
        offerSlug={activeSite.slug}
      />
      <section className={styles.block} aria-labelledby="estimation-headline">
        <PageHeader
          id="estimation-headline"
          align="center"
          eyebrow="Estimation en ligne"
          title={`Estimation : ${activeSite.name}`}
          lead={activeSite.description}
        />
        <EstimationSteps current={2} />
        <SiteTypeNav activeSlug={slug} />
        <div className={styles.workspace}>
          <div className={`${panel.panel} ${styles.form}`}>
            <Suspense>{children}</Suspense>
          </div>
          <aside className={`${panel.panel} ${styles.aside}`} aria-label="Résumé de l'estimation">
            <Suspense>
              <ResumePanel slug={slug} />
            </Suspense>
          </aside>
        </div>
      </section>
    </>
  );
}
