# State Management Architecture

## Multi-Layer State Management Strategy

The CRM system implements a sophisticated multi-layer state management approach that separates concerns across different types of application state, ensuring optimal performance, maintainability, and developer experience.

## State Architecture Overview

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
├─────────────────────────────────────────┤
│  • React Components                     │
│  • Form State (React Hook Form)         │
│  • Local UI State (useState)            │
└─────────────────────────────────────────┘
                     │
┌─────────────────────────────────────────┐
│          CLIENT STATE LAYER             │
├─────────────────────────────────────────┤
│  • Authentication State (Zustand)       │
│  • User Preferences (Zustand)           │
│  • UI State (Zustand)                   │
│  • Navigation State (Next.js Router)    │
└─────────────────────────────────────────┘
                     │
┌─────────────────────────────────────────┐
│          SERVER STATE LAYER             │
├─────────────────────────────────────────┤
│  • API Data (TanStack Query)            │
│  • Cache Management (TanStack Query)    │
│  • Optimistic Updates                   │
│  • Background Sync                      │
└─────────────────────────────────────────┘
                     │
┌─────────────────────────────────────────┐
│           DATA SOURCE LAYER             │
├─────────────────────────────────────────┤
│  • Firebase Firestore                   │
│  • Firebase Authentication              │
│  • Local Storage                        │
│  • Session Storage                      │
└─────────────────────────────────────────┘
```

## Layer 1: Presentation State

### Local Component State
**Purpose**: UI-specific state that doesn't need to be shared
**Technology**: React useState, useReducer
**Use Cases**: Form inputs, toggle states, temporary UI state

```typescript
// Example: Component-level state
const CourseCard = ({ course }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Card 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Component content */}
    </Card>
  )
}
```

### Form State
**Purpose**: Complex form handling with validation
**Technology**: React Hook Form + Zod/Yup
**Features**: Validation, field-level control, performance optimization

```typescript
// Example: Form state management
const CourseForm = () => {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    }
  })
  
  const onSubmit = (data: CourseFormData) => {
    createCourseMutation.mutate(data)
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

## Layer 2: Client State

### Enhanced Authentication Store
```typescript
// store/auth/useAuthStore.ts
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  role: UserRole | null
  permissions: string[]
  sessionExpiry: Date | null
  
  // Actions
  setUser: (user: User) => void
  clearUser: () => void
  updatePermissions: (permissions: string[]) => void
  refreshSession: () => void
  checkSessionValidity: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      role: null,
      permissions: [],
      sessionExpiry: null,
      
      setUser: (user) => set({
        user,
        isAuthenticated: true,
        role: user.role,
        permissions: getRolePermissions(user.role),
        sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }),
      
      clearUser: () => set({
        user: null,
        isAuthenticated: false,
        role: null,
        permissions: [],
        sessionExpiry: null
      }),
      
      updatePermissions: (permissions) => set({ permissions }),
      
      refreshSession: () => set({
        sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }),
      
      checkSessionValidity: () => {
        const { sessionExpiry } = get()
        return sessionExpiry ? new Date() < sessionExpiry : false
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        sessionExpiry: state.sessionExpiry
      })
    }
  )
)
```

### UI State Store
```typescript
// store/ui/useUIStore.ts
interface UIState {
  // Layout state
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  
  // Navigation state
  breadcrumbs: BreadcrumbItem[]
  activeRoute: string
  
  // Modal state
  activeModal: string | null
  modalData: any
  
  // Notification state
  notifications: Notification[]
  
  // Loading states
  globalLoading: boolean
  loadingStates: Record<string, boolean>
  
  // Actions
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  openModal: (modalId: string, data?: any) => void
  closeModal: () => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  setLoading: (key: string, loading: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      theme: 'system',
      breadcrumbs: [],
      activeRoute: '',
      activeModal: null,
      modalData: null,
      notifications: [],
      globalLoading: false,
      loadingStates: {},
      
      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
      })),
      
      setTheme: (theme) => set({ theme }),
      
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
      
      openModal: (modalId, data) => set({
        activeModal: modalId,
        modalData: data
      }),
      
      closeModal: () => set({
        activeModal: null,
        modalData: null
      }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, notification]
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      setLoading: (key, loading) => set((state) => ({
        loadingStates: {
          ...state.loadingStates,
          [key]: loading
        },
        globalLoading: Object.values({
          ...state.loadingStates,
          [key]: loading
        }).some(Boolean)
      }))
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme
      })
    }
  )
)
```

### Feature-Specific Stores
```typescript
// store/course/useCourseStore.ts
interface CourseState {
  // Current course context
  currentCourse: Course | null
  currentModule: Module | null
  playbackPosition: number
  
  // User progress
  completedModules: string[]
  bookmarks: Bookmark[]
  notes: Note[]
  
  // Settings
  playbackSpeed: number
  autoplay: boolean
  
  // Actions
  setCurrentCourse: (course: Course) => void
  setCurrentModule: (module: Module) => void
  updateProgress: (moduleId: string, position: number) => void
  toggleBookmark: (position: number, note?: string) => void
  addNote: (note: Note) => void
}

export const useCourseStore = create<CourseState>((set, get) => ({
  // State implementation
}))
```

## Layer 3: Server State

### Enhanced TanStack Query Configuration
```typescript
// lib/queryClient.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time configuration
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      
      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error?.code === 'auth/unauthorized') return false
        if (error?.code === 'auth/permission-denied') return false
        
        // Retry up to 2 times for other errors
        return failureCount < 2
      },
      
      // Network configuration
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    
    mutations: {
      // Global mutation configuration
      retry: 1,
      onError: (error) => {
        // Global error handling
        console.error('Mutation error:', error)
        toast.error('An error occurred. Please try again.')
      }
    }
  }
})

// Query key factory with hierarchical invalidation
export const queryKeys = {
  // Users
  users: ['users'] as const,
  user: (id: string) => [...queryKeys.users, id] as const,
  userProfile: (id: string) => [...queryKeys.user(id), 'profile'] as const,
  
  // Courses
  courses: ['courses'] as const,
  course: (id: string) => [...queryKeys.courses, id] as const,
  courseModules: (courseId: string) => [...queryKeys.course(courseId), 'modules'] as const,
  courseStudents: (courseId: string) => [...queryKeys.course(courseId), 'students'] as const,
  
  // Progress
  progress: ['progress'] as const,
  userProgress: (userId: string) => [...queryKeys.progress, 'user', userId] as const,
  courseProgress: (userId: string, courseId: string) => 
    [...queryKeys.userProgress(userId), 'course', courseId] as const,
}
```

### Advanced Cache Management
```typescript
// hooks/cache/useCacheManager.ts
export const useCacheManager = () => {
  const queryClient = useQueryClient()
  
  const invalidateUserData = (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.userProgress(userId) })
  }
  
  const invalidateCourseData = (courseId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.course(courseId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.courseModules(courseId) })
  }
  
  const prefetchCourseData = async (courseId: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.course(courseId),
      queryFn: () => getCourseById(courseId)
    })
    
    await queryClient.prefetchQuery({
      queryKey: queryKeys.courseModules(courseId),
      queryFn: () => getCourseModules(courseId)
    })
  }
  
  const optimisticUpdate = <T>(
    queryKey: QueryKey,
    updater: (oldData: T) => T
  ) => {
    queryClient.setQueryData(queryKey, updater)
  }
  
  return {
    invalidateUserData,
    invalidateCourseData,
    prefetchCourseData,
    optimisticUpdate
  }
}
```

### Optimistic Updates Pattern
```typescript
// hooks/mutations/useOptimisticCourse.ts
export const useOptimisticCourseUpdate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateCourse,
    
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.course(variables.id) })
      
      // Snapshot the previous value
      const previousCourse = queryClient.getQueryData(queryKeys.course(variables.id))
      
      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.course(variables.id),
        (old: Course) => ({ ...old, ...variables.data })
      )
      
      return { previousCourse }
    },
    
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousCourse) {
        queryClient.setQueryData(
          queryKeys.course(variables.id),
          context.previousCourse
        )
      }
    },
    
    onSettled: (data, error, variables) => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.course(variables.id) })
    }
  })
}
```

## Layer 4: Persistence

### Storage Strategy
```typescript
// lib/storage/storageManager.ts
class StorageManager {
  // Encrypted storage for sensitive data
  setSecure(key: string, value: any) {
    const encrypted = encrypt(JSON.stringify(value))
    localStorage.setItem(`secure_${key}`, encrypted)
  }
  
  getSecure<T>(key: string): T | null {
    const encrypted = localStorage.getItem(`secure_${key}`)
    if (!encrypted) return null
    
    try {
      const decrypted = decrypt(encrypted)
      return JSON.parse(decrypted)
    } catch {
      return null
    }
  }
  
  // Session-only storage
  setSession(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value))
  }
  
  getSession<T>(key: string): T | null {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }
  
  // Persistent storage with expiration
  setPersistent(key: string, value: any, expirationHours = 24) {
    const item = {
      value,
      expiry: Date.now() + (expirationHours * 60 * 60 * 1000)
    }
    localStorage.setItem(key, JSON.stringify(item))
  }
  
  getPersistent<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    if (!item) return null
    
    const parsed = JSON.parse(item)
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(key)
      return null
    }
    
    return parsed.value
  }
}

export const storageManager = new StorageManager()
```

## State Synchronization

### Real-time Updates with Firebase
```typescript
// hooks/realtime/useRealtimeSync.ts
export const useRealtimeSync = () => {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    // Subscribe to user data changes
    const unsubscribeUser = onSnapshot(
      doc(db, COLLECTIONS.USERS, userId),
      (doc) => {
        if (doc.exists()) {
          queryClient.setQueryData(
            queryKeys.user(userId),
            { id: doc.id, ...doc.data() }
          )
        }
      }
    )
    
    // Subscribe to course changes
    const unsubscribeCourses = onSnapshot(
      collection(db, COLLECTIONS.COURSES),
      (snapshot) => {
        const courses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        queryClient.setQueryData(queryKeys.courses, courses)
      }
    )
    
    return () => {
      unsubscribeUser()
      unsubscribeCourses()
    }
  }, [userId, queryClient])
}
```

## Performance Optimizations

### Selective Hydration
```typescript
// components/providers/StateProvider.tsx
export const StateProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <AuthStoreProvider>
          <UIStoreProvider>
            <RealtimeSyncProvider>
              {children}
            </RealtimeSyncProvider>
          </UIStoreProvider>
        </AuthStoreProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}
```

### Memory Management
```typescript
// hooks/performance/useMemoryManager.ts
export const useMemoryManager = () => {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Clear expired cache entries
      queryClient.getQueryCache().clear()
      
      // Clear unused store data
      Object.values(stores).forEach(store => {
        if (store.cleanup) {
          store.cleanup()
        }
      })
    }, 5 * 60 * 1000) // Every 5 minutes
    
    return () => clearInterval(interval)
  }, [])
}
```

This comprehensive state management architecture provides:

- **Clear Separation**: Each layer handles specific concerns
- **Performance**: Optimized caching and selective updates
- **Scalability**: Modular stores that can grow with the application
- **Developer Experience**: Consistent patterns and excellent TypeScript support
- **Reliability**: Error handling, retry logic, and fallback strategies
- **Real-time**: Firebase integration for live updates
- **Security**: Encrypted storage for sensitive data