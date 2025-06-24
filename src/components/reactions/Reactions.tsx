"use client";

import React, { useState, forwardRef, startTransition, useOptimistic } from "react";
import classNames from "classnames";
import styles from "./Reactions.module.scss";
import { Badge, Button, Flex, Icon, Spinner, Text, useToast } from "@/once-ui/components";
import { incrementReaction } from "./serverActions";
import { AnimatedNumber } from "../animateNumber";

interface ReactionsProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  style?: React.CSSProperties;
  postSlug: string;
  reactionsCount?: { emoji: string; count: number }[];
}
interface ReactionsBtnProps extends React.ComponentProps<"li"> {
  name: string;
  label: string;
  icon: string;
  postSlug: string;
  count?: number;
}

const reactions = [
  { name: "like", label: "J'aime", icon: "👍" },
  { name: "laugh", label: "Haha", icon: "😂" },
  { name: "wow", label: "Surpris(e)", icon: "😮" },
  { name: "sad", label: "Triste", icon: "😢" },
  { name: "angry", label: "Colère", icon: "😡" },
];

const Reactions = forwardRef<HTMLDivElement, ReactionsProps>(
  ({ className, style, postSlug, reactionsCount, ...rest }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleList = () => {
      setIsOpen(prev => !prev);
    };
    return (
      <div
        ref={ref}
        className={classNames(styles.container, className)}
        {...rest}
      >
        {isOpen && <Flex
          background="surface"
          border="neutral-alpha-medium"
          shadow="l"
          paddingX="m"
          horizontal="center"
          zIndex={1}
          className={classNames(styles.list, isOpen && styles.open)}
        >
          {reactions.map((reaction) => (
            <ReactionsBtn
              postSlug={postSlug}
              key={reaction.name}
              count={reactionsCount?.find(r => r.emoji === reaction.name)?.count || 0}
              {...reaction}
            />
          ))}
        </Flex>}

        <Flex
          background="surface"
          border="neutral-alpha-medium"
          radius="m-4"
          shadow="l"
          padding="xs"
          horizontal="center"
          zIndex={1}
          onClick={toggleList} >
          <Icon name="smile" />
        </Flex>
      </div>
    );
  }
);

Reactions.displayName = "Reactions";

const ReactionsBtn = forwardRef<HTMLLIElement, ReactionsBtnProps>(
  ({ name, label, icon, postSlug, count }, ref) => {
    const [currentCount, setCurrentCount] = useState(count || 0);
    const [optimisticCount, addOptimisticCount] = useOptimistic(currentCount, (state, amount: number) => state + amount);
    const { addToast } = useToast();
    const handleReaction = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      // Optimiste : on incrémente tout de suite
      startTransition(() => addOptimisticCount(1));

      const result = await incrementReaction(formData);

      if (result.success && result.count !== undefined) {
        // On synchronise le vrai compteur avec la valeur retournée
        setCurrentCount(result.count);
        addToast({
          variant: "success",
          message: "Réaction " + icon + " " + "ajouter ! Merci",
        });
      } else {
        console.error(result.message);
        // Ici, si tu veux, tu peux annuler l’optimisme en remettant setCurrentCount à sa valeur initiale
        // setCurrentCount(currentCount); // ou autre logique
      }
    };
    return <li ref={ref}>
      <form onSubmit={handleReaction} className={classNames(styles.reactionForm)}>
        <input type="hidden" name="postSlug" value={postSlug} />
        <input type="hidden" name="reactionName" value={name} />
        <Flex gap="0" padding="0" center>
          <Button
            type="submit"
            variant="tertiary"
            className={classNames(styles.reactionButton)}
            aria-label={label}
          >
            <span className={"emoji"}>
              {icon}
            </span>
            {optimisticCount > 0 && <AnimatedNumber className={styles.count} >{(optimisticCount)}</AnimatedNumber>}
          </Button>
        </Flex>
      </form>
    </li>
  })

ReactionsBtn.displayName = "ReactionsBtn";

export { Reactions };
