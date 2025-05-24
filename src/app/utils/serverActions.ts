"use server"

import path from "path";
import { getMDXData } from "./utils";

export async function getPosts(customPath = ["", "", "", ""]) {
    const postsDir = path.join(process.cwd(), ...customPath);
    return getMDXData(postsDir);
}

