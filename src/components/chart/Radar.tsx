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

import { ChartHeader, ChartStatus, Column, DataTooltip, Legend, LinearGradient, Row, useDataTheme, type ChartProps, type ChartVariant } from "@once-ui-system/core";
import { getDistributedColor } from "./utils/colorDistribution";
import type { DataTooltipProps } from "@once-ui-system/core/dist/modules/data";

interface RadarChartProps extends ChartProps {
    outerRadius?: number | string;
    tooltipCursor?: boolean;
    "data-viz-style"?: string
}

const RadarChart: React.FC<RadarChartProps> = ({
    title,
    description,
    data,
    series,
    emptyState,
    loading = false,
    legend: legendProp = {},
    axis = "both",
    border = "neutral-medium",
    variant: variantProp,
    outerRadius = "100%",
    tooltipCursor = false,
    "data-viz-style": dataVizStyle,
    ...flex
}) => {
    const seriesArray = Array.isArray(series) ? series : series ? [series] : [];
    const {
        variant: themeVariant,
        mode,
        height = 32,
        tick: { fill: tickFill, fontSize: tickFontSize },
        // axis: { stroke: _axisLineStroke },
    } = useDataTheme();
    const variant = variantProp || themeVariant;
    const legend = {
        display: legendProp.display !== undefined ? legendProp.display : true,
        position: legendProp.position || "bottom-center",
        direction: legendProp.direction,
    };

    const seriesKeys = seriesArray.map((s) => s.key);
    const chartId = React.useMemo(() => Math.random().toString(36).substring(2, 9), []);
    /*
    const coloredSeriesArray = seriesArray.map((s, index) => ({
        ...s,
        color: s.color || getDistributedColor(index, seriesArray.length),
    }));
    */
    const autoKeys = Object.keys(data[0] || {}).filter(
        (key) => !seriesKeys.includes(key) && key !== "subject" && key !== "fullMark"
    );
    const autoSeries = useMemo(() => seriesArray.length > 0
        ? seriesArray.map((s, index) => ({
            ...s,
            color: s.color || getDistributedColor(index, seriesArray.length),
        }))
        : autoKeys.map((key, index) => ({
            key,
            color: getDistributedColor(index, autoKeys.length),
        })), [])

    const radarColors = autoSeries.map((s) => `var(--data-${s.color})`);

    return (
        <Column fillWidth minHeight={height} border={border} radius="l" data-viz-style={dataVizStyle || mode} background="surface" {...flex}>
            <ChartHeader
                title={title}
                description={description}
                borderBottom={border}
            />
            <Row fill>
                <ChartStatus
                    loading={loading}
                    empty={!data || data.length === 0}
                    emptyState={emptyState}
                />
                {!loading && data && data.length > 0 && (
                    <RechartsResponsiveContainer width="100%" height="100%" id={chartId}>
                        <RechartsRadarChart outerRadius={outerRadius} data={data}>
                            <RechartsPolarGrid stroke="var(--neutral-alpha-weak)" />
                            <RechartsPolarAngleAxis dataKey="subject" tick={{ fill: tickFill, fontSize: tickFontSize }} />
                            {(axis === "y" || axis === "both") && (
                                <RechartsPolarRadiusAxis angle={30} tick={{ fill: tickFill, fontSize: tickFontSize }} />
                            )}
                            {legend.display && (
                                <RechartsLegend
                                    content={(_props) => {
                                        const customPayload = autoSeries.map((series, index) => ({
                                            value: series.key,
                                            color: radarColors[index],
                                        }));

                                        return (
                                            <Legend
                                                variant={variant as ChartVariant}
                                                payload={customPayload}
                                                labels={axis}
                                                position={legend.position}
                                                direction={legend.direction}
                                            />
                                        );
                                    }}
                                    wrapperStyle={{
                                        position: "absolute",
                                        top:
                                            legend.position === "top-center" ||
                                                legend.position === "top-left" ||
                                                legend.position === "top-right"
                                                ? 0
                                                : undefined,
                                        bottom:
                                            legend.position === "bottom-center" ||
                                                legend.position === "bottom-left" ||
                                                legend.position === "bottom-right"
                                                ? 0
                                                : undefined,
                                        paddingBottom:
                                            legend.position === "bottom-center" ||
                                                legend.position === "bottom-left" ||
                                                legend.position === "bottom-right"
                                                ? "var(--static-space-40)"
                                                : undefined,
                                        left:
                                            (axis === "y" || axis === "both") &&
                                                (legend.position === "top-center" || legend.position === "bottom-center")
                                                ? "var(--static-space-64)"
                                                : 0,
                                        width:
                                            (axis === "y" || axis === "both") &&
                                                (legend.position === "top-center" || legend.position === "bottom-center")
                                                ? "calc(100% - var(--static-space-64))"
                                                : "100%",
                                        right: 0,
                                        margin: 0,
                                    }}
                                />
                            )}
                            <RechartsTooltip
                                cursor={{ stroke: tooltipCursor ? "var(--neutral-alpha-weak)" : "transparent" }}
                                content={(props) => (
                                    <DataTooltip {...props as unknown as DataTooltipProps} variant={variant as ChartVariant} />
                                )}
                            />
                            <defs>
                                {radarColors.map((color, index) => (
                                    <LinearGradient
                                        key={`gradient-${chartId}-${index}`}
                                        id={`barGradient${chartId}${index}`}
                                        color={color}
                                        variant={variant as ChartVariant}
                                    />
                                ))}
                            </defs>
                            {autoSeries.map((series, index) => (
                                <RechartsRadar
                                    key={series.key}
                                    dataKey={series.key}
                                    name={series.key}
                                    fill={`url(#barGradient${chartId}${index})`}
                                    stroke={radarColors[index]}
                                    strokeWidth={2}
                                    transform="translate(0, -1)"
                                />
                            ))}
                        </RechartsRadarChart>
                    </RechartsResponsiveContainer>
                )}
            </Row>
        </Column>
    );
};

RadarChart.displayName = "RadarChart";

export { RadarChart };
export type { RadarChartProps };