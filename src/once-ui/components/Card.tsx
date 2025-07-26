"use client";

import React, { forwardRef } from "react";
import { Flex } from ".";
import styles from "./Card.module.scss";
import { ElementType } from "./ElementType";
import classNames from "classnames";

interface CardProps extends React.ComponentProps<typeof Flex> {
  children?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, href, onClick, ...rest }, ref) => {
    return (
      <ElementType
        tabIndex={0}
        className={classNames(
          "reset-button-styles",
          "display-flex",
          "fill-width",
          (onClick || href) && "focus-ring",
          (onClick || href) && "radius-l",
        )}
        href={href}
        onClick={onClick ? onClick : undefined}
        role="button"
        ref={ref}
      >
        <Flex
          background="surface"
          onBackground="neutral-strong"
          transition="macro-medium"
          border="neutral-medium"
          cursor="interactive"
          align="left"
          className={styles.card}
          onClick={onClick}
          {...rest}
        >
          {children}
        </Flex>
      </ElementType>
    );
  },
);

Card.displayName = "Card";
export { Card };
