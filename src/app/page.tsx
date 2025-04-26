'use client'

import BookCard from '@/components/bookCard'
import { useBooks } from '@/hooks/useBooks'

const bookColors = [
  'from-blue-400 to-purple-500',
  'from-green-400 to-teal-500',
  'from-red-400 to-orange-500',
  'from-pink-400 to-rose-500',
  'from-amber-400 to-yellow-500',
  'from-indigo-400 to-violet-500'
]
export default function BookList() {
  const { data: booksList, isLoading, isError } = useBooks()

  if (isLoading) return <p>Loading books...</p>
  if (isError) return <p>Failed to load books.</p>

  return (
    <div className="grid grid-cols-1 gap-4 px-8 py-16 sm:grid-cols-2 sm:px-16 lg:grid-cols-3 lg:px-24 xl:grid-cols-5 xl:px-40">
      {booksList?.map((book, idx) => <BookCard key={book.id} book={book} color={bookColors[idx % 6]} />)}
    </div>
  )
}
