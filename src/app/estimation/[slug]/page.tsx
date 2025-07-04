"use client"

import { Checkbox, Column, Feedback, Grid, Row, Text, Textarea, ToggleButton } from "@/once-ui/components";
import { siteTypes, type Option } from "../estimationData";
import { use, useMemo } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { useToggleOptionParam } from "./hooks";
import { Schema } from "@/once-ui/modules";
import { baseURL } from "@/app/resources";
import { about, estimation, person } from "@/app/resources/content";



export default function EstimationTypePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const routeParams = useSearchParams()
    const toggleOption = useToggleOptionParam()
    const selectedOptions = routeParams.getAll("options")
    const activeSite = useMemo(() => siteTypes.find((site) => site.slug === slug), [slug, siteTypes])
    if (!activeSite) notFound()

    return <>
        <Schema
            as="webPage"
            baseURL={baseURL}
            path={estimation.path}
            title={estimation.title}
            description={estimation.description}
            image={`${baseURL}/og?type=estimation&slug=${slug}`}
            author={{
                name: person.name,
                url: `${baseURL}${about.path}`,
                image: `${baseURL}${person.avatar}`,
            }}
        />
        <Row center wrap gap="s" paddingY="m">
            {siteTypes.map((site) => <ToggleButton prefixIcon={site.icon} key={site.slug} label={site.name} selected={site.slug === slug} href={`/estimation/${site.slug}`} size="s" />)}
        </Row>
        <Grid columns={2} mobileColumns={1} gap="m">
            {activeSite?.options?.map((option: Option, _i) =>
                <Checkbox
                    key={option.slug}
                    label={option.name}
                    description={<Column>
                        <Text onBackground="accent-weak">{option.price}€</Text>
                        {option.description}
                    </Column>}
                    aria-label={`Sélectionnez l'option ${option.name}`}
                    isChecked={selectedOptions.includes(option.slug)}
                    onToggle={() => toggleOption(option.slug, !selectedOptions.includes(option.slug))}
                />)}
        </Grid>
        <Column paddingTop="l" gap="s">
            <Feedback
                // variant="success"
                title="Compléments"
                description="Ajoutez les informations importantes à communiquer pour la rédaction du devis."
            />
            <Textarea
                id="commentaire-estimation"
                label="Informations complémentaires"
                lines={3}
            />

        </Column>
    </>
}

