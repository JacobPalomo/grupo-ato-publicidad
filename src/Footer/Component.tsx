import { getCachedGlobal } from '@/utilities/getGlobals'

import type { Footer } from '@/payload-types'

import type { FooterContentProps } from './Content.client'
import { FooterContent } from './Content.client'

const sanitizeMapEmbed = (embed?: string | null) => {
  if (!embed) return null

  let sanitized = embed
    .replace(/width="[^"]*"/gi, 'width="100%"')
    .replace(/height="[^"]*"/gi, 'height="100%"')

  if (/style="[^"]*"/i.test(sanitized)) {
    sanitized = sanitized.replace(
      /style="([^"]*)"/i,
      (_match, styles) => `style="${styles};width:100%;height:100%;border:0;"`,
    )
  } else {
    sanitized = sanitized.replace(/<iframe/i, '<iframe style="width:100%;height:100%;border:0;"')
  }

  return sanitized
}

type ExtendedFooter = FooterContentProps['data']

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as Footer | null

  if (!footerData) return null

  const extended = footerData as ExtendedFooter

  const sanitizedData: ExtendedFooter = {
    ...extended,
    mapEmbed: sanitizeMapEmbed(extended.mapEmbed),
  }

  return <FooterContent data={sanitizedData} />
}
