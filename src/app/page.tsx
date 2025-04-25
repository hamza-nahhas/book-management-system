'use client'

import { useBooks, useCreateBook } from '@/hooks/useBooks'

export default function BookList() {
  const { data: booksList, isLoading, isError } = useBooks()

  const { mutate: createBook, isError: isCreateError, isPending } = useCreateBook()

  console.log('books', booksList)
  const handleCreateBook = () => {
    createBook({ author: 'New Author', title: 'New Book', description: 'New Description' })
  }

  console.log('IsPending', isPending)

  if (isLoading) return <p>Loading books...</p>
  if (isError) return <p>Failed to load books.</p>

  return (
    <div className="grid grid-cols-1 gap-4 p-20 sm:grid-cols-2 lg:grid-cols-3">
      {booksList?.map((book) => (
        <div key={book.id} className="rounded border p-4 shadow">
          <h2 className="text-lg font-bold">{book.title}</h2>
          <p className="text-sm text-gray-700">by {book.author}</p>
          <p className="mt-2 text-sm">{book.description}</p>
        </div>
      ))}

      <button onClick={handleCreateBook} className="rounded border bg-amber-400 p-4 shadow">
        CREATE
      </button>
    </div>
  )
}
