"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Props para la tarjeta de estadística
 */
interface StatCardProps {
  /** Clase de color para el borde lateral: e.g. "border-l-purple-500" */
  borderColorClass: string
  /** Ícono que quieras renderizar en la parte superior derecha */
  icon: React.ReactNode
  /** Título de la tarjeta (ej. "Estudiantes") */
  title: string
  /** Valor principal (ej. "45") */
  value: string | number
  /** Descripción adicional, en letra pequeña */
  description?: string
}

/**
 * Tarjeta genérica para mostrar un valor, título e ícono, con un borde de color
 */
export function StatCard({
  borderColorClass,
  icon,
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <Card className={cn("border-l-4", borderColorClass)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
