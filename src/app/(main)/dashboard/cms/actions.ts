'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth/auth'
import { cmsService } from '@/lib/cms/service'
import {
  COLLECTIONS,
  PAGES,
  announcementInputSchema,
  collectionItemInputSchema,
  isTextField,
  savePageInputSchema,
  siteSettingsInputSchema,
} from '@/lib/cms/schema'

export interface ActionState {
  ok: boolean
  message: string
}

async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return session.user.id
}

function text(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value : ''
}

export async function savePageAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId()
  const slug = text(formData.get('pageSlug'))
  const def = PAGES[slug]
  if (!def) return { ok: false, message: 'That page could not be found.' }

  const fields = def.fields.map((f) => {
    if (isTextField(f.type)) {
      return {
        fieldKey: f.key,
        fieldType: f.type,
        valueEn: text(formData.get(`field:${f.key}:en`)),
      }
    }
    if (f.type === 'image') {
      return { fieldKey: f.key, fieldType: f.type, valueImage: text(formData.get(`field:${f.key}:image`)) }
    }
    if (f.type === 'url') {
      return { fieldKey: f.key, fieldType: f.type, valueUrl: text(formData.get(`field:${f.key}:url`)) }
    }
    if (f.type === 'boolean') {
      return { fieldKey: f.key, fieldType: f.type, valueBool: formData.get(`field:${f.key}:bool`) === 'on' }
    }
    const n = Number(text(formData.get(`field:${f.key}:num`)))
    return { fieldKey: f.key, fieldType: f.type, valueNum: Number.isFinite(n) ? Math.trunc(n) : 0 }
  })

  const parsed = savePageInputSchema.safeParse({ pageSlug: slug, fields })
  if (!parsed.success) {
    return { ok: false, message: 'Some fields could not be saved. Please review and try again.' }
  }

  try {
    await cmsService.savePage(parsed.data.pageSlug, parsed.data.fields, userId)
  } catch {
    return { ok: false, message: 'Something went wrong while saving. Please try again.' }
  }

  revalidatePath(def.previewPath)
  revalidatePath(`/dashboard/cms/pages/${slug}`)
  return { ok: true, message: 'Saved — your changes are now live on the site.' }
}

export async function undoPageAction(formData: FormData) {
  const userId = await requireUserId()
  const slug = text(formData.get('pageSlug'))
  const def = PAGES[slug]
  if (!def) return
  await cmsService.undoPage(slug, userId)
  revalidatePath(def.previewPath)
  revalidatePath(`/dashboard/cms/pages/${slug}`)
}

export async function saveCollectionItemAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId()
  const slug = text(formData.get('collectionSlug'))
  const def = COLLECTIONS[slug]
  if (!def) return { ok: false, message: 'That collection could not be found.' }

  const rawItemId = text(formData.get('itemId'))
  const data: Record<string, { en: string } | { value: string }> = {}
  for (const f of def.fields) {
    if (isTextField(f.type)) {
      data[f.key] = { en: text(formData.get(`field:${f.key}:en`)) }
    } else if (f.type === 'image') {
      data[f.key] = { value: text(formData.get(`field:${f.key}:image`)) }
    } else if (f.type === 'url') {
      data[f.key] = { value: text(formData.get(`field:${f.key}:url`)) }
    } else if (f.type === 'number') {
      data[f.key] = { value: text(formData.get(`field:${f.key}:num`)) }
    } else if (f.type === 'boolean') {
      data[f.key] = {
        value: formData.get(`field:${f.key}:bool`) === 'on' ? 'true' : 'false',
      }
    } else {
      data[f.key] = { value: text(formData.get(`field:${f.key}:value`)) }
    }
  }

  const parsed = collectionItemInputSchema.safeParse({
    collectionSlug: slug,
    itemId: rawItemId || undefined,
    isPublished: formData.get('isPublished') === 'on',
    sortOrder: Number(text(formData.get('sortOrder'))) || 0,
    data,
  })
  if (!parsed.success) {
    return { ok: false, message: 'Some fields could not be saved. Please review and try again.' }
  }

  let savedId: string
  try {
    const result = await cmsService.saveCollectionItem(parsed.data, userId)
    savedId = result.id
  } catch {
    return { ok: false, message: 'Something went wrong while saving. Please try again.' }
  }

  revalidatePath(def.previewPath)
  revalidatePath(`/dashboard/cms/collections/${slug}`)

  // A brand-new item: move to its own edit page so further saves update it.
  if (!parsed.data.itemId) {
    redirect(`/dashboard/cms/collections/${slug}/${savedId}`)
  }
  return { ok: true, message: 'Saved — your changes are now live on the site.' }
}

export async function deleteCollectionItemAction(formData: FormData) {
  await requireUserId()
  const slug = text(formData.get('collectionSlug'))
  const itemId = text(formData.get('itemId'))
  if (itemId) {
    await cmsService.deleteCollectionItem(itemId)
    revalidatePath(COLLECTIONS[slug]?.previewPath ?? '/')
    revalidatePath(`/dashboard/cms/collections/${slug}`)
  }
  redirect(`/dashboard/cms/collections/${slug}`)
}

export async function saveAnnouncementAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireUserId()
  const parsed = announcementInputSchema.safeParse({
    announcementText: text(formData.get('announcementText')),
    announcementLinkLabel: text(formData.get('announcementLinkLabel')),
    announcementLink: text(formData.get('announcementLink')),
    announcementEnabled: formData.get('announcementEnabled') === 'on',
  })
  if (!parsed.success) {
    return { ok: false, message: 'Please review the fields and try again.' }
  }
  try {
    await cmsService.saveAnnouncement(parsed.data)
  } catch {
    return { ok: false, message: 'Something went wrong while saving. Please try again.' }
  }
  // The bar shows on every page, so refresh the whole site.
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Saved — the announcement bar is updated.' }
}

export async function saveSiteSettingsAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireUserId()

  const socials: Record<string, string> = {}
  for (const k of ['instagram', 'facebook', 'linkedin', 'twitter']) {
    const v = text(formData.get(`social:${k}`)).trim()
    if (v) socials[k] = v
  }

  const parsed = siteSettingsInputSchema.safeParse({
    siteName: text(formData.get('siteName')).trim(),
    about: text(formData.get('about')),
    contactEmail: text(formData.get('contactEmail')).trim(),
    contactPhone: text(formData.get('contactPhone')),
    address: text(formData.get('address')),
    defaultOgImage: text(formData.get('defaultOgImage')),
    socials: Object.keys(socials).length ? socials : undefined,
  })
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { ok: false, message: first?.message ?? 'Please review the fields and try again.' }
  }

  try {
    await cmsService.saveSiteSettings(parsed.data)
  } catch {
    return { ok: false, message: 'Something went wrong while saving. Please try again.' }
  }

  // Footer settings show on every page, so refresh the whole site.
  revalidatePath('/', 'layout')
  revalidatePath('/dashboard/settings/site')
  return { ok: true, message: 'Saved — your footer details are updated.' }
}
