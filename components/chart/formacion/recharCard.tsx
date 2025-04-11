// src/components/RechartCard.tsx
"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, CartesianGrid, Tooltip, XAxis, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

interface ChartCardProps {
  title: string
  description: string
  data: any[]
  type: "bar" | "pie"
  dataKey: string
  nameKey: string
  colors?: string[]
}

export function RechartCard({
  title,
  description,
  data,
  type,
  dataKey,
  nameKey,
  colors = ["#8884d8"],
}: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <Tooltip />
              <Bar dataKey={dataKey} fill={colors[0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie data={data} dataKey={dataKey} nameKey={nameKey} innerRadius={40} outerRadius={80} label>
                {data.map((entry, index) => (
                  <Cell key={`pie-${index}`} fill={colors[index % colors.length]} />
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
