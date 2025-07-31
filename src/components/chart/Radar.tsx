import { ChartCard, ChartCardContainer } from "@/components/chart";
import { Column, defaultChartOptions, Flex, Heading, Text } from "@once-ui-system/core";
import { forwardRef } from "react";
import type { ChartOptions } from "chart.js";

interface RadarDataType extends React.ComponentProps<typeof Flex> {
    titre: string;
    description: string;
    criteres: string[];
    donnees_radar: {
        label: string;
        valeurs: number[];
    }[];
    explication: string;
}

// Flexibility Section Component
const Radar = forwardRef<HTMLDivElement, RadarDataType>(({ titre, description, donnees_radar, criteres, explication, ...props }, ref) => {

    const flexibilityLabels = criteres;
    const flexibilityChartData = {
        labels: flexibilityLabels,
        datasets: donnees_radar.map(({ label, valeurs: data }, i) => (
            {
                label,
                data,
            }))
    };
    const flexibilityChartOptions: ChartOptions = {
        ...defaultChartOptions,
        scales: {
            r: {
                beginAtZero: true,
                max: 10,
                ticks: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom', // 'top', 'left', 'right'
                align: 'center',    // 'start', 'end'
                labels: {
                    font: {
                        weight: "bold",
                        family: "'geist', sans-serif",
                    },
                    usePointStyle: true,  // rond au lieu d'un carré
                    pointStyle: 'circle', // 'rect', 'triangle', 'star', etc.
                    textAlign: 'center',  // alignement du texte dans l'item
                }
            }
        }
    };

    return (<ChartCardContainer ref={ref} {...props}>
        <Column paddingY='12' paddingX="20" gap="4">
            <Heading wrap="pretty" variant='heading-strong-xs'>{titre}</Heading>
            <Text onBackground="neutral-weak" variant="label-default-s" >{description}</Text>
        </Column>
        <ChartCard
            fillHeight
            background="transparent"
            border="transparent"
            id="flexibilityChart"
            chartType="radar"
            data={flexibilityChartData}
            options={flexibilityChartOptions}
        />
        <Column paddingY='12' paddingX="20" gap="4">
            <Text onBackground="neutral-medium" variant="label-default-s">{explication}</Text>
        </Column>
    </ChartCardContainer>
    );
});

Radar.displayName = "Radar"

export { Radar }