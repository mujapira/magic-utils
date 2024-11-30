"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, LabelList, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig: ChartConfig = {

};

interface PieChartComponentProps {
    data: { name: string; value: number; fill: string }[];
    title: string;
    description: string;
    dataKey: string;
    nameKey: string;
}

export function PieChartComponent({
    data,
    title,
    description,
    dataKey,
    nameKey,
}: PieChartComponentProps) {

    return (
        <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{title}</span>
            <CardContent className="flex-1 pb-0 px-0 mx-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square min-w-[200px] w-full"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={data}
                            dataKey={dataKey}
                            nameKey={nameKey}
                            innerRadius={0}
                            strokeWidth={5}
                        >
                            {/* <LabelList
                                dataKey={nameKey}
                                className="fill-background"
                                stroke="none"
                                fontSize={14}
                                formatter={(value: any) => {
                                    return chartConfig[value]?.label || value;
                                }}
                            /> */}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </div>
    )
}
