import '../../../mocks/process.env'
import '../mocks/client'
import { addData } from '../mocks/database'

import { createImage } from '../../../../drizzleData'

import { getImageAsString } from '@backend/database/drizzle/queriesRedis'

describe('getImageAsString', () => {
  it('should return null if the image does not exist', async () => {
    const imageMeta = await getImageAsString('some image id that doesnt exist')
    expect(imageMeta).toBeNull()
  })

  it('should return an svg as string', async () => {
    const svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" />
      </svg>`
    const image = createImage('svg', svg)

    addData({
      images: [image],
    })

    const imageResult = await getImageAsString(image.id)
    expect(imageResult).toEqual(svg)
  })
})
