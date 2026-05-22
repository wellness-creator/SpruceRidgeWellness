import 'server-only'

import { and, asc, desc, eq } from 'drizzle-orm'

import { db } from '@/database'
import {
  cmsCollection,
  cmsCollectionItem,
  cmsPage,
  cmsPageField,
  cmsPageVersion,
  siteSettings,
} from '@/database/schema'
import type { CmsFieldType } from './schema'

export interface PageFieldRow {
  fieldKey: string
  fieldType: CmsFieldType
  valueEn: string | null
  valueFr: string | null
  valueImage: string | null
  valueUrl: string | null
  valueBool: boolean | null
  valueNum: number | null
}

export interface UpsertPageFieldArgs extends PageFieldRow {
  pageSlug: string
  sortOrder?: number
}

// Network/DNS hiccups to the database are transient — the query never ran, so
// retrying is safe for both reads and writes.
const TRANSIENT_CODES = new Set([
  'ENOTFOUND',
  'EAI_AGAIN',
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'CONNECT_TIMEOUT',
])

function isTransient(err: unknown): boolean {
  let cur: unknown = err
  for (let i = 0; i < 6 && cur && typeof cur === 'object'; i++) {
    const code = (cur as { code?: unknown }).code
    if (typeof code === 'string' && TRANSIENT_CODES.has(code)) return true
    cur = (cur as { cause?: unknown }).cause
  }
  return false
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i === attempts - 1 || !isTransient(err)) break
      await new Promise((resolve) => setTimeout(resolve, 300 * (i + 1)))
    }
  }
  throw lastErr
}

const baseRepository = {
  async getPage(slug: string) {
    const [row] = await db.select().from(cmsPage).where(eq(cmsPage.slug, slug)).limit(1)
    return row ?? null
  },

  async upsertPage(args: { slug: string; label: string; description?: string; updatedBy?: string }) {
    await db
      .insert(cmsPage)
      .values({
        slug: args.slug,
        label: args.label,
        description: args.description,
        updatedBy: args.updatedBy,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: cmsPage.slug,
        set: { label: args.label, description: args.description, updatedAt: new Date() },
      })
  },

  async getPageFields(slug: string): Promise<PageFieldRow[]> {
    return db
      .select({
        fieldKey: cmsPageField.fieldKey,
        fieldType: cmsPageField.fieldType,
        valueEn: cmsPageField.valueEn,
        valueFr: cmsPageField.valueFr,
        valueImage: cmsPageField.valueImage,
        valueUrl: cmsPageField.valueUrl,
        valueBool: cmsPageField.valueBool,
        valueNum: cmsPageField.valueNum,
      })
      .from(cmsPageField)
      .where(eq(cmsPageField.pageSlug, slug))
      .orderBy(asc(cmsPageField.sortOrder))
  },

  async upsertPageField(args: UpsertPageFieldArgs) {
    await db
      .insert(cmsPageField)
      .values({
        pageSlug: args.pageSlug,
        fieldKey: args.fieldKey,
        fieldType: args.fieldType,
        valueEn: args.valueEn,
        valueFr: args.valueFr,
        valueImage: args.valueImage,
        valueUrl: args.valueUrl,
        valueBool: args.valueBool,
        valueNum: args.valueNum,
        sortOrder: args.sortOrder ?? 0,
      })
      .onConflictDoUpdate({
        target: [cmsPageField.pageSlug, cmsPageField.fieldKey],
        set: {
          fieldType: args.fieldType,
          valueEn: args.valueEn,
          valueFr: args.valueFr,
          valueImage: args.valueImage,
          valueUrl: args.valueUrl,
          valueBool: args.valueBool,
          valueNum: args.valueNum,
        },
      })
  },

  async touchPage(slug: string, updatedBy?: string) {
    await db
      .update(cmsPage)
      .set({ updatedAt: new Date(), updatedBy })
      .where(eq(cmsPage.slug, slug))
  },

  async insertPageVersion(args: { pageSlug: string; data: unknown; userId?: string }) {
    await db.insert(cmsPageVersion).values({
      pageSlug: args.pageSlug,
      data: args.data,
      createdBy: args.userId,
      createdAt: new Date(),
    })
    // Keep only the 20 most recent snapshots per page.
    const rows = await db
      .select({ id: cmsPageVersion.id })
      .from(cmsPageVersion)
      .where(eq(cmsPageVersion.pageSlug, args.pageSlug))
      .orderBy(desc(cmsPageVersion.createdAt))
    for (const stale of rows.slice(20)) {
      await db.delete(cmsPageVersion).where(eq(cmsPageVersion.id, stale.id))
    }
  },

  async getLatestPageVersion(pageSlug: string) {
    const [row] = await db
      .select()
      .from(cmsPageVersion)
      .where(eq(cmsPageVersion.pageSlug, pageSlug))
      .orderBy(desc(cmsPageVersion.createdAt))
      .limit(1)
    return row ?? null
  },

  async deletePageVersion(id: string) {
    await db.delete(cmsPageVersion).where(eq(cmsPageVersion.id, id))
  },

  async countPageVersions(pageSlug: string) {
    const rows = await db
      .select({ id: cmsPageVersion.id })
      .from(cmsPageVersion)
      .where(eq(cmsPageVersion.pageSlug, pageSlug))
    return rows.length
  },

  async getCollection(slug: string) {
    const [row] = await db
      .select()
      .from(cmsCollection)
      .where(eq(cmsCollection.slug, slug))
      .limit(1)
    return row ?? null
  },

  async upsertCollection(args: {
    slug: string
    label: string
    description?: string
    itemSchema: unknown
  }) {
    await db
      .insert(cmsCollection)
      .values({
        slug: args.slug,
        label: args.label,
        description: args.description,
        itemSchema: args.itemSchema,
      })
      .onConflictDoUpdate({
        target: cmsCollection.slug,
        set: { label: args.label, description: args.description, itemSchema: args.itemSchema },
      })
  },

  async listCollectionItems(slug: string, opts?: { published?: boolean }) {
    const filters = [eq(cmsCollectionItem.collectionSlug, slug)]
    if (opts?.published) {
      filters.push(eq(cmsCollectionItem.isPublished, true))
    }
    return db
      .select()
      .from(cmsCollectionItem)
      .where(and(...filters))
      .orderBy(asc(cmsCollectionItem.sortOrder))
  },

  async getCollectionItem(id: string) {
    const [row] = await db
      .select()
      .from(cmsCollectionItem)
      .where(eq(cmsCollectionItem.id, id))
      .limit(1)
    return row ?? null
  },

  async insertCollectionItem(args: {
    collectionSlug: string
    sortOrder: number
    isPublished: boolean
    data: unknown
    updatedBy?: string
  }) {
    const [row] = await db
      .insert(cmsCollectionItem)
      .values({
        collectionSlug: args.collectionSlug,
        sortOrder: args.sortOrder,
        isPublished: args.isPublished,
        data: args.data,
        updatedBy: args.updatedBy,
        updatedAt: new Date(),
      })
      .returning({ id: cmsCollectionItem.id })
    return row
  },

  async updateCollectionItem(
    id: string,
    args: { sortOrder: number; isPublished: boolean; data: unknown; updatedBy?: string }
  ) {
    await db
      .update(cmsCollectionItem)
      .set({
        sortOrder: args.sortOrder,
        isPublished: args.isPublished,
        data: args.data,
        updatedBy: args.updatedBy,
        updatedAt: new Date(),
      })
      .where(eq(cmsCollectionItem.id, id))
  },

  async deleteCollectionItem(id: string) {
    await db.delete(cmsCollectionItem).where(eq(cmsCollectionItem.id, id))
  },

  async updateAnnouncement(args: {
    text: string | null
    linkLabel: string | null
    link: string | null
    enabled: boolean
  }) {
    await db
      .update(siteSettings)
      .set({
        announcementText: args.text,
        announcementLinkLabel: args.linkLabel,
        announcementLink: args.link,
        announcementEnabled: args.enabled,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, 'singleton'))
  },

  async getSiteSettings() {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, 'singleton'))
      .limit(1)
    return row ?? null
  },

  async upsertSiteSettings(args: {
    siteName: string
    about?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    address?: string | null
    socials?: unknown
    defaultOgImage?: string | null
  }) {
    await db
      .insert(siteSettings)
      .values({
        id: 'singleton',
        siteName: args.siteName,
        about: args.about,
        contactEmail: args.contactEmail,
        contactPhone: args.contactPhone,
        address: args.address,
        socials: args.socials,
        defaultOgImage: args.defaultOgImage,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: {
          siteName: args.siteName,
          about: args.about,
          contactEmail: args.contactEmail,
          contactPhone: args.contactPhone,
          address: args.address,
          socials: args.socials,
          defaultOgImage: args.defaultOgImage,
          updatedAt: new Date(),
        },
      })
  },
}

// Every repository call is wrapped so a transient connection blip retries
// instead of crashing the page.
export const cmsRepository: typeof baseRepository = new Proxy(baseRepository, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver)
    if (typeof value !== 'function') return value
    return (...args: unknown[]) =>
      withRetry(() => (value as (...a: unknown[]) => Promise<unknown>).apply(target, args))
  },
})
