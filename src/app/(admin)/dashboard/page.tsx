'use client'

import BookFormDialog from '@/components/bookFormDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { DashboardDataTable } from '@/components/dashboardDataTable'
import { useAuth } from '@/hooks/useAuth'
import { useBooks, useDeleteBook } from '@/hooks/useBooks'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

type Book = {
  id: string
  title: string
  author: string
  description: string
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  const { data: booksList, isLoading: isLoadingBooks, isError: isQueryError } = useBooks()
  const { mutateAsync: deleteMutation } = useDeleteBook()

  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'delete' | null>(null)

  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

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
    if (!selectedBook) return
    try {
      await deleteMutation(selectedBook.id)
      onCloseDialog()
      toast.success('Book deleted successfully!')
    } catch (error: any) {
      toast.error(error?.message || 'An error occurred. Please try again.')
    }
  }, [deleteMutation, onCloseDialog, selectedBook])

  if (isQueryError) return <p>Failed to load books.</p>

  return (
    <>
      <BookFormDialog isOpen={dialogMode === 'create'} onClose={onCloseDialog} />
      <BookFormDialog isOpen={dialogMode === 'edit'} data={selectedBook} mode="edit" onClose={onCloseDialog} />
      <ConfirmDialog
        isOpen={dialogMode === 'delete'}
        title="Delete a book"
        description="Are you sure you want to delete this book?"
        onSubmit={onDeleteConfirm}
        onDiscard={onCloseDialog}
        error="failed to delete the book, please try again."
      />

      <div className="mx-auto w-full max-w-[1320px] space-y-6 p-6 lg:px-12 xl:px-20">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Welcome, <span className="text-2xl opacity-70">({user?.email})</span>
          </h1>
        </header>

        <DashboardDataTable
          isLoading={isLoadingBooks}
          data={booksList ?? []}
          handleCreate={handleCreate}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </>
  )
}

export default Dashboard
