import React, { forwardRef } from "react";
import { AccordionGroup, Column, Heading } from "@/once-ui/components";
import { slugify } from "@/utils/utils";


interface FaqProps extends React.ComponentProps<typeof Column> {
    className?: string;
    style?: React.CSSProperties;
    "data-props"?: string;
}

interface FAQType {
    title?: string;
    faq?: {
        title: string;
        content: string;
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
    ({ className, style, ...rest }, ref) => {
        const jsonStr = decodeURIComponent(rest["data-props"] || "[]");
        const { faq, list, title } = JSON.parse(jsonStr) as FAQType | LISTType;
        if (faq) {
            const jsonLDFaq = faq.map(({ title, content }) => ({
                "@type": "Question",
                "name": title,
                "acceptedAnswer": content
            }))
            return (<Column ref={ref} gap="l">
                {title && <Heading as="h2" id={slugify(title)}>{title || "FAQ"}</Heading>}
                <AccordionGroup items={faq} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: {
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": jsonLDFaq
                    }
                }} />
            </Column>
            );
        }
        if (list) {
            const jsonLDFaq = list.map(({ title, content }, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": title,
                "acceptedAnswer": content
            }))

            return (<Column ref={ref} gap="l" paddingBottom="xl">
                {title && <Heading as="h2" id={slugify(title)}>{title}</Heading>}
                <AccordionGroup items={list} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: {
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": title,
                        "itemListOrder": "http://schema.org/ItemListOrderAscending",
                        "numberOfItems": list.length,
                        "itemListElement": jsonLDFaq
                    }
                }} />
            </Column>
            );
        }

    }
);

Faq.displayName = "Faq";

export { Faq };
