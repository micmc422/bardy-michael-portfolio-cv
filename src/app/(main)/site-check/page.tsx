import { redirect } from "next/navigation";
import { Button, Icon, Input, type IconName } from "@once-ui-system/core";
import { RevealFx } from "@once-ui-system/fx";
import { PageHeader, SectionHead } from "@/shared/components/PageHeader";
import { PageBlock, PageShell } from "@/shared/components/PageShell";
import styles from "@/shared/components/PageShell.module.scss";
import { baseURL } from "@/core/config";
import { siteCheck, person } from "@/core/config/content";
import Meta from "@/modules/seo/Meta";
import Schema from "@/modules/seo/Schema";
import { isValidUrl, normalizeUrl } from "@/core/utils/urlUtils";

export async function generateMetadata() {
  return Meta.generate({
    title: `${siteCheck.title} | ${person.name}`,
    description: siteCheck.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(siteCheck.title)}`,
    path: siteCheck.path,
  });
}

async function handleSubmit(formData: FormData) {
  "use server";

  const urlInput = formData.get("url") as string;
  if (!urlInput) {
    return;
  }

  const normalizedUrl = normalizeUrl(urlInput.trim());

  if (!isValidUrl(normalizedUrl)) {
    return;
  }

  const encodedUrl = encodeURIComponent(normalizedUrl);
  redirect(`/site-check/${encodedUrl}`);
}

export default function SiteCheckPage() {
  const categories = Object.entries(siteCheck.categories);
  return (
    <PageShell labelledBy="site-check-title">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={siteCheck.path}
        title={siteCheck.title}
        description={siteCheck.description}
        image={`${baseURL}/og?title=${encodeURIComponent(siteCheck.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/a-propos`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <PageHeader
        id="site-check-title"
        eyebrow="Audit gratuit"
        title={siteCheck.headline}
        lead={siteCheck.subline}
        align="center"
      />

      <form action={handleSubmit} className={styles.formPanel}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="url-input" className={styles.formLabel}>
              URL du site à analyser
            </label>
            <Input
              id="url-input"
              name="url"
              type="url"
              placeholder="https://exemple.com"
              required
              aria-describedby="url-help"
            />
          </div>
          <Button type="submit" variant="primary" size="l" prefixIcon="search">
            Analyser
          </Button>
        </div>
        <p id="url-help" className={styles.formHelp}>
          Entrez l&apos;URL complète de votre site (ex: https://monsite.fr)
        </p>
      </form>

      <PageBlock labelledBy="site-check-analyses-title">
        <SectionHead
          id="site-check-analyses-title"
          eyebrow="Périmètre"
          title="Ce que nous analysons"
          lead="Cinq familles de contrôles automatiques, notées sur 100, avec des recommandations concrètes."
        />
        <ul className={`${styles.grid} ${styles.auto}`}>
          {categories.map(([key, category], index) => (
            <li key={key} style={{ minWidth: 0 }}>
              <RevealFx translateY={12} delay={index * 0.05} fillWidth>
                <article className={styles.card} style={{ height: "100%" }}>
                  <span className={styles.cardIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.cardIcon}>
                    <Icon name={category.icon as IconName} onBackground="brand-strong" />
                  </span>
                  <h3 className={styles.cardTitle}>{category.title}</h3>
                  <p className={styles.cardText}>{category.description}</p>
                </article>
              </RevealFx>
            </li>
          ))}
        </ul>
      </PageBlock>
    </PageShell>
  );
}
