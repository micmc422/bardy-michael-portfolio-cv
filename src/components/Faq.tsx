import React, { forwardRef, type ReactNode } from "react";
import { AccordionGroup, Column, Heading } from "@once-ui-system/core";
import { getRandomSixDigitNumber, slugify } from "@/utils/utils";
import Script from "next/script";


interface FaqProps extends React.ComponentProps<typeof Column> {
    className?: string;
    style?: React.CSSProperties;
    "data-props"?: string;
    faqData?: string
}

interface FAQType {
    title?: string;
    faq?: {
        title: string;
        content: ReactNode;
        link?: {
            label?: string;
            path?: string
        }
    }[];
    list?: never
}
interface LISTType {
    title?: string;
    list?: {
        title: string;
        content: string;
    }[];
    faq?: never
}

const Faq = forwardRef<HTMLDivElement, FaqProps>(
    ({ faqData, ...rest }, ref) => {
        const jsonStr = faqData || decodeURIComponent(rest["data-props"] || "[]");
        const { faq, list, title } = JSON.parse(jsonStr) as FAQType | LISTType;
        if (faq) {
            const jsonLDFaq = faq.map(({ title, content }) => ({
                "@type": "Question",
                "name": title,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": content
                }
            }))
            return (<Column ref={ref} gap="l" {...rest}>
                {title && <Heading as="h2" variant="display-strong-s" id={slugify(title)}>{title || "FAQ"}</Heading>}
                <AccordionGroup items={faq} background="surface" />
                <Script id={`FAQ-${typeof title === "string" ? title : `${getRandomSixDigitNumber()}`}`} type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: `{
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": ${JSON.stringify(jsonLDFaq)}
                    }`
                }} />
            </Column>
            );
        }
        if (list) {
            const jsonLDList = list.map(({ title, content }, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "item": { "name": title || content },
            }))

            return (<Column ref={ref} gap="l" paddingBottom="xl" {...rest}>
                {title && <Heading as="h2" variant="display-strong-xs" id={slugify(title)}>{title}</Heading>}
                <AccordionGroup items={list} background="surface" />
                <Script id={`FAQ-${typeof title === "string" ? title : `${getRandomSixDigitNumber()}`}`} type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: `{
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "itemListOrder": "http://schema.org/ItemListOrderAscending",
                        "numberOfItems": ${list.length},
                        "itemListElement": ${JSON.stringify(jsonLDList)}
                    }`
                }} />
            </Column>
            );
        }

    }
);

Faq.displayName = "Faq";

export { Faq };
