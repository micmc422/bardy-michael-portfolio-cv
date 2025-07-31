"use client"

import { ChartCard } from "@/components/chart";
import { Column, Flex, Heading, Row, Text } from "@once-ui-system/core";
import type { BubbleDataPoint, ChartData, ChartTypeRegistry, Point } from "chart.js";
import { forwardRef, useEffect, useRef } from "react";

interface DougNutDataType extends React.ComponentProps<typeof Flex> {
    nom: string;
    percent: number;
    explication?: string;
}

// Flexibility Section Component
const DougNut = forwardRef<HTMLDivElement, DougNutDataType>(({ nom, percent, explication, ...props }, ref) => {
    const createDougnutChartData = (label: string, value: number): ChartData<keyof ChartTypeRegistry, (number | Point | [number, number] | BubbleDataPoint | null)[], unknown> => ({
        labels: [label, ''],
        datasets: [{
            data: [value, 100 - value],
            backgroundColor: [
                '#58D172',
                'rgb(255, 99, 132)',
            ],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,

        }]
    });

    const dougnutChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    return (<Column ref={ref} style={{ maxWidth: "24rem" }} {...props}>
        <ChartCard
            titre={nom}
            explication={<Row gap="xs" center>
                <Text variant="label-strong-xl">{percent.toFixed(2)}%</Text>
                <Text variant="label-default-s">{explication}</Text>
            </Row>}
            id="douhnutShared"
            gap="s"
            center
            background="transparent"
            border="transparent"
            chartType="doughnut"
            padding="m"
            data={createDougnutChartData(nom, percent)}
            options={dougnutChartOptions}
            chartStyle={{ width: "24rem", height: "10rem" }}
        />
    </Column>
    );
});

DougNut.displayName = "DougNut"

export { DougNut }