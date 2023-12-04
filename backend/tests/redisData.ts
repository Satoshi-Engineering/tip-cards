import { randomUUID } from 'crypto'
import type z from 'zod'

import { BulkWithdraw } from '@backend/database/redis/data/BulkWithdraw'
import { Card } from '@backend/database/redis/data/Card'
import { Set } from '@backend/database/redis/data/Set'
import { User, Profile } from '@backend/database/redis/data/User'
import hashSha256 from '@backend/services/hashSha256'

export const createCard = (): Card => {
  const cardHash = hashSha256(randomUUID())
  const card = {
    cardHash,
    text: `${cardHash} text`,
    note: `${cardHash} note`,
    invoice: null,
    lnurlp: null,
    setFunding: null,
    lnbitsWithdrawId: null,
    landingPageViewed: null,
    isLockedByBulkWithdraw: false,
    used: null,
  }
  return card
}

const Invoice = Card.shape.invoice.removeDefault().unwrap()
type Invoice = z.infer<typeof Invoice>
export const createInvoice = (amount: number): Invoice => ({
  amount,
  payment_hash: hashSha256(randomUUID()),
  payment_request: hashSha256(randomUUID()),
  created: Math.round(+ new Date() / 1000),
  paid: null,
})

const LnurlP = Card.shape.lnurlp.removeDefault().unwrap()
type LnurlP = z.infer<typeof LnurlP>
export const createLnurlP = (): LnurlP => ({
  shared: false,
  amount: null,
  payment_hash: null,
  id: hashSha256(randomUUID()),
  created: Math.round(+ new Date() / 1000),
  paid: null,
})

const SetFunding = Card.shape.setFunding.removeDefault().unwrap()
type SetFunding = z.infer<typeof SetFunding>
export const createSetFunding = (amount: number): SetFunding => ({
  amount,
  created: Math.round(+ new Date() / 1000),
  paid: null,
})

export const createSet = (): Set => ({
  id: randomUUID(),
  settings: null,
  created: Math.round(+ new Date() / 1000),
  date: Math.round(+ new Date() / 1000),

  userId: null,

  text: 'text for set-funding',
  note: 'note for set-funding',
  invoice: null,
})

export const createSetSettings = (): Set['settings'] => ({
  numberOfCards: 8,
  cardHeadline: hashSha256(randomUUID()),
  cardCopytext: hashSha256(randomUUID()),
  cardsQrCodeLogo: hashSha256(randomUUID()),
  setName: hashSha256(randomUUID()),
  landingPage: hashSha256(randomUUID()),
})

const FundedCards = Set.shape.invoice.removeDefault().unwrap().shape.fundedCards
type FundedCards = z.infer<typeof FundedCards>
export const createSetInvoice = (fundedCards: FundedCards, amount: number): Set['invoice'] => ({
  fundedCards,
  amount,
  payment_hash: hashSha256(randomUUID()),
  payment_request: hashSha256(randomUUID()),
  created: Math.round(+ new Date() / 1000),
  paid: null,
  expired: false,
})

export const createBulkWithdraw = (amount: number, ...cardHashes: Card['cardHash'][]): BulkWithdraw => {
  const lnbitsWithdrawId = hashSha256(randomUUID())
  return {
    id: lnbitsWithdrawId,
    created: Math.round(+ new Date() / 1000),
    amount,
    cards: [...cardHashes],
    lnbitsWithdrawId,
    lnbitsWithdrawDeleted: null,
    withdrawn: null,
  }
}

export const createUser = (): User => {
  return User.parse({
    id: randomUUID(),
    lnurlAuthKey: hashSha256(randomUUID()),
    created: Math.floor(+ new Date() / 1000),
  })
}

export const createProfile = (userId: User['id']): Profile => {
  return Profile.parse({
    user: userId,
    accountName: 'Account name',
    displayName: 'Display name',
    email: 'michael.knight@foundation.org',
  })
}
