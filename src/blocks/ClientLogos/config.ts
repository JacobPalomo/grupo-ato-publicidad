import type { Block } from 'payload'

export const ClientLogosBlock: Block = {
  slug: 'clientLogos',
  interfaceName: 'ClientLogosBlock',
  labels: {
    singular: 'Slider de logos',
    plural: 'Sliders de logos',
  },
  fields: [
    {
      name: 'logos',
      label: 'Logos',
      type: 'array',
      minRows: 2,
      required: true,
      fields: [
        {
          name: 'media',
          label: 'Logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'link',
          label: 'URL (opcional)',
          type: 'text',
          admin: {
            description: 'Enlace al sitio del cliente. Déjalo vacío si no necesitas uno.',
          },
        },
      ],
    },
    {
      name: 'height',
      label: 'Altura de los logos (px)',
      type: 'number',
      defaultValue: 56,
      min: 24,
      max: 200,
      admin: {
        description: 'Ajusta la altura de todos los logos. Se escalarán proporcionalmente.',
        step: 4,
      },
    },
    {
      name: 'speed',
      label: 'Velocidad',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Lenta', value: 'slow' },
        { label: 'Media', value: 'medium' },
        { label: 'Rápida', value: 'fast' },
      ],
    },
  ],
}
