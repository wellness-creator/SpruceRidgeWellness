'use client'

import { useActionState, useEffect, useState } from 'react'

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveSiteSettingsAction, type ActionState } from '../../cms/actions'
import { EditorPreview } from '../../cms/_components/editor-preview'
import { ImageField } from '../../cms/_components/image-field'
import { SaveButton } from '../../cms/_components/save-button'

export interface SiteSettingsValues {
  siteName: string
  about: string
  contactEmail: string
  contactPhone: string
  address: string
  defaultOgImage: string
  socials: Record<string, string>
}

const SOCIALS: Array<{ key: string; label: string }> = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter', label: 'Twitter / X' },
]

export function SiteSettingsForm({ initial }: { initial: SiteSettingsValues }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveSiteSettingsAction, {
    ok: false,
    message: '',
  })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (state.ok) setReloadKey((k) => k + 1)
  }, [state])

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]'>
      <form action={formAction} className='space-y-5'>
        <section className='space-y-5 rounded-xl border bg-card p-5'>
          <h3 className='font-semibold text-foreground text-sm'>Clinic details</h3>
          <Field>
            <FieldLabel>Business name</FieldLabel>
            <Input name='siteName' defaultValue={initial.siteName} required />
          </Field>
          <Field>
            <FieldLabel>About</FieldLabel>
            <FieldDescription>A short description of your clinic.</FieldDescription>
            <Textarea name='about' defaultValue={initial.about} rows={3} />
          </Field>
          <Field>
            <FieldLabel>Contact email</FieldLabel>
            <Input type='email' name='contactEmail' defaultValue={initial.contactEmail} />
          </Field>
          <Field>
            <FieldLabel>Contact phone</FieldLabel>
            <Input name='contactPhone' defaultValue={initial.contactPhone} />
          </Field>
          <Field>
            <FieldLabel>Address</FieldLabel>
            <FieldDescription>Your clinic's mailing address.</FieldDescription>
            <Textarea name='address' defaultValue={initial.address} rows={2} />
          </Field>
        </section>

        <section className='space-y-5 rounded-xl border bg-card p-5'>
          <h3 className='font-semibold text-foreground text-sm'>Social links</h3>
          {SOCIALS.map((s) => (
            <Field key={s.key}>
              <FieldLabel>{s.label}</FieldLabel>
              <Input name={`social:${s.key}`} defaultValue={initial.socials[s.key] ?? ''} />
            </Field>
          ))}
        </section>

        <section className='space-y-5 rounded-xl border bg-card p-5'>
          <h3 className='font-semibold text-foreground text-sm'>Share image</h3>
          <Field>
            <FieldLabel>Default share image</FieldLabel>
            <FieldDescription>Shown when your site is shared on social media.</FieldDescription>
            <ImageField name='defaultOgImage' defaultValue={initial.defaultOgImage} />
          </Field>
        </section>

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

      <EditorPreview path='/' reloadKey={reloadKey} />
    </div>
  )
}
