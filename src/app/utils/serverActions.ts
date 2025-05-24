"use server"

import path from "path";
import { getMDXData, readMDXFile } from "./utils";


export async function getPosts(customPath = ["", "", "", ""]) {
    try {
        const postsDir = path.join(process.cwd(), ...customPath);
        return getMDXData(postsDir);

    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}
export async function getProjects() {
    try {
        const postsDir = path.join(process.cwd(), "src", "app", "work", "projects");
        return getMDXData(postsDir);

    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getPostBySlug(slug: string, customPath = ["", "", "", ""]) {
    try {
        const postsDir = path.join(process.cwd(), ...customPath);
        const posts = await getMDXData(postsDir);
        return posts.find((post) => post.slug === slug);
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        return null;
    }
}

export async function getPost(slug: string) {
    const postsDir = path.join(process.cwd(), "src", "app", "blog", "posts");
    const { metadata, content } = readMDXFile(path.join(postsDir, slug + ".mdx"));

    return {
        metadata,
        slug,
        content,
    };
}

export async function getProject(slug: string) {
    const postsDir = path.join(process.cwd(), "src", "app", "work", "projects");
    const { metadata, content } = readMDXFile(path.join(postsDir, slug + ".mdx"));

    return {
        metadata,
        slug,
        content,
    };
}

