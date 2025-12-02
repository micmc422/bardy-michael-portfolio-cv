"use client";

import React from "react";
import { Column, Row, Text, Flex, Badge, Icon } from "@once-ui-system/core";
import type { PokemonForComparison } from "./types";
import { TYPE_COLORS, STAT_DISPLAY_NAMES } from "./types";

interface PokemonDifferencesProps {
    pokemon1: PokemonForComparison;
    pokemon2: PokemonForComparison;
}

interface StatDifference {
    name: string;
    value1: number;
    value2: number;
    difference: number;
    winner: 1 | 2 | 0;
}

const PokemonDifferences: React.FC<PokemonDifferencesProps> = ({
    pokemon1,
    pokemon2,
}) => {
    // Calculate stat differences
    const statDifferences: StatDifference[] = (Object.keys(pokemon1.stats) as (keyof typeof pokemon1.stats)[]).map((statKey) => {
        const value1 = pokemon1.stats[statKey];
        const value2 = pokemon2.stats[statKey];
        const difference = value1 - value2;
        return {
            name: STAT_DISPLAY_NAMES[statKey],
            value1,
            value2,
            difference,
            winner: difference > 0 ? 1 : difference < 0 ? 2 : 0,
        };
    });

    // Calculate total stats
    const totalStats1 = Object.values(pokemon1.stats).reduce((a, b) => a + b, 0);
    const totalStats2 = Object.values(pokemon2.stats).reduce((a, b) => a + b, 0);

    // Find unique and shared types
    const uniqueTypes1 = pokemon1.types.filter((t) => !pokemon2.types.includes(t));
    const uniqueTypes2 = pokemon2.types.filter((t) => !pokemon1.types.includes(t));
    const sharedTypes = pokemon1.types.filter((t) => pokemon2.types.includes(t));

    // Find unique and shared abilities
    const uniqueAbilities1 = pokemon1.abilities.filter((a) => !pokemon2.abilities.includes(a));
    const uniqueAbilities2 = pokemon2.abilities.filter((a) => !pokemon1.abilities.includes(a));
    const sharedAbilities = pokemon1.abilities.filter((a) => pokemon2.abilities.includes(a));

    return (
        <Column fillWidth border="neutral-medium" radius="l" background="surface" padding="m" gap="l">
            <Flex horizontal="center">
                <Text variant="heading-strong-m">Différences</Text>
            </Flex>

            {/* Stat Comparison Table */}
            <Column gap="s">
                <Text variant="label-strong-s" onBackground="neutral-weak">Statistiques comparées</Text>
                
                {/* Header */}
                <Row gap="s" padding="s" background="neutral-alpha-weak" radius="s">
                    <Flex style={{ flex: 2 }}>
                        <Text variant="label-strong-s">Stat</Text>
                    </Flex>
                    <Flex style={{ flex: 1, textAlign: "center" }} horizontal="center">
                        <Text variant="label-strong-s" style={{ textTransform: "capitalize" }}>
                            {pokemon1.name}
                        </Text>
                    </Flex>
                    <Flex style={{ flex: 1, textAlign: "center" }} horizontal="center">
                        <Text variant="label-strong-s" style={{ textTransform: "capitalize" }}>
                            {pokemon2.name}
                        </Text>
                    </Flex>
                    <Flex style={{ flex: 1, textAlign: "center" }} horizontal="center">
                        <Text variant="label-strong-s">Diff.</Text>
                    </Flex>
                </Row>

                {/* Stat Rows */}
                {statDifferences.map((stat) => (
                    <Row 
                        key={stat.name} 
                        gap="s" 
                        padding="s" 
                        radius="s"
                        style={{
                            backgroundColor: stat.winner !== 0 
                                ? stat.winner === 1 
                                    ? "var(--brand-alpha-weak)" 
                                    : "var(--accent-alpha-weak)"
                                : "transparent",
                        }}
                    >
                        <Flex style={{ flex: 2 }}>
                            <Text variant="body-default-s">{stat.name}</Text>
                        </Flex>
                        <Flex style={{ flex: 1 }} horizontal="center">
                            <Text 
                                variant={stat.winner === 1 ? "body-strong-s" : "body-default-s"}
                                onBackground={stat.winner === 1 ? "brand-strong" : "neutral-strong"}
                            >
                                {stat.value1}
                            </Text>
                        </Flex>
                        <Flex style={{ flex: 1 }} horizontal="center">
                            <Text 
                                variant={stat.winner === 2 ? "body-strong-s" : "body-default-s"}
                                onBackground={stat.winner === 2 ? "accent-strong" : "neutral-strong"}
                            >
                                {stat.value2}
                            </Text>
                        </Flex>
                        <Flex style={{ flex: 1 }} horizontal="center" gap="4">
                            {stat.difference !== 0 && (
                                <Icon 
                                    name={stat.difference > 0 ? "chevronUp" : "chevronDown"}
                                    size="xs"
                                    onBackground={stat.difference > 0 ? "success-strong" : "danger-strong"}
                                />
                            )}
                            <Text 
                                variant="body-default-s"
                                onBackground={
                                    stat.difference > 0 
                                        ? "success-strong" 
                                        : stat.difference < 0 
                                            ? "danger-strong" 
                                            : "neutral-weak"
                                }
                            >
                                {stat.difference > 0 ? `+${stat.difference}` : stat.difference}
                            </Text>
                        </Flex>
                    </Row>
                ))}

                {/* Total Row */}
                <Row gap="s" padding="s" background="neutral-alpha-medium" radius="s">
                    <Flex style={{ flex: 2 }}>
                        <Text variant="label-strong-s">Total</Text>
                    </Flex>
                    <Flex style={{ flex: 1 }} horizontal="center">
                        <Text 
                            variant="body-strong-s"
                            onBackground={totalStats1 >= totalStats2 ? "brand-strong" : "neutral-strong"}
                        >
                            {totalStats1}
                        </Text>
                    </Flex>
                    <Flex style={{ flex: 1 }} horizontal="center">
                        <Text 
                            variant="body-strong-s"
                            onBackground={totalStats2 >= totalStats1 ? "accent-strong" : "neutral-strong"}
                        >
                            {totalStats2}
                        </Text>
                    </Flex>
                    <Flex style={{ flex: 1 }} horizontal="center" gap="4">
                        {totalStats1 !== totalStats2 && (
                            <Icon 
                                name={totalStats1 > totalStats2 ? "chevronUp" : "chevronDown"}
                                size="xs"
                                onBackground={totalStats1 > totalStats2 ? "success-strong" : "danger-strong"}
                            />
                        )}
                        <Text 
                            variant="body-strong-s"
                            onBackground={
                                totalStats1 > totalStats2 
                                    ? "success-strong" 
                                    : totalStats1 < totalStats2 
                                        ? "danger-strong" 
                                        : "neutral-weak"
                            }
                        >
                            {totalStats1 > totalStats2 
                                ? `+${totalStats1 - totalStats2}` 
                                : totalStats1 - totalStats2}
                        </Text>
                    </Flex>
                </Row>
            </Column>

            {/* Type Differences */}
            <Column gap="s">
                <Text variant="label-strong-s" onBackground="neutral-weak">Types</Text>
                <Row gap="m" wrap>
                    {sharedTypes.length > 0 && (
                        <Column gap="4">
                            <Text variant="body-default-s" onBackground="neutral-weak">En commun</Text>
                            <Flex gap="4" wrap>
                                {sharedTypes.map((type) => (
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
                        </Column>
                    )}
                    {uniqueTypes1.length > 0 && (
                        <Column gap="4">
                            <Text variant="body-default-s" onBackground="brand-weak" style={{ textTransform: "capitalize" }}>
                                Unique à {pokemon1.name}
                            </Text>
                            <Flex gap="4" wrap>
                                {uniqueTypes1.map((type) => (
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
                        </Column>
                    )}
                    {uniqueTypes2.length > 0 && (
                        <Column gap="4">
                            <Text variant="body-default-s" onBackground="accent-weak" style={{ textTransform: "capitalize" }}>
                                Unique à {pokemon2.name}
                            </Text>
                            <Flex gap="4" wrap>
                                {uniqueTypes2.map((type) => (
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
                        </Column>
                    )}
                </Row>
            </Column>

            {/* Ability Differences */}
            <Column gap="s">
                <Text variant="label-strong-s" onBackground="neutral-weak">Talents</Text>
                <Row gap="m" wrap>
                    {sharedAbilities.length > 0 && (
                        <Column gap="4">
                            <Text variant="body-default-s" onBackground="neutral-weak">En commun</Text>
                            <Flex gap="4" wrap>
                                {sharedAbilities.map((ability) => (
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
                    )}
                    {uniqueAbilities1.length > 0 && (
                        <Column gap="4">
                            <Text variant="body-default-s" onBackground="brand-weak" style={{ textTransform: "capitalize" }}>
                                Unique à {pokemon1.name}
                            </Text>
                            <Flex gap="4" wrap>
                                {uniqueAbilities1.map((ability) => (
                                    <Badge 
                                        key={ability}
                                        background="brand-alpha-weak"
                                        arrow={false}
                                        style={{ textTransform: "capitalize" }}
                                    >
                                        {ability.replace("-", " ")}
                                    </Badge>
                                ))}
                            </Flex>
                        </Column>
                    )}
                    {uniqueAbilities2.length > 0 && (
                        <Column gap="4">
                            <Text variant="body-default-s" onBackground="accent-weak" style={{ textTransform: "capitalize" }}>
                                Unique à {pokemon2.name}
                            </Text>
                            <Flex gap="4" wrap>
                                {uniqueAbilities2.map((ability) => (
                                    <Badge 
                                        key={ability}
                                        background="accent-alpha-weak"
                                        arrow={false}
                                        style={{ textTransform: "capitalize" }}
                                    >
                                        {ability.replace("-", " ")}
                                    </Badge>
                                ))}
                            </Flex>
                        </Column>
                    )}
                </Row>
            </Column>

            {/* Physical Differences */}
            <Column gap="s">
                <Text variant="label-strong-s" onBackground="neutral-weak">Caractéristiques physiques</Text>
                <Row gap="m">
                    <Column gap="4" style={{ flex: 1 }}>
                        <Text variant="body-default-s" onBackground="neutral-weak">Taille</Text>
                        <Row gap="s" vertical="center">
                            <Text 
                                variant="body-strong-m"
                                onBackground={pokemon1.height >= pokemon2.height ? "brand-strong" : "neutral-strong"}
                            >
                                {pokemon1.height / 10}m
                            </Text>
                            <Text onBackground="neutral-weak">vs</Text>
                            <Text 
                                variant="body-strong-m"
                                onBackground={pokemon2.height >= pokemon1.height ? "accent-strong" : "neutral-strong"}
                            >
                                {pokemon2.height / 10}m
                            </Text>
                            {pokemon1.height !== pokemon2.height && (
                                <Text variant="body-default-s" onBackground="neutral-weak">
                                    ({pokemon1.height > pokemon2.height ? "+" : ""}{(pokemon1.height - pokemon2.height) / 10}m)
                                </Text>
                            )}
                        </Row>
                    </Column>
                    <Column gap="4" style={{ flex: 1 }}>
                        <Text variant="body-default-s" onBackground="neutral-weak">Poids</Text>
                        <Row gap="s" vertical="center">
                            <Text 
                                variant="body-strong-m"
                                onBackground={pokemon1.weight >= pokemon2.weight ? "brand-strong" : "neutral-strong"}
                            >
                                {pokemon1.weight / 10}kg
                            </Text>
                            <Text onBackground="neutral-weak">vs</Text>
                            <Text 
                                variant="body-strong-m"
                                onBackground={pokemon2.weight >= pokemon1.weight ? "accent-strong" : "neutral-strong"}
                            >
                                {pokemon2.weight / 10}kg
                            </Text>
                            {pokemon1.weight !== pokemon2.weight && (
                                <Text variant="body-default-s" onBackground="neutral-weak">
                                    ({pokemon1.weight > pokemon2.weight ? "+" : ""}{(pokemon1.weight - pokemon2.weight) / 10}kg)
                                </Text>
                            )}
                        </Row>
                    </Column>
                </Row>
            </Column>
        </Column>
    );
};

PokemonDifferences.displayName = "PokemonDifferences";

export { PokemonDifferences };
