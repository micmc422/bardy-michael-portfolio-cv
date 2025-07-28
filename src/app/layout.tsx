"use server"

import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";
import "@/tokens/scheme.scss";

import classNames from "classnames";

import { Footer, Header, RDV } from "@/components";
import { baseURL, effects, style, font, home } from "@/app/resources";

import { Background, Column, Flex, ThemeProvider, ToastProvider } from "@/once-ui/components";
import type { opacity, SpacingToken } from "@/once-ui/types";
import { Meta } from "@/once-ui/modules";

import { rendezVous } from "./resources/content";
import CookieConsent from "@/components/cookiesConsent";
import Script from "next/script";
import { convertirTimestampGoogle } from "@/utils/utils";
import { getAvis } from "./utils/serverActions";
import { siteTypes } from "./estimation/estimationData";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const { rating, reviews } = await getAvis();
  const reviewsArr = (reviews.map((el) => ({
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": el.rating,
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": el.author_name
    },
    "reviewBody": el.text,
    "datePublished": convertirTimestampGoogle(el.time)
  })))
  const offersDev = siteTypes.filter(site => site.serviceType === "Développement Web").map((site) => ({
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": site.name,
      "url": `${baseURL}/estimation/${site.slug}`,
    }
  }))
  const offersOptimisation = siteTypes.filter(site => site.serviceType === "Optimisation").map((site) => ({
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": site.name,
      "url": `${baseURL}/estimation/${site.slug}`,
    }
  }))
  const offersMaintenance = siteTypes.filter(site => site.serviceType === "Maintenance").map((site) => ({
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": site.name,
      "url": `${baseURL}/estimation/${site.slug}`,
    }
  }))
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebDevelopmentService",
    "name": "Occitaweb",
    "url": "https://occitaweb.fr",
    "telephone": "+33 6 72 11 50 06",
    "priceRange": "€€€",
    "image": "https://occitaweb.fr/occ-screenshot-wide.png",
    "logo": "https://occitaweb.fr/trademark/icon-dark.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "25 avenue gambetta",
      "addressLocality": "Albi",
      "postalCode": "81000",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "43.923547089460214",
      "longitude": "2.147658324244786"
    },
    "hasMap": "https://www.google.com/maps/place/25+Av.+Gambetta,+81000+Albi",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "serviceType": "Agence de développement web",
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Occitanie"
      },
      {
        "@type": "City",
        "name": "Albi"
      },
      {
        "@type": "Country",
        "name": "France"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviews.length
    },
    "review": reviewsArr,
    "potentialAction": {
      "@type": "BookAction", // Indique que l'action est une réservation/prise de rendez-vous
      "name": "Prendre un rendez-vous",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://cal.com/occitaweb", // L'URL de votre page Cal.com
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "url": "https://cal.com/occitaweb" // Redondance pour certaines interprétations, mais bonne pratique
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Catalogue des Services Web Occitaweb",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Développement Web",
          "itemListElement": offersDev
        },
        {
          "@type": "OfferCatalog",
          "name": "Optimisation de site",
          "itemListElement": offersOptimisation
        },
        {
          "@type": "OfferCatalog",
          "name": "Maintenance serveur et gestion de site",
          "itemListElement": offersMaintenance
        }
      ]
    },
    "knowsAbout": ["Développement Web", "WordPress", "Next.js", "SEO", "Design UI/UX"],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+33 6 72 11 50 06",
        "contactType": "Service client",
        "areaServed": "FR",
        "availableLanguage": ["French"]
      },
      {
        "@type": "ContactPoint",
        "email": "contact@occitaweb.fr",
        "contactType": "Support technique"
      }
    ]
  })
  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang="fr"
      background="page"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-border={style.border}
      data-surface={style.surface}
      data-transition={style.transition}
      className={classNames(
        font.primary.variable,
        font.secondary.variable,
        font.tertiary.variable,
        font.code.variable,
      )}
    >
      <head>
        <Script id="theme-fn"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const root = document.documentElement;
                  if (theme === 'system') {
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
                  } else {
                    root.setAttribute('data-theme', theme);
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        <link rel="apple-touch-icon" sizes="57x57" href="/images/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/images/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/images/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/images/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/images/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/images/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/images/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/images/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/images/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <ThemeProvider>
        <ToastProvider>
          <Column style={{ minHeight: "100vh" }} as="body" fillWidth margin="0" padding="0">
            <Background
              position="fixed"
              mask={{
                x: effects.mask.x,
                y: effects.mask.y,
                radius: effects.mask.radius,
                cursor: effects.mask.cursor
              }}
              gradient={{
                display: effects.gradient.display,
                opacity: effects.gradient.opacity as opacity,
                x: effects.gradient.x,
                y: effects.gradient.y,
                width: effects.gradient.width,
                height: effects.gradient.height,
                tilt: effects.gradient.tilt,
                colorStart: effects.gradient.colorStart,
                colorEnd: effects.gradient.colorEnd,
              }}
              dots={{
                display: effects.dots.display,
                opacity: effects.dots.opacity as opacity,
                size: effects.dots.size as SpacingToken,
                color: effects.dots.color,
              }}
              grid={{
                display: effects.grid.display,
                opacity: effects.grid.opacity as opacity,
                color: effects.grid.color,
                width: effects.grid.width,
                height: effects.grid.height,
              }}
              lines={{
                display: effects.lines.display,
                opacity: effects.lines.opacity as opacity,
                size: effects.lines.size as SpacingToken,
                thickness: effects.lines.thickness,
                angle: effects.lines.angle,
                color: effects.lines.color,
              }}
            />
            <Flex fillWidth minHeight="16" hide="s"></Flex>
            <Header />
            <Flex
              zIndex={0}
              fillWidth
              paddingY="l"
              paddingX="l"
              horizontal="center"
              flex={1}
            >
              <Column horizontal="center" fillWidth minHeight="0" as="main">
                <>{children}</>
              </Column>
            </Flex>
            <Flex
              zIndex={0}
              fillWidth
              paddingY="l"
              paddingX="l"
              horizontal="center"
              flex={1}
            >
              <Flex horizontal="center" fillWidth minHeight="0">
                <RDV content={rendezVous} />
              </Flex>
            </Flex>
            <Footer />
          </Column>
          <CookieConsent />
        </ToastProvider>
      </ThemeProvider>
      <Script id="LocalBusiness" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: schema
      }} />

    </Flex>
  );
}
