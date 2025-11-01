import React from 'react'

import type { HeadlineBlock } from '@/payload-types'

const sizeClasses = {
  sm: 'text-xl md:text-2xl',
  md: 'text-2xl md:text-[2.5rem]',
  lg: 'text-[2.5rem] md:text-[3.5rem]',
  xl: 'text-[3.25rem] md:text-[4.5rem]',
}

const alignmentClasses = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

export const Headline: React.FC<HeadlineBlock> = ({
  text,
  alignment = 'center',
  eyebrow,
  size = 'xl',
}) => {
  if (!text?.trim()) return null

  const wrapperAlignment = alignmentClasses[alignment ?? 'center'] || alignmentClasses.center
  const headlineSize = sizeClasses[size ?? 'xl'] || sizeClasses.xl

  return (
    <div className="container">
      <div className={`flex flex-col gap-3 ${wrapperAlignment} text-balance font-light`}>
        {eyebrow && (
          <span className="text-sm uppercase tracking-[0.6em] text-foreground/70 md:text-base">
            {eyebrow}
          </span>
        )}
        <h2
          className={`font-light leading-tight text-foreground !text-3xl max-md:uppercase md:!text-7xl ${headlineSize}`}
        >
          {text}
        </h2>
      </div>
    </div>
  )
}
