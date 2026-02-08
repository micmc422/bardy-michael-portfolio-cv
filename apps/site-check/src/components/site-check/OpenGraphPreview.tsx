"use client";

import { Column, Row, Text, Heading, Icon } from "@once-ui-system/core";
import type { OpenGraphData } from "@/app/utils/types";
import Image from "next/image";

interface OpenGraphPreviewProps {
  data: OpenGraphData;
  url: string;
}

export function OpenGraphPreview({ data, url }: OpenGraphPreviewProps) {
  const hasData = data.title || data.description || data.image;

  if (!hasData) {
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
            Aperçu Open Graph
          </Heading>
        </Row>
        <Text variant="body-default-s" onBackground="warning-weak">
          Aucune donnée Open Graph trouvée. Les partages sur les réseaux sociaux
          n&apos;auront pas d&apos;aperçu attractif.
        </Text>
      </Column>
    );
  }

  // Extract domain from URL
  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  return (
    <Column gap="m" fillWidth>
      <Row gap="s" vertical="center">
        <Icon name="share" size="m" onBackground="accent-weak" />
        <Heading as="h3" variant="heading-strong-m">
          Aperçu Open Graph
        </Heading>
      </Row>

      {/* Facebook/LinkedIn Preview */}
      <Column gap="s" fillWidth>
        <Text variant="label-default-s" onBackground="neutral-weak">
          Facebook / LinkedIn
        </Text>
        <Column
          background="surface"
          radius="m"
          border="neutral-alpha-weak"
          style={{ overflow: "hidden", maxWidth: "500px" }}
        >
          {data.image && (
            <div
              style={{
                width: "100%",
                height: "260px",
                position: "relative",
                backgroundColor: "var(--neutral-alpha-weak)",
              }}
            >
              <Image
                src={data.image}
                alt={data.title || "Open Graph image"}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
          )}
          <Column padding="m" gap="xs">
            <Text
              variant="body-default-xs"
              onBackground="neutral-weak"
              style={{ textTransform: "uppercase" }}
            >
              {domain}
            </Text>
            <Text variant="label-strong-s" style={{ lineHeight: 1.3 }}>
              {data.title || "Titre non défini"}
            </Text>
            {data.description && (
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {data.description}
              </Text>
            )}
          </Column>
        </Column>
      </Column>

      {/* Twitter Card Preview */}
      {(data.twitterCard || data.twitterTitle || data.twitterImage) && (
        <Column gap="s" fillWidth>
          <Text variant="label-default-s" onBackground="neutral-weak">
            Twitter / X
          </Text>
          <Column
            background="surface"
            radius="m"
            border="neutral-alpha-weak"
            style={{ overflow: "hidden", maxWidth: "500px" }}
          >
            {(data.twitterImage || data.image) && (
              <div
                style={{
                  width: "100%",
                  height: data.twitterCard === "summary" ? "125px" : "260px",
                  position: "relative",
                  backgroundColor: "var(--neutral-alpha-weak)",
                }}
              >
                <Image
                  src={data.twitterImage || data.image || ""}
                  alt={data.twitterTitle || data.title || "Twitter image"}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
            )}
            <Column padding="m" gap="xs">
              <Text variant="label-strong-s" style={{ lineHeight: 1.3 }}>
                {data.twitterTitle || data.title || "Titre non défini"}
              </Text>
              {(data.twitterDescription || data.description) && (
                <Text
                  variant="body-default-xs"
                  onBackground="neutral-weak"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {data.twitterDescription || data.description}
                </Text>
              )}
              <Row gap="xs" vertical="center">
                <Icon name="link" size="xs" onBackground="neutral-weak" />
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {domain}
                </Text>
              </Row>
            </Column>
          </Column>
        </Column>
      )}

      {/* OG Metadata Details */}
      <Column gap="s" padding="m" background="neutral-alpha-weak" radius="m">
        <Text variant="label-default-s" onBackground="neutral-strong">
          Métadonnées Open Graph
        </Text>
        <Column gap="xs">
          {data.title && (
            <Row gap="s">
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{ minWidth: "120px" }}
              >
                og:title
              </Text>
              <Text variant="body-default-xs">{data.title}</Text>
            </Row>
          )}
          {data.description && (
            <Row gap="s">
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{ minWidth: "120px" }}
              >
                og:description
              </Text>
              <Text
                variant="body-default-xs"
                style={{
                  wordBreak: "break-word",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {data.description}
              </Text>
            </Row>
          )}
          {data.image && (
            <Row gap="s">
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{ minWidth: "120px" }}
              >
                og:image
              </Text>
              <Text
                variant="body-default-xs"
                onBackground="accent-weak"
                style={{ wordBreak: "break-all" }}
              >
                {data.image}
              </Text>
            </Row>
          )}
          {data.url && (
            <Row gap="s">
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{ minWidth: "120px" }}
              >
                og:url
              </Text>
              <Text variant="body-default-xs">{data.url}</Text>
            </Row>
          )}
          {data.type && (
            <Row gap="s">
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{ minWidth: "120px" }}
              >
                og:type
              </Text>
              <Text variant="body-default-xs">{data.type}</Text>
            </Row>
          )}
          {data.siteName && (
            <Row gap="s">
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{ minWidth: "120px" }}
              >
                og:site_name
              </Text>
              <Text variant="body-default-xs">{data.siteName}</Text>
            </Row>
          )}
          {data.locale && (
            <Row gap="s">
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{ minWidth: "120px" }}
              >
                og:locale
              </Text>
              <Text variant="body-default-xs">{data.locale}</Text>
            </Row>
          )}
        </Column>

        {/* Twitter Card Metadata */}
        {(data.twitterCard || data.twitterSite || data.twitterCreator) && (
          <>
            <Text
              variant="label-default-s"
              onBackground="neutral-strong"
              style={{ marginTop: "0.5rem" }}
            >
              Métadonnées Twitter Card
            </Text>
            <Column gap="xs">
              {data.twitterCard && (
                <Row gap="s">
                  <Text
                    variant="body-default-xs"
                    onBackground="neutral-weak"
                    style={{ minWidth: "120px" }}
                  >
                    twitter:card
                  </Text>
                  <Text variant="body-default-xs">{data.twitterCard}</Text>
                </Row>
              )}
              {data.twitterSite && (
                <Row gap="s">
                  <Text
                    variant="body-default-xs"
                    onBackground="neutral-weak"
                    style={{ minWidth: "120px" }}
                  >
                    twitter:site
                  </Text>
                  <Text variant="body-default-xs">{data.twitterSite}</Text>
                </Row>
              )}
              {data.twitterCreator && (
                <Row gap="s">
                  <Text
                    variant="body-default-xs"
                    onBackground="neutral-weak"
                    style={{ minWidth: "120px" }}
                  >
                    twitter:creator
                  </Text>
                  <Text variant="body-default-xs">{data.twitterCreator}</Text>
                </Row>
              )}
            </Column>
          </>
        )}
      </Column>
    </Column>
  );
}
