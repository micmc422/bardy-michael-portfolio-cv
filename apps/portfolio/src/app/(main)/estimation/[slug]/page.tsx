"use client"

import { Checkbox, Column, Feedback, Grid, Icon, Row, Text, Textarea } from "@once-ui-system/core";
import { siteTypes, type Option } from "../estimationData";
import { use, useMemo } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { useToggleOptionParam } from "./hooks";



export default function EstimationTypePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const routeParams = useSearchParams()
    const toggleOption = useToggleOptionParam()
    const selectedOptions = routeParams.getAll("options")
    const activeSite = useMemo(() => siteTypes.find((site) => site.slug === slug), [slug, siteTypes])
    if (!activeSite) notFound()

    return <>
        <Grid columns={2} s={{ columns: "1" }} gap="m" paddingTop="m">
            {activeSite?.options?.map((option: Option, _i) =>
                <Checkbox
                    suppressHydrationWarning
                    key={option.slug}
                    label={<Row vertical="center" gap="4"
                    ><Icon name={option.icon} size="s" />{option.name}</Row>}
                    description={<Column>
                        <Text onBackground="accent-weak">{option.price}€</Text>
                        <Row>{option.description}</Row>

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