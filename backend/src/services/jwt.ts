import type { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import {
  generateKeyPair, type KeyLike, SignJWT, jwtVerify,
  importSPKI, importPKCS8, exportSPKI, exportPKCS8,
  errors,
} from 'jose'
import path from 'path'
import { ZodError } from 'zod'

import { AccessTokenPayload as ZodAccessTokenPayload, type AccessTokenPayload } from '@shared/data/auth'
import { ErrorCode } from '@shared/data/Errors'

import type { User } from '@backend/database/redis/data/User'
import { getUserById, updateUser, initUserFromAccessTokenPayload } from '@backend/database/queries'
import { JWT_AUTH_KEY_DIRECTORY, JWT_AUTH_ISSUER, JWT_AUTH_AUDIENCE } from '@backend/constants'
import { randomUUID } from 'crypto'

const FILENAME_PUBLIC = 'lnurl.auth.pem.pub'
const filenamePublicResolved = path.resolve(JWT_AUTH_KEY_DIRECTORY, FILENAME_PUBLIC)
const FILENAME = 'lnurl.auth.pem'
const filenameResolved = path.resolve(JWT_AUTH_KEY_DIRECTORY, FILENAME)
const alg = 'RS256'

let publicKey: KeyLike
let privateKey: KeyLike
const loadKeys = async () => {
  if (publicKey != null && privateKey != null) {
    return { publicKey, privateKey }
  }
  try {
    if (fs.existsSync(filenamePublicResolved) && fs.existsSync(filenameResolved)) {
      let data = fs.readFileSync(filenamePublicResolved, 'utf8')
      publicKey = await importSPKI(data, alg)
      data = fs.readFileSync(filenameResolved, 'utf8')
      privateKey = await importPKCS8(data, alg)
    } else {
      ({ publicKey, privateKey } = await generateKeyPair(alg))
      const spkiPem = await exportSPKI(publicKey)
      fs.writeFileSync(filenamePublicResolved, spkiPem)
      const pkcs8Pem = await exportPKCS8(privateKey)
      fs.writeFileSync(filenameResolved, pkcs8Pem)
    }
  } catch (error) {
    console.error(error)
  }
  return { publicKey, privateKey }
}

export const getPublicKey = async () => {
  const { publicKey } = await loadKeys()
  return publicKey
}

export const createRefreshToken = async ({ id, lnurlAuthKey }: User) => {
  const { privateKey } = await loadKeys()
  const nonce = randomUUID()
  return new SignJWT({ id, lnurlAuthKey, nonce })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(JWT_AUTH_ISSUER)
    .setAudience(JWT_AUTH_ISSUER)
    .setExpirationTime('28 days')
    .sign(privateKey)
}

export const createAccessToken = async ({ id, lnurlAuthKey, permissions }: User) => {
  const { privateKey } = await loadKeys()
  const nonce = randomUUID()
  const payload: AccessTokenPayload = { id, lnurlAuthKey, permissions, nonce }
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(JWT_AUTH_ISSUER)
    .setAudience(JWT_AUTH_AUDIENCE)
    .setExpirationTime('5 minutes')
    .sign(privateKey)
}

export const authGuardRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const host = req.get('host')
  if (typeof host !== 'string') {
    console.warn('Invalid host while checking refresh token', {
      host,
    })
    res.status(400).json({
      status: 'error',
      data: 'Invalid auth service host.',
    })
    return
  }

  const { publicKey } = await loadKeys()

  if (req.cookies?.refresh_token == null) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization cookie missing.',
      code: ErrorCode.RefreshTokenMissing,
    })
    return
  }

  try {
    const { payload } = await jwtVerify(req.cookies.refresh_token, publicKey, {
      issuer: JWT_AUTH_ISSUER,
      audience: host,
    })
    if (payload.exp == null || payload.exp * 1000 < + new Date()) {
      res
        .clearCookie('refresh_token', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .status(401)
        .json({
          status: 'error',
          message: 'Refresh token expired.',
          code: ErrorCode.RefreshTokenExpired,
        })
      return
    }

    const user = await getUserById(String(payload.id))
    if (
      user?.allowedRefreshTokens == null
      || !user.allowedRefreshTokens.find((currentRefreshTokens) => currentRefreshTokens.includes(req.cookies.refresh_token))
    ) {
      res
        .clearCookie('refresh_token', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .status(401)
        .json({
          status: 'error',
          message: 'Refresh token denied.',
          code: ErrorCode.RefreshTokenDenied,
        })
      return
    }

    res.locals.userId = payload.id
    next()
  } catch (error) {
    let message = 'Invalid refresh token.'
    let code = ErrorCode.RefreshTokenInvalid
    if (error instanceof errors.JWTExpired) {
      message = 'Refresh token expired.'
      code = ErrorCode.RefreshTokenExpired
    }
    res
      .clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .status(401)
      .json({
        status: 'error',
        message,
        code,
      })
  }
}

export const cycleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById(res.locals.userId)
    if (user == null) {
      res.status(404).json({
        status: 'error',
        message: 'User not found.',
      })
      return
    }
    const refreshToken = await createRefreshToken(user)
    if (user.allowedRefreshTokens == null) {
      user.allowedRefreshTokens = []
    }
    const oldRefreshToken = req.cookies?.refresh_token
    user.allowedRefreshTokens = user.allowedRefreshTokens.map((currentRefreshTokens) => {
      if (!currentRefreshTokens.includes(oldRefreshToken)) {
        return currentRefreshTokens
      }
      if (currentRefreshTokens.length === 1) {
        return [...currentRefreshTokens, refreshToken]
      }
      return [currentRefreshTokens[currentRefreshTokens.length - 1], refreshToken]
    })
    await updateUser(user)
    res.cookie('refresh_token', refreshToken, {
      expires: new Date(+ new Date() + 1000 * 60 * 60 * 24 * 365),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    next()
  } catch (error) {
    console.error(ErrorCode.UnknownDatabaseError, error)
    res.status(403).json({
      status: 'error',
      data: 'unknown database error',
    })
  }
}

/**
 * @throws jose errors
 * @throws ZodError
 */
export const validateJwt = async (jwt: string, audience: string): Promise<AccessTokenPayload> => {
  const { publicKey } = await loadKeys()
  const { payload } = await jwtVerify(jwt, publicKey, {
    issuer: JWT_AUTH_ISSUER,
    audience,
  })
  if (payload.exp == null || payload.exp * 1000 < + new Date()) {
    throw new errors.JWTExpired('Authorization expired.')
  }
  return ZodAccessTokenPayload.parse(payload)
}

/**
 * validate access token.
 * if the token is valid, we make sure a user with the given foreign key exists in the application database.
 * if needed, a new user is created.
 */
export const authGuardAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const host = req.get('host')
  if (typeof host !== 'string') {
    console.error('Invalid host while checking access token', { host })
    res.status(400).json({
      status: 'error',
      data: 'Invalid auth service host.',
    })
    return
  }

  if (req.headers.authorization == null) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization header missing.',
      code: ErrorCode.AccessTokenMissing,
    })
    return
  }

  try {
    const accessToken = await validateJwt(req.headers.authorization, host)
    await initUserFromAccessTokenPayload(accessToken)
    res.locals.accessTokenPayload = accessToken
    next()
  } catch (error) {
    let message = 'Invalid authorization token.'
    let code = ErrorCode.AccessTokenInvalid
    if (error instanceof errors.JWTExpired) {
      message = 'Authorization expired.'
      code = ErrorCode.AccessTokenExpired
    } else if (error instanceof ZodError) {
      message = 'JWT payload parsing failed.'
      code = ErrorCode.ZodErrorParsingAccessTokenPayload
      console.error(code, error)
    }
    res.status(401).json({
      status: 'error',
      message,
      code,
    })
  }
}
