"use client";

import React, { useState, forwardRef, useTransition } from "react";
import classNames from "classnames";
import styles from "./Reactions.module.scss";
import { Button, Flex, Icon, Spinner, Text } from "@/once-ui/components";
import { incrementReaction } from "./serverActions";

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
        <button className={styles.button}><Icon name="smile" onClick={() => toggleList()} /></button>
        <ul
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
        </ul>
      </div>
    );
  }
);

Reactions.displayName = "Reactions";

const ReactionsBtn = forwardRef<HTMLLIElement, ReactionsBtnProps>(
  ({ name, label, icon, postSlug, count }, ref) => {
    const [loading, setLoading] = useTransition();
    const [currentCount, setCurrentCount] = useState(count || 0);
    const handleReaction = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      setLoading(async () => {
        const result = await incrementReaction(formData);

        if (result.success && result.count !== undefined) {
          setCurrentCount(result.count);
        } else {
          console.error(result.message);
        }
      });
    };
    return <li ref={ref}>
      <form onSubmit={handleReaction} className={classNames(styles.reactionForm)}>
        <input type="hidden" name="postSlug" value={postSlug} />
        <input type="hidden" name="reactionName" value={name} />
        <Flex gap="0" center>
          <Button
            type="submit"
            variant="tertiary"
            disabled={loading}
            className={classNames(styles.reactionButton, loading && styles.loading)}
            aria-label={label}
          >
            <span className={"emoji"}>
              {icon}
            </span>
            {loading && <Spinner className={classNames(loading && styles.spinner)} />}
          </Button>
          {currentCount > 0 && <Text variant="body-strong-l" onBackground="neutral-weak" marginLeft="4">{(currentCount)}</Text>}
        </Flex>
      </form>
    </li>
  })

ReactionsBtn.displayName = "ReactionsBtn";

export { Reactions };
