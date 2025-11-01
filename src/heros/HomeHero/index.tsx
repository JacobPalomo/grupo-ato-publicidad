'use client'

import 'swiper/css'
import 'swiper/css/effect-fade'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useMemo, useState } from 'react'
import { Autoplay, EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type HomeHeroProps = Page['hero']

const TYPING_SPEED = 100
const DELETING_SPEED = 50
const PAUSE_BETWEEN_WORDS = 2000

export const HomeHero: React.FC<HomeHeroProps> = (props) => {
  const { richText, links, homeHero } = props
  const { setHeaderTheme } = useHeaderTheme()

  const {
    title = 'HECHO PARA TI',
    subtitlePrefix = 'Más de 20 años ayudando a los negocios a',
    changingTexts = [],
    slides = [],
    autoplayDelay = 4150,
    showTitle,
    showShortcuts,
  } = homeHero || {}

  type ShortcutSection = NonNullable<NonNullable<HomeHeroProps['homeHero']>['shortcuts']>[number]

  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const [isCursorBlinking, setIsCursorBlinking] = useState(false)

  const animatedTexts = useMemo(() => {
    return changingTexts
      .map((item) => item?.text?.trim())
      .filter((value): value is string => Boolean(value))
  }, [changingTexts])

  const heroSlides = useMemo(() => {
    return slides.filter((slide) => slide?.media && typeof slide.media === 'object')
  }, [slides])

  const shortcutsNormalized = useMemo(() => {
    if (!Array.isArray(homeHero?.shortcuts)) return []

    const rawShortcuts = homeHero.shortcuts as ShortcutSection[]

    if (!rawShortcuts.length) return []

    return rawShortcuts
      .map((section) => {
        if (!section?.label) return null

        const items =
          section.items
            ?.map((item) => {
              if (!item?.label || !item.link) return null

              const hasValidReference =
                item.link.type === 'reference' && item.link.reference && item.link.reference.value
              const hasValidUrl = item.link.type === 'custom' && item.link.url

              if (!hasValidReference && !hasValidUrl) return null

              return {
                id: item.id || `${item.label}-${section.id ?? section.label}`,
                icon: typeof item.icon === 'object' ? item.icon : null,
                label: item.label,
                link: item.link,
              }
            })
            .filter((value): value is NonNullable<typeof value> => Boolean(value)) || []

        if (items.length === 0) return null

        return {
          id: section.id || section.label,
          items,
          label: section.label,
        }
      })
      .filter((section): section is NonNullable<typeof section> => Boolean(section))
  }, [homeHero?.shortcuts])

  const duplicatedShortcuts = useMemo(() => {
    if (!shortcutsNormalized.length) return []
    return [...shortcutsNormalized, ...shortcutsNormalized]
  }, [shortcutsNormalized])

  const marqueeDuration = useMemo(() => {
    const baseSections = shortcutsNormalized.length || 1

    return Math.max(20, baseSections * 8)
  }, [shortcutsNormalized.length])

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  useEffect(() => {
    setDisplayText('')
    setIsDeleting(false)
    setTextIndex(0)
  }, [animatedTexts])

  useEffect(() => {
    if (!animatedTexts.length) return

    const currentText = animatedTexts[textIndex % animatedTexts.length]

    let timeout: NodeJS.Timeout

    if (!isDeleting && displayText !== currentText) {
      setIsCursorBlinking(false)
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1))
      }, TYPING_SPEED)
    } else if (!isDeleting && displayText === currentText) {
      setIsCursorBlinking(true)
      timeout = setTimeout(() => {
        setIsDeleting(true)
        setIsCursorBlinking(false)
      }, PAUSE_BETWEEN_WORDS)
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length - 1))
      }, DELETING_SPEED)
    } else if (isDeleting && displayText.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setTextIndex((prev) => (prev + 1) % animatedTexts.length)
      }, TYPING_SPEED)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [animatedTexts, displayText, isDeleting, textIndex])

  return (
    <section
      className="relative -mt-[10.4rem] h-[100svh] min-h-[100vh] w-full overflow-hidden text-white"
      data-theme="dark"
    >
      {heroSlides.length > 0 && (
        <Swiper
          autoplay={{
            delay: autoplayDelay ?? undefined,
            disableOnInteraction: false,
          }}
          effect="fade"
          slidesPerView={1}
          speed={900}
          loop
          modules={[Autoplay, EffectFade]}
          className="absolute inset-0 z-0 h-full w-full min-h-[100svh]"
          style={{ height: '100%' }}
        >
          {heroSlides.map((slide, index) => {
            if (!slide?.media) return null

            return (
              <SwiperSlide className="!h-full" key={slide?.id ?? index}>
                <div className="relative h-full min-h-[100svh] w-full">
                  <Media
                    className="absolute inset-0 h-full w-full"
                    fill
                    imgClassName="object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    pictureClassName="relative block h-full w-full"
                    priority={index === 0}
                    resource={slide.media}
                  />
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black via-black/35 to-transparent" />

      <div className="absolute inset-0 z-20 flex h-full w-full flex-col justify-between pb-10">
        <div className="container flex flex-col gap-6 pt-32">
          {richText && <RichText data={richText} enableGutter={false} />}

          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap gap-4">
              {links.map(({ link }, index) => {
                return (
                  <li key={link?.label ?? index}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="container w-full pb-4">
          <p className="mb-4 text-lg font-light tracking-wide text-white/90 md:text-3xl text-center">
            {subtitlePrefix}{' '}
            <span className="underline decoration-white decoration-2 underline-offset-4">
              {displayText}
            </span>
            <span
              aria-hidden
              className={cn(
                'ml-0 inline-block text-white',
                isCursorBlinking ? 'animate-pulse' : 'animate-none',
              )}
            >
              |
            </span>
            .
          </p>
          {showTitle !== false && title?.trim() && (
            <h1 className="mb-8 text-center font-thin text-[3.5rem] leading-[0.95] drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)] md:text-[6rem] lg:text-[9rem] xl:text-[10.5rem]">
              {title}
            </h1>
          )}

          {showShortcuts !== false && shortcutsNormalized.length > 0 && (
            <div className="mx-auto mt-6 w-full max-w-6xl">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-black via-black/70 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-black via-black/70 to-transparent" />
                <div
                  className="flex w-max min-w-full flex-nowrap gap-12 px-12 py-6 text-white"
                  style={{
                    animation: `home-hero-shortcuts-marquee ${marqueeDuration}s linear infinite`,
                  }}
                >
                  {duplicatedShortcuts.map((section, sectionIndex) => (
                    <div
                      className="flex w-max min-w-[18rem] flex-col items-center gap-5 text-center uppercase tracking-[0.35em]"
                      key={`${section.id}-${sectionIndex}`}
                    >
                      <span className="text-xs font-light text-white/70">{section.label}</span>
                      <div className="flex flex-nowrap items-center gap-10 text-base font-light normal-case tracking-normal">
                        {section.items.map((item) => {
                          if (!item.link) return null

                          const { link } = item
                          const appearanceProps = {
                            appearance: 'inline' as const,
                            newTab: link.newTab,
                            reference: link.reference,
                            type: link.type,
                            url: link.url,
                          }

                          return (
                            <CMSLink
                              className="group flex w-max flex-col items-center gap-3 text-white transition-colors duration-300 hover:text-white"
                              key={`${item.id ?? item.label}-${sectionIndex}`}
                              {...appearanceProps}
                            >
                              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/15 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                                {item.icon ? (
                                  <Media
                                    className="relative h-full w-full"
                                    fill
                                    imgClassName="object-contain p-3"
                                    resource={item.icon}
                                  />
                                ) : (
                                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                                    {item.label?.[0] ?? '?'}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/90 group-hover:text-white">
                                {item.label}
                              </span>
                            </CMSLink>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes home-hero-shortcuts-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
