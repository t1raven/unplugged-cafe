/*import { type SchemaTypeDefinition } from 'sanity'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [],
}*/

import {home} from './home'
import {performance} from './performance'
import {artist} from './artist'
import {place} from './place'
import {menuCategory} from './menuCategory'
import {menuItem} from './menuItem'
import {galleryCategory} from './galleryCategory'
import {galleryItem} from './galleryItem'

export const schemaTypes = [
  home,
  performance,
  place,
  artist,
  menuCategory,
  menuItem,
  galleryCategory,
  galleryItem,
]