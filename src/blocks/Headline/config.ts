import type { Block } from 'payload'

export const HeadlineBlock: Block = {
  slug: 'headline',
  interfaceName: 'HeadlineBlock',
  labels: {
    plural: 'Headlines',
    singular: 'Headline',
  },
  fields: [
    {
      name: 'text',
      label: 'Texto',
      type: 'text',
      required: true,
    },
    {
      name: 'alignment',
      label: 'Alineación',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Izquierda', value: 'left' },
        { label: 'Centro', value: 'center' },
        { label: 'Derecha', value: 'right' },
      ],
    },
    {
      name: 'eyebrow',
      label: 'Eyebrow (opcional)',
      type: 'text',
      admin: {
        description:
          'Texto breve sobre el título, útil para categorías o destacados. Déjalo vacío si no lo necesitas.',
      },
    },
    {
      name: 'size',
      label: 'Tamaño',
      type: 'select',
      defaultValue: 'xl',
      options: [
        { label: 'Pequeño', value: 'sm' },
        { label: 'Mediano', value: 'md' },
        { label: 'Grande', value: 'lg' },
        { label: 'Extra grande', value: 'xl' },
      ],
    },
  ],
}
