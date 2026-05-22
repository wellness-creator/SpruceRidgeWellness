'use client'

import { useActionState, useEffect, useState } from 'react'

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { SECTION_GUIDES, isTextField, type FieldDef, type PageDef } from '@/lib/cms/schema'
import { savePageAction, type ActionState } from '../actions'
import { EditorPreview } from './editor-preview'
import { ImageField } from './image-field'
import { SaveButton } from './save-button'

export interface FieldValue {
  en: string
  image: string
  url: string
  bool: boolean
  num: number
}

function FieldInput({ field, value }: { field: FieldDef; value: FieldValue }) {
  if (isTextField(field.type)) {
    const name = `field:${field.key}:en`
    if (field.type === 'textarea' || field.type === 'richText') {
      return (
        <Textarea
          name={name}
          defaultValue={value.en}
          rows={field.key.endsWith('treatments') ? 8 : 3}
        />
      )
    }
    return <Input name={name} defaultValue={value.en} />
  }
  if (field.type === 'image') {
    return (
      <ImageField
        name={`field:${field.key}:image`}
        defaultValue={value.image}
        ratio={field.imageRatio}
      />
    )
  }
  if (field.type === 'url') {
    return <Input name={`field:${field.key}:url`} defaultValue={value.url} />
  }
  if (field.type === 'number') {
    return <Input type='number' name={`field:${field.key}:num`} defaultValue={String(value.num)} />
  }
  return <Switch name={`field:${field.key}:bool`} defaultChecked={value.bool} />
}

function FieldRow({ field, value }: { field: FieldDef; value: FieldValue }) {
  return (
    <Field className='w-full'>
      <FieldLabel>{field.label}</FieldLabel>
      {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
      <FieldInput field={field} value={value} />
    </Field>
  )
}

function groupFields(fields: FieldDef[]): Array<{ name: string; fields: FieldDef[] }> {
  const order: string[] = []
  const map = new Map<string, FieldDef[]>()
  for (const f of fields) {
    const g = f.group ?? 'Content'
    if (!map.has(g)) {
      map.set(g, [])
      order.push(g)
    }
    map.get(g)!.push(f)
  }
  return order.map((name) => ({ name, fields: map.get(name)! }))
}

/** The guide shown on a section's "?" icon — customised per section. */
function helpFor(name: string, fields: FieldDef[]): string {
  const guide = SECTION_GUIDES[name]
  if (guide) return guide
  // Fallback for any section without a written guide.
  const hasImage = fields.some((f) => f.type === 'image')
  return hasImage
    ? 'Change the text in each box, then click Save. For photos, use a clear, good-quality image.'
    : 'Change the text in each box, then click Save — the preview on the right updates right away.'
}

/** Question-mark icon that reveals a guide for the section on hover. */
function SectionHelp({ text }: { text: string }) {
  return (
    <span className='group/help relative inline-flex'>
      <span
        aria-label='Section help'
        className='flex h-4.5 w-4.5 cursor-help items-center justify-center rounded-full border border-muted-foreground/40 font-medium text-[11px] text-muted-foreground'
      >
        ?
      </span>
      <span className='pointer-events-none absolute left-0 top-6 z-20 w-64 rounded-lg border bg-card p-3 text-left font-normal text-muted-foreground text-xs leading-relaxed normal-case tracking-normal opacity-0 shadow-lg transition-opacity duration-150 group-hover/help:opacity-100'>
        {text}
      </span>
    </span>
  )
}

export function PageFieldsForm({
  def,
  initial,
}: {
  def: PageDef
  initial: Record<string, FieldValue>
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(savePageAction, {
    ok: false,
    message: '',
  })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (state.ok) setReloadKey((k) => k + 1)
  }, [state])

  const groups = groupFields(def.fields)
  const valueFor = (key: string): FieldValue =>
    initial[key] ?? { en: '', image: '', url: '', bool: false, num: 0 }

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]'>
      <form action={formAction} className='space-y-5'>
        <input type='hidden' name='pageSlug' value={def.slug} />

        {groups.map((group) => (
          <section key={group.name} className='space-y-5 rounded-xl border bg-card p-5'>
            <h3 className='flex items-center gap-2 font-semibold text-foreground text-sm'>
              {group.name}
              <SectionHelp text={helpFor(group.name, group.fields)} />
            </h3>
            {group.fields.map((field) => (
              <FieldRow key={field.key} field={field} value={valueFor(field.key)} />
            ))}
          </section>
        ))}

        <div className='sticky bottom-4 flex items-center gap-3 rounded-xl border bg-card/95 p-4 shadow-sm backdrop-blur'>
          <SaveButton />
          {state.message ? (
            <span
              className={
                state.ok ? 'text-emerald-600 text-sm' : 'text-destructive text-sm'
              }
            >
              {state.message}
            </span>
          ) : null}
        </div>
      </form>

      <EditorPreview path={def.previewPath} reloadKey={reloadKey} />
    </div>
  )
}
