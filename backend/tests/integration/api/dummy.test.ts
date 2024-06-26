import axios from 'axios'

import '@backend/initEnv' // Info: .env needs to read before imports

import { API_ORIGIN } from '../lib/constants'
import '../lib/initAxios'

describe('dummy api', () => {
  it('returns success state', async () => {
    const { data } = await axios.get(`${API_ORIGIN}/api/dummy`)
    expect(data.status).toBe('success')
  })
})
