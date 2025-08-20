'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/AuthProvider'
import {
  Users,
  BookOpen,
  Calendar,
  Video,
  BarChart3,
  Settings,
  GraduationCap,
  ClipboardList,
  UserCheck,
  Home,
  FileText,
  Clock,
  Award
} from 'lucide-react'

// Navigation item type
interface NavigationItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  badge?: string | number
  children?: NavigationItem[]
  requiredRoles?: string[]
  exactMatch?: boolean
}

// Base navigation structure
const navigationConfig: NavigationItem[] = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: Home,
    description: 'Vista general del sistema',
    requiredRoles: ['develop', 'admin', 'instructor', 'agendador', 'formacion de grupo'],
    exactMatch: true
  },
  {
    href: '/admin/estudiantes',
    label: 'Estudiantes',
    icon: Users,
    description: 'Gestión de estudiantes',
    requiredRoles: ['develop', 'admin', 'instructor', 'agendador', 'formacion de grupo'],
    children: [
      {
        href: '/admin/estudiantes',
        label: 'Lista de Estudiantes',
        icon: Users,
        requiredRoles: ['develop', 'admin', 'instructor', 'agendador', 'formacion de grupo']
      },
      {
        href: '/admin/estudiantes/nuevo',
        label: 'Nuevo Estudiante',
        icon: UserCheck,
        requiredRoles: ['develop', 'admin', 'agendador', 'formacion de grupo']
      }
    ]
  },
  {
    href: '/admin/cursos',
    label: 'Cursos',
    icon: BookOpen,
    description: 'Gestión de cursos y contenido',
    requiredRoles: ['develop', 'admin', 'instructor'],
    children: [
      {
        href: '/admin/cursos',
        label: 'Lista de Cursos',
        icon: BookOpen,
        requiredRoles: ['develop', 'admin', 'instructor']
      },
      {
        href: '/admin/cursos/nuevo',
        label: 'Nuevo Curso',
        icon: GraduationCap,
        requiredRoles: ['develop', 'admin']
      }
    ]
  },
  {
    href: '/admin/videos',
    label: 'Videos',
    icon: Video,
    description: 'Biblioteca de videos',
    requiredRoles: ['develop', 'admin', 'instructor'],
    children: [
      {
        href: '/admin/videos',
        label: 'Lista de Videos',
        icon: Video,
        requiredRoles: ['develop', 'admin', 'instructor']
      },
      {
        href: '/admin/videos/nuevo',
        label: 'Subir Video',
        icon: Video,
        requiredRoles: ['develop', 'admin']
      }
    ]
  },
  {
    href: '/admin/clases',
    label: 'Clases',
    icon: Calendar,
    description: 'Gestión de clases y horarios',
    requiredRoles: ['develop', 'admin', 'instructor', 'agendador', 'formacion de grupo'],
    children: [
      {
        href: '/admin/clases/prueba',
        label: 'Clases de Prueba',
        icon: ClipboardList,
        requiredRoles: ['develop', 'admin', 'instructor', 'agendador', 'formacion de grupo'],
        children: [
          {
            href: '/admin/clases/prueba/agendador',
            label: 'Agendador',
            icon: Clock,
            requiredRoles: ['develop', 'admin', 'agendador']
          },
          {
            href: '/admin/clases/prueba/instructor',
            label: 'Instructor',
            icon: UserCheck,
            requiredRoles: ['develop', 'admin', 'instructor']
          },
          {
            href: '/admin/clases/prueba/formacion',
            label: 'Formación',
            icon: Award,
            requiredRoles: ['develop', 'admin', 'formacion de grupo']
          }
        ]
      }
    ]
  },
  {
    href: '/admin/reportes',
    label: 'Reportes',
    icon: BarChart3,
    description: 'Análisis y reportes',
    requiredRoles: ['develop', 'admin'],
    exactMatch: true
  },
  {
    href: '/admin/configuracion',
    label: 'Configuración',
    icon: Settings,
    description: 'Configuración del sistema',
    requiredRoles: ['develop', 'admin'],
    exactMatch: true
  }
]

// Hook to filter navigation based on user role
function useFilteredNavigation(userRole?: string) {
  return useMemo(() => {
    if (!userRole) return []

    const filterItems = (items: NavigationItem[]): NavigationItem[] => {
      return items.filter(item => {
        if (!item.requiredRoles || item.requiredRoles.includes(userRole)) {
          if (item.children) {
            const filteredChildren = filterItems(item.children)
            return { ...item, children: filteredChildren.length > 0 ? filteredChildren : undefined }
          }
          return true
        }
        return false
      }).map(item => {
        if (item.children) {
          const filteredChildren = filterItems(item.children)
          return { ...item, children: filteredChildren.length > 0 ? filteredChildren : undefined }
        }
        return item
      })
    }

    return filterItems(navigationConfig)
  }, [userRole])
}

// Navigation item component
interface NavigationItemProps {
  item: NavigationItem
  level?: number
  isActive?: boolean
  isExpanded?: boolean
  onToggle?: () => void
}

function NavigationItemComponent({
  item,
  level = 0,
  isActive = false,
  isExpanded = false,
  onToggle
}: NavigationItemProps) {
  const pathname = usePathname() || '/'
  const hasChildren = item.children && item.children.length > 0
  
  // Check if current path matches this item or its children
  const isCurrentActive = useMemo(() => {
    if (item.exactMatch) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }, [pathname, item.href, item.exactMatch])

  // Check if any child is active
  const hasActiveChild = useMemo(() => {
    if (!item.children) return false
    return item.children.some(child => 
      child.exactMatch 
        ? pathname === child.href 
        : pathname.startsWith(child.href)
    )
  }, [pathname, item.children])

  const ItemIcon = item.icon
  const paddingLeft = level * 16 + 16

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={onToggle}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            'hover:bg-gray-100 hover:text-gray-900',
            (isCurrentActive || hasActiveChild) && 'bg-gray-100 text-gray-900',
            'focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
          style={{ paddingLeft }}
          aria-expanded={isExpanded}
        >
          <div className="flex items-center space-x-3">
            <ItemIcon className="h-5 w-5 flex-shrink-0" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {item.badge}
              </span>
            )}
          </div>
          <svg
            className={cn(
              'h-4 w-4 transition-transform',
              isExpanded ? 'rotate-90' : 'rotate-0'
            )}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isExpanded && (
          <div className="space-y-1">
            {item.children?.map((child) => (
              <NavigationItemComponent
                key={child.href}
                item={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href as any}
      className={cn(
        'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
        'hover:bg-gray-100 hover:text-gray-900',
        isCurrentActive && 'bg-gray-100 text-gray-900',
        'focus:outline-none focus:ring-2 focus:ring-blue-500'
      )}
      style={{ paddingLeft }}
    >
      <ItemIcon className="h-5 w-5 flex-shrink-0 mr-3" />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

// Main navigation component
export default function RoleBasedNavigation() {
  const { user } = useAuth()
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())
  
  const filteredNavigation = useFilteredNavigation((user as any)?.role)

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(href)) {
        newSet.delete(href)
      } else {
        newSet.add(href)
      }
      return newSet
    })
  }

  // Auto-expand parent items if child is active
  React.useEffect(() => {
    const pathname = window.location.pathname
    const shouldExpand = new Set<string>()

    const checkAndExpand = (items: NavigationItem[]) => {
      items.forEach(item => {
        if (item.children) {
          const hasActiveChild = item.children.some(child => 
            child.exactMatch 
              ? pathname === child.href 
              : pathname.startsWith(child.href)
          )
          if (hasActiveChild) {
            shouldExpand.add(item.href)
          }
          checkAndExpand(item.children)
        }
      })
    }

    checkAndExpand(filteredNavigation)
    setExpandedItems(shouldExpand)
  }, [filteredNavigation])

  if (!user) {
    return (
      <nav className="px-4 py-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </nav>
    )
  }

  return (
    <nav className="px-4 py-6 space-y-2" role="navigation" aria-label="Main navigation">
      <div className="mb-4">
        <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Panel de Control
        </h2>
        <p className="px-3 text-xs text-gray-400 mt-1">
          Rol: {(user as any).role}
        </p>
      </div>

      {filteredNavigation.map((item) => (
        <NavigationItemComponent
          key={item.href}
          item={item}
          isExpanded={expandedItems.has(item.href)}
          onToggle={() => toggleExpanded(item.href)}
        />
      ))}

      {filteredNavigation.length === 0 && (
        <div className="px-3 py-8 text-center">
          <p className="text-sm text-gray-500">
            No hay opciones de navegación disponibles para tu rol.
          </p>
        </div>
      )}
    </nav>
  )
}