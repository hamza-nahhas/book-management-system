'use client'

import { useBooks } from '@/hooks/useBooks'

export default function BookList() {
  const { data: books, isLoading, isError } = useBooks()

  if (isLoading) return <p>Loading books...</p>
  if (isError) return <p>Failed to load books.</p>

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books?.map((book) => (
        <div key={book.id} className="rounded border p-4 shadow">
          <h2 className="text-lg font-bold">{book.title}</h2>
          <p className="text-sm text-gray-700">by {book.author}</p>
          <p className="mt-2 text-sm">{book.description}</p>
        </div>
      ))}
    </div>
  )
}
