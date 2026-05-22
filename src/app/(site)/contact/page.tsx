import Link from "next/link"
import type { Metadata } from "next"
import { ArrowUpRight, Phone, MapPin } from "lucide-react"
import { SiteHeader } from "@/components/wellness/layout/site-header"
import { SiteFooter } from "@/components/wellness/layout/site-footer"
import { ScrollProgress } from "@/components/wellness/motion/scroll-progress"
import { SectionNav } from "@/components/wellness/motion/section-nav"
import { Reveal } from "@/components/wellness/motion/reveal"
import { cmsService } from "@/lib/cms/service"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://spruceridgewellness.ca"

const EMAIL = "spruceridgewellness@gmail.com"
const BOOKING_URL = "https://spruceridgewellness.janeapp.com"

export const metadata: Metadata = {
  title: {
    absolute:
      "Contact Spruce Ridge Wellness | Bay Roberts & Bense Clinic St. John's, NL",
  },
  description:
    "Contact Spruce Ridge Wellness, a physician-led pelvic health and medical aesthetics clinic in Newfoundland. Two locations — Bay Roberts and the Bense Clinic in St. John's. Call 709-786-9150, email spruceridgewellness@gmail.com, or book online.",
  keywords: [
    "Spruce Ridge Wellness contact",
    "Spruce Ridge Wellness phone number",
    "Spruce Ridge Wellness email",
    "Spruce Ridge Wellness Bay Roberts",
    "Spruce Ridge Wellness St. John's",
    "Bense Clinic St. John's",
    "Bense Clinic contact",
    "Bense Clinic phone",
    "Dr. Felicia Pickard contact",
    "Dr. Pickard book appointment",
    "book consultation Newfoundland",
    "book consultation Bay Roberts",
    "book consultation St. John's",
    "book pelvic health consultation NL",
    "book medical aesthetics consultation NL",
    "physician-led clinic Newfoundland",
    "FRCSC clinic Bay Roberts",
    "FRCSC clinic St. John's",
    "women's health clinic Newfoundland",
    "pelvic floor clinic Conception Bay",
    "medical aesthetics clinic Elizabeth Avenue",
    "Conception Bay Highway clinic",
    "appointment booking Newfoundland",
    "Jane App booking Newfoundland",
    "709-786-9150",
  ],
  alternates: { canonical: `${SITE_URL}/contact` },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Contact — Spruce Ridge Wellness | Bay Roberts & St. John's, NL",
    description:
      "Reach Spruce Ridge Wellness in Newfoundland. Two clinics, one chart — every consultation is with Dr. Pickard, FRCSC. Book online, call 709-786-9150, or email.",
    url: `${SITE_URL}/contact`,
    siteName: "Spruce Ridge Wellness",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/images/dr-pickard.jpg",
        width: 1024,
        height: 1024,
        alt: "Dr. Felicia Pickard, FRCSC, founder of Spruce Ridge Wellness in Newfoundland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Spruce Ridge Wellness",
    description:
      "Two NL clinics — Bay Roberts and the Bense Clinic in St. John's. Book a consultation with Dr. Pickard, FRCSC.",
    images: ["/images/dr-pickard.jpg"],
  },
  category: "Medical Practice",
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebPage", "ContactPage"],
      "@id": `${SITE_URL}/contact#webpage`,
      url: `${SITE_URL}/contact`,
      name: "Contact Spruce Ridge Wellness | Bay Roberts & Bense Clinic St. John's, NL",
      description:
        "Contact Spruce Ridge Wellness — two physician-led clinics in Newfoundland. Phone, email, addresses, and online booking for Bay Roberts and the Bense Clinic in St. John's.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "en-CA",
      about: { "@id": `${SITE_URL}/#business` },
      mainEntity: { "@id": `${SITE_URL}/#business` },
      breadcrumb: { "@id": `${SITE_URL}/contact#breadcrumbs` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/dr-pickard.jpg`,
        width: 1024,
        height: 1024,
      },
      potentialAction: {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: BOOKING_URL,
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
        result: { "@type": "Reservation", name: "Consultation booking" },
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/contact#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: `${SITE_URL}/contact`,
        },
      ],
    },
    {
      "@type": "MedicalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Spruce Ridge Wellness",
      legalName: "Spruce Ridge Wellness",
      url: SITE_URL,
      telephone: "+1-709-786-9150",
      email: EMAIL,
      image: `${SITE_URL}/images/dr-pickard.jpg`,
      logo: `${SITE_URL}/images/logo-mark.png`,
      priceRange: "$$",
      currenciesAccepted: "CAD",
      paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
      founder: { "@id": `${SITE_URL}/about#physician` },
      employee: { "@id": `${SITE_URL}/about#physician` },
      areaServed: [
        {
          "@type": "AdministrativeArea",
          name: "Newfoundland and Labrador",
        },
        { "@type": "City", name: "Bay Roberts" },
        { "@type": "City", name: "St. John's" },
      ],
      medicalSpecialty: [
        "CosmeticProcedure",
        "GeneralSurgery",
        "PlasticSurgery",
      ],
      knowsLanguage: ["en-CA"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+1-709-786-9150",
          email: EMAIL,
          contactType: "appointment booking",
          areaServed: "CA-NL",
          availableLanguage: ["English"],
        },
        {
          "@type": "ContactPoint",
          telephone: "+1-709-786-9150",
          contactType: "customer service",
          areaServed: "CA-NL",
          availableLanguage: ["English"],
        },
      ],
      sameAs: [`${SITE_URL}/about`],
      potentialAction: {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: BOOKING_URL,
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
        result: { "@type": "Reservation", name: "Consultation booking" },
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          description: "By appointment only",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
        },
      ],
      location: [
        {
          "@type": "Place",
          "@id": `${SITE_URL}/contact#bay-roberts`,
          name: "Spruce Ridge Wellness — Bay Roberts",
          telephone: "+1-709-786-9150",
          hasMap:
            "https://www.google.com/maps/search/?api=1&query=494+Conception+Bay+Highway+Bay+Roberts+NL",
          address: {
            "@type": "PostalAddress",
            streetAddress: "494 Conception Bay Highway",
            addressLocality: "Bay Roberts",
            addressRegion: "NL",
            postalCode: "A0A 1G0",
            addressCountry: "CA",
          },
        },
        {
          "@type": "Place",
          "@id": `${SITE_URL}/contact#bense-clinic`,
          name: "Spruce Ridge Wellness — Bense Clinic, St. John's",
          telephone: "+1-709-786-9150",
          hasMap:
            "https://www.google.com/maps/search/?api=1&query=100+Elizabeth+Avenue+St.+John%27s+NL",
          address: {
            "@type": "PostalAddress",
            streetAddress: "100 Elizabeth Avenue",
            addressLocality: "St. John's",
            addressRegion: "NL",
            postalCode: "A1B 1R9",
            addressCountry: "CA",
          },
        },
      ],
    },
  ],
}

export default async function ContactPage() {
  const c = await cmsService.getPageContent("contact")
  const phoneHref = `tel:${(c["contact.phone"] || "").replace(/[^\d+]/g, "")}`
  const clinics = [
    {
      name: c["clinic1.name"] ?? "",
      address: c["clinic1.address"] ?? "",
      phone: c["clinic1.phone"] ?? "",
    },
    {
      name: c["clinic2.name"] ?? "",
      address: c["clinic2.address"] ?? "",
      phone: c["clinic2.phone"] ?? "",
    },
  ].filter((cl) => cl.name || cl.address)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ScrollProgress />
      <SiteHeader />
      <SectionNav
        items={[
          { kind: "section", id: "details", label: "Reach Us" },
          { kind: "section", id: "maps", label: "Locations" },
        ]}
      />

      <main className="bg-warm-cream">
        {/* ──────────── BREADCRUMB ──────────── */}
        <nav
          aria-label="Breadcrumb"
          className="px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16"
        >
          <div className="mx-auto max-w-[1280px]">
            <Reveal duration={0.7}>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="text-[11px] font-medium uppercase tracking-[0.22em] text-deep-forest/55 transition-colors hover:text-deep-forest"
                >
                  Spruce Ridge
                </Link>
                <span aria-hidden="true" className="h-px w-5 bg-deep-forest/30" />
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-forest">
                  Contact
                </span>
              </div>
            </Reveal>
          </div>
        </nav>

        {/* ──────────── SECTION 1: HERE FOR YOU ──────────── */}
        <section
          id="details"
          aria-labelledby="details-heading"
          className="scroll-mt-24 px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24"
        >
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-12 border-t border-frost pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <Reveal>
                  <h1
                    id="details-heading"
                    className="font-serif text-[40px] leading-[1.04] tracking-[-0.012em] text-deep-forest sm:text-[52px] lg:text-[60px]"
                  >
                    {c["hero.heading"]}
                  </h1>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="mt-6 max-w-[460px] text-[15px] leading-[1.75] text-deep-forest/75 sm:text-[16px]">
                    {c["hero.intro"]}
                  </p>
                </Reveal>
                <Reveal delay={0.16}>
                  <div className="mt-9 flex flex-wrap gap-4">
                    <a
                      href={c["hero.bookUrl"] || BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-[6px] bg-ridge-gold px-9 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-warm-cream transition-colors hover:bg-ridge-gold/90"
                    >
                      {c["hero.bookLabel"]}
                    </a>
                    <a
                      href={phoneHref}
                      className="inline-flex items-center justify-center rounded-[6px] border border-deep-forest/25 px-9 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-deep-forest transition-colors hover:border-deep-forest hover:bg-deep-forest hover:text-warm-cream"
                    >
                      {c["hero.callLabel"]}
                    </a>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-5">
                <Reveal delay={0.12}>
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-forest">
                    Contact Info
                  </span>
                  <dl className="mt-6 divide-y divide-frost border-t border-b border-frost">
                    <div className="grid grid-cols-[110px_1fr] items-baseline gap-4 py-5">
                      <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-deep-forest/55">
                        Phone
                      </dt>
                      <dd>
                        <a
                          href={phoneHref}
                          className="font-serif text-[18px] tracking-tight text-deep-forest transition-colors hover:text-forest sm:text-[19px]"
                        >
                          {c["contact.phone"]}
                        </a>
                      </dd>
                    </div>
                    <div className="grid grid-cols-[110px_1fr] items-baseline gap-4 py-5">
                      <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-deep-forest/55">
                        Email
                      </dt>
                      <dd>
                        <a
                          href={`mailto:${c["contact.email"]}`}
                          className="break-all font-serif text-[16px] tracking-tight text-deep-forest transition-colors hover:text-forest sm:text-[17px]"
                        >
                          {c["contact.email"]}
                        </a>
                      </dd>
                    </div>
                    <div className="grid grid-cols-[110px_1fr] items-baseline gap-4 py-5">
                      <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-deep-forest/55">
                        Hours
                      </dt>
                      <dd className="font-serif text-[16px] tracking-tight text-deep-forest sm:text-[17px]">
                        {c["contact.hours"]}
                      </dd>
                    </div>
                  </dl>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────── SECTION 2: MAPS ──────────── */}
        <section
          id="maps"
          aria-label="Clinic locations"
          className="scroll-mt-24 px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8 lg:pt-32 lg:pb-40"
        >
          <div className="mx-auto max-w-[1280px]">
            <Reveal>
              <div className="border-t border-frost pt-12 sm:pt-16">
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-forest">
                  Locations
                </span>
                <h2 className="mt-4 font-serif text-[34px] leading-[1.06] tracking-[-0.012em] text-deep-forest sm:text-[44px] lg:text-[52px]">
                  {c["locations.heading"]}
                </h2>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:mt-14 sm:gap-8 lg:grid-cols-2">
              {clinics.map((loc, i) => {
                const q = encodeURIComponent(loc.address)
                const mapHref = `https://www.google.com/maps/search/?api=1&query=${q}`
                const locPhoneHref = `tel:${loc.phone.replace(/[^\d+]/g, "")}`
                return (
                  <Reveal key={i} delay={i * 0.08} duration={0.85}>
                    <article className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-frost bg-warm-cream sm:aspect-[3/2]">
                      {/* Map background */}
                      <iframe
                        src={`https://www.google.com/maps?q=${q}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        title={`Map showing ${loc.name}`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0 h-full w-full border-0"
                      />

                      {/* Glass info panel */}
                      <div className="pointer-events-none absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                        <div className="pointer-events-auto rounded-[22px] border border-warm-cream/70 bg-warm-cream/92 p-5 shadow-[0_18px_40px_-18px_rgba(15,42,31,0.35)] sm:p-6">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-serif text-[22px] leading-tight tracking-tight text-deep-forest sm:text-[26px]">
                              {loc.name}
                            </h3>
                            <a
                              href={mapHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/map inline-flex shrink-0 items-center gap-2 text-[11.5px] font-medium tracking-tight text-deep-forest transition-all hover:gap-3"
                            >
                              <span className="hidden sm:inline">View on map</span>
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-deep-forest text-warm-cream transition-colors group-hover/map:bg-forest">
                                <ArrowUpRight size={12} strokeWidth={1.8} />
                              </span>
                            </a>
                          </div>

                          <div className="mt-5 flex items-start gap-3">
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warm-cream text-deep-forest shadow-[0_4px_12px_-4px_rgba(15,42,31,0.25)]">
                              <MapPin size={15} strokeWidth={1.7} />
                            </span>
                            <p className="pt-1 text-[13.5px] leading-[1.5] text-deep-forest sm:text-[14px]">
                              {loc.address}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center gap-3">
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warm-cream text-deep-forest shadow-[0_4px_12px_-4px_rgba(15,42,31,0.25)]">
                              <Phone size={15} strokeWidth={1.7} />
                            </span>
                            <a
                              href={locPhoneHref}
                              className="text-[13.5px] tracking-tight text-deep-forest transition-colors hover:text-forest sm:text-[14px]"
                            >
                              {loc.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
