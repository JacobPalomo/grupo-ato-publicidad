'use client'

import 'swiper/css'
import 'swiper/css/pagination'

import React, { useMemo } from 'react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { FeaturedProductsSliderBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = FeaturedProductsSliderBlock & {
  disableInnerContainer?: boolean
}

export const FeaturedProductsSlider: React.FC<Props> = (props) => {
  const { slides, autoplay, autoplayDelay, loop, showSupTitle = true } = props

  const modules = useMemo(() => {
    const base = [Pagination]

    if (autoplay) {
      base.push(Autoplay)
    }

    return base
  }, [autoplay])

  if (!slides?.length) return null

  return (
    <section className="py-16">
      <div className="container">
        <Swiper
          autoplay={
            autoplay
              ? {
                  delay: autoplayDelay ?? 4500,
                  disableOnInteraction: false,
                }
              : false
          }
          centeredSlides
          grabCursor
          loop={loop ?? false}
          modules={modules}
          navigation={false}
          pagination={{ clickable: true }}
          slidesPerView={1.1}
          spaceBetween={-40}
          breakpoints={{
            768: {
              slidesPerView: 1.75,
              spaceBetween: -120,
            },
            1280: {
              slidesPerView: 2.35,
              spaceBetween: -160,
            },
          }}
          className="featured-products-slider"
        >
          {slides.map((slide, index) => {
            if (!slide?.media || typeof slide.media !== 'object') return null

            return (
              <SwiperSlide className="featured-products-slider__slide" key={slide.id ?? index}>
                <article className="group relative aspect-[3/5] w-full max-w-[22rem] overflow-hidden rounded-[2.6rem] bg-black/70 ring-1 ring-white/10 transition-transform duration-700">
                  <Media
                    className="absolute inset-0 h-full w-full"
                    fill
                    imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index < 2}
                    resource={slide.media}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.85)_75%)]" />
                  <div className="relative z-10 flex h-full flex-col justify-between px-10 pb-16 pt-12 text-white">
                    {showSupTitle && slide.supTitle && (
                      <div className="text-center text-[0.82rem] font-light uppercase tracking-[0.45em] text-white/85 md:text-[0.9rem]">
                        {slide.supTitle.split('\n').map((line, lineIndex) => (
                          <span className="block" key={lineIndex}>
                            {line}
                          </span>
                        ))}
                      </div>
                    )}
                    {slide.caption && (
                      <RichText
                        className="featured-products-slider__caption mt-auto text-center font-light text-white !leading-[1] text-[1.5rem]"
                        data={slide.caption}
                        enableGutter={false}
                      />
                    )}
                  </div>
                </article>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      <style jsx global>{`
        .featured-products-slider {
          padding-bottom: 4.5rem;
        }

        .featured-products-slider .swiper-slide {
          transition:
            transform 0.6s ease,
            opacity 0.6s ease,
            filter 0.6s ease;
          transform: scale(0.82);
          opacity: 0.4;
          filter: blur(0.75px);
          display: flex;
          justify-content: center;
        }

        .featured-products-slider .swiper-slide-active {
          transform: scale(1);
          opacity: 1;
          filter: blur(0);
        }

        .featured-products-slider .swiper-slide-next,
        .featured-products-slider .swiper-slide-prev {
          transform: scale(0.9);
          opacity: 0.65;
          filter: blur(0.2px);
        }

        .featured-products-slider .swiper-pagination-bullet {
          opacity: 1;
          width: 8px;
          height: 8px;
          margin: 0 6px !important;
        }

        [data-theme='dark'] .featured-products-slider .swiper-pagination-bullet {
          background-color: rgba(255, 255, 255, 0.35);
        }

        [data-theme='light'] .featured-products-slider .swiper-pagination-bullet {
          background-color: rgba(0, 0, 0, 0.2);
        }

        [data-theme='dark'] .featured-products-slider .swiper-pagination-bullet-active {
          background-color: rgba(255, 255, 255, 0.85);
        }

        [data-theme='light'] .featured-products-slider .swiper-pagination-bullet-active {
          background-color: rgba(0, 0, 0, 0.7);
        }

        .featured-products-slider .swiper-pagination {
          bottom: 0;
        }

        .featured-products-slider__caption strong {
          color: inherit;
          font-weight: 700;
          text-shadow: inherit;
        }

        @media (max-width: 640px) {
          .featured-products-slider {
            padding-bottom: 3.5rem;
          }

          .featured-products-slider .swiper-slide {
            transform: scale(0.92);
            opacity: 0.65;
            filter: blur(0.35px);
          }

          .featured-products-slider .swiper-slide-active {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
          }

          .featured-products-slider .swiper-slide-next,
          .featured-products-slider .swiper-slide-prev {
            transform: scale(0.95);
            opacity: 0.8;
          }

          .featured-products-slider__slide article {
            max-width: 18rem;
          }

          .featured-products-slider__caption {
            font-size: 1.7rem;
          }
        }
      `}</style>
    </section>
  )
}
