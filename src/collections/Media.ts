import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { ValidationError } from 'payload'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const usingVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const MAX_IMAGE_PIXELS = Number(process.env.MEDIA_MAX_IMAGE_PIXELS ?? 80_000_000)
const MAX_IMAGE_DIMENSION = Number(process.env.MEDIA_MAX_IMAGE_DIMENSION ?? 12000)

type BeforeChangeHook = NonNullable<NonNullable<CollectionConfig['hooks']>['beforeChange']>[number]

const validateImageDimensions: BeforeChangeHook = async ({ data, req }) => {
  const file = req?.file
  if (!file) return data
  const fileBuffer = (file as typeof file & { buffer?: Buffer })?.buffer ?? file?.data
  if (!fileBuffer) return data
  if (!file.mimetype?.startsWith('image/')) return data

  try {
    const metadata = await sharp(fileBuffer, {
      limitInputPixels: MAX_IMAGE_PIXELS,
    }).metadata()

    const width = metadata.width ?? 0
    const height = metadata.height ?? 0

    if (!width || !height) {
      return data
    }

    const exceedsPixels = width * height > MAX_IMAGE_PIXELS
    const exceedsDimension = width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION

    if (exceedsPixels || exceedsDimension) {
      const dimensionMessage = exceedsPixels
        ? `La imagen supera el máximo permitido de ${MAX_IMAGE_PIXELS.toLocaleString('es-MX')} pixeles (actual: ${(
            width * height
          ).toLocaleString('es-MX')} pixeles).`
        : `Las dimensiones (${width}x${height}px) superan el máximo permitido de ${MAX_IMAGE_DIMENSION}px por lado.`

      throw new ValidationError({
        collection: 'media',
        errors: [
          {
            message: dimensionMessage,
            path: 'file',
          },
        ],
        req,
      })
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }

    if (error instanceof Error && error.message.toLowerCase().includes('exceeds pixel limit')) {
      throw new ValidationError({
        collection: 'media',
        errors: [
          {
            message: `La imagen supera el máximo permitido de ${MAX_IMAGE_PIXELS.toLocaleString('es-MX')} pixeles.`,
            path: 'file',
          },
        ],
        req,
      })
    }

    throw error
  }

  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'gallery-tags',
      hasMany: true,
      label: 'Etiquetas',
      admin: {
        description: 'Etiqueta cada recurso para reutilizarlo fácilmente en las galerías.',
      },
    },
  ],
  hooks: {
    beforeChange: [validateImageDimensions],
  },
  upload: (() => {
    const baseConfig: NonNullable<CollectionConfig['upload']> = {
      adminThumbnail: 'thumbnail',
      focalPoint: true,
      imageSizes: [
        {
          name: 'thumbnail',
          width: 300,
        },
        {
          name: 'square',
          width: 500,
          height: 500,
        },
        {
          name: 'small',
          width: 600,
        },
        {
          name: 'medium',
          width: 900,
        },
        {
          name: 'large',
          width: 1400,
        },
        {
          name: 'xlarge',
          width: 1920,
        },
        {
          name: 'og',
          width: 1200,
          height: 630,
          crop: 'center',
        },
      ],
    }

    if (!usingVercelBlob) {
      baseConfig.staticDir = path.resolve(dirname, '../../public/media')
    }

    return baseConfig
  })(),
}
