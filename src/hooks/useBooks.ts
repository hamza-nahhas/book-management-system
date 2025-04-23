import { firestoreDB } from '@/firebase/firebase'
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs } from 'firebase/firestore'

export type Book = {
  id: string
  title: string
  author: string
  description: string
}

export function useBooks() {
  return useQuery<Book[]>({
    queryKey: ['books'],

    queryFn: async () => {
      const booksRef = collection(firestoreDB, 'books')
      const snapshot = await getDocs(booksRef)

      console.log(
        55555555,
        snapshot.docs.map((doc) => doc.data())
      )

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        author: doc.data().author,
        title: doc.data().title,
        description: doc.data().description
        //     ...(doc.data() as Omit<Book, 'id'>)
      }))
    }
  })
}
