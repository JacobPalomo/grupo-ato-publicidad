 'use client'

import React, { useMemo } from 'react'

import type { ClientLogosBlock } from '@/payload-types'

import { Media } from '@/components/Media'

const speedToDuration: Record<NonNullable<ClientLogosBlock['speed']>, number> = {
  slow: 40,
  medium: 25,
  fast: 16,
}

const isValidSpeed = (
  value: ClientLogosBlock['speed'],
): value is keyof typeof speedToDuration => {
  return typeof value === 'string' && value in speedToDuration
}

export const ClientLogos: React.FC<ClientLogosBlock> = ({ logos, height = 56, speed }) => {
  const validLogos = useMemo(() => {
    return (logos || []).filter((logo) => logo?.media && typeof logo.media === 'object')
  }, [logos])

  const normalizedSpeed = isValidSpeed(speed) ? speed : 'medium'
  const marqueeDuration = speedToDuration[normalizedSpeed]

  if (validLogos.length === 0) return null

  const totalItems = validLogos.length * 2

  return (
    <section className="py-12">
      <div className="container">
        <div
          className="relative overflow-hidden py-6"
          style={{
            '--client-logo-height': `${height}px`,
            '--client-logo-duration': `${marqueeDuration}s`,
          } as React.CSSProperties}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/70 to-transparent" />

          <div className="client-logos-marquee flex w-max animate-[client-logos-marquee_var(--client-logo-duration)_linear_infinite] items-center gap-16">
            {Array.from({ length: totalItems }).map((_, index) => {
              const originalIndex = index % validLogos.length
              const logo = validLogos[originalIndex]
              const media = logo.media

              const baseKey =
                logo.id ||
                (typeof media === 'object' && 'id' in media && (media as { id?: string | number }).id
                  ? `media-${(media as { id?: string | number }).id}`
                  : `logo-${originalIndex}`)
              const key = `${baseKey}-${index}`

              const logoNode = (
                <div
                  className="flex items-center justify-center opacity-75 transition-opacity duration-300 hover:opacity-100"
                  style={{ height: 'var(--client-logo-height)' } as React.CSSProperties}
                >
                  <Media
                    className="relative block h-full"
                    imgClassName="h-full w-auto object-contain"
                    resource={media}
                  />
                </div>
              )

              if (logo.link) {
                return (
                  <a
                    className="flex items-center"
                    href={logo.link}
                    key={key}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {logoNode}
                  </a>
                )
              }

              return (
                <div className="flex items-center" key={key}>
                  {logoNode}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes client-logos-marquee {
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
