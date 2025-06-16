"use client"

import Script from 'next/script'
import { use, useEffect } from 'react'

declare global {
    interface Window {
        dataLayer: any[];
    }
}


export default function RdvPage() {
    let dataLayer = []
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.dataLayer = window.dataLayer || [];
            function gtag(p0: string, p1: any){dataLayer.push(arguments)}
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
