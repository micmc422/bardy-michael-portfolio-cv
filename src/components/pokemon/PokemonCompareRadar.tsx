"use client";

import React, { useMemo } from "react";
import {
    RadarChart as RechartsRadarChart,
    Radar as RechartsRadar,
    PolarGrid as RechartsPolarGrid,
    PolarAngleAxis as RechartsPolarAngleAxis,
    PolarRadiusAxis as RechartsPolarRadiusAxis,
    ResponsiveContainer as RechartsResponsiveContainer,
    Tooltip as RechartsTooltip,
    Legend as RechartsLegend,
} from "recharts";

import { Column, Row, Text, Flex } from "@once-ui-system/core";
import type { PokemonForComparison } from "./types";
import { STAT_DISPLAY_NAMES } from "./types";

interface PokemonCompareRadarProps {
    pokemon1: PokemonForComparison;
    pokemon2: PokemonForComparison;
}

interface StatDataPoint {
    subject: string;
    [key: string]: string | number;
    fullMark: number;
}

const PokemonCompareRadar: React.FC<PokemonCompareRadarProps> = ({
    pokemon1,
    pokemon2,
}) => {
    const chartId = useMemo(() => Math.random().toString(36).substring(2, 9), []);

    // Transform stats to radar chart data format
    const data: StatDataPoint[] = useMemo(() => {
        const statKeys = Object.keys(pokemon1.stats) as (keyof typeof pokemon1.stats)[];
        return statKeys.map((statKey) => ({
            subject: STAT_DISPLAY_NAMES[statKey],
            [pokemon1.name]: pokemon1.stats[statKey],
            [pokemon2.name]: pokemon2.stats[statKey],
            fullMark: 200, // Max stat value for scaling
        }));
    }, [pokemon1, pokemon2]);

    const color1 = "var(--data-blue)";
    const color2 = "var(--data-orange)";

    return (
        <Column fillWidth border="neutral-medium" radius="l" background="surface" padding="m">
            <Flex horizontal="center" paddingBottom="m">
                <Text variant="heading-strong-m">Comparaison des statistiques</Text>
            </Flex>
            <Row fill style={{ minHeight: 350 }}>
                <RechartsResponsiveContainer width="100%" height="100%" id={chartId}>
                    <RechartsRadarChart outerRadius="80%" data={data}>
                        <RechartsPolarGrid stroke="var(--neutral-alpha-weak)" />
                        <RechartsPolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: "var(--neutral-on-background-weak)", fontSize: 11 }} 
                        />
                        <RechartsPolarRadiusAxis 
                            angle={30} 
                            tick={{ fill: "var(--neutral-on-background-weak)", fontSize: 11 }}
                            domain={[0, 200]}
                        />
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: "var(--surface-background)",
                                border: "1px solid var(--neutral-alpha-weak)",
                                borderRadius: "8px",
                                padding: "8px 12px",
                            }}
                            labelStyle={{ color: "var(--neutral-on-background-strong)" }}
                        />
                        <RechartsLegend
                            wrapperStyle={{
                                paddingTop: "16px",
                            }}
                        />
                        <defs>
                            <linearGradient id={`gradient1-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color1} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={color1} stopOpacity={0.2} />
                            </linearGradient>
                            <linearGradient id={`gradient2-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color2} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={color2} stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <RechartsRadar
                            name={pokemon1.name}
                            dataKey={pokemon1.name}
                            stroke={color1}
                            fill={`url(#gradient1-${chartId})`}
                            fillOpacity={0.5}
                            strokeWidth={2}
                        />
                        <RechartsRadar
                            name={pokemon2.name}
                            dataKey={pokemon2.name}
                            stroke={color2}
                            fill={`url(#gradient2-${chartId})`}
                            fillOpacity={0.5}
                            strokeWidth={2}
                        />
                    </RechartsRadarChart>
                </RechartsResponsiveContainer>
            </Row>
        </Column>
    );
};

PokemonCompareRadar.displayName = "PokemonCompareRadar";

export { PokemonCompareRadar };
