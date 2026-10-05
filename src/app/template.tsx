"use client";

import { Providers } from "@/core/Providers";

export default function RootTemplate({ children }: { children: React.ReactNode; }) {
    return (
        <Providers>
            {children}
        </Providers>
    );
}

export { RootTemplate };
