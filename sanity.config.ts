'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {structure} from './sanity/structure'

import {apiVersion, dataset, projectId} from './sanity/env'
import {schemaTypes} from './sanity/schemaTypes'

import {
  DeletePerformanceAndGalleryAction,
  PublishPerformanceAndSyncGalleryAction,
} from './sanity/actions/performanceGallerySync'

import {koKRLocale} from '@sanity/locale-ko-kr'

export default defineConfig({
  basePath: '/studio',
  title: 'Unplugged Lounge CMS',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure,
    }),

    visionTool({
      defaultApiVersion: apiVersion,
    }),

    koKRLocale(),
  ],

  document: {
    actions: (previousActions, context) => {
      if (context.schemaType !== 'performance') return previousActions

      return previousActions.map((action) => {
        if (action.action === 'publish') return PublishPerformanceAndSyncGalleryAction
        if (action.action === 'delete') return DeletePerformanceAndGalleryAction
        return action
      })
    },
  },

  schema: {
    types: schemaTypes,
  },
})