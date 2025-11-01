import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  const headerData = (await getCachedGlobal('header', 1)()) as Header | null

  if (!headerData) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Header global not found. Skipping Header render.')
    }
    return null
  }

  return <HeaderClient data={headerData} />
}
