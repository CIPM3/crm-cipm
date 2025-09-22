"use client"

import dynamic from 'next/dynamic'
import type { HTMLMotionProps, MotionProps } from 'framer-motion'
import { ReactElement } from 'react'

// Lazy load framer-motion only on client side
const Motion = dynamic(
  () => import('framer-motion').then(mod => mod.motion),
  { 
    ssr: false,
    loading: () => <div /> // Return empty div during loading
  }
) as any

// Type-safe motion wrapper
export function OptimizedMotion(props: MotionProps & { children: ReactElement }) {
  return <Motion {...props} />
}

export default OptimizedMotion