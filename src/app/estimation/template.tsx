"use client"

import { Column, Icon, Line, Row, Text } from "@/once-ui/components";
import { useParams } from "next/navigation";
import { createContext, useMemo, useState, type ReactNode } from "react";
import { siteTypes } from "./estimationData";

type EstimationContextType = {
    state: any;
    setState: React.Dispatch<React.SetStateAction<any>>;
};

const EstimationContext = createContext<EstimationContextType>({
    state: undefined,
    setState: () => { },
});


export default function EstimationTemplate({ children }: { children: ReactNode }) {
    const { slug } = useParams();
    const [state, setState] = useState();
    const activeType = useMemo(() => siteTypes.find((site) => slug === site.slug), [slug])
    return <EstimationContext.Provider value={{ state, setState }}>
        <Row fillWidth gap="l" paddingY="xl">
            <Column flex={8} background="surface" padding="m" radius="xl">
                {children}
            </Column>
            <Column flex={3} background="surface" padding="m" radius="m" gap="m">
                <Row gap="4" vertical="center">
                    <Text variant="display-default-xs" onBackground="accent-weak">Estimation</Text>
                </Row>
                {activeType && <Row gap="4" vertical="center" onBackground="neutral-weak">
                    <Icon name={activeType.icon} />
                    <Text variant="label-strong-l">{activeType.name}</Text>
                </Row>}
                {activeType && <Text variant="label-default-s">Prix de base : {activeType.basePrice}€</Text>}
                <Line />
                {activeType ?
                    <Text variant="label-strong-l">Total estimé : {activeType.basePrice}</Text>
                    :
                    <Text variant="label-default-l" onBackground="neutral-weak">sélectionnez un type de site</Text>
                }
            </Column>
        </Row>
    </EstimationContext.Provider>
}