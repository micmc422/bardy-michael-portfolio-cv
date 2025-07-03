"use client"

import { Button, Column, Feedback, Icon, Input, LetterFx, Line, Row, Text, useToast } from "@/once-ui/components"
import { notFound, useParams, useSearchParams } from "next/navigation"
import { useMemo, useState, useTransition } from "react";
import { siteTypes } from "../estimationData";
import { isValidEmail, toQueryParams } from "@/utils/utils";
import Script from "next/script";

function getPriceValidUntilDate() {
    const date = new Date();
    date.setDate(date.getDate() + 90); // ajoute 90 jours

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export default function ResumePanel() {
    const { addToast } = useToast()
    const { slug } = useParams<{ slug: string }>();
    const activeSiteType = useMemo(() => siteTypes.find((site) => site.slug === slug), [slug]);
    if (!activeSiteType) notFound()
    const [email, setEmail] = useState<string>()
    const routeParams = useSearchParams()
    const selectedOptions = routeParams.getAll("options")
    const [loading, startTransition] = useTransition()
    const activeOptions = useMemo(() => activeSiteType?.options.filter((opt) =>
        !!selectedOptions.find(slctOpt => opt.slug === slctOpt)
    ), [selectedOptions, activeSiteType]);
    const totalPrice = useMemo(() => {
        let total = activeSiteType?.basePrice || 0;
        activeOptions?.forEach(({ price }) => total += price)
        return total
    }, [activeOptions, activeSiteType])
    const query = toQueryParams("options", selectedOptions)
    function handleSubmit() {
        startTransition(async () => {
            try {
                const commentaires = document.getElementById("commentaire-estimation") as HTMLTextAreaElement | null
                await fetch(`/api/estimation/${slug}?${query}`, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: `${email}`,
                        commentaires: `${commentaires?.value}`,
                    })
                })
                addToast({ variant: "success", message: "Votre estimation a été transmise je vous transmets un devis dans les plus bref délais" })
            } catch (e) {
                console.error(e)
            }
        })
    }
    const jsonLD = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `Création de site ${activeSiteType.name}`,
        "description": activeSiteType.description,
        "image": "https://occitaweb.fr/images/blog/cv-cover.png", //TODO
        "brand": {
            "@type": "Organization",
            "name": "Occitaweb"
        },
        "category": "Création de site web sur mesure",
        "offers": {
            "@type": "Offer",
            "price": activeSiteType.basePrice,
            "priceCurrency": "EUR",
            "priceValidUntil": "2025-10-01",
            "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "EUR",
                "price": activeSiteType.basePrice,
                "valueAddedTaxIncluded": false
            },
            "availability": "https://schema.org/InStock",
            "url": "https://occitaweb.fr",
            "addOn": activeOptions.map((opt) => ({
                "@type": "Offer",
                "name": opt.name,
                "description": opt.description,
                "price": opt.price,
                "priceCurrency": "EUR",
                "priceValidUntil": getPriceValidUntilDate(),
                "availability": "https://schema.org/InStock",
                "url": `/estimation/${slug}?options=${opt.slug}`
            }))
        }
    });

    return <>
        <Row gap="4" vertical="center">
            <Text variant="display-default-xs" onBackground="brand-weak">Estimation</Text>
        </Row>
        <Line />
        {
            !!activeSiteType && <Column>
                <Row gap="4" vertical="center">
                    <Icon name={activeSiteType.icon} />
                    <Text variant="label-strong-l">{activeSiteType.name}</Text>
                </Row>
                <Row horizontal="space-between">
                    <Text onBackground="neutral-medium">Prix de base : </Text>
                    <Text onBackground="accent-weak" variant="body-strong-m">{activeSiteType.basePrice}€</Text>
                </Row>
            </Column>
        }
        {!!activeOptions?.length && <Line />}

        {activeOptions &&
            <Column gap="2">
                {activeOptions?.map(({ name, price, slug }) => <Row horizontal="space-between" key={slug} fillWidth>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                        <LetterFx
                            speed="fast"
                            trigger="instant">
                            {name}
                        </LetterFx>
                    </Text>

                    <Text variant="body-strong-xs" onBackground="accent-weak">{price}€</Text>
                </Row>)}
            </Column>
        }
        {!!activeSiteType && <Line />}
        {
            activeSiteType ?
                <Row horizontal="space-between" vertical="center">
                    <Text variant="label-strong-l">Total estimé : </Text>
                    <Text variant="display-strong-xs" onBackground="accent-weak">                        <LetterFx
                        key={totalPrice}
                        speed="fast"
                        trigger="instant">
                        {`${totalPrice}€`}
                    </LetterFx>
                    </Text>
                </Row>
                :
                <Text variant="label-default-l" onBackground="neutral-weak">sélectionnez un type de site</Text>
        }

        {activeSiteType && slug && <Column gap="s">
            <Feedback
                variant="success"
                title=""
                description="L'adresse courriel est utilisé uniquement pour vous transmettre le devis."
            />
            <Input
                id="Courriel"
                label="Courriel"
                hasPrefix={
                    <Icon marginLeft="4" onBackground="neutral-weak" name="email" size="xs" />
                }
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button prefixIcon="document" fillWidth loading={loading} disabled={!isValidEmail(email) || loading} as="button"
                onClick={handleSubmit}>Demander un devis</Button>
        </Column>}
        <Script id={`Estimation-${activeSiteType?.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLD }} />

    </>
}