import { config } from 'dotenv'
import { and, eq, isNull, or } from 'drizzle-orm'
import process from 'node:process'

config()

const { db } = await import('@/database')
const { cmsCollection, cmsCollectionItem, cmsPage, cmsPageField, siteSettings } = await import(
  '@/database/schema'
)
const { COLLECTIONS, PAGES, SEED_PROMOTIONS, SEED_TESTIMONIALS, isTextField } = await import(
  '@/lib/cms/schema'
)

type ItemData = Record<string, { en: string } | { value: string }>

async function seedCollection(slug: string, items: ItemData[]) {
  const def = COLLECTIONS[slug]
  await db
    .insert(cmsCollection)
    .values({
      slug: def.slug,
      label: def.label,
      description: def.description,
      itemSchema: { fields: def.fields },
    })
    .onConflictDoUpdate({
      target: cmsCollection.slug,
      set: { label: def.label, description: def.description, itemSchema: { fields: def.fields } },
    })

  const existing = await db
    .select({ id: cmsCollectionItem.id })
    .from(cmsCollectionItem)
    .where(eq(cmsCollectionItem.collectionSlug, slug))

  if (existing.length > 0) {
    console.log(`✓ ${def.label}: ${existing.length} item(s) already present — left untouched`)
    return
  }
  for (let i = 0; i < items.length; i++) {
    await db.insert(cmsCollectionItem).values({
      collectionSlug: slug,
      sortOrder: i,
      isPublished: true,
      data: items[i],
      updatedAt: new Date(),
    })
  }
  console.log(`✓ ${def.label}: seeded ${items.length} item(s)`)
}

async function main() {
  // Every CMS page — default values only. Existing rows are left untouched so
  // re-running never overwrites content the clinic has already edited.
  for (const page of Object.values(PAGES)) {
    await db
      .insert(cmsPage)
      .values({
        slug: page.slug,
        label: page.label,
        description: page.description,
        updatedAt: new Date(),
      })
      .onConflictDoNothing()

    for (let i = 0; i < page.fields.length; i++) {
      const f = page.fields[i]
      const num =
        f.type === 'number' && f.defaultValue ? Number(f.defaultValue) : null
      await db
        .insert(cmsPageField)
        .values({
          pageSlug: page.slug,
          fieldKey: f.key,
          fieldType: f.type,
          valueEn: isTextField(f.type) ? (f.defaultText ?? null) : null,
          valueImage: f.type === 'image' ? (f.defaultValue ?? null) : null,
          valueUrl: f.type === 'url' ? (f.defaultValue ?? null) : null,
          valueNum: num,
          sortOrder: i,
        })
        .onConflictDoNothing()
      // Fill in any number field that was never given its value.
      if (num !== null) {
        await db
          .update(cmsPageField)
          .set({ valueNum: num })
          .where(
            and(
              eq(cmsPageField.pageSlug, page.slug),
              eq(cmsPageField.fieldKey, f.key),
              or(isNull(cmsPageField.valueNum), eq(cmsPageField.valueNum, 0))
            )
          )
      }
    }
    console.log(`✓ ${page.label} content seeded`)
  }

  await seedCollection(
    'testimonials',
    SEED_TESTIMONIALS.map((t) => ({
      quote: { en: t.quote },
      name: { en: t.name },
      location: { en: t.location },
    }))
  )

  await seedCollection(
    'promotions',
    SEED_PROMOTIONS.map((p) => ({
      eyebrow: { en: p.eyebrow },
      label: { en: p.label },
      body: { en: p.body },
      image: { value: p.image },
      href: { value: p.href },
    }))
  )

  // Default announcement-bar text — set once, never overwrites later edits.
  await db
    .update(siteSettings)
    .set({
      announcementText: 'Now offering Botox & Plexr',
      announcementLinkLabel: 'Learn more',
      announcementLink: '/promotions',
    })
    .where(and(eq(siteSettings.id, 'singleton'), isNull(siteSettings.announcementText)))
  console.log('✓ Announcement bar defaults set')

  // Default footer content — set once if the clinic hasn't filled it in.
  await db
    .update(siteSettings)
    .set({
      about:
        "Surgeon-led pelvic wellness and medical aesthetics, with clinics in Bay Roberts and St. John's, Newfoundland.",
      contactEmail: 'spruceridgewellness@gmail.com',
      contactPhone: '+1 (709) 786-9150',
      socials: { instagram: 'https://instagram.com', facebook: 'https://facebook.com' },
    })
    .where(and(eq(siteSettings.id, 'singleton'), isNull(siteSettings.about)))
  console.log('✓ Footer details defaults set')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
