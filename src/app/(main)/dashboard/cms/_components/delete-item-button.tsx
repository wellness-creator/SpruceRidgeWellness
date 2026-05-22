'use client'

import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { deleteCollectionItemAction } from '../actions'

export function DeleteItemButton({
  collectionSlug,
  itemId,
}: {
  collectionSlug: string
  itemId: string
}) {
  return (
    <form action={deleteCollectionItemAction} className='shrink-0'>
      <input type='hidden' name='collectionSlug' value={collectionSlug} />
      <input type='hidden' name='itemId' value={itemId} />
      <Button
        type='submit'
        variant='outline'
        size='sm'
        className='text-destructive'
        onClick={(e) => {
          if (!window.confirm('Delete this for good? This cannot be undone.')) {
            e.preventDefault()
          }
        }}
      >
        <Trash2 className='h-4 w-4' />
        Delete
      </Button>
    </form>
  )
}
