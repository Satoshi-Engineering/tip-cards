import type { DataObjects } from '@backend/database/drizzle/batchQueries'
import type Queries from '@backend/database/drizzle/Queries'
import type { Card as CardRedis } from '@backend/database/redis/data/Card'

import { getDrizzleCardFromRedisCard } from './drizzleDataFromRedisData'

/** @throws */
export const getDrizzleDataObjectsForRedisCardDelete = async (queries: Queries, cardRedis: CardRedis): Promise<DataObjects> => {
  const cardVersion = await queries.getLatestCardVersion(cardRedis.cardHash)
  if (cardVersion == null) {
    throw new Error(`Cannot delete card ${cardRedis.cardHash} as it doesn't exist.`)
  }
  const invoices = await queries.getAllInvoicesFundingCardVersion(cardVersion)
  return {
    cards: [getDrizzleCardFromRedisCard(cardRedis)],
    cardVersions: [cardVersion],
    cardVersionInvoices: invoices.map((invoice) => ({
      invoice: invoice.paymentHash,
      cardVersion: cardVersion.id,
    })),
  }
}
