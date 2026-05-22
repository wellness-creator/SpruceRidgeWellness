import { config } from 'dotenv'
import { eq } from 'drizzle-orm'
import process from 'node:process'

config()

const emails = (process.env.BOOTSTRAP_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)
const password = process.env.BOOTSTRAP_PASSWORD ?? ''
const siteName = process.env.BOOTSTRAP_SITE_NAME ?? 'Spruce Ridge Wellness'

if (emails.length === 0 || !password) {
  console.error('Set BOOTSTRAP_EMAILS (comma-separated) and BOOTSTRAP_PASSWORD before running.')
  process.exit(1)
}

const { db } = await import('@/database')
const { siteSettings, user } = await import('@/database/schema')
const { auth } = await import('@/lib/auth/auth')

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'admin'
  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ') || 'Site Owner'
  )
}

async function ensureAdmin(email: string) {
  try {
    await auth.api.signUpEmail({
      body: { email, password, name: nameFromEmail(email) },
    })
  } catch {
    // The account may already exist, or the post-sign-up cookie hook may fail
    // outside a request context. The row lookup below is the source of truth.
  }

  const [row] = await db.select().from(user).where(eq(user.email, email)).limit(1)
  if (!row) {
    throw new Error(`Could not create or find the admin account for ${email}.`)
  }

  await db
    .update(user)
    .set({ role: 'admin', emailVerified: true })
    .where(eq(user.email, email))
  console.log(`✓ Admin ready: ${email}`)
}

async function main() {
  for (const email of emails) {
    await ensureAdmin(email)
  }

  // Create the settings singleton once; never clobber edits made in the dashboard.
  await db
    .insert(siteSettings)
    .values({ id: 'singleton', siteName, updatedAt: new Date() })
    .onConflictDoNothing()
  console.log(`✓ SiteSettings upserted: ${siteName}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Bootstrap failed:', err)
    process.exit(1)
  })
