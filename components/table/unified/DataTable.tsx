"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export interface TableColumn<T = any> {
  key: string
  header: string
  accessor?: keyof T | ((item: T) => any)
  render?: (value: any, item: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string
}

export interface TableAction<T = any> {
  label: string
  icon?: React.ReactNode
  onClick: (item: T) => void
  variant?: "default" | "destructive" | "outline"
  disabled?: (item: T) => boolean
}

interface DataTableProps<T = any> {
  data: T[]
  columns: TableColumn<T>[]
  actions?: TableAction<T>[]
  isLoading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  onRowClick?: (item: T) => void
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  isLoading = false,
  searchable = true,
  searchPlaceholder = "Buscar...",
  emptyMessage = "No hay datos disponibles",
  className,
  onRowClick
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true
    
    return columns.some((column) => {
      let value: any
      
      if (column.accessor) {
        if (typeof column.accessor === 'function') {
          value = column.accessor(item)
        } else {
          value = item[column.accessor]
        }
      } else {
        value = item[column.key]
      }
      
      return String(value).toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    
    const column = columns.find(col => col.key === sortColumn)
    if (!column) return 0
    
    let aValue: any, bValue: any
    
    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        aValue = column.accessor(a)
        bValue = column.accessor(b)
      } else {
        aValue = a[column.accessor]
        bValue = b[column.accessor]
      }
    } else {
      aValue = a[column.key]
      bValue = b[column.key]
    }
    
    // Handle different data types
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' 
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }
    
    // String comparison
    const aStr = String(aValue).toLowerCase()
    const bStr = String(bValue).toLowerCase()
    
    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr)
    } else {
      return bStr.localeCompare(aStr)
    }
  })

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey)
    if (!column?.sortable) return
    
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const getCellValue = (item: T, column: TableColumn<T>) => {
    let value: any
    
    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        value = column.accessor(item)
      } else {
        value = item[column.accessor]
      }
    } else {
      value = item[column.key]
    }
    
    if (column.render) {
      return column.render(value, item)
    }
    
    return value
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {searchable && (
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground animate-pulse" />
              <div className="h-9 bg-muted rounded-md animate-pulse pl-8" />
            </div>
          </div>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} style={{ width: column.width }}>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead className="w-[70px]">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  style={{ width: column.width }}
                  className={column.sortable ? "cursor-pointer hover:bg-muted" : ""}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="w-[70px]">Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)} 
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item, index) => (
                <TableRow 
                  key={item.id || index}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {getCellValue(item, column)}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={(e) => {
                                e.stopPropagation()
                                action.onClick(item)
                              }}
                              disabled={action.disabled?.(item)}
                              className={action.variant === 'destructive' ? 'text-destructive' : ''}
                            >
                              {action.icon && <span className="mr-2">{action.icon}</span>}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Info */}
      {searchTerm && (
        <div className="text-sm text-muted-foreground">
          {sortedData.length} de {data.length} resultados
        </div>
      )}
    </div>
  )
}