import type { ReactNode } from "react";
import { Column } from "@once-ui-system/core";

export default async function AproposLayout({ children }: { children: ReactNode }) {
    return <Column gap="l" center>
        {children}
    </Column>
}