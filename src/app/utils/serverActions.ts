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

