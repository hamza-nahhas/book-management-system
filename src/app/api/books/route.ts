import { adminDB } from '@/firebase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    console.log('POST /api/books')
  try {
    const data = await req.json()
    const { title, author, description } = data

    if (!title || !author || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const docRef = await adminDB.collection('books').add({ title, author, description })

    return NextResponse.json({ id: docRef.id, title, author, description }, { status: 201 })
  } catch (err) {
    console.error('Error creating book:', err)
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 })
  }
}
