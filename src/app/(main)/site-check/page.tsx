import { redirect } from "next/navigation";
import { Column, Heading, Text, Input, Button, Row, Icon, type IconName } from "@once-ui-system/core";
import { baseURL } from "@/core/config";
import { siteCheck, person } from "@/core/config/content";
import Meta from "@/modules/seo/Meta";
import Schema from "@/modules/seo/Schema";
import { isValidUrl, normalizeUrl } from "@/core/utils/urlUtils";

export async function generateMetadata() {
  return Meta.generate({
    title: `${siteCheck.title} | ${person.name}`,
    description: siteCheck.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(siteCheck.title)}`,
    path: siteCheck.path,
  });
}

async function handleSubmit(formData: FormData) {
  "use server";
  
  const urlInput = formData.get("url") as string;
  if (!urlInput) {
    return;
  }
  
  const normalizedUrl = normalizeUrl(urlInput.trim());
  
  if (!isValidUrl(normalizedUrl)) {
    return;
  }
  
  const encodedUrl = encodeURIComponent(normalizedUrl);
  redirect(`/site-check/${encodedUrl}`);
}

export default function SiteCheckPage() {
  return (
    <Column maxWidth="s" gap="xl" center>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={siteCheck.path}
        title={siteCheck.title}
        description={siteCheck.description}
        image={`${baseURL}/og?title=${encodeURIComponent(siteCheck.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/a-propos`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      
      <Column gap="m" horizontal="center">
        <Heading as="h1" textVariant="display-strong-xl" align="center">
          {siteCheck.headline}
        </Heading>
        <Text textVariant="body-default-l" align="center" onBackground="neutral-weak" wrap="balance">
          {siteCheck.subline}
        </Text>
      </Column>

      <form action={handleSubmit}>
        <Column fillWidth gap="m" padding="l" background="surface" radius="xl" border="neutral-alpha-weak">
          <Row gap="s" fillWidth vertical="end">
            <Column fillWidth gap="xs">
              <Text as="label" htmlFor="url-input" textVariant="label-default-s">
                URL du site à analyser
              </Text>
              <Input
                id="url-input"
                name="url"
                type="url"
                placeholder="https://exemple.com"
                required
                aria-describedby="url-help"
              />
            </Column>
            <Button type="submit" variant="primary" size="l">
              <Icon name="search" />
              Analyser
            </Button>
          </Row>
          <Text id="url-help" textVariant="body-default-xs" onBackground="neutral-weak">
            Entrez l&apos;URL complète de votre site (ex: https://monsite.fr)
          </Text>
        </Column>
      </form>

      <Column gap="l" fillWidth>
        <Heading as="h2" textVariant="display-strong-xs" align="center">
          Ce que nous analysons
        </Heading>
        <Row gap="m" wrap s={{ direction: "column" }}>
          {Object.entries(siteCheck.categories).map(([key, category]) => (
            <Column
              key={key}
              flex={1}
              minWidth="12rem"
              padding="m"
              gap="s"
              background="surface"
              radius="m"
              border="neutral-alpha-weak"
            >
              <Row gap="xs" vertical="center">
                <Icon name={category.icon as IconName} onBackground="accent-weak" />
                <Text textVariant="label-strong-m">{category.title}</Text>
              </Row>
              <Text textVariant="body-default-s" onBackground="neutral-weak">
                {category.description}
              </Text>
            </Column>
          ))}
        </Row>
      </Column>
    </Column>
  );
}
