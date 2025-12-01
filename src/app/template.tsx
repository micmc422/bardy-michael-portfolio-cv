"use client";

import { Column } from "@once-ui-system/core";
import { Providers } from "./Providers";

export default function RootTemplate({ children }: { children: React.ReactNode; }) {
    return (
        <Providers>
            <Column style={{ minHeight: "100vh" }} fillWidth margin="0" padding="0" suppressHydrationWarning>
                {children}
            </Column>
        </Providers>
    );
}

export { RootTemplate };
