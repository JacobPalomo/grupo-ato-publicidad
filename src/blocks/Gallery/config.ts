import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: 'Galería',
    plural: 'Galerías',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Eyebrow',
          admin: {
            width: '40%',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Título',
          required: true,
          admin: {
            width: '60%',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descripción',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      name: 'populateBy',
      type: 'select',
      label: 'Fuente de trabajos',
      defaultValue: 'manual',
      options: [
        {
          label: 'Seleccionar manualmente',
          value: 'manual',
        },
        {
          label: 'Automático desde la biblioteca',
          value: 'media',
        },
      ],
    },
    {
      name: 'mediaTags',
      type: 'relationship',
      relationTo: 'gallery-tags',
      hasMany: true,
      label: 'Etiquetas a mostrar',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'media',
      },
    },
    {
      name: 'mediaLimit',
      type: 'number',
      label: 'Límite de trabajos',
      defaultValue: 24,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'media',
        step: 1,
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Trabajos',
      minRows: 0,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy !== 'media',
        initCollapsed: true,
      },
      required: false,
      validate: (value, { siblingData }) => {
        const populateBy = (siblingData as { populateBy?: string })?.populateBy
        if (populateBy === 'media') return true
        if (Array.isArray(value) && value.length > 0) return true
        return 'Agrega al menos un trabajo o usa la carga automática.'
      },
      labels: {
        singular: 'Trabajo',
        plural: 'Trabajos',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen',
        },
        {
          name: 'tags',
          type: 'relationship',
          relationTo: 'gallery-tags',
          hasMany: true,
          label: 'Etiquetas',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Descripción corta',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
        },
      ],
    },
  ],
}
