"use client";

import { Column, Row, Text, Heading, Icon, Tag } from "@once-ui-system/core";
import type { JsonLdData } from "@/app/utils/types";
import { useState } from "react";

interface JsonLdViewerProps {
  data: JsonLdData[];
}

function JsonLdItem({ item, index }: { item: JsonLdData; index: number }) {
  const [expanded, setExpanded] = useState(false);

  // Get schema type icon
  const getTypeIcon = (type: string): string => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("organization") || typeLower.includes("business"))
      return "building";
    if (typeLower.includes("person")) return "user";
    if (typeLower.includes("product")) return "package";
    if (typeLower.includes("article") || typeLower.includes("blog"))
      return "fileText";
    if (typeLower.includes("event")) return "calendar";
    if (typeLower.includes("website")) return "globe";
    if (typeLower.includes("breadcrumb")) return "chevronsRight";
    if (typeLower.includes("faq")) return "helpCircle";
    if (typeLower.includes("review") || typeLower.includes("rating"))
      return "star";
    if (typeLower.includes("video")) return "video";
    if (typeLower.includes("image")) return "image";
    if (typeLower.includes("recipe")) return "book";
    if (typeLower.includes("offer")) return "tag";
    return "code";
  };

  // Get type description
  const getTypeDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      Organization:
        "Informations sur votre entreprise (nom, logo, coordonnées)",
      LocalBusiness:
        "Entreprise locale avec adresse physique, horaires, avis",
      Person: "Informations sur une personne (auteur, fondateur)",
      Product: "Produit avec prix, disponibilité, avis",
      Article: "Article de blog ou actualité",
      BlogPosting: "Article de blog avec auteur et date",
      WebSite: "Informations générales sur le site web",
      WebPage: "Informations sur une page spécifique",
      BreadcrumbList: "Fil d'Ariane pour la navigation",
      FAQPage: "Page de questions fréquentes",
      Review: "Avis client",
      AggregateRating: "Note moyenne agrégée",
      Event: "Événement avec date, lieu, prix",
      VideoObject: "Vidéo avec durée, description",
      ImageObject: "Image avec dimensions, description",
      Recipe: "Recette de cuisine",
      Offer: "Offre commerciale",
      Service: "Service proposé",
    };
    return descriptions[type] || `Schéma de type ${type}`;
  };

  // Format JSON for display
  const formatJson = (obj: Record<string, unknown>, indent = 0): string => {
    return JSON.stringify(obj, null, 2);
  };

  // Extract key properties for summary
  const getSummaryProps = (
    parsed: Record<string, unknown>
  ): { label: string; value: string }[] => {
    const props: { label: string; value: string }[] = [];
    const keyFields = [
      "name",
      "@type",
      "description",
      "url",
      "image",
      "address",
      "telephone",
      "email",
      "priceRange",
      "aggregateRating",
    ];

    for (const field of keyFields) {
      if (parsed[field]) {
        let value = parsed[field];
        if (typeof value === "object") {
          if (field === "aggregateRating") {
            const rating = value as Record<string, unknown>;
            value = `${rating.ratingValue || "?"}/5 (${rating.reviewCount || "?"} avis)`;
          } else if (field === "address") {
            const addr = value as Record<string, unknown>;
            value = [
              addr.streetAddress,
              addr.postalCode,
              addr.addressLocality,
            ]
              .filter(Boolean)
              .join(", ");
          } else if (field === "image") {
            if (Array.isArray(value)) {
              value = `${value.length} image(s)`;
            } else if (typeof value === "object") {
              value = (value as Record<string, unknown>).url || "[Image]";
            }
          } else {
            continue; // Skip complex objects we can't display simply
          }
        }
        if (value && field !== "@type") {
          props.push({
            label: field,
            value: String(value).substring(0, 100),
          });
        }
      }
    }
    return props.slice(0, 5); // Limit to 5 properties
  };

  const summaryProps = getSummaryProps(item.parsed);

  return (
    <Column
      gap="m"
      padding="m"
      background="surface"
      radius="m"
      border="neutral-alpha-weak"
      fillWidth
    >
      {/* Header */}
      <Row
        gap="s"
        vertical="center"
        fillWidth
        style={{ cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <Icon
          name={getTypeIcon(item.type)}
          size="m"
          onBackground="accent-weak"
        />
        <Column gap="2" flex={1}>
          <Row gap="s" vertical="center">
            <Tag size="s" variant="accent">
              {item.type}
            </Tag>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              #{index + 1}
            </Text>
          </Row>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {getTypeDescription(item.type)}
          </Text>
        </Column>
        <Icon
          name={expanded ? "chevronUp" : "chevronDown"}
          size="s"
          onBackground="neutral-weak"
        />
      </Row>

      {/* Summary Properties */}
      {summaryProps.length > 0 && (
        <Column gap="xs" paddingLeft="l">
          {summaryProps.map((prop, i) => (
            <Row key={i} gap="s">
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{ minWidth: "100px" }}
              >
                {prop.label}:
              </Text>
              <Text
                variant="body-default-xs"
                style={{
                  wordBreak: "break-word",
                  flex: 1,
                }}
              >
                {prop.value}
              </Text>
            </Row>
          ))}
        </Column>
      )}

      {/* Expanded JSON View */}
      {expanded && (
        <Column
          gap="s"
          padding="m"
          background="neutral-alpha-weak"
          radius="s"
          style={{ overflow: "auto", maxHeight: "400px" }}
        >
          <Row gap="s" vertical="center">
            <Icon name="code" size="xs" onBackground="neutral-weak" />
            <Text variant="label-default-xs" onBackground="neutral-weak">
              Code JSON-LD complet
            </Text>
          </Row>
          <pre
            style={{
              margin: 0,
              fontSize: "11px",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "var(--neutral-on-background-strong)",
            }}
          >
            {formatJson(item.parsed)}
          </pre>
        </Column>
      )}
    </Column>
  );
}

export function JsonLdViewer({ data }: JsonLdViewerProps) {
  if (!data || data.length === 0) {
    return (
      <Column
        padding="l"
        gap="m"
        background="warning-alpha-weak"
        radius="l"
        border="warning-alpha-medium"
        fillWidth
      >
        <Row gap="s" vertical="center">
          <Icon name="warningTriangle" size="m" onBackground="warning-weak" />
          <Heading as="h3" variant="heading-strong-m">
            Données Structurées JSON-LD
          </Heading>
        </Row>
        <Text variant="body-default-s" onBackground="warning-weak">
          Aucune donnée JSON-LD trouvée. Les données structurées permettent
          d&apos;obtenir des résultats enrichis dans Google (étoiles, prix,
          FAQ...).
        </Text>
        <Text
          as="a"
          href="https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data"
          target="_blank"
          rel="noopener noreferrer"
          variant="body-default-xs"
          onBackground="accent-weak"
          style={{ textDecoration: "underline" }}
        >
          📖 Guide Google sur les données structurées
        </Text>
      </Column>
    );
  }

  return (
    <Column gap="m" fillWidth>
      <Row gap="s" vertical="center">
        <Icon name="code" size="m" onBackground="accent-weak" />
        <Heading as="h3" variant="heading-strong-m">
          Données Structurées JSON-LD
        </Heading>
        <Tag size="s" variant="success">
          {data.length} trouvé{data.length > 1 ? "s" : ""}
        </Tag>
      </Row>

      <Text variant="body-default-s" onBackground="neutral-weak">
        Les données structurées Schema.org permettent à Google de mieux
        comprendre votre contenu et d&apos;afficher des résultats enrichis.
      </Text>

      <Column gap="s" fillWidth>
        {data.map((item, index) => (
          <JsonLdItem key={index} item={item} index={index} />
        ))}
      </Column>

      <Row gap="s" wrap>
        <Text
          as="a"
          href="https://validator.schema.org/"
          target="_blank"
          rel="noopener noreferrer"
          variant="body-default-xs"
          onBackground="accent-weak"
          style={{ textDecoration: "underline" }}
        >
          🔍 Tester sur Schema.org Validator
        </Text>
        <Text
          as="a"
          href="https://search.google.com/test/rich-results"
          target="_blank"
          rel="noopener noreferrer"
          variant="body-default-xs"
          onBackground="accent-weak"
          style={{ textDecoration: "underline" }}
        >
          🔍 Google Rich Results Test
        </Text>
      </Row>
    </Column>
  );
}
