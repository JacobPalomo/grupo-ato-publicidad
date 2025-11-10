'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

import type { GalleryBlock as GalleryBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type TagOption = {
  id: string
  label: string
}

const MAX_TEXT_WIDTH = 'max-w-2xl'

type GalleryItems = NonNullable<GalleryBlockProps['items']>

type NormalizedGalleryItem = {
  id: string
  media: GalleryItems[number]['media']
  description: GalleryItems[number]['description']
  tags: string[]
  tagLabels: TagOption[]
}

const normalizeTags = (
  rawTags: GalleryItems[number]['tags'],
): { ids: string[]; labels: TagOption[] } => {
  const ids: string[] = []
  const labels: TagOption[] = []
  if (!rawTags) return { ids, labels }

  rawTags.forEach((tag) => {
    if (!tag) return
    const id = typeof tag === 'number' ? tag.toString() : tag.id?.toString() ?? null
    if (!id) return
    if (!ids.includes(id)) {
      ids.push(id)
      const label = typeof tag === 'object' && tag.title ? tag.title : `Etiqueta ${id}`
      labels.push({ id, label })
    }
  })

  return { ids, labels }
}

type GalleryBlockClientProps = Omit<GalleryBlockProps, 'items'> & {
  items: GalleryItems
}

export const GalleryBlockClient: React.FC<GalleryBlockClientProps> = ({
  items,
  eyebrow,
  title,
  description,
}) => {
  const galleryItems: NormalizedGalleryItem[] = useMemo(() => {
    return (
      items
        ?.map((item) => {
          if (!item?.media) return null
          const { ids, labels } = normalizeTags(item.tags)
          if (ids.length === 0) return null

          const id =
            item.id ??
            (typeof item.media === 'object'
              ? item.media.id?.toString() ?? item.media.url ?? ''
              : item.media.toString())

          if (!id) return null

          return {
            tags: ids,
            tagLabels: labels,
            description: item.description,
            id,
            media: item.media,
          }
        })
        .filter((value): value is NonNullable<typeof value> => Boolean(value)) ?? []
    )
  }, [items])

  const tagOptions: TagOption[] = useMemo(() => {
    const seen = new Map<string, string>()

    galleryItems.forEach((item) => {
      item.tagLabels.forEach((tag) => {
        if (!seen.has(tag.id)) seen.set(tag.id, tag.label)
      })
    })

    return Array.from(seen.entries()).map(([id, label]) => ({
      id,
      label,
    }))
  }, [galleryItems])

  const [activeTag, setActiveTag] = useState<string>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredItems =
    activeTag === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.tags.includes(activeTag))

  useEffect(() => {
    if (lightboxIndex === null) return
    if (filteredItems.length === 0) {
      setLightboxIndex(null)
      return
    }
    if (lightboxIndex >= filteredItems.length) {
      setLightboxIndex(0)
    }
  }, [filteredItems.length, lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null)
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((prev) => {
          if (prev === null) return prev
          return (prev + 1) % filteredItems.length
        })
      }
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((prev) => {
          if (prev === null) return prev
          return (prev - 1 + filteredItems.length) % filteredItems.length
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredItems.length, lightboxIndex])

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
    return
  }, [lightboxIndex])

  if (galleryItems.length === 0) return null

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const goToNext = () => {
    setLightboxIndex((prev) => {
      if (prev === null) return prev
      return (prev + 1) % filteredItems.length
    })
  }

  const goToPrevious = () => {
    setLightboxIndex((prev) => {
      if (prev === null) return prev
      return (prev - 1 + filteredItems.length) % filteredItems.length
    })
  }

  return (
    <section className="container">
      <div className="flex flex-col gap-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div className={cn('flex flex-col gap-4 text-foreground', MAX_TEXT_WIDTH)}>
            {eyebrow && (
              <span className="text-sm uppercase tracking-[0.55em] text-muted-foreground/90">
                {eyebrow}
              </span>
            )}

            {title && (
              <h2 className="text-[2.75rem] font-light leading-[1.05] md:text-[3.5rem]">{title}</h2>
            )}

            {description && (
              <RichText
                className="[&_p]:text-base [&_p]:leading-relaxed md:[&_p]:text-lg"
                data={description}
                enableGutter={false}
                enableProse={false}
              />
            )}
          </div>

          {tagOptions.length > 0 && (
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <button
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium uppercase tracking-[0.25em] transition',
                  activeTag === 'all'
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground/60 hover:text-foreground',
                )}
                onClick={() => setActiveTag('all')}
                type="button"
              >
                Todos
              </button>
              {tagOptions.map((option) => (
                <button
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium uppercase tracking-[0.25em] transition',
                    activeTag === option.id
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-muted-foreground hover:border-foreground/60 hover:text-foreground',
                  )}
                  key={option.id}
                  onClick={() => setActiveTag(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <button
                className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-card/70 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                key={item.id ?? index}
                onClick={() => openLightbox(index)}
                type="button"
              >
                <Media
                  className="relative block aspect-[4/3]"
                  imgClassName="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  pictureClassName="block h-full w-full"
                  resource={item.media}
                  videoClassName="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  videoProps={{
                    autoPlay: true,
                    loop: true,
                    muted: true,
                    playsInline: true,
                  }}
                />

                {item.description && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-left text-sm text-white">
                    <RichText
                      className="[&_p]:m-0 [&_p]:text-sm [&_strong]:font-semibold"
                      data={item.description}
                      enableGutter={false}
                      enableProse={false}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-border/60 bg-card/60 px-8 py-12 text-center text-sm text-muted-foreground">
            Aún no hay trabajos en esta categoría.
          </div>
        )}
      </div>

      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm">
          <button
            aria-label="Cerrar galería"
            className="absolute right-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg transition hover:bg-white"
            onClick={closeLightbox}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>

          {filteredItems.length > 1 && (
            <>
              <button
                aria-label="Imagen anterior"
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-foreground shadow-lg transition hover:bg-white"
                onClick={goToPrevious}
                type="button"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                aria-label="Imagen siguiente"
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-foreground shadow-lg transition hover:bg-white"
                onClick={goToNext}
                type="button"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="relative h-full max-h-[80vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/20 bg-black/60">
            <Media
              key={filteredItems[lightboxIndex].id ?? lightboxIndex}
              className="relative h-full w-full"
              fill
              imgClassName="object-contain"
              pictureClassName="block h-full w-full"
              resource={filteredItems[lightboxIndex].media}
              videoClassName="h-full w-full object-contain"
              videoProps={{
                autoPlay: true,
                controls: true,
                controlsList: 'nodownload noplaybackrate',
                muted: false,
                playsInline: true,
                preload: 'auto',
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
