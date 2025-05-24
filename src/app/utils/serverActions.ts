"use server"

import path from "path";
import { getMDXData } from "./utils";


export async function getPosts(customPath = ["", "", "", ""]) {
    try {
        const postsDir = path.join(process.cwd(), ...customPath);
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
