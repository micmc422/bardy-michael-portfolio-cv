"use server"

import { reactions } from "@/lib/schema/reactions";
import { db } from "@/utils/db";
import { sql } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";

export async function incrementReaction(formData: FormData): Promise<{ success: boolean; count?: number; message?: string }> {
    try {
        // Simulate a server action to handle the reaction
        // In a real application, you would send this to your backend API
        const postSlug = formData.get("postSlug") as string;
        const reactionName = formData.get("reactionName") as string;
        const actionType = formData.get("actionType") as string;

        const res = await db
            .insert(reactions)
            .values({
                postSlug,
                emoji: reactionName,
                count: 1,
                actionType
            })
            .onConflictDoUpdate({
                target: [reactions.postSlug, reactions.emoji],
                set: {
                    count: sql`reactions.count + 1`,
                },
            })
            .returning({ count: reactions.count });
        revalidatePath(`/blog/${postSlug}`);
        // revalidateTag(`reactions-${postSlug}`);

        return { success: true, count: res?.[0]?.count ?? 0, message: "Reaction incremented successfully" };
    } catch (error) {
        console.error("Error handling reaction:", error);
        return { success: false, message: "Failed to handle reaction" };
    }
}

export interface ReactionType {
    emoji: string;
    count: number;
    actionType: string;
}

export async function getReactions(postSlug: string): Promise<ReactionType[]> {
    try {
        const reactionsCached = unstable_cache(
            async () => {
                const res = await db
                    .select({
                        emoji: reactions.emoji,
                        count: reactions.count,
                        actionType: reactions.actionType
                    })
                    .from(reactions)
                    .where(sql`${reactions.postSlug} = ${postSlug}`);

                return res;
            }, [`reactions-${postSlug}`]
        )
        return await reactionsCached();
    } catch (error) {
        console.error("Error fetching reactions:", error);
        return [];
    }
}