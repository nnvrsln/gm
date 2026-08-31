import { boolean, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 32 }).notNull(),
  instagram: varchar('instagram', { length: 100 }).notNull(),
  motivation: text('motivation').notNull(),
  marketingConsent: boolean('marketing_consent').default(false).notNull(),
  consentVersion: varchar('consent_version', { length: 20 }).default('1.0').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: varchar('order_number', { length: 64 }).notNull().unique(),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'set null' }),
  customerName: varchar('customer_name', { length: 100 }).notNull(),
  customerEmail: varchar('customer_email', { length: 320 }),
  customerPhone: varchar('customer_phone', { length: 32 }).notNull(),
  productCode: varchar('product_code', { length: 64 }).notNull(),
  productName: varchar('product_name', { length: 200 }).notNull(),
  amountKopecks: integer('amount_kopecks').notNull(),
  currency: varchar('currency', { length: 3 }).default('RUB').notNull(),
  status: varchar('status', { length: 32 }).default('pending').notNull(),
  prodamusPaymentId: varchar('prodamus_payment_id', { length: 128 }).unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
})

export const paymentEvents = pgTable('payment_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventKey: varchar('event_key', { length: 160 }).notNull().unique(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
  signatureValid: boolean('signature_valid').notNull(),
  payload: jsonb('payload').notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
})
