import { Book } from '@/types/books'
import { BookOpenText } from 'lucide-react'
import React from 'react'

type BookCardProps = {
  book: Book
  color: string
}

const BookCard: React.FC<BookCardProps> = ({ book, color }) => {
  return (
    <div
      key={book.id}
      className="group flex flex-col overflow-hidden rounded-xl border bg-white p-0 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="p-0">
        <div className={`relative flex aspect-[3/2] w-full items-center justify-center bg-gradient-to-br ${color} p-4`}>
          <BookOpenText className="" />

          <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <p className="line-clamp-1 font-medium">{book.title}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold">{book.title}</h3>
        <p className="text-muted-foreground text-sm">{book.author}</p>
        <p className="text-muted-foreground mt-2 line-clamp-3 text-xs">{book.description}</p>
      </div>
    </div>
  )
}

export default BookCard
