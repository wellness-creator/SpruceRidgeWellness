import 'server-only'

import { env } from '@/config/env'
import { cmsRepository, type PageFieldRow } from './repository'
import {
  COLLECTIONS,
  HOME_PAGE,
  PAGES,
  SEED_TESTIMONIALS,
  isTextField,
  type AnnouncementInput,
  type CollectionItemInput,
  type FieldDef,
  type HomePageContent,
  type PageDef,
  type SiteSettingsInput,
  type TestimonialItem,
} from './schema'

/** Reviews shown before the clinic owner has added their own in the dashboard. */
const DEFAULT_TESTIMONIALS: TestimonialItem[] = SEED_TESTIMONIALS.map((t, i) => ({
  id: `default-${i + 1}`,
  ...t,
}))

function resolveField(row: PageFieldRow | undefined, def: FieldDef): string {
  if (isTextField(def.type)) return row?.valueEn || def.defaultText || ''
  if (def.type === 'image') return row?.valueImage || def.defaultValue || ''
  if (def.type === 'url') return row?.valueUrl || def.defaultValue || ''
  if (def.type === 'boolean') return row?.valueBool ? 'true' : 'false'
  if (def.type === 'number') return String(row?.valueNum ?? 0)
  return ''
}

/** Turns a stored image value into a URL the public site can render. */
function publicImageUrl(value: string): string {
  if (!value) return ''
  if (value.startsWith('/') || value.startsWith('http')) return value
  return env.R2_BUCKET_URL ? `${env.R2_BUCKET_URL}/${value}` : value
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

type CollectionRow = { id: string } & Record<string, string>

async function loadPageContent(slug: string): Promise<Record<string, string>> {
  const def = PAGES[slug]
  if (!def) return {}
  const rows = await cmsRepository.getPageFields(slug)
  const byKey = new Map(rows.map((r) => [r.fieldKey, r]))
  const out: Record<string, string> = {}
  for (const field of def.fields) {
    out[field.key] = resolveField(byKey.get(field.key), field)
  }
  return out
}

async function loadCollection(slug: string): Promise<CollectionRow[]> {
  const def = COLLECTIONS[slug]
  if (!def) return []
  const items = await cmsRepository.listCollectionItems(slug, { published: true })
  return items.map((it) => {
    const raw = (it.data ?? {}) as Record<string, { en?: string; value?: string }>
    const out: CollectionRow = { id: it.id }
    for (const f of def.fields) {
      const entry = raw[f.key] ?? {}
      if (isTextField(f.type)) {
        out[f.key] = entry.en ?? ''
      } else if (f.type === 'image') {
        out[f.key] = publicImageUrl(entry.value ?? '')
      } else {
        out[f.key] = entry.value ?? ''
      }
    }
    return out
  })
}

export const cmsService = {
  /** Resolved value for every field of a page, keyed by field key. */
  getPageContent: loadPageContent,

  async getHomeContent(): Promise<HomePageContent> {
    const m = await cmsService.getPageContent('home')
    return {
      hero: {
        headline: m['hero.headline'] ?? '',
        subhead: m['hero.subhead'] ?? '',
        image: publicImageUrl(m['hero.image'] ?? ''),
        ctaLabel: m['hero.ctaLabel'] ?? '',
        ctaHref: m['hero.ctaHref'] || '/contact',
        treatments: splitLines(m['hero.treatments'] ?? ''),
      },
      marquee: splitLines(m['marquee.items'] ?? ''),
      services: {
        eyebrow: m['services.eyebrow'] ?? '',
        heading: m['services.heading'] ?? '',
        viewAllLabel: m['services.viewAllLabel'] ?? '',
        cards: [1, 2].map((n) => ({
          title: m[`service${n}.title`] ?? '',
          description: m[`service${n}.description`] ?? '',
          image: publicImageUrl(m[`service${n}.image`] ?? ''),
          treatments: splitLines(m[`service${n}.treatments`] ?? ''),
        })),
      },
      why: {
        eyebrow: m['why.eyebrow'] ?? '',
        heading: m['why.heading'] ?? '',
        pillars: [1, 2, 3, 4].map((n) => ({
          title: m[`pillar${n}.title`] ?? '',
          body: m[`pillar${n}.body`] ?? '',
          image: publicImageUrl(m[`pillar${n}.image`] ?? ''),
        })),
        doctor: {
          eyebrow: m['why.doctorEyebrow'] ?? '',
          heading: m['why.doctorHeading'] ?? '',
          body: m['why.doctorBody'] ?? '',
          image: publicImageUrl(m['why.doctorImage'] ?? ''),
          name: m['why.doctorName'] ?? '',
          role: m['why.doctorRole'] ?? '',
          bullets: [m['why.bullet1'], m['why.bullet2'], m['why.bullet3']]
            .map((b) => b ?? '')
            .filter(Boolean),
          ctaLabel: m['why.doctorCtaLabel'] ?? '',
        },
      },
      numbers: {
        eyebrow: m['numbers.eyebrow'] ?? '',
        heading: m['numbers.heading'] ?? '',
        intro: m['numbers.intro'] ?? '',
        featured: {
          value: m['numbers.featuredValue'] ?? '',
          suffix: m['numbers.featuredSuffix'] ?? '',
          label: m['numbers.featuredLabel'] ?? '',
          desc: m['numbers.featuredDesc'] ?? '',
        },
        metrics: [1, 2, 3].map((n) => ({
          value: m[`metric${n}.value`] ?? '',
          suffix: m[`metric${n}.suffix`] ?? '',
          label: m[`metric${n}.label`] ?? '',
          desc: m[`metric${n}.desc`] ?? '',
        })),
        signatureName: m['numbers.signatureName'] ?? '',
        signatureRole: m['numbers.signatureRole'] ?? '',
        signatureNote: m['numbers.signatureNote'] ?? '',
      },
      testimonials: {
        heading: m['testimonials.heading'] ?? '',
        practicingLabel: m['testimonials.practicingLabel'] ?? '',
        locations: m['testimonials.locations'] ?? '',
        tagline: m['testimonials.tagline'] ?? '',
        image: publicImageUrl(m['testimonials.image'] ?? ''),
      },
    }
  },

  /** Resolved rows for any collection, keyed by field. */
  listCollection: loadCollection,

  /** Patient reviews, typed for the Testimonial component. Falls back to starters. */
  async listTestimonials(): Promise<TestimonialItem[]> {
    const rows = await cmsService.listCollection('testimonials')
    if (rows.length === 0) return DEFAULT_TESTIMONIALS
    return rows.map((r) => ({
      id: r.id,
      quote: r.quote ?? '',
      name: r.name ?? '',
      location: r.location ?? '',
    }))
  },

  async getSiteSettings() {
    const row = await cmsRepository.getSiteSettings()
    return (
      row ?? {
        id: 'singleton',
        siteName: 'Spruce Ridge Wellness',
        about: null,
        contactEmail: null,
        contactPhone: null,
        address: null,
        socials: null,
        defaultOgImage: null,
        announcementText: null,
        announcementLinkLabel: null,
        announcementLink: null,
        announcementEnabled: true,
        updatedAt: new Date(),
      }
    )
  },

  async saveAnnouncement(input: AnnouncementInput) {
    await cmsRepository.updateAnnouncement({
      text: input.announcementText?.trim() || null,
      linkLabel: input.announcementLinkLabel?.trim() || null,
      link: input.announcementLink?.trim() || null,
      enabled: input.announcementEnabled,
    })
  },

  // ─── Dashboard editor data ─────────────────────────────────────────
  listPages(): PageDef[] {
    return Object.values(PAGES)
  },

  getPageDef(slug: string): PageDef | null {
    return PAGES[slug] ?? null
  },

  async getPageEditorData(slug: string) {
    const def = PAGES[slug]
    if (!def) return null
    const [page, rows, versionCount] = await Promise.all([
      cmsRepository.getPage(slug),
      cmsRepository.getPageFields(slug),
      cmsRepository.countPageVersions(slug),
    ])
    const values: Record<string, PageFieldRow> = {}
    for (const row of rows) values[row.fieldKey] = row
    return { def, page, values, canUndo: versionCount > 0 }
  },

  listCollections() {
    return Object.values(COLLECTIONS)
  },

  getCollectionDef(slug: string) {
    return COLLECTIONS[slug] ?? null
  },

  async listCollectionItemsForEditor(slug: string) {
    return cmsRepository.listCollectionItems(slug)
  },

  async getCollectionItemForEditor(id: string) {
    return cmsRepository.getCollectionItem(id)
  },

  // ─── Mutations ─────────────────────────────────────────────────────
  async savePage(
    slug: string,
    fields: Array<{
      fieldKey: string
      fieldType: PageFieldRow['fieldType']
      valueEn?: string | null
      valueImage?: string | null
      valueUrl?: string | null
      valueBool?: boolean | null
      valueNum?: number | null
    }>,
    userId?: string
  ) {
    const def = PAGES[slug]
    if (!def) throw new Error(`Unknown page: ${slug}`)

    // Snapshot the current values before overwriting them, so this save can be undone.
    const current = await cmsRepository.getPageFields(slug)
    if (current.length > 0) {
      const snapshot: Record<string, unknown> = {}
      for (const row of current) {
        snapshot[row.fieldKey] = {
          fieldType: row.fieldType,
          valueEn: row.valueEn,
          valueImage: row.valueImage,
          valueUrl: row.valueUrl,
          valueBool: row.valueBool,
          valueNum: row.valueNum,
        }
      }
      await cmsRepository.insertPageVersion({ pageSlug: slug, data: snapshot, userId })
    }

    await cmsRepository.upsertPage({
      slug: def.slug,
      label: def.label,
      description: def.description,
      updatedBy: userId,
    })
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i]
      await cmsRepository.upsertPageField({
        pageSlug: slug,
        fieldKey: f.fieldKey,
        fieldType: f.fieldType,
        valueEn: f.valueEn ?? null,
        valueFr: null,
        valueImage: f.valueImage ?? null,
        valueUrl: f.valueUrl ?? null,
        valueBool: f.valueBool ?? null,
        valueNum: f.valueNum ?? null,
        sortOrder: i,
      })
    }
    await cmsRepository.touchPage(slug, userId)
  },

  /** Restores a page to the snapshot taken before its most recent save. */
  async undoPage(slug: string, userId?: string): Promise<boolean> {
    const version = await cmsRepository.getLatestPageVersion(slug)
    if (!version) return false
    const snapshot = (version.data ?? {}) as Record<
      string,
      {
        fieldType: PageFieldRow['fieldType']
        valueEn: string | null
        valueImage: string | null
        valueUrl: string | null
        valueBool: boolean | null
        valueNum: number | null
      }
    >
    let sortOrder = 0
    for (const [fieldKey, v] of Object.entries(snapshot)) {
      await cmsRepository.upsertPageField({
        pageSlug: slug,
        fieldKey,
        fieldType: v.fieldType,
        valueEn: v.valueEn ?? null,
        valueFr: null,
        valueImage: v.valueImage ?? null,
        valueUrl: v.valueUrl ?? null,
        valueBool: v.valueBool ?? null,
        valueNum: v.valueNum ?? null,
        sortOrder: sortOrder++,
      })
    }
    await cmsRepository.deletePageVersion(version.id)
    await cmsRepository.touchPage(slug, userId)
    return true
  },

  async saveCollectionItem(input: CollectionItemInput, userId?: string) {
    const def = COLLECTIONS[input.collectionSlug]
    if (!def) throw new Error(`Unknown collection: ${input.collectionSlug}`)
    // The collection row must exist before items can reference it.
    await cmsRepository.upsertCollection({
      slug: def.slug,
      label: def.label,
      description: def.description,
      itemSchema: { fields: def.fields },
    })
    if (input.itemId) {
      await cmsRepository.updateCollectionItem(input.itemId, {
        sortOrder: input.sortOrder,
        isPublished: input.isPublished,
        data: input.data,
        updatedBy: userId,
      })
      return { id: input.itemId }
    }
    return cmsRepository.insertCollectionItem({
      collectionSlug: input.collectionSlug,
      sortOrder: input.sortOrder,
      isPublished: input.isPublished,
      data: input.data,
      updatedBy: userId,
    })
  },

  async deleteCollectionItem(id: string) {
    await cmsRepository.deleteCollectionItem(id)
  },

  async saveSiteSettings(input: SiteSettingsInput) {
    await cmsRepository.upsertSiteSettings({
      siteName: input.siteName,
      about: input.about ?? null,
      contactEmail: input.contactEmail ?? null,
      contactPhone: input.contactPhone ?? null,
      address: input.address ?? null,
      socials: input.socials ?? null,
      defaultOgImage: input.defaultOgImage ?? null,
    })
  },
}

export { HOME_PAGE }
