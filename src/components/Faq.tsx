import React, { forwardRef, type ReactNode } from "react";
import { AccordionGroup, Column, Heading } from "@once-ui-system/core";
import { getRandomSixDigitNumber, slugify } from "@/utils/utils";

export type FaqItem = {
    title: React.ReactNode;
    content: React.ReactNode;
    link?: { label?: string; path?: string };
};

interface FaqProps extends React.ComponentProps<typeof Column> {
    className?: string;
    style?: React.CSSProperties;
    /** Données FAQ encodées en URI (legacy — préférer faq + title) */
    "data-props"?: string;
    /** JSON alternative au data-props (legacy) */
    faqData?: string;
    /** Titre affiché au-dessus du groupe (ex: "FAQ") */
    faqTitle?: React.ReactNode;
    /** Items de la FAQ — c'est le format direct recommandé */
    faq?: FaqItem[];
}

const buildFaqSchema = (faq: FaqItem[], key: string): ReactNode => {
    const jsonLDFaq = faq.map(({ title, content }) => ({
        "@type": "Question",
        name: title,
        acceptedAnswer: {
            "@type": "Answer",
            text: typeof content === "string" ? content : "",
        },
    }));
    return (
        <script
            id={`FAQ-${key}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: jsonLDFaq,
                }),
            }}
        />
    );
};

const Faq = forwardRef<HTMLDivElement, FaqProps>(
    ({ faqData, faq, faqTitle, "data-props": dataProps, ...rest }, ref) => {
        // Résolution : faq direct (recommandé) > data-props > faqData
        const items = faq ?? ([] as FaqItem[]);
        let resolvedTitle = faqTitle;
        const source = items.length > 0 ? "direct" : dataProps ?? faqData;

        if (source && items.length === 0 && source !== "direct") {
            // Fallback legacy : essai de parse du JSON fourni
            try {
                const jsonStr =
                    source === "direct"
                        ? ""
                        : decodeURIComponent(source || "[]");
                const parsed = JSON.parse(jsonStr) as {
                    title?: React.ReactNode;
                    faq?: FaqItem[];
                };
                if (parsed?.faq?.length) {
                    items.push(...parsed.faq);
                }
                if (parsed?.title && !resolvedTitle) {
                    resolvedTitle = parsed.title as string;
                }
            } catch {
                // Données invalides → pas d'items
            }
        }

        if (items.length === 0) {
            return null;
        }

        const key =
            typeof resolvedTitle === "string"
                ? slugify(resolvedTitle)
                : `${getRandomSixDigitNumber()}`;

        return (
            <Column
                as="section"
                ref={ref}
                gap="l"
                aria-labelledby={resolvedTitle ? key : undefined}
                {...rest}
            >
                {resolvedTitle && (
                    <Heading
                        as="h2"
                        variant="display-strong-s"
                        id={key}
                    >
                        {resolvedTitle}
                    </Heading>
                )}
                <AccordionGroup items={items} background="surface" />
                {buildFaqSchema(items, key)}
            </Column>
        );
    }
);

Faq.displayName = "Faq";

export { Faq };
