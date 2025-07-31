"use client"

import { solutionsHébergement } from "@/app/resources/content";
import { ChartCard, ChartCardContainer, getCssVariable, wrapLabels } from "@/components/chart";
import { Column, defaultChartOptions, Heading, Text, useTheme } from "@once-ui-system/core";
import type { ChartOptions } from "chart.js";
import { useEffect, useState } from "react";


// Flexibility Section Component
export const FlexibilitySection = () => {
    const { titre, description, explication } = solutionsHébergement.flexibilite_controle;
    const themeoptions = useTheme()
    const [chartColors, setChartColors] = useState({
        shared: "#ac2401",
        dedicated: "#5625f7",
        cloud: "#3c630a",
        accent: "#ac2401",
        gray: "#595959",
        textColor: "#ffffff",
    });
    useEffect(() => {
        setChartColors({
            shared: getCssVariable("--data-orange"),
            dedicated: getCssVariable("--data-indigo"),
            cloud: getCssVariable("--data-moss"),
            accent: getCssVariable("--data-blue"),
            gray: getCssVariable("--data-contrast"),
            textColor: getCssVariable("--neutral-on-background-strong"),
        });
    }, [themeoptions]);
    const flexibilityLabels = ['Contrôle total', 'Simplicité de gestion', 'Personnalisation', 'Maintenance externalisée', 'Scalabilité facile'].map(l => wrapLabels(l, 16));
    const flexibilityChartData = {
        labels: flexibilityLabels,
        datasets: [
            {
                label: 'Mutualisé',
                data: [1, 9, 2, 9, 2],
                backgroundColor: `${chartColors.shared}33`,
                borderColor: chartColors.shared,
                pointBackgroundColor: chartColors.shared,
            },
            {
                label: 'Dédié',
                data: [10, 2, 10, 1, 3],
                backgroundColor: `${chartColors.dedicated}33`,
                borderColor: chartColors.dedicated,
                pointBackgroundColor: chartColors.dedicated,
            },
            {
                label: 'Cloud',
                data: [7, 8, 8, 8, 10],
                backgroundColor: `${chartColors.cloud}33`,
                borderColor: chartColors.cloud,
                pointBackgroundColor: chartColors.cloud,
            }]
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
                    boxWidth: 20,         // largeur du carré de couleur
                    boxHeight: 12,        // hauteur du carré
                    padding: 16,          // espace entre les items
                    color: chartColors.textColor,        // couleur du texte
                    font: {
                        size: 12,
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

    return (<ChartCardContainer>
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
};