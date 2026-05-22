import type { Metadata } from "next"
import { SiteHeader } from "@/components/wellness/layout/site-header"
import { SiteFooter } from "@/components/wellness/layout/site-footer"
import { ScrollProgress } from "@/components/wellness/motion/scroll-progress"
import { SectionNav } from "@/components/wellness/motion/section-nav"
import {
  PromotionsAccordion,
  type Offer,
} from "@/components/wellness/promotions/promotions-accordion"
import { cmsService } from "@/lib/cms/service"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://spruceridgewellness.ca"

export const metadata: Metadata = {
  title: {
    absolute: "Current Promotions | Spruce Ridge Wellness",
  },
  description:
    "Two promotions currently live at Spruce Ridge Wellness in Newfoundland: Emsella introductory pricing for first-visit pelvic floor patients, and the Medical Aesthetics launch covering Botox, Plexr, and clinical skin care. Bay Roberts and St. John's.",
  keywords: [
    "Spruce Ridge promotions",
    "Spruce Ridge Wellness offers",
    "Spruce Ridge Wellness Bay Roberts",
    "Spruce Ridge Wellness St. John's",
    "Emsella introductory package Newfoundland",
    "Emsella first visit Bay Roberts",
    "Emsella first visit St. John's",
    "Emsella pelvic floor Newfoundland",
    "medical aesthetics launch Newfoundland",
    "Botox launch Bay Roberts",
    "Botox launch St. John's",
    "Plexr launch Newfoundland",
    "physician-administered Botox NL",
    "physician-led promotions NL",
    "FRCSC surgeon Newfoundland promotions",
    "first visit pelvic floor Newfoundland",
    "new patient special Newfoundland aesthetics",
  ],
  alternates: { canonical: `${SITE_URL}/promotions` },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Current Promotions — Spruce Ridge Wellness",
    description:
      "Two promotions currently live at Spruce Ridge Wellness: Emsella introductory pricing and the Medical Aesthetics launch (Botox, Plexr, skin care) in Bay Roberts and St. John's, Newfoundland.",
    url: `${SITE_URL}/promotions`,
    siteName: "Spruce Ridge Wellness",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/images/promotions-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Current promotions at Spruce Ridge Wellness in Newfoundland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Current Promotions — Spruce Ridge Wellness",
    description:
      "Emsella introductory pricing and the Medical Aesthetics launch at Spruce Ridge Wellness, Bay Roberts and St. John's.",
    images: ["/images/promotions-banner.jpg"],
  },
}

export default async function PromotionsPage() {
  const rows = await cmsService.listCollection("promotions")
  const offers: Offer[] = rows.map((r) => ({
    eyebrow: r.eyebrow ?? "",
    label: r.label ?? "",
    body: r.body ?? "",
    image: r.image || "/images/pelvic.png",
    alt: r.label ?? "",
    href: r.href || "https://spruceridgewellness.janeapp.com",
  }))

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/promotions#webpage`,
        url: `${SITE_URL}/promotions`,
        name: "Current Promotions | Spruce Ridge Wellness",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: "en-CA",
        breadcrumb: { "@id": `${SITE_URL}/promotions#breadcrumbs` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/promotions#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Promotions",
            item: `${SITE_URL}/promotions`,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/promotions#offers`,
        name: "Current promotions at Spruce Ridge Wellness",
        itemListElement: offers.map((o, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Offer",
            name: o.label,
            category: o.eyebrow,
            description: o.body,
            url: o.href,
            availability: "https://schema.org/InStock",
            areaServed: {
              "@type": "AdministrativeArea",
              name: "Newfoundland and Labrador",
            },
            seller: { "@id": `${SITE_URL}/#business` },
          },
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ScrollProgress />
      <SiteHeader />
      <SectionNav
        items={[{ kind: "section", id: "offers", label: "Offers" }]}
      />

      <main className="bg-warm-cream">
        {/* ──────────── HERO + ACCORDION ──────────── */}
        <section
          id="offers"
          aria-labelledby="promotions-headline"
          className="relative scroll-mt-24 overflow-hidden px-4 pt-12 pb-24 sm:px-6 sm:pt-16 sm:pb-32 lg:px-8 lg:pt-20 lg:pb-40"
        >
          <div className="mx-auto max-w-[1320px]">
            {offers.length > 0 ? (
              <PromotionsAccordion offers={offers} />
            ) : (
              <p className="py-20 text-center font-serif text-[24px] text-deep-forest/70">
                No promotions are running right now — please check back soon.
              </p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
