import '../initEnv'

import axios, { AxiosError, AxiosResponse } from 'axios'

import { ErrorCode } from '@shared/data/Errors'

import FailEarly from '../../FailEarly'
import FrontendSimulator from '../frontend/FrontendSimulator'
import { setData } from '../../apiData'

const failEarly = new FailEarly(it)
const frontend = new FrontendSimulator()

const randomNotExistingSetId = setData.generateSetId()
const set1 = setData.generateSet()
set1.userId = expect.any(String)
const set2 = setData.generateSet()
set2.userId = expect.any(String)

type ErrorResponse  = {
  status: string,
  message: string,
  code: ErrorCode,
}

describe('Set\'s', () => {
  failEarly.it('should fail with 401, due no auth', async () => {
    let caughtError: AxiosError | null = null

    try {
      await frontend.loadSets()
    } catch (error) {
      caughtError = error as AxiosError
    }

    expect(caughtError).not.toBeNull()
    expect(axios.isAxiosError(caughtError)).toBe(true)
    expect(caughtError?.response?.status).toBe(401)
  })

  failEarly.it('should fail, due setId does not exist', async () => {
    let caughtError: AxiosError | null = null

    try {
      await frontend.loadSet(randomNotExistingSetId)
    } catch (error) {
      caughtError = error as AxiosError
    }

    expect(axios.isAxiosError(caughtError)).toBe(true)

    const responseErrorData = caughtError?.response?.data as ErrorResponse
    expect(responseErrorData.status).toBe('error')
    expect(responseErrorData.code).toBe(ErrorCode.SetNotFound)
    expect(caughtError?.response?.status).toBe(404)
  })

  failEarly.it('should login', async () => {
    await frontend.login()
  })

  failEarly.it('should save a new set', async () => {
    const response = await frontend.saveSet(set1)

    expect(response.data).toEqual(expect.objectContaining(    {
      status: 'success',
      data: set1,
    }))
  })

  failEarly.it('should load a set', async () => {
    const response = await frontend.loadSet(set1.id)

    expect(response.data).toEqual(expect.objectContaining(    {
      status: 'success',
      data: set1,
    }))
  })

  failEarly.it('should update settings from the set', async () => {
    set1.settings.numberOfCards = 20
    set1.settings.cardHeadline += ' changed'
    set1.settings.cardCopytext += ' changed'
    set1.settings.setName += ' changed'

    const response = await frontend.saveSet(set1)

    expect(response.data).toEqual(expect.objectContaining(    {
      status: 'success',
      data: set1,
    }))
  })

  failEarly.it('should load a set and verify change', async () => {
    let response: AxiosResponse | null = null

    try {
      response = await frontend.loadSet(set1.id)
    } catch (error) {
      console.error(error)
      expect(false).toBe(true)
      return
    }

    expect(response.data).toEqual(expect.objectContaining(    {
      status: 'success',
      data: set1,
    }))
  })

  failEarly.it('should save a second set', async () => {
    let response: AxiosResponse | null = null

    try {
      response = await frontend.saveSet(set2)
    } catch (error) {
      console.error(error)
      expect(false).toBe(true)
      return
    }

    expect(response.data).toEqual(expect.objectContaining(    {
      status: 'success',
      data: set2,
    }))
  })

  failEarly.it('should load all sets', async () => {
    let response: AxiosResponse | null = null

    try {
      response = await frontend.loadSets()
    } catch (error) {
      console.error(error)
      expect(false).toBe(true)
      return
    }

    expect(response.data).toEqual(expect.objectContaining(    {
      status: 'success',
      data: [ set1, set2 ],
    }))
  })
})