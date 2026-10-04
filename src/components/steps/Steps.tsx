
import React, { forwardRef } from "react";
import classNames from "classnames";
import { Column, Heading, Timeline, type TimelineItem } from "@once-ui-system/core";
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

        // Once UI 2.0 : Timeline gère les connecteurs, marqueurs et états.
        const timelineItems: TimelineItem[] = steps.map((step, i) => ({
            label: step.title,
            description: step.content,
            marker: String(i + 1),
            state: i === steps.length - 1 ? "active" : "default",
        }));

        return (
            <Column
                ref={ref}
                style={style}
                className={classNames(className)}
                paddingBottom="xl"
                {...rest}
            >
                {resolvedTitle && <Heading as="h2" id={slugify(resolvedTitle)} variant="display-strong-xs" paddingBottom="l">{resolvedTitle}</Heading>}
                <Timeline items={timelineItems} />
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

export { StepsComponent };
