import { adminDB } from '@/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { z, ZodIssue } from 'zod'

const UpdateBookSchema = z
  .object({
    title: z.string().min(1, { message: 'Title cannot be empty' }).optional(),
    author: z.string().min(1, { message: 'Author cannot be empty' }).optional(),
    description: z.string().optional().nullable()
  })
  .strict()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'Request body must contain at least one field to update.'
  })

type UpdateBookInput = z.infer<typeof UpdateBookSchema>

interface ErrorResponse {
  error: string
  issues?: ZodIssue[]
}

type PutResponse = NextResponse<UpdateBookInput | ErrorResponse>
type DeleteResponse = NextResponse<null | ErrorResponse>

export async function PUT(req: NextRequest, { params }: { params: { id: string } }): Promise<PutResponse> {
  const id = params.id
  if (!id) {
    return NextResponse.json<ErrorResponse>({ error: 'Missing book ID' }, { status: 400 })
  }

  console.log(`PUT /api/books/${id}`)
  try {
    const rawData = await req.json()
    const validationResult = UpdateBookSchema.safeParse(rawData)

    if (!validationResult.success) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Invalid request body.', issues: validationResult.error.errors },
        { status: 400 }
      )
    }

    const dataToUpdate = validationResult.data

    await adminDB.collection('books').doc(id).update(dataToUpdate)

    return NextResponse.json<UpdateBookInput>(dataToUpdate, { status: 200 })
  } catch (err: any) {
    console.error(`Update failed for book ${id}:`, err)
    if (err.code === 5) {
      return NextResponse.json<ErrorResponse>({ error: 'Book not found.' }, { status: 404 })
    }
    return NextResponse.json<ErrorResponse>({ error: 'Failed to update book.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }): Promise<DeleteResponse> {
  const id = params.id
  if (!id) {
    return NextResponse.json<ErrorResponse>({ error: 'Missing book ID' }, { status: 400 })
  }

  console.log(`DELETE /api/books/${id}`)
  try {
    await adminDB.collection('books').doc(id).delete()

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error(`Delete failed for book ${id}:`, err)
    return NextResponse.json<ErrorResponse>({ error: 'Failed to delete book.' }, { status: 500 })
  }
}
