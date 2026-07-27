import { Background, Badge, Button, Column, Grid, Heading, Icon, IconButton, RevealFx, Row, Text, type Opacity } from "@once-ui-system/core";
import { about, baseURL } from "../../resources";
import { person, solutionsWeb } from "../../resources/content";
 import Meta from "@/modules/seo/Meta";
import Schema from "@/modules/seo/Schema";

export async function generateMetadata() {
    return Meta.generate({
        title: solutionsWeb.title,
        description: solutionsWeb.description,
        baseURL: baseURL,
        image: `${baseURL}/og?title=${encodeURIComponent(solutionsWeb.title)}`,
        path: solutionsWeb.path,
    });
}
export default function SolutionsPage() {
    return (
        <>
            <Schema
                as="webPage"
                baseURL={baseURL}
                path={solutionsWeb.path}
                title={solutionsWeb.title}
                description={solutionsWeb.description}
                image={`${baseURL}/og?title=${encodeURIComponent(solutionsWeb.title)}`}
                author={{
                    name: person.name,
                    url: `${baseURL}${solutionsWeb.path}`,
                    image: `${baseURL}${person.avatar}`,
                }}
            />

            <Column as="section" maxWidth="xl" paddingY="24" gap="m" aria-labelledby="solutions-hero-title">
                <Column maxWidth="s">
                    <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="16">
                        <Heading as="h1" id="solutions-hero-title" wrap="balance" variant="display-strong-l">
                            {solutionsWeb.headline}
                        </Heading>
                    </RevealFx>
                    <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="32">
                        <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
                            {solutionsWeb.subline}
                        </Text>
                    </RevealFx>
                    <RevealFx fillWidth horizontal="start" paddingTop="16" paddingBottom="32" paddingLeft="8">
                        <Badge
                            background="brand-alpha-weak" paddingX="8" paddingY="4" onBackground="brand-strong"
                            arrow={false}
                            href={about.calendar.link}
                            center
                            gap="s"
                            id="RDVBtn"
                            aria-label="Lien vers la prise de rendez-vous"
                        >
                            <Icon paddingLeft="12" name="calendar" onBackground="brand-strong" />
                            <Text paddingTop="4">Planifier un RDV</Text>
                            <IconButton
                                variant="ghost"
                                icon="chevronRight"
                            />
                        </Badge>
                    </RevealFx>
                </Column>
            </Column>
            <Column as="section" maxWidth="xs" paddingY="24" gap="s" aria-labelledby="fonctionnalites-section-title">
                <Heading as="h2" id="fonctionnalites-section-title" wrap="balance" variant="display-strong-m" align="center">
                    🎯 Fonctionnalités ciblées pour booster votre activité
                </Heading>
                <Text wrap="balance" onBackground="neutral-weak" variant="body-default-m" align="center">
                    {`Chaque activité a ses spécificités, et votre site web doit en être le reflet. Que vous soyez artisan, commerçant, formateur ou indépendant, je développe des fonctionnalités adaptées à vos besoins concrets : formulaire de devis, prise de rendez-vous, catalogue, espace client, outils d'automatisation… L’objectif ? Gagner du temps, offrir une meilleure expérience à vos utilisateurs et faire de votre site un véritable levier de développement.`}
                </Text>
            </Column>
            <Grid columns={4} s={{ columns: "1" }} m={{ columns: "2" }} background="page" radius="l" maxWidth="xl" padding="s" gap="l" overflow="hidden">
                <Background
                    zIndex={-1}
                    fill
                    position="absolute"
                    mask={{
                        cursor: true,
                        x: 50,
                        y: 25,
                        radius: 70
                    }}
                    gradient={{
                        display: true,
                        opacity: 1 as Opacity,
                        x: 50,
                        y: 0,
                        colorStart: "accent-alpha-strong",
                        colorEnd: "brand-alpha-weak"
                    }}
                />

                {solutionsWeb.pourquoi.map((item, index) => (
                    <Column as="article" background="overlay" paddingX="s" paddingY="l" radius="m" key={index} maxWidth="s" gap="m">
                        <Heading as="h3" wrap="balance" variant="heading-default-l">
                            <Row vertical="center" gap="s" align="start">
                                <Icon name={item?.icone || "check"} onBackground="brand-strong" />
                                {item?.titre}
                            </Row>
                        </Heading>
                        <Text wrap="balance" onBackground="neutral-medium" variant="body-default-m">
                            {item?.description}
                        </Text>
                        <Column as="ul" className="list-none">
                            {item?.fonctions?.map((fonction, idx) => (
                                <li key={idx}>
                                    <Row vertical="center" gap="xs">
                                        <Icon name="checkCircle" onBackground="success-medium" />
                                        <Text wrap="balance" onBackground="neutral-weak" variant="body-default-xs">
                                            {fonction}
                                        </Text>
                                    </Row>
                                </li>
                            ))}
                        </Column>
                    </Column>
                ))}
            </Grid>
            <Column as="section" maxWidth="xl" paddingY="24" gap="s" center aria-labelledby="hebergement-section-title">
                <Heading as="h2" id="hebergement-section-title" wrap="balance" variant="display-strong-m" align="center">
                    ☁️ Votre site, toujours rapide. Toujours en ligne.
                </Heading>
                <Text wrap="balance" onBackground="neutral-weak" variant="body-default-m" align="center">
                    {`Ne perdez plus de clients à cause d’un site lent ou indisponible. Grâce à un hébergement cloud dernière génération (Vercel), vos pages se chargent en un éclair, même aux heures de pointe. Résultat : plus de conversions, une meilleure image, et zéro stress côté technique.`}
                </Text>
                <Button href="/solutions/hebergement">{`🚀 Solutions d'hébergement`}</Button>
            </Column>
        </>
    );
}