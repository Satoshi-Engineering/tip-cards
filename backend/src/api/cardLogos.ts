import { Router } from 'express'

import { Image as ImageApi } from '@shared/data/api/Image'
import type { AccessTokenPayload } from '@shared/data/auth'
import { ErrorCode } from '@shared/data/Errors'

import type { User } from '@backend/database/redis/data/User'
import type { Image as ImageMeta } from '@backend/database/redis/data/Image'
import { getUserById, getImageMeta } from '@backend/database/queries'

import { authGuardAccessToken } from './middleware/auth/jwt'

const router = Router()

router.get('/', authGuardAccessToken, async (_, res) => {
  const accessTokenPayload: AccessTokenPayload = res.locals.accessTokenPayload
  if (accessTokenPayload == null) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization payload missing.',
      code: ErrorCode.AccessTokenMissing,
    })
    return
  }
  const userId: string = accessTokenPayload.id

  // load user from database
  let user: User | null = null
  try {
    user = await getUserById(userId)
  } catch (error: unknown) {
    console.error(ErrorCode.UnknownDatabaseError, error)
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occured. Please try again later or contact an admin.',
      code: ErrorCode.UnknownDatabaseError,
    })
    return
  }

  const images: ImageMeta[] = []
  if (user?.availableCardsLogos != null) {
    try {
      await Promise.all(user.availableCardsLogos.map(async (imageId) => {
        const imageMeta = await getImageMeta(imageId)
        if (imageMeta != null) {
          images.push(imageMeta)
        }
      }))
    } catch (error: unknown) {
      console.error(ErrorCode.UnknownDatabaseError, error)
      res.status(500).json({
        status: 'error',
        message: 'An unexpected error occured. Please try again later or contact an admin.',
        code: ErrorCode.UnknownDatabaseError,
      })
      return
    }
  }

  res.json({
    status: 'success',
    data: images.map((image) => ImageApi.parse(image)),
  })
})

export default router
