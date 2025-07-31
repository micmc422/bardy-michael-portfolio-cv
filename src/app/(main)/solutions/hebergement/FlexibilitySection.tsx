"use client"

import { ChartCard, getCssVariable, wrapLabels } from "@/components/chart";
import { defaultChartOptions } from "@once-ui-system/core";
import { useEffect, useState } from "react";


// Flexibility Section Component
export const FlexibilitySection = () => {
    const [chartColors, setChartColors] = useState({
        shared: "#ac2401",
        dedicated: "#5625f7",
        cloud: "#3c630a",
        accent: "#ac2401",
        gray: "#595959",
    });
    useEffect(() => {
        setChartColors({
            shared: getCssVariable("--data-orange"),
            dedicated: getCssVariable("--data-indigo"),
            cloud: getCssVariable("--data-moss"),
            accent: getCssVariable("--data-blue"),
            gray: getCssVariable("--data-contrast"),
        });
    }, []);
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

    const flexibilityChartOptions = {
        ...defaultChartOptions,
        scales: {
            r: {
                beginAtZero: true,
                max: 10,
                ticks: {
                    display: false
                }
            }
        }
    };

    return (<ChartCard
        titre={`Contrôle vs. Simplicité`}
        description={`Chaque solution offre un compromis différent entre le niveau de contrôle sur le serveur et la simplicité de gestion au quotidien.`}
        explication={`Le Cloud offre un équilibre idéal, fournissant un contrôle significatif (via IaaS) tout en simplifiant la maintenance de l'infrastructure de base.`}
        id="flexibilityChart"
        chartType="radar"
        data={flexibilityChartData}
        options={flexibilityChartOptions}
    />
    );
};