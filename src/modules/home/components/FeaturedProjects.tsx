import Image from "next/image";
import Link from "next/link";
import { work } from "@/core/config";
import { getProjects } from "@/modules/blog/controllers/serverActions";
import { SectionHead } from "./SectionHead";
import { ArrowIcon } from "./ArrowIcon";
import styles from "../projects.module.scss";

const MAX_PROJECTS = 4;

export async function FeaturedProjects() {
  const projects = await getProjects({});
  const items = [...projects]
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt as string).getTime() -
        new Date(a.metadata.publishedAt as string).getTime(),
    )
    .slice(0, MAX_PROJECTS);

  if (items.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="realisations-title">
      <SectionHead
        eyebrow="Réalisations"
        titleId="realisations-title"
        title="Des projets concrets, livrés et en production."
        lead="Sites vitrines, plateformes et applications web : une sélection de projets conçus pour la performance et la durée."
        action={
          <Link href={work.path} className={styles.sectionLink}>
            Tous les projets
            <ArrowIcon />
          </Link>
        }
      />

      <ul className={styles.grid}>
        {items.map((project, index) => {
          const image = project.metadata.images?.[0];
          const tags = (project.metadata.tags ?? []) as { id: string; name: string }[];
          return (
            <li key={project.slug} className={index === 0 ? styles.featured : styles.item}>
              <article className={styles.card}>
                <Link
                  href={`${work.path}/${project.slug}`}
                  className={styles.cardLink}
                  aria-label={`Voir le projet : ${project.metadata.title}`}
                >
                  <div className={styles.media}>
                    {image ? (
                      image.startsWith("/") ? (
                        <Image
                          src={image}
                          alt={`Aperçu du projet ${project.metadata.title}`}
                          fill
                          sizes={index === 0 ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 900px) 100vw, 33vw"}
                          priority={index === 0}
                          className={styles.image}
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={`Aperçu du projet ${project.metadata.title}`}
                          className={styles.image}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      )
                    ) : (
                      <div className={styles.mediaFallback} aria-hidden="true" />
                    )}
                    <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className={styles.body}>
                    {tags.length > 0 && (
                      <ul className={styles.tags} aria-label="Technologies et domaines">
                        {tags.slice(0, 3).map((tag) => (
                          <li key={tag.id} className={styles.tag}>
                            {tag.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <h3 className={styles.title}>{String(project.metadata.title)}</h3>
                    {project.metadata.summary && <p className={styles.summary}>{String(project.metadata.summary)}</p>}
                    <span className={styles.more}>
                      Détails du projet
                      <ArrowIcon />
                    </span>
                  </div>
                </Link>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
