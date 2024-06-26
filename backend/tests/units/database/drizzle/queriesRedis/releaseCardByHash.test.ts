import '../../../mocks/process.env'
import '../mocks/client'
import { lockCardByHash, releaseCardByHash } from '@backend/database/drizzle/queriesRedis'
import { createCard } from '../../../../drizzleData'
import { addCards } from '../mocks/database'

describe('releaseCardByHash', () => {
  it('should release card by hash, which was locked', async () => {
    const card = createCard()
    addCards(card)

    const lockValue = await lockCardByHash(card.hash)
    if (lockValue === null) {
      expect(lockValue).not.toBeNull()
      return
    }
    await releaseCardByHash(card.hash, lockValue)
  })

  it('should not release card, because the card does not exist', async () => {
    const randomCardHash = createCard().hash
    await expect(releaseCardByHash(randomCardHash, 'randomLockValue')).rejects.toThrow()
  })

  it('should not release card, because the card is not locked', async () => {
    const card = createCard()
    addCards(card)
    await expect(releaseCardByHash(card.hash, 'randomLockValue')).rejects.toThrow()
  })

  it('should not release card, because the card was locked with a different lockValue', async () => {
    const card = createCard()
    addCards(card)

    const lockValue = await lockCardByHash(card.hash)
    if (lockValue === null) {
      expect(lockValue).not.toBeNull()
      return
    }
    await expect(releaseCardByHash(card.hash, `${lockValue}DIFFERENTLOCKVALUE`)).rejects.toThrow()
  })

  it('should not release card, because it has been already released', async () => {
    const card = createCard()
    addCards(card)

    const lockValue = await lockCardByHash(card.hash)
    if (lockValue === null) {
      expect(lockValue).not.toBeNull()
      return
    }
    await releaseCardByHash(card.hash, lockValue)
    await expect(releaseCardByHash(card.hash, lockValue)).rejects.toThrow()
  })
})
