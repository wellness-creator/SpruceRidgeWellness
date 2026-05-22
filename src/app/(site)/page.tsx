import { SiteHeader } from "@/components/wellness/layout/site-header"
import { SiteFooter } from "@/components/wellness/layout/site-footer"
import { ScrollProgress } from "@/components/wellness/motion/scroll-progress"
import { SectionNav } from "@/components/wellness/motion/section-nav"
import { Hero } from "@/components/wellness/sections/hero"
import { Marquee } from "@/components/wellness/sections/marquee"
import { Metrics } from "@/components/wellness/sections/metrics"
import { Services } from "@/components/wellness/sections/services"
import { Testimonial } from "@/components/wellness/sections/testimonial"
import { Differentiation } from "@/components/wellness/sections/differentiation"
import { cmsService } from "@/lib/cms/service"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://spruceridgewellness.ca"

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Spruce Ridge Wellness",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-mark.png`,
  image: `${SITE_URL}/images/hero-pelvic.jpg`,
  description:
    "FRCSC surgeon-led pelvic health and medical aesthetics in Bay Roberts and St. John's, Newfoundland. Evidence-based, compassionate, stigma-free care.",
  medicalSpecialty: [
    "Gynecology",
    "PhysicalTherapy",
    "CosmeticProcedure",
    "Dermatology",
  ],
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Newfoundland and Labrador",
  },
  location: [
    {
      "@type": "MedicalClinic",
      name: "Spruce Ridge Wellness — Bay Roberts",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bay Roberts",
        addressRegion: "NL",
        addressCountry: "CA",
      },
    },
    {
      "@type": "MedicalClinic",
      name: "Spruce Ridge Wellness — Bense Clinic, St. John's",
      address: {
        "@type": "PostalAddress",
        addressLocality: "St. John's",
        addressRegion: "NL",
        addressCountry: "CA",
      },
    },
  ],
  availableService: [
    // Pelvic Health — the core differentiator
    { "@type": "MedicalProcedure", name: "Pelvic Floor Therapy" },
    { "@type": "MedicalProcedure", name: "Postpartum Recovery" },
    { "@type": "MedicalProcedure", name: "Incontinence Support" },
    { "@type": "MedicalProcedure", name: "Prolapse Support" },
    { "@type": "MedicalProcedure", name: "Pelvic Pain Management" },
    // Medical Aesthetics — physician-led, subtle
    { "@type": "MedicalProcedure", name: "Botox (Neuromodulators)" },
    { "@type": "MedicalProcedure", name: "Dermal Fillers" },
    { "@type": "MedicalProcedure", name: "Skin Tightening" },
    { "@type": "MedicalProcedure", name: "Skin Rejuvenation" },
    { "@type": "MedicalProcedure", name: "Preventative Aesthetic Treatments" },
    // Skin Treatments — clinical, results-led
    { "@type": "MedicalProcedure", name: "Chemical Peels" },
    { "@type": "MedicalProcedure", name: "Acne Treatment" },
    { "@type": "MedicalProcedure", name: "Scar Reduction" },
    { "@type": "MedicalProcedure", name: "Skin Texture & Tone Correction" },
    // Women's Wellness — the emotional bridge
    { "@type": "MedicalProcedure", name: "Hormonal Support Guidance" },
    { "@type": "MedicalProcedure", name: "Intimate Health Care" },
    { "@type": "MedicalProcedure", name: "Preventative Women's Health" },
    { "@type": "MedicalProcedure", name: "Aging Support" },
  ],
}

export default async function HomePage() {
  const content = await cmsService.getHomeContent()
  const testimonials = await cmsService.listTestimonials()

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
          { kind: "section", id: "welcome", label: "Welcome" },
          { kind: "section", id: "services", label: "Services" },
          { kind: "section", id: "why", label: "Why Us" },
          { kind: "section", id: "results", label: "Results" },
          { kind: "section", id: "reviews", label: "Reviews" },
          { kind: "section", id: "visit", label: "Visit" },
        ]}
      />
      <main className="bg-warm-cream">
        {/* 1. Hook + value preview */}
        <div id="welcome" className="scroll-mt-24">
          <Hero content={content.hero} />
        </div>
        {/* 2. Instant credibility ticker — answers "is this legit?" */}
        <Marquee items={content.marquee} />
        {/* 3. What you offer — answers "what do you actually do?" (Services already has id="services") */}
        <Services content={content.services} />
        {/* 4. Why us + who is behind it */}
        <div id="why" className="scroll-mt-24">
          <Differentiation content={content.why} />
        </div>
        {/* 5. Proof in data */}
        <div id="results" className="scroll-mt-24">
          <Metrics content={content.numbers} />
        </div>
        {/* 6. Proof in voices */}
        <div id="reviews" className="scroll-mt-24">
          <Testimonial items={testimonials} content={content.testimonials} />
        </div>
        {/* 7. Closing brand moment lives inside the footer's top hero (id="visit" on the philosophy block) */}
      </main>
      <SiteFooter />
    </>
  )
}
