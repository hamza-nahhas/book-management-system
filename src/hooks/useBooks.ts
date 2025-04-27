import { firestoreDB } from '@/firebase/firebase'
import { useAuth } from '@/hooks/useAuth' // Import useAuth
import type { Book } from '@/types/books' // Added ErrorResponse import
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { collection, getDocs } from 'firebase/firestore'

// --- Input types for Mutations ---
interface CreateBookInput {
  title: string
  author: string
  description?: string | null
}

interface UpdateBookInput {
  id: string
  title?: string
  author?: string
  description?: string | null
}

export function useBooks() {
  return useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const booksRef = collection(firestoreDB, 'books')
      const snapshot = await getDocs(booksRef)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Book, 'id'>)
      }))
    }
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation<Book, Error, CreateBookInput>({
    mutationFn: async (newBook) => {
      if (!user) throw new Error('Authentication required.')
      const idToken = await user.getIdToken()
      if (!idToken) throw new Error('Could not retrieve auth token.')

      const res = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify(newBook)
      })

      if (!res.ok) {
        let errorMsg = `Failed to create book (Status: ${res.status})`
        try {
          const errorData = await res.json()
          if (errorData?.error) errorMsg = errorData.error
        } catch {}
        throw new Error(errorMsg)
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'], exact: true })
    },
    onError: (error: Error) => {
      console.error('Create book failed:', error.message)
    }
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation<UpdateBookInput, Error, UpdateBookInput>({
    mutationFn: async ({ id, ...updateData }) => {
      if (!id) throw new Error('Book ID is required for update.')
      if (!user) throw new Error('Authentication required.')
      const idToken = await user.getIdToken()
      if (!idToken) throw new Error('Could not retrieve auth token.')

      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify(updateData)
      })

      if (!res.ok) {
        let errorMsg = `Failed to update book (Status: ${res.status})`
        try {
          const errorData = await res.json()
          if (errorData?.error) errorMsg = errorData.error
        } catch {}
        throw new Error(errorMsg)
      }
      return res.json()
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'], exact: true })
      queryClient.invalidateQueries({ queryKey: ['book', variables.id] })
    },
    onError: (error: Error) => {
      console.error('Update book failed:', error.message)
    }
  })
}

export function useDeleteBook() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation<void, Error, string>({
    mutationFn: async (id: string): Promise<void> => {
      if (!id) throw new Error('No book ID provided for deletion.')
      if (!user) throw new Error('Authentication required.')

      const idToken = await user.getIdToken()
      if (!idToken) throw new Error('Could not retrieve auth token.')

      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })

      if (res.status === 204) {
        return
      }

      if (!res.ok) {
        let errorMsg = `Failed to delete book (Status: ${res.status})`
        try {
          const errorData = await res.json()
          if (errorData?.error) errorMsg = errorData.error
        } catch {}
        throw new Error(errorMsg)
      }

      console.warn(`Unexpected status ${res.status} for DELETE book.`)
      return
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['books'], exact: true })
    },
    onError: (error: Error) => {
      console.error('Delete book failed:', error.message)
    }
  })
}
