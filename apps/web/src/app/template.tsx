"use client";

import { Providers } from "./Providers";

export default function RootTemplate({ children }: { children: React.ReactNode; }) {
    return (
        <Providers>
            {children}
        </Providers>
    );
}

export { RootTemplate };
