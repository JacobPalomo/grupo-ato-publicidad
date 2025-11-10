import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { GalleryTags } from './collections/GalleryTags'

import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

const defaultSharpPixelLimit = Number(process.env.SHARP_LIMIT_INPUT_PIXELS ?? 80_000_000)
if (Number.isFinite(defaultSharpPixelLimit) && defaultSharpPixelLimit > 0) {
  sharp.limitInputPixels(defaultSharpPixelLimit)
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const smtpHost = process.env.SMTP_HOST
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
const smtpSecure =
  process.env.SMTP_SECURE === 'true'
    ? true
    : process.env.SMTP_SECURE === 'false'
      ? false
      : process.env.SMTP_PORT === '465'

const shouldSkipEmailVerification =
  process.env.SMTP_SKIP_VERIFY === 'true' || typeof process.env.SMTP_SKIP_VERIFY === 'undefined'

const emailAdapter =
  smtpHost && smtpUser && smtpPass
    ? await nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'formulario@grupoatopublicidad.com',
        defaultFromName: process.env.SMTP_FROM_NAME || 'Formulario Grupo ATO Publicidad',
        skipVerify: shouldSkipEmailVerification,
        transportOptions: {
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        },
      })
    : undefined

const databaseUrl = process.env.DATABASE_URI || process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URI (Postgres connection string) is required. Update your environment variables before starting Payload.',
  )
}

const shouldUseSSL =
  process.env.DATABASE_SSL === 'true' ||
  (process.env.DATABASE_SSL !== 'false' && process.env.VERCEL === '1')

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      //   beforeDashboard: ['@/components/BeforeDashboard'],
      graphics: {
        Icon: '@/components/Admin/BrandIcon',
        Logo: '@/components/Admin/BrandLogo',
      },
    },
    meta: {
      icons: {
        icon: 'https://wdht7gyp1pofr1kv.public.blob.vercel-storage.com/public_favicon.ico',
        shortcut: 'https://wdht7gyp1pofr1kv.public.blob.vercel-storage.com/public_favicon.ico',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
      ...(shouldUseSSL
        ? {
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {}),
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  collections: [Pages, Posts, Media, Categories, GalleryTags, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  email: emailAdapter,
})
