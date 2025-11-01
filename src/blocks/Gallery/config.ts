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
      name: 'items',
      type: 'array',
      label: 'Trabajos',
      minRows: 1,
      required: true,
      admin: {
        initCollapsed: true,
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
          name: 'categories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
          label: 'Categorías',
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
