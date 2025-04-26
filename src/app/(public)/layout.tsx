'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.replace('/dashboard')
    }
  }, [isLoggedIn, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    )
  }

  if (isLoggedIn) {
    return null
  }

  return (
    <div className="flex h-full min-h-screen w-full flex-col">
      {children}
    </div>
  )
}
