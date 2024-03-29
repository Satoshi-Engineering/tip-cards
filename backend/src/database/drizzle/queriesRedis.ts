import type { AccessTokenPayload } from '@shared/data/auth'

import NotFoundError from '@backend/errors/NotFoundError'
import type Queries from '@backend/database/drizzle/Queries'
import type { BulkWithdraw as BulkWithdrawRedis } from '@backend/database/redis/data/BulkWithdraw'
import type { Card as CardRedis } from '@backend/database/redis/data/Card'
import type { Set as SetRedis } from '@backend/database/redis/data/Set'
import type { LandingPage as LandingPageRedis } from '@backend/database/redis/data/LandingPage'
import type { Image as ImageMetaRedis } from '@backend/database/redis/data/Image'
import { User as UserRedis } from '@backend/database/redis/data/User'
import hashSha256 from '@backend/services/hashSha256'

import {
  getRedisCardFromDrizzleCardVersion,
  redisLandingPageFromDrizzleLandingPage,
  redisUserFromDrizzleUser,
  redisUserFromDrizzleUserOrNull,
} from './transforms/redisDataFromDrizzleData'
import {
  getDrizzleDataObjectsFromRedisCard,
  getDrizzleLnurlWFromRedisBulkWithdraw,
  getUserIdForRedisImageFromDrizzleImage,
} from './transforms/drizzleDataFromRedisData'
import { getDrizzleDataObjectsForRedisCardChanges } from './transforms/drizzleDataForRedisCardChanges'
import { getDrizzleDataObjectsForRedisCardDelete } from './transforms/drizzleDataForRedisCardDelete'
import { getRedisSetFromDrizzleSet } from './transforms/redisSetDataFromDrizzleData'
import {
  getDrizzleDataObjectsForRedisSet,
  getDrizzleDataObjectsForRedisSetDelete,
} from './transforms/drizzleSetDataForRedisSet'
import { getRedisBulkWithdrawForDrizzleLnurlW, filterLnurlWsThatAreUsedForMultipleCards } from './transforms/redisBulkWithdrawDataFromDrizzleData'
import { getDrizzleDataObjectsForRedisUser } from './transforms/drizzleDataFromRedisUserData'
import {
  insertOrUpdateDataObjects,
  deleteDataObjects,
} from './batchQueries'
import { asTransaction } from './client'

// @throws tags are omitted as every database query can throw an exception!

export const getCardByHash = async (cardHash: string): Promise<CardRedis | null> => asTransaction(async (queries) => {
  const cardVersion = await queries.getLatestCardVersion(cardHash)
  if (cardVersion == null) {
    return null
  }
  return getRedisCardFromDrizzleCardVersion(queries, cardVersion)
})

export const createCard = async (cardRedis: CardRedis): Promise<void> => asTransaction(async (queries) => {
  const drizzleData = getDrizzleDataObjectsFromRedisCard(cardRedis)
  await insertOrUpdateDataObjects(queries, drizzleData)
})

export const updateCard = async (cardRedis: CardRedis): Promise<void> => asTransaction(async (queries) => {
  const drizzleData = await getDrizzleDataObjectsForRedisCardChanges(queries, cardRedis)
  await insertOrUpdateDataObjects(queries, drizzleData.insertOrUpdate)
  await deleteDataObjects(queries, drizzleData.delete)
})

export const deleteCard = async (cardRedis: CardRedis): Promise<void> => asTransaction(async (queries) => {
  const drizzleData = await getDrizzleDataObjectsForRedisCardDelete(queries, cardRedis)
  await deleteDataObjects(queries, drizzleData)
})

export const getSetById = async (setId: SetRedis['id']): Promise<SetRedis | null> => asTransaction(async (queries) => {
  const set = await queries.getSetById(setId)
  if (set == null) {
    return null
  }
  return getRedisSetFromDrizzleSet(queries, set)
})

export const getSetsByUserId = async (userId: string): Promise<SetRedis[]> => asTransaction(async (queries) => {
  const sets = await queries.getSetsByUserId(userId)
  const setsRedis = await Promise.all(sets.map((set) => getRedisSetFromDrizzleSet(queries, set)))
  return setsRedis
})

export const createSet = async (set: SetRedis): Promise<void> => asTransaction(async (queries) => {
  const drizzleData = await getDrizzleDataObjectsForRedisSet(queries, set)
  await insertOrUpdateDataObjects(queries, drizzleData.insertOrUpdate)
})

export const updateSet = async (set: SetRedis): Promise<void> => asTransaction(async (queries) => {
  const drizzleData = await getDrizzleDataObjectsForRedisSet(queries, set)
  await insertOrUpdateDataObjects(queries, drizzleData.insertOrUpdate)
  await deleteDataObjects(queries, drizzleData.delete)
})

export const deleteSet = async (set: SetRedis): Promise<void> => asTransaction(async (queries) => {
  const drizzleData = await getDrizzleDataObjectsForRedisSetDelete(queries, set)
  await insertOrUpdateDataObjects(queries, drizzleData.update)
  await deleteDataObjects(queries, drizzleData.delete)
})


export const createBulkWithdraw = async (bulkWithdraw: BulkWithdrawRedis): Promise<void> => asTransaction(async (queries) => {
  const lnurlW = getDrizzleLnurlWFromRedisBulkWithdraw(bulkWithdraw)
  await queries.insertOrUpdateLnurlW(lnurlW)
  linkLatestCardVersionsToLnurlW(queries, bulkWithdraw.cards, lnurlW.lnbitsId)
})
const linkLatestCardVersionsToLnurlW = async (queries: Queries, cardHashes: CardRedis['cardHash'][], lnurlWlnbitsId: BulkWithdrawRedis['lnbitsWithdrawId']) => {
  await Promise.all(
    cardHashes.map(async (cardHash) => linkLatestCardVersionToLnurlW(queries, cardHash, lnurlWlnbitsId)),
  )
}
const linkLatestCardVersionToLnurlW = async (queries: Queries, cardHash: CardRedis['cardHash'], lnurlWlnbitsId: BulkWithdrawRedis['lnbitsWithdrawId']) => {
  const cardVersion = await queries.getLatestCardVersion(cardHash)
  if (cardVersion == null) {
    throw new NotFoundError(`Card ${cardHash} not found.`)
  }
  await queries.updateCardVersion({
    ...cardVersion,
    lnurlW: lnurlWlnbitsId,
  })
}

export const getBulkWithdrawById = async (lnbitsLnurlWId: string): Promise<BulkWithdrawRedis> => asTransaction(async (queries) => {
  const lnurlW = await queries.getLnurlWById(lnbitsLnurlWId)
  if (lnurlW == null) {
    throw new NotFoundError('BulkWithdraw doesn\'t exist.')
  }
  const bulkWithdrawRedis = getRedisBulkWithdrawForDrizzleLnurlW(queries, lnurlW)
  return bulkWithdrawRedis
})

export const updateBulkWithdraw = async (bulkWithdraw: BulkWithdrawRedis): Promise<void> => asTransaction(async (queries) => {
  const lnurlW = getDrizzleLnurlWFromRedisBulkWithdraw(bulkWithdraw)
  await queries.insertOrUpdateLnurlW(lnurlW)
})

export const deleteBulkWithdraw = async (bulkWithdraw: BulkWithdrawRedis): Promise<void> => {
  await getBulkWithdrawById(bulkWithdraw.lnbitsWithdrawId)
  await unlinkLatestCardVersionsFromLnurlW(bulkWithdraw.cards)
}
const unlinkLatestCardVersionsFromLnurlW = async (cardHashes: CardRedis['cardHash'][]) => asTransaction(async (queries) => {
  await Promise.all(
    cardHashes.map((cardHash) => unlinkLatestCardVersionFromLnurlW(queries, cardHash)),
  )
})
const unlinkLatestCardVersionFromLnurlW = async (queries: Queries, cardHash: CardRedis['cardHash']) => {
  const cardVersion = await queries.getLatestCardVersion(cardHash)
  if (cardVersion == null) {
    throw new NotFoundError(`Card ${cardHash} not found.`)
  }
  await queries.updateCardVersion({
    ...cardVersion,
    lnurlW: null,
  })
}

export const getAllBulkWithdraws = async (): Promise<BulkWithdrawRedis[]> => asTransaction(async (queries) => {
  const allLnurlWs = await queries.getAllLnurlWs()
  const lnurlWsForMultipleCards = await filterLnurlWsThatAreUsedForMultipleCards(queries, allLnurlWs)
  const bulkWithdraws = await Promise.all(
    lnurlWsForMultipleCards.map(
      async ({ lnbitsId }) => await getBulkWithdrawById(lnbitsId),
    ),
  )
  return bulkWithdraws
})

export const getLandingPage = async (landingPageId: string): Promise<LandingPageRedis | null> => asTransaction(async (queries) => {
  const landingPageDrizzle = await queries.getLandingPage(landingPageId)
  return redisLandingPageFromDrizzleLandingPage(queries, landingPageDrizzle)
})

export const getAllLandingPages = async (): Promise<LandingPageRedis[]> => asTransaction(async (queries) => {
  const landingPagesDrizzle = await queries.getAllLandingPages()
  const landingPages: LandingPageRedis[] = []

  await Promise.all(landingPagesDrizzle.map(async (landingPageDrizzle) => {
    const landingPage = await redisLandingPageFromDrizzleLandingPage(queries, landingPageDrizzle)
    if (landingPage != null) {
      landingPages.push(landingPage)
    }
  }))
  return landingPages
})

export const getImageMeta = async (imageId: ImageMetaRedis['id']): Promise<ImageMetaRedis | null> => asTransaction(async (queries) => {
  const imageDrizzle = await queries.getImageById(imageId)
  if (imageDrizzle == null) {
    return null
  }
  return {
    id: imageDrizzle.id,
    type: imageDrizzle.type,
    name: imageDrizzle.name,
    userId: await (getUserIdForRedisImageFromDrizzleImage(queries, imageDrizzle)),
  }
})

export const getImageAsString = async (imageId: string): Promise<string | null> => asTransaction(async (queries) => {
  const imageDrizzle = await queries.getImageById(imageId)
  if (imageDrizzle == null) {
    return null
  }
  return imageDrizzle.data
})

export const getUserByLnurlAuthKeyOrCreateNew = async (lnurlAuthKey: UserRedis['lnurlAuthKey']): Promise<UserRedis> => {
  let user = await getUserByLnurlAuthKey(lnurlAuthKey)
  if (user != null) {
    return user
  }
  const userId = hashSha256(lnurlAuthKey)
  user = UserRedis.parse({
    id: userId,
    lnurlAuthKey,
    created: Math.floor(+ new Date() / 1000),
  })
  await createUser(user)
  return user
}

export const initUserFromAccessTokenPayload = async (accessTokenPayload: AccessTokenPayload): Promise<UserRedis> => {
  let user = await getUserById(accessTokenPayload.id)
  if (user != null) {
    return user
  }
  user = UserRedis.parse({
    id: accessTokenPayload.id,
    lnurlAuthKey: accessTokenPayload.lnurlAuthKey,
    created: Math.floor(+ new Date() / 1000),
    permissions: accessTokenPayload.permissions,
  })
  await createUser(user)
  return user
}

export const getUserById = async (userId: string): Promise<UserRedis | null> => asTransaction(async (queries) => {
  const user = await queries.getUserById(userId)
  return redisUserFromDrizzleUserOrNull(queries, user)
})

export const getUserByLnurlAuthKey = async (lnurlAuthKey: string): Promise<UserRedis | null> => asTransaction(async (queries) => {
  const user = await queries.getUserByLnurlAuthKey(lnurlAuthKey)
  return redisUserFromDrizzleUserOrNull(queries, user)
})

export const getAllUsers = async (): Promise<UserRedis[]> => asTransaction(async (queries) => {
  const users = await queries.getAllUsers()
  return (await Promise.all(users.map(async (user) => redisUserFromDrizzleUser(queries, user))))
    .filter((user) => user != null)
})

export const createUser = async (user: UserRedis): Promise<void> => asTransaction(async (queries) => {
  const drizzleData = await getDrizzleDataObjectsForRedisUser(user)
  await insertOrUpdateDataObjects(queries, drizzleData)
})

export const updateUser = async (user: UserRedis): Promise<void> => asTransaction(async (queries) => {
  const drizzleData = await getDrizzleDataObjectsForRedisUser(user)
  await queries.deleteAllAllowedRefreshTokensForUserId(user.id)
  await insertOrUpdateDataObjects(queries, drizzleData)
})
