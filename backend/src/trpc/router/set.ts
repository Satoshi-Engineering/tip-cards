import { Card } from '@shared/data/trpc/Card'
import { Set } from '@shared/data/trpc/Set'

import CardCollection from '@backend/modules/CardCollection'
import { getSetsByUserId } from '@backend/database/queries'

import { setFromSetRedis } from '../data/transforms/setFromSetRedis'
import { router } from '../trpc'
import publicProcedure from '../procedures/public'
import loggedInProcedure from '../procedures/loggedIn'

export const setRouter = router({
  getAll: loggedInProcedure
    .output(Set.array())
    .query(async ({ ctx }) => {
      const setsDatabase = await getSetsByUserId(ctx.accessToken.id)
      return setsDatabase.map((set) => setFromSetRedis(set))
    }),

  getCards: publicProcedure
    .input(Set.shape.id)
    .output(Card.array())
    .query(async ({ input: setId }) => {
      const cards = await CardCollection.fromSetId(setId)
      return await cards.toTRpcResponse()
    }),
})
