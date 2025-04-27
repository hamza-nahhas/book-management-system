'use client'

import { useAuth } from '@/hooks/useAuth'
import { Home, LayoutDashboard, LogIn } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

export default function MainNavbar() {
  const { isLoggedIn, loading } = useAuth()
  const pathname = usePathname()

  if (pathname === '/dashboard') {
    return null
  }

  return (
    <nav className="fixed top-0 z-30 w-full bg-white shadow-md">
      {loading || (isLoggedIn && pathname === '/login') ? null : (
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <div className="flex items-center">
            <h1 className="ms-2 text-2xl font-bold">Book Management System</h1>
          </div>

          {isLoggedIn ? (
            <Link href="/dashboard" className="">
              <Button className="flex w-full cursor-pointer justify-start" size="lg" variant="outline">
                <LayoutDashboard className="me-1 h-5 w-5" />
                <span>Dashboard</span>
              </Button>
            </Link>
          ) : (
            <Link href="/" className="">
              <Button className="flex h-12 w-full cursor-pointer justify-start" size="lg" variant="outline">
                <Home className="mr-3 h-5 w-5" />
                <span>Home</span>
              </Button>
            </Link>
          )}

          {isLoggedIn || pathname === '/login' ? null : (
            <Link href="/login" className="ms-auto">
              <Button className="flex w-full cursor-pointer justify-start" size="lg" variant="ghost">
                <LogIn className="me-1 h-5 w-5" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
