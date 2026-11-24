import { baseURL } from "@/core/config";
import { about, estimation, person } from "@/core/config/content";
import { EstimationSteps, SiteTypeCard } from "@/modules/estimation/components";
import styles from "@/modules/estimation/estimation.module.scss";
import { siteTypes } from "@/modules/estimation/models/estimationData";
import Meta from "@/modules/seo/Meta";
import Schema from "@/modules/seo/Schema";
import { PageHeader } from "@/shared/components/PageHeader";

export async function generateMetadata() {
  return Meta.generate({
    title: `${estimation.title} | occitaweb.fr`,
    description: estimation.description,
    baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(estimation.title)}`,
    path: estimation.path,
  });
}

export default function EstimationPage() {
  return (
    <>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={estimation.path}
        title={estimation.title}
        description={estimation.description}
        image={`${baseURL}/og?title=${encodeURIComponent(estimation.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <section className={styles.block} aria-labelledby="estimation-page-title">
        <PageHeader
          id="estimation-page-title"
          align="center"
          eyebrow="Estimation en ligne"
          title="Estimez votre projet web en quelques clics."
          lead="Choisissez le type de site, ajustez les options et obtenez une fourchette de prix transparente, sans engagement."
        />
        <EstimationSteps current={1} />
        <div className={styles.typeGrid}>
          {siteTypes.map((site) => (
            <SiteTypeCard key={site.slug} {...site} />
          ))}
        </div>
        {siteTypes.map(({ name, slug, description }) => (
          <Schema key={slug} as="service" title={name} description={description} path={`estimation/${slug}`} offerSlug={slug} />
        ))}
      </section>
    </>
  );
}
