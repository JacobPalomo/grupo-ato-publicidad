'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName, videoProps } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  const { className: videoPropsClassName, poster: posterFromProps, ...restVideoProps } =
    videoProps ?? {}

  useEffect(() => {
    const { current: video } = videoRef
    if (!video) return

    const handleSuspend = () => {
      // setShowFallback(true);
      // console.warn('Video was suspended, rendering fallback image.')
    }

    video.addEventListener('suspend', handleSuspend)

    return () => {
      video.removeEventListener('suspend', handleSuspend)
    }
  }, [])

  let poster: string | undefined
  let resolvedVideoSource: string | undefined

  if (resource && typeof resource === 'object') {
    const { filename, sizes, thumbnailURL, url } = resource

    const fallbackPoster =
      posterFromProps ??
      sizes?.thumbnail?.url ??
      sizes?.small?.url ??
      thumbnailURL ??
      undefined

    poster = fallbackPoster ? getMediaUrl(fallbackPoster) : undefined
    const videoSourcePath = url ?? (filename ? `/media/${filename}` : undefined)
    resolvedVideoSource = videoSourcePath ? getMediaUrl(videoSourcePath) : undefined
  }

  const shouldAutoPlay = restVideoProps.autoPlay ?? true

  useEffect(() => {
    const node = videoRef.current
    if (!node || !resolvedVideoSource) return
    node.load()

    if (shouldAutoPlay) {
      const playPromise = node.play()
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => undefined)
      }
    } else {
      node.pause()
      node.currentTime = 0
    }
  }, [resolvedVideoSource, shouldAutoPlay])

  if (!resolvedVideoSource) {
    return null
  }

  return (
    <video
      key={resolvedVideoSource}
      autoPlay
      controls={false}
      loop
      muted
      playsInline
      preload="auto"
      className={cn(videoClassName, videoPropsClassName)}
      onClick={onClick}
      poster={poster}
      ref={videoRef}
      {...restVideoProps}
    >
      <source src={resolvedVideoSource} />
    </video>
  )
}
