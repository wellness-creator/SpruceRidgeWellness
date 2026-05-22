'use client'

import { useActionState, useEffect, useState } from 'react'

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { isTextField, type CollectionDef, type FieldDef } from '@/lib/cms/schema'
import { saveCollectionItemAction, type ActionState } from '../actions'
import { EditorPreview } from './editor-preview'
import { ImageField } from './image-field'
import { SaveButton } from './save-button'

export interface ItemFieldValue {
  en: string
  value: string
}

export interface CollectionItemFormProps {
  def: CollectionDef
  itemId?: string
  isPublished: boolean
  sortOrder: number
  initialData: Record<string, ItemFieldValue>
}

function FieldControl({ field, value }: { field: FieldDef; value: ItemFieldValue }) {
  if (isTextField(field.type)) {
    const name = `field:${field.key}:en`
    if (field.type === 'textarea' || field.type === 'richText') {
      return <Textarea name={name} defaultValue={value.en} rows={4} />
    }
    return <Input name={name} defaultValue={value.en} />
  }
  if (field.type === 'image') {
    return (
      <ImageField
        name={`field:${field.key}:image`}
        defaultValue={value.value}
        ratio={field.imageRatio}
      />
    )
  }
  if (field.type === 'url') {
    return <Input name={`field:${field.key}:url`} defaultValue={value.value} />
  }
  if (field.type === 'number') {
    return <Input type='number' name={`field:${field.key}:num`} defaultValue={value.value} />
  }
  return <Switch name={`field:${field.key}:bool`} defaultChecked={value.value === 'true'} />
}

function FieldRow({ field, value }: { field: FieldDef; value: ItemFieldValue }) {
  return (
    <Field className='w-full'>
      <FieldLabel>{field.label}</FieldLabel>
      {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
      <FieldControl field={field} value={value} />
    </Field>
  )
}

export function CollectionItemForm({
  def,
  itemId,
  isPublished,
  sortOrder,
  initialData,
}: CollectionItemFormProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveCollectionItemAction, {
    ok: false,
    message: '',
  })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (state.ok) setReloadKey((k) => k + 1)
  }, [state])

  const valueFor = (key: string): ItemFieldValue => initialData[key] ?? { en: '', value: '' }

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]'>
      <form action={formAction} className='space-y-5'>
        <input type='hidden' name='collectionSlug' value={def.slug} />
        {itemId ? <input type='hidden' name='itemId' value={itemId} /> : null}
        <input type='hidden' name='sortOrder' value={sortOrder} />

        <section className='space-y-5 rounded-xl border bg-card p-5'>
          {def.fields.map((field) => (
            <FieldRow key={field.key} field={field} value={valueFor(field.key)} />
          ))}

          <Field className='border-t pt-5'>
            <FieldLabel>Show on the website</FieldLabel>
            <FieldDescription>Turn off to hide this without deleting it.</FieldDescription>
            <Switch name='isPublished' defaultChecked={isPublished} />
          </Field>
        </section>

        <div className='sticky bottom-4 flex items-center gap-3 rounded-xl border bg-card/95 p-4 shadow-sm backdrop-blur'>
          <SaveButton>Save</SaveButton>
          {state.message && !state.ok ? (
            <span className='text-destructive text-sm'>{state.message}</span>
          ) : null}
        </div>
      </form>

      <EditorPreview path={def.previewPath} reloadKey={reloadKey} />
    </div>
  )
}
