import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.m4v']

const stripQueryParams = (value: string) => value.split('?')[0]

const hasVideoExtension = (value?: string | null) => {
  if (!value) return false
  const cleanValue = stripQueryParams(value).toLowerCase()
  return VIDEO_EXTENSIONS.some((ext) => cleanValue.endsWith(ext))
}

const isVideoResource = (resource: Props['resource']) => {
  if (!resource) return false

  if (typeof resource === 'object') {
    if (resource.mimeType?.startsWith('video')) return true
    return hasVideoExtension(resource.filename ?? resource.url ?? null)
  }

  if (typeof resource === 'string') {
    return hasVideoExtension(resource)
  }

  return false
}

const getResourceKey = (resource: Props['resource']) => {
  if (!resource) return 'media-null'

  if (typeof resource === 'object') {
    return (
      resource.id?.toString() ??
      resource.url ??
      resource.filename ??
      resource.thumbnailURL ??
      'media-object'
    )
  }

  return resource.toString()
}

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = isVideoResource(resource)
  const mediaKey = getResourceKey(resource)
  const Tag = htmlElement || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? (
        <VideoMedia key={`video-${mediaKey}`} {...props} />
      ) : (
        <ImageMedia key={`image-${mediaKey}`} {...props} />
      )}
    </Tag>
  )
}
