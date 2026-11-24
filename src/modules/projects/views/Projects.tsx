import { Skeleton } from "@once-ui-system/core";
import { use } from "react";
import { getProjects } from "@/modules/blog/controllers/serverActions";
import { work } from "@/core/config";
import { ContentCard, ContentGrid } from "@/shared/components/ContentCard";
import styles from "@/modules/home/projects.module.scss";

interface ProjectsProps {
  range?: [number, number?];
}

export function Projects({ range }: ProjectsProps) {
  const projects = use(getProjects({}));
  const sortedProjects = [...projects].sort(
    (a, b) =>
      new Date(b.metadata.publishedAt as string).getTime() - new Date(a.metadata.publishedAt as string).getTime(),
  );
  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: work.title,
    description: work.description,
    itemListOrder: "https://schema.org/ItemListOrderUnordered",
    numberOfItems: displayedProjects.length,
    itemListElement: displayedProjects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: p.metadata.title,
        url: p.metadata.projectURL,
        description: p.metadata.summary,
        image: p.metadata.image,
      },
    })),
  };

  return (
    <>
      <ContentGrid>
        {displayedProjects.map((project, index) => {
          const tags = ((project.metadata.tags ?? []) as { id: string; name: string }[]).map((tag) => tag.name);
          return (
            <ContentCard
              key={project.slug}
              href={`${work.path}/${project.slug}`}
              ariaLabel={`Voir le projet : ${project.metadata.title}`}
              title={String(project.metadata.title)}
              summary={project.metadata.summary ? String(project.metadata.summary) : undefined}
              image={project.metadata.images?.[0]}
              imageAlt={`Aperçu du projet ${project.metadata.title}`}
              tags={tags}
              cta="Détails du projet"
              index={index}
              featured={index === 0}
              priority={index === 0}
            />
          );
        })}
      </ContentGrid>
      <script
        id="projects-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}

export function SkeletonProjects() {
  return (
    <ul className={styles.grid} aria-hidden="true">
      {[0, 1, 2].map((el) => (
        <li key={el} className={el === 0 ? styles.featured : styles.item}>
          <Skeleton shape="block" fillWidth minHeight="20" style={{ borderRadius: "var(--radius-xl)" }} />
        </li>
      ))}
    </ul>
  );
}
