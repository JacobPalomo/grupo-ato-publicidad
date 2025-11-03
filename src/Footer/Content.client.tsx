'use client'

import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import {
  FaCcAmex,
  FaCcMastercard,
  FaCcVisa,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa'
import { FiMail, FiGlobe, FiPhone, FiMapPin, FiClock, FiMessageCircle } from 'react-icons/fi'

export type FooterContentProps = {
  data: ExtendedFooter
}

type ExtendedFooter = Footer & {
  contactSection?: {
    eyebrow?: string | null
    title?: string | null
    description?: string | null
    contacts?: {
      id?: string | null
      type?: string | null
      label?: string | null
      value?: string | null
      link?: string | null
    }[]
  } | null
  mapEmbed?: string | null
  brandSection?: {
    title?: string | null
    description?: string | null
  } | null
  siteLinks?: Footer['siteLinks']
  socialLinks?:
    | {
        id?: string | null
        platform?: string | null
        label?: string | null
        url?: string | null
      }[]
    | null
  bottomNote?: string | null
  privacyLabel?: string | null
  privacyLink?: string | null
}

const contactIcons: Record<string, React.ReactNode> = {
  email: <FiMail className="h-5 w-5" />,
  phone: <FiPhone className="h-5 w-5" />,
  address: <FiMapPin className="h-5 w-5" />,
  schedule: <FiClock className="h-5 w-5" />,
  custom: <FiMessageCircle className="h-5 w-5" />,
}

const socialIcons: Record<string, React.ReactNode> = {
  facebook: <FaFacebookF className="h-5 w-5" />,
  instagram: <FaInstagram className="h-5 w-5" />,
  whatsapp: <FaWhatsapp className="h-5 w-5" />,
  tiktok: <FaTiktok className="h-5 w-5" />,
  youtube: <FaYoutube className="h-5 w-5" />,
  linkedin: <FaLinkedin className="h-5 w-5" />,
  custom: <FiGlobe className="h-5 w-5" />,
}

const CarnetIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    aria-labelledby="carnet-logo-title"
    className={className}
    role="img"
    viewBox="0 0 170 124"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title id="carnet-logo-title">Carnet</title>
    <rect width="170" height="124" rx="16" fill="currentColor" />
    <path
      d="M83.36 46.6399C108.51 46.6399 129.36 56.2499 133.51 68.8799C134.023 67.389 134.296 65.8263 134.32 64.2499C134.32 49.4199 111.51 37.3899 83.32 37.3899C55.13 37.3899 32.37 49.3899 32.37 64.2499C32.3904 65.8258 32.6605 67.3885 33.17 68.8799C37.38 56.2499 58.22 46.6399 83.36 46.6399ZM83.36 30.6399C108.51 30.6399 129.36 40.2499 133.51 52.8799C134.023 51.3925 134.296 49.8331 134.32 48.2599C134.32 33.4199 111.51 21.3899 83.32 21.3899C55.13 21.3899 32.37 33.3899 32.37 48.2599C32.3903 49.8325 32.6604 51.392 33.17 52.8799C37.38 40.2599 58.22 30.6499 83.36 30.6499V30.6399ZM104.3 94.9999L93.82 81.6399H88.82V101.52H93.6V88.5199L103.91 101.52H109.05V81.6399H104.3V94.9999ZM25.91 97.4099C24.8722 98.0996 23.6454 98.4491 22.4 98.4099C20.7494 98.4793 19.1363 97.9057 17.9 96.8099C16.74 95.7432 16.16 93.9532 16.16 91.4399C16.16 89.0732 16.7467 87.3566 17.92 86.2899C19.1876 85.2023 20.8213 84.6375 22.49 84.7099C23.708 84.6685 24.9123 84.9774 25.96 85.5999C26.872 86.1446 27.5411 87.0176 27.83 88.0399L32.92 87.0999C32.4378 85.6479 31.5323 84.3733 30.32 83.4399C28.0952 81.9243 25.4393 81.17 22.75 81.2899C19.6413 81.142 16.5827 82.1142 14.13 84.0299C13.0304 84.9767 12.1629 86.1634 11.5942 87.4983C11.0256 88.8333 10.771 90.281 10.85 91.7299C10.7871 93.1296 11.0486 94.5249 11.6141 95.8069C12.1796 97.0888 13.0338 98.2227 14.11 99.1199C16.4728 100.991 19.4285 101.953 22.44 101.83C24.7958 101.923 27.1325 101.373 29.2 100.24C31.0072 99.1357 32.3562 97.4175 33 95.3999L28 94.1999C27.6991 95.4809 26.9598 96.6165 25.91 97.4099ZM136.45 81.6399V84.9999H144V101.52H149.15V84.9999H156.65V81.6399H136.45ZM119.68 92.7599H132.43V89.3999H119.68V84.9999H133.38V81.6399H114.53V101.52H133.88V98.1499H119.68V92.7599ZM80 94.4199C79.1657 93.7456 78.244 93.1872 77.26 92.7599C79.0715 92.6526 80.811 92.0124 82.26 90.9199C82.8105 90.4745 83.2531 89.9103 83.5544 89.2695C83.8558 88.6287 84.0081 87.928 84 87.2199C84.0133 86.0779 83.6199 84.9684 82.89 84.0899C82.117 83.1522 81.0667 82.4835 79.89 82.1799C77.9576 81.7503 75.9783 81.5688 74 81.6399H63.15V101.52H68.29V93.2299H69.29C70.159 93.1987 71.0287 93.2726 71.88 93.4499C72.4488 93.6158 72.9767 93.8985 73.43 94.2799C74.3997 95.1824 75.3052 96.1514 76.14 97.1799L79.83 101.52H86L82.89 97.6499C82.0305 96.4847 81.0628 95.4032 80 94.4199ZM72.09 90.0599H68.29V84.9999H72.29C74.37 84.9999 75.62 84.9999 76.03 85.0699C76.7402 85.1298 77.416 85.4016 77.97 85.8499C78.1933 86.0571 78.3696 86.3099 78.4869 86.5911C78.6042 86.8723 78.6598 87.1754 78.65 87.4799C78.6704 88.0273 78.4848 88.5625 78.13 88.9799C77.7429 89.3953 77.2421 89.6874 76.69 89.8199C75.1671 90.0394 73.6274 90.1198 72.09 90.0599ZM44.76 81.6399L34.85 101.52H40.3L42.41 96.9999H52.59L54.8 101.51H60.39L50.21 81.6399H44.76ZM43.98 93.6399L47.42 86.2699L50.93 93.6399H43.98Z"
      className="fill-[hsl(var(--background))]"
    />
  </svg>
)

const paymentIcons = [
  { label: 'Visa', Icon: FaCcVisa },
  { label: 'Mastercard', Icon: FaCcMastercard },
  { label: 'American Express', Icon: FaCcAmex },
  { label: 'Carnet', Icon: CarnetIcon },
]

export const FooterContent: React.FC<FooterContentProps> = ({ data }) => {
  const contactSection = data.contactSection
  const contactItems = contactSection?.contacts
    ?.filter((item) => item?.value)
    ?.map((item, index) => ({
      ...item,
      type: item?.type || 'custom',
      key: item?.id ?? `${item?.type ?? 'contact'}-${index}`,
    }))
  const mapEmbed = data.mapEmbed
  const brandSection = data.brandSection
  const brandTitle = brandSection?.title || 'Grupo ATO Publicidad'
  const brandDescription = brandSection?.description ?? ''
  const siteLinks = data.siteLinks?.length ? data.siteLinks : []
  const socialLinks = data.socialLinks || []
  const currentYear = new Date().getFullYear()
  const bottomNote = data.bottomNote || `© ${currentYear} Grupo ATO Publicidad.`
  const privacyLabel = data.privacyLabel || 'Política de Privacidad'
  const privacyLink = data.privacyLink

  return (
    <footer className="mt-auto border-t border-border bg-background text-foreground">
      <div className="container space-y-12 py-16">
        {(contactSection?.title || contactSection?.description) && (
          <section className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              {contactSection?.eyebrow && (
                <p className="text-sm uppercase tracking-[0.6em] text-muted-foreground">
                  {contactSection.eyebrow}
                </p>
              )}
              {contactSection?.title && (
                <h2 className="text-[2.75rem] font-light leading-[1.05] md:text-[3.5rem]">
                  {contactSection.title}
                </h2>
              )}
              {contactSection?.description && (
                <p className="max-w-[36rem] text-lg text-foreground">
                  {contactSection.description}
                </p>
              )}
            </div>
            {contactItems && contactItems.length > 0 && (
              <ul className="space-y-6 text-base">
                {contactItems.map((item) => {
                  const icon = contactIcons[item.type ?? 'custom'] ?? contactIcons.custom
                  const isInternalLink = item.link?.startsWith('/')
                  const content = item.link ? (
                    isInternalLink ? (
                      <Link
                        className="break-words text-foreground transition-colors hover:text-foreground/80"
                        href={item.link}
                      >
                        {item.value}
                      </Link>
                    ) : (
                      <a
                        className="break-words text-foreground transition-colors hover:text-foreground/80 hover:underline"
                        href={item.link}
                        rel="noopener noreferrer"
                        target={item.link?.startsWith('http') ? '_blank' : undefined}
                      >
                        {item.value}
                      </a>
                    )
                  ) : (
                    <p className="whitespace-pre-line text-foreground/90">{item.value}</p>
                  )

                  return (
                    <li className="flex items-start gap-4" key={item.key}>
                      <span className="mt-1 text-foreground">{icon}</span>
                      <div className="space-y-1">
                        {item.label && (
                          <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground mb-1">
                            {item.label}
                          </p>
                        )}
                        {content}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}

        {mapEmbed && (
          <div className="footer-map border border-border/40 bg-card/40 p-3">
            <div className="relative h-0 overflow-hidden pb-[56.25%]">
              <div className="absolute inset-0" dangerouslySetInnerHTML={{ __html: mapEmbed }} />
            </div>
          </div>
        )}
      </div>

      <div className="w-[300px] mx-auto mb-16 flex flex-col items-center gap-3 text-sm text-foreground">
        <span className="uppercase tracking-[0.35em] text-foreground/70">Tema</span>
        <ThemeSelector />
      </div>

      <div className="container pb-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            <Link className="inline-flex" href="/">
              <Logo className="h-[80px]" />
            </Link>
            <h3 className="text-[2.75rem] font-light leading-[1.05] text-foreground md:text-[3.25rem]">
              {brandTitle}
            </h3>
            {brandDescription && (
              <p className="max-w-[32rem] text-lg text-muted-foreground">{brandDescription}</p>
            )}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.45em] text-foreground/70">
                ¡Aceptamos todas las tarjetas!
              </p>
              <div className="flex flex-wrap items-center gap-4 text-4xl text-muted-foreground">
                {paymentIcons.map(({ Icon, label }) => (
                  <Icon aria-label={label} key={label} role="img" className="text-foreground" />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div className="space-y-4">
              <h4 className="text-md uppercase tracking-[0.2em] text-foreground/70">
                Mapa del sitio
              </h4>
              <nav className="flex flex-col gap-2 text-foreground">
                {siteLinks.map(({ link }, i) => {
                  return <CMSLink key={i} {...link} />
                })}
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-md uppercase tracking-[0.2em] text-foreground/70">¡Síguenos!</h4>
              <ul className="flex flex-col gap-3 text-foreground">
                {socialLinks.map((item, index) => {
                  if (!item?.url) return null
                  const icon = socialIcons[item.platform ?? 'custom'] ?? socialIcons.custom
                  const isInternal = item.url.startsWith('/')

                  return (
                    <li key={item.id ?? `${item.platform ?? 'social'}-${index}`}>
                      {isInternal ? (
                        <Link
                          className="flex items-center gap-3 transition-colors hover:text-foreground/80"
                          href={item.url}
                        >
                          {icon}
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <a
                          className="flex items-center gap-3 transition-colors hover:text-foreground/80"
                          href={item.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {icon}
                          <span>{item.label}</span>
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container border-t border-border/40 py-6 text-sm !text-foreground">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span>{bottomNote}</span>
          <div className="flex items-center gap-6">
            {privacyLink &&
              (privacyLink.startsWith('/') ? (
                <Link className="transition-colors hover:text-foreground" href={privacyLink}>
                  {privacyLabel}
                </Link>
              ) : (
                <a
                  className="transition-colors hover:text-foreground"
                  href={privacyLink}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {privacyLabel}
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
