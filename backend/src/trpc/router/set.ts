import { Card } from '@shared/data/trpc/Card.js'
import { Set, SetId } from '@shared/data/trpc/Set.js'

import CardCollection from '@backend/modules/CardCollection.js'
import { getSetsByUserId } from '@backend/database/deprecated/queries.js'

import { setFromSetRedis } from '../data/transforms/setFromSetRedis.js'
import { router } from '../trpc.js'
import publicProcedure from '../procedures/public.js'
import loggedInProcedure from '../procedures/loggedIn.js'
import { handleCardLockForSet } from '../procedures/partials/handleCardLock.js'

export const setRouter = router({
  getAll: loggedInProcedure
    .output(Set.array())
    .query(async ({ ctx }) => {
      const setsDatabase = await getSetsByUserId(ctx.accessToken.id)
      return setsDatabase.map((set) => setFromSetRedis(set))
    }),

  getCards: publicProcedure
    .input(SetId)
    .output(Card.array())
    .unstable_concat(handleCardLockForSet)
    .query(async ({ input }) => {
      const cards = await CardCollection.fromSetId(input.id)
      return await cards.toTRpcResponse()
    }),
})
