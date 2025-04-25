'use client'

import BookCard from '@/components/bookCard'
import BookFormDialog, { BookFormData } from '@/components/bookFormDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useBooks, useCreateBook, useDeleteBook, useUpdateBook } from '@/hooks/useBooks'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'

type Book = {
  id: string
  title: string
  author: string
  description: string
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const { data: booksList, isLoading: isLoadingBooks, isError: isQueryError } = useBooks()
  const { mutateAsync: createMutation, isError: isCreateError, isPending: isCreatePending } = useCreateBook()
  const { mutateAsync: updateMutation, isError: isUpdateError, isPending: isUpdatePending } = useUpdateBook()
  const { mutateAsync: deleteMutation, isError: isDeleteErr, isPending: isDeletePending } = useDeleteBook()

  const [submitError, setSubmitError] = useState('Error logging out')

  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'delete' | null>(null)

  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const onLogout = useCallback(async () => {
    try {
      await logout()
      router.push('/')
    } catch (err: any) {
      setSubmitError('Error logging out')
    }
  }, [logout, router])

  const handleCreate = useCallback(() => setDialogMode('create'), [])
  const handleEdit = useCallback((book: Book) => {
    setDialogMode('edit')
    setSelectedBook(book)
  }, [])
  const handleDelete = useCallback((book: Book) => {
    setDialogMode('delete')
    setSelectedBook(book)
  }, [])
  const onCloseDialog = useCallback(() => {
    setDialogMode(null)
    setSelectedBook(null)
  }, [])

  const onDeleteConfirm = useCallback(async () => {
    console.log('onDeleteConfirm', selectedBook)
    if (!selectedBook) return
    await deleteMutation(selectedBook.id)
    if (isDeleteErr) {
      setSubmitError('Failed to delete book')
    }
    onCloseDialog()
  }, [deleteMutation, isDeleteErr, onCloseDialog, selectedBook])

  const onFormSubmit = useCallback(
    async (formData: BookFormData) => {
      if (dialogMode === 'edit' && selectedBook) {
        await updateMutation({ ...formData, id: selectedBook.id })
      } else {
        await createMutation(formData)
        if (isCreateError) {
          setSubmitError('Failed to create book')
        }
      }
    },
    [createMutation, dialogMode, isCreateError, selectedBook, updateMutation]
  )

  if (isLoadingBooks) return <p>Loading books...</p>
  if (isQueryError) return <p>Failed to load books.</p>

  return (
    <>
      <BookFormDialog
        isOpen={dialogMode === 'create'}
        onConfirm={onFormSubmit}
        isError={isCreateError}
        onClose={onCloseDialog}
      />
      <BookFormDialog
        isOpen={dialogMode === 'edit'}
        data={selectedBook}
        mode="edit"
        onConfirm={onFormSubmit}
        isError={isUpdateError}
        onClose={onCloseDialog}
      />
      <ConfirmDialog
        isOpen={dialogMode === 'delete'}
        title="Delete a book"
        description="Are you sure you want to delete this book?"
        onSubmit={onDeleteConfirm}
        onDiscard={onCloseDialog}
      />

      <div className="min-h-screen space-y-6 bg-[--background] p-6 text-[--foreground]">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Welcome, {user?.displayName} <span className="text-sm opacity-70">({user?.email})</span>
          </h1>
          <button onClick={onLogout} className="rounded-sm bg-red-500 px-4 py-2 text-white transition hover:opacity-90">
            Logout
          </button>
        </header>

        <section>
          <section className="flex items-center justify-between">
            <h2 className="mb-4 text-xl font-semibold">Books</h2>
            <Button size="sm" onClick={handleCreate}>
              Create
            </Button>
          </section>
          {(booksList ?? []).length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(booksList ?? []).map((book) => (
                <BookCard key={book.id} book={book} onDelete={handleDelete} onEdit={handleEdit} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No books available.</p>
          )}
        </section>
      </div>
    </>
  )
}

export default Dashboard
