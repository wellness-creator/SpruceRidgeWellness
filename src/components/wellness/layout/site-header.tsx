"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowUpRight } from "lucide-react"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Promotions", href: "/promotions" },
  { label: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-warm-cream/85 shadow-[0_1px_0_0_rgba(15,42,31,0.06)] backdrop-blur-xl"
            : "bg-warm-cream"
        }`}
      >
        <div className="mx-auto flex h-[96px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center transition-opacity hover:opacity-80"
            aria-label="Spruce Ridge Wellness home"
          >
            <Image
              src="/images/logo.png"
              alt="Spruce Ridge Wellness"
              width={260}
              height={80}
              priority
              className="h-16 w-auto sm:h-20"
            />
          </Link>

          {/* Desktop nav with active pill */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative px-5 py-2 text-[14px] tracking-tight text-deep-forest"
                >
                  <span className="relative z-10">{link.label}</span>
                  {active && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-soft-stone"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* CTA */}
          <a
            href="https://spruceridgewellness.janeapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden shrink-0 items-center gap-2 rounded-full bg-deep-forest px-6 py-3 text-[13px] tracking-tight text-warm-cream transition-all hover:bg-forest hover:gap-3 lg:inline-flex"
          >
            Book Now
            <ArrowUpRight
              size={14}
              strokeWidth={1.6}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-deep-forest/15 text-deep-forest lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-warm-cream lg:hidden"
          >
            <div className="flex h-full flex-col px-6 pb-12 pt-[140px]">
              <nav className="flex flex-col">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.12 + idx * 0.05,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-frost"
                  >
                    <Link
                      href={link.href}
                      className="flex items-center justify-between py-5 font-serif text-[28px] leading-tight tracking-[-0.005em] text-deep-forest"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight size={20} strokeWidth={1.4} />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-10 space-y-4"
              >
                <a
                  href="https://spruceridgewellness.janeapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-deep-forest px-6 py-4 text-[14px] tracking-tight text-warm-cream"
                >
                  Book Consultation
                  <ArrowUpRight size={14} strokeWidth={1.6} />
                </a>
                <a
                  href="tel:7097869150"
                  className="block text-center text-[13px] tracking-tight text-deep-forest/60"
                >
                  709-786-9150
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
