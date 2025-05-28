"use server"

import { wisp } from "./wispClient";
import { Content } from "@wisp-cms/client";
import { PostType, WispPost } from "./types";
import { person } from "../resources";
// const TurndownService = require('turndown');
import TurndownService from 'turndown';
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

export async function getPostBySlug(slug: string, customPath = ["", "", "", ""]): Promise<PostType | null> {
    const { post } = await wisp.getPost(slug);
    if (!post) {
        return null;
    }

    return formatPostData(post as unknown as WispPost);
}


export async function getProject(slug: string): Promise<PostType | null> {
    const { content: wipContent } = await wisp.getContent({
        contentTypeSlug: "projects",
        contentSlug: slug,
    });
    return formatProjectData(wipContent);
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

/*
https://shorturl.at/DuiPd,https://shorturl.at/vQKnZ,https://shorturl.at/88anA,https://t.ly/IMwMw,https://t.ly/a-QwT,https://t.ly/utXJD,https://t.ly/0-YBQ
*/