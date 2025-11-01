'use client'

import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import {
  FaCcAmex,
  FaCcDiscover,
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

const paymentIcons = [
  { label: 'Visa', Icon: FaCcVisa },
  { label: 'Mastercard', Icon: FaCcMastercard },
  { label: 'American Express', Icon: FaCcAmex },
  { label: 'Discover', Icon: FaCcDiscover },
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
