import { Skeleton } from "@once-ui-system/core";
import { getPosts } from "@/modules/blog/controllers/serverActions";
import { ContentCard, ContentGrid } from "@/shared/components/ContentCard";
import styles from "@/modules/home/projects.module.scss";

interface PostsProps {
  range?: [number] | [number, number];
  tags?: string[];
  featured?: boolean;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

async function fetchPosts(tags?: string[]) {
  const data = await getPosts({ tags, limit: 0 });
  return data.sort(
    (a: any, b: any) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );
}

export async function Posts({ range, tags, featured = false }: PostsProps) {
  const sortedPosts = await fetchPosts(tags);
  const posts = range
    ? sortedPosts.slice(range[0] - 1, range.length === 2 ? range[1] : sortedPosts.length)
    : sortedPosts;

  if (posts.length === 0) {
    return <p style={{ color: "var(--neutral-on-background-weak)" }}>Aucun article pour le moment.</p>;
  }

  return (
    <ContentGrid>
      {posts.map((post: any, index: number) => {
        const published = post.metadata.publishedAt ? dateFormatter.format(new Date(post.metadata.publishedAt)) : undefined;
        const postTags: string[] = post.metadata.tag
          ? post.metadata.tag.split(",").map((tag: string) => tag.trim()).filter(Boolean)
          : [];
        return (
          <ContentCard
            key={post.slug}
            href={`/blog/${post.slug}`}
            ariaLabel={`Lire l'article : ${post.metadata.title}`}
            title={String(post.metadata.title)}
            summary={post.metadata.summary ? String(post.metadata.summary) : undefined}
            image={post.metadata.image}
            imageAlt={`Illustration de l'article ${post.metadata.title}`}
            tags={postTags}
            date={published}
            dateTime={post.metadata.publishedAt ? String(post.metadata.publishedAt) : undefined}
            cta="Lire l'article"
            featured={featured && index === 0}
            priority={index === 0}
          />
        );
      })}
    </ContentGrid>
  );
}

export function SkeletonPosts() {
  return (
    <ul className={styles.grid} aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((el) => (
        <li key={el} className={el === 0 ? styles.featured : styles.item}>
          <Skeleton shape="block" fillWidth minHeight="20" style={{ borderRadius: "var(--radius-xl)" }} />
        </li>
      ))}
    </ul>
  );
}
