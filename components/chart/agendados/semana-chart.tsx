import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F']

interface Props {
    estadisticas: {
        week: string;
        total: number;
    }[]
}

const BarSemanaChart = ({estadisticas}: Props) => {
    return (
        <Card className="col-span-3">
            <CardHeader className="flex flex-col items-start gap-1 px-6 py-5 border-b sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Alumnos agendados por semana</CardTitle>
                    <CardDescription>Total de estudiantes por número de semana</CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={{
                        views: { label: "Agendados" },
                        total: { label: "Total", color: COLORS[1] },
                    }}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={estadisticas}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={16}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="week"
                                    labelFormatter={(value) => `Semana ${value}`}
                                />
                            }
                        />
                        <Bar dataKey="total" name="Agendados" fill="var(--color-total)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default BarSemanaChart
