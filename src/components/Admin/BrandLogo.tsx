'use client'

import React from 'react'

export const BrandLogo: React.FC = () => {
  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Grupo ATO Publicidad"
      className="h-10 w-auto"
      decoding="async"
      height={64}
      loading="eager"
      src="/media/logo.png"
      width={240}
    />
  )
}

export default BrandLogo
