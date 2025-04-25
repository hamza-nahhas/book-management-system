'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useUpdateBook } from '@/hooks/useBooks'
import { Book } from '@/types/books'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

type BookCardProps = {
  isOpen: boolean
  data: Book | null
  onClose: () => void
}

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().min(1, 'Description is required')
})

type BookFormData = z.infer<typeof bookSchema>

const BookCreateDialog: React.FC<BookCardProps> = ({ data, onClose, isOpen }) => {
  const methods = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: { title: data?.title, author: data?.author, description: data?.description }
  })
  const { mutateAsync, isError: isUpdateError, isPending } = useUpdateBook()

  useEffect(() => {
    if (data) methods.reset({ ...data })
  }, [data, methods])

  console.log('BookEditDialog data', data)

  const onDiscard = () => {
    if (isPending) return
    onClose()
    methods.reset({ ...data })
  }

  const onSubmit = async (updatedData: BookFormData) => {
    if (!data?.id) return
    await mutateAsync({ ...updatedData, id: data.id })
    if (isUpdateError) {
      methods.setError('title', { message: 'Failed to update book' })
    }
    onClose()
  }

  const { errors } = methods.formState

  return (
    <Dialog open={isOpen} onOpenChange={onDiscard}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>Update the book details below.</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Title" {...methods.register('title')} />
              {errors.title && <p className="pt-1 text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div>
              <Input placeholder="Author" {...methods.register('author')} />
              {errors.author && <p className="pt-1 text-sm text-red-500">{errors.author.message}</p>}
            </div>

            <div>
              <Textarea placeholder="Description" {...methods.register('description')} />
              {errors.description && <p className="pt-1 text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <DialogFooter className="flex justify-between">
              <Button type="button" variant="secondary" onClick={onDiscard}>
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default BookCreateDialog
