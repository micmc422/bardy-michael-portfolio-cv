import {
  Badge,
  Column,
  Grid,
  Heading,
  Icon,
  RevealFx,
  Row,
  SmartLink,
  Text,
  type IconName,
} from "@once-ui-system/core";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";
import Meta from "@/modules/seo/Meta";
import Schema from "@/modules/seo/Schema";

const legal = {
  path: "/mentions-legales",
  title: "Mentions légales & confidentialité | Occitaweb",
  description:
    "Mentions légales, éditeur, hébergeur et politique de confidentialité (RGPD) du site occitaweb.fr — Michaël Bardy, développeur web à Albi.",
};

export async function generateMetadata() {
  return Meta.generate({
    title: legal.title,
    description: legal.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(legal.title)}`,
    path: legal.path,
  });
}

/** Ligne clé / valeur d'une carte d'informations. */
function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Row gap="s" vertical="start" fillWidth>
      <Column minWidth={12}>
        <Text variant="label-strong-s">{label}</Text>
      </Column>
      <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
        {children}
      </Text>
    </Row>
  );
}

/** Carte de section : reprend le style « overlay » des pages du site. */
function SectionCard({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: IconName;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Column
      as="section"
      background="overlay"
      radius="l"
      padding="l"
      gap="m"
      fillWidth
      aria-labelledby={id}
      overflow="hidden"
    >
      <Heading as="h2" id={id} variant="display-strong-xs">
        <Row vertical="center" gap="s" align="start">
          <Icon name={icon} onBackground="brand-strong" />
          {title}
        </Row>
      </Heading>
      <Column gap="s">{children}</Column>
    </Column>
  );
}

const traitements = [
  {
    icon: "chart-line" as IconName,
    titre: "Mesure d'audience",
    texte:
      "Outil : Vercel Web Analytics. Données : pages consultées, origine de la visite, navigateur, système d'exploitation, pays associé à l'adresse IP. Finalité : comprendre l'usage du site pour l'améliorer. Base légale : consentement (bandeau cookies). Conservation : 30 jours côté navigateur (cookie), agrégée et anonymisée côté serveur. Aucune donnée n'est partagée avec des tiers, aucun profilage publicitaire n'est réalisé.",
  },
  {
    icon: "document" as IconName,
    titre: "Formulaires (estimation, contact)",
    texte:
      "Données : les informations que vous saisissez (nom, email, description du projet). Finalité : établir un devis et vous répondre. Base légale : exécution d'une mesure précontractuelle. Conservation : le temps nécessaire au traitement de votre demande, puis archivage légal.",
  },
  {
    icon: "bell" as IconName,
    titre: "Notifications push (optionnel)",
    texte:
      "Activées uniquement si vous y consentez explicitement depuis votre navigateur. Vous pouvez les révoquer à tout moment dans les réglages de votre navigateur.",
  },
];

export default function MentionsLegales() {
  const fullAddress = `${person.address}, ${person.postCode} Albi, France`;

  return (
    <>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={legal.path}
        title={legal.title}
        description={legal.description}
        image={`${baseURL}/og?title=${encodeURIComponent(legal.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/a-propos`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Hero — même structure que les autres pages du site */}
      <Column as="section" maxWidth="xl" paddingY="24" gap="m" aria-labelledby="mentions-hero-title">
        <Column maxWidth="s">
          <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="16">
            <Heading as="h1" id="mentions-hero-title" wrap="balance" variant="display-strong-l">
              Mentions légales & confidentialité
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={200} fillWidth horizontal="start" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="display-default-xs">
              Informations légales relatives à l&apos;édition du site occitaweb.fr et traitement
              de vos données personnelles.
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={400} horizontal="start" paddingLeft="8">
            <Badge
              background="brand-weak"
              onBackground="neutral-weak"
              border="accent-alpha-weak"
              gap="8"
              vertical="center"
              paddingY="4"
              href="/a-propos"
              effect={false}
              id="auteur"
              aria-label="Lien vers la page à propos de l'auteur"
              arrow={false}
            >
              <Icon name="security" onBackground="brand-strong" />
              {`Éditeur : ${person.name}`}
            </Badge>
          </RevealFx>
        </Column>
      </Column>

      {/* Éditeur + hébergeur */}
      <Grid as="section" maxWidth="l" gap="l" columns={2} s={{ columns: "1" }}>
        <SectionCard id="editeur" icon="person" title="Éditeur du site">
          <Info label="Nom">{person.name} — Occitaweb</Info>
          <Info label="Statut">Salarié porté — consultant indépendant en portage salarial</Info>
          <Info label="Adresse">{fullAddress}</Info>
          <Info label="Téléphone">
            <SmartLink href={`tel:${person.phone.replace(/[^+\d]/g, "")}`}>
              {person.phone}
            </SmartLink>
          </Info>
          <Info label="Email">
            <SmartLink href="mailto:contact@occitaweb.fr">contact@occitaweb.fr</SmartLink>
          </Info>
          <Info label="Publication">{person.name}</Info>
        </SectionCard>

        <SectionCard id="hebergeur" icon="computer" title="Hébergement">
          <Info label="Hébergeur">Vercel Inc.</Info>
          <Info label="Adresse">440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</Info>
          <Info label="Site">
            <SmartLink href="https://vercel.com" target="_blank" rel="noopener noreferrer">
              vercel.com
            </SmartLink>
          </Info>
        </SectionCard>
      </Grid>

      {/* Portage salarial */}
      <Column as="section" maxWidth="l" fillWidth aria-labelledby="portage">
        <SectionCard id="portage" icon="handshake" title="Portage salarial">
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            L&apos;activité de conseil et de développement présentée sur ce site est exercée dans
            le cadre d&apos;un contrat de travail en portage salarial. {person.name} est salarié
            porté de la société de portage salarial <strong>AS&apos;COM Sud-Ouest</strong>, qui
            est son employeur.
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            Concrètement : les devis, contrats de prestation et factures relatifs aux missions
            sont établis et émis par AS&apos;COM Sud-Ouest, seule entité juridiquement engagée
            auprès des clients. {person.name} n&apos;exerce aucune activité commerciale en nom
            propre et ne dispose pas de numéro SIRET personnel.
          </Text>
          <Column gap="s" padding="m" radius="m" border="neutral-alpha-weak" fillWidth>
            <Text variant="label-strong-m">Société de portage salarial</Text>
            <Info label="Raison sociale">AS&apos;COM Sud-Ouest</Info>
            <Info label="Adresse">20 place Prax-Paris, CS 80435, 82004 Montauban Cedex</Info>
            <Info label="Email">
              <SmartLink href="mailto:contact@ascom-sudouest.com">
                contact@ascom-sudouest.com
              </SmartLink>
            </Info>
            <Info label="Téléphone">
              <SmartLink href="tel:+33563218268">05 63 21 82 68</SmartLink>
            </Info>
            <Info label="Site">
              <SmartLink
                href="https://groupe-ascom.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                groupe-ascom.com
              </SmartLink>
            </Info>
            <Info label="SIRET">451 617 229 00062</Info>
          </Column>
        </SectionCard>
      </Column>

      {/* Données personnelles */}
      <Column as="section" maxWidth="l" fillWidth aria-labelledby="donnees">
        <SectionCard id="donnees" icon="shield" title="Données personnelles (RGPD)">
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            Aucune donnée n&apos;est collectée à votre insu. Les traitements mis en œuvre sont
            les suivants :
          </Text>
          <Grid columns={3} s={{ columns: "1" }} m={{ columns: "2" }} gap="m" fillWidth>
            {traitements.map((t) => (
              <Column
                as="article"
                key={t.titre}
                background="surface"
                radius="m"
                padding="m"
                gap="s"
                border="neutral-alpha-weak"
                fillWidth
              >
                <Row vertical="center" gap="s">
                  <Icon name={t.icon} onBackground="brand-strong" />
                  <Text variant="label-strong-m">{t.titre}</Text>
                </Row>
                <Text variant="body-default-s" onBackground="neutral-weak" wrap="balance">
                  {t.texte}
                </Text>
              </Column>
            ))}
          </Grid>
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement,
            de limitation, d&apos;opposition et de portabilité. Pour l&apos;exercer, écrivez à{" "}
            <SmartLink href="mailto:contact@occitaweb.fr">contact@occitaweb.fr</SmartLink>. Vous
            pouvez également introduire une réclamation auprès de la CNIL (
            <SmartLink href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
              cnil.fr
            </SmartLink>
            ).
          </Text>
        </SectionCard>
      </Column>

      {/* Cookies, propriété, responsabilité, droit */}
      <Grid as="section" maxWidth="l" gap="l" columns={2} s={{ columns: "1" }}>
        <SectionCard id="cookies" icon="cookie" title="Cookies">
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            Ce site n&apos;utilise qu&apos;un seul cookie de consentement (
            <Text as="code" variant="code-default-s">acceptedCookies</Text>), conservé 30 jours,
            qui mémorise votre choix. La mesure d&apos;audience n&apos;est activée qu&apos;après
            votre accord. Aucun cookie publicitaire ni traceur tiers n&apos;est déposé.
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            Vous pouvez modifier votre choix à tout moment en supprimant les cookies de ce site
            depuis les réglages de votre navigateur : le bandeau de consentement réapparaîtra.
          </Text>
        </SectionCard>

        <SectionCard id="propriete" icon="book" title="Propriété intellectuelle">
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            L&apos;ensemble des contenus de ce site (textes, articles, illustrations, code,
            identité visuelle) est la propriété exclusive de {person.name}, sauf mention
            contraire. Toute reproduction, représentation ou diffusion, totale ou partielle,
            sans autorisation écrite préalable est interdite.
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            Les marques et logos de tiers cités sur ce site appartiennent à leurs détenteurs
            respectifs et sont mentionnés à titre informatif.
          </Text>
        </SectionCard>

        <SectionCard id="responsabilite" icon="warning" title="Limitation de responsabilité">
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            Les informations publiées sur ce site sont fournies à titre indicatif et peuvent
            évoluer. {person.name} s&apos;efforce de les maintenir exactes mais ne saurait être
            tenu responsable des erreurs, omissions ou d&apos;une indisponibilité temporaire du
            service. Les liens externes ne sauraient engager sa responsabilité quant au contenu
            des sites tiers.
          </Text>
        </SectionCard>

        <SectionCard id="droit" icon="flag" title="Droit applicable">
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            Le présent site est soumis au droit français. En cas de litige, et à défaut de
            résolution amiable, les tribunaux français seront seuls compétents.
          </Text>
        </SectionCard>
      </Grid>

      <Column maxWidth="l" fillWidth center paddingBottom="l">
        <Badge
          background="neutral-alpha-weak"
          onBackground="neutral-weak"
          gap="8"
          vertical="center"
          paddingY="4"
          arrow={false}
        >
          <Icon name="info" onBackground="neutral-weak" />
          <Text variant="label-default-s">
            Dernière mise à jour : page susceptible d&apos;évoluer pour rester conforme.
          </Text>
        </Badge>
      </Column>
    </>
  );
}
