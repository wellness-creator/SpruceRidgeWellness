'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const DEFAULT_RATIO_HINT =
  'Portrait photo (taller than wide) — about 1000 × 1250 px works best.'

export function ImageField({
  name,
  defaultValue,
  ratio,
}: {
  name: string
  defaultValue: string
  ratio?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setStatus(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/cms/upload', { method: 'POST', body })
      const json = await res.json()
      if (json?.success) {
        setValue(json.data.key)
        setStatus('Image uploaded.')
      } else {
        setStatus(json?.error?.message ?? 'Upload failed. Please try again.')
      }
    } catch {
      setStatus('Upload failed. Please try again.')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const preview = value.startsWith('/') || value.startsWith('http') ? value : null

  return (
    <div className='space-y-2'>
      <p className='flex items-start gap-1.5 text-muted-foreground text-xs'>
        <span aria-hidden className='mt-px'>
          🖼
        </span>
        <span>{ratio ?? DEFAULT_RATIO_HINT}</span>
      </p>
      {preview ? (
        <div className='relative h-32 w-full max-w-xs overflow-hidden rounded-lg border bg-muted'>
          <Image src={preview} alt='' fill sizes='320px' unoptimized className='object-cover' />
        </div>
      ) : null}
      <Input
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='/images/example.jpg'
      />
      <div className='flex flex-wrap items-center gap-3'>
        <input
          ref={fileRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handlePick}
        />
        <Button
          type='button'
          variant='outline'
          size='sm'
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? 'Uploading…' : 'Upload image'}
        </Button>
        {status ? <span className='text-xs text-muted-foreground'>{status}</span> : null}
      </div>
    </div>
  )
}
