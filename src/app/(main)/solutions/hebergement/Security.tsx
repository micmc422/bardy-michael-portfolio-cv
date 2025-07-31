"use client"

import { solutionsHébergement } from "@/app/resources/content";
import { ChartCard, getCssVariable } from "@/components/chart";
import { Column, Row } from "@once-ui-system/core";
import { useEffect, useState } from "react";


// Flexibility Section Component
export const SecuritySection = () => {
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
    const createUptimeChartData = (label: string, value: number, color: string) => ({
        labels: [label, ''],
        datasets: [{
            data: [value, 100 - value],
            backgroundColor: [color, chartColors.gray],
            borderColor: [chartColors.gray],
            borderWidth: 2,
            circumference: 180,
            rotation: 270,
        }]
    });

    const uptimeChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    const uptimeChartPlugins = (value: number, color: string) => [{
        id: 'doughnutText',
        afterDraw(chart: { ctx: any; width: any; height: any; }) {
            const { ctx, width, height } = chart;
            ctx.restore();
            const text = value.toFixed(2) + '%';
            ctx.font = 'bold 24px Inter';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'start';
            const textX = width / 2;
            const textY = height - 20;
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
    }];

    return (<Row gap="m" wrap>
        {solutionsHébergement.securite_fiabilite.types.map(({ nom, disponibilite, explication }, i) => <Column padding="s" key={i}
>
            <ChartCard
                maxWidth={"160"}
                titre={nom}
                explication={explication}
                background="transparent"
                border="transparent"
                id="uptimeShared"
                chartType="doughnut"
                data={createUptimeChartData(nom, disponibilite, chartColors.shared)}
                options={uptimeChartOptions}
                plugins={uptimeChartPlugins(disponibilite, chartColors.shared)}
            />
        </Column>)}
    </Row>
    );
};