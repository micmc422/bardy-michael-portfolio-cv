import React from "react";
import Script from "next/script";
import { social } from "@/app/resources/content";
import type { ReactionType } from "@/components/reactions/serverActions";

export interface SchemaProps {
  as: "website" | "article" | "blog" | "blogPosting" | "techArticle" | "webPage" | "organization";
  title: string;
  description: string;
  baseURL: string;
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
}

const schemaTypeMap = {
  website: "WebSite",
  article: "Article",
  blog: "Blog",
  blogPosting: "BlogPosting",
  techArticle: "TechArticle",
  webPage: "WebPage",
  organization: "Organization",
};

export function Schema({
  as,
  title,
  description,
  baseURL,
  path,
  datePublished,
  dateModified,
  image,
  author,
  reactions
}: SchemaProps) {
  const normalizedBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const imageUrl = image
    ? `${normalizedBaseURL}${image.startsWith("/") ? image : `/${image}`}`
    : `${normalizedBaseURL}/og?title=${encodeURIComponent(title)}`;

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
  } else {
    schema.headline = title;
    schema.description = description;
    schema.image = imageUrl;
    if (datePublished) {
      schema.datePublished = datePublished;
      schema.dateModified = dateModified || datePublished;
    }
  }

  if (author) {
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
  // console.log(schema)
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