import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'
import { env } from '@/config/env'

const databaseUrl = env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Please set it in your .env file.')
}

// Supabase's pooler caps total clients, so keep each process's pool small and
// release idle connections promptly.
const queryClient = postgres(databaseUrl, { max: 5, idle_timeout: 20 })

export const db = drizzle({ client: queryClient, schema })
