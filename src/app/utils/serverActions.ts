"use server"

import { wisp } from "./wispClient";
import type { Content, CreateCommentInput, TagInPost } from "@wisp-cms/client";
import type { PostType, WispPost } from "./types";
import { person } from "../resources";
// const TurndownService = require('turndown');
import TurndownService from 'turndown';
import type { ActionToastResponse } from "@/components/formActionClient";
import { revalidatePath } from "next/cache";
const baseTeam = [{
    avatar: person.avatar,
    name: person.name,
    role: person.role,
    linkedIn: "https://www.linkedin.com/in/micha%C3%ABl-bardy-62249168/",
}]

export async function getPosts({ limit = 10, page, tags }: { limit?: number | "all", page?: number, tags?: string[] }): Promise<PostType[]> {
    const { posts } = await wisp.getPosts({
        limit,
        page,
        tags,
    });
    return posts.map((content) => {
        return formatPostData(content as unknown as WispPost);
    });
}

export async function getRelatedPost({ slug }: { slug: string }) {
    const { posts } = await wisp.getRelatedPosts({ slug, limit: 4 })
    return posts.map(post => formatPostData(post as unknown as WispPost))
}

export async function getTags({ limit = 10, page }: { limit?: number | "all", page?: number }): Promise<TagInPost[]> {
    const { tags } = await wisp.getTags(
        page,
        limit
    );
    return tags;
}

export async function getProjects({ limit = 10 }: { limit?: number | "all" }) {
    const { contents } = await wisp.getContents({
        contentTypeSlug: "projects",
        limit
    });

    return contents.map((content) => {
        return formatProjectData(content);
    });
}

export async function getPostBySlug(slug: string): Promise<PostType | null> {
    const { post } = await wisp.getPost(slug);
    if (!post) {
        return null;
    }
    return formatPostData(post as unknown as WispPost);
}

export async function getPostDataBySlug(slug: string): Promise<any> {
    const { post } = await wisp.getPost(slug);
    if (!post) {
        return null;
    }
    return post;
}


export async function getProject(slug: string): Promise<PostType | null> {
    const { content: wipContent } = await wisp.getContent({
        contentTypeSlug: "projects",
        contentSlug: slug,
    });
    return formatProjectData(wipContent);
}

export async function getProjectData(slug: string): Promise<any> {
    const { content: wipContent } = await wisp.getContent({
        contentTypeSlug: "projects",
        contentSlug: slug,
    });
    return wipContent;
}

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