import { adminDB } from '@/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const data = await req.json()

  try {
    await adminDB.collection('books').doc(id).update(data)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Update failed:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    await adminDB.collection('books').doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete failed:', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
