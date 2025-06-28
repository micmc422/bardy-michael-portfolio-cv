"use server"

import { reactions } from "@/lib/schema/reactions";
import { db } from "@/utils/db";
import { sql } from "drizzle-orm";

export async function incrementReaction(formData: FormData): Promise<{ success: boolean; count?: number; message?: string }> {
    try {
        // Simulate a server action to handle the reaction
        // In a real application, you would send this to your backend API
        const postSlug = formData.get("postSlug") as string;
        const reactionName = formData.get("reactionName") as string;

        const res = await db
            .insert(reactions)
            .values({
                postSlug,
                emoji: reactionName,
                count: 1,
            })
            .onConflictDoUpdate({
                target: [reactions.postSlug, reactions.emoji],
                set: {
                    count: sql`reactions.count + 1`,
                },
            })
            .returning({ count: reactions.count });

        return { success: true, count: res?.[0]?.count ?? 0, message: "Reaction incremented successfully" };
    } catch (error) {
        console.error("Error handling reaction:", error);
        return { success: false, message: "Failed to handle reaction" };
    }
}

export async function getReactions(postSlug: string) {
    try {
        const res = await db
            .select({
                emoji: reactions.emoji,
                count: reactions.count,
            })
            .from(reactions)
            .where(sql`${reactions.postSlug} = ${postSlug}`);

        return res;
    } catch (error) {
        console.error("Error fetching reactions:", error);
        return [];
    }
}