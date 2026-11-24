import { notFound } from "next/navigation";
import { Column, Text, Row, Button, Icon } from "@once-ui-system/core";
import { PageHeader } from "@/shared/components/PageHeader";
import { baseURL } from "@/core/config";
import { siteCheck, person } from "@/core/config/content";
import Meta from "@/modules/seo/Meta";
import Schema from "@/modules/seo/Schema";
import { isValidUrl } from "@/core/utils/urlUtils";
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
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`${siteCheck.path}/${url}`}
        title={`Analyse de ${decodedUrl}`}
        description={`Résultats de l'analyse de ${decodedUrl}`}
        image={`${baseURL}/og?title=${encodeURIComponent(`Analyse de ${decodedUrl}`)}`}
        author={{
          name: person.name,
          url: `${baseURL}/a-propos`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      
      <PageHeader
        id="analysis-title"
        eyebrow="Audit de site"
        title="Analyse de site"
        lead={
          <Row as="span" gap="xs" vertical="center" wrap>
            <Icon name="globe" onBackground="neutral-weak" size="s" />
            <Text
              as="a"
              href={decodedUrl}
              target="_blank"
              rel="noopener noreferrer"
              textVariant="body-default-m"
              onBackground="accent-weak"
            >
              {decodedUrl}
            </Text>
            <Icon name="linkblank" onBackground="neutral-weak" size="xs" />
          </Row>
        }
      >
        <Link href="/site-check">
          <Button variant="secondary" size="m" prefixIcon="chevronLeft">
            Nouvelle analyse
          </Button>
        </Link>
      </PageHeader>
    </Column>
  );
}
