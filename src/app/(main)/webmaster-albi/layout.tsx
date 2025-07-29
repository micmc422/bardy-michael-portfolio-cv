import Script from "next/script";
import type { ReactNode } from "react";
import { webmasterAlbi } from "../../resources/content";
import { baseURL } from "../../resources";
import { Column } from "@once-ui-system/core";

export default async function AproposLayout({ children }: { children: ReactNode }) {
    return <Column gap="l" center>
        {children}
        <Script id="About-page" type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": "Webmaster à Albi",
                "url": baseURL + webmasterAlbi.path,
                "description": "Michaël Bardy est développeur freelance à Albi, spécialisé WordPress, Next.js, UX/UI, performance, SEO local et formateur web.",
                "keywords": "WordPress, Next.js, SEO local, UX/UI, performances web, formation",
                "mainEntity": {
                    "@type": "Person",
                    "name": "Michaël Bardy",
                    "jobTitle": "Développeur Web & Formateur",
                    "url": "https://occitaweb.fr",
                    "image": "https://occitaweb.fr/images/michael-bardy.jpg",
                    "sameAs": [
                        "https://github.com/micmc422",
                        "https://linkedin.com/in/michael-bardy"
                    ],
                    "worksFor": {
                        "@type": "Organization",
                        "name": "Occitaweb",
                        "url": "https://occitaweb.fr"
                    },
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Albi",
                        "postalCode": "81000",
                        "addressCountry": "FR"
                    },
                    "hasOccupation": [
                        {
                            "@type": "Occupation",
                            "name": "Développeur Web",
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "lastReviewed": "2024-07-23T14:20:00-05:00"
                            },
                            "description": "Conception et développement de sites WordPress, Next.js, optimisation UX/UI et performances.",
                            "educationRequirements": "Formation technique en développement web et auto‑formation continue.",
                            "skills": ["JavaScript", "React", "Next.js", "WordPress", "SEO", "Performance web"],
                            "estimatedSalary": {
                                "@type": "MonetaryAmountDistribution",
                                "name": "base",
                                "currency": "EUR",
                                "duration": "P1Y",
                                "percentile10": 30000,
                                "percentile25": 35000,
                                "median": 37500,
                                "percentile75": 42500,
                                "percentile90": 45000
                            },
                            "occupationLocation": {
                                "@type": "City",
                                "name": "Albi, FR"
                            }
                        },
                        {
                            "@type": "Occupation",
                            "name": "Formateur Web",
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "lastReviewed": "2024-07-23T14:20:00-05:00"
                            },
                            "description": "Animation d’ateliers et formations pour étudiants et professionnels (ex. Université Champollion).",
                            "educationRequirements": "Expérience professionnelle + pédagogie en environnement technique.",
                            "skills": ["Pédagogie", "Communication", "Formation web"],
                            "estimatedSalary": {
                                "@type": "MonetaryAmountDistribution",
                                "name": "base",
                                "currency": "EUR",
                                "duration": "P1Y",
                                "percentile10": 25000,
                                "percentile25": 30000,
                                "median": 32500,
                                "percentile75": 37500,
                                "percentile90": 40000
                            },
                            "occupationLocation": {
                                "@type": "City",
                                "name": "Albi, FR"
                            }
                        }
                    ]
                }
            })
        }} />
    </Column>
}