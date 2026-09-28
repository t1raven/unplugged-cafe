import type {
  StructureResolver,
  ListItemBuilder,
  ListItem,
} from 'sanity/structure'

export const API_VERSION = '2026-01-01'
export type MenuFactory = (
  S: Parameters<StructureResolver>[0],
  context: Parameters<StructureResolver>[1],
) => ListItemBuilder | ListItem
