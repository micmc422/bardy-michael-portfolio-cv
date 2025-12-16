"use client";

import React from "react";
import { Column } from "@once-ui-system/core";
import { Providers } from "./Providers";

export default function RootTemplate({ children }: { children: React.ReactNode; }) {
    return (
        <Providers>
            {children}
        </Providers>
    );
}

export { RootTemplate };
