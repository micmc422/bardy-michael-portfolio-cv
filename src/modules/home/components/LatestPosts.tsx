import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/modules/blog/controllers/serverActions";
import { SectionHead } from "./SectionHead";
import { ArrowIcon } from "./ArrowIcon";
import styles from "../projects.module.scss";

const MAX_POSTS = 2;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export async function LatestPosts() {
  const posts = await getPosts({ limit: 10 });
  const items = [...posts]
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt as string).getTime() -
        new Date(a.metadata.publishedAt as string).getTime(),
    )
    .slice(0, MAX_POSTS);

  if (items.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="blog-title">
      <SectionHead
        eyebrow="Journal"
        titleId="blog-title"
        title="Dernières actualités."
        lead="Retours d'expérience, bonnes pratiques et veille sur le développement web."
        action={
          <Link href="/blog" className={styles.sectionLink}>
            Tous les articles
            <ArrowIcon />
          </Link>
        }
      />

      <ul className={`${styles.grid} ${styles.gridTwo}`}>
        {items.map((post) => {
          const image = post.metadata.image;
          const published = post.metadata.publishedAt
            ? dateFormatter.format(new Date(post.metadata.publishedAt as string))
            : null;
          return (
            <li key={post.slug} className={styles.item}>
              <article className={styles.card}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={styles.cardLink}
                  aria-label={`Lire l'article : ${String(post.metadata.title)}`}
                >
                  <div className={styles.media}>
                    {image && image.startsWith("/") ? (
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                        className={styles.image}
                      />
                    ) : image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="" className={styles.image} loading="lazy" />
                    ) : (
                      <div className={styles.mediaFallback} aria-hidden="true" />
                    )}
                  </div>
                  <div className={styles.body}>
                    {published && (
                      <time className={styles.tag} dateTime={String(post.metadata.publishedAt)} style={{ alignSelf: "flex-start" }}>
                        {published}
                      </time>
                    )}
                    <h3 className={styles.title}>{String(post.metadata.title)}</h3>
                    {post.metadata.summary && <p className={styles.summary}>{String(post.metadata.summary)}</p>}
                    <span className={styles.more}>
                      Lire l&apos;article
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
