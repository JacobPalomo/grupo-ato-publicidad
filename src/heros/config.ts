import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Home Hero',
          value: 'homeHero',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'homeHero',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
      },
      fields: [
        {
          name: 'showTitle',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mostrar título principal',
        },
        {
          admin: {
            condition: (_, { showTitle } = {}) => showTitle !== false,
          },
          name: 'title',
          type: 'text',
          defaultValue: 'HECHO PARA TI',
        },
        {
          name: 'subtitlePrefix',
          type: 'text',
          defaultValue: 'Más de 20 años ayudando a los negocios a',
          required: true,
        },
        {
          name: 'changingTexts',
          type: 'array',
          minRows: 1,
          required: true,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'slides',
          type: 'array',
          minRows: 1,
          required: true,
          fields: [
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          name: 'autoplayDelay',
          type: 'number',
          min: 1000,
          defaultValue: 4150,
          admin: {
            description: 'Tiempo en milisegundos entre cambios automáticos del slider.',
            step: 50,
          },
        },
        {
          name: 'showShortcuts',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mostrar tira de accesos directos',
        },
        {
          name: 'shortcuts',
          type: 'array',
          admin: {
            condition: (_, { showShortcuts } = {}) => showShortcuts !== false,
            description:
              'Configura grupos de accesos directos. Cada categoría aparecerá en la tira desplazable.',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'items',
              type: 'array',
              minRows: 1,
              required: true,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                },
                link({
                  appearances: false,
                  disableLabel: true,
                  overrides: {
                    required: true,
                  },
                }),
              ],
            },
          ],
        },
      ],
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
