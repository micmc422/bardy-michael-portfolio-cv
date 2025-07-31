"use client";

import { Column, Flex, Heading, Text } from '@once-ui-system/core';
import {
    Chart,
    type ChartType,
    type ChartData,
    type ChartOptions,
    type Plugin
} from 'chart.js/auto';
import classNames from 'classnames';
import { forwardRef, useEffect, useRef, type ReactNode } from 'react';


export const getCssVariable = (variableName: string): string => {
    if (typeof window === "undefined") return "#000"; // Fallback SSR
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim() || "#000";
};

// 💬 Helper : wrap long labels into multiple lines
//
export const wrapLabels = (label: string, maxWidth: number): string | string[] => {
    if (label.length <= maxWidth) return label;

    const words = label.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length > maxWidth) {
            lines.push(currentLine.trim());
            currentLine = '';
        }
        currentLine += word + ' ';
    });

    lines.push(currentLine.trim());
    return lines;
};

// 🧠 Tooltip title callback
//
const tooltipTitleCallback = (tooltipItems: any[]): string => {
    const item = tooltipItems[0];
    const label = item.chart.data.labels?.[item.dataIndex];
    return Array.isArray(label) ? label.join(' ') : label;
};

// ⚙️ Default chart options
//
export const defaultChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom'
        },
        tooltip: {
            callbacks: {
                title: tooltipTitleCallback
            }
        }
    }
};

// 📊 ChartCard component props
//
interface ChartCardProps extends React.ComponentProps<typeof Flex> {
    className?: string;
    style?: React.CSSProperties;
    id: string;
    titre?: ReactNode;
    description?: ReactNode;
    explication?: ReactNode;
    chartType: ChartType;
    data: ChartData;
    options?: ChartOptions;
    plugins?: Plugin[];
}


// 🧩 Reusable Chart component
//
const ChartCard = forwardRef<HTMLDivElement, ChartCardProps>(
    ({ id, chartType, data, options = {}, plugins = [], titre, description, explication, ...props }, ref) => {
        const chartRef = useRef<HTMLCanvasElement | null>(null);
        const chartInstanceRef = useRef<Chart | null>(null);

        useEffect(() => {
            if (!chartRef.current) return;

            // Destroy previous chart if exists
            chartInstanceRef.current?.destroy();

            const ctx = chartRef.current.getContext('2d');
            if (!ctx) return;

            chartInstanceRef.current = new Chart(ctx, {
                type: chartType,
                data,
                options,
                plugins
            });

            return () => {
                chartInstanceRef.current?.destroy();
            };
        }, [chartType, data, options, plugins]);

        return (<ChartCardContainer ref={ref} direction='column'  {...props}>
            <Column paddingY='s'>
                {titre && <Heading wrap="pretty" variant='heading-strong-xs' paddingX="m">{titre}</Heading>}
                {description && <Text wrap="pretty" onBackground='neutral-weak' variant='label-default-s' paddingX="m">{description}</Text>}
            </Column>
            <Flex height={"l"} center>
                <canvas id={id} ref={chartRef}></canvas>
            </Flex>
            <Column maxWidth={"s"} paddingX="m"            >
                <Text onBackground="neutral-medium" variant="label-default-s">{explication}</Text>
            </Column>
        </ChartCardContainer>
        );
    }
);

ChartCard.displayName = "ChartCard";

interface ChartCardContainerProps extends React.ComponentProps<typeof Flex> {
    className?: string;
    style?: React.CSSProperties;
}

const ChartCardContainer = forwardRef<HTMLDivElement, ChartCardContainerProps>(
    ({ children, className, style, ...rest }, ref) => {
        return (
            <Column
                background='surface'
                radius='m'
                border="neutral-strong"
                ref={ref}
                style={style}
                className={classNames(className)}
                {...rest}
            >
                {children}
            </Column>
        );
    }
);

ChartCardContainer.displayName = "ChartCardContainer";

export { ChartCard, ChartCardContainer }