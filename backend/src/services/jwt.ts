import type { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import {
  generateKeyPair, type KeyLike, SignJWT, jwtVerify,
  importSPKI, importPKCS8, exportSPKI, exportPKCS8,
  errors,
} from 'jose'

import { ErrorCode } from '../../../src/data/Errors'
import type { User } from '../../../src/data/User'

import { getUserById, updateUser } from './database'

const FILENAME_PUBLIC = 'lnurl.auth.pem.pub'
const FILENAME = 'lnurl.auth.pem'
const alg = 'RS256'

const ISSUER = 'tipcards:auth'
const AUDIENCE_REFRESH_TOKEN = 'tipcards:auth'
const AUDIENCE_ACCESS_TOKEN = 'tipcards'

let publicKey: KeyLike
let privateKey: KeyLike
const loadKeys = async () => {
  if (publicKey != null && privateKey != null) {
    return { publicKey, privateKey }
  }
  try {
    if (fs.existsSync(FILENAME_PUBLIC) && fs.existsSync(FILENAME)) {
      let data = fs.readFileSync(FILENAME_PUBLIC, 'utf8')
      publicKey = await importSPKI(data, alg)
      data = fs.readFileSync(FILENAME, 'utf8')
      privateKey = await importPKCS8(data, alg)
    } else {
      ({ publicKey, privateKey } = await generateKeyPair(alg))
      const spkiPem = await exportSPKI(publicKey)
      fs.writeFileSync(FILENAME_PUBLIC, spkiPem)
      const pkcs8Pem = await exportPKCS8(privateKey)
      fs.writeFileSync(FILENAME, pkcs8Pem)
    }
  } catch (error) {
    console.error(error)
  }
  return { publicKey, privateKey }
}

export const createRefreshToken = async ({ id, lnurlAuthKey }: User) => {
  const { privateKey } = await loadKeys()
  return new SignJWT({ id, lnurlAuthKey })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE_REFRESH_TOKEN)
    .setExpirationTime('28 days')
    .sign(privateKey)
}

export const createAccessToken = async ({ id, lnurlAuthKey }: User) => {
  const { privateKey } = await loadKeys()
  return new SignJWT({ id, lnurlAuthKey })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE_ACCESS_TOKEN)
    .setExpirationTime('5 minutes')
    .sign(privateKey)
}

export const authGuardRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
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
      issuer: ISSUER,
      audience: AUDIENCE_REFRESH_TOKEN,
    })
    if (payload.exp == null || payload.exp * 1000 < + new Date()) {
      res
        .clearCookie('refresh_token', {
          httpOnly: true,
          secure: true,
          sameSite: true,
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
          sameSite: true,
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
        sameSite: true,
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
      httpOnly: true,
      secure: true,
      sameSite: true,
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

export const authGuardAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const { publicKey } = await loadKeys()

  if (req.headers.authorization == null) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization header missing.',
      code: ErrorCode.AccessTokenMissing,
    })
    return
  }

  try {
    const { payload } = await jwtVerify(req.headers.authorization, publicKey, {
      issuer: ISSUER,
      audience: AUDIENCE_ACCESS_TOKEN,
    })
    if (payload.exp == null || payload.exp * 1000 < + new Date()) {
      res.status(401).json({
        status: 'error',
        message: 'Authorization expired.',
        code: ErrorCode.AccessTokenExpired,
      })
      return
    }
    res.locals.jwtPayload = payload
    next()
  } catch (error) {
    let message = 'Invalid authorization token.'
    let code = ErrorCode.AccessTokenInvalid
    if (error instanceof errors.JWTExpired) {
      message = 'Authorization expired.'
      code = ErrorCode.AccessTokenExpired
    }
    res.status(401).json({
      status: 'error',
      message,
      code,
    })
  }
}
