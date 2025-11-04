'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName, videoProps } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { filename, sizes, thumbnailURL } = resource
    const { className: videoPropsClassName, poster: posterFromProps, ...restVideoProps } =
      videoProps ?? {}

    const fallbackPoster =
      posterFromProps ??
      sizes?.thumbnail?.url ??
      sizes?.small?.url ??
      thumbnailURL ??
      undefined

    return (
      <video
        autoPlay
        controls={false}
        loop
        muted
        playsInline
        preload="auto"
        className={cn(videoClassName, videoPropsClassName)}
        onClick={onClick}
        poster={fallbackPoster}
        ref={videoRef}
        {...restVideoProps}
      >
        <source src={getMediaUrl(`/media/${filename}`)} />
      </video>
    )
  }

  return null
}
