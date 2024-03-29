import { mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core'
import { CardVersion } from './CardVersion'
import { Invoice } from './Invoice'

export const CardVersionHasInvoice = mysqlTable('CardVersionHasInvoice', {
  cardVersion: varchar('cardVersion', { length: 36 }).notNull().references(() => CardVersion.id),
  invoice: varchar('invoice', { length: 64 }).notNull().references(() => Invoice.paymentHash),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.cardVersion, table.invoice] }),
  }
})

export type CardVersionHasInvoice = typeof CardVersionHasInvoice.$inferSelect
