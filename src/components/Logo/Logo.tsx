import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  theme?: 'light' | 'dark' | null
}

export const LIGHT_LOGO_SRC =
  'https://wdht7gyp1pofr1kv.public.blob.vercel-storage.com/logo-light.svg'
export const DARK_LOGO_SRC =
  'https://wdht7gyp1pofr1kv.public.blob.vercel-storage.com/logo-dark.svg'

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, theme } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'
  const baseClassName = clsx('h-[64px] w-auto', className)
  const resolvedTheme = theme ?? undefined

  const sharedImageProps = {
    alt: 'Grupo ATO Publicidad',
    decoding: 'async' as const,
    fetchPriority: priority,
    height: 34,
    loading,
    width: 193,
  }

  return (
    /* eslint-disable @next/next/no-img-element */
    <span className="inline-flex items-center">
      <img
        {...sharedImageProps}
        className={clsx(
          baseClassName,
          'block filter dark:hidden',
          'drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]',
        )}
        style={
          resolvedTheme
            ? {
                display: resolvedTheme === 'light' ? 'block' : 'none',
              }
            : undefined
        }
        src={LIGHT_LOGO_SRC}
      />
      <img
        {...sharedImageProps}
        className={clsx(
          baseClassName,
          'hidden filter dark:block',
          'drop-shadow-[0_0_6px_rgba(255,255,255,0.55)] drop-shadow-[0_4px_16px_rgba(12,12,12,0.55)]',
        )}
        style={
          resolvedTheme
            ? {
                display: resolvedTheme === 'dark' ? 'block' : 'none',
              }
            : undefined
        }
        src={DARK_LOGO_SRC}
      />
    </span>
  )
}
