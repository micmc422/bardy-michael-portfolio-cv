"use server"

import type { PostType } from "./types";
import { person } from "../resources";
import type { AvisType } from "@/components/AvisClients";
import { unstable_cache } from "next/cache";
// Data layer 100 % GitHub (fichiers MDX versionnés, aucun SaaS)
import {
  getLocalPosts,
  getLocalPostBySlug,
  getLocalProjects,
  getLocalProjectBySlug,
  getLocalRelatedPosts,
  getLocalTags,
} from "@/lib/githubContent";

const baseTeam = [
  {
    avatar: person.avatar,
    name: person.name,
    role: person.role,
    linkedIn: "https://www.linkedin.com/in/micha%C3%ABl-bardy-62249168/",
  },
];

// --- Mapping LocalPostMeta -> PostType (shape attendu par l'UI) ---
function toPostType(p: {
  title: string;
  description: string;
  publishedAt: string | null;
  updatedAt: string | null;
  image: string | null;
  tags: string[];
  author?: string;
  slug: string;
  body: string;
}): PostType {
  // Résumé de secours : si la description du frontmatter est vide,
  // on dérive un résumé à partir du corps MDX (1ere phrase substantielle).
  const fallbackSummary = (() => {
    const text = p.body
      .replace(/[#>*_`]/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/s+/g, " ")
      .trim();
    const firstSentence = text.split(/(?<=.)s/)[0] || text;
    return firstSentence.slice(0, 200).trim();
  })();
  const summary = p.description?.trim() ? p.description : fallbackSummary;
  return {
    metadata: {
      title: p.title,
      description: summary,
      publishedAt: p.publishedAt,
      updatedAt: p.updatedAt,
      summary,
      image: p.image,
      // Le composant ProjectCard attend un tableau `images` (Carousel)
      images: p.image ? [p.image] : [],
      team: baseTeam,
      tags: (p.tags || []).map((t) => ({ id: t, name: t })),
    },
    slug: p.slug,
    content: p.body,
  };
}

// --- getPosts ---
async function fetchPosts({
  limit = 10,
  page,
  tags,
}: {
  limit?: number | "all";
  page?: number;
  tags?: string[];
}): Promise<PostType[]> {
  try {
    return getLocalPosts({ limit, page: page ?? 1, tags }).map(toPostType);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    return [];
  }
}
export const getPosts = unstable_cache(fetchPosts, ["local-posts"], {
  revalidate: 3600,
});

// --- getRelatedPost ---
async function fetchRelatedPost({ slug }: { slug: string }): Promise<PostType[]> {
  try {
    return getLocalRelatedPosts(slug, 4).map(toPostType);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles liés:", error);
    return [];
  }
}
export const getRelatedPost = unstable_cache(fetchRelatedPost, ["local-related-post"], {
  revalidate: 3600,
});

// --- getTags ---
async function fetchTags({
  limit = 10,
  page,
}: {
  limit?: number | "all";
  page?: number;
}): Promise<{ id: string; name: string }[]> {
  try {
    const tags = getLocalTags();
    return limit === "all" ? tags : tags.slice(0, limit);
  } catch (error) {
    console.error("Erreur lors de la récupération des tags:", error);
    return [];
  }
}
export const getTags = unstable_cache(fetchTags, ["local-tags"], {
  revalidate: 3600,
});

// --- getProjects ---
async function fetchProjects({
  limit = 10,
}: {
  limit?: number | "all";
}): Promise<PostType[]> {
  try {
    return getLocalProjects({ limit }).map(toPostType);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    return [];
  }
}
export const getProjects = unstable_cache(fetchProjects, ["local-projects"], {
  revalidate: 3600,
});

// --- getPostBySlug ---
async function fetchPostBySlug(slug: string): Promise<PostType | null> {
  try {
    const post = getLocalPostBySlug(slug);
    return post ? toPostType(post) : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération du post '${slug}':`, error);
    return null;
  }
}
export const getPostBySlug = unstable_cache(fetchPostBySlug, ["local-post-by-slug"], {
  revalidate: 3600,
});

// --- getPostDataBySlug (renvoie le PostType brut, utilisé pour les métadonnées) ---
async function fetchPostDataBySlug(slug: string): Promise<PostType | null> {
  try {
    const post = getLocalPostBySlug(slug);
    return post ? toPostType(post) : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données du post '${slug}':`, error);
    return null;
  }
}
export const getPostDataBySlug = unstable_cache(fetchPostDataBySlug, ["local-post-data-by-slug"], {
  revalidate: 3600,
});

// --- getProject ---
async function fetchProject(slug: string): Promise<PostType | null> {
  try {
    const project = getLocalProjectBySlug(slug);
    return project ? toPostType(project) : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération du projet '${slug}':`, error);
    return null;
  }
}
export const getProject = unstable_cache(fetchProject, ["local-project"], {
  revalidate: 3600,
});

// --- getProjectData ---
async function fetchProjectData(slug: string): Promise<PostType | null> {
  try {
    const project = getLocalProjectBySlug(slug);
    return project ? toPostType(project) : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données du projet '${slug}':`, error);
    return null;
  }
}
export const getProjectData = unstable_cache(fetchProjectData, ["local-project-data"], {
  revalidate: 3600,
});

/**
 * Fonction pour récupérer les avis Google My Business avec mise en cache.
 */
async function fetchAvis(): Promise<{ rating: number | null; reviews: AvisType[] }> {
  try {
    const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;
    const GOOGLE_PLACE_API_KEY = process.env.GOOGLE_PLACE_API_KEY;

    if (!GOOGLE_PLACE_ID || !GOOGLE_PLACE_API_KEY) {
      throw new Error(
        "Les variables d'environnement GOOGLE_PLACE_ID et/ou GOOGLE_PLACE_API_KEY sont manquantes."
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,reviews&language=fr&key=${GOOGLE_PLACE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur API Google: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.result || !data.result.reviews) {
      throw new Error("Aucun avis trouvé dans la réponse de l'API.");
    }

    const avis = data.result.reviews.map((el: AvisType) => ({
      ...el,
      translated: `${el.translated}`,
    })) as AvisType[];
    return {
      rating: data.result.rating,
      reviews: avis,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des avis Google :", error);
    return { rating: null, reviews: [] };
  }
}

// Wrap avec unstable_cache pour le cacher pendant 1 heure (3600 secondes)
export const getAvis = unstable_cache(fetchAvis, ["google-avis"], { revalidate: 3600 });
