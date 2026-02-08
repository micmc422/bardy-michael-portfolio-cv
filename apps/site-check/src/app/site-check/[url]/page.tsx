import { notFound } from "next/navigation";
import { Column, Heading, Text, Row, Button, Icon } from "@once-ui-system/core";
import { baseURL, siteCheck } from "@/app/resources/content";
import Meta from "@/modules/seo/Meta";
import { isValidUrl } from "@/app/utils/urlUtils";
import Link from "next/link";

interface PageParams {
  params: Promise<{ url: string }>;
}

export async function generateMetadata({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  return Meta.generate({
    title: `Analyse de ${decodedUrl} | ${siteCheck.title}`,
    description: `Résultats de l'analyse de ${decodedUrl} : performance, SEO, sécurité, accessibilité et compatibilité mobile.`,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(`Analyse de ${decodedUrl}`)}`,
    path: `${siteCheck.path}/${url}`,
  });
}

export default async function AnalysisPage({ params }: PageParams) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);
  
  if (!isValidUrl(decodedUrl)) {
    notFound();
  }

  return (
    <Column gap="m" fillWidth>
      <Row vertical="center" gap="m" fillWidth horizontal="between" wrap>
        <Column gap="xs">
          <Row gap="xs" vertical="center">
            <Link href="/site-check">
              <Button variant="tertiary" size="s">
                <Icon name="chevronLeft" />
                Nouvelle analyse
              </Button>
            </Link>
          </Row>
          <Heading as="h1" variant="display-strong-l">
            Analyse de site
          </Heading>
          <Row gap="xs" vertical="center">
            <Icon name="globe" onBackground="neutral-weak" size="s" />
            <Text
              as="a"
              href={decodedUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="body-default-m"
              onBackground="accent-weak"
            >
              {decodedUrl}
            </Text>
            <Icon name="linkblank" onBackground="neutral-weak" size="xs" />
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
