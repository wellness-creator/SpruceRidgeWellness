import { config } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '../src/database/schema'

config()

const FIXTURES_DIR = path.resolve(process.cwd(), 'scripts/fixtures')
const OUTPUT_PATH = path.join(FIXTURES_DIR, 'image-snapshot.json')

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')

  fs.mkdirSync(FIXTURES_DIR, { recursive: true })

  const client = postgres(url, { max: 1 })
  const db = drizzle({ client, schema })

  try {
    const pageFields = await db
      .select({
        id: schema.cmsPageField.id,
        pageSlug: schema.cmsPageField.pageSlug,
        fieldKey: schema.cmsPageField.fieldKey,
        valueImage: schema.cmsPageField.valueImage,
      })
      .from(schema.cmsPageField)

    const collectionItems = await db
      .select({
        id: schema.cmsCollectionItem.id,
        collectionSlug: schema.cmsCollectionItem.collectionSlug,
        data: schema.cmsCollectionItem.data,
      })
      .from(schema.cmsCollectionItem)

    const settings = await db.select().from(schema.siteSettings)

    const pageVersions = await db
      .select({
        id: schema.cmsPageVersion.id,
        pageSlug: schema.cmsPageVersion.pageSlug,
        createdAt: schema.cmsPageVersion.createdAt,
        data: schema.cmsPageVersion.data,
      })
      .from(schema.cmsPageVersion)

    const snapshot = {
      takenAt: new Date().toISOString(),
      cmsPageField: pageFields.filter((r) => r.valueImage),
      cmsCollectionItem: collectionItems,
      siteSettings: settings,
      cmsPageVersion: pageVersions,
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(snapshot, null, 2))
    console.log(`✓ Snapshot written to ${OUTPUT_PATH}`)
    console.log(`  cms_page_field rows w/ image: ${snapshot.cmsPageField.length}`)
    console.log(`  cms_collection_item rows:     ${snapshot.cmsCollectionItem.length}`)
    console.log(`  site_settings rows:           ${snapshot.siteSettings.length}`)
    console.log(`  cms_page_version rows:        ${snapshot.cmsPageVersion.length}`)
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
