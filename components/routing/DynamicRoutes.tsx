'use client'

import React, { Suspense, ComponentType } from 'react'
import dynamic from 'next/dynamic'
import type { UsersType } from '@/types'
import { useAuth } from '@/components/providers/AuthProvider'
import { Skeleton } from '@/components/ui/skeleton'

// Loading components for different sections
const DashboardSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
    <Skeleton className="h-64 w-full" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
)

const TableSkeleton = () => (
  <div className="space-y-4 p-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
)

const FormSkeleton = () => (
  <div className="space-y-6 p-6 max-w-2xl">
    <Skeleton className="h-8 w-64" />
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
    <div className="flex gap-4">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
)

const CalendarSkeleton = () => (
  <div className="space-y-4 p-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 42 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
)

// Dynamic component imports with role-based loading
const dynamicComponents = {
  // Admin Dashboard Components
  adminDashboard: dynamic(() => import('@/components/dashboard/admin-dashboard') as any, {
    loading: () => <DashboardSkeleton />,
    ssr: false
  }),

  // Student Management
  studentsList: dynamic(() => import('@/components/table/table-estudiantes') as any, {
    loading: () => <TableSkeleton />,
    ssr: false
  }),

  studentForm: dynamic(() => import('@/components/form/student-form') as any, {
    loading: () => <FormSkeleton />,
    ssr: false
  }),

  // Course Management
  coursesList: dynamic(() => import('@/components/table/table-cursos') as any, {
    loading: () => <TableSkeleton />,
    ssr: false
  }),

  courseForm: dynamic(() => import('@/components/form/curso-form') as any, {
    loading: () => <FormSkeleton />,
    ssr: false
  }),

  // Video Management
  videosList: dynamic(() => import('@/components/table/table-videos') as any, {
    loading: () => <TableSkeleton />,
    ssr: false
  }),

  videoForm: dynamic(() => import('@/components/video-form') as any, {
    loading: () => <FormSkeleton />,
    ssr: false
  }),

  // Calendar and Scheduling
  agendadorCalendar: dynamic(() => import('@/components/calendario/calendario-agendador') as any, {
    loading: () => <CalendarSkeleton />,
    ssr: false
  }),

  instructorCalendar: dynamic(() => import('@/components/calendario/calendario-instructor') as any, {
    loading: () => <CalendarSkeleton />,
    ssr: false
  }),

  formacionCalendar: dynamic(() => import('@/components/calendario/calendario-formacion') as any, {
    loading: () => <CalendarSkeleton />,
    ssr: false
  }),

  // Dashboard variants by role
  instructorDashboard: dynamic(() => import('@/components/dashboard/instructor-dashboard') as any, {
    loading: () => <DashboardSkeleton />,
    ssr: false
  }),

  agendadorDashboard: dynamic(() => import('@/components/dashboard/agendador-dashboard') as any, {
    loading: () => <DashboardSkeleton />,
    ssr: false
  }),

  formacionDashboard: dynamic(() => import('@/components/dashboard/formacion-dashboard') as any, {
    loading: () => <DashboardSkeleton />,
    ssr: false
  }),

  // Reports and Analytics
  reportsPage: dynamic(() => import('@/components/reports/reports-main') as any, {
    loading: () => <DashboardSkeleton />,
    ssr: false
  }),

  // Configuration
  configPage: dynamic(() => import('@/components/config/config-main') as any, {
    loading: () => <FormSkeleton />,
    ssr: false
  }),

  // Schedule Management
  scheduleManager: dynamic(() => import('@/components/schedule/schedule-manager') as any, {
    loading: () => <CalendarSkeleton />,
    ssr: false
  })
}

// Type-safe component getter
type DynamicComponentKey = keyof typeof dynamicComponents

export function getDynamicComponent(key: DynamicComponentKey): ComponentType<any> {
  return dynamicComponents[key]
}

// Role-based component resolver
interface RoleBasedComponentProps {
  role?: string
  fallback?: ComponentType<any>
  children?: React.ReactNode
}

export function RoleBasedComponent({
  role,
  fallback: Fallback,
  children
}: RoleBasedComponentProps) {
  const { user } = useAuth()

  // Check if user has required role
  if (role && (!user || (user as UsersType & { rol?: string }).role !== role)) {
    if (Fallback) {
      return <Fallback />
    }
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta sección.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Dashboard component resolver based on role
export function DynamicDashboard() {
  const { user, loading } = useAuth()

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No autenticado
          </h2>
          <p className="text-gray-600">
            Por favor, inicia sesión para acceder al dashboard.
          </p>
        </div>
      </div>
    )
  }

  // Select dashboard component based on user role
  let DashboardComponent: ComponentType<any>

  switch ((user as UsersType & { rol?: string }).role) {
    case 'admin':
      DashboardComponent = dynamicComponents.adminDashboard
      break
    case 'instructor':
      DashboardComponent = dynamicComponents.instructorDashboard
      break
    case 'agendador':
      DashboardComponent = dynamicComponents.agendadorDashboard
      break
    case 'formacion de grupo':
      DashboardComponent = dynamicComponents.formacionDashboard
      break
    default:
      DashboardComponent = dynamicComponents.adminDashboard // Fallback
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardComponent />
    </Suspense>
  )
}

// Calendar component resolver based on role and context
export function DynamicCalendar({ type }: { type?: 'agendador' | 'instructor' | 'formacion' }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <CalendarSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No autenticado
          </h2>
          <p className="text-gray-600">
            Por favor, inicia sesión para acceder al calendario.
          </p>
        </div>
      </div>
    )
  }

  // Select calendar component based on type or user role
  let CalendarComponent: ComponentType<any>

  const calendarType = type || (user as UsersType & { rol?: string }).role

  switch (calendarType) {
    case 'agendador':
      CalendarComponent = dynamicComponents.agendadorCalendar
      break
    case 'instructor':
      CalendarComponent = dynamicComponents.instructorCalendar
      break
    case 'formacion de grupo':
    case 'formacion':
      CalendarComponent = dynamicComponents.formacionCalendar
      break
    default:
      CalendarComponent = dynamicComponents.agendadorCalendar // Fallback
  }

  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarComponent />
    </Suspense>
  )
}

// Generic dynamic component wrapper with error boundary
interface DynamicComponentWrapperProps {
  componentKey: DynamicComponentKey
  fallback?: ComponentType<any>
  errorFallback?: ComponentType<{ error: Error; retry: () => void }>
  props?: any
}

export function DynamicComponentWrapper({
  componentKey,
  fallback: Fallback,
  errorFallback: ErrorFallback,
  props = {}
}: DynamicComponentWrapperProps) {
  const [error, setError] = React.useState<Error | null>(null)

  const retry = React.useCallback(() => {
    setError(null)
  }, [])

  if (error) {
    if (ErrorFallback) {
      return <ErrorFallback error={error} retry={retry} />
    }
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error al cargar componente
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message}
          </p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  const Component = dynamicComponents[componentKey]

  return (
    <Suspense fallback={Fallback ? <Fallback /> : <DashboardSkeleton />}>
      <Component {...props} />
    </Suspense>
  )
}

export default {
  getDynamicComponent,
  RoleBasedComponent,
  DynamicDashboard,
  DynamicCalendar,
  DynamicComponentWrapper
}