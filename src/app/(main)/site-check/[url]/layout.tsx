import { Suspense, type ReactNode } from "react";
import { Column, Heading, Row, Skeleton, Icon } from "@once-ui-system/core";

interface LoadingCardProps {
  title: string;
  icon: string;
}

function LoadingCard({ title, icon }: LoadingCardProps) {
  return (
    <Column
      padding="l"
      gap="m"
      background="surface"
      radius="l"
      border="neutral-alpha-weak"
      fillWidth
    >
      <Row gap="s" vertical="center">
        <Icon name={icon} onBackground="neutral-weak" />
        <Heading as="h2" variant="heading-strong-m">{title}</Heading>
        <Skeleton shape="line" width="xs" height="xs" />
      </Row>
      <Column gap="s">
        <Skeleton shape="line" />
        <Skeleton shape="line" />
        <Skeleton shape="line" />
      </Column>
    </Column>
  );
}

interface AnalysisLayoutProps {
  children: ReactNode;
  performance: ReactNode;
  seo: ReactNode;
  security: ReactNode;
  accessibility: ReactNode;
  mobile: ReactNode;
}

export default function AnalysisLayout({
  children,
  performance,
  seo,
  security,
  accessibility,
  mobile,
}: AnalysisLayoutProps) {
  return (
    <Column maxWidth="l" gap="l" fillWidth center>
      {children}
      
      <Column gap="m" fillWidth>
        <Suspense fallback={<LoadingCard title="Performance" icon="zap" />}>
          {performance}
        </Suspense>

        <Suspense fallback={<LoadingCard title="SEO" icon="search" />}>
          {seo}
        </Suspense>

        <Suspense fallback={<LoadingCard title="Sécurité" icon="shield" />}>
          {security}
        </Suspense>

        <Suspense fallback={<LoadingCard title="Accessibilité" icon="users" />}>
          {accessibility}
        </Suspense>

        <Suspense fallback={<LoadingCard title="Mobile" icon="mobile" />}>
          {mobile}
        </Suspense>
      </Column>
    </Column>
  );
}
