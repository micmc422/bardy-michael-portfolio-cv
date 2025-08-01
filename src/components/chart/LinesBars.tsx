import { ChartCardContainer } from "@/components/chart";
import { Column, Flex, Heading, Row, Text } from "@once-ui-system/core";
import { couleurs } from "./theme";
import { forwardRef } from "react";

interface LinesBarsDataType extends React.ComponentProps<typeof Flex> {
    titre: string;
    description: string;
    types: {
        nom: string;
        niveau: number;
        explication: string;
    }[];
}

// Flexibility Section Component
const LinesBars = forwardRef<HTMLDivElement, LinesBarsDataType>(({ titre, description, types, ...props }, ref) => {

    return <ChartCardContainer ref={ref} maxWidth={"s"} {...props}>
        <Column paddingY='12' paddingX="20" gap="4">
            <Heading as="h2" wrap="pretty" variant='heading-strong-xs'>{titre}</Heading>
            <Text onBackground="neutral-weak" variant="label-default-s" >{description}</Text>
        </Column>
        <Column paddingY='12' paddingX="20" gap="l">
            {types.map(({ nom, niveau, explication }, i) => {
                return <Column key={i} gap="4">
                    <Heading as="h3" onBackground="neutral-medium" variant='heading-default-xs'>{nom}</Heading>
                    <Row height={"24"} style={{ width: `${niveau}%`, backgroundImage: `linear-gradient(to right, transparent, var(--data-${couleurs[i]}))`, border: `2px solid var(--data-${couleurs[i]})`, borderRadius: "0.5rem" }} />
                    <Text onBackground="neutral-medium" variant="label-default-s" paddingTop="xs">{explication}</Text>
                </Column>
            })}
        </Column>
    </ChartCardContainer>
});

LinesBars.displayName = "LinesBars"

export { LinesBars }