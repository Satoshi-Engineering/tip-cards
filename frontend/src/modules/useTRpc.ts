import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

import type { AppRouter } from '@backend/trpc'

import { BACKEND_API_ORIGIN } from '@/constants'

const createClient = (getValidAccessToken: () => Promise<string | null>) => createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${BACKEND_API_ORIGIN}/trpc`,
      maxURLLength: 2083,
      headers: async () => {
        let accessToken: string | null
        try {
          accessToken = await getValidAccessToken()
        } catch (error) {
          accessToken = null
        }
        return {
          Authorization: accessToken || '',
        }
      },
    }),
  ],
})

export default (getValidAccessToken?: () => Promise<string | null>) => {
  return createClient(getValidAccessToken || (async () => null))
}
