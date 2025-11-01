'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useMemo } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type LexicalNode = {
  children?: LexicalNode[]
  text?: string
  type: string
  version: number
  [key: string]: unknown
}

type ExtractedHeroCopy = {
  eyebrow?: string
  heading?: string
  supportingRichText?: Page['hero']['richText']
  hasStructuredHeading: boolean
}

const getPlainText = (node?: LexicalNode | null): string => {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text

  if (Array.isArray(node.children)) {
    return node.children.map((child) => getPlainText(child)).join('')
  }

  return ''
}

const extractHeroCopy = (richText?: Page['hero']['richText']): ExtractedHeroCopy => {
  if (!richText?.root?.children || !Array.isArray(richText.root.children)) {
    return {
      hasStructuredHeading: false,
      supportingRichText: richText,
    }
  }

  const children = richText.root.children as LexicalNode[]

  let eyebrowIndex = -1
  let headingIndex = -1

  children.forEach((node, index) => {
    if (eyebrowIndex === -1 && node?.type === 'paragraph') {
      const text = getPlainText(node).trim()
      if (text.length > 0) eyebrowIndex = index
    }

    if (headingIndex === -1 && node?.type === 'heading') {
      const text = getPlainText(node).trim()
      if (text.length > 0) headingIndex = index
    }
  })

  const hasStructuredHeading = eyebrowIndex !== -1 || headingIndex !== -1

  if (!hasStructuredHeading) {
    return {
      hasStructuredHeading: false,
      supportingRichText: richText,
    }
  }

  const eyebrow =
    eyebrowIndex !== -1 ? getPlainText(children[eyebrowIndex]).trim() || undefined : undefined
  const heading =
    headingIndex !== -1 ? getPlainText(children[headingIndex]).trim() || undefined : undefined

  const supportingNodes = children.filter(
    (_, index) => index !== eyebrowIndex && index !== headingIndex,
  )

  const supportingRichText =
    supportingNodes.length > 0
      ? {
          ...richText,
          root: {
            ...richText.root,
            children: supportingNodes,
          },
        }
      : undefined

  return {
    eyebrow,
    heading,
    supportingRichText,
    hasStructuredHeading,
  }
}

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  const { eyebrow, heading, supportingRichText, hasStructuredHeading } = useMemo(
    () => extractHeroCopy(richText),
    [richText],
  )

  const descriptiveRichText = supportingRichText ?? (!hasStructuredHeading ? richText : undefined)

  return (
    <section
      className="relative -mt-[10.4rem] min-h-[20rem] overflow-hidden border-b border-white/20 text-white"
      data-theme="dark"
    >
      <div className="relative h-full w-full">
        {media && typeof media === 'object' ? (
          <Media
            className="absolute inset-0 h-full w-full"
            fill
            imgClassName="object-cover"
            pictureClassName="block h-full w-full"
            priority
            resource={media}
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        </div>

        <div className="relative z-10 flex h-full w-full flex-col justify-end">
          <div className="container flex flex-col gap-6 pb-16 pt-28 md:pb-20 md:pt-36">
            {(eyebrow || heading) && (
              <div className="flex max-w-4xl flex-col gap-3 text-balance">
                {eyebrow && (
                  <span className="text-xs uppercase tracking-[0.6em] text-white/75 md:text-sm">
                    {eyebrow}
                  </span>
                )}
                {heading && (
                  <h1 className="text-[3rem] font-light leading-[0.95] tracking-[-0.01em] text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.55)] md:text-[4.75rem]">
                    {heading}
                  </h1>
                )}
              </div>
            )}

            {descriptiveRichText && (
              <RichText
                className="max-w-3xl text-white/85 drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)] [&_p]:text-lg [&_p]:font-light [&_p]:leading-relaxed [&_p]:tracking-[0.015em] [&_strong]:font-semibold"
                data={descriptiveRichText}
                enableGutter={false}
                enableProse={false}
              />
            )}

            {Array.isArray(links) && links.length > 0 && (
              <ul className="flex flex-wrap gap-6">
                {links.map(({ link }, index) => {
                  return (
                    <li key={link?.label ?? index}>
                      <CMSLink
                        className="text-sm font-medium uppercase tracking-[0.35em] text-white/80 transition-colors hover:text-white"
                        {...link}
                      />
                    </li>
                  )
                })}
              </ul>
            )}

            {media && typeof media === 'object' && media?.caption && (
              <div className="max-w-xl text-sm text-white/75">
                <RichText
                  className="[&_p]:m-0 [&_p]:text-sm [&_strong]:font-semibold"
                  data={media.caption}
                  enableGutter={false}
                  enableProse={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
