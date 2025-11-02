import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

const vercelBlobToken = process.env.BLOB_READ_WRITE_TOKEN
const blobHostMatch = vercelBlobToken?.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)
const blobHostname = blobHostMatch?.[1]
  ? `${blobHostMatch[1].toLowerCase()}.public.blob.vercel-storage.com`
  : null

const remotePatterns = (() => {
  const patterns = []

  try {
    const primaryUrl = new URL(NEXT_PUBLIC_SERVER_URL)
    patterns.push({
      hostname: primaryUrl.hostname,
      protocol: primaryUrl.protocol.replace(':', ''),
    })
  } catch (error) {
    console.warn('Invalid NEXT_PUBLIC_SERVER_URL provided to next.config.js', error)
  }

  if (blobHostname) {
    patterns.push({
      hostname: blobHostname,
      protocol: 'https',
    })
  }

  return patterns
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
