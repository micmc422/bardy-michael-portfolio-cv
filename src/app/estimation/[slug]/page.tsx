"use client"

import { Checkbox, Column, Feedback, Grid, Icon, Row, Text, Textarea, ToggleButton } from "@/once-ui/components";
import { siteTypes, type Option } from "../estimationData";
import { forwardRef, use, useMemo } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { useToggleOptionParam } from "./hooks";
import { DraggableFlexRow } from "@/components/DraggableRow";



export default function EstimationTypePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const routeParams = useSearchParams()
    const toggleOption = useToggleOptionParam()
    const selectedOptions = routeParams.getAll("options")
    const activeSite = useMemo(() => siteTypes.find((site) => site.slug === slug), [slug, siteTypes])
    if (!activeSite) notFound()

    return <>
        <DraggableFlexRow>
            <Row wrap={false} gap="s">
                {siteTypes.map((site) => <ToggleButton prefixIcon={site.icon} key={site.slug} label={site.name} selected={site.slug === slug} href={`/estimation/${site.slug}`} size="s" />)}
            </Row>
        </DraggableFlexRow>
        <Grid columns={2} mobileColumns={1} gap="m">
            {activeSite?.options?.map((option: Option, _i) =>
                <CheckBoxItem
                    key={_i}
                    option={option}
                    selectedOptions={selectedOptions}
                    toggleOption={toggleOption}
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


interface CheckBoxItemProps extends React.ComponentProps<typeof Checkbox> {
    option: Option;
    selectedOptions: string[];
    toggleOption: (option: string, checked: boolean) => void;
}

const CheckBoxItem = forwardRef<HTMLDivElement, CheckBoxItemProps>(
    ({ option, selectedOptions, toggleOption, ...rest }, ref) => {
        return (
            <Checkbox
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
            />)
    }
);

CheckBoxItem.displayName = "CheckBoxItem";