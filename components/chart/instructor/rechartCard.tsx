"use client"

import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type ChartType = "bar" | "pie"

type BarOrientation = "vertical" | "horizontal"

interface ExtendedChartCardProps {
  /** Título de la tarjeta */
  title: string
  /** Descripción breve */
  description: string
  /** Datos para la gráfica */
  data: any[]
  /**
   * Tipo de gráfica: "bar" o "pie"
   */
  type: ChartType
  /**
   * Data key principal para el valor numérico (ej. "total")
   */
  dataKey: string
  /**
   * Key para la etiqueta (ej. "week", "status", etc.)
   */
  nameKey: string
  /**
   * Colores a usar para las celdas en el PieChart
   * o la barra principal en BarChart
   */
  colors?: string[]
  /**
   * Orientación de la gráfica de barras:
   * - "vertical" (por defecto)
   * - "horizontal"
   */
  barOrientation?: BarOrientation
  /**
   * Radio interno para el PieChart (para donut).
   * Si no quieres donut, déjalo en 0 o un valor menor.
   */
  innerRadius?: number
  /**
   * Radio externo para el PieChart (por defecto 80).
   */
  outerRadius?: number
}

/**
 * Componente que muestra un <Card> con un Rechart
 * que puede ser de barras (vertical/horizontal) o de pastel.
 */
export function ExtendedRechartCard({
  title,
  description,
  data,
  type,
  dataKey,
  nameKey,
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"],
  barOrientation = "vertical",
  innerRadius = 40,
  outerRadius = 80,
}: ExtendedChartCardProps) {
  const isHorizontal = type === "bar" && barOrientation === "horizontal"

  // Mezclar colores aleatoriamente
  const shuffledColors = [...colors].sort(() => Math.random() - 0.5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart
              data={data}
              layout={isHorizontal ? "vertical" : "horizontal"}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {isHorizontal ? (
                <>
                  <XAxis type="number" />
                  <YAxis dataKey={nameKey} type="category" />
                </>
              ) : (
                <>
                  <XAxis dataKey={nameKey} />
                  <YAxis />
                </>
              )}
              <Tooltip />
              <Bar dataKey={dataKey}>
                {data.map((_, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={shuffledColors[index % shuffledColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                label
              >
                {data.map((_, index) => (
                  <Cell
                    key={`pie-${index}`}
                    fill={shuffledColors[index % shuffledColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}