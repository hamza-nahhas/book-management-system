import { Book } from '@/types/books'
import React, { useCallback } from 'react'
import { Button } from './ui/button'

type BookCardProps = {
  book: Book
  onEdit: (book: Book) => void
  onDelete: (book: Book) => void
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => onEdit(book), [book, onEdit])
  const handleDelete = useCallback(() => onDelete(book), [book, onDelete])

  return (
    <div className="max-w-sm space-y-4 rounded-lg bg-white p-4 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900">{book.title}</h2>
      <p className="text-gray-600">{book.author}</p>
      <p className="primar text-sm text-gray-500">{book.description}</p>

      <div className="mt-4 flex space-x-2">
        <Button variant="outline" size="sm" color="primary" onClick={handleEdit}>
          Edit
        </Button>
        <Button variant="outline" size="sm" color="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
}

export default BookCard
