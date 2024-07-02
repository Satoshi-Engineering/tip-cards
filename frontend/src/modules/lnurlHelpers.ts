import { Buffer } from 'buffer'
import { bech32 } from 'bech32'

export const encodeLnurl = (unencoded: string) => {
  const words = bech32.toWords(Buffer.from(unencoded, 'utf8'))
  const rules = {
    prefix: 'lnurl',
    limit: 1023,
  }
  return bech32.encode(rules.prefix, words, rules.limit)
}

export const decodeLnurl = (encoded: string) => {
  const { words: dataPart } = bech32.decode(encoded, 2000)
  const requestByteArray = bech32.fromWords(dataPart)

  return Buffer.from(requestByteArray).toString()
}

export const cardHashFromLnurl = (lnurl: string): string | null => {
  let cardHash: string | null = null
  let decodedLnurl: string
  try {
    decodedLnurl = decodeLnurl(lnurl)
  } catch (error) {
    return null
  }
  [, cardHash] = decodedLnurl.toLowerCase().match(/\/api\/lnurl\/([0-9a-f]+)/) || [undefined, null]
  return cardHash
}
