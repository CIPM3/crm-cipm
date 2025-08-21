'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/useAuthStore'
import { getUserById } from '@/api/Usuarios/getById'
import type { UsersType } from '@/types'

type AuthUser = UsersType & { rol?: string }

interface AuthContextType {
  user: AuthUser | null
  firebaseUser: User | null
  loading: boolean
  initialized: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  initialized: false
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const { user: storeUser, setUser, clearUser } = useAuthStore()

  useEffect(() => {
    let mounted = true

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!mounted) return

        try {
          setFirebaseUser(firebaseUser)
          
          if (firebaseUser) {
            // Fetch user data from Firestore
            try {
              const userData = await getUserById(firebaseUser.uid)
              if (mounted) {
                if (userData) {
                  setUser(userData)
                } else {
                  const fallbackUser: UsersType = {
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || '',
                    email: firebaseUser.email || '',
                    role: 'cliente',
                    avatar: firebaseUser.photoURL || '',
                    createdAt: new Date().toISOString(),
                  }
                  setUser(fallbackUser)
                }
              }
            } catch (error) {
              console.error('Error fetching user data:', error)
              // Fallback to Firebase user data
              const fallbackUser: UsersType = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || '',
                email: firebaseUser.email || '',
                role: 'cliente',
                avatar: firebaseUser.photoURL || '',
                createdAt: new Date().toISOString(),
              }
              if (mounted) {
                setUser(fallbackUser)
              }
            }
          } else {
            if (mounted) {
              clearUser()
            }
          }
        } catch (error) {
          console.error('Auth state change error:', error)
          if (mounted) {
            clearUser()
          }
        } finally {
          if (mounted) {
            setLoading(false)
            setInitialized(true)
          }
        }
      },
      (error) => {
        console.error('Firebase auth error:', error)
        if (mounted) {
          setLoading(false)
          setInitialized(true)
          clearUser()
        }
      }
    )

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [setUser, clearUser])

  // Mirror auth store into a cookie readable by middleware/SSR
  useEffect(() => {
    try {
      if (storeUser) {
        // Normaliza el rol para SSR/middleware
        const originalRole = (storeUser as any).role ?? (storeUser as any).rol ?? 'cliente'
        const normalized: UsersType & { rol?: string } = {
          ...storeUser,
          role: originalRole,
        }
        
        const payload = { state: { user: normalized } }
        const value = encodeURIComponent(JSON.stringify(payload))
        const maxAge = 60 * 60 * 24 * 7 // 7 días
        const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
        document.cookie = `auth-storage=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
      } else {
        document.cookie = `auth-storage=; Path=/; Max-Age=0; SameSite=Lax`
      }
    } catch (error) {
      console.error('Error setting auth cookie:', error)
    }
  }, [storeUser])

  // Don't render children until auth is initialized and not loading
  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const value: AuthContextType = {
    user: storeUser,
    firebaseUser,
    loading,
    initialized
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}