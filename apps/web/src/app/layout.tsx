import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import classNames from "classnames";

import { baseURL, style, fonts, home } from "@/app/resources";

import { Column, Flex, LayoutProvider, Meta } from "@once-ui-system/core";

import Script from "next/script";
import { convertirTimestampGoogle } from "@/utils/utils";
import { getAvis } from "./utils/serverActions";
import { siteTypes } from "./(main)/estimation/estimationData";

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
    "@type": "ProfessionalService",
    "name": "Occitaweb",
    "url": "https://occitaweb.fr",
    "telephone": "+33 6 72 11 50 06",
    "priceRange": "€€€€",
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
    <LayoutProvider>
      <Flex
        suppressHydrationWarning
        as="html"
        lang="fr"
        background="page"
        className={classNames(
          fonts.heading.variable,
          fonts.body.variable,
          fonts.label.variable,
          fonts.code.variable,
        )}
      >
        <head>
          <Script id="theme-fn"
            // strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (function () {
                try {
                  const root = document.documentElement;

                  const defaultTheme = 'system';
                  root.setAttribute('data-neutral', ${style.neutral});
                  root.setAttribute('data-brand', ${style.brand});
                  root.setAttribute('data-accent', ${style.accent});
                  root.setAttribute('data-solid', ${style.solid});
                  root.setAttribute('data-solid-style', ${style.solidStyle});
                  root.setAttribute('data-border', ${style.border});
                  root.setAttribute('data-surface', ${style.surface});
                  root.setAttribute('data-transition', ${style.transition});
                  root.setAttribute('data-scaling', ${style.scaling});
                  root.setAttribute('data-viz-style', ${style.vizStyle});

                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };

                  const theme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(theme);
                  root.setAttribute('data-theme', resolvedTheme);

                  const styleKeys = ['neutral', 'brand', 'accent', 'solid', 'solid-style', 'viz-style', 'border', 'surface', 'transition', 'scaling'];
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `}} />
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
        <Column style={{ minHeight: "100vh" }} as="body" fillWidth margin="0" padding="0">
          {children}
        </Column>
        <Script id="LocalBusiness" type="application/ld+json" dangerouslySetInnerHTML={{
          __html: schema
        }} />
      </Flex >
    </LayoutProvider>
  );
}
