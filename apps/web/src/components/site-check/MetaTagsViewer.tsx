"use client";

import { Column, Row, Text, Heading, Icon, Tag } from "@once-ui-system/core";
import { useState } from "react";

interface MetaTagsViewerProps {
  data: Record<string, string>;
}

export function MetaTagsViewer({ data }: MetaTagsViewerProps) {
  const [expanded, setExpanded] = useState(false);

  if (!data || Object.keys(data).length === 0) {
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
            Métadonnées
          </Heading>
        </Row>
        <Text variant="body-default-s" onBackground="warning-weak">
          Aucune métadonnée trouvée sur cette page.
        </Text>
      </Column>
    );
  }

  // Group meta tags by category
  const categorizeTag = (
    key: string
  ): "og" | "twitter" | "seo" | "technical" | "other" => {
    if (key.startsWith("og:")) return "og";
    if (key.startsWith("twitter:")) return "twitter";
    if (
      [
        "description",
        "keywords",
        "author",
        "robots",
        "googlebot",
        "canonical",
      ].includes(key)
    )
      return "seo";
    if (
      [
        "viewport",
        "charset",
        "theme-color",
        "color-scheme",
        "format-detection",
      ].includes(key)
    )
      return "technical";
    return "other";
  };

  const categoryLabels: Record<string, { label: string; icon: string }> = {
    seo: { label: "SEO", icon: "search" },
    og: { label: "Open Graph", icon: "share" },
    twitter: { label: "Twitter Card", icon: "twitter" },
    technical: { label: "Technique", icon: "settings" },
    other: { label: "Autres", icon: "moreHorizontal" },
  };

  const groupedTags: Record<string, { key: string; value: string }[]> = {
    seo: [],
    og: [],
    twitter: [],
    technical: [],
    other: [],
  };

  for (const [key, value] of Object.entries(data)) {
    const category = categorizeTag(key);
    groupedTags[category]?.push({ key, value });
  }

  // Count total tags
  const totalTags = Object.keys(data).length;

  // Show only important tags when collapsed
  const importantTags = [
    "description",
    "viewport",
    "robots",
    "og:title",
    "og:description",
    "og:image",
    "twitter:card",
  ];
  const visibleTags = expanded
    ? Object.entries(data)
    : Object.entries(data).filter(([key]) => importantTags.includes(key));

  return (
    <Column gap="m" fillWidth>
      <Row gap="s" vertical="center" fillWidth>
        <Icon name="tag" size="m" onBackground="accent-weak" />
        <Heading as="h3" variant="heading-strong-m">
          Métadonnées
        </Heading>
        <Tag size="s" variant="neutral">
          {totalTags} balise{totalTags > 1 ? "s" : ""}
        </Tag>
      </Row>

      {/* Category summary */}
      <Row gap="s" wrap>
        {Object.entries(groupedTags).map(
          ([category, tags]) =>
            tags.length > 0 && (
              <Tag key={category} size="s" variant="neutral">
                <Row gap="4" vertical="center">
                  <Icon
                    name={categoryLabels[category]?.icon || "tag"}
                    size="xs"
                  />
                  <Text variant="label-default-xs">
                    {categoryLabels[category]?.label || category}: {tags.length}
                  </Text>
                </Row>
              </Tag>
            )
        )}
      </Row>

      {/* Tags list */}
      <Column
        gap="xs"
        padding="m"
        background="neutral-alpha-weak"
        radius="m"
        style={{ maxHeight: expanded ? "none" : "300px", overflow: "auto" }}
      >
        {visibleTags.map(([key, value]) => (
          <Row key={key} gap="s" vertical="start">
            <Text
              variant="body-default-xs"
              onBackground="accent-weak"
              style={{
                minWidth: "140px",
                fontFamily: "monospace",
                wordBreak: "break-word",
              }}
            >
              {key}
            </Text>
            <Text
              variant="body-default-xs"
              style={{
                flex: 1,
                wordBreak: "break-word",
              }}
            >
              {value.length > 150 ? `${value.substring(0, 150)}...` : value}
            </Text>
          </Row>
        ))}
      </Column>

      {/* Expand/collapse button */}
      {totalTags > importantTags.length && (
        <Row
          gap="xs"
          vertical="center"
          style={{ cursor: "pointer" }}
          onClick={() => setExpanded(!expanded)}
        >
          <Icon
            name={expanded ? "chevronUp" : "chevronDown"}
            size="xs"
            onBackground="accent-weak"
          />
          <Text variant="body-default-xs" onBackground="accent-weak">
            {expanded
              ? "Réduire"
              : `Afficher ${totalTags - visibleTags.length} balises supplémentaires`}
          </Text>
        </Row>
      )}
    </Column>
  );
}
