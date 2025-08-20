// Template for creating Radix UI components with shadcn/ui integration
// Copy this file and replace [Feature] placeholders with your feature name

import React, { forwardRef, useState, useCallback } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { [Feature]DataType } from '@/types'
import { MoreHorizontal, Edit, Trash2, Eye, ExternalLink } from 'lucide-react'

// === COMPONENT VARIANTS ===

const [feature]CardVariants = cva(
  'transition-all duration-200 hover:shadow-md border-border',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        outlined: 'border-2 bg-background',
        elevated: 'shadow-lg bg-card',
        compact: 'p-3',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      status: {
        active: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50',
        inactive: 'border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/50',
        draft: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50',
        archived: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      status: 'active',
    },
  }
)

// === INTERFACES ===

interface [Feature]CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof [feature]CardVariants> {
  item: [Feature]DataType
  showActions?: boolean
  showStatus?: boolean
  showMetadata?: boolean
  isSelected?: boolean
  
  // Event handlers
  onEdit?: (item: [Feature]DataType) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  onClick?: (item: [Feature]DataType) => void
  onSelect?: (selected: boolean) => void
}

interface [Feature]ActionsProps {
  item: [Feature]DataType
  onEdit?: (item: [Feature]DataType) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

interface [Feature]StatusBadgeProps {
  status: [Feature]DataType['status']
  variant?: 'default' | 'outline' | 'secondary'
}

// === MAIN COMPONENT ===

export const [Feature]Card = forwardRef<HTMLDivElement, [Feature]CardProps>(
  ({ 
    item, 
    variant = 'default',
    size = 'md',
    status,
    showActions = true,
    showStatus = true,
    showMetadata = true,
    isSelected = false,
    className,
    onEdit,
    onDelete,
    onView,
    onClick,
    onSelect,
    ...props 
  }, ref) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const handleCardClick = useCallback((e: React.MouseEvent) => {
      // Don't trigger onClick if clicking on action buttons
      if ((e.target as HTMLElement).closest('button, [role="menuitem"]')) {
        return
      }
      onClick?.(item)
    }, [onClick, item])

    const handleDelete = useCallback(() => {
      onDelete?.(item.id)
      setIsDeleteDialogOpen(false)
    }, [onDelete, item.id])

    return (
      <TooltipProvider>
        <Card
          ref={ref}
          className={cn(
            [feature]CardVariants({ 
              variant, 
              size, 
              status: status || item.status 
            }),
            isSelected && 'ring-2 ring-primary ring-offset-2',
            onClick && 'cursor-pointer hover:bg-accent/50',
            className
          )}
          onClick={handleCardClick}
          {...props}
        >
          <CardHeader className={cn(
            'pb-3',
            size === 'sm' && 'pb-2',
            size === 'lg' && 'pb-4'
          )}>
            <div className="flex items-start justify-between space-y-0">
              <div className="space-y-1 flex-1 min-w-0">
                <CardTitle className={cn(
                  'line-clamp-1',
                  size === 'sm' && 'text-base',
                  size === 'lg' && 'text-xl'
                )}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{item.name}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                
                {item.description && (
                  <CardDescription className={cn(
                    'line-clamp-2',
                    size === 'sm' && 'text-xs line-clamp-1'
                  )}>
                    {item.description}
                  </CardDescription>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-2">
                {showStatus && (
                  <[Feature]StatusBadge status={item.status} />
                )}
                
                {onSelect && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation()
                      onSelect(e.target.checked)
                    }}
                    className="rounded border-border"
                  />
                )}
                
                {showActions && (onEdit || onDelete || onView) && (
                  <[Feature]Actions
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete ? () => setIsDeleteDialogOpen(true) : undefined}
                    onView={onView}
                  />
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className={cn(
            'pt-0',
            size === 'sm' && 'pb-2'
          )}>
            {/* Custom content based on feature type */}
            <div className="space-y-2">
              {item.category && (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  {item.priority && (
                    <Badge 
                      variant={item.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {item.priority}
                    </Badge>
                  )}
                </div>
              )}
              
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>

          {showMetadata && (
            <CardFooter className={cn(
              'pt-0 text-xs text-muted-foreground',
              size === 'sm' && 'pt-1'
            )}>
              <div className="flex justify-between items-center w-full">
                <span>
                  Created {new Date(item.createdAt).toLocaleDateString()}
                </span>
                {item.updatedAt && item.updatedAt !== item.createdAt && (
                  <span>
                    Updated {new Date(item.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardFooter>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{item.name}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </TooltipProvider>
    )
  }
)

[Feature]Card.displayName = '[Feature]Card'

// === SUB-COMPONENTS ===

const [Feature]Actions: React.FC<[Feature]ActionsProps> = ({ 
  item, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {onView && (
          <DropdownMenuItem onClick={() => onView(item.id)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}
        
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(item)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(item.id)}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Copy ID
        </DropdownMenuItem>
        
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(item.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const [Feature]StatusBadge: React.FC<[Feature]StatusBadgeProps> = ({ 
  status, 
  variant = 'default' 
}) => {
  const statusConfig = {
    active: { 
      label: 'Active', 
      className: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300' 
    },
    inactive: { 
      label: 'Inactive', 
      className: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300' 
    },
    draft: { 
      label: 'Draft', 
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300' 
    },
    archived: { 
      label: 'Archived', 
      className: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300' 
    },
  }

  const config = statusConfig[status]
  
  return (
    <Badge variant={variant} className={cn(config.className, 'text-xs')}>
      {config.label}
    </Badge>
  )
}

// === SKELETON LOADING COMPONENT ===

export const [Feature]CardSkeleton: React.FC<{ variant?: 'default' | 'compact' }> = ({ 
  variant = 'default' 
}) => {
  return (
    <Card className={cn(variant === 'compact' && 'p-3')}>
      <CardHeader className={cn(variant === 'compact' && 'pb-2')}>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex space-x-2 ml-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex space-x-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardFooter>
    </Card>
  )
}

// === EXPORTS ===

export { [Feature]Actions, [Feature]StatusBadge, [feature]CardVariants }
export type { [Feature]CardProps, [Feature]ActionsProps, [Feature]StatusBadgeProps }

/* 
USAGE EXAMPLES:

// Basic usage
<[Feature]Card 
  item={[feature]Item}
  onEdit={(item) => setEditingItem(item)}
  onDelete={(id) => handleDelete(id)}
  onView={(id) => navigate(`/[feature]s/${id}`)}
/>

// Compact variant
<[Feature]Card 
  item={[feature]Item}
  variant="compact"
  size="sm"
  showMetadata={false}
/>

// With selection
<[Feature]Card 
  item={[feature]Item}
  isSelected={selected[feature]s.includes(item.id)}
  onSelect={(selected) => handleSelect(item.id, selected)}
/>

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {[feature]s.map((item) => (
    <[Feature]Card key={item.id} item={item} />
  ))}
</div>

// Loading state
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {Array.from({ length: 6 }).map((_, i) => (
    <[Feature]CardSkeleton key={i} />
  ))}
</div>

// Status-based styling
<[Feature]Card 
  item={[feature]Item}
  status={item.status} // Will apply appropriate colors
/>

*/