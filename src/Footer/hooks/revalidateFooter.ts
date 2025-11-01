import type { GlobalAfterChangeHook } from 'payload'

type RevalidateTag = (tag: string) => void

let revalidateTag: RevalidateTag | undefined

void import('next/cache')
  .then((mod) => {
    revalidateTag = mod.revalidateTag
  })
  .catch(() => {
    revalidateTag = undefined
  })

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate && typeof revalidateTag === 'function') {
    payload.logger.info(`Revalidating footer`)

    revalidateTag('global_footer')
  }

  return doc
}
