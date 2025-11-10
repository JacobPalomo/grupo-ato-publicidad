import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { GalleryBlock as GalleryBlockProps, GalleryTag, Media } from '@/payload-types'

import { GalleryBlockClient } from './Client'

type GalleryItems = NonNullable<GalleryBlockProps['items']>
type GalleryBlockItem = GalleryItems[number]

const mapMediaToGalleryItem = (doc: Media): GalleryBlockItem => {
  return {
    id: `media-${doc.id}`,
    media: doc,
    tags: (doc.tags ?? []) as (number | GalleryTag)[],
    description: doc.caption ?? null,
  }
}

export const GalleryBlock = async (props: GalleryBlockProps) => {
  const {
    items,
    populateBy = 'manual',
    mediaTags,
    mediaLimit,
    ...restProps
  } = props

  let resolvedItems: GalleryItems = Array.isArray(items) ? (items as GalleryItems) : []

  if (populateBy === 'media') {
    const payload = await getPayload({ config: configPromise })

    const flattenedTags =
      mediaTags
        ?.map((category) => {
          if (!category) return null
          if (typeof category === 'number') return category
          return category.id ?? null
        })
        .filter((value): value is number => typeof value === 'number') ?? []

    const limit = mediaLimit && mediaLimit > 0 ? mediaLimit : 48

    const query: Parameters<typeof payload.find>[0] = {
      collection: 'media',
      depth: 1,
      limit,
      sort: '-createdAt',
    }

    if (flattenedTags.length > 0) {
      query.where = {
        tags: {
          in: flattenedTags,
        },
      }
    }

    const mediaResult = await payload.find(query)

    resolvedItems =
      mediaResult.docs
        ?.map(mapMediaToGalleryItem)
        .filter((item) => Array.isArray(item.tags) && item.tags.filter(Boolean).length) ??
      []
  }

  return <GalleryBlockClient {...restProps} items={resolvedItems} />
}
