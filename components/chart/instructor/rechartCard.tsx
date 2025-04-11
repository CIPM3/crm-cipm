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
  colors = ["#8884d8"],
  barOrientation = "vertical",
  innerRadius = 40,
  outerRadius = 80,
}: ExtendedChartCardProps) {
  // Si la gráfica es de barras y la orientación es horizontal:
  //   usamos layout="vertical" y la key de Y es nameKey
  //   la key de X es dataKey
  // Si es barras verticales:
  //   layout por defecto y X es nameKey
  //   la key de Y es dataKey
  const isHorizontal = type === "bar" && barOrientation === "horizontal"

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
              layout={isHorizontal ? "vertical" : "horizontal"} // "horizontal" es el default,
              // pero si layout="vertical", interpretará ejes al revés
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
              <Bar dataKey={dataKey} fill={colors[0]} />
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
                {data.map((entry, index) => (
                  <Cell
                    key={`pie-${index}`}
                    fill={colors[index % colors.length]}
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
