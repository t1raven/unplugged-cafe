/*import { type SchemaTypeDefinition } from 'sanity'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [],
}*/

import {performance} from './performance'
import {artist} from './artist'

export const schemaTypes = [
  performance,
  artist,
]