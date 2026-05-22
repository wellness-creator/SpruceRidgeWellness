'use client'

import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'

export function SaveButton({ children = 'Save changes' }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Saving…' : children}
    </Button>
  )
}
