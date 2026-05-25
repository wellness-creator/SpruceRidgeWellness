import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'
import { env } from '@/config/env'

const databaseUrl = env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Please set it in your .env file.')
}

// On Vercel each serverless instance gets its own pool. Use Supabase's
// transaction-mode pooler (port 6543) with max:1 and prepare:false so we
// don't exhaust the upstream connection cap.
const queryClient = postgres(databaseUrl, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
})

export const db = drizzle({ client: queryClient, schema })
