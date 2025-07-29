
import React, { forwardRef } from "react";
import classNames from "classnames";
import { Column, Heading, Row, Text } from "@once-ui-system/core";
import styles from "./steps.module.scss"
import { getRandomSixDigitNumber, slugify } from "@/utils/utils";
import Script from "next/script";

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
        const jsonLDList = steps.map(({ title, content }, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": { "name": content || title }
        }))

        return (
            <Column
                ref={ref}
                style={style}
                className={classNames(className)}
                paddingBottom="xl"
                {...rest}
            >
                {title && <Heading as="h2" id={slugify(title)} paddingBottom="l">{title}</Heading>}
                {steps?.map((step, i) => <StepComponent key={i} step={i} {...step} />)}
                <Script id={`Steps-${typeof title === "string" ? title : `${getRandomSixDigitNumber()}`}`} type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: `{
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "itemListOrder": "http://schema.org/ItemListOrderAscending",
                        "numberOfItems": ${steps.length},
                        "itemListElement": ${JSON.stringify(jsonLDList)}
                    }`
                }} />

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
    ({ title, content, step, className, style, ...rest }, ref) => {
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
                    <Column gap="s" paddingBottom="l" paddingTop="4">
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
