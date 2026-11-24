import { Button, Column, Text } from "@once-ui-system/core";
import { PageHeader } from "@/shared/components/PageHeader";

export default function NotFound() {
  return (
    <Column as="section" fill center paddingBottom="40" gap="l" aria-labelledby="not-found-title">
      <Text
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-code)",
          fontSize: "clamp(5rem, 18vw, 11rem)",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.06em",
          background: "linear-gradient(135deg, var(--brand-on-background-strong), var(--accent-on-background-medium))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        404
      </Text>
      <PageHeader
        id="not-found-title"
        align="center"
        eyebrow="Erreur 404"
        title="Page introuvable"
        lead="La page demandée n'existe pas ou a été déplacée. Retournez à l'accueil ou explorez les réalisations."
      >
        <Button href="/" prefixIcon="home" variant="primary" size="l">Retour à l&apos;accueil</Button>
        <Button href="/realisations" variant="secondary" size="l">Voir les réalisations</Button>
      </PageHeader>
    </Column>
  );
}
