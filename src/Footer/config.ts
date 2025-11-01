import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'contactSection',
      type: 'group',
      admin: {
        description: 'Configura la sección de contacto que se muestra sobre el mapa.',
      },
      defaultValue: {
        eyebrow: 'Soluciones',
        title: 'Grupo ATO Publicidad',
        description: '',
        contacts: [],
      },
      fields: [
        {
          name: 'eyebrow',
          label: 'Eyebrow',
          type: 'text',
        },
        {
          name: 'title',
          label: 'Título',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Descripción',
          type: 'textarea',
        },
        {
          name: 'contacts',
          label: 'Medios de contacto',
          type: 'array',
          minRows: 0,
          defaultValue: [],
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'type',
              label: 'Tipo',
              type: 'select',
              defaultValue: 'email',
              options: [
                { label: 'Correo', value: 'email' },
                { label: 'Teléfono', value: 'phone' },
                { label: 'Dirección', value: 'address' },
                { label: 'Horario', value: 'schedule' },
                { label: 'Otro', value: 'custom' },
              ],
            },
            {
              name: 'label',
              label: 'Etiqueta',
              type: 'text',
            },
            {
              name: 'value',
              label: 'Contenido',
              type: 'textarea',
              required: true,
            },
            {
              name: 'link',
              label: 'Enlace',
              type: 'text',
              admin: {
                description: 'Opcional. Usa mailto:, tel:, o una URL.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'mapEmbed',
      label: 'Mapa (iframe)',
      type: 'textarea',
      admin: {
        rows: 6,
        description: 'Pega el código iframe de Google Maps u otro servicio.',
      },
    },
    {
      name: 'brandSection',
      label: 'Identidad de marca',
      type: 'group',
      defaultValue: {
        title: 'Grupo ATO Publicidad',
        description: '',
      },
      fields: [
        {
          name: 'title',
          label: 'Título principal',
          type: 'text',
        },
        {
          name: 'description',
          label: 'Descripción corta',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'siteLinks',
      label: 'Mapa del sitio',
      type: 'array',
      defaultValue: [],
      fields: [
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
      maxRows: 8,
    },
    {
      name: 'socialLinks',
      label: 'Redes sociales',
      type: 'array',
      defaultValue: [],
      fields: [
        {
          name: 'platform',
          label: 'Plataforma',
          type: 'select',
          defaultValue: 'instagram',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Otro', value: 'custom' },
          ],
        },
        {
          name: 'label',
          label: 'Etiqueta visible',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        initCollapsed: true,
      },
      maxRows: 6,
    },
    {
      name: 'bottomNote',
      label: 'Nota inferior',
      type: 'text',
      defaultValue: `© ${new Date().getFullYear()} Grupo ATO Publicidad.`,
    },
    {
      name: 'privacyLabel',
      label: 'Texto de enlace legal',
      type: 'text',
      defaultValue: 'Política de Privacidad',
    },
    {
      name: 'privacyLink',
      label: 'URL legal',
      type: 'text',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
