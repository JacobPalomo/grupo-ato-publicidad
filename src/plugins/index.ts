import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import type { BeforeEmail } from '@payloadcms/plugin-form-builder/types'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

const normalizeFieldKey = (key: string): string =>
  key
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

const stringifyValue = (value: unknown): string => {
  if (value === null || typeof value === 'undefined') return ''
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item === null || typeof item === 'undefined') return ''
        if (typeof item === 'object') return JSON.stringify(item)
        return String(item)
      })
      .filter(Boolean)
      .join(', ')
  }
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const escapeHTML = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const selectValue = (fieldMap: Map<string, string>, ...keys: string[]): string => {
  for (const key of keys) {
    const normalizedKey = normalizeFieldKey(key)
    if (!normalizedKey) continue
    const value = fieldMap.get(normalizedKey)
    if (value) return value
  }
  return ''
}

const formatFormSubmissionEmail: BeforeEmail = async (emails, beforeChangeParameters) => {
  const submissionData = beforeChangeParameters?.data?.submissionData
  if (!Array.isArray(submissionData) || submissionData.length === 0) {
    return emails
  }

  const fieldMap = submissionData.reduce<Map<string, string>>((map, entry) => {
    const fieldKey = typeof entry?.field === 'string' ? normalizeFieldKey(entry.field) : ''
    if (!fieldKey) return map
    const stringValue = stringifyValue(entry?.value).trim()
    if (!stringValue) return map
    if (!map.has(fieldKey)) {
      map.set(fieldKey, stringValue)
    }
    return map
  }, new Map())

  const fullName = selectValue(fieldMap, 'fullname', 'nombrecompleto', 'full-name', 'full_name', 'name', 'nombre')
  let firstName = selectValue(fieldMap, 'firstname', 'first-name', 'first_name', 'nombre', 'name')
  let lastName = selectValue(fieldMap, 'lastname', 'last-name', 'last_name', 'apellido', 'surname')

  if (!firstName && fullName) {
    const parts = fullName.split(/\s+/).filter(Boolean)
    firstName = parts.shift() ?? ''
    lastName = lastName || parts.join(' ')
  }

  if (!lastName && fullName) {
    const parts = fullName.split(/\s+/).filter(Boolean)
    if (parts.length > 1) {
      parts.shift()
      lastName = parts.join(' ')
    }
  }

  const emailAddress = selectValue(fieldMap, 'email', 'correo', 'emailaddress', 'email-address')
  const messageValueRaw = selectValue(fieldMap, 'message', 'mensaje', 'consulta', 'comment', 'comments')
  const messageValue = messageValueRaw.replace(/\r\n/g, '\n')

  const firstNameDisplay = firstName ? escapeHTML(firstName) : '--'
  const lastNameDisplay = lastName ? escapeHTML(lastName) : ''
  const emailDisplay = emailAddress ? escapeHTML(emailAddress) : '--'
  const messageDisplay = messageValue ? escapeHTML(messageValue) : '--'
  const replyHrefBase = emailAddress ? `mailto:${encodeURI(emailAddress)}` : 'mailto:'
  const replyHref = `${replyHrefBase}?subject=Re:%20Contacto%20en%20Grupo%20ATO%20Publicidad`
  const plainName = [firstName, lastName].filter(Boolean).join(' ').trim() || '--'
  const plainEmail = emailAddress || '--'
  const plainMessage = messageValue || '--'

  const htmlTemplate = `<!-- ====== Grupo ATO Publicidad | Email de Formulario (B/W Minimal) ====== -->
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Nuevo mensaje de contacto</title>
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; background-color: #f6f6f6">
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f6f6f6"
    >
      <tr>
        <td align="center" style="padding: 28px 12px">
          <!-- Container -->
          <table
            role="presentation"
            width="640"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width: 640px;
              max-width: 100%;
              background-color: #ffffff;
              border: 1px solid #e6e6e6;
            "
          >
            <!-- Header / Logo -->
            <tr>
              <td align="left" style="padding: 24px 28px 12px 28px">
                <img
                  src="https://wdht7gyp1pofr1kv.public.blob.vercel-storage.com/grupo-ato-publicidad-customer-logo.svg"
                  width="180"
                  height="48"
                  alt="Grupo ATO Publicidad"
                  style="
                    display: block;
                    width: 140px;
                    height: auto;
                    border: 0;
                    outline: none;
                    text-decoration: none;
                  "
                />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td
                align="left"
                style="
                  padding: 40px 28px 8px 28px;
                  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
                  color: #111111;
                  text-transform: uppercase;
                "
              >
                <div
                  style="
                    font-size: 20px;
                    line-height: 26px;
                    font-weight: 700;
                    letter-spacing: 0.2px;
                  "
                >
                  Nuevo mensaje desde el sitio web
                </div>
              </td>
            </tr>

            <!-- Subline -->
            <tr>
              <td
                align="left"
                style="
                  padding: 0 28px 16px 28px;
                  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
                  color: #808080;
                "
              >
                <div style="font-size: 13px; line-height: 20px">
                  Has recibido un nuevo mensaje de un cliente potencial.
                </div>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 28px">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      style="
                        border-top: 1px solid #e6e6e6;
                        font-size: 0;
                        line-height: 0;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Datos -->
            <tr>
              <td style="padding: 18px 28px 0 28px">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="border: 1px solid #ededed"
                >
                  <tr>
                    <td
                      style="
                        padding: 14px 16px;
                        font-family: Arial, 'Helvetica Neue', Helvetica,
                          sans-serif;
                        font-size: 14px;
                        line-height: 22px;
                        color: #111111;
                        font-weight: bold;
                      "
                    >
                      Detalles del contacto
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        padding: 6px 16px;
                        font-family: Arial, 'Helvetica Neue', Helvetica,
                          sans-serif;
                        font-size: 14px;
                        line-height: 22px;
                        color: #222222;
                      "
                    >
                      <span style="font-weight: 600">Nombre:&nbsp;</span
                      ><span>${firstNameDisplay}${lastNameDisplay ? ` ${lastNameDisplay}` : ''}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        padding: 0 16px 14px 16px;
                        font-family: Arial, 'Helvetica Neue', Helvetica,
                          sans-serif;
                        font-size: 14px;
                        line-height: 22px;
                        color: #222222;
                      "
                    >
                      <span style="font-weight: 600">Correo:&nbsp;</span>
                      <a
                        href="${emailAddress ? `mailto:${encodeURI(emailAddress)}` : 'mailto:'}"
                        style="color: #111111; text-decoration: none"
                        >${emailDisplay}</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Mensaje -->
            <tr>
              <td style="padding: 16px 28px 0 28px">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    border-left: 3px solid #111111;
                    background-color: #fbfbfb;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 14px 16px;
                        font-family: Arial, 'Helvetica Neue', Helvetica,
                          sans-serif;
                        color: #222222;
                      "
                    >
                      <div
                        style="
                          font-size: 14px;
                          line-height: 22px;
                          font-weight: 600;
                          margin-bottom: 6px;
                          color: #111111;
                        "
                      >
                        Mensaje
                      </div>
                      <div
                        style="
                          font-size: 14px;
                          line-height: 22px;
                          white-space: pre-line;
                          word-break: break-word;
                        "
                      >
                        ${messageDisplay}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Quick actions -->
            <tr>
              <td align="center" style="padding: 18px 28px 6px 28px">
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      bgcolor="#111111"
                      style="border-radius: 0"
                    >
                      <a
                        href="${replyHref}"
                        style="
                          display: inline-block;
                          padding: 10px 16px;
                          font-family: Arial, 'Helvetica Neue', Helvetica,
                            sans-serif;
                          font-size: 13px;
                          line-height: 18px;
                          color: #ffffff;
                          text-decoration: none;
                          font-weight: 700;
                          letter-spacing: 0.3px;
                        "
                      >
                        Responder
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        font-family: Arial, 'Helvetica Neue', Helvetica,
                          sans-serif;
                        font-size: 12px;
                        color: #6b6b6b;
                        padding-top: 8px;
                      "
                    >
                      o reenvía este correo a tu equipo.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                align="center"
                style="
                  padding: 18px 28px 24px 28px;
                  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
                  color: #8a8a8a;
                "
              >
                <div style="font-size: 12px; line-height: 18px">
                  Enviado desde el formulario de contacto de
                  <a
                    href="https://www.grupoatopublicidad.com"
                    style="color: #111111; text-decoration: none"
                    >Grupo ATO Publicidad</a
                  >.
                  <br />
                  © 2025 Grupo ATO Publicidad
                </div>
              </td>
            </tr>
          </table>
          <!-- /Container -->
        </td>
      </tr>
    </table>

    <!-- Texto plano (para multipart/alternative) 
Nombre: ${plainName}
Correo: ${plainEmail}
Mensaje:
${escapeHTML(plainMessage)}
-->
  </body>
</html>`

  const plainText = `Nombre: ${plainName}
Correo: ${plainEmail}
Mensaje:
${plainMessage}`

  return emails.map((email) => ({
    ...email,
    html: htmlTemplate,
    text: plainText,
  }))
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    beforeEmail: formatFormSubmissionEmail,
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  payloadCloudPlugin(),
  vercelBlobStorage({
    enabled: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    collections: {
      media: true,
    },
  }),
]
