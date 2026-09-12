'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {structure} from './sanity/structure'

import {getStudioRole, getAllowedDocumentTypes, canAccessDocument} from './sanity/studioAccess'

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

    // localhost에서만 Vision 표시
    ...(process.env.NODE_ENV === 'development'
      ? [visionTool()]
      : []),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    /**
     * 상단 Create 메뉴 권한
     */
    newDocumentOptions: (
      prev,
      {currentUser}
    ) => {
      const email = currentUser?.email
      const role = getStudioRole(email)

      if (role === 'superAdmin') {
        return prev
      }

      const allowedTypes =
        getAllowedDocumentTypes(email)

      return prev.filter(({templateId}) =>
        allowedTypes.includes(templateId)
      )
    },
    
    actions: (previousActions, context) => {
      if (context.schemaType !== 'performance') return previousActions

      return previousActions.map((action) => {
        if (action.action === 'publish') return PublishPerformanceAndSyncGalleryAction
        if (action.action === 'delete') return DeletePerformanceAndGalleryAction
        return action
      })
    },
  },
})