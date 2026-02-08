"use client";

import React, { useState, useEffect, forwardRef } from "react";
import classNames from "classnames";
import styles from "./animatedNumber.module.scss";
import { Flex, Text } from "@once-ui-system/core";

interface ComponentProps extends React.ComponentProps<typeof Flex> {
    children: number; // On attend un nombre ici
    className?: string;
    style?: React.CSSProperties;
    duration?: number;
}

const AnimatedNumber = forwardRef<HTMLDivElement, ComponentProps>(
    ({ children: value, className, style, duration = 500, ...rest }, ref) => {
        const [displayValue, setDisplayValue] = useState(value);

        useEffect(() => {
            let frame: number;
            const start = displayValue;
            const end = value;
            const startTime = performance.now();

            const animate = (now: number) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const current = Math.round(start + (end - start) * progress);
                setDisplayValue(current);
                if (progress < 1) {
                    frame = requestAnimationFrame(animate);
                }
            };

            frame = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(frame);
        }, [value, duration]);

        return (
            <Flex
                ref={ref}
                style={style}
                className={classNames(styles.component, className)}
                {...rest}
            >
                <Text variant="body-strong-s" onBackground="neutral-weak" marginLeft="4" size="s" className={classNames(styles.value, className)}>{displayValue}</Text>
            </Flex>
        );
    }
);

AnimatedNumber.displayName = "AnimatedNumber";
export { AnimatedNumber };
