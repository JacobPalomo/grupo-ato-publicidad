'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { DARK_LOGO_SRC, LIGHT_LOGO_SRC } from '@/components/Logo/Logo'
import canUseDOM from '@/utilities/canUseDOM'

export const BrandLogo: React.FC = () => {
  const getInitialTheme = () => {
    if (!canUseDOM) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

  useEffect(() => {
    if (!canUseDOM) return

    const root = document.documentElement
    const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const resolveTheme = (): 'light' | 'dark' => {
      const attr = root.getAttribute('data-theme')
      if (attr === 'dark' || attr === 'light') return attr
      return prefersDarkQuery.matches ? 'dark' : 'light'
    }

    const updateTheme = () => setTheme(resolveTheme())

    updateTheme()

    const observer = new MutationObserver(() => updateTheme())
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

    const handleMediaChange = () => updateTheme()

    if (typeof prefersDarkQuery.addEventListener === 'function') {
      prefersDarkQuery.addEventListener('change', handleMediaChange)
    } else if (typeof prefersDarkQuery.addListener === 'function') {
      prefersDarkQuery.addListener(handleMediaChange)
    }

    return () => {
      observer.disconnect()
      if (typeof prefersDarkQuery.removeEventListener === 'function') {
        prefersDarkQuery.removeEventListener('change', handleMediaChange)
      } else if (typeof prefersDarkQuery.removeListener === 'function') {
        prefersDarkQuery.removeListener(handleMediaChange)
      }
    }
  }, [])

  const { src, filter } = useMemo(() => {
    const isDark = theme === 'dark'
    return {
      filter: isDark
        ? 'drop-shadow(0px 0px 6px rgba(255,255,255,0.4)) drop-shadow(0px 3px 14px rgba(10,10,10,0.45))'
        : 'drop-shadow(0px 2px 8px rgba(0,0,0,0.18))',
      src: isDark ? DARK_LOGO_SRC : LIGHT_LOGO_SRC,
    }
  }, [theme])

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Grupo ATO Publicidad"
      decoding="async"
      fetchPriority="high"
      height={34}
      loading="eager"
      src={src}
      style={{
        filter,
        height: '120px',
        width: 'auto',
      }}
      width={193}
    />
  )
}

export default BrandLogo
