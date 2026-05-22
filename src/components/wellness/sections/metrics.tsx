"use client"

import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import type { HomeNumbersContent } from "@/lib/cms/schema"

// Animates a numeric string ("95", "11K", "28") from 0 → final value when
// scrolled into view. Splits the string into a numeric part and an optional
// trailing letter (K/M), so "11K" counts 0 → 11K with the K appended.
function CountUp({
  value,
  duration = 1400,
}: {
  value: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const match = value.match(/^(\d+)([A-Za-z]*)$/)
  const targetNum = match ? parseInt(match[1], 10) : 0
  const unit = match?.[2] ?? ""

  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setCount(Math.round(eased * targetNum))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, targetNum, duration])

  // If the value isn't a plain number ("11K" still works; "n/a" wouldn't),
  // fall back to showing it as-is.
  if (!match) return <span ref={ref}>{value}</span>

  return (
    <span ref={ref}>
      {count}
      {unit}
    </span>
  )
}

export function Metrics({ content }: { content: HomeNumbersContent }) {
  return (
    <section className="relative bg-warm-cream py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-forest">
                {content.eyebrow}
              </span>
              <span aria-hidden className="h-px w-10 bg-ridge-gold/70" />
            </div>
            <h2 className="mt-5 max-w-[600px] font-serif text-[36px] leading-[1.04] tracking-[-0.01em] text-deep-forest sm:text-[46px] lg:text-[54px]">
              {content.heading}
            </h2>
          </div>
          <p className="max-w-[440px] text-[15px] leading-[1.7] text-deep-forest/70">
            {content.intro}
          </p>
        </motion.div>

        {/* Featured + supporting */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
          {/* Featured stat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="group relative overflow-hidden rounded-[28px] bg-soft-stone/55 p-10 sm:p-14 lg:p-16"
          >
            {/* Decorative mist glow */}
            <div
              aria-hidden
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mist/40 blur-[60px]"
            />
            <span
              aria-hidden
              className="absolute right-10 top-10 h-2 w-2 rounded-full bg-ridge-gold"
            />

            <div className="relative flex h-full flex-col justify-between gap-12">
              <div className="flex items-baseline gap-1">
                <span className="font-serif leading-[0.85] tracking-[-0.03em] text-deep-forest text-[120px] sm:text-[160px] lg:text-[200px]">
                  <CountUp value={content.featured.value} duration={1700} />
                </span>
                <span className="font-serif leading-none text-ridge-gold text-[60px] sm:text-[80px] lg:text-[96px]">
                  {content.featured.suffix}
                </span>
              </div>
              <div className="max-w-md">
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-deep-forest">
                  {content.featured.label}
                </span>
                <p className="mt-3 text-[14px] leading-[1.65] text-deep-forest/65 sm:text-[15px]">
                  {content.featured.desc}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Supporting stats */}
          <div className="grid grid-cols-1 gap-3">
            {content.metrics.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.15 + idx * 0.1 }}
                className="group relative flex items-center justify-between gap-6 rounded-2xl border border-frost bg-warm-cream p-6 transition-all duration-500 hover:border-mist hover:bg-soft-stone/30 sm:p-7"
              >
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-deep-forest">
                    {s.label}
                  </span>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-deep-forest/55">
                    {s.desc}
                  </p>
                </div>
                <div className="flex shrink-0 items-baseline gap-0.5">
                  <span className="font-serif text-[42px] leading-none tracking-[-0.02em] text-deep-forest sm:text-[52px]">
                    {s.value}
                  </span>
                  <span className="font-serif text-[20px] leading-none text-ridge-gold sm:text-[24px]">
                    {s.suffix}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Signature row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center gap-5 border-t border-frost pt-8"
        >
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-frost">
              <Image
                src="/images/dr-felicia.png"
                alt={content.signatureName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-[15px] text-deep-forest">
                {content.signatureName}
              </span>
              <span className="text-[10.5px] uppercase tracking-[0.22em] text-deep-forest/55">
                {content.signatureRole}
              </span>
            </div>
          </div>
          <span aria-hidden className="hidden h-8 w-px bg-frost sm:block" />
          <p className="max-w-md text-[12px] italic leading-[1.55] text-deep-forest/55">
            {content.signatureNote}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
