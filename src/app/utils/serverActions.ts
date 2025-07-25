"use server"

import { wisp } from "./wispClient";
import type { Content, CreateCommentInput, TagInPost } from "@wisp-cms/client";
import type { PostType, WispPost } from "./types";
import { person } from "../resources";
// const TurndownService = require('turndown');
import TurndownService from 'turndown';
import type { ActionToastResponse } from "@/components/formActionClient";
import { revalidatePath } from "next/cache";
import type { AvisType } from "@/components/AvisClients";
import { unstable_cache } from 'next/cache'

const baseTeam = [{
    avatar: person.avatar,
    name: person.name,
    role: person.role,
    linkedIn: "https://www.linkedin.com/in/micha%C3%ABl-bardy-62249168/",
}]


// --- getPosts ---
async function fetchPosts({ limit = 10, page, tags }: { limit?: number | "all", page?: number, tags?: string[] }): Promise<PostType[]> {
    try {
        const { posts } = await wisp.getPosts({ limit, page, tags });
        return posts.map((content) => formatPostData(content as unknown as WispPost));
    } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
        return [];
    }
}
export const getPosts = unstable_cache(fetchPosts, ['wisp-posts'], { revalidate: 3600 });

// --- getRelatedPost ---
async function fetchRelatedPost({ slug }: { slug: string }) {
    try {
        const { posts } = await wisp.getRelatedPosts({ slug, limit: 4 });
        return posts.map(post => formatPostData(post as unknown as WispPost));
    } catch (error) {
        console.error("Erreur lors de la récupération des articles liés:", error);
        return [];
    }
}
export const getRelatedPost = unstable_cache(fetchRelatedPost, ['wisp-related-post'], { revalidate: 3600 });

// --- getTags ---
async function fetchTags({ limit = 10, page }: { limit?: number | "all", page?: number }): Promise<TagInPost[]> {
    try {
        const { tags } = await wisp.getTags(page, limit);
        return tags;
    } catch (error) {
        console.error("Erreur lors de la récupération des tags:", error);
        return [];
    }
}
export const getTags = unstable_cache(fetchTags, ['wisp-tags'], { revalidate: 3600 });

// --- getProjects ---
async function fetchProjects({ limit = 10 }: { limit?: number | "all" }) {
    try {
        const { contents } = await wisp.getContents({ contentTypeSlug: "projects", limit });
        return contents.map((content) => formatProjectData(content));
    } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
        return [];
    }
}
export const getProjects = unstable_cache(fetchProjects, ['wisp-projects'], { revalidate: 3600 });

// --- getPostBySlug ---
async function fetchPostBySlug(slug: string): Promise<PostType | null> {
    try {
        const { post } = await wisp.getPost(slug);
        return post ? formatPostData(post as unknown as WispPost) : null;
    } catch (error) {
        console.error(`Erreur lors de la récupération du post '${slug}':`, error);
        return null;
    }
}
export const getPostBySlug = unstable_cache(fetchPostBySlug, ['wisp-post-by-slug'], { revalidate: 3600 });

// --- getPostDataBySlug ---
async function fetchPostDataBySlug(slug: string): Promise<any> {
    try {
        const { post } = await wisp.getPost(slug);
        return post || null;
    } catch (error) {
        console.error(`Erreur lors de la récupération des données du post '${slug}':`, error);
        return null;
    }
}
export const getPostDataBySlug = unstable_cache(fetchPostDataBySlug, ['wisp-post-data-by-slug'], { revalidate: 3600 });

// --- getProject ---
async function fetchProject(slug: string): Promise<PostType | null> {
    try {
        const { content: wipContent } = await wisp.getContent({ contentTypeSlug: "projects", contentSlug: slug });
        return formatProjectData(wipContent);
    } catch (error) {
        console.error(`Erreur lors de la récupération du projet '${slug}':`, error);
        return null;
    }
}
export const getProject = unstable_cache(fetchProject, ['wisp-project'], { revalidate: 3600 });

// --- getProjectData ---
async function fetchProjectData(slug: string): Promise<any> {
    try {
        const { content: wipContent } = await wisp.getContent({ contentTypeSlug: "projects", contentSlug: slug });
        return wipContent;
    } catch (error) {
        console.error(`Erreur lors de la récupération des données du projet '${slug}':`, error);
        return null;
    }
}
export const getProjectData = unstable_cache(fetchProjectData, ['wisp-project-data'], { revalidate: 3600 });

function htmlDecode(encoded: string) {
    return encoded
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&');
}

function formatProjectData(content: Content<Record<string, any>>) {

    const data: PostType = {
        metadata: {
            title: content.content.title,
            summary: content.content.summary,
            image: content.content.image,
            publishedAt: content.content.publishedAt,
            updatedAt: content.content.updatedAt,
            images: [content.content.image, content.content["image-2"], content.content["image-3"], content.content["image-4"]],
            projectURL: content.content.projectURL,
            team: baseTeam
        },
        slug: content.slug,
        content: content.content.content,
    }

    if (content.content.meta) {
        const jsonMeta = JSON.parse(content.content.meta);
        if (jsonMeta.team) {
            const projectTeam = jsonMeta.team?.map((member: any) => ({
                avatar: member.avatar,
                name: member.name,
                role: member.role,
                linkedIn: member.linkedIn,
            })) || [];
            data.metadata.team = [...data.metadata.team || [], ...projectTeam];
        }
    }
    return data
}


function formatPostData(post: WispPost): PostType {
    const data: PostType = {
        metadata: {
            title: post.title,
            description: post.description,
            image: post.image,
            publishedAt: post.publishedAt,
            updatedAt: post.publishedAt,
            summary: post.description || "", // Provide a default or map accordingly
            team: baseTeam,
            tags: post.tags
        },
        slug: post.slug,
    }
    if (post?.content) {
        const { gfm } = require('@joplin/turndown-plugin-gfm')
        let content = htmlDecode(post.content)
        content = content.replace(/<colgroup[^>]*>[\s\S]*?<\/colgroup>/gi, '')
        content = content.replace(/colspan/gi, "colSpan")
        content = content.replace(/\s(colspan|rowspan)="1"/gi, '')
        content = content.replace(/\sstyle="[^"]*"/gi, '')
        content = content.replace(
            /<div\s+([^>]*?)data-wisp-react-component=["']true["']([^>]*?)><\/div>/gi,
            (_match, before, after, _innerHTML) => {

                const fullAttrs = (before + after).trim();

                // Cherche data-name
                const nameMatch = fullAttrs.match(/data-name=["']([^"']+)["']/);
                const name = nameMatch ? nameMatch[1] : 'WispComponent';

                // Nettoie les attributs (on enlève data-name et data-wisp-react-component)
                const cleanedAttrs = fullAttrs
                    .trim();

                // Re-construit les attributs sous forme propre
                const attrString = cleanedAttrs.length > 0 ? ' ' + cleanedAttrs : '';
                return `<div data-wisp-react-component="true" ${attrString}>${name}</div>`;
            }
        );


        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            bulletListMarker: '-',
            emDelimiter: '*',
            strongDelimiter: '**',
            hr: '---'
        })

        // Charger le plugin GFM (pour tout sauf table)
        turndownService.use(gfm)

        // Garder intactes ces balises HTML

        turndownService.keep(['div']);
        // turndownService.escape = (string) => string;

        data.content = turndownService.turndown(content || "");

        data.content = data.content.replace(
            /<div\s+([^>]*?)data-wisp-react-component=["']true["']([^>]*?)>(.*?)<\/div>/gi,
            (_match, before, after, _innerHTML) => {
                const fullAttrs = (before + after).trim();

                // Cherche data-name
                const nameMatch = fullAttrs.match(/data-name=["']([^"']+)["']/);
                const name = nameMatch ? nameMatch[1] : 'WispComponent';

                // Nettoie les attributs (on enlève data-name et data-wisp-react-component)
                const cleanedAttrs = fullAttrs
                    .trim();

                // Re-construit les attributs sous forme propre
                const attrString = cleanedAttrs.length > 0 ? ' ' + cleanedAttrs : '';

                return `<${name} ${attrString} />`;
            }
        );
    }
    if (post?.metadata?.team) {
        data.metadata.team = post?.metadata?.team;
    }
    if (post?.metadata?.sources) {
        data.metadata.sources = post?.metadata?.sources;
    }
    return data
}

export async function getComments({ slug, page = 1, limit = 20 }: { slug: string, page?: number, limit?: number | "all" }) {
    const { comments, config } = await wisp.getComments({ slug, page, limit });
    return {
        comments,
        config,
    };
}

export async function createComment(formData: FormData | void | null): Promise<ActionToastResponse> {
    const slug = formData?.get("slug") as string;
    if (!slug) {
        return { variant: "danger", message: "Slug est requis pour créer un commentaire." }
    }
    const author = formData?.get("author") as string;
    if (!author) {
        return { variant: "danger", message: "Author est requis pour créer un commentaire." }
    }
    const email = formData?.get("email") as string;
    if (!email) {
        return { variant: "danger", message: "Email est requis pour créer un commentaire." }
    }
    const content = formData?.get("content") as string;
    if (!content) {
        return { variant: "danger", message: "Content est requis pour créer un commentaire." }
    }
    const allowEmailUsage = !formData?.get("allowEmailUsage");
    const createCommentParams: CreateCommentInput = {
        slug,
        author,
        email,
        content,
        allowEmailUsage,
    }
    const url = formData?.get("url") as string;
    if (url) createCommentParams.url = url
    const parentId = formData?.get("parentId") as string;
    if (parentId) createCommentParams.parentId = parentId
    const res = await wisp.createComment(createCommentParams);
    if (res.success) {
        revalidatePath("/blog/" + slug)
        return { variant: "success", message: "Commentaire créé avec succès. Pour qu’il soit visible, veuillez valider l’e-mail qui vous a été envoyé.", action: null };
    }
    const { error } = res as unknown as { error: { message: string, code: string } };
    const erreur = error?.message
    return { variant: "danger", message: "Oups une erreur c'est produite : " + erreur, action: null };
}


/**
 * Fonction pour récupérer les avis Google My Business avec mise en cache.
 */
async function fetchAvis(): Promise<{ rating: number | null; reviews: AvisType[] }> {
    try {
        const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;
        const GOOGLE_PLACE_API_KEY = process.env.GOOGLE_PLACE_API_KEY;

        if (!GOOGLE_PLACE_ID || !GOOGLE_PLACE_API_KEY) {
            throw new Error("Les variables d'environnement GOOGLE_PLACE_ID et/ou GOOGLE_PLACE_API_KEY sont manquantes.");
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
            translated: `${el.translated}`
        })) as AvisType[];
        return {
            rating: data.result.rating,
            reviews: avis
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des avis Google :", error);
        return { rating: null, reviews: [] };
    }
}

// Wrap avec unstable_cache pour le cacher pendant 1 heure (3600 secondes)
export const getAvis = unstable_cache(
    fetchAvis,
    ['google-avis'],          // Clé du cache (peut être plus spécifique si besoin)
    { revalidate: 3600 }      // Revalidation toutes les heures
);
