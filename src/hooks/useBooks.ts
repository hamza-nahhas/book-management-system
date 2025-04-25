import { firestoreDB } from '@/firebase/firebase'
import { Book } from '@/types/books'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { collection, getDocs } from 'firebase/firestore'

export function useBooks() {
  return useQuery<Book[]>({
    queryKey: ['books'],

    queryFn: async () => {
      const booksRef = collection(firestoreDB, 'books')
      const snapshot = await getDocs(booksRef)

      return snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          author: doc.data().author,
          title: doc.data().title,
          description: doc.data().description
          //     ...(doc.data() as Omit<Book, 'id'>)
        }
      })
    }
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newBook: { title: string; author: string; description: string }) => {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      })
      if (!res.ok) throw new Error('Failed to create book')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'], exact: true })
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updated }: any) => {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
      if (!res.ok) throw new Error('Failed to update book')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'], exact: true })
  })
}

export function useDeleteBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete book')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'], exact: true })
  })
}
