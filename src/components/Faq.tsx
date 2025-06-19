import React, { forwardRef } from "react";
import { AccordionGroup, Flex } from "@/once-ui/components";

interface FaqProps extends React.ComponentProps<typeof Flex> {
    className?: string;
    style?: React.CSSProperties;
    "data-props"?: string;
}

const Faq = forwardRef<HTMLDivElement, FaqProps>(
    ({ className, style, ...rest }, ref) => {
        const jsonStr = decodeURIComponent(rest["data-props"] || "[]");
        const { faq } = JSON.parse(jsonStr) as {
            faq: {
                title: string;
                content: string;
            }[]
        };
        return (
            <AccordionGroup ref={ref} items={faq} />
        );
    }
);

Faq.displayName = "Faq";

export { Faq };
