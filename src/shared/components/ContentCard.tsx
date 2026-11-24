import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/modules/home/components/ArrowIcon";
import styles from "@/modules/home/projects.module.scss";

export function ContentGrid({
  children,
  columns = 3,
}: {
  children: ReactNode;
  columns?: 2 | 3;
}) {
  return (
    <ul className={`${styles.grid} ${columns === 2 ? styles.gridTwo : ""}`}>
      {children}
    </ul>
  );
}

type ContentCardProps = {
  href: string;
  title: string;
  ariaLabel: string;
  cta: string;
  summary?: string;
  image?: string;
  imageAlt?: string;
  tags?: string[];
  date?: string;
  dateTime?: string;
  index?: number;
  featured?: boolean;
  priority?: boolean;
};

export function ContentCard({
  href,
  title,
  ariaLabel,
  cta,
  summary,
  image,
  imageAlt = "",
  tags = [],
  date,
  dateTime,
  index,
  featured,
  priority,
}: ContentCardProps) {
  const sizes = featured
    ? "(max-width: 900px) 100vw, 60vw"
    : "(max-width: 900px) 100vw, 33vw";
  return (
    <li className={featured ? styles.featured : styles.item}>
      <article className={styles.card}>
        <Link href={href} className={styles.cardLink} aria-label={ariaLabel}>
          {(image || index !== undefined) && (
            <div className={styles.media}>
              {image ? (
                image.startsWith("/") ? (
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    sizes={sizes}
                    priority={priority}
                    className={styles.image}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={imageAlt}
                    className={styles.image}
                    loading={priority ? "eager" : "lazy"}
                  />
                )
              ) : (
                <div
                  className={styles.mediaFallback}
                  aria-hidden="true"
                  style={{ minHeight: 0 }}
                />
              )}
              {index !== undefined && (
                <span className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
            </div>
          )}
          <div className={styles.body}>
            {(date || tags.length > 0) && (
              <ul className={styles.tags}>
                {date && (
                  <li>
                    <time
                      className={styles.tag}
                      dateTime={dateTime}
                      style={{ display: "inline-block" }}
                    >
                      {date}
                    </time>
                  </li>
                )}
                {tags.slice(0, 3).map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            <h3 className={styles.title}>{title}</h3>
            {summary && <p className={styles.summary}>{summary}</p>}
            <span className={styles.more}>
              {cta}
              <ArrowIcon />
            </span>
          </div>
        </Link>
      </article>
    </li>
  );
}
