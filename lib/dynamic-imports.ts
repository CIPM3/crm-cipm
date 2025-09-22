import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

// Lazy load heavy UI components with loading states
export const LazyMotion = dynamic(
  () => import('framer-motion').then((mod) => mod.motion as any),
  { ssr: false }
)

export const LazyAnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => mod.AnimatePresence as any),
  { ssr: false }
)

// Lazy load Firebase components for client-side only
export const LazyFirebaseAuth = dynamic(
  () => import('@/components/providers/AuthProvider'),
  { ssr: false }
)

// Lazy load chart components
export const LazyRecharts = {
  LineChart: dynamic(() => import('recharts').then((mod) => mod.LineChart as any), { ssr: false }),
  BarChart: dynamic(() => import('recharts').then((mod) => mod.BarChart as any), { ssr: false }),
  PieChart: dynamic(() => import('recharts').then((mod) => mod.PieChart as any), { ssr: false }),
  AreaChart: dynamic(() => import('recharts').then((mod) => mod.AreaChart as any), { ssr: false }),
  ResponsiveContainer: dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer as any), { ssr: false }),
}

// Lazy load form libraries
export const LazyFormik = dynamic(
  () => import('formik').then((mod) => mod.Formik as any),
  { ssr: false }
)

// Lazy load GSAP animations
export const LazyGSAP = dynamic(
  () => import('gsap').then((mod) => mod.gsap as any),
  { ssr: false, loading: () => null }
)

// Helper function to create lazy loaded components with custom loading
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T } | T>,
  options?: {
    ssr?: boolean
    loading?: ComponentType
  }
) {
  return dynamic(importFunc, {
    ssr: options?.ssr ?? false,
    loading: options?.loading
  })
}