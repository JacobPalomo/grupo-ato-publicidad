import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const ShowcaseBlock: Block = {
  slug: 'showcase',
  interfaceName: 'ShowcaseBlock',
  labels: {
    singular: 'Sección destacada',
    plural: 'Secciones destacadas',
  },
  fields: [
    {
      name: 'mediaPosition',
      type: 'select',
      label: 'Posición del media',
      defaultValue: 'right',
      required: true,
      options: [
        {
          label: 'Media a la derecha',
          value: 'right',
        },
        {
          label: 'Media a la izquierda',
          value: 'left',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Eyebrow',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Título',
          required: true,
          admin: {
            width: '50%',
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
    linkGroup({
      overrides: {
        admin: {
          description: 'Agrega botones o enlaces de acción (máximo 3).',
        },
        maxRows: 3,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      label: 'Imagen o video',
      relationTo: 'media',
      required: true,
    },
  ],
}
