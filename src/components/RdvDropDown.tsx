"use client";

import { RDVContentType } from "@/app/api/cal/types/route";
import { Button, Column, DropdownWrapper, Option, RevealFx } from "@/once-ui/components";
import { use, useState } from "react";

export const RDVDropDown = ({ eventTypesPromise }: { eventTypesPromise: Promise<RDVContentType[]> }) => {
    const eventTypes = use(eventTypesPromise);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");
    const handleSelect = (value: string) => {
        setSelected(value);
        setIsOpen(false);
    };
    return (<Column gap="12" center >
        <DropdownWrapper
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            maxWidth={30}
            floatingPlacement="bottom"
            trigger={
                <Button
                    variant="secondary"
                    suffixIcon="chevronDown"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selected ? eventTypes.find(opt => opt.slug === selected)?.title : "Sélectionner un rendez-vous"}
                </Button>
            }
            dropdown={
                <Column minWidth={10} padding="4" gap="2">
                    {eventTypes.map((option) => (
                        <Option
                            key={option.id}
                            label={option.title}
                            value={option.slug}
                            // description={option.description}
                            selected={option.id === selected}
                            onClick={handleSelect}
                        />
                    ))}
                </Column>
            }
        />
        {selected && <RevealFx key={selected} delay={0} speed="fast">
            <Button href={`https://cal.com/occitaweb/${selected}`} id="arrow-button-dispo" arrowIcon>
                Voir les disponibilité</Button>
        </RevealFx>}

    </Column>);
}