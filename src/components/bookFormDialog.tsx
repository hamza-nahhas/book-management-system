'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Book } from '@/types/books'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

type BookFormDialogProps = {
  isOpen: boolean
  mode?: 'edit' | 'create'
  data?: Book | null
  isError: boolean
  onConfirm: (formData: BookFormData) => Promise<void>
  onClose: () => void
}

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().min(1, 'Description is required')
})

export type BookFormData = z.infer<typeof bookSchema>
const defaultValues: BookFormData = { title: '', author: '', description: '' }

const BookFormDialog: React.FC<BookFormDialogProps> = ({ mode = 'create', data, onConfirm, onClose, isOpen }) => {
  const methods = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues
  })

  useEffect(() => methods.reset(mode === 'edit' ? { ...data } : defaultValues), [data, methods, mode])

  const onDiscard = () => {
    onClose()
    methods.reset({ ...data })
  }

  const onSubmit = async (formData: BookFormData) => {
    await onConfirm(formData)
    methods.reset(mode === 'edit' ? formData : defaultValues)
    onClose()
  }

  const { errors } = methods.formState

  return (
    <Dialog  open={isOpen} onOpenChange={onDiscard}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? 'Update the book details below.' : 'Fill in the new book details.'}
          </DialogDescription>
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
              <Textarea maxLength={400} placeholder="Description" {...methods.register('description')} />
              {errors.description && <p className="pt-1 text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <DialogFooter className="flex justify-between">
              <Button type="button" variant="secondary" onClick={onDiscard}>
                Cancel
              </Button>

              <Button type="submit" disabled={methods.formState.isSubmitting}>
                {mode === 'edit' ? 'Save' : 'Add'} {/* Dynamically change button text */}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default BookFormDialog
