'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useCreateBook, useUpdateBook } from '@/hooks/useBooks'
import { Book } from '@/types/books'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

type BookFormDialogProps = {
  isOpen: boolean
  mode?: 'edit' | 'create'
  data?: Book | null
  onClose: () => void
}

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string()
})

export type BookFormData = z.infer<typeof bookSchema>
const defaultValues: BookFormData = { title: '', author: '', description: '' }

const BookFormDialog: React.FC<BookFormDialogProps> = ({ mode = 'create', data, onClose, isOpen }) => {
  const { mutateAsync: createMutation, isError: isCreateError, isPending: isCreatePending } = useCreateBook()
  const { mutateAsync: updateMutation, isError: isUpdateError, isPending: isUpdatePending } = useUpdateBook()

  const methods = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues
  })

  useEffect(() => methods.reset(mode === 'edit' ? { ...data } : defaultValues), [data, methods, mode])

  const onDiscard = useCallback(() => {
    onClose()
    methods.reset({ ...data })
  }, [])

  const onFormSubmit = useCallback(
    async (formData: BookFormData) => {
      try {
        if (mode === 'edit' && data) {
          await updateMutation({ ...formData, id: data?.id })
        } else {
          await createMutation(formData)
        }
        toast.success(mode === 'edit' ? 'Book updated successfully!' : 'Book created successfully!')
        methods.reset(mode === 'edit' ? formData : defaultValues)

        onClose()
      } catch (error: any) {
        toast.error(error.message || 'An error occurred. Please try again.')
      }
    },
    [createMutation, data, mode, onClose, updateMutation]
  )

  const { errors } = methods.formState

  return (
    <Dialog open={isOpen} onOpenChange={onDiscard}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? 'Update the book details below.' : 'Fill in the new book details.'}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onFormSubmit)} className="space-y-4">
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
            </div>

            <DialogFooter className="flex justify-between">
              <Button type="button" variant="secondary" onClick={onDiscard}>
                Cancel
              </Button>

              <Button type="submit" className="w-24" disabled={methods.formState.isSubmitting}>
                {mode === 'edit' ? 'Save' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default BookFormDialog
