"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

import type { HomeHeroContent } from "@/lib/cms/schema"

const ease = [0.22, 1, 0.36, 1] as const

// 8 pills sit on a full circle at equal 45° spacing around a pivot near
// the bottom-center of the photo. The wheel rotates continuously clockwise
// to the right; the cream dome masks the lower half so visible pills
// always read as a clean evenly-spaced fan.
const ARC_RADIUS = 320
const FAN_CENTER_TOP = "108%"
const ROTATION_PERIOD_S = 120
const PILL_WIDTH_PX = 140

function renderMultiline(value: string) {
  const lines = value.split("\n")
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 ? <br className="hidden sm:block" /> : null}
    </span>
  ))
}

export function Hero({ content }: { content: HomeHeroContent }) {
  const treatments = content.treatments

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-warm-cream pt-6 sm:pt-8 lg:pt-10"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] lg:rounded-[40px]">
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[16/9]">
            <Image
              src={content.image}
              alt={content.headline.replace(/\n/g, " ")}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />

            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-deep-forest/45 via-deep-forest/10 to-deep-forest/55"
            />

            {/* Headline */}
            <div className="absolute inset-x-0 top-[8%] flex flex-col items-center px-6 text-center sm:top-[11%] lg:top-[12%]">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease }}
                className="font-serif text-warm-cream"
                style={{
                  fontSize: "clamp(34px, 5.6vw, 96px)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.024em",
                  fontWeight: 400,
                }}
              >
                {renderMultiline(content.headline)}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease }}
                className="mt-7 max-w-[600px] text-[14px] leading-[1.65] text-warm-cream/90 sm:mt-8 sm:text-[15.5px]"
              >
                {content.subhead}
              </motion.p>
            </div>

            {/* Rotating service wheel — desktop only.
                8 pills at equal 45° spacing on a full circle around the
                bottom-center pivot. Continuous clockwise loop. Cream dome
                masks the lower half so the visible pills always read as an
                evenly-spaced fan. */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              <div
                className="absolute"
                style={{
                  left: "50%",
                  top: FAN_CENTER_TOP,
                  width: 0,
                  height: 0,
                  animation: `wheel-spin ${ROTATION_PERIOD_S}s linear infinite`,
                  willChange: "transform",
                }}
              >
                {treatments.map((t, i) => {
                  const positionTheta = (i / Math.max(treatments.length, 1)) * 360
                  const positionRad = (positionTheta * Math.PI) / 180
                  const cx = ARC_RADIUS * Math.sin(positionRad)
                  const cy = -ARC_RADIUS * Math.cos(positionRad)
                  const cssRotation = positionTheta + 90

                  return (
                    <div
                      key={t}
                      className="pointer-events-auto absolute"
                      style={{
                        left: `${cx.toFixed(2)}px`,
                        top: `${cy.toFixed(2)}px`,
                        transform: `translate(-50%, -50%) rotate(${cssRotation.toFixed(2)}deg)`,
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.7 + i * 0.06,
                          ease,
                        }}
                        className="flex h-9 items-center justify-center rounded-full border border-warm-cream/55 bg-warm-cream/22 px-2 backdrop-blur-md whitespace-nowrap shadow-[0_2px_18px_rgba(15,42,31,0.22)]"
                        style={{ width: PILL_WIDTH_PX }}
                      >
                        <span className="text-[9.5px] uppercase tracking-[0.12em] text-warm-cream">
                          {t}
                        </span>
                      </motion.div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Single smooth arc cream dome — SVG path with horizontal
                tangents at the bottom corners so the curve eases smoothly
                into the photo's bottom edge. */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1, ease }}
              className="absolute bottom-0 left-1/2 z-30 hidden -translate-x-1/2 lg:block"
              style={{
                width: "min(50%, 640px)",
                height: "clamp(110px, 11vw, 160px)",
              }}
            >
              <svg
                viewBox="0 0 600 100"
                preserveAspectRatio="none"
                aria-hidden
                className="absolute inset-0 h-full w-full text-warm-cream"
              >
                <path
                  d="M 0 100 C 150 100, 150 0, 300 0 C 450 0, 450 100, 600 100 Z"
                  fill="currentColor"
                />
              </svg>
              <Link
                href={content.ctaHref}
                aria-label={content.ctaLabel}
                className="group absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center origin-bottom transition-transform duration-500 ease-out hover:scale-[1.18]"
              >
                <Image
                  src="/images/logo-mark.png"
                  alt="Spruce Ridge Wellness"
                  width={132}
                  height={100}
                  priority
                  className="h-auto w-auto"
                  style={{ height: "clamp(80px, 7vw, 110px)" }}
                />
                <span className="mt-1 text-[9.5px] uppercase tracking-[0.22em] text-deep-forest/80 sm:text-[10.5px]">
                  {content.ctaLabel}
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Mobile / tablet fallback */}
        <div className="mt-6 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {treatments.map((t) => (
              <div
                key={t}
                className="flex shrink-0 items-center whitespace-nowrap rounded-full border border-frost bg-warm-cream px-3 py-1.5"
              >
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-deep-forest/80">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
