"use server"

import { wisp } from "./wispClient";
import { Content, CreateCommentInput } from "@wisp-cms/client";
import { PostType, WispPost } from "./types";
import { person } from "../resources";
// const TurndownService = require('turndown');
import TurndownService from 'turndown';
import { ActionToastResponse } from "@/components/formActionClient";
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
            team: baseTeam
        },
        slug: post.slug,
    }
    if (post?.content) {
        let content = htmlDecode(post.content)

        const turndownService = new TurndownService({
            headingStyle: 'atx',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced',
            br: '\n',
        });


        turndownService.escape = (string) => string;


        turndownService.addRule('simpleParagraph', {
            filter: 'p',
            replacement: function (contentData) {
                return contentData + '\n';
            }
        });
        data.content = turndownService.turndown(content || "");
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