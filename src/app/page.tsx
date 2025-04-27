import BookCard from '@/components/bookCard'
import type { Book } from '@/types/books'

const bookColors = [
  'from-blue-400 to-purple-500',
  'from-green-400 to-teal-500',
  'from-red-400 to-orange-500',
  'from-pink-400 to-rose-500',
  'from-amber-400 to-yellow-500',
  'from-indigo-400 to-violet-500'
]

async function getBooks(): Promise<{ books: Book[] | null; error: string | null }> {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${apiUrl}/api/books`

  try {
    const res = await fetch(url, { cache: 'no-store' })

    if (!res.ok) {
      let errorMsg = `Error: ${res.status} ${res.statusText}`
      try {
        const errorData: any = await res.json()
        if (errorData.error) {
          errorMsg = errorData.error
        }
      } catch {}
      console.error('SSR Fetch Error:', errorMsg, res.status)
      return { books: null, error: errorMsg }
    }

    const books: Book[] = await res.json()
    return { books, error: null }
  } catch (err) {
    console.error('SSR Network/Fetch Error:', err)
    const message = err instanceof Error ? err.message : 'An unknown fetch error occurred.'
    return { books: null, error: message }
  }
}

export default async function BookListPageSSR() {
  const { books: booksList, error } = await getBooks()

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center px-8 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Failed to Load Books</h1>
        <p className="mb-6">{error}</p>
      </div>
    )
  }

  if (!booksList || booksList.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center px-8 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">No Books Found</h1>
        <p className="mb-6">There are currently no books listed.</p>
      </div>
    )
  }

  return (
    <div className="mt-16 grid grid-cols-1 gap-6 px-8 py-16 sm:grid-cols-2 sm:px-16 lg:grid-cols-3 lg:px-24 xl:grid-cols-5 xl:px-40">
      {booksList.map((book, idx) => (
        <BookCard key={book.id} book={book} color={bookColors[idx % bookColors.length]} />
      ))}
    </div>
  )
}

export const metadata = {
  title: 'Books List',
  description: 'Browse the collection of books.'
}
