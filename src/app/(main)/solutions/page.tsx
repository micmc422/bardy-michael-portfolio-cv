import Link from "next/link";
import { Check } from "lucide-react";
import { Button, Icon, type IconName } from "@once-ui-system/core";
import { RevealFx } from "@once-ui-system/fx";
import { about, baseURL } from "@/core/config";
import { person, solutionsWeb } from "@/core/config/content";
import Meta from "@/modules/seo/Meta";
import Schema from "@/modules/seo/Schema";
import { ArrowIcon } from "@/modules/home/components/ArrowIcon";
import home from "@/modules/home/home.module.scss";
import { PageHeader, SectionHead } from "@/shared/components/PageHeader";
import { PageBlock, PageShell } from "@/shared/components/PageShell";
import styles from "@/shared/components/PageShell.module.scss";

export async function generateMetadata() {
  return Meta.generate({
    title: solutionsWeb.title,
    description: solutionsWeb.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(solutionsWeb.title)}`,
    path: solutionsWeb.path,
  });
}

export default function SolutionsPage() {
  return (
    <PageShell labelledBy="solutions-hero-title">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={solutionsWeb.path}
        title={solutionsWeb.title}
        description={solutionsWeb.description}
        image={`${baseURL}/og?title=${encodeURIComponent(solutionsWeb.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${solutionsWeb.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <PageHeader
        id="solutions-hero-title"
        eyebrow="Solutions sur mesure"
        title={solutionsWeb.headline}
        lead={solutionsWeb.subline}
      >
        <Button href={about.calendar.link} prefixIcon="calendar" variant="primary" size="l">
          Planifier un échange
        </Button>
        <Button href="/estimation" variant="secondary" size="l">
          Estimer mon projet
        </Button>
      </PageHeader>

      <PageBlock labelledBy="fonctionnalites-section-title">
        <SectionHead
          id="fonctionnalites-section-title"
          eyebrow="Fonctionnalités"
          title="Des fonctionnalités ciblées pour booster votre activité."
          lead="Chaque activité a ses spécificités. Formulaire de devis, prise de rendez-vous, catalogue, espace client, automatisations : des outils concrets pour gagner du temps et offrir une meilleure expérience à vos utilisateurs."
        />
        <ul className={`${styles.grid} ${styles.cols2}`}>
          {solutionsWeb.pourquoi.map((item, index) => (
            <li key={item?.titre ?? index} style={{ minWidth: 0 }}>
              <RevealFx translateY={12} delay={index * 0.05} fillWidth>
                <article className={styles.card} style={{ height: "100%" }}>
                  <span className={styles.cardIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.cardIcon}>
                    <Icon name={(item?.icone || "check") as IconName} onBackground="brand-strong" />
                  </span>
                  <h3 className={styles.cardTitle}>{item?.titre}</h3>
                  <p className={styles.cardText}>{item?.description}</p>
                  <ul className={styles.checks}>
                    {item?.fonctions?.map((fonction, idx) => (
                      <li key={idx}>
                        <Check size={16} aria-hidden="true" />
                        <span>{fonction}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealFx>
            </li>
          ))}
        </ul>
      </PageBlock>

      <section className={home.band} aria-labelledby="hebergement-section-title">
        <div className={home.bandCopy}>
          <span className={home.eyebrow}>Hébergement</span>
          <h2 id="hebergement-section-title" className={home.bandTitle}>
            Votre site, toujours rapide. Toujours en ligne.
          </h2>
          <p className={home.sectionLead}>
            Grâce à un hébergement cloud dernière génération (Vercel), vos pages se chargent instantanément, même aux
            heures de pointe : plus de conversions, une meilleure image, zéro stress côté technique.
          </p>
        </div>
        <Link href="/solutions/hebergement" className={home.bandLink}>
          Solutions d&apos;hébergement
          <ArrowIcon />
        </Link>
      </section>
    </PageShell>
  );
}
