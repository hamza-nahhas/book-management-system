'use client'

import { auth } from '@/firebase/firebase'
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: User | null
  loading: boolean
  authenticating: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) 
  const [authenticating, setAuthenticating] = useState(false) 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setAuthenticating(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      handleAuthError(error, 'login')
    } finally {
      setAuthenticating(false)
    }
  }

  const logout = async () => {
    setAuthenticating(true)
    try {
      await signOut(auth)
    } catch (error: any) {
      handleAuthError(error, 'logout')
    } finally {
      setAuthenticating(false)
    }
  }

  const handleAuthError = (error: any, action: 'login' | 'logout') => {
    const message =
      error.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : action === 'login'
          ? 'Failed to login. Please try again.'
          : 'Failed to logout. Please try again.'

    console.error(`${action} error:`, error)
    throw new Error(message)
  }

  const isLoggedIn = !!user

  return (
    <AuthContext.Provider value={{ user, loading, authenticating, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
