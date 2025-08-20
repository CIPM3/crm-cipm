# Practical Development Examples

Real-world examples demonstrating the development guidelines applied to the CRM system's existing features.

## Table of Contents

- [1. Curso Management Example](#1-curso-management-example)
- [2. Video Management Example](#2-video-management-example)
- [3. User Management Example](#3-user-management-example)
- [4. Form Handling Example](#4-form-handling-example)
- [5. Error Handling Example](#5-error-handling-example)
- [6. Performance Optimization Example](#6-performance-optimization-example)

---

## 1. Curso Management Example

This example shows how the existing course management follows our development guidelines.

### API Layer Implementation

```typescript
// api/Cursos/index.ts - Following centralized service pattern
import { 
  fetchItems, 
  fetchItem, 
  addItem, 
  updateItem, 
  deleteItem 
} from '@/lib/firebaseService'
import { CursoDataType } from '@/types'
import { FIREBASE_COLLECTIONS } from '@/lib/constants'

// ✅ Good: Using centralized service with consistent naming
export const getAllCursos = () => fetchItems<CursoDataType>(FIREBASE_COLLECTIONS.CURSOS)
export const getCursoById = (id: string) => fetchItem<CursoDataType>(FIREBASE_COLLECTIONS.CURSOS, id)
export const createCurso = (data: Omit<CursoDataType, 'id'>) => addItem(FIREBASE_COLLECTIONS.CURSOS, data)
export const updateCurso = (id: string, data: Partial<CursoDataType>) => updateItem(FIREBASE_COLLECTIONS.CURSOS, id, data)
export const deleteCurso = (id: string) => deleteItem(FIREBASE_COLLECTIONS.CURSOS, id)

// ✅ Good: Advanced queries with proper typing
export const getActiveCursos = () => fetchItems<CursoDataType>(FIREBASE_COLLECTIONS.CURSOS, {
  where: [{ field: 'published', operator: '==', value: true }],
  orderBy: [{ field: 'fechaCreacion', direction: 'desc' }]
})

export const getCursosByCategory = (categoria: string) => fetchItems<CursoDataType>(FIREBASE_COLLECTIONS.CURSOS, {
  where: [{ field: 'categoria', operator: '==', value: categoria }],
  orderBy: [{ field: 'titulo', direction: 'asc' }]
})
```

### Hook Implementation with Performance Optimization

```typescript
// hooks/queries/useCursos.ts - Following standardized hook patterns
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys'
import { getAllCursos, createCurso, updateCurso, deleteCurso, getCursoById } from '@/lib/firebaseService'
import { CursoDataType } from '@/types'
import { useServerOptimizedQuery, useServerOptimizedMutation } from '@/hooks/core/useServerOptimizedQuery'
import { useMemo, useCallback } from 'react'

// ✅ Good: Enhanced hook with filters and performance optimization
export const useGetCursos = (filters?: { 
  published?: boolean 
  search?: string 
  category?: string 
  instructor?: string 
}) => {
  const memoizedFilters = useMemo(() => filters, [
    filters?.published, 
    filters?.search, 
    filters?.category, 
    filters?.instructor
  ])

  return useServerOptimizedQuery({
    queryKey: queryKeys.cursosList(memoizedFilters),
    queryFn: async () => {
      const data = await getAllCursos()
      
      // Client-side filtering for better performance
      if (!memoizedFilters) return data
      
      return data.filter(curso => {
        if (memoizedFilters.published !== undefined && curso.published !== memoizedFilters.published) {
          return false
        }
        if (memoizedFilters.search && !curso.titulo.toLowerCase().includes(memoizedFilters.search.toLowerCase())) {
          return false
        }
        if (memoizedFilters.category && curso.categoria !== memoizedFilters.category) {
          return false
        }
        if (memoizedFilters.instructor && curso.instructorId !== memoizedFilters.instructor) {
          return false
        }
        return true
      })
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - courses change less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    select: useCallback((data: (CursoDataType & { id: string })[]) => {
      // Sort and add computed properties
      return data
        .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
        .map(curso => ({
          ...curso,
          // Add computed properties for UI
          isPublished: curso.published || false,
          moduleCount: curso.modulos?.length || 0,
          duration: curso.duracion || 0,
          enrollmentCount: 0 // This would be computed from enrollment data
        }))
    }, [])
  })
}

// ✅ Good: Mutation with optimistic updates and proper error handling
export const useCreateCurso = () => {
  return useServerOptimizedMutation<
    { id: string },
    Omit<CursoDataType, 'id'>
  >({
    mutationFn: async (cursoData) => {
      // Input validation
      if (!cursoData.titulo?.trim()) {
        throw new Error('El título del curso es requerido')
      }
      if (!cursoData.descripcion?.trim()) {
        throw new Error('La descripción del curso es requerida')
      }
      
      return await createCurso(cursoData)
    },
    invalidateQueries: getInvalidationKeys.onCursoCreate(),
    optimisticUpdate: {
      queryKey: queryKeys.cursosList(),
      updater: (oldData: (CursoDataType & { id: string })[] | undefined, variables) => {
        if (!oldData) return []
        
        const optimisticCurso: CursoDataType & { id: string } = {
          ...variables,
          id: `temp-${Date.now()}`,
          fechaCreacion: new Date().toISOString(),
          published: false,
          modulos: []
        }
        
        return [optimisticCurso, ...oldData]
      }
    },
    onSuccess: async (data, variables) => {
      console.log('Curso created successfully:', data.id)
      
      // Custom success handling
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('curso-created', {
          detail: { id: data.id, titulo: variables.titulo }
        }))
      }
    },
    onError: (error, variables) => {
      console.error('Error creating curso:', error, variables)
    }
  })
}
```

### TypeScript Types Implementation

```typescript
// types/index.ts - Following centralized type definitions
export interface CursoDataType {
  id?: string
  titulo: string
  descripcion: string
  categoria: string
  nivel: string
  duracion?: number
  precio?: number
  published?: boolean
  fechaCreacion: string
  fechaActualizacion?: string
  instructorId?: string
  modulos?: string[]
  thumbnail?: string
  tags?: string[]
  requirements?: string[]
  objectives?: string[]
}

// Form-specific types
export interface CreateCursoFormData {
  titulo: string
  descripcion: string
  categoria: string
  nivel: string
  duracion?: number
  precio?: number
  instructorId?: string
  tags?: string
  requirements?: string
  objectives?: string
}

// Component prop types
export interface CursoCardProps {
  curso: CursoDataType & { id: string }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  variant?: 'default' | 'compact'
  className?: string
}

// API response types
export interface CursoListResponse {
  data: (CursoDataType & { id: string })[]
  total: number
  hasNextPage?: boolean
  nextPageCursor?: any
}
```

### Component Implementation

```typescript
// components/curso/CursoCard.tsx - Following Radix UI patterns
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Edit, Trash2, Eye, BookOpen } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CursoDataType, CursoCardProps } from '@/types'
import { cn } from '@/lib/utils'

export function CursoCard({ 
  curso, 
  onEdit,
  onDelete,
  onView,
  variant = 'default',
  className
}: CursoCardProps) {
  const isCompact = variant === 'compact'

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-lg cursor-pointer group',
      'border-border/50 hover:border-border',
      isCompact && 'p-4',
      className
    )}>
      <CardHeader className={cn(
        'pb-3',
        isCompact && 'pb-2'
      )}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className={cn(
              'line-clamp-2 group-hover:text-primary transition-colors',
              isCompact ? 'text-base' : 'text-lg'
            )}>
              {curso.titulo}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={curso.published ? 'default' : 'secondary'}
                className="text-xs"
              >
                {curso.published ? 'Published' : 'Draft'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {curso.categoria}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(curso.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(curso.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Course
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(curso.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Course
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        'pt-0 space-y-4',
        isCompact && 'space-y-2'
      )}>
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {curso.descripcion || 'No description available'}
        </p>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{curso.modulos?.length || 0} modules</span>
          </div>
          {curso.duracion && (
            <div>
              <span>{curso.duracion} hours</span>
            </div>
          )}
          {curso.precio && (
            <div className="font-medium text-primary">
              ${curso.precio}
            </div>
          )}
        </div>
        
        {/* Instructor and dates */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {curso.instructorId && (
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">IN</AvatarFallback>
              </Avatar>
            )}
            <span>Instructor</span>
          </div>
          <span>
            {new Date(curso.fechaCreacion).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 2. Video Management Example

### Enhanced Video Hook with Caching Strategy

```typescript
// hooks/queries/useVideos.ts - Optimized for video content
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys'
import { getAllVideos, createVideo, updateVideo, deleteVideo, getVideoById } from '@/lib/firebaseService'
import { VideoDataType } from '@/types'
import { useServerOptimizedQuery, useServerOptimizedMutation } from '@/hooks/core/useServerOptimizedQuery'
import { useMemo, useCallback } from 'react'

// ✅ Good: Video-specific caching strategy (shorter stale time due to view analytics)
export const useGetVideos = (filters?: { 
  categoria?: string 
  duracion?: string 
  published?: boolean 
}) => {
  const memoizedFilters = useMemo(() => filters, [
    filters?.categoria,
    filters?.duracion,
    filters?.published
  ])

  return useServerOptimizedQuery({
    queryKey: queryKeys.videosList(memoizedFilters),
    queryFn: async () => {
      const data = await getAllVideos()
      
      if (!memoizedFilters) return data
      
      return data.filter(video => {
        if (memoizedFilters.categoria && video.categoria !== memoizedFilters.categoria) return false
        if (memoizedFilters.published !== undefined && video.published !== memoizedFilters.published) return false
        if (memoizedFilters.duracion) {
          const duration = parseInt(video.duracion || '0')
          switch (memoizedFilters.duracion) {
            case 'short': return duration <= 300 // 5 minutes
            case 'medium': return duration > 300 && duration <= 1800 // 5-30 minutes
            case 'long': return duration > 1800 // 30+ minutes
          }
        }
        return true
      })
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - videos might have view count updates
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    select: useCallback((data: (VideoDataType & { id: string })[]) => {
      return data
        .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
        .map(video => ({
          ...video,
          // Add computed properties
          isPublished: video.published || false,
          durationMinutes: video.duracion ? Math.ceil(parseInt(video.duracion) / 60) : 0,
          hasTranscript: !!video.transcript,
          viewCount: video.views || 0
        }))
    }, [])
  })
}

// ✅ Good: Infinite query for video pagination (useful for video galleries)
export const useInfiniteVideos = (filters?: any) => {
  return useInfiniteQuery({
    queryKey: queryKeys.videosList(filters),
    queryFn: ({ pageParam }) => getVideosPage({
      ...filters,
      cursor: pageParam,
      limit: 12, // Good number for video grids
    }),
    getNextPageParam: (lastPage) => lastPage.nextPageCursor,
    staleTime: 3 * 60 * 1000, // 3 minutes for infinite lists
  })
}

// ✅ Good: Video analytics hook with appropriate caching
export const useVideoAnalytics = (videoId: string) => {
  return useServerOptimizedQuery({
    queryKey: queryKeys.videoAnalytics(videoId),
    queryFn: () => getVideoAnalytics(videoId),
    enabled: !!videoId,
    staleTime: 2 * 60 * 1000, // 2 minutes - analytics change frequently
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  })
}
```

---

## 3. User Management Example

### User Management with Role-Based Access

```typescript
// hooks/queries/useUsers.ts - Role-based user management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys'
import { getAllUsuarios, createUsuario, updateUsuario, deleteUsuario, getUsuarioById } from '@/lib/firebaseService'
import { UserDataType } from '@/types'
import { useServerOptimizedQuery, useServerOptimizedMutation } from '@/hooks/core/useServerOptimizedQuery'
import { useMemo, useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

// ✅ Good: User queries with role-based filtering and security
export const useGetUsuarios = (filters?: { 
  role?: string 
  status?: string 
  search?: string 
}) => {
  const { user: currentUser } = useAuthStore()
  const memoizedFilters = useMemo(() => filters, [
    filters?.role,
    filters?.status,
    filters?.search
  ])

  return useServerOptimizedQuery({
    queryKey: queryKeys.usersList(memoizedFilters),
    queryFn: async () => {
      // Check permissions
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Insufficient permissions')
      }
      
      const data = await getAllUsuarios()
      
      if (!memoizedFilters) return data
      
      return data.filter(user => {
        if (memoizedFilters.role && user.role !== memoizedFilters.role) return false
        if (memoizedFilters.status && user.status !== memoizedFilters.status) return false
        if (memoizedFilters.search) {
          const searchTerm = memoizedFilters.search.toLowerCase()
          return user.name.toLowerCase().includes(searchTerm) ||
                 user.email.toLowerCase().includes(searchTerm)
        }
        return true
      })
    },
    enabled: !!currentUser && currentUser.role === 'admin',
    staleTime: 2 * 60 * 1000, // 2 minutes - user data changes less frequently
    gcTime: 10 * 60 * 1000,
    select: useCallback((data: (UserDataType & { id: string })[]) => {
      return data
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .map(user => ({
          ...user,
          // Add computed properties
          isActive: user.status === 'active',
          displayName: user.name || user.email,
          roleDisplay: user.role.charAt(0).toUpperCase() + user.role.slice(1),
          lastSeenFormatted: user.lastSeen ? new Date(user.lastSeen).toLocaleDateString() : 'Never'
        }))
    }, [])
  })
}

// ✅ Good: User creation with role validation and audit trail
export const useCreateUsuario = () => {
  const { user: currentUser } = useAuthStore()
  
  return useServerOptimizedMutation<
    { id: string },
    Omit<UserDataType, 'id'>
  >({
    mutationFn: async (userData) => {
      // Permission check
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Only administrators can create users')
      }
      
      // Input validation
      if (!userData.email?.trim()) {
        throw new Error('Email is required')
      }
      if (!userData.name?.trim()) {
        throw new Error('Name is required')
      }
      if (!userData.role) {
        throw new Error('User role is required')
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        throw new Error('Please provide a valid email address')
      }
      
      // Add audit fields
      const userWithAudit = {
        ...userData,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
      
      return await createUsuario(userWithAudit)
    },
    invalidateQueries: getInvalidationKeys.onUserCreate(userData.role),
    onSuccess: async (data, variables) => {
      console.log('User created successfully:', data.id)
      
      // Send welcome email notification (would be implemented)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('user-created', {
          detail: { 
            id: data.id, 
            email: variables.email,
            role: variables.role
          }
        }))
      }
    },
    onError: (error, variables) => {
      console.error('Error creating user:', error, variables)
      
      // Log failed user creation attempts for security
      console.warn('Failed user creation attempt:', {
        email: variables.email,
        role: variables.role,
        error: error.message,
        timestamp: new Date().toISOString(),
        createdBy: currentUser?.id
      })
    }
  })
}
```

---

## 4. Form Handling Example

### Advanced Form with Validation and User Experience

```typescript
// components/curso/CursoForm.tsx - Advanced form implementation
import React, { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Save, Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateCursoFormData } from '@/types'

// ✅ Good: Comprehensive form validation schema
const cursoSchema = z.object({
  titulo: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  descripcion: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  categoria: z.string().min(1, 'Please select a category'),
  nivel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select a level'
  }),
  duracion: z.number()
    .min(1, 'Duration must be at least 1 hour')
    .max(100, 'Duration cannot exceed 100 hours')
    .optional()
    .or(z.literal('')),
  precio: z.number()
    .min(0, 'Price cannot be negative')
    .max(10000, 'Price cannot exceed $10,000')
    .optional()
    .or(z.literal('')),
  published: z.boolean().default(false),
  instructorId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
})

type CursoFormData = z.infer<typeof cursoSchema>

interface CursoFormProps {
  initialData?: Partial<CursoFormData>
  onSubmit: (data: CursoFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export function CursoForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create',
}: CursoFormProps) {
  const form = useForm<CursoFormData>({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      titulo: initialData?.titulo ?? '',
      descripcion: initialData?.descripcion ?? '',
      categoria: initialData?.categoria ?? '',
      nivel: initialData?.nivel ?? 'beginner',
      duracion: initialData?.duracion ?? undefined,
      precio: initialData?.precio ?? undefined,
      published: initialData?.published ?? false,
      instructorId: initialData?.instructorId ?? '',
      tags: initialData?.tags ?? [],
      requirements: initialData?.requirements ?? [],
      objectives: initialData?.objectives ?? [],
    },
  })

  // ✅ Good: Field arrays for dynamic content
  const { 
    fields: tagFields, 
    append: appendTag, 
    remove: removeTag 
  } = useFieldArray({
    control: form.control,
    name: 'tags'
  })

  const { 
    fields: requirementFields, 
    append: appendRequirement, 
    remove: removeRequirement 
  } = useFieldArray({
    control: form.control,
    name: 'requirements'
  })

  const { 
    fields: objectiveFields, 
    append: appendObjective, 
    remove: removeObjective 
  } = useFieldArray({
    control: form.control,
    name: 'objectives'
  })

  // ✅ Good: Auto-save draft functionality
  useEffect(() => {
    if (mode === 'create') {
      const subscription = form.watch((data) => {
        // Save draft to localStorage
        localStorage.setItem('curso-draft', JSON.stringify(data))
      })
      return () => subscription.unsubscribe()
    }
  }, [form, mode])

  // ✅ Good: Load draft on component mount
  useEffect(() => {
    if (mode === 'create' && !initialData) {
      const draft = localStorage.getItem('curso-draft')
      if (draft) {
        try {
          const draftData = JSON.parse(draft)
          Object.keys(draftData).forEach(key => {
            if (draftData[key] !== undefined && draftData[key] !== '') {
              form.setValue(key as keyof CursoFormData, draftData[key])
            }
          })
        } catch (error) {
          console.error('Failed to load draft:', error)
        }
      }
    }
  }, [form, mode, initialData])

  const handleSubmit = async (data: CursoFormData) => {
    try {
      await onSubmit(data)
      if (mode === 'create') {
        // Clear draft after successful submission
        localStorage.removeItem('curso-draft')
        form.reset()
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const addTag = () => {
    appendTag('')
  }

  const addRequirement = () => {
    appendRequirement('')
  }

  const addObjective = () => {
    appendObjective('')
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter course title"
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, descriptive title for your course
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what students will learn in this course"
                        className="resize-none" 
                        rows={4}
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category and Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="programming">Programming</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="languages">Languages</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nivel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Duration and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="duracion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Estimated completion time
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="precio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty for free course
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tags Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Tags</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                    disabled={isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tag
                  </Button>
                </div>
                <div className="space-y-2">
                  {tagFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`tags.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="Enter tag"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeTag(index)}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Requirements Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Requirements</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRequirement}
                    disabled={isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Requirement
                  </Button>
                </div>
                <div className="space-y-2">
                  {requirementFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`requirements.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="Enter requirement"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRequirement(index)}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Objectives Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Learning Objectives</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addObjective}
                    disabled={isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Objective
                  </Button>
                </div>
                <div className="space-y-2">
                  {objectiveFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`objectives.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="Enter learning objective"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeObjective(index)}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publication Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Publication Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Publish Course
                      </FormLabel>
                      <FormDescription>
                        Make this course visible to students. You can change this later.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !form.formState.isDirty}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'create' ? 'Create Course' : 'Update Course'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
```

---

## 5. Error Handling Example

### Comprehensive Error Handling System

```typescript
// hooks/core/useServerOptimizedQuery.ts - Enhanced error handling
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { FirebaseServiceError } from '@/lib/firebaseService'
import { toast } from '@/components/ui/use-toast'

// ✅ Good: Centralized error categorization
export enum ErrorCategory {
  NETWORK = 'network',
  AUTH = 'auth',
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

// ✅ Good: Error classification system
export const classifyError = (error: any): ErrorCategory => {
  if (!error) return ErrorCategory.UNKNOWN

  const code = error.code || error.message?.toLowerCase() || ''
  
  if (code.includes('network') || code.includes('offline')) {
    return ErrorCategory.NETWORK
  }
  
  if (code.includes('auth/') || code.includes('unauthorized')) {
    return ErrorCategory.AUTH
  }
  
  if (code.includes('permission-denied') || code.includes('insufficient')) {
    return ErrorCategory.PERMISSION
  }
  
  if (code.includes('not-found') || code.includes('does-not-exist')) {
    return ErrorCategory.NOT_FOUND
  }
  
  if (code.includes('validation') || code.includes('invalid')) {
    return ErrorCategory.VALIDATION
  }
  
  if (code.includes('internal') || code.includes('server')) {
    return ErrorCategory.SERVER
  }
  
  return ErrorCategory.UNKNOWN
}

// ✅ Good: User-friendly error messages
export const getErrorMessage = (error: any, context?: string): string => {
  const category = classifyError(error)
  
  const messages: Record<ErrorCategory, string> = {
    [ErrorCategory.NETWORK]: 'Network connection error. Please check your internet connection.',
    [ErrorCategory.AUTH]: 'Authentication required. Please sign in again.',
    [ErrorCategory.PERMISSION]: 'You do not have permission to perform this action.',
    [ErrorCategory.VALIDATION]: 'Invalid input data. Please check your information.',
    [ErrorCategory.NOT_FOUND]: context ? `${context} not found.` : 'Resource not found.',
    [ErrorCategory.SERVER]: 'Server error. Please try again later.',
    [ErrorCategory.UNKNOWN]: 'An unexpected error occurred. Please try again.',
  }
  
  return messages[category] || error.message || messages[ErrorCategory.UNKNOWN]
}

// ✅ Good: Enhanced query hook with comprehensive error handling
export function useServerOptimizedQuery<T>({
  queryKey,
  queryFn,
  onError,
  ...options
}: UseQueryOptions<T> & {
  onError?: (error: FirebaseServiceError) => void
}) {
  return useQuery({
    queryKey,
    queryFn,
    retry: (failureCount, error: any) => {
      const category = classifyError(error)
      
      // Don't retry certain error types
      const noRetryCategories = [
        ErrorCategory.AUTH,
        ErrorCategory.PERMISSION,
        ErrorCategory.NOT_FOUND,
        ErrorCategory.VALIDATION
      ]
      
      if (noRetryCategories.includes(category)) {
        return false
      }
      
      // Retry network and server errors up to 2 times
      if (category === ErrorCategory.NETWORK || category === ErrorCategory.SERVER) {
        return failureCount < 2
      }
      
      return false
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff for retries
      return Math.min(1000 * Math.pow(2, attemptIndex), 10000)
    },
    onError: (error: any) => {
      console.error('Query error:', {
        queryKey,
        error: error.message,
        code: error.code,
        category: classifyError(error),
        timestamp: new Date().toISOString(),
      })
      
      // Don't show toast for certain error types that are handled by UI
      const category = classifyError(error)
      const silentCategories = [ErrorCategory.NOT_FOUND]
      
      if (!silentCategories.includes(category)) {
        const message = getErrorMessage(error)
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        })
      }
      
      // Call custom error handler
      onError?.(error)
    },
    ...options,
  })
}

// ✅ Good: Enhanced mutation hook with error handling
export function useServerOptimizedMutation<TData, TVariables>({
  mutationFn,
  onError,
  onSuccess,
  optimisticUpdate,
  invalidateQueries = [],
  ...options
}: UseMutationOptions<TData, Error, TVariables> & {
  optimisticUpdate?: {
    queryKey: any[]
    updater: (oldData: any, variables: TVariables) => any
  }
  invalidateQueries?: any[][]
}) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      if (!optimisticUpdate) return {}
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: optimisticUpdate.queryKey })
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData(optimisticUpdate.queryKey)
      
      // Optimistically update
      queryClient.setQueryData(
        optimisticUpdate.queryKey,
        (old: any) => optimisticUpdate.updater(old, variables)
      )
      
      return { previousData }
    },
    onError: (error, variables, context) => {
      console.error('Mutation error:', {
        error: error.message,
        code: (error as any).code,
        category: classifyError(error),
        variables,
        timestamp: new Date().toISOString(),
      })
      
      // Rollback optimistic update
      if (optimisticUpdate && context?.previousData !== undefined) {
        queryClient.setQueryData(optimisticUpdate.queryKey, context.previousData)
      }
      
      // Show user-friendly error message
      const message = getErrorMessage(error)
      toast({
        title: 'Operation Failed',
        description: message,
        variant: 'destructive',
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Retry option for certain error types
              const category = classifyError(error)
              if (category === ErrorCategory.NETWORK || category === ErrorCategory.SERVER) {
                // Could trigger retry here
              }
            }}
          >
            Retry
          </Button>
        ),
      })
      
      // Call custom error handler
      onError?.(error, variables, context)
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey })
      })
      
      // Call custom success handler
      onSuccess?.(data, variables, context)
    },
    onSettled: (data, error, variables, context) => {
      if (optimisticUpdate) {
        // Always refetch after mutation settles
        queryClient.invalidateQueries({ queryKey: optimisticUpdate.queryKey })
      }
    },
    ...options,
  })
}

// ✅ Good: Global error boundary component
export function QueryErrorBoundary({ 
  children,
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        const category = classifyError(error)
        
        if (fallback) {
          return <fallback error={error} retry={resetErrorBoundary} />
        }
        
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4">
              {category === ErrorCategory.NETWORK && <WifiOff className="h-12 w-12 text-muted-foreground" />}
              {category === ErrorCategory.AUTH && <Shield className="h-12 w-12 text-muted-foreground" />}
              {category === ErrorCategory.PERMISSION && <Lock className="h-12 w-12 text-muted-foreground" />}
              {![ErrorCategory.NETWORK, ErrorCategory.AUTH, ErrorCategory.PERMISSION].includes(category) && (
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Something went wrong
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {getErrorMessage(error)}
            </p>
            <div className="flex gap-2">
              <Button onClick={resetErrorBoundary} variant="outline">
                Try again
              </Button>
              {category === ErrorCategory.AUTH && (
                <Button onClick={() => {
                  // Redirect to login
                  window.location.href = '/login'
                }}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
```

---

## 6. Performance Optimization Example

### Advanced Performance Optimization Strategies

```typescript
// hooks/core/usePerformanceOptimizedQuery.ts - Performance-focused query management
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useCallback, useRef, useEffect } from 'react'
import { useIntersectionObserver } from '@/hooks/ui/useIntersectionObserver'
import { useDebounce } from '@/hooks/core/useDebounce'

// ✅ Good: Debounced search with performance optimization
export const useOptimizedSearch = <T>(
  searchFn: (query: string) => Promise<T[]>,
  options: {
    queryKey: (query: string) => any[]
    debounceMs?: number
    minQueryLength?: number
    staleTime?: number
  }
) => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, options.debounceMs || 300)
  
  const query = useQuery({
    queryKey: options.queryKey(debouncedQuery),
    queryFn: () => searchFn(debouncedQuery),
    enabled: debouncedQuery.length >= (options.minQueryLength || 2),
    staleTime: options.staleTime || 5 * 60 * 1000,
    keepPreviousData: true, // Keep previous results while loading new ones
  })
  
  return {
    searchQuery,
    setSearchQuery,
    results: query.data || [],
    isSearching: query.isFetching,
    error: query.error,
  }
}

// ✅ Good: Virtual scrolling hook for large lists
export const useVirtualizedList = <T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleRange = useMemo(() => {
    const containerItemCount = Math.ceil(containerHeight / itemHeight)
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      startIndex + containerItemCount + 2 * overscan
    )
    
    return { startIndex, endIndex }
  }, [scrollTop, containerHeight, itemHeight, overscan, items.length])
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index,
    }))
  }, [items, visibleRange])
  
  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
  }
}

// ✅ Good: Prefetch on hover for better perceived performance
export const usePrefetchOnHover = () => {
  const queryClient = useQueryClient()
  const prefetchTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())
  
  const prefetchOnHover = useCallback((
    queryKey: any[],
    queryFn: () => Promise<any>,
    delay: number = 200
  ) => {
    const key = JSON.stringify(queryKey)
    
    // Clear existing timeout
    const existingTimeout = prefetchTimeouts.current.get(key)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000,
      })
      prefetchTimeouts.current.delete(key)
    }, delay)
    
    prefetchTimeouts.current.set(key, timeout)
  }, [queryClient])
  
  const cancelPrefetch = useCallback((queryKey: any[]) => {
    const key = JSON.stringify(queryKey)
    const timeout = prefetchTimeouts.current.get(key)
    if (timeout) {
      clearTimeout(timeout)
      prefetchTimeouts.current.delete(key)
    }
  }, [])
  
  useEffect(() => {
    return () => {
      // Cleanup all timeouts on unmount
      prefetchTimeouts.current.forEach(timeout => clearTimeout(timeout))
      prefetchTimeouts.current.clear()
    }
  }, [])
  
  return { prefetchOnHover, cancelPrefetch }
}

// ✅ Good: Lazy loading with intersection observer
export const useLazyLoad = <T>(
  loadFn: () => Promise<T>,
  options: {
    rootMargin?: string
    threshold?: number
    enabled?: boolean
  } = {}
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const hasLoaded = useRef(false)
  
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: options.rootMargin || '100px',
    threshold: options.threshold || 0.1,
  })
  
  useEffect(() => {
    if (
      isIntersecting && 
      !hasLoaded.current && 
      (options.enabled ?? true)
    ) {
      hasLoaded.current = true
      setLoading(true)
      setError(null)
      
      loadFn()
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false))
    }
  }, [isIntersecting, loadFn, options.enabled])
  
  return {
    ref,
    data,
    loading,
    error,
    hasLoaded: hasLoaded.current,
  }
}

// ✅ Good: Component-level performance optimization
export const OptimizedCursoCard = React.memo(({ 
  curso, 
  onEdit, 
  onDelete, 
  onView 
}: CursoCardProps) => {
  const { prefetchOnHover } = usePrefetchOnHover()
  
  // Memoize event handlers to prevent unnecessary re-renders
  const handleEdit = useCallback(() => {
    onEdit?.(curso.id)
  }, [onEdit, curso.id])
  
  const handleDelete = useCallback(() => {
    onDelete?.(curso.id)
  }, [onDelete, curso.id])
  
  const handleView = useCallback(() => {
    onView?.(curso.id)
  }, [onView, curso.id])
  
  // Prefetch course details on hover
  const handleMouseEnter = useCallback(() => {
    prefetchOnHover(
      queryKeys.curso(curso.id),
      () => getCursoById(curso.id)
    )
  }, [prefetchOnHover, curso.id])
  
  return (
    <Card 
      className="transition-all duration-200 hover:shadow-lg cursor-pointer"
      onMouseEnter={handleMouseEnter}
    >
      {/* Card content */}
    </Card>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for performance
  return (
    prevProps.curso.id === nextProps.curso.id &&
    prevProps.curso.titulo === nextProps.curso.titulo &&
    prevProps.curso.published === nextProps.curso.published &&
    prevProps.curso.fechaActualizacion === nextProps.curso.fechaActualizacion
  )
})

// ✅ Good: Batch operations for better performance
export const useBatchOperations = <T>() => {
  const [batch, setBatch] = useState<Array<() => Promise<T>>>([])
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  const addToBatch = useCallback((operation: () => Promise<T>) => {
    setBatch(prev => [...prev, operation])
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Execute batch after delay
    timeoutRef.current = setTimeout(async () => {
      if (batch.length > 0) {
        try {
          await Promise.allSettled(batch.map(op => op()))
        } catch (error) {
          console.error('Batch operation failed:', error)
        } finally {
          setBatch([])
        }
      }
    }, 100) // 100ms batch window
  }, [batch])
  
  const executeBatch = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    if (batch.length > 0) {
      const results = await Promise.allSettled(batch.map(op => op()))
      setBatch([])
      return results
    }
    
    return []
  }, [batch])
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return {
    addToBatch,
    executeBatch,
    batchSize: batch.length,
  }
}
```

---

## Summary

These practical examples demonstrate how the development guidelines are applied in real-world scenarios within the CRM system:

### Key Takeaways

1. **Consistency**: All examples follow the same patterns for API integration, hook usage, and component structure
2. **Performance**: Each example includes performance optimizations specific to its use case
3. **Error Handling**: Comprehensive error handling with user-friendly messages and recovery options
4. **TypeScript**: Strict typing with centralized type definitions and proper validation
5. **User Experience**: Focus on loading states, optimistic updates, and responsive design
6. **Maintainability**: Clear code organization with proper separation of concerns

### Next Steps

1. **Review Existing Code**: Compare existing implementations against these examples
2. **Refactor Gradually**: Improve existing components using these patterns
3. **Create New Features**: Use these examples as templates for new functionality
4. **Team Training**: Share these examples with the development team
5. **Continuous Improvement**: Update examples as the system evolves

These examples provide a solid foundation for maintaining consistency and quality across the entire CRM system development process.