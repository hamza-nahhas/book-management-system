'use client'

import { useAuth } from '@/hooks/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { login, user, logout } = useAuth()
  const router = useRouter()
  const [submitError, setSubmitError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password)
      router.push('/admin') // ✅ Redirect to dashboard
    } catch (err: any) {
      setSubmitError('Invalid email or password')
    }
  }

  console.log(1, user)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-10 flex max-w-sm flex-col gap-4">
      <input type="email" placeholder="Email" {...register('email')} className="border p-2" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <input type="password" placeholder="Password" {...register('password')} className="border p-2" />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting} className="bg-blue-500 p-2 text-white">
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>

      {submitError && <p className="text-red-500">{submitError}</p>}
    </form>
  )
}
