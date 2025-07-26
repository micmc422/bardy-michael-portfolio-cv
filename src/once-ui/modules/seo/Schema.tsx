import React from "react";
import { home, person, social } from "@/app/resources/content";
import type { ReactionType } from "@/components/reactions/serverActions";
import Script from "next/script";
import type { PostType } from "@/app/utils/types";
import { baseURL, breadCrumbs } from "@/app/resources/config";
import { siteTypes } from "@/app/estimation/estimationData";
import { getFileData } from "@/app/sitemap";

export interface SchemaProps {
  as: "website" | "article" | "blog" | "blogPosting" | "techArticle" | "webPage" | "organization" | "aboutPage" | "service";
  title: string;
  description: string;
  baseURL?: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  author?: {
    name: string;
    url?: string;
    image?: string;
  };
  reactions?: ReactionType[]
  projet?: PostType
  offerSlug?: string
}

const schemaTypeMap = {
  website: "WebSite",
  article: "Article",
  blog: "Blog",
  blogPosting: "BlogPosting",
  techArticle: "TechArticle",
  webPage: "WebPage",
  organization: "Organization",
  aboutPage: "AboutPage",
  service: "Service",
};

function getPriceValidUntilDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // mois : 0-11
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function Schema({
  as,
  title,
  description,
  // baseURL = baseURL || "https://occitaweb.fr",
  path,
  datePublished,
  dateModified,
  image,
  author,
  reactions,
  projet,
  offerSlug
}: SchemaProps) {

  const normalizedBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const imageUrl = image
    ? `${image.startsWith("\/") ? image : `${image}`}`
    : `/og?title=${encodeURIComponent(title)}`;
  const url = `${normalizedBaseURL}${normalizedPath}`;

  const schemaType = schemaTypeMap[as];

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    url,
  };

  schema.sameAs = Object.values(social).filter(Boolean).map(({ link }) => link).filter(el => el !== "")

  if (as === "website") {
    schema.name = title;
    schema.description = description;
    schema.image = imageUrl;
  } else if (as === "organization") {
    schema.name = title;
    schema.description = description;
    schema.image = imageUrl;
  } else if (as === "service") {
    //  const avis = await getAvis();
    // console.log(avis);
    schema.name = title;
    schema.description = description;
    schema.image = baseURL + imageUrl;
    /*
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": avis?.rating,
      "reviewCount": avis?.reviews.length,
    };
    */
    schema.provider = {
      "@type": "Organization",
      "name": "Occitaweb",
      "url": "https://occitaweb.fr",
      "sameAs": schema.sameAs
    }
    delete schema.sameAs;
    if (offerSlug) {
      const offer = siteTypes.find(el => el.slug === offerSlug);
      let maxPrice = offer?.basePrice || 0
      offer?.options.forEach(opt => maxPrice += opt.price);
      schema.offers = {
        "@type": "Offer",
        "priceValidUntil": getPriceValidUntilDate(),
        "priceCurrency": "EUR",
        "price": offer?.basePrice,
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "EUR",
          "price": offer?.basePrice,
          "minPrice": offer?.basePrice,
          "maxPrice": maxPrice,
          "valueAddedTaxIncluded": false
        },
        "availability": "https://schema.org/InStock",
        "url": `${baseURL}/estimation/${offer?.slug}`
      };
    }
  } else if (as === "webPage") {
    const filepath = path.replace(/\/estimation\/?.*$/, '/estimation')
    const dateModified = await getFileData(filepath);
    schema.name = title;
    schema.description = description;
    schema.image = imageUrl;
    schema.inLanguage = "fr-FR";
    schema.datePublished = "2015-01-01T00:00:00+00:00"; // Date de publication par défaut
    schema.dateModified = dateModified;
    schema.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": `${baseURL}${path}`
    };
    schema.author = {
      "@type": "Person",
      "name": person.name,
      "url": "https://occitaweb.fr/a-propos"
    };
    schema.publisher = {
      "@type": "Organization",
      "name": "Occitaweb",
      "logo": {
        "@type": "ImageObject",
        "url": "https://occitaweb.fr/trademark/icon-dark.png" // URL de votre logo
      }
    }
    delete schema.sameAs;
    if (projet) {
      schema.mainEntity = {
        "@type": "SoftwareApplication",
        "name": projet.metadata.title,
        "url": "https://occitaweb.fr/realisations/plateforme-introduction-aux-technologies-du-web",
        "description": projet.metadata.summary,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "datePublished": projet.metadata.publishedAt,
        "dateModified": projet.metadata.publishedAt,
        "author": {
          "@type": "Person",
          name: author?.name,
          ...(author?.url && { url: author.url }),
          ...(author?.image && {
            image: {
              "@type": "ImageObject",
              url: author.image,
            },
          }),
          sameAs: schema.sameAs
        },
        "publisher": {
          "@type": "Organization",
          "name": "Occitaweb",
          "url": "https://occitaweb.fr",
          "logo": {
            "@type": "ImageObject",
            "url": "https://occitaweb.fr/trademark/icon-dark.png"
          }
        },
        "keywords": "HTML, CSS, JavaScript, plateforme pédagogique"
      }
    }
  } else if (as === "aboutPage") {
    schema.name = `À propos - ${title}`;
    schema.description = description;
    schema.image = imageUrl;
    schema.mainEntity = {
      "@type": "Person",
      name: person.name,
      "jobTitle": person.role,
      "url": baseURL,
      "image": baseURL + person.avatar,
      "sameAs": social.map(({ link }) => link),
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
    };
  } else {
    schema.headline = title;
    schema.description = description;
    schema.image = imageUrl;
    if (datePublished) {
      schema.datePublished = datePublished;
      schema.dateModified = dateModified || datePublished;
    }
  }
  if (as === "webPage" || as === "blog" || as === "aboutPage" || as === "blogPosting") {
    const partItems = path.split("/").filter(el => el !== "") as unknown as [keyof typeof breadCrumbs, string, string] | [keyof typeof breadCrumbs, string] | [keyof typeof breadCrumbs];
    // partItems.shift()
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": breadCrumbs["root"].title,
          "item": `${baseURL}${home.path}`
        }
      ]
    }
    if (partItems?.length > 0) {
      const lvl2Item = {
        "@type": "ListItem",
        "position": 2,
        "name": breadCrumbs[partItems[0]].title,
        "item": `${baseURL}${breadCrumbs[partItems[0]].path}`
      }
      schema.breadcrumb.itemListElement.push(lvl2Item);
    }
    if (partItems.length > 1) {
      const lvl3Item = {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `${baseURL}${path}`
      }
      schema.breadcrumb.itemListElement.push(lvl3Item);
    }
  }
  if (author && as !== "webPage") {
    schema.author = {
      "@type": "Person",
      name: author.name,
      ...(author.url && { url: author.url }),
      ...(author.image && {
        image: {
          "@type": "ImageObject",
          url: author.image,
        },
      }),
      sameAs: schema.sameAs
    };
  }
  if (as === 'blogPosting') {
    delete schema.sameAs;
    if (reactions) {
      schema.interactionStatistic = reactions.map((item) => ({
        "@type": "InteractionCounter",
        "interactionType": { "@type": item.actionType }, // Ou "ShareAction", "CommentAction", "ViewAction", etc.
        "userInteractionCount": item.count, // Le nombre d'interactions
        "name": item.emoji
      }))
    }
  }
  return (
    <Script
      id={`schema-${as}-${path}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

export default Schema;