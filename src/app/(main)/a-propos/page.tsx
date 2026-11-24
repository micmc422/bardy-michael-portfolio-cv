import { Avatar, Button, Icon, IconButton, Media, Row, Skeleton, type IconName } from "@once-ui-system/core";
import { RevealFx } from "@once-ui-system/fx";
import dynamic from "next/dynamic";
import React from "react";
import Meta from "@/modules/seo/Meta";
import { baseURL } from "@/core/config";
import { person, about, social } from "@/core/config/content";
import { PageHeader, SectionHead } from "@/shared/components/PageHeader";
import { PageBlock, PageShell } from "@/shared/components/PageShell";
import styles from "@/shared/components/PageShell.module.scss";

const TableOfContents = dynamic(() => import("@/modules/blog/components/TableOfContents"), {
  loading: () => (
    <Row>
      <Skeleton shape="line" width="160" />
    </Row>
  ),
});

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

type ImageItem = { src: string; alt: string; width: number; height: number };

function CardImages({ images }: { images?: ImageItem[] }) {
  const valid = (images ?? []).filter((image) => image?.src);
  if (valid.length === 0) return null;
  return (
    <div className={styles.cardImages}>
      {valid.map((image, index) => (
        <Row
          key={index}
          border="neutral-medium"
          radius="m"
          minWidth={`${image.width}rem`}
          height={`${image.height}rem`}
        >
          <Media enlarge radius="m" sizes={image.width.toString()} alt={image.alt} src={image.src} />
        </Row>
      ))}
    </div>
  );
}

export default async function About() {
  const structure = [
    { title: about.intro.title, display: about.intro.display, items: [] },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((institution) => institution.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((skill) => skill.title),
    },
  ];

  return (
    <PageShell narrow labelledBy="about-title">
      {about.tableOfContent.display && (
        <aside
          aria-label="Sommaire"
          className="hide-below-xl"
          style={{ position: "fixed", left: 0, top: "50%", transform: "translateY(-50%)", paddingLeft: 24, zIndex: 5 }}
        >
          <TableOfContents structure={structure} about={about} />
        </aside>
      )}

      <div id={about.intro.title} style={{ scrollMarginTop: "6rem" }}>
        {about.avatar.display && (
          <div className={styles.avatarWrap}>
            <Avatar src={person.avatar} size="xl" />
          </div>
        )}
        <PageHeader
          id="about-title"
          eyebrow="À propos"
          title={person.name}
          lead={person.role}
          align="center"
        >
          {about.calendar.display && (
            <Button href={about.calendar.link} prefixIcon="calendar" variant="primary" size="l">
              Planifier un RDV
            </Button>
          )}
          {social
            .filter((item) => item.essential && item.link)
            .map((item) => (
              <IconButton
                key={item.name}
                href={item.link}
                icon={item.icon as IconName}
                variant="secondary"
                size="l"
                tooltip={item.name}
                aria-label={item.name}
              />
            ))}
        </PageHeader>
        <div className={styles.profile}>
          <span className={styles.profileItem}>
            <Icon onBackground="brand-strong" name="globe" />
            {person.location}
          </span>
          {person.languages?.map((language) => (
            <span key={language} className={styles.chip}>
              {language}
            </span>
          ))}
        </div>
      </div>

      {about.intro.display && (
        <PageBlock labelledBy="about-intro-title">
          <SectionHead id="about-intro-title" eyebrow="Présentation" title="Qui suis-je ?" />
          <div className={styles.cardText} style={{ fontSize: "1.1rem" }}>
            {about.intro.description}
          </div>
        </PageBlock>
      )}

      {about.work.display && (
        <PageBlock labelledBy={about.work.title}>
          <SectionHead id={about.work.title} eyebrow="Parcours" title={about.work.title} />
          <ol className={styles.stack}>
            {about.work.experiences.map((experience, index) => (
              <li key={`${experience.company}-${experience.role}-${index}`}>
                <RevealFx translateY={12} fillWidth>
                  <article className={styles.card}>
                    <div className={styles.cardHead}>
                      <h3 id={experience.company} className={styles.cardTitle} style={{ fontSize: "1.4rem" }}>
                        {experience.company}
                      </h3>
                      <span className={styles.cardMeta}>{experience.timeframe}</span>
                    </div>
                    <p className={styles.cardRole}>{experience.role}</p>
                    <ul className={styles.bullets}>
                      {experience.achievements.map((achievement: React.ReactNode, i: number) => (
                        <li key={`${experience.company}-${i}`}>{achievement}</li>
                      ))}
                    </ul>
                    <CardImages images={experience.images as ImageItem[] | undefined} />
                  </article>
                </RevealFx>
              </li>
            ))}
          </ol>
        </PageBlock>
      )}

      {about.studies.display && (
        <PageBlock labelledBy={about.studies.title}>
          <SectionHead id={about.studies.title} eyebrow="Formation" title={about.studies.title} />
          <ul className={`${styles.grid} ${styles.auto}`}>
            {about.studies.institutions.map((institution, index) => (
              <li key={`${institution.name}-${index}`} style={{ minWidth: 0 }}>
                <article className={styles.card} style={{ height: "100%" }}>
                  <span className={styles.cardIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 id={institution.name} className={styles.cardTitle}>
                    {institution.name}
                  </h3>
                  <p className={styles.cardText}>{institution.description}</p>
                </article>
              </li>
            ))}
          </ul>
        </PageBlock>
      )}

      {about.technical.display && (
        <PageBlock labelledBy={about.technical.title}>
          <SectionHead id={about.technical.title} eyebrow="Stack" title={about.technical.title} />
          <ul className={`${styles.grid} ${styles.auto}`}>
            {about.technical.skills.map((skill, index) => (
              <li key={`${skill.title}-${index}`} style={{ minWidth: 0 }}>
                <article className={styles.card} style={{ height: "100%" }}>
                  <h3 id={skill.title} className={styles.cardTitle}>
                    {skill.title}
                  </h3>
                  <p className={styles.cardText}>{skill.description}</p>
                  {skill.tags && skill.tags.length > 0 && (
                    <ul className={styles.chips}>
                      {skill.tags.map((tag, tagIndex) => (
                        <li key={`${skill.title}-${tagIndex}`} className={styles.chip}>
                          {tag.name}
                        </li>
                      ))}
                    </ul>
                  )}
                  <CardImages images={skill.images as ImageItem[] | undefined} />
                </article>
              </li>
            ))}
          </ul>
        </PageBlock>
      )}
    </PageShell>
  );
}
