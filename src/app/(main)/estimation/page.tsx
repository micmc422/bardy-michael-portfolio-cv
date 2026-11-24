import { PageHeader } from "@/shared/components/PageHeader";
import { Column, Grid, Icon, Text, Row, Card, Background, type Opacity, type IconName } from "@once-ui-system/core";
import { siteTypes } from "@/modules/estimation/models/estimationData";
import { baseURL, rdv } from "@/core/config";
import { about, estimation, person } from "@/core/config/content";
import Schema from "@/modules/seo/Schema";
import Meta from "@/modules/seo/Meta";

export async function generateMetadata() {
  return Meta.generate({
    title: `${estimation.title} | occitaweb.fr`,
    description: estimation.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(estimation.title)}`,
    path: estimation.path,
  });
}

export default function EstimationPage() {
  return <Column as="section" aria-labelledby="estimation-page-title">
    <PageHeader
      id="estimation-page-title"
      eyebrow="Estimation en ligne"
      title="Estimez votre projet web en quelques clics."
      lead="Choisissez le type de site, ajustez les options et obtenez une fourchette de prix transparente, sans engagement."
    />
    <Schema
      as="webPage"
      baseURL={baseURL}
      path={estimation.path}
      title={estimation.title}
      description={estimation.description}
      image={`${baseURL}/og?title=${encodeURIComponent(estimation.title)}`}
      author={{
        name: person.name,
        url: `${baseURL}${about.path}`,
        image: `${baseURL}${person.avatar}`,
      }}
    />
    <Grid columns={2} s={{ columns: "1" }} gap="m" >
      {siteTypes.map(({ name, basePrice, icon, description, includes, slug }, _i) => <Card href={`/estimation/${slug}`} direction="column" key={name} border="neutral-alpha-weak" radius="m" fillWidth background="transparent" position="relative" overflow="hidden">
        <Schema as={"service"} title={name} description={description} path={`estimation/${slug}`} offerSlug={slug} />
        <Background
          fill
          position="absolute"
          zIndex={0}
          mask={{
            x: `${rdv.effects.mask.x}%`,
            y: `${rdv.effects.mask.y}%`,
            radius: `${rdv.effects.mask.radius}vh`,
            cursor: rdv.effects.mask.cursor
          }}
          gradient={{
            display: true,
            opacity: rdv.effects.gradient.opacity as Opacity,
            x: `${rdv.effects.gradient.x}%`,
            y: `${rdv.effects.gradient.y}%`,
            width: `${rdv.effects.gradient.width}%`,
            height: `${rdv.effects.gradient.height}%`,
            tilt: rdv.effects.gradient.tilt,
            colorStart: rdv.effects.gradient.colorStart,
            colorEnd: rdv.effects.gradient.colorEnd,
          }}
          grid={{
            display: rdv.effects.grid.display,
            opacity: rdv.effects.grid.opacity as Opacity,
            color: "accent-alpha-medium",
            width: rdv.effects.grid.width,
            height: rdv.effects.grid.height,
          }}
        />
        <Column padding="s" gap="s">
          <Row vertical="center" horizontal="between" fillWidth >
            <Row center gap="xs">
              <Icon name={icon as IconName} /><Text as="h3" textVariant="label-strong-l">{name}</Text>
            </Row>
            <Text textVariant="body-default-xs" onBackground="neutral-weak">À partir de {basePrice}€</Text>
          </Row>
          <Text onBackground="neutral-medium">{description}</Text>
          <Column>
            {includes.map((el, i) => <Row key={i} vertical="center">
              <Icon name="check" onBackground="success-weak" size="xs" /><Text onBackground="neutral-weak" textVariant="body-default-xs">{el}</Text>
            </Row>)}
          </Column>
        </Column>
      </Card>)}
    </Grid>
  </Column>
}
