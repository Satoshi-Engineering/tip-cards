import '../../../mocks/process.env'
import { queries } from '../mocks/client'
import { addData } from '../mocks/database'

import {
  createCard, createCardVersion,
  createInvoice, createLnurlW,
} from '../../../../drizzleData'
import { createBulkWithdraw as createBulkWithdrawData } from '../../../../redisData'

import NotFoundError from '@backend/errors/NotFoundError'

import { deleteBulkWithdraw } from '@backend/database/drizzle/queriesRedis'

describe('deleteBulkWithdraw', () => {
  it('should throw an error if the bulkWithdraw doesnt exist', async () => {
    const card1 = createCard()
    const card2 = createCard()
    const bulkWithdraw = createBulkWithdrawData(500, card1.hash, card2.hash)
    await expect(async () => await deleteBulkWithdraw(bulkWithdraw)).rejects.toThrow(NotFoundError)
  })

  it('should remove the lnurlw from the affected cardVersions', async () => {
    const card1 = createCard()
    const cardVersion1 = createCardVersion(card1)
    const card2 = createCard()
    const cardVersion2 = createCardVersion(card2)
    const { invoice, cardVersionsHaveInvoice } = createInvoice(500, cardVersion1, cardVersion2)
    invoice.paid = new Date()
    const lnurlw = createLnurlW(cardVersion1, cardVersion2)
    addData({
      cards: [card1, card2],
      cardVersions: [cardVersion1, cardVersion2],
      invoices: [invoice],
      cardVersionInvoices: [...cardVersionsHaveInvoice],
      lnurlws: [lnurlw],
    })

    const bulkWithdraw = createBulkWithdrawData(invoice.amount, card1.hash, card2.hash)
    bulkWithdraw.id = lnurlw.bulkWithdrawId as string
    bulkWithdraw.lnbitsWithdrawId = lnurlw.lnbitsId
    await deleteBulkWithdraw(bulkWithdraw)
    expect(queries.updateCardVersion).toHaveBeenCalledWith(expect.objectContaining({
      id: cardVersion1.id,
      card: card1.hash,
      lnurlW: null,
    }))
    expect(queries.updateCardVersion).toHaveBeenCalledWith(expect.objectContaining({
      id: cardVersion2.id,
      card: card2.hash,
      lnurlW: null,
    }))
  })
})
