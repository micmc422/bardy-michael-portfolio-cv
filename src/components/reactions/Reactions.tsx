"use client";

import React, { forwardRef, useMemo } from "react";
import classNames from "classnames";
import styles from "./Reactions.module.scss";
import { Card, Flex, useToast } from "@/once-ui/components";
import { incrementReaction } from "./serverActions";
import { EmojiPickerDropdown } from "../EmojiPickerDropdown";
import { useRouter } from "next/navigation";
import { CursorCard } from "../CursorCard";

interface ReactionsProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  style?: React.CSSProperties;
  postSlug: string;
  reactionsCount?: { emoji: string; count: number }[];
}

const Reactions = forwardRef<HTMLDivElement, ReactionsProps>(
  ({ className, style, postSlug, reactionsCount, ...rest }, ref) => {
    const { addToast } = useToast();
    const router = useRouter();
    const updatedCount = useMemo(() => reactionsCount, [reactionsCount])
    const handleReaction = async ({ emoji, tags }: { emoji: string, tags: string[] }) => {
      const formData = new FormData()
      formData.append("postSlug", postSlug)
      formData.append("reactionName", emoji)
      const actionType = tags.filter(el => ["LikeAction", "AgreeAction", "DisagreeAction", "CommentAction", "ReactAction"].includes(el))[0];
      formData.append("actionType", actionType || "ReactAction")

      // Optimiste : on incrémente tout de suite

      const result = await incrementReaction(formData);

      if (result.success && result.count !== undefined) {
        // On synchronise le vrai compteur avec la valeur retournée
        addToast({
          variant: "success",
          message: "Réaction " + emoji + " " + "ajouter ! Merci",
        });
        router.refresh()
      } else {
        console.error(result.message);
        // Ici, si tu veux, tu peux annuler l’optimisme en remettant setCurrentCount à sa valeur initiale
        // setCurrentCount(currentCount); // ou autre logique
      }
    };
    return (
      <div
        ref={ref}
        className={classNames(styles.container, className)}
        {...rest}
      >
        <EmojiPickerDropdown onSelect={({ emoji, tags }: { emoji: string, tags: string[] }) => {
          handleReaction({ emoji, tags })
        }} trigger={(reactionsCount?.length || 0) > 0 ? <ReactionsList reactionsCount={updatedCount} />
          : <span style={{ fontSize: "2em" }}>☺️</span>} />
      </div>
    );
  }
);

Reactions.displayName = "Reactions";

interface ReactionsListProps extends React.ComponentPropsWithoutRef<typeof Flex> {
  reactionsCount?: { emoji: string; count: number }[];
}

const ReactionsList = forwardRef<HTMLDivElement, ReactionsListProps>(
  ({ className, style, reactionsCount, ...rest }, ref) => {
    const updatedCount = useMemo(() => reactionsCount, [reactionsCount])
    return (
      <Flex
        ref={ref}
        className={classNames(styles.list, className)}
        wrap
        {...rest}
      >
        {updatedCount?.sort((a, b) => b.count - a.count)?.map(({ emoji, count }) => <CursorCard
          key={emoji}
          placement="bottom-start"
          trigger={
            <div className={styles.emoji}>{emoji}</div>
          }

          overlay={
            <Card maxWidth={24} radius="l-4" direction="column" border="neutral-alpha-medium" padding="xs">
              <span className={styles.emojiCard}>{emoji} {count}</span>
            </Card>
          }
        />)}
      </Flex>
    );
  }
);

ReactionsList.displayName = "ReactionsList";

export { Reactions, ReactionsList };
