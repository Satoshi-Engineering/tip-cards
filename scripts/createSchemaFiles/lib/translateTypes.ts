import { DBMLEnumValue, DBMLSchema } from './types'
import { translateEnumConstName } from './translateNames'

const enums: {[key: string]: DBMLEnumValue[]} = {}

export function parseEnums(schema: DBMLSchema) {
  schema.enums.forEach(enumDefinition => {
    enums[enumDefinition.name] = enumDefinition.values
  })
}

export function getDefault(dbdefault: {type:string, value:string}) {
  if (dbdefault.type === 'boolean' && dbdefault.value === 'null') return ''
  if (dbdefault.type === 'boolean') return `.default(${dbdefault.value})`

  throw new Error(`Default value for type:${dbdefault.type} Not Implemented!`)
}

export function translateImportType(type: string) {
  if (type === 'text') return 'text'
  if (type === 'DateTime') return 'datetime'
  if (type === 'integer') return 'int'
  if (type === 'boolean') return 'boolean'
  if (type === 'json') return 'json'

  if (type.startsWith('varchar')) return 'varchar'
  if (type in enums) return 'mysqlEnum'

  throw new Error(`Type ${type} not translated`)
}

export function translateImportTypes(array: string[]): string[] {
  return array.map(type => translateImportType(type))
}

export function isEnum(type: string) {
  return type in enums
}

export function getEnumValueDefinitions(enumName: string): { name:string, note:string }[] {
  return enums[enumName]
}

export function createConfigForType(type: string) {
  if (type.startsWith('varchar')) {
    const match = type.match(/(?<=\().+?(?=\))/)
    if (match == null || match.length == 0) throw Error('Searching for the number in "varchar(XX)", but didn\'t found it')
    return `, { length: ${match[0]} }`
  }

  if (type in enums) {
    return `, ${translateEnumConstName(type)}`
  }

  return ''
}
