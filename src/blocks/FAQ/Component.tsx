'use client'

import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

const MAX_TEXT_WIDTH = 'max-w-xl'

export const FAQBlock: React.FC<FAQBlockProps> = ({ eyebrow, title, description, items }) => {
  const faqs =
    items
      ?.map((item) => {
        if (!item?.question || !item?.answer) return null
        return {
          answer: item.answer,
          question: item.question,
          id: item.id ?? item.question,
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []

  const [openIndex, setOpenIndex] = useState(faqs.length > 0 ? 0 : -1)

  const handleToggle = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index))
  }

  return (
    <section className="container">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div className={cn('flex flex-col gap-6 text-foreground', MAX_TEXT_WIDTH)}>
          {eyebrow && (
            <span className="text-sm uppercase tracking-[0.55em] text-muted-foreground/90">
              {eyebrow}
            </span>
          )}

          {title && (
            <h2 className="text-[2.75rem] font-light leading-[1.05] md:text-[3.5rem]">{title}</h2>
          )}

          {description && (
            <RichText
              className="[&_p]:text-base [&_p]:leading-relaxed md:[&_p]:text-lg"
              data={description}
              enableGutter={false}
              enableProse={false}
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((item, index) => {
            const isOpen = index === openIndex

            return (
              <article
                className="overflow-hidden rounded-[1.75rem] border border-border bg-card/90 shadow-sm transition-shadow hover:shadow-md"
                key={item.id ?? index}
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-foreground transition-colors hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  onClick={() => handleToggle(index)}
                  type="button"
                >
                  <span className="text-lg font-medium leading-tight md:text-xl">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 transition-transform duration-200',
                      isOpen ? 'rotate-180' : 'rotate-0',
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <RichText
                      className="px-6 pb-6 text-foreground/80 [&_p]:text-base [&_p]:leading-relaxed md:[&_p]:text-lg"
                      data={item.answer}
                      enableGutter={false}
                      enableProse={false}
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
