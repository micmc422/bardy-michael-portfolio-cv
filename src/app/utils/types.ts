import { Metadata } from "next";

export interface PostType {
    metadata: Metadata & {
        projectURL?: string;
        publishedAt: string;
        summary: string;
        images: string[];
        team: {
            avatar: string;
        }[],
        link?: string;
    };
    slug: string;
    content: string;
}
