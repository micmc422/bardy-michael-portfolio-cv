import { Column, Grid, Heading, Icon, Text, Row, Card, Background, type opacity } from "@once-ui-system/core";
import { siteTypes } from "./estimationData";
import { baseURL, rdv } from "../../resources";
import { about, estimation, person } from "../../resources/content";
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
    <Heading as="h1" id="estimation-page-title" className="sr-only">{estimation.title}</Heading>
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
      {siteTypes.map(({ name, basePrice, icon, description, includes, slug }, _i) => <Card as="article" href={`/estimation/${slug}`} direction="column" key={name} border="neutral-alpha-weak" radius="m" fillWidth background="transparent" position="relative" overflow="hidden">
        <Schema as={"service"} title={name} description={description} path={`estimation/${slug}`} offerSlug={slug} />
        <Background
          fill
          position="absolute"
          zIndex={0}
          mask={{
            x: rdv.effects.mask.x,
            y: rdv.effects.mask.y,
            radius: rdv.effects.mask.radius,
            cursor: rdv.effects.mask.cursor
          }}
          gradient={{
            display: true,
            opacity: rdv.effects.gradient.opacity as opacity,
            x: rdv.effects.gradient.x,
            y: rdv.effects.gradient.y,
            width: rdv.effects.gradient.width,
            height: rdv.effects.gradient.height,
            tilt: rdv.effects.gradient.tilt,
            colorStart: rdv.effects.gradient.colorStart,
            colorEnd: rdv.effects.gradient.colorEnd,
          }}
          grid={{
            display: rdv.effects.grid.display,
            opacity: rdv.effects.grid.opacity as opacity,
            color: "accent-alpha-medium",
            width: rdv.effects.grid.width,
            height: rdv.effects.grid.height,
          }}
        />
        <Column padding="s" gap="s">
          <Row vertical="center" horizontal="between" fillWidth >
            <Row center gap="xs">
              <Icon name={icon as string} /><Text as="h2" variant="label-strong-l">{name}</Text>
            </Row>
            <Text variant="body-default-xs" onBackground="neutral-weak">À partir de {basePrice}€</Text>
          </Row>
          <Text onBackground="neutral-medium">{description}</Text>
          <Column>
            {includes.map((el, i) => <Row key={i} vertical="center">
              <Icon name="check" onBackground="success-weak" size="xs" /><Text onBackground="neutral-weak" variant="body-default-xs">{el}</Text>
            </Row>)}
          </Column>
        </Column>
      </Card>)}
    </Grid>
  </Column>
}