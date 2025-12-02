"use client";

import React, { useState, useCallback } from "react";
import { Column, Text, Flex, Input, Button, Heading, Grid } from "@once-ui-system/core";
import { PokemonCard } from "./PokemonCard";
import { PokemonCompareRadar } from "./PokemonCompareRadar";
import { PokemonDifferences } from "./PokemonDifferences";
import type { Pokemon, PokemonForComparison } from "./types";
import { transformPokemon } from "./types";

const PokemonCompare: React.FC = () => {
    const [pokemon1Name, setPokemon1Name] = useState<string>("");
    const [pokemon2Name, setPokemon2Name] = useState<string>("");
    const [pokemon1, setPokemon1] = useState<PokemonForComparison | null>(null);
    const [pokemon2, setPokemon2] = useState<PokemonForComparison | null>(null);
    const [loading1, setLoading1] = useState<boolean>(false);
    const [loading2, setLoading2] = useState<boolean>(false);
    const [error1, setError1] = useState<string | null>(null);
    const [error2, setError2] = useState<string | null>(null);

    const fetchPokemon = useCallback(async (name: string): Promise<PokemonForComparison | null> => {
        if (!name.trim()) return null;
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase().trim()}`);
        if (!response.ok) {
            throw new Error("Pokémon non trouvé");
        }
        const data: Pokemon = await response.json();
        return transformPokemon(data);
    }, []);

    const handleSearch1 = useCallback(async () => {
        if (!pokemon1Name.trim()) return;
        
        setLoading1(true);
        setError1(null);
        try {
            const result = await fetchPokemon(pokemon1Name);
            setPokemon1(result);
        } catch (err) {
            setError1(err instanceof Error ? err.message : "Erreur lors de la recherche");
            setPokemon1(null);
        } finally {
            setLoading1(false);
        }
    }, [pokemon1Name, fetchPokemon]);

    const handleSearch2 = useCallback(async () => {
        if (!pokemon2Name.trim()) return;
        
        setLoading2(true);
        setError2(null);
        try {
            const result = await fetchPokemon(pokemon2Name);
            setPokemon2(result);
        } catch (err) {
            setError2(err instanceof Error ? err.message : "Erreur lors de la recherche");
            setPokemon2(null);
        } finally {
            setLoading2(false);
        }
    }, [pokemon2Name, fetchPokemon]);

    const handleKeyPress1 = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch1();
        }
    }, [handleSearch1]);

    const handleKeyPress2 = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch2();
        }
    }, [handleSearch2]);

    const canCompare = pokemon1 !== null && pokemon2 !== null;

    return (
        <Column fillWidth gap="xl" maxWidth="xl">
            {/* Header */}
            <Column horizontal="center" gap="m">
                <Heading variant="display-strong-l" align="center">
                    Comparateur Pokémon
                </Heading>
                <Text variant="body-default-l" onBackground="neutral-weak" align="center">
                    Comparez les statistiques de deux Pokémon côte à côte
                </Text>
            </Column>

            {/* Search Section */}
            <Grid columns={2} gap="l" fillWidth>
                {/* Pokemon 1 Search */}
                <Column gap="m">
                    <Text variant="label-strong-m" onBackground="brand-strong">
                        Pokémon 1
                    </Text>
                    <Flex gap="s">
                        <Input
                            id="pokemon1-input"
                            label="Nom ou ID"
                            value={pokemon1Name}
                            onChange={(e) => setPokemon1Name(e.target.value)}
                            onKeyPress={handleKeyPress1}
                            placeholder="Ex: pikachu ou 25"
                            hasPrefix={false}
                            hasSuffix={false}
                        />
                        <Button
                            onClick={handleSearch1}
                            loading={loading1}
                            variant="secondary"
                        >
                            Rechercher
                        </Button>
                    </Flex>
                    {error1 && (
                        <Text variant="body-default-s" onBackground="danger-strong">
                            {error1}
                        </Text>
                    )}
                </Column>

                {/* Pokemon 2 Search */}
                <Column gap="m">
                    <Text variant="label-strong-m" onBackground="accent-strong">
                        Pokémon 2
                    </Text>
                    <Flex gap="s">
                        <Input
                            id="pokemon2-input"
                            label="Nom ou ID"
                            value={pokemon2Name}
                            onChange={(e) => setPokemon2Name(e.target.value)}
                            onKeyPress={handleKeyPress2}
                            placeholder="Ex: charizard ou 6"
                            hasPrefix={false}
                            hasSuffix={false}
                        />
                        <Button
                            onClick={handleSearch2}
                            loading={loading2}
                            variant="secondary"
                        >
                            Rechercher
                        </Button>
                    </Flex>
                    {error2 && (
                        <Text variant="body-default-s" onBackground="danger-strong">
                            {error2}
                        </Text>
                    )}
                </Column>
            </Grid>

            {/* Pokemon Cards */}
            <Grid columns={2} gap="l" fillWidth>
                <PokemonCard pokemon={pokemon1} loading={loading1} color="brand" />
                <PokemonCard pokemon={pokemon2} loading={loading2} color="accent" />
            </Grid>

            {/* Comparison Section */}
            {canCompare && (
                <Column gap="l">
                    {/* Radar Chart */}
                    <PokemonCompareRadar pokemon1={pokemon1} pokemon2={pokemon2} />

                    {/* Differences */}
                    <PokemonDifferences pokemon1={pokemon1} pokemon2={pokemon2} />
                </Column>
            )}

            {/* Empty State */}
            {!canCompare && !loading1 && !loading2 && (
                <Flex 
                    horizontal="center" 
                    vertical="center" 
                    padding="xl"
                    border="neutral-alpha-weak"
                    radius="l"
                    style={{ borderStyle: "dashed" }}
                >
                    <Text onBackground="neutral-weak" align="center">
                        Recherchez deux Pokémon pour les comparer
                    </Text>
                </Flex>
            )}
        </Column>
    );
};

PokemonCompare.displayName = "PokemonCompare";

export { PokemonCompare };
