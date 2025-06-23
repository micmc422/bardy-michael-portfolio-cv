import React, { forwardRef } from "react";
import { AccordionGroup, Flex, Heading } from "@/once-ui/components";
import { FaG } from "react-icons/fa6";

interface FaqProps extends React.ComponentProps<typeof Flex> {
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
            return (<>
                <Heading paddingBottom="l" as="h2">{title || "FAQ"}</Heading>
                <AccordionGroup ref={ref} items={faq} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: {
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": jsonLDFaq
                    }
                }} />
            </>
            );
        }
        if (list) {
            const jsonLDFaq = list.map(({ title, content }, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": title,
                "acceptedAnswer": content
            }))

            return (<>
                {title && <Heading paddingBottom="l" as="h2">{title}</Heading>}
                <AccordionGroup ref={ref} items={list} />
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
            </>
            );
        }

    }
);

Faq.displayName = "Faq";

export { Faq };
