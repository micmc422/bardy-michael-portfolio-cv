import Script from "next/script";
import type { ReactNode } from "react";

export default async function AproposLayout({ children }: { children: ReactNode }) {
    return <>
        {children}
        <Script id="About-page" type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "mainEntityOfPage": "https://occitaweb.fr/a-propos",
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
                    "skills": ["Figma", "Node.js", "TypeScript", "Prisma", "Next.js", "WordPress"],
                    "occupationLocation": {
                        "@type": "Place",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Albi",
                            "addressRegion": "Occitanie",
                            "addressCountry": "FR"
                        },
                    },
                    "estimatedSalary": {
                        "@type": "MonetaryAmount",
                        "currency": "EUR",
                        "value": {
                            "@type": "QuantitativeValue",
                            "minValue": 250,
                            "maxValue": 500,
                            "unitText": "DAY"
                        }
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
                }
            })
        }} />
    </>
}