'use client'

import { Undo2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { undoPageAction } from '../actions'

export function UndoButton({
  pageSlug,
  canUndo,
}: {
  pageSlug: string
  canUndo: boolean
}) {
  return (
    <form action={undoPageAction} className='shrink-0'>
      <input type='hidden' name='pageSlug' value={pageSlug} />
      <Button
        type='submit'
        variant='outline'
        size='sm'
        disabled={!canUndo}
        title={canUndo ? 'Undo your last saved change' : 'Nothing to undo yet — make a change first'}
        onClick={(e) => {
          if (!window.confirm('Undo your last saved change to this page?')) {
            e.preventDefault()
          }
        }}
      >
        <Undo2 className='h-4 w-4' />
        Undo last change
      </Button>
    </form>
  )
}
