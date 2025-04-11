"use client"

import * as React from "react"
import { Pie, PieChart, Label, Cell } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface Props {
    tipo: {
        tipo: string;
        total: number;
    }[]
}

export function PieTipoChart({ tipo }: Props) {
    const COLORS = ['#82ca9d', '#0080ff', '#4b5563', '#000000', '#ffc403']
    const getPastelColor = (index: number) => {
        return COLORS[index % COLORS.length]
    }

    const chartConfig = tipo.reduce((acc, item, idx) => {
        acc[item.tipo] = {
            label: item.tipo,
            color: `${getPastelColor(idx)}`, // Usar colores pastel
        }
        return acc
    }, {
        total: {
            label: "Agendados",
        }
    } as ChartConfig)

    const chartData = tipo.map((item, idx) => ({
        tipo: item.tipo,
        total: item.total,
        fill: getPastelColor(idx), // Aplicar colores pastel directamente
    }))

    const totalAgendados = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.total, 0)
    }, [tipo])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Distribución por Tipo</CardTitle>
                <CardDescription className="flex gap-2">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span
                                className="inline-block w-4 h-4 rounded-full"
                                style={{ backgroundColor: item.fill }}
                            ></span>
                            <span>{item.tipo}</span>
                        </div>
                    ))}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="total"
                            nameKey="tipo"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} /> // Aplicar colores pastel aquí
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalAgendados.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Agendados
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}