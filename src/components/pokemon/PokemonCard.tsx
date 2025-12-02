"use client";

import React from "react";
import { Column, Row, Text, Flex, Badge, Avatar, Skeleton } from "@once-ui-system/core";
import type { PokemonForComparison } from "./types";
import { TYPE_COLORS, STAT_DISPLAY_NAMES } from "./types";

interface PokemonCardProps {
    pokemon: PokemonForComparison | null;
    loading?: boolean;
    color?: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, loading = false, color = "brand" }) => {
    if (loading) {
        return (
            <Column 
                fillWidth 
                border="neutral-medium" 
                radius="l" 
                background="surface" 
                padding="m"
                gap="m"
            >
                <Flex horizontal="center">
                    <Skeleton shape="circle" width="xl" height="xl" />
                </Flex>
                <Skeleton shape="line" width="l" height="s" />
                <Skeleton shape="line" width="m" height="xs" />
                <Skeleton shape="line" width="l" height="xs" />
            </Column>
        );
    }

    if (!pokemon) {
        return (
            <Column 
                fillWidth 
                border="neutral-medium" 
                radius="l" 
                background="surface" 
                padding="m"
                horizontal="center"
                vertical="center"
                style={{ minHeight: 300 }}
            >
                <Text onBackground="neutral-weak">Sélectionnez un Pokémon</Text>
            </Column>
        );
    }

    return (
        <Column 
            fillWidth 
            border="neutral-medium" 
            radius="l" 
            background="surface" 
            padding="m"
            gap="m"
        >
            {/* Pokemon Image */}
            <Flex horizontal="center">
                {pokemon.sprite ? (
                    <Avatar 
                        src={pokemon.sprite} 
                        size="xl"
                        style={{ 
                            backgroundColor: "var(--surface-background)",
                            border: `2px solid var(--${color}-border-strong)`,
                        }}
                    />
                ) : (
                    <Flex 
                        horizontal="center" 
                        vertical="center"
                        style={{ 
                            width: 120, 
                            height: 120,
                            borderRadius: "50%",
                            backgroundColor: "var(--neutral-alpha-weak)",
                        }}
                    >
                        <Text>?</Text>
                    </Flex>
                )}
            </Flex>

            {/* Pokemon Name and ID */}
            <Flex horizontal="center" gap="s" vertical="center">
                <Text variant="heading-strong-l" style={{ textTransform: "capitalize" }}>
                    {pokemon.name}
                </Text>
                <Text onBackground="neutral-weak" variant="body-default-s">
                    #{pokemon.id.toString().padStart(3, '0')}
                </Text>
            </Flex>

            {/* Types */}
            <Flex horizontal="center" gap="s" wrap>
                {pokemon.types.map((type) => (
                    <Badge 
                        key={type}
                        style={{
                            backgroundColor: TYPE_COLORS[type] || "var(--neutral-alpha-medium)",
                            color: "#fff",
                            textTransform: "capitalize",
                        }}
                        arrow={false}
                    >
                        {type}
                    </Badge>
                ))}
            </Flex>

            {/* Physical Stats */}
            <Row gap="m" horizontal="center">
                <Column horizontal="center" gap="2">
                    <Text variant="label-default-s" onBackground="neutral-weak">Taille</Text>
                    <Text variant="body-strong-m">{pokemon.height / 10} m</Text>
                </Column>
                <Column horizontal="center" gap="2">
                    <Text variant="label-default-s" onBackground="neutral-weak">Poids</Text>
                    <Text variant="body-strong-m">{pokemon.weight / 10} kg</Text>
                </Column>
            </Row>

            {/* Abilities */}
            <Column gap="4">
                <Text variant="label-default-s" onBackground="neutral-weak">Talents</Text>
                <Flex gap="4" wrap>
                    {pokemon.abilities.map((ability) => (
                        <Badge 
                            key={ability}
                            background="neutral-alpha-weak"
                            arrow={false}
                            style={{ textTransform: "capitalize" }}
                        >
                            {ability.replace("-", " ")}
                        </Badge>
                    ))}
                </Flex>
            </Column>

            {/* Stats */}
            <Column gap="4">
                <Text variant="label-default-s" onBackground="neutral-weak">Statistiques</Text>
                {(Object.keys(pokemon.stats) as (keyof typeof pokemon.stats)[]).map((statKey) => (
                    <Row key={statKey} gap="s" vertical="center">
                        <Text 
                            variant="body-default-s" 
                            style={{ minWidth: 100 }}
                        >
                            {STAT_DISPLAY_NAMES[statKey]}
                        </Text>
                        <Flex 
                            style={{ 
                                flex: 1, 
                                height: 8, 
                                backgroundColor: "var(--neutral-alpha-weak)",
                                borderRadius: 4,
                                overflow: "hidden",
                            }}
                        >
                            <Flex 
                                style={{ 
                                    width: `${Math.min((pokemon.stats[statKey] / 200) * 100, 100)}%`,
                                    height: "100%",
                                    backgroundColor: `var(--${color}-solid-strong)`,
                                    borderRadius: 4,
                                    transition: "width 0.3s ease",
                                }}
                            />
                        </Flex>
                        <Text 
                            variant="body-strong-s" 
                            style={{ minWidth: 30, textAlign: "right" }}
                        >
                            {pokemon.stats[statKey]}
                        </Text>
                    </Row>
                ))}
            </Column>
        </Column>
    );
};

PokemonCard.displayName = "PokemonCard";

export { PokemonCard };
