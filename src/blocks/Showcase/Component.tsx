'use client'

import { Pause, Play } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import type { ShowcaseBlock as ShowcaseBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

const MAX_CONTENT_WIDTH = 'max-w-2xl'

export const ShowcaseBlock: React.FC<ShowcaseBlockProps> = (props) => {
  const { description, eyebrow, links, media, mediaPosition = 'right', title } = props

  const isVideo =
    media && typeof media === 'object' && typeof media?.mimeType === 'string'
      ? media.mimeType.includes('video')
      : false

  const mediaUrl = useMemo(() => {
    if (!isVideo || !media || typeof media !== 'object') return ''
    return getMediaUrl(media.url, media.updatedAt)
  }, [isVideo, media])

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPaused(false)
    const handlePause = () => setIsPaused(true)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    // Reset paused state when media changes
    setIsPaused(video.paused)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [mediaUrl])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      void video.play()
    } else {
      video.pause()
    }
  }

  const hasLinks = Array.isArray(links) && links.length > 0
  const isMediaLeft = mediaPosition === 'left'

  return (
    <section className="container">
      <div className="overflow-hidden rounded-[2.75rem] border border-border/40 bg-card/90 shadow-md">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:p-16">
          <div
            className={cn(
              'flex flex-col gap-8',
              isMediaLeft ? 'lg:order-2 lg:items-end lg:text-right' : 'lg:order-1',
            )}
          >
            <div className={cn('flex flex-col gap-4', MAX_CONTENT_WIDTH)}>
              {eyebrow && (
                <span
                  className={cn(
                    'text-sm uppercase tracking-[0.6em] text-muted-foreground',
                    isMediaLeft ? 'lg:text-right' : 'lg:text-left',
                  )}
                >
                  {eyebrow}
                </span>
              )}

              {title && (
                <h2
                  className={cn(
                    'text-[2.5rem] font-light leading-[1.05] text-foreground md:text-[3.4rem]',
                    isMediaLeft ? 'lg:text-right' : 'lg:text-left',
                  )}
                >
                  {title}
                </h2>
              )}

              {description && (
                <RichText
                  className={cn(
                    'text-muted-foreground',
                    MAX_CONTENT_WIDTH,
                    '[&_p]:text-base [&_p]:leading-relaxed md:[&_p]:text-lg',
                    isMediaLeft ? 'lg:text-right lg:self-end' : 'lg:text-left',
                  )}
                  data={description}
                  enableGutter={false}
                  enableProse={false}
                />
              )}
            </div>

            {hasLinks && (
              <ul
                className={cn(
                  'flex flex-wrap gap-4',
                  isMediaLeft ? 'lg:justify-end' : 'lg:justify-start',
                )}
              >
                {links?.map(({ link }, index) => {
                  if (!link) return null
                  return (
                    <li key={link?.label ?? index}>
                      <CMSLink {...link} />
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div
            className={cn(
              'relative flex w-full items-center justify-center',
              isMediaLeft ? 'lg:order-1' : 'lg:order-2',
            )}
          >
            <div className="relative w-full max-w-[36rem] overflow-hidden rounded-[2.25rem] border border-border/40 bg-muted/20 shadow-lg">
              {isVideo && media && typeof media === 'object' && mediaUrl ? (
                <>
                  <video
                    key={typeof media === 'object' ? media.id ?? media.url ?? media.filename : undefined}
                    autoPlay
                    className="aspect-[4/3] h-full w-full object-cover"
                    loop
                    muted
                    playsInline
                    ref={videoRef}
                    src={mediaUrl}
                  />
                  <button
                    aria-label={isPaused ? 'Reproducir video' : 'Pausar video'}
                    className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg transition hover:bg-white"
                    onClick={(event) => {
                      event.stopPropagation()
                      togglePlayback()
                    }}
                    type="button"
                  >
                    {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  </button>
                </>
              ) : (
                <Media
                  className="block aspect-[4/3]"
                  imgClassName="h-full w-full object-cover"
                  pictureClassName="block h-full w-full"
                  priority={false}
                  resource={media}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
