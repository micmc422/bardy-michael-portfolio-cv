"use client";

import React, { forwardRef, useTransition } from "react";
import classNames from "classnames";
import styles from "./Reactions.module.scss";
import { Card, Flex, Icon, useToast } from "@/once-ui/components";
import { incrementReaction, type ReactionType } from "./serverActions";
import { EmojiPickerDropdown } from "../EmojiPickerDropdown";
import { CursorCard } from "../CursorCard";

interface ReactionsProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  style?: React.CSSProperties;
  postSlug: string;
  reactions?: ReactionType[];
}

const Reactions = forwardRef<HTMLDivElement, ReactionsProps>(
  ({ className, style, postSlug, reactions, ...rest }, ref) => {
    const [loading, startTransition] = useTransition()
    const { addToast } = useToast();
    function handleReaction({ emoji, tags }: { emoji: string, tags: string[] }) {
      startTransition(() => UpdateReaction({ emoji, tags }))
    }
    const UpdateReaction = async ({ emoji, tags }: { emoji: string, tags: string[] }) => {
      const formData = new FormData()
      formData.append("postSlug", postSlug)
      formData.append("reactionName", emoji)
      const actionType = tags.filter(el => ["LikeAction", "AgreeAction", "DisagreeAction", "CommentAction", "ReactAction"].includes(el))[0];
      formData.append("actionType", actionType || "ReactAction")

      const result = await incrementReaction(formData);

      if (result.success && result.count !== undefined) {
        // On synchronise le vrai compteur avec la valeur retournée
        addToast({
          variant: "success",
          message: "Réaction " + emoji + " " + "ajouter ! Merci",
        });
      } else {
        console.error(result.message);
        // Ici, si tu veux, tu peux annuler l’optimisme en remettant setCurrentCount à sa valeur initiale
        // setCurrentCount(currentCount); // ou autre logique
      }
    };
    return (
      <div
        ref={ref}
        className={classNames(styles.container, className, loading && styles.loading)}
        {...rest}
      >
        <EmojiPickerDropdown
          onSelect={({ emoji, tags }: { emoji: string, tags: string[] }) => {
            handleReaction({ emoji, tags })
          }}
          trigger={<ReactionsList reactions={reactions} />} />
      </div>
    );
  }
);

Reactions.displayName = "Reactions";

interface ReactionsListProps extends React.ComponentPropsWithoutRef<typeof Flex> {
  reactions?: { emoji: string; count: number }[];
}

const ReactionsList = forwardRef<HTMLDivElement, ReactionsListProps>(
  ({ className, style, reactions, ...rest }, ref) => {
    if (!reactions?.length) {
      return <Flex
        ref={ref}
        className={classNames(styles.list, className)}
        wrap
        {...rest}
      >
        <Icon name="smile" />
      </Flex>

    }
    return (
      <Flex
        ref={ref}
        className={classNames(styles.list, className)}
        wrap
        {...rest}
      >
        {reactions?.sort((a, b) => b.count - a.count)?.map(({ emoji, count }) => <CursorCard
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
