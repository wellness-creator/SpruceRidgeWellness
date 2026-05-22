'use client'

import { useActionState } from 'react'

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { saveAnnouncementAction, type ActionState } from '../actions'
import { SaveButton } from './save-button'

export interface AnnouncementValues {
  text: string
  linkLabel: string
  link: string
  enabled: boolean
}

export function AnnouncementForm({ initial }: { initial: AnnouncementValues }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveAnnouncementAction, {
    ok: false,
    message: '',
  })

  return (
    <form action={formAction} className='space-y-4 rounded-xl border bg-card p-5'>
      <div>
        <h2 className='font-semibold text-base'>Announcement bar</h2>
        <p className='text-muted-foreground text-sm'>
          The strip across the very top of every page on your website.
        </p>
      </div>

      <Field>
        <FieldLabel>Message</FieldLabel>
        <Input
          name='announcementText'
          defaultValue={initial.text}
          placeholder='e.g. Now offering Botox & Plexr'
        />
      </Field>

      <Field>
        <FieldLabel>Link text</FieldLabel>
        <FieldDescription>
          The clickable words at the end of the message, e.g. “Learn more”. Leave blank for none.
        </FieldDescription>
        <Input name='announcementLinkLabel' defaultValue={initial.linkLabel} />
      </Field>

      <Field>
        <FieldLabel>Link destination</FieldLabel>
        <FieldDescription>Where the bar links to, e.g. /promotions</FieldDescription>
        <Input name='announcementLink' defaultValue={initial.link} placeholder='/promotions' />
      </Field>

      <Field>
        <FieldLabel>Show the announcement bar</FieldLabel>
        <FieldDescription>Turn off to hide the strip from the website.</FieldDescription>
        <Switch name='announcementEnabled' defaultChecked={initial.enabled} />
      </Field>

      <div className='flex items-center gap-3 border-t pt-4'>
        <SaveButton>Save announcement</SaveButton>
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
  )
}
