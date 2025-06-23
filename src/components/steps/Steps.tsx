
import React, { forwardRef } from "react";
import classNames from "classnames";
import { Column, Flex, Heading, Row, Text } from "@/once-ui/components";
import styles from "./steps.module.scss"
import { slugify } from "@/utils/utils";

interface StepsComponentProps extends React.ComponentProps<typeof Column> {
    className?: string;
    style?: React.CSSProperties;
    "data-props"?: string;

}

interface StepsType {
    title: string,
    steps: {
        title: string,
        content: string
    }[]
}

const StepsComponent = forwardRef<HTMLDivElement, StepsComponentProps>(
    ({ className, style, ...rest }, ref) => {
        const jsonStr = decodeURIComponent(rest["data-props"] || "[]");
        const { steps, title } = JSON.parse(jsonStr) as StepsType;

        console.log(title)
        return (
            <Column
                ref={ref}
                style={style}
                className={classNames(className)}
                {...rest}
            >
                {title && <Heading as="h2" paddingBottom="l" id={slugify(title)}>{title}</Heading>}
                {steps?.map((step, i) => <StepComponent key={i} step={i} {...step} />)}
            </Column>
        );
    }
);

StepsComponent.displayName = "StepsComponent";

interface StepComponentProps extends React.ComponentProps<typeof Column> {
    step: number;
    icon?: string;
    title?: string;
    content?: string;
    className?: string;
    style?: React.CSSProperties;
}

const StepComponent = forwardRef<HTMLDivElement, StepComponentProps>(
    ({ icon, title, content, step, className, style, ...rest }, ref) => {
        return (
            <Column
                ref={ref}
                style={style}
                className={classNames(className)}
                {...rest}
            >
                <Row gap="s">
                    <Column>
                        <div className={classNames(styles.stepCount)}>{step + 1}</div>
                        <div className={classNames(styles.stepLine)} />
                    </Column>
                    <Column gap="s" paddingBottom="m" paddingTop="4">
                        <Text variant="body-strong-xl">{title}</Text>
                        <Text variant="body-default-m" onBackground="neutral-weak">{content}</Text>
                    </Column>
                </Row>
            </Column>
        );
    }
);

StepComponent.displayName = "StepComponent";

export { StepsComponent };
