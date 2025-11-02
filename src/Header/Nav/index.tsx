'use client'

import React, { useEffect, useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'
import { Menu, SearchIcon, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type HeaderNavProps = {
  data: HeaderType
}

type NavItemLink = NonNullable<HeaderType['navItems']>[number]['link']

const resolveHref = (link?: NavItemLink): string | null => {
  if (!link) return null

  if (
    link.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference.value &&
    'slug' in link.reference.value
  ) {
    const basePath = link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''
    return `${basePath}/${link.reference.value.slug}`
  }

  return link.url ?? null
}

const normalizePath = (value?: string | null): string | null => {
  if (!value) return null
  if (value === '/') return '/'

  return value.replace(/\/+$/, '')
}

const isActivePath = (pathname: string | null, href: string | null): boolean => {
  if (!pathname || !href) return false

  const current = normalizePath(pathname)
  const target = normalizePath(href)

  if (!current || !target) return false
  if (target === '/') return current === '/'

  return current === target || current.startsWith(`${target}/`)
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow
    }

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [isMenuOpen])

  const desktopLinkClasses =
    'relative text-sm font-semibold uppercase tracking-[0.32em] text-foreground/70 transition-colors duration-200 hover:text-foreground'
  const desktopActiveClasses =
    'text-primary after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-primary after:content-[""]'
  const mobileLinkClasses =
    'group block text-xl font-semibold uppercase tracking-[0.28em] transition-all duration-200 ease-out'
  const mobileActiveClasses = 'text-primary'

  const searchTriggerClasses =
    'inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:bg-neutral-900/75 dark:text-white dark:hover:bg-neutral-900'
  const mobileToggleClasses =
    'inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:bg-neutral-900/75 dark:text-white dark:hover:bg-neutral-900'
  const overlayCloseClasses =
    'inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white shadow-none backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'

  const processedNavItems = navItems.map(({ link }, index) => {
    const active = isActivePath(pathname, resolveHref(link))
    return {
      index,
      link,
      active,
    }
  })

  return (
    <nav className="relative flex items-center gap-3 lg:gap-10">
      <div className="hidden items-center gap-8 lg:flex">
        {processedNavItems.map(({ link, index, active }) => (
          <CMSLink
            key={`desktop-nav-${index}`}
            {...link}
            appearance="inline"
            className={cn(desktopLinkClasses, active && desktopActiveClasses)}
          />
        ))}
        <Link href="/search" className={searchTriggerClasses}>
          <span className="sr-only">Buscar</span>
          <SearchIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>

      <div className="flex items-center gap-3 lg:hidden">
        <Link href="/search" className={searchTriggerClasses}>
          <span className="sr-only">Abrir buscador</span>
          <SearchIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          className={mobileToggleClasses}
        >
          <span className="sr-only">{isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
          {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal={isMenuOpen || undefined}
        aria-hidden={!isMenuOpen}
        className={cn(
          'pointer-events-none fixed inset-0 z-50 flex translate-y-4 flex-col bg-gradient-to-br from-neutral-950/92 via-neutral-950/88 to-neutral-900/92 px-6 py-8 opacity-0 backdrop-blur-2xl transition-all duration-300 ease-out lg:hidden',
          isMenuOpen && 'pointer-events-auto translate-y-0 opacity-100',
        )}
      >
        <div className="flex items-center justify-between">
          <Logo className="h-10 w-auto" theme="light" />
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className={overlayCloseClasses}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-12 flex flex-1 flex-col justify-center">
          <ul className="space-y-6">
            {processedNavItems.map(({ link, index, active }) => (
              <li key={`mobile-nav-${index}`}>
                <CMSLink
                  {...link}
                  appearance="inline"
                  className={cn(
                    mobileLinkClasses,
                    active ? mobileActiveClasses : 'text-white/80 hover:translate-x-2 hover:text-white',
                    'focus-visible:translate-x-2 focus-visible:text-white',
                  )}
                />
              </li>
            ))}
            <li>
              <Link
                href="/search"
                className={cn(
                  'group flex items-center gap-4 text-xl font-semibold uppercase tracking-[0.28em] text-white/80 transition-all duration-200 ease-out hover:translate-x-2 hover:text-white focus-visible:translate-x-2 focus-visible:text-white',
                )}
              >
                <SearchIcon
                  className="h-5 w-5 shrink-0 text-white/60 transition group-hover:text-white group-focus-visible:text-white"
                  aria-hidden="true"
                />
                <span>Buscar</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
