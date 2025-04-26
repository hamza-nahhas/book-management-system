import { adminDB } from '@/firebase/admin'
import { Book } from '@/types/books'
import { NextResponse } from 'next/server'
import { z, ZodIssue } from 'zod'

const CreateBookSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  description: z.string().optional().nullable()
})

type CreateBookInput = z.infer<typeof CreateBookSchema>

interface CreatedBookResponse extends CreateBookInput {
  id: string
}

interface ErrorResponse {
  error: string
  issues?: ZodIssue[]
}

type PostResponse = NextResponse<CreatedBookResponse | ErrorResponse>
type GetResponse = NextResponse<Book[] | ErrorResponse> // Success returns an array of Book

export async function POST(req: Request): Promise<PostResponse> {
  console.log('POST /api/books')
  try {
    const rawData = await req.json()
    const validationResult = CreateBookSchema.safeParse(rawData)

    if (!validationResult.success) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Invalid request body.', issues: validationResult.error.errors },
        { status: 400 }
      )
    }

    const bookData = validationResult.data

    const docRef = await adminDB.collection('books').add(bookData)

    const responseBody: CreatedBookResponse = {
      id: docRef.id,
      ...bookData
    }

    return NextResponse.json<CreatedBookResponse>(responseBody, { status: 201 })
  } catch (err) {
    console.error('Error creating book:', err)
    return NextResponse.json<ErrorResponse>({ error: 'Failed to add book due to a server error.' }, { status: 500 })
  }
}

export async function GET(_req: Request): Promise<GetResponse> {
  console.log('GET /api/books')
  try {
    const booksSnapshot = await adminDB.collection('books').get()

    const books: Book[] = booksSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title ?? 'N/A',
        author: data.author ?? 'N/A',
        description: data.description ?? undefined
      } as Book
    })

    return NextResponse.json<Book[]>(books, { status: 200 })
  } catch (err) {
    console.error('Error fetching books:', err)
    return NextResponse.json<ErrorResponse>({ error: 'Failed to fetch books due to a server error.' }, { status: 500 })
  }
}
