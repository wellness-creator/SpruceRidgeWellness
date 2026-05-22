"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import type { HomeServicesContent } from "@/lib/cms/schema"

// Card number and detail-page link are structural — kept in code.
const serviceMeta = [
  { number: "01", href: "/services/pelvic-health" },
  { number: "02", href: "/services/medical-aesthetics" },
]

export function Services({ content }: { content: HomeServicesContent }) {
  const services = serviceMeta.map((meta, i) => ({
    ...meta,
    title: content.cards[i]?.title ?? "",
    description: content.cards[i]?.description ?? "",
    image: content.cards[i]?.image ?? "",
    treatments: content.cards[i]?.treatments ?? [],
  }))

  return (
    <section id="services" className="bg-warm-cream pb-24 pt-12 sm:pb-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-forest">
                {content.eyebrow}
              </span>
              <span aria-hidden className="h-px w-10 bg-ridge-gold/70" />
            </div>
            <h2 className="mt-5 max-w-[700px] font-serif text-[34px] leading-[1.05] tracking-[-0.01em] text-deep-forest sm:text-[44px] lg:text-[52px]">
              {content.heading}
            </h2>
          </div>
          <Link
            href="/services"
            className="group inline-flex shrink-0 items-center gap-2 self-start text-[12px] font-medium uppercase tracking-[0.22em] text-deep-forest transition-all hover:gap-3 sm:self-auto"
          >
            {content.viewAllLabel}
            <ArrowUpRight size={14} strokeWidth={1.6} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {services.map((service, idx) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
            >
              <Link
                href={service.href}
                className="group relative block overflow-hidden rounded-2xl bg-soft-stone"
              >
                <div className="relative aspect-[5/6] w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/85 via-deep-forest/30 to-deep-forest/0" />

                  {/* Top row */}
                  <div className="absolute inset-x-6 top-6 flex items-center justify-between sm:inset-x-8 sm:top-8">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-medium uppercase tracking-[0.22em] text-ridge-gold">
                        {service.number}
                      </span>
                      <span className="h-px w-8 bg-warm-cream/40" />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-warm-cream/30 bg-warm-cream/10 text-warm-cream backdrop-blur-sm transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-warm-cream group-hover:text-deep-forest">
                      <ArrowUpRight size={18} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:p-8">
                    <h3 className="font-serif text-[32px] leading-tight text-warm-cream sm:text-[40px]">
                      {service.title}
                    </h3>
                    <p className="max-w-[420px] text-[14px] leading-relaxed text-warm-cream/85 sm:text-[15px]">
                      {service.description}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {service.treatments.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-warm-cream/25 bg-warm-cream/5 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-warm-cream/85 backdrop-blur-sm"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
