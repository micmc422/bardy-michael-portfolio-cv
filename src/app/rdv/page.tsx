"use client"

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
    interface Window {
        dataLayer: any[];
    }
}


export default function RdvPage() {
    const dataLayer = []
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.dataLayer = window.dataLayer || [];
            function gtag(_p0: string, _p1: any, ...rest: undefined[]){dataLayer.push(rest)}
            gtag('js', new Date());
            gtag('config', 'G-0FWXELBBJL');
        }
    }, []);
    return (
        <>
            <Script strategy="lazyOnload" id="gTag"  async src="https://www.googletagmanager.com/gtag/js?id=G-0FWXELBBJL">
            </Script>
        </>
    )
}
