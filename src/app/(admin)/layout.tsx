'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()

  
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace('/login')
    }
  }, [loading, isLoggedIn, router])

  if (loading || !isLoggedIn) {
    return <p className="mt-10 text-center">Checking authentication...</p>
  }

  return <>{children}</>
}
