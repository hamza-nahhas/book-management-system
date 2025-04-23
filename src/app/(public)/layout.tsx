'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/dashboard')
    }
  }, [isLoggedIn])

  if (loading || isLoggedIn) {
    return <p className="mt-10 text-center">Checking authentication...</p>
  }

  return <>{children}</>
}
