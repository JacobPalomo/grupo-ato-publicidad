import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

export const getDefaultGlobalData = (slug: Global): Record<string, unknown> | undefined => {
  if (slug === 'footer') {
    return {
      contactSection: {
        eyebrow: 'Soluciones',
        title: 'Grupo ATO Publicidad',
        description: '',
        contacts: [],
      },
      mapEmbed: '',
      brandSection: {
        title: 'Grupo ATO Publicidad',
        description: '',
      },
      siteLinks: [],
      socialLinks: [],
      bottomNote: `© ${new Date().getFullYear()} Grupo ATO Publicidad.`,
      privacyLabel: 'Política de Privacidad',
      privacyLink: '',
    }
  }

  return undefined
}

async function getGlobal(slug: Global, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  try {
    const global = await payload.findGlobal({
      slug,
      depth,
    })

    return global
  } catch (error) {
    if (typeof error === 'object' && error && 'status' in error && (error as { status?: number }).status === 404) {
      const defaultData = getDefaultGlobalData(slug)

      if (defaultData) {
        const created = await payload.updateGlobal({
          slug,
          depth,
          data: defaultData,
          upsert: true,
        })

        return created
      }

      return null
    }

    throw error
  }
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
