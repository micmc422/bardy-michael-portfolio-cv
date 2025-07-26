"use client";

import React from "react";
import { IconButton } from "@/once-ui/components";
import { ScrollToTop } from "@/once-ui/components/ScrollToTop";

export default function RootTemplate({ children }: { children: React.ReactNode; }) {
    return (
        <>
            {children}
            <ScrollToTop offset={500}>
                <IconButton icon="chevronUp" />
            </ScrollToTop>
            
        </>
    );
}

export { RootTemplate };
