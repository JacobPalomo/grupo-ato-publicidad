import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const GalleryTags: CollectionConfig = {
  slug: 'gallery-tags',
  labels: {
    singular: 'Etiqueta',
    plural: 'Etiquetas',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Nombre de la etiqueta',
      type: 'text',
      required: true,
    },
  ],
}
