'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import React, { useCallback } from 'react'
import { Button } from './ui/button'

type BookCardProps = {
  isOpen: boolean
  onDiscard: () => void
  onSubmit: () => Promise<void>
  title: string
  description: string
  disabled?: boolean
  color?: 'default' | 'destructive'
  error?: string
}

const ConfirmDialog: React.FC<BookCardProps> = ({
  color = 'destructive',
  onDiscard,
  isOpen,
  onSubmit,
  title,
  description
}) => {
  const [loading, setLoading] = React.useState(false)

  const onCancel = useCallback(() => {
    if (loading) return
    onDiscard()
  }, [loading, onDiscard])
  const onConfirm = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      await onSubmit()
      setLoading(false)
    },
    [onSubmit]
  )

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onConfirm}>
          <DialogFooter className="flex justify-between">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>

            <Button type="submit" variant={color} disabled={loading}>
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDialog
