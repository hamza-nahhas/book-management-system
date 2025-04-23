'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const [submitError, setSubmitError] = useState('')

  const onLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (err: any) {
      setSubmitError('Error logging out')
    }
  }

  return (
    <div>
      <h1>
        Admin Dashboard: {user?.displayName} + {user?.email}
      </h1>

      <button onClick={onLogout} className="bg-blue-500 p-2 text-white">
        Logout
      </button>

      <p>asd</p>
    </div>
  )
}

export default Dashboard
