
import React, { forwardRef } from "react";
import classNames from "classnames";
import { Column, Heading, Row, Text } from "@once-ui-system/core";
import styles from "./steps.module.scss"
import { getRandomSixDigitNumber, slugify } from "@/utils/utils";

interface StepItem {
    title: string;
    content: string;
}

interface StepsComponentProps extends React.ComponentProps<typeof Column> {
    className?: string;
    style?: React.CSSProperties;
    /** Données encodées en URI (legacy — préférer steps + title) */
    "data-props"?: string;
    /** Titre affiché au-dessus des étapes */
    title?: string;
    /** Étapes — c'est le format direct recommandé */
    steps?: StepItem[];
}

const StepsComponent = forwardRef<HTMLDivElement, StepsComponentProps>(
    ({ className, style, title, steps: stepsProp, "data-props": dataProps, ...rest }, ref) => {
        // Résolution : steps direct (recommandé) > data-props (legacy)
        let steps: StepItem[] = stepsProp ?? [];
        let resolvedTitle = title;

        if (steps.length === 0 && dataProps) {
            try {
                const jsonStr = decodeURIComponent(dataProps || "[]");
                const parsed = JSON.parse(jsonStr) as {
                    title?: string;
                    steps?: StepItem[];
                };
                if (parsed?.steps?.length) {
                    steps = parsed.steps;
                }
                if (parsed?.title && !resolvedTitle) {
                    resolvedTitle = parsed.title;
                }
            } catch {
                // Données invalides → pas d'étapes
            }
        }

        if (steps.length === 0) {
            return null;
        }

        const jsonLDList = steps.map(({ title: stepTitle, content }, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": { "name": content || stepTitle }
        }))

        return (
            <Column
                ref={ref}
                style={style}
                className={classNames(className)}
                paddingBottom="xl"
                {...rest}
            >
                {resolvedTitle && <Heading as="h2" id={slugify(resolvedTitle)} paddingBottom="l">{resolvedTitle}</Heading>}
                {steps.map((step, i) => <StepComponent key={i} step={i} {...step} />)}
                <script id={`Steps-${typeof resolvedTitle === "string" ? resolvedTitle : `${getRandomSixDigitNumber()}`}`} type="application/ld+json" dangerouslySetInnerHTML={{
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
