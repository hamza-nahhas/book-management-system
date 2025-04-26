'use client'

import BookCard from '@/components/bookCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useBooks } from '@/hooks/useBooks'
import { useCallback } from 'react'

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

  const renderSkeleton = useCallback(
    () => (
      <div className="flex flex-col overflow-hidden rounded-xl border p-0 shadow-sm">
        <div className="relative flex aspect-[3/2] w-full items-center justify-center p-4">
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="space-y-2 p-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="mt-2 h-3 w-full" />
        </div>
      </div>
    ),
    []
  )

  return (
    <div className="grid grid-cols-1 gap-6 px-8 py-16 sm:grid-cols-2 sm:px-16 lg:grid-cols-3 lg:px-24 xl:grid-cols-5 xl:px-40">
      {isLoading || !booksList
        ? Array.from({ length: 20 }).map((_, idx) => <div key={idx}>{renderSkeleton()}</div>)
        : booksList.map((book, idx) => (
            <BookCard key={book.id} book={book} color={bookColors[idx % bookColors.length]} />
          ))}
    </div>
  )
}
