import Image from "next/image"
import Link from "next/link"
import {
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  ShieldCheck,
  Award,
} from "lucide-react"

import { cmsService } from "@/lib/cms/service"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Promotions", href: "/promotions" },
  { label: "Pelvic Health", href: "/services/pelvic-health" },
  { label: "Medical Aesthetics", href: "/services/medical-aesthetics" },
]

const patients = [
  { label: "Book a Consultation", href: "https://spruceridgewellness.janeapp.com" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Dr. Pickard", href: "/about" },
]

export async function SiteFooter() {
  const settings = await cmsService.getSiteSettings()
  const contact = await cmsService.getPageContent("contact")
  const description =
    settings.about?.trim() ||
    "Surgeon-led pelvic wellness and medical aesthetics, with clinics in Bay Roberts and St. John's, Newfoundland."
  const phone = settings.contactPhone?.trim() || ""
  const email = settings.contactEmail?.trim() || ""
  const socials = (settings.socials ?? {}) as Record<string, string>
  const clinic1 = contact["clinic1.address"] || "494 Conception Bay Highway, Bay Roberts, NL A0A 1G0"
  const clinic2 = contact["clinic2.address"] || "100 Elizabeth Avenue, St. John's, NL A1B 1R9"

  return (
    <footer className="relative isolate overflow-hidden bg-deep-forest text-warm-cream">
      {/* Forest.png — single backdrop spanning the full footer */}
      <Image
        src="/images/Forest.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none select-none object-cover object-right"
      />
      {/* Forest wash — softer base, eased so the left side reads but never feels like a hard color block */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,42,31,0.9) 0%, rgba(15,42,31,0.62) 22%, rgba(15,42,31,0.35) 45%, rgba(15,42,31,0.12) 70%, rgba(15,42,31,0) 100%)",
        }}
      />
      {/* Misty haze — sage-tinted layer that adds atmospheric softness across the blend */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(184,207,194,0.18) 0%, rgba(184,207,194,0.1) 35%, rgba(184,207,194,0.04) 65%, rgba(184,207,194,0) 100%)",
        }}
      />
      {/* Vertical fade — gradually deepens toward the bottom so the columns sit on rich, dark forest */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(15,42,31,0) 0%, rgba(15,42,31,0.08) 22%, rgba(15,42,31,0.4) 45%, rgba(15,42,31,0.78) 65%, rgba(15,42,31,0.95) 82%, var(--deep-forest) 100%)",
        }}
      />

      {/* Drifting cloud wisps — horizontal streaks matching the mist already in the forest photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-70 mix-blend-screen"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 14%, black 30%, black 55%, transparent 80%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 14%, black 30%, black 55%, transparent 80%)",
        }}
      >
        {/* Far cloud layer — wide flat wisps drifting slowly to the right */}
        <div
          className="animate-fog-far absolute inset-y-0 left-0 h-full w-[200%]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 48% 6% at 18% 38%, rgba(220,224,212,0.28), transparent 88%)," +
              "radial-gradient(ellipse 40% 5% at 42% 52%, rgba(220,224,212,0.24), transparent 88%)," +
              "radial-gradient(ellipse 44% 7% at 70% 42%, rgba(220,224,212,0.26), transparent 88%)," +
              "radial-gradient(ellipse 38% 6% at 92% 56%, rgba(220,224,212,0.22), transparent 88%)",
            backgroundSize: "50% 100%",
            backgroundRepeat: "repeat-x",
            filter: "blur(20px)",
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-80 mix-blend-screen"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 16%, black 32%, black 50%, transparent 76%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 16%, black 32%, black 50%, transparent 76%)",
        }}
      >
        {/* Near cloud layer — softer larger wisps drifting right at a different speed for parallax */}
        <div
          className="animate-fog-near absolute inset-y-0 left-0 h-full w-[200%]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 52% 9% at 28% 32%, rgba(228,230,220,0.34), transparent 88%)," +
              "radial-gradient(ellipse 44% 7% at 60% 60%, rgba(228,230,220,0.28), transparent 88%)," +
              "radial-gradient(ellipse 50% 10% at 85% 38%, rgba(228,230,220,0.3), transparent 88%)",
            backgroundSize: "50% 100%",
            backgroundRepeat: "repeat-x",
            filter: "blur(28px)",
          }}
        />
      </div>
      {/* Top blend — extra-long, finely eased fade from warm-cream into the forest */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 sm:h-[26rem]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--warm-cream) 0%, rgba(245,242,237,0.99) 6%, rgba(245,242,237,0.96) 12%, rgba(245,242,237,0.9) 20%, rgba(245,242,237,0.8) 30%, rgba(245,242,237,0.66) 42%, rgba(245,242,237,0.5) 55%, rgba(245,242,237,0.34) 68%, rgba(245,242,237,0.2) 80%, rgba(245,242,237,0.08) 90%, rgba(245,242,237,0) 100%)",
        }}
      />

      {/* Top hero — Our Philosophy + CTA. Top padding clears the cream fade so cream type lands on visible forest. */}
      <div
        id="visit"
        className="relative z-10 mx-auto max-w-[1400px] scroll-mt-24 px-4 pb-12 pt-56 sm:px-6 sm:pb-14 sm:pt-72 lg:px-8 lg:pb-16 lg:pt-80"
      >
        <div
          className="max-w-[640px]"
          style={{
            // Soft dark halo behind text — improves readability over the misty image
            textShadow: "0 2px 24px rgba(15,42,31,0.55)",
          }}
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm-cream/85">
            Our Promise
          </span>
          <h2 className="mt-5 font-serif text-[40px] leading-[1.05] tracking-[-0.015em] text-warm-cream sm:text-[56px] lg:text-[68px]">
            Real medicine.
            <br />
            Delivered with <span className="italic">heart.</span>
          </h2>
          <p className="mt-6 max-w-[500px] text-[15px] leading-[1.65] text-warm-cream/85 sm:text-[16.5px]">
            You&rsquo;ll be heard here. Surgeon-led pelvic health and medical
            aesthetics, given with the time to listen and the experience to
            know what&rsquo;s next.
          </p>

          <div className="mt-7 flex items-center gap-2 text-[10.5px] uppercase tracking-[0.24em] text-warm-cream/70">
            <span aria-hidden="true" className="h-px w-8 bg-ridge-gold/80" />
            <span>Bay Roberts</span>
            <span className="text-warm-cream/40">·</span>
            <span>St. John&rsquo;s</span>
            <span aria-hidden="true" className="h-px w-8 bg-ridge-gold/80" />
          </div>

          <div
            className="mt-10 flex flex-wrap items-center gap-3"
            style={{ textShadow: "none" }}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-ridge-gold px-8 py-4 text-[14.5px] font-medium tracking-tight text-deep-forest shadow-[0_6px_28px_rgba(15,42,31,0.4)] transition-all hover:gap-3.5 hover:bg-warm-cream"
            >
              Book Your Consultation
              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-warm-cream/35 bg-warm-cream/5 px-7 py-4 text-[14px] tracking-tight text-warm-cream backdrop-blur-sm transition-all hover:border-warm-cream/55 hover:bg-warm-cream/10"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

      {/* Footer columns — sit on the same forest backdrop */}
      <div className="relative z-10">
        <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-6 lg:px-8 lg:pb-20 lg:pt-8">
          {/* Unified 4-column footer grid — brand + 3 nav columns all together */}
          <div className="grid grid-cols-1 items-start gap-12 sm:grid-cols-2 lg:grid-cols-[1.9fr_0.9fr_0.9fr_1.5fr] lg:gap-12">
            {/* Brand column — logo, description, social */}
            <div>
              <Image
                src="/images/logo.png"
                alt="Spruce Ridge Wellness"
                width={500}
                height={500}
                priority
                className="-ml-3 h-44 w-auto object-contain brightness-0 invert sm:-ml-4 sm:h-52 lg:h-60"
              />
              <p className="mt-5 max-w-[360px] text-[14px] leading-relaxed text-warm-cream/70">
                {description}
              </p>

              {/* Social */}
              <div className="mt-7 flex items-center gap-3">
                {socials.instagram ? (
                  <a
                    href={socials.instagram}
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-cream/15 text-warm-cream/75 transition-all hover:border-warm-cream/45 hover:text-warm-cream"
                  >
                    <Instagram size={14} strokeWidth={1.5} />
                  </a>
                ) : null}
                {socials.facebook ? (
                  <a
                    href={socials.facebook}
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-cream/15 text-warm-cream/75 transition-all hover:border-warm-cream/45 hover:text-warm-cream"
                  >
                    <Facebook size={14} strokeWidth={1.5} />
                  </a>
                ) : null}
                {socials.linkedin ? (
                  <a
                    href={socials.linkedin}
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-cream/15 text-warm-cream/75 transition-all hover:border-warm-cream/45 hover:text-warm-cream"
                  >
                    <Linkedin size={14} strokeWidth={1.5} />
                  </a>
                ) : null}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    aria-label="Email"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-cream/15 text-warm-cream/75 transition-all hover:border-warm-cream/45 hover:text-warm-cream"
                  >
                    <Mail size={14} strokeWidth={1.5} />
                  </a>
                ) : null}
              </div>
            </div>

            {/* Quick links */}
            <div className="lg:pt-8">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm-cream/55">
                Quick links
              </h4>
              <ul className="mt-6 space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group/link relative inline-flex items-center gap-2 text-[14px] text-warm-cream/75 transition-colors hover:text-warm-cream"
                    >
                      <span className="relative">
                        {item.label}
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-0.5 left-0 h-px w-0 bg-ridge-gold transition-all duration-300 group-hover/link:w-full"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Patients */}
            <div className="lg:pt-8">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm-cream/55">
                Patients
              </h4>
              <ul className="mt-6 space-y-3">
                {patients.map((item) => {
                  const external = item.href.startsWith("http")
                  const linkClass =
                    "group/link relative inline-flex items-center gap-2 text-[14px] text-warm-cream/75 transition-colors hover:text-warm-cream"
                  const inner = (
                    <span className="relative">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-0 h-px w-0 bg-ridge-gold transition-all duration-300 group-hover/link:w-full"
                      />
                    </span>
                  )
                  return (
                    <li key={item.label}>
                      {external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          {inner}
                          <ArrowUpRight
                            size={11}
                            strokeWidth={1.6}
                            className="opacity-60 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:opacity-100"
                          />
                        </a>
                      ) : (
                        <Link href={item.href} className={linkClass}>
                          {inner}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Visit us — two clinics + shared contact */}
            <div className="lg:pt-8">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm-cream/55">
                Visit Us
              </h4>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {/* Clinic 1 — Bay Roberts */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-warm-cream/[0.08] ring-1 ring-warm-cream/10 backdrop-blur-sm">
                    <MapPin
                      size={15}
                      strokeWidth={1.5}
                      className="text-ridge-gold"
                    />
                  </div>
                  <div>
                    <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-warm-cream">
                      Bay Roberts
                    </div>
                    <div className="mt-1.5 text-[13px] leading-snug text-warm-cream/70">
                      {clinic1}
                    </div>
                  </div>
                </div>

                {/* Clinic 2 — St. John's */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-warm-cream/[0.08] ring-1 ring-warm-cream/10 backdrop-blur-sm">
                    <MapPin
                      size={15}
                      strokeWidth={1.5}
                      className="text-ridge-gold"
                    />
                  </div>
                  <div>
                    <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-warm-cream">
                      St. John&rsquo;s
                    </div>
                    <div className="mt-1.5 text-[13px] leading-snug text-warm-cream/70">
                      {clinic2}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shared contact — phone + email stacked, each on its own line */}
              <div className="mt-6 space-y-3 border-t border-warm-cream/10 pt-5">
                {phone ? (
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="group flex items-center gap-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-warm-cream/[0.08] ring-1 ring-warm-cream/10">
                      <Phone size={14} strokeWidth={1.5} className="text-ridge-gold" />
                    </div>
                    <span className="text-[13.5px] tracking-tight text-warm-cream/80 transition-colors group-hover:text-warm-cream">
                      {phone}
                    </span>
                  </a>
                ) : null}
                {email ? (
                  <a href={`mailto:${email}`} className="group flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-warm-cream/[0.08] ring-1 ring-warm-cream/10">
                      <Mail size={14} strokeWidth={1.5} className="text-ridge-gold" />
                    </div>
                    <span className="truncate text-[13.5px] tracking-tight text-warm-cream/80 transition-colors group-hover:text-warm-cream">
                      {email}
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-warm-cream/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] tracking-tight text-warm-cream/50">
              © {new Date().getFullYear()} Spruce Ridge Wellness. All rights
              reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-[11.5px] tracking-[0.04em] text-warm-cream/70">
                <ShieldCheck
                  size={14}
                  strokeWidth={1.5}
                  className="text-ridge-gold"
                />
                FRCSC Surgeon-Led
              </div>
              <div className="flex items-center gap-2 text-[11.5px] tracking-[0.04em] text-warm-cream/70">
                <Award
                  size={14}
                  strokeWidth={1.5}
                  className="text-ridge-gold"
                />
                Trusted Care
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
