import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FeaturedProductsSliderBlock: Block = {
  slug: 'featuredProductsSlider',
  interfaceName: 'FeaturedProductsSliderBlock',
  labels: {
    singular: 'Slider destacado',
    plural: 'Sliders destacados',
  },
  fields: [
    {
      name: 'slides',
      label: 'Slides',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'media',
          label: 'Imagen',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'supTitle',
          label: 'Título superior',
          type: 'text',
          admin: {
            description: 'Texto corto encima de la descripción, opcional.',
          },
        },
        {
          name: 'caption',
          label: 'Descripción',
          type: 'richText',
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
      ],
    },
    {
      name: 'autoplay',
      label: 'Autoplay',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'autoplayDelay',
      label: 'Intervalo (ms)',
      type: 'number',
      admin: {
        condition: (_, { autoplay } = {}) => Boolean(autoplay),
        step: 100,
      },
      defaultValue: 4500,
    },
    {
      name: 'loop',
      label: 'Loop infinito',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showSupTitle',
      label: 'Mostrar título superior',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
