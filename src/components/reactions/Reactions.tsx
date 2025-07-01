"use client";

import React, { forwardRef } from "react";
import classNames from "classnames";
import styles from "./Reactions.module.scss";
import { Icon, useToast } from "@/once-ui/components";
import { incrementReaction } from "./serverActions";
import { EmojiPickerDropdown } from "../EmojiPickerDropdown";

interface ReactionsProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  style?: React.CSSProperties;
  postSlug: string;
  reactionsCount?: { emoji: string; count: number }[];
}

const Reactions = forwardRef<HTMLDivElement, ReactionsProps>(
  ({ className, style, postSlug, reactionsCount, ...rest }, ref) => {
    const { addToast } = useToast();
    const handleReaction = async (emoji: string) => {
      const formData = new FormData()
      formData.append("postSlug", postSlug)
      formData.append("reactionName", emoji)
      // Optimiste : on incrémente tout de suite

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
        className={classNames(styles.container, className)}
        {...rest}
      >
        <EmojiPickerDropdown onSelect={(emoji: string) => {
          handleReaction(emoji)
        }} trigger={<Icon size="xl" background="surface" radius="full" name="smile" padding="4" />} />
      </div>
    );
  }
);

Reactions.displayName = "Reactions";

export { Reactions };
