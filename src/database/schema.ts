import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  decimal,
  uuid,
  jsonb,
  integer,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: text('role', { enum: ['user', 'admin'] })
    .notNull()
    .default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)]
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)]
)

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
)

// Payment system tables
export const customer = pgTable(
  'customer',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    provider: text('provider').notNull(), // 'stripe', 'polar', 'dodo', 'creem', 'autumn'
    providerCustomerId: text('provider_customer_id').notNull(), // Customer ID from payment provider
    email: text('email'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('customer_userId_idx').on(table.userId),
    index('customer_provider_customerId_idx').on(table.providerCustomerId),
  ]
)

export const subscription = pgTable(
  'subscription',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    customerId: text('customer_id').references(() => customer.id, { onDelete: 'set null' }),
    provider: text('provider').notNull(), // 'stripe', 'polar', 'dodo', 'creem', 'autumn'
    providerSubscriptionId: text('provider_subscription_id').notNull(), // Subscription ID from payment provider
    status: text('status').notNull(), // 'active', 'canceled', 'past_due', 'trialing', 'incomplete'
    plan: text('plan').notNull(), // 'free', 'starter', 'pro', 'enterprise', etc.
    interval: text('interval'), // 'month', 'year', null for one-time
    amount: decimal('amount', { precision: 10, scale: 2 }), // Price amount
    currency: text('currency'), // 'usd', 'eur', etc.
    currentPeriodStart: timestamp('current_period_start'),
    currentPeriodEnd: timestamp('current_period_end'),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
    canceledAt: timestamp('canceled_at'),
    trialStart: timestamp('trial_start'),
    trialEnd: timestamp('trial_end'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('subscription_userId_idx').on(table.userId),
    index('subscription_customerId_idx').on(table.customerId),
    index('subscription_provider_subscriptionId_idx').on(table.providerSubscriptionId),
    index('subscription_status_idx').on(table.status),
  ]
)

export const payment = pgTable(
  'payment',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    customerId: text('customer_id').references(() => customer.id, { onDelete: 'set null' }),
    subscriptionId: text('subscription_id').references(() => subscription.id, {
      onDelete: 'set null',
    }),
    provider: text('provider').notNull(), // 'stripe', 'polar', 'dodo', 'creem', 'autumn'
    providerPaymentId: text('provider_payment_id').notNull(), // Payment ID from provider
    type: text('type').notNull(), // 'subscription', 'one_time', 'refund'
    status: text('status').notNull(), // 'succeeded', 'pending', 'failed', 'canceled'
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('payment_userId_idx').on(table.userId),
    index('payment_customerId_idx').on(table.customerId),
    index('payment_subscriptionId_idx').on(table.subscriptionId),
    index('payment_provider_paymentId_idx').on(table.providerPaymentId),
  ]
)

export const premiumPurchase = pgTable(
  'premium_purchase',
  {
    id: text('id').primaryKey(),
    stripeSessionId: text('stripe_session_id').notNull().unique(),
    stripeCustomerEmail: text('stripe_customer_email'),
    githubEmail: text('github_email'),
    githubUsername: text('github_username'),
    twitterHandle: text('twitter_handle'),
    amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }),
    currency: text('currency'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('premium_purchase_stripe_sessionId_idx').on(table.stripeSessionId)]
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

// Payment system relations
export const customerRelations = relations(customer, ({ one, many }) => ({
  user: one(user, {
    fields: [customer.userId],
    references: [user.id],
  }),
  subscriptions: many(subscription),
  payments: many(payment),
}))

export const subscriptionRelations = relations(subscription, ({ one, many }) => ({
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
  customer: one(customer, {
    fields: [subscription.customerId],
    references: [customer.id],
  }),
  payments: many(payment),
}))

export const paymentRelations = relations(payment, ({ one }) => ({
  user: one(user, {
    fields: [payment.userId],
    references: [user.id],
  }),
  customer: one(customer, {
    fields: [payment.customerId],
    references: [customer.id],
  }),
  subscription: one(subscription, {
    fields: [payment.subscriptionId],
    references: [subscription.id],
  }),
}))

// ─── CMS ─────────────────────────────────────────────────────────────
export const cmsPage = pgTable('cms_page', {
  slug: text('slug').primaryKey(),
  label: text('label').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  updatedBy: text('updated_by').references(() => user.id),
})

export const cmsPageField = pgTable(
  'cms_page_field',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    pageSlug: text('page_slug')
      .notNull()
      .references(() => cmsPage.slug, { onDelete: 'cascade' }),
    fieldKey: text('field_key').notNull(),
    fieldType: text('field_type', {
      enum: ['text', 'textarea', 'richText', 'image', 'url', 'boolean', 'number'],
    }).notNull(),
    valueEn: text('value_en'),
    valueFr: text('value_fr'),
    valueImage: text('value_image'),
    valueUrl: text('value_url'),
    valueBool: boolean('value_bool'),
    valueNum: integer('value_num'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [uniqueIndex('cms_page_field_unique').on(t.pageSlug, t.fieldKey)]
)

export const cmsCollection = pgTable('cms_collection', {
  slug: text('slug').primaryKey(),
  label: text('label').notNull(),
  description: text('description'),
  itemSchema: jsonb('item_schema').notNull(),
})

export const cmsCollectionItem = pgTable('cms_collection_item', {
  id: uuid('id').primaryKey().defaultRandom(),
  collectionSlug: text('collection_slug')
    .notNull()
    .references(() => cmsCollection.slug, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  updatedBy: text('updated_by').references(() => user.id),
})

export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey().default('singleton'),
  siteName: text('site_name').notNull(),
  about: text('about'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  address: text('address'),
  socials: jsonb('socials'),
  defaultOgImage: text('default_og_image'),
  announcementText: text('announcement_text'),
  announcementLinkLabel: text('announcement_link_label'),
  announcementLink: text('announcement_link'),
  announcementEnabled: boolean('announcement_enabled').notNull().default(true),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Snapshot of a page's field values taken just before each save, so the
// dashboard can step a page back to an earlier version (undo).
export const cmsPageVersion = pgTable(
  'cms_page_version',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    pageSlug: text('page_slug')
      .notNull()
      .references(() => cmsPage.slug, { onDelete: 'cascade' }),
    data: jsonb('data').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    createdBy: text('created_by').references(() => user.id),
  },
  (t) => [index('cms_page_version_page_idx').on(t.pageSlug, t.createdAt)]
)
