import type { ReactNode } from "react";
import { Column } from "@once-ui-system/core";

export default async function SolutionsLayout({ children }: { children: ReactNode }) {
    return <Column as="article" gap="l" center>
        {children}
    </Column>
}