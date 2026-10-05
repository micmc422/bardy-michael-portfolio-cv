import { Suspense, type ReactNode } from "react";
import { Column, Heading, Row, Skeleton, Icon, type IconName } from "@once-ui-system/core";
import { AnalysisScoreTracker } from "@/modules/site-check/views/AnalysisScoreTracker";

interface LoadingCardProps {
  title: string;
  icon: IconName;
}

function LoadingCard({ title, icon }: LoadingCardProps) {
  return (
    <Column
      padding="l"
      gap="l"
      background="surface"
      radius="l"
      border="neutral-alpha-weak"
      fillWidth
    >
      <Row gap="l" vertical="center" fillWidth s={{ direction: "column" }}>
        <Column horizontal="center" gap="xs" minWidth={8}>
          <Skeleton shape="circle" size="xl" />
        </Column>
        <Column gap="s" flex={1}>
          <Row gap="s" vertical="center">
            <Icon name={icon} size="l" onBackground="neutral-weak" />
            <Heading as="h2" variant="display-strong-s">{title}</Heading>
          </Row>
          <Skeleton shape="line" width="50%" />
        </Column>
      </Row>
      <Column gap="s">
        <Skeleton width="50%" shape="line" />
        <Skeleton width="50%" shape="line" />
        <Skeleton width="50%" shape="line" />
      </Column>
    </Column>
  );
}

function LoadingOverallScore() {
  return (
    <Column
      padding="l"
      gap="m"
      background="surface"
      radius="l"
      border="neutral-alpha-weak"
      fillWidth
      horizontal="center"
    >
      <Row gap="l" vertical="center" fillWidth horizontal="center" wrap>
        <Skeleton shape="circle" size="xl" />
        <Column gap="m" horizontal="center">
          <Skeleton shape="line" width="50%" />
          <Column gap="xs">
            <Skeleton shape="line" width="33%" />
            <Skeleton shape="line" width="33%" />
            <Skeleton shape="line" width="33%" />
            <Skeleton shape="line" width="33%" />
            <Skeleton shape="line" width="33%" />
          </Column>
        </Column>
      </Row>
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
    <Column maxWidth="l" gap="l" center>
      {children}
      
      <AnalysisScoreTracker>
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
      </AnalysisScoreTracker>
    </Column>
  );
}
