import { useAuth } from '@/hooks/useAuth'
import { Home, LayoutDashboard, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import ConfirmDialog from './ConfirmDialog'
import { Button } from './ui/button'

export function AdminSidebar() {
  const pathname = usePathname()

  const { user, logout } = useAuth()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const onCloseDialog = useCallback(() => setIsDialogOpen(false), [])
  const onOpenDialog = useCallback(() => setIsDialogOpen(true), [])

  const onLogout = useCallback(async () => {
    await logout()
    router.push('/')
    toast('Logged out successfully', { richColors: true })
  }, [logout, router])

  return (
    <>
      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Logout Confirmation"
        description="Are you sure you want to log out?"
        onSubmit={onLogout}
        onDiscard={onCloseDialog}
      />
      <div className="sticky top-0 flex h-screen max-w-[240px] flex-1 flex-shrink-0 flex-col border-r border-gray-200 bg-white xl:max-w-[320px]">
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
        </div>

        <nav className="flex flex-1 flex-col space-y-2 overflow-y-auto p-4">
          <Link href="/">
            <Button
              className="flex h-12 w-full cursor-pointer justify-start"
              size="lg"
              variant={pathname === '/' ? 'default' : 'outline'}
            >
              <Home className="mr-3 h-5 w-5" />
              <span>Main Page</span>
            </Button>
          </Link>

          <Link href="/dashboard" className="">
            <Button
              className="flex h-12 w-full cursor-pointer justify-start"
              size="lg"
              variant={pathname === '/dashboard' ? 'default' : 'outline'}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </nav>

        <div className="mt-auto border-t border-gray-200 p-4">
          <Button size="lg" variant="outline" className="flex w-full justify-start" onClick={onOpenDialog}>
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </>
  )
}
