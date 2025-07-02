import Script from "next/script";
import type { ReactNode } from "react";

export default async function AproposLayout({ children }: { children: ReactNode }) {
    return <>
        {children}
        <Script id="About-page" type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Michaël Bardy",
                "jobTitle": "Fullstack Developer",
                "url": "https://occitaweb.fr/a-propos",
                "worksFor": {
                    "@type": "Organization",
                    "name": "Occitaweb"
                },
                "alumniOf": [
                    {
                        "@type": "EducationalOrganization",
                        "name": "Université Champollion Albi"
                    },
                    {
                        "@type": "EducationalOrganization",
                        "name": "Cyrus formation"
                    }
                ],
                "hasOccupation": {
                    "@type": "Occupation",
                    "name": "Fullstack Developer",
                    "description": "Développeur Fullstack avec expérience chez Occitaweb, Université Champollion Albi, Paris est une photo, Cyrus formation.",
                    "skills": ["Figma", "Node.js", "TypeScript", "Prisma", "Next.js", "WordPress"]
                },
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Albi",
                    "addressRegion": "Occitanie",
                    "addressCountry": "FR"
                },
                "knowsAbout": [
                    "Développement web",
                    "Figma",
                    "Node.js",
                    "TypeScript",
                    "Prisma",
                    "Next.js",
                    "WordPress",
                    "Gestion de projet"
                ]
            })
        }} />
    </>
}