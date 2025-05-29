import { Author, TagInPost } from "@wisp-cms/client";
import { Metadata } from "next";

export interface PostType {
    metadata: Metadata & {
        projectURL?: string;
        publishedAt: string | null;
        updatedAt: string | null;
        summary: string;
        image: string | null;
        images?: string[];
        team: {
            avatar: string;
            name: string;
            role: string;
            linkedIn?: string;
        }[],
        sources?: string[];
        link?: string;
        tags?: { id: string, name: string }[];
    };
    slug: string;
    content?: string;
}

export interface WispPost {
    id: string;
    createdAt: Date;
    teamId: string;
    description: string | null;
    title: string;
    content?: string;
    metadata?: { team?: Team[], sources?: string[], [key: string]: any } | null;
    slug: string;
    image: string | null;
    authorId: string;
    updatedAt: string;
    publishedAt: string;
    author: Author;
    tags: TagInPost[];
}

export interface Team {
    name: string
    role: string
    avatar: string
    linkedIn: string
}
