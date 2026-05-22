import { z } from 'zod'

export type CmsFieldType = 'text' | 'textarea' | 'richText' | 'image' | 'url' | 'boolean' | 'number'

/** Whether the field stores plain text (vs. an image, link, boolean or number). */
export function isTextField(type: CmsFieldType): boolean {
  return type === 'text' || type === 'textarea' || type === 'richText'
}

export interface FieldDef {
  key: string
  type: CmsFieldType
  label: string
  description?: string
  group?: string
  /** Seed value, and the fallback shown when the database has no value yet. */
  defaultText?: string
  /** Seed/fallback for image and url fields. */
  defaultValue?: string
  /** For image fields — a plain-English hint about the best photo shape/size. */
  imageRatio?: string
}

export interface PageDef {
  slug: string
  label: string
  description: string
  /** The public URL this page renders at — used for the editor preview. */
  previewPath: string
  fields: FieldDef[]
}

const TREATMENTS_DEFAULT = [
  'Pelvic Floor',
  'Postpartum Care',
  'Incontinence Care',
  'Prolapse Support',
  'Pain Management',
  'Botox',
  'Dermal Fillers',
  'Skin Tightening',
  'Skin Rejuvenation',
  'Chemical Peels',
  'Acne Treatment',
  'Scar Reduction',
  'Hormonal Support',
  'Intimate Health',
].join('\n')

/** A short, plain-English guide shown on the "?" icon beside each editor section. */
export const SECTION_GUIDES: Record<string, string> = {
  'Hero banner':
    'The large banner at the very top of the home page. Keep the headline to a few warm words; the paragraph below it to one or two short sentences.',
  'Scrolling banner':
    'The thin strip of words that scrolls beneath the banner. Add short phrases — one per line.',
  'Services section':
    'The two big service cards on the home page. Keep each description to about two sentences; the tags are single keywords, one per line.',
  'Why Us section': 'The heading for the "what sets us apart" part of the home page.',
  'Why Us — feature cards':
    'The four cards that slide in as visitors scroll. Each needs a short title (1–3 words) and one or two sentences.',
  'Why Us — Dr. Pickard':
    'The "Meet Dr. Pickard" panel. The three points should each be a short phrase.',
  'The Numbers section':
    'The statistics block. The big number is a figure like 95; the symbol is what follows it, such as %. The intro is one or two sentences.',
  'The Numbers — small stats':
    'The three smaller stat cards. The number may include a letter (e.g. 11K). Keep labels to two or three words.',
  'Patient reviews':
    'The heading and side caption for the reviews section. The reviews themselves are edited under "Patient reviews" in the sidebar.',
  'Top of page':
    'The headline and intro text at the top of this page. Keep the heading short; the intro is one or two sentences.',
  'Side panel': 'The small notes shown beside the founder photo. Keep each line short.',
  'Contact details':
    'Your phone number, email, and hours — type them exactly as you want them shown on the site.',
  Locations: 'The heading shown above your clinic locations.',
  'Clinic 1':
    'The first clinic — its name, address, and phone. Put the whole address on one line; the map locates it automatically.',
  'Clinic 2':
    'The second clinic — its name, address, and phone. Put the whole address on one line; the map locates it automatically.',
  Statistics:
    'Numbered stats. Each has a number, an optional symbol (like % or +), and a short label of a few words.',
  Credentials:
    'The qualification cards. Each has a short mark (e.g. MD), a title, and a sentence of explanation.',
  Principles: 'The values cards. Each has a short title and one or two sentences.',
  'Pull quote': 'The large quote. Keep it to one or two sentences, and add who said it.',
  'FAQ items': 'Each question and its answer. Keep questions short; answers can run a few sentences.',
  'Safety points': 'The four safety points. Each has a short title and a sentence or two.',
  'Approach points': 'The four approach points. Each has a short title and a sentence or two.',
  'Journey steps': 'The four steps. Each has a short title and one or two sentences.',
  'Conditions list': 'Each condition has a short title and a one-line description.',
  'Treatments list': 'Each treatment has a short title and a one-line description.',
  'Card 1 — Pelvic Health':
    'The first service card on the Services page — its label, title, description, photo, and tag list (one tag per line).',
  'Card 2 — Medical Aesthetics':
    'The second service card on the Services page — its label, title, description, photo, and tag list (one tag per line).',
  'Section 1 — The Practice':
    'The "Same hands, every visit" block. In the body, leave a blank line between paragraphs.',
  'Section 2 — Training':
    'The training intro — its heading, a short side note, and a footnote.',
  'Section 3 — Philosophy': 'The philosophy intro — its heading and short intro text.',
  'Section 4 — Place':
    'The "Newfoundland is home" block. In the body, leave a blank line between paragraphs.',
  'Section 5 — Off the Chart':
    'The personal block plus the small note card. In the body, leave a blank line between paragraphs.',
  'Section 6 — Visit': 'The closing call-to-action — heading, text, and the two buttons.',
  'Section 1 — Overview':
    'The overview block. In the body, leave a blank line between paragraphs.',
  'Section 2 — Safety': 'The safety section — its heading, intro, photo, and footnote.',
  'Section 2 — Approach': 'The approach section — its heading, intro, and photo.',
  'Section 3 — Journey': 'The journey section — its heading and short intro.',
  'Section 4 — Conditions':
    'The conditions section — its heading, intro, and background photo.',
  'Section 4 — Treatments':
    'The treatments section — its heading, intro, and background photo.',
  'Section 5 — Is It For Me':
    'The fit-check section. Each checklist box takes one item per line.',
  'Section 6 — FAQ': 'The heading for the questions section; the questions are in the next box.',
}

export const HOME_PAGE: PageDef = {
  slug: 'home',
  label: 'Home page',
  description: 'The hero banner and patient reviews section on your home page.',
  previewPath: '/',
  fields: [
    {
      key: 'hero.headline',
      type: 'textarea',
      label: 'Hero headline',
      description: 'The big headline over the banner image. Press Enter for a line break.',
      group: 'Hero banner',
      defaultText: 'Your body deserves\nto feel strong again.',
    },
    {
      key: 'hero.subhead',
      type: 'textarea',
      label: 'Hero paragraph',
      group: 'Hero banner',
      defaultText:
        "Pelvic health and medical aesthetics. Led by an FRCSC General Surgeon at our Bay Roberts and St. John's clinics in Newfoundland.",
    },
    {
      key: 'hero.image',
      type: 'image',
      label: 'Hero banner image',
      group: 'Hero banner',
      defaultValue: '/images/hero-pelvic.jpg',
      imageRatio:
        'Wide banner photo (much wider than tall) — about 1600 × 900 px works best.',
    },
    {
      key: 'hero.ctaLabel',
      type: 'text',
      label: 'Banner button text',
      group: 'Hero banner',
      defaultText: 'Explore our treatments',
    },
    {
      key: 'hero.ctaHref',
      type: 'url',
      label: 'Banner button link',
      description: 'Where the button takes visitors, e.g. /contact',
      group: 'Hero banner',
      defaultValue: '/contact',
    },
    {
      key: 'hero.treatments',
      type: 'textarea',
      label: 'Treatment names',
      description: 'One treatment per line. These scroll around the banner image.',
      group: 'Hero banner',
      defaultText: TREATMENTS_DEFAULT,
    },
    // ── Scrolling banner ──
    {
      key: 'marquee.items',
      type: 'textarea',
      label: 'Scrolling words',
      description: 'One per line — these scroll across the strip under the banner.',
      group: 'Scrolling banner',
      defaultText:
        "FRCSC General Surgeon\nPelvic Health\nMedical Aesthetics\nSkin Treatments\nWomen's Wellness\nBay Roberts\nSt. John's\nNewfoundland & Labrador\nHealth Canada Approved\nEvidence-Based Care",
    },
    // ── Services section ──
    { key: 'services.eyebrow', type: 'text', label: 'Small label', group: 'Services section', defaultText: 'Services' },
    { key: 'services.heading', type: 'textarea', label: 'Heading', group: 'Services section', defaultText: 'Two practices. One philosophy.' },
    { key: 'services.viewAllLabel', type: 'text', label: '“View all” link text', group: 'Services section', defaultText: 'View all services' },
    { key: 'service1.title', type: 'text', label: 'Card 1 — title', group: 'Services section', defaultText: 'Pelvic Health' },
    {
      key: 'service1.description',
      type: 'textarea',
      label: 'Card 1 — description',
      group: 'Services section',
      defaultText:
        'Pelvic floor therapy, postpartum recovery, incontinence and prolapse support, plus hormonal and intimate health care for every stage of life.',
    },
    { key: 'service1.image', type: 'image', label: 'Card 1 — photo', group: 'Services section', defaultValue: '/images/pelvic.png' },
    { key: 'service1.treatments', type: 'textarea', label: 'Card 1 — tags', description: 'One per line.', group: 'Services section', defaultText: 'Pelvic Floor\nPostpartum\nIncontinence\nHormonal Support' },
    { key: 'service2.title', type: 'text', label: 'Card 2 — title', group: 'Services section', defaultText: 'Medical Aesthetics' },
    {
      key: 'service2.description',
      type: 'textarea',
      label: 'Card 2 — description',
      group: 'Services section',
      defaultText:
        'Physician-led neuromodulators, dermal fillers, skin tightening, chemical peels, and acne care. Subtle, natural, evidence-based.',
    },
    { key: 'service2.image', type: 'image', label: 'Card 2 — photo', group: 'Services section', defaultValue: '/images/medical-aesthetics.png' },
    { key: 'service2.treatments', type: 'textarea', label: 'Card 2 — tags', description: 'One per line.', group: 'Services section', defaultText: 'Botox\nDermal Fillers\nSkin Tightening\nChemical Peels' },
    // ── Why Us section ──
    { key: 'why.eyebrow', type: 'text', label: 'Small label', group: 'Why Us section', defaultText: 'What Sets Us Apart' },
    { key: 'why.heading', type: 'textarea', label: 'Heading', group: 'Why Us section', defaultText: 'The pieces, brought together.' },
    { key: 'pillar1.title', type: 'text', label: 'Card 1 — title', group: 'Why Us — feature cards', defaultText: 'Surgeon-Led' },
    { key: 'pillar1.body', type: 'textarea', label: 'Card 1 — text', group: 'Why Us — feature cards', defaultText: 'Real surgical training, applied with the patience of a private practice. The rigor of a hospital, without the rush.' },
    { key: 'pillar1.image', type: 'image', label: 'Card 1 — photo', group: 'Why Us — feature cards', defaultValue: '/images/surgeon-led.png', imageRatio: 'Square photo — about 1100 × 1100 px works best.' },
    { key: 'pillar2.title', type: 'text', label: 'Card 2 — title', group: 'Why Us — feature cards', defaultText: 'Locally Rooted' },
    { key: 'pillar2.body', type: 'textarea', label: 'Card 2 — text', group: 'Why Us — feature cards', defaultText: 'World-class technology, right here in Newfoundland. Care that was previously only available in major urban centres.' },
    { key: 'pillar2.image', type: 'image', label: 'Card 2 — photo', group: 'Why Us — feature cards', defaultValue: '/images/nature.jpg', imageRatio: 'Square photo — about 1100 × 1100 px works best.' },
    { key: 'pillar3.title', type: 'text', label: 'Card 3 — title', group: 'Why Us — feature cards', defaultText: 'Science-First' },
    { key: 'pillar3.body', type: 'textarea', label: 'Card 3 — text', group: 'Why Us — feature cards', defaultText: 'Evidence-based recommendations only. Health Canada approved technology over trends. Research over hype.' },
    { key: 'pillar3.image', type: 'image', label: 'Card 3 — photo', group: 'Why Us — feature cards', defaultValue: '/images/science.png', imageRatio: 'Square photo — about 1100 × 1100 px works best.' },
    { key: 'pillar4.title', type: 'text', label: 'Card 4 — title', group: 'Why Us — feature cards', defaultText: 'Stigma-Free' },
    { key: 'pillar4.body', type: 'textarea', label: 'Card 4 — text', group: 'Why Us — feature cards', defaultText: 'A safe, judgment-free space for open conversation. No question is too small. No concern is too personal.' },
    { key: 'pillar4.image', type: 'image', label: 'Card 4 — photo', group: 'Why Us — feature cards', defaultValue: '/images/stigma.png', imageRatio: 'Square photo — about 1100 × 1100 px works best.' },
    { key: 'why.doctorEyebrow', type: 'text', label: 'Dr. Pickard — small label', group: 'Why Us — Dr. Pickard', defaultText: 'Meet Dr. Pickard' },
    { key: 'why.doctorHeading', type: 'textarea', label: 'Dr. Pickard — heading', group: 'Why Us — Dr. Pickard', defaultText: 'A surgeon committed to listening.' },
    {
      key: 'why.doctorBody',
      type: 'textarea',
      label: 'Dr. Pickard — paragraph',
      group: 'Why Us — Dr. Pickard',
      defaultText:
        'Dr. Felicia Pickard is a practicing general surgeon with firsthand experience treating pelvic floor conditions. She built Spruce Ridge Wellness to bring surgical expertise and wellness-first care to women across Newfoundland.',
    },
    { key: 'why.doctorImage', type: 'image', label: 'Dr. Pickard — photo', group: 'Why Us — Dr. Pickard', defaultValue: '/images/dr-felicia.png' },
    { key: 'why.doctorName', type: 'text', label: 'Dr. Pickard — name', group: 'Why Us — Dr. Pickard', defaultText: 'Dr. Felicia Pickard' },
    { key: 'why.doctorRole', type: 'text', label: 'Dr. Pickard — title', group: 'Why Us — Dr. Pickard', defaultText: 'FRCSC General Surgeon' },
    { key: 'why.bullet1', type: 'text', label: 'Dr. Pickard — point 1', group: 'Why Us — Dr. Pickard', defaultText: 'FRCSC-certified general surgeon' },
    { key: 'why.bullet2', type: 'text', label: 'Dr. Pickard — point 2', group: 'Why Us — Dr. Pickard', defaultText: 'Surgical-grade clinical assessment' },
    { key: 'why.bullet3', type: 'text', label: 'Dr. Pickard — point 3', group: 'Why Us — Dr. Pickard', defaultText: 'Care at the pace of conversation' },
    { key: 'why.doctorCtaLabel', type: 'text', label: 'Dr. Pickard — button text', group: 'Why Us — Dr. Pickard', defaultText: 'More about Dr. Pickard' },
    // ── The Numbers section ──
    { key: 'numbers.eyebrow', type: 'text', label: 'Small label', group: 'The Numbers section', defaultText: 'The Numbers' },
    { key: 'numbers.heading', type: 'textarea', label: 'Heading', group: 'The Numbers section', defaultText: 'Real results, measured carefully.' },
    {
      key: 'numbers.intro',
      type: 'textarea',
      label: 'Intro paragraph',
      group: 'The Numbers section',
      defaultText:
        'Outcomes drawn from clinical research and the lived experience of hundreds of women across Newfoundland. Not marketing claims.',
    },
    { key: 'numbers.featuredValue', type: 'text', label: 'Big stat — number', group: 'The Numbers section', defaultText: '95' },
    { key: 'numbers.featuredSuffix', type: 'text', label: 'Big stat — symbol', group: 'The Numbers section', defaultText: '%' },
    { key: 'numbers.featuredLabel', type: 'text', label: 'Big stat — label', group: 'The Numbers section', defaultText: 'Improvement in Quality of Life' },
    {
      key: 'numbers.featuredDesc',
      type: 'textarea',
      label: 'Big stat — description',
      group: 'The Numbers section',
      defaultText:
        'Reported by pelvic floor therapy patients across published BTL Emsella clinical studies.',
    },
    { key: 'metric1.value', type: 'text', label: 'Stat 1 — number', group: 'The Numbers — small stats', defaultText: '28' },
    { key: 'metric1.suffix', type: 'text', label: 'Stat 1 — symbol', group: 'The Numbers — small stats', defaultText: 'min' },
    { key: 'metric1.label', type: 'text', label: 'Stat 1 — label', group: 'The Numbers — small stats', defaultText: 'Per Session' },
    { key: 'metric1.desc', type: 'textarea', label: 'Stat 1 — description', group: 'The Numbers — small stats', defaultText: 'Fully clothed, no recovery time.' },
    { key: 'metric2.value', type: 'text', label: 'Stat 2 — number', group: 'The Numbers — small stats', defaultText: '11K' },
    { key: 'metric2.suffix', type: 'text', label: 'Stat 2 — symbol', group: 'The Numbers — small stats', defaultText: '+' },
    { key: 'metric2.label', type: 'text', label: 'Stat 2 — label', group: 'The Numbers — small stats', defaultText: 'Pelvic Contractions' },
    { key: 'metric2.desc', type: 'textarea', label: 'Stat 2 — description', group: 'The Numbers — small stats', defaultText: 'Equivalent strength, in one session.' },
    { key: 'metric3.value', type: 'text', label: 'Stat 3 — number', group: 'The Numbers — small stats', defaultText: '6' },
    { key: 'metric3.suffix', type: 'text', label: 'Stat 3 — symbol', group: 'The Numbers — small stats', defaultText: '' },
    { key: 'metric3.label', type: 'text', label: 'Stat 3 — label', group: 'The Numbers — small stats', defaultText: 'Total Visits' },
    { key: 'metric3.desc', type: 'textarea', label: 'Stat 3 — description', group: 'The Numbers — small stats', defaultText: 'Spread comfortably over three weeks.' },
    { key: 'numbers.signatureName', type: 'text', label: 'Signature — name', group: 'The Numbers section', defaultText: 'Dr. Felicia Pickard' },
    { key: 'numbers.signatureRole', type: 'text', label: 'Signature — title', group: 'The Numbers section', defaultText: 'FRCSC General Surgeon' },
    {
      key: 'numbers.signatureNote',
      type: 'textarea',
      label: 'Signature — note',
      group: 'The Numbers section',
      defaultText:
        'Each treatment plan is built around your assessment and goals at your first consultation.',
    },
    {
      key: 'testimonials.heading',
      type: 'textarea',
      label: 'Section heading',
      description: 'Press Enter for a line break.',
      group: 'Patient reviews',
      defaultText: 'What our\npatients say',
    },
    {
      key: 'testimonials.practicingLabel',
      type: 'text',
      label: 'Caption label',
      group: 'Patient reviews',
      defaultText: 'Practicing in',
    },
    {
      key: 'testimonials.locations',
      type: 'text',
      label: 'Clinic locations',
      group: 'Patient reviews',
      defaultText: "Bay Roberts · St. John's",
    },
    {
      key: 'testimonials.tagline',
      type: 'textarea',
      label: 'Caption tagline',
      description: 'Press Enter for a line break.',
      group: 'Patient reviews',
      defaultText: 'Two clinics,\none practice',
    },
    {
      key: 'testimonials.image',
      type: 'image',
      label: 'Section image',
      group: 'Patient reviews',
      defaultValue: '/images/Patients.png',
    },
  ],
}

export const CONTACT_PAGE: PageDef = {
  slug: 'contact',
  label: 'Contact page',
  description: 'The headings, contact details, and clinic locations on your Contact page.',
  previewPath: '/contact',
  fields: [
    {
      key: 'hero.heading',
      type: 'textarea',
      label: 'Page heading',
      group: 'Top of page',
      defaultText: "We're here for you.",
    },
    {
      key: 'hero.intro',
      type: 'textarea',
      label: 'Intro paragraph',
      group: 'Top of page',
      defaultText:
        'Schedule your appointment through our online booking page or reach out by phone or email.',
    },
    {
      key: 'hero.bookLabel',
      type: 'text',
      label: 'Booking button text',
      group: 'Top of page',
      defaultText: 'Book Online',
    },
    {
      key: 'hero.bookUrl',
      type: 'url',
      label: 'Booking button link',
      group: 'Top of page',
      defaultValue: 'https://spruceridgewellness.janeapp.com',
    },
    {
      key: 'hero.callLabel',
      type: 'text',
      label: 'Call button text',
      group: 'Top of page',
      defaultText: 'Call Us',
    },
    {
      key: 'contact.phone',
      type: 'text',
      label: 'Phone number',
      group: 'Contact details',
      defaultText: '709-786-9150',
    },
    {
      key: 'contact.email',
      type: 'text',
      label: 'Email address',
      group: 'Contact details',
      defaultText: 'spruceridgewellness@gmail.com',
    },
    {
      key: 'contact.hours',
      type: 'text',
      label: 'Hours',
      group: 'Contact details',
      defaultText: 'By appointment',
    },
    {
      key: 'locations.heading',
      type: 'textarea',
      label: 'Locations section heading',
      group: 'Locations',
      defaultText: 'Find our clinics.',
    },
    {
      key: 'clinic1.name',
      type: 'text',
      label: 'Clinic 1 — name',
      group: 'Clinic 1',
      defaultText: 'Spruce Ridge Wellness',
    },
    {
      key: 'clinic1.address',
      type: 'text',
      label: 'Clinic 1 — address',
      description: 'Full address on one line. The map updates to match.',
      group: 'Clinic 1',
      defaultText: '494 Conception Bay Highway, Bay Roberts, NL A0A 1G0',
    },
    {
      key: 'clinic1.phone',
      type: 'text',
      label: 'Clinic 1 — phone',
      group: 'Clinic 1',
      defaultText: '709-786-9150',
    },
    {
      key: 'clinic2.name',
      type: 'text',
      label: 'Clinic 2 — name',
      group: 'Clinic 2',
      defaultText: 'Bense Clinic',
    },
    {
      key: 'clinic2.address',
      type: 'text',
      label: 'Clinic 2 — address',
      description: 'Full address on one line. The map updates to match.',
      group: 'Clinic 2',
      defaultText: "100 Elizabeth Avenue, St. John's, NL A1B 1R9",
    },
    {
      key: 'clinic2.phone',
      type: 'text',
      label: 'Clinic 2 — phone',
      group: 'Clinic 2',
      defaultText: '709-786-9150',
    },
  ],
}

export const ABOUT_PAGE: PageDef = {
  slug: 'about',
  label: 'About page',
  description: 'The founder story, training, philosophy, and all text on your About page.',
  previewPath: '/about',
  fields: [
    // Top of page
    { key: 'hero.eyebrow', type: 'text', label: 'Small label (top)', group: 'Top of page', defaultText: 'About the Founder' },
    { key: 'hero.greeting', type: 'text', label: 'Greeting line', group: 'Top of page', defaultText: "Hi, I'm Felicia." },
    {
      key: 'hero.name',
      type: 'textarea',
      label: 'Name heading',
      description: 'First line shows normally, second line in italics.',
      group: 'Top of page',
      defaultText: 'Dr. Felicia\nPickard.',
    },
    { key: 'hero.bio', type: 'textarea', label: 'Short bio', group: 'Top of page', defaultText: 'Doctor, mother, wife, daughter, Newfoundlander. Spruce Ridge is the small clinic she runs.' },
    { key: 'hero.image', type: 'image', label: 'Portrait photo', group: 'Top of page', defaultValue: '/images/dr-felicia.png' },
    { key: 'hero.badge', type: 'text', label: 'Photo badge', group: 'Top of page', defaultText: 'Founder · FRCSC' },
    { key: 'hero.readOn', type: 'text', label: '“Read on” link text', group: 'Top of page', defaultText: 'Read on' },
    // Hero side panel
    { key: 'hero.thisWeekLabel', type: 'text', label: 'Side note label', group: 'Side panel', defaultText: 'This week' },
    { key: 'hero.thisWeekText', type: 'text', label: 'Side note text', group: 'Side panel', defaultText: 'Still in clinic. Still in scrubs.' },
    { key: 'hero.findHerLabel', type: 'text', label: 'Locations label', group: 'Side panel', defaultText: "Where you'll find her" },
    { key: 'hero.location1', type: 'text', label: 'Location 1', group: 'Side panel', defaultText: 'Bay Roberts' },
    { key: 'hero.location2', type: 'text', label: 'Location 2', group: 'Side panel', defaultText: "Bense Clinic, St. John's" },
    { key: 'hero.captionName', type: 'text', label: 'Caption name', group: 'Side panel', defaultText: 'Dr. Felicia Pickard' },
    { key: 'hero.captionRole', type: 'text', label: 'Caption role', group: 'Side panel', defaultText: 'Practicing general surgeon · FRCSC' },
    // Section 1
    { key: 'practice.label', type: 'text', label: 'Section label', group: 'Section 1 — The Practice', defaultText: 'The Practice' },
    { key: 'practice.heading', type: 'textarea', label: 'Heading', group: 'Section 1 — The Practice', defaultText: 'Same hands, every visit.' },
    {
      key: 'practice.body',
      type: 'textarea',
      label: 'Body text',
      description: 'Leave a blank line between paragraphs.',
      group: 'Section 1 — The Practice',
      defaultText:
        'When Felicia treats you, it is Felicia treating you. The chart is hers. The plan is hers. The next visit is hers too.\n\nPatients tell their story once. Decisions stay in the same person’s head from one visit to the next. Adjustments are quiet, because someone is still keeping track.\n\nThat is the only thing she asked of the clinic when she started it. Everything else came after.',
    },
    // Stats
    { key: 'stat1.number', type: 'number', label: 'Stat 1 — number', group: 'Statistics', defaultValue: '10' },
    { key: 'stat1.suffix', type: 'text', label: 'Stat 1 — suffix', group: 'Statistics', defaultText: '+ years' },
    { key: 'stat1.label', type: 'text', label: 'Stat 1 — label', group: 'Statistics', defaultText: 'Surgical training and practice' },
    { key: 'stat2.number', type: 'number', label: 'Stat 2 — number', group: 'Statistics', defaultValue: '2' },
    { key: 'stat2.suffix', type: 'text', label: 'Stat 2 — suffix', group: 'Statistics', defaultText: 'clinics' },
    { key: 'stat2.label', type: 'text', label: 'Stat 2 — label', group: 'Statistics', defaultText: 'Across the province' },
    { key: 'stat3.number', type: 'number', label: 'Stat 3 — number', group: 'Statistics', defaultValue: '1' },
    { key: 'stat3.suffix', type: 'text', label: 'Stat 3 — suffix', group: 'Statistics', defaultText: 'physician' },
    { key: 'stat3.label', type: 'text', label: 'Stat 3 — label', group: 'Statistics', defaultText: 'Founder and lead clinician' },
    { key: 'stat4.number', type: 'number', label: 'Stat 4 — number', group: 'Statistics', defaultValue: '100' },
    { key: 'stat4.suffix', type: 'text', label: 'Stat 4 — suffix', group: 'Statistics', defaultText: '%' },
    { key: 'stat4.label', type: 'text', label: 'Stat 4 — label', group: 'Statistics', defaultText: 'Physician-administered, every visit' },
    // Section 2
    { key: 'training.label', type: 'text', label: 'Section label', group: 'Section 2 — Training', defaultText: 'The Path' },
    { key: 'training.heading', type: 'textarea', label: 'Heading', group: 'Section 2 — Training', defaultText: 'Four letters, a long apprenticeship.' },
    { key: 'training.note', type: 'text', label: 'Side note', group: 'Section 2 — Training', defaultText: 'What each one was, and what it taught her.' },
    { key: 'training.footnote', type: 'text', label: 'Footnote', group: 'Section 2 — Training', defaultText: 'FRCSC denotes Fellowship of the Royal College of Surgeons of Canada' },
    // Credentials
    { key: 'cred1.mark', type: 'text', label: 'Credential 1 — short mark', group: 'Credentials', defaultText: 'BSc' },
    { key: 'cred1.title', type: 'text', label: 'Credential 1 — title', group: 'Credentials', defaultText: 'Bachelor of Science' },
    { key: 'cred1.body', type: 'textarea', label: 'Credential 1 — text', group: 'Credentials', defaultText: 'The undergraduate years. Reading bodies before treating them.' },
    { key: 'cred2.mark', type: 'text', label: 'Credential 2 — short mark', group: 'Credentials', defaultText: 'MSc' },
    { key: 'cred2.title', type: 'text', label: 'Credential 2 — title', group: 'Credentials', defaultText: 'Master of Science' },
    { key: 'cred2.body', type: 'textarea', label: 'Credential 2 — text', group: 'Credentials', defaultText: 'A research degree. It taught her to slow down before reaching for an answer.' },
    { key: 'cred3.mark', type: 'text', label: 'Credential 3 — short mark', group: 'Credentials', defaultText: 'MD' },
    { key: 'cred3.title', type: 'text', label: 'Credential 3 — title', group: 'Credentials', defaultText: 'Doctor of Medicine' },
    { key: 'cred3.body', type: 'textarea', label: 'Credential 3 — text', group: 'Credentials', defaultText: 'Med school and the long apprenticeship that comes with it.' },
    { key: 'cred4.mark', type: 'text', label: 'Credential 4 — short mark', group: 'Credentials', defaultText: 'FRCSC' },
    { key: 'cred4.title', type: 'text', label: 'Credential 4 — title', group: 'Credentials', defaultText: 'Royal College of Surgeons' },
    { key: 'cred4.body', type: 'textarea', label: 'Credential 4 — text', group: 'Credentials', defaultText: 'Canadian fellowship in general surgery. Years of supervised operating before practicing on her own.' },
    // Quote
    { key: 'quote.text', type: 'textarea', label: 'Quote', group: 'Pull quote', defaultText: 'I would rather start small and adjust than start big and apologize.' },
    { key: 'quote.attribution', type: 'text', label: 'Attribution', group: 'Pull quote', defaultText: 'Felicia' },
    // Section 3
    { key: 'philosophy.label', type: 'text', label: 'Section label', group: 'Section 3 — Philosophy', defaultText: 'Philosophy' },
    { key: 'philosophy.heading', type: 'textarea', label: 'Heading', group: 'Section 3 — Philosophy', defaultText: 'How she tries to work.' },
    { key: 'philosophy.intro', type: 'textarea', label: 'Intro text', group: 'Section 3 — Philosophy', defaultText: 'Notes she pinned for herself a long time ago. They are reminders, not promises.' },
    // Principles
    { key: 'principle1.label', type: 'text', label: 'Principle 1 — title', group: 'Principles', defaultText: 'Listen First' },
    { key: 'principle1.body', type: 'textarea', label: 'Principle 1 — text', group: 'Principles', defaultText: 'The patient knows their body better than the chart does. Felicia tries to remember that every visit.' },
    { key: 'principle2.label', type: 'text', label: 'Principle 2 — title', group: 'Principles', defaultText: 'Less, More Often' },
    { key: 'principle2.body', type: 'textarea', label: 'Principle 2 — text', group: 'Principles', defaultText: 'Smaller doses, smaller adjustments, more check-ins. Quieter outcomes, fewer surprises.' },
    { key: 'principle3.label', type: 'text', label: 'Principle 3 — title', group: 'Principles', defaultText: 'Long Game' },
    { key: 'principle3.body', type: 'textarea', label: 'Principle 3 — text', group: 'Principles', defaultText: 'Pelvic care and aesthetics both reward patience. The plan is allowed to change as you do.' },
    { key: 'principle4.label', type: 'text', label: 'Principle 4 — title', group: 'Principles', defaultText: 'Plain Language' },
    { key: 'principle4.body', type: 'textarea', label: 'Principle 4 — text', group: 'Principles', defaultText: 'No jargon she would not say to her own family. Notes can go to your family doctor if you ask.' },
    // Section 4
    { key: 'place.label', type: 'text', label: 'Section label', group: 'Section 4 — Place', defaultText: 'Place' },
    { key: 'place.heading', type: 'textarea', label: 'Heading', group: 'Section 4 — Place', defaultText: 'Newfoundland is home.' },
    {
      key: 'place.body',
      type: 'textarea',
      label: 'Body text',
      description: 'Leave a blank line between paragraphs.',
      group: 'Section 4 — Place',
      defaultText:
        'Felicia practices here because she lives here. The province is small. The medical community is smaller than that. Patients are not a stream of strangers; they are people she will see again, at a wharf or a wedding or the grocery store.\n\nThat changes how you work. The chart is never anonymous. A decision made today is one she will live with at the next visit, and the one after.\n\nShe did not start the clinic to grow it. She started it so the people on this island had someone steady to come back to.',
    },
    { key: 'place.image', type: 'image', label: 'Background photo', group: 'Section 4 — Place', defaultValue: '/images/nature.jpg', imageRatio: 'Wide landscape photo (fills the whole section background) — about 1600 × 1000 px works best.' },
    // Section 5
    { key: 'offchart.label', type: 'text', label: 'Section label', group: 'Section 5 — Off the Chart', defaultText: 'Off the Chart' },
    { key: 'offchart.heading', type: 'textarea', label: 'Heading', group: 'Section 5 — Off the Chart', defaultText: 'Doctor. Mother. Wife. Daughter.' },
    {
      key: 'offchart.body',
      type: 'textarea',
      label: 'Body text',
      description: 'Leave a blank line between paragraphs.',
      group: 'Section 5 — Off the Chart',
      defaultText:
        'The person who walks into the operating room is the same one who packs school lunches and texts her mum back. The life outside of medicine is not a competing thing. It is the reason there is medicine in the first place.\n\nIt also means she has been on the patient side of the desk. The waiting. The not-knowing. The wanting to feel a bit more like yourself again. None of that is theoretical to her.',
    },
    { key: 'offchart.noteLabel', type: 'text', label: 'Note card label', group: 'Section 5 — Off the Chart', defaultText: 'A note from Felicia' },
    { key: 'offchart.noteText', type: 'textarea', label: 'Note card text', group: 'Section 5 — Off the Chart', defaultText: 'I started Spruce Ridge for the patients I would want my own mum, sister, or daughter to see.' },
    { key: 'offchart.noteAttribution', type: 'text', label: 'Note card attribution', group: 'Section 5 — Off the Chart', defaultText: 'Felicia' },
    // Section 6
    { key: 'visit.label', type: 'text', label: 'Section label', group: 'Section 6 — Visit', defaultText: 'Visit' },
    { key: 'visit.heading', type: 'textarea', label: 'Heading', group: 'Section 6 — Visit', defaultText: 'Sit down with Felicia.' },
    { key: 'visit.body', type: 'textarea', label: 'Body text', group: 'Section 6 — Visit', defaultText: 'Bring your questions. We talk through what is bothering you and what the options are. Whatever you decide is up to you.' },
    { key: 'visit.bookLabel', type: 'text', label: 'Booking button text', group: 'Section 6 — Visit', defaultText: 'Book a Consultation' },
    { key: 'visit.bookUrl', type: 'url', label: 'Booking button link', group: 'Section 6 — Visit', defaultValue: 'https://spruceridgewellness.janeapp.com' },
    { key: 'visit.servicesLabel', type: 'text', label: 'Services button text', group: 'Section 6 — Visit', defaultText: 'See Services' },
    { key: 'visit.servicesUrl', type: 'url', label: 'Services button link', group: 'Section 6 — Visit', defaultValue: '/services' },
  ],
}

export const SERVICES_PAGE: PageDef = {
  slug: 'services',
  label: 'Services page',
  description: 'The headings and the two service cards on your main Services page.',
  previewPath: '/services',
  fields: [
    { key: 'hero.eyebrow', type: 'text', label: 'Small label (top)', group: 'Top of page', defaultText: 'Our Services' },
    { key: 'hero.heading', type: 'textarea', label: 'Page heading', group: 'Top of page', defaultText: 'Two specialties. One trusted hand.' },
    {
      key: 'hero.intro',
      type: 'textarea',
      label: 'Intro paragraph',
      group: 'Top of page',
      defaultText:
        'Surgeon-led pelvic health and medical aesthetics across two Newfoundland clinics. Real medicine, calm conversation, and a plan that fits your life.',
    },
    {
      key: 'hero.trustChips',
      type: 'textarea',
      label: 'Trust badges',
      description: 'One per line.',
      group: 'Top of page',
      defaultText: "FRCSC Surgeon-Led\nHealth Canada Approved\nBay Roberts · St. John's",
    },
    { key: 'hero.bookLabel', type: 'text', label: 'Booking link text', group: 'Top of page', defaultText: 'Book a Consultation' },
    { key: 'hero.bookUrl', type: 'url', label: 'Booking link', group: 'Top of page', defaultValue: 'https://spruceridgewellness.janeapp.com' },
    // Card 1
    { key: 'service1.eyebrow', type: 'text', label: 'Card 1 — small label', group: 'Card 1 — Pelvic Health', defaultText: 'Pelvic Floor · Postpartum · Incontinence' },
    { key: 'service1.title', type: 'text', label: 'Card 1 — title', group: 'Card 1 — Pelvic Health', defaultText: 'Pelvic Health' },
    {
      key: 'service1.description',
      type: 'textarea',
      label: 'Card 1 — description',
      group: 'Card 1 — Pelvic Health',
      defaultText:
        'Non-invasive, FRCSC surgeon-led pelvic floor care. The clinical answer to leaks, urgency, and the postpartum questions other clinics rush past.',
    },
    { key: 'service1.image', type: 'image', label: 'Card 1 — photo', group: 'Card 1 — Pelvic Health', defaultValue: '/images/pelvic.png' },
    {
      key: 'service1.treatments',
      type: 'textarea',
      label: 'Card 1 — treatment tags',
      description: 'One per line.',
      group: 'Card 1 — Pelvic Health',
      defaultText: 'BTL Emsella\nPostpartum Recovery\nIncontinence Support\nHormonal & Intimate Health',
    },
    // Card 2
    { key: 'service2.eyebrow', type: 'text', label: 'Card 2 — small label', group: 'Card 2 — Medical Aesthetics', defaultText: 'Botox · Plexr · Skin Care' },
    { key: 'service2.title', type: 'text', label: 'Card 2 — title', group: 'Card 2 — Medical Aesthetics', defaultText: 'Medical Aesthetics' },
    {
      key: 'service2.description',
      type: 'textarea',
      label: 'Card 2 — description',
      group: 'Card 2 — Medical Aesthetics',
      defaultText:
        'Physician-led Botox, dermal fillers, Plexr skin tightening, and personalized skin care. Refined results that look like you, only refreshed.',
    },
    { key: 'service2.image', type: 'image', label: 'Card 2 — photo', group: 'Card 2 — Medical Aesthetics', defaultValue: '/images/medical-aesthetics.png' },
    {
      key: 'service2.treatments',
      type: 'textarea',
      label: 'Card 2 — treatment tags',
      description: 'One per line.',
      group: 'Card 2 — Medical Aesthetics',
      defaultText: 'Botox & Neuromodulators\nDermal Fillers\nPlexr Skin Tightening\nSkin Rejuvenation',
    },
  ],
}

export const PELVIC_HEALTH_PAGE: PageDef = {
  slug: 'pelvic-health',
  label: 'Pelvic Health page',
  description: 'All text and images on the Pelvic Health service page.',
  previewPath: '/services/pelvic-health',
  fields: [
    // Top of page
    { key: 'hero.eyebrow', type: 'text', label: 'Small label (top)', group: 'Top of page', defaultText: 'Pelvic Health' },
    {
      key: 'hero.heading',
      type: 'textarea',
      label: 'Page heading',
      description: 'Second line shows in italics.',
      group: 'Top of page',
      defaultText: 'The pelvic floor clinic\nNewfoundland was missing.',
    },
    {
      key: 'hero.intro',
      type: 'textarea',
      label: 'Intro paragraph',
      group: 'Top of page',
      defaultText:
        "Surgeon-led pelvic care that meets you where you are. Non-invasive treatment for incontinence, postpartum recovery, and pelvic floor weakness, without surgery, needles, or recovery time. Two Newfoundland clinics, in Bay Roberts and St. John's, ready when you are.",
    },
    { key: 'hero.bookLabel', type: 'text', label: 'Booking button text', group: 'Top of page', defaultText: 'Book a Consultation' },
    { key: 'hero.bookUrl', type: 'url', label: 'Booking button link', group: 'Top of page', defaultValue: 'https://spruceridgewellness.janeapp.com' },
    { key: 'hero.secondaryLabel', type: 'text', label: 'Secondary link text', group: 'Top of page', defaultText: 'How Emsella Works' },
    { key: 'hero.chips', type: 'textarea', label: 'Trust badges', description: 'One per line.', group: 'Top of page', defaultText: "FRCSC Surgeon-Led\nHealth Canada Approved\nBay Roberts · St. John's" },
    { key: 'hero.image', type: 'image', label: 'Hero photo', group: 'Top of page', defaultValue: '/images/pelvic.png' },
    { key: 'hero.statNumber', type: 'number', label: 'Hero stat — number', group: 'Top of page', defaultValue: '11000' },
    { key: 'hero.statLabel', type: 'text', label: 'Hero stat — label', group: 'Top of page', defaultText: 'Pelvic floor contractions in a single session' },
    // Marquee
    { key: 'ticker', type: 'textarea', label: 'Scrolling banner words', description: 'One per line.', group: 'Scrolling banner', defaultText: 'Stress Incontinence\nUrge Incontinence\nPostpartum Recovery\nPelvic Floor Weakness\nBladder Leakage\nHormonal & Intimate Health\nCore Re-engagement\nMenopause Support' },
    // Section 1
    { key: 'overview.label', type: 'text', label: 'Section label', group: 'Section 1 — Overview', defaultText: 'Overview' },
    { key: 'overview.image', type: 'image', label: 'Photo', group: 'Section 1 — Overview', defaultValue: '/images/machine.png' },
    { key: 'overview.heading', type: 'textarea', label: 'Heading', group: 'Section 1 — Overview', defaultText: '11,000 reasons to feel confident again.' },
    {
      key: 'overview.body',
      type: 'textarea',
      label: 'Body text',
      description: 'Leave a blank line between paragraphs.',
      group: 'Section 1 — Overview',
      defaultText:
        "BTL Emsella is the Health Canada approved, non-invasive pelvic floor treatment we wish more women in Newfoundland knew about. In 28 minutes, focused electromagnetic technology triggers the equivalent of 11,000 Kegel contractions. Stronger, deeper, and far more consistent than anything you could do on your own.\n\nYou stay fully clothed and seated the entire time. Most patients describe it as a gentle tingling, a deep contraction, even a chance to read in peace. There is no downtime. No recovery period. Nothing visible afterward. You walk out of our Bay Roberts or St. John's clinic and get on with your day.",
    },
    { key: 'stat1.number', type: 'number', label: 'Stat 1 — number', group: 'Statistics', defaultValue: '95' },
    { key: 'stat1.suffix', type: 'text', label: 'Stat 1 — suffix', group: 'Statistics', defaultText: '%' },
    { key: 'stat1.label', type: 'text', label: 'Stat 1 — label', group: 'Statistics', defaultText: 'Patients report a better quality of life' },
    { key: 'stat2.number', type: 'number', label: 'Stat 2 — number', group: 'Statistics', defaultValue: '70' },
    { key: 'stat2.suffix', type: 'text', label: 'Stat 2 — suffix', group: 'Statistics', defaultText: '%+' },
    { key: 'stat2.label', type: 'text', label: 'Stat 2 — label', group: 'Statistics', defaultText: 'Less reliance on pads, day to day' },
    { key: 'stat3.number', type: 'number', label: 'Stat 3 — number', group: 'Statistics', defaultValue: '28' },
    { key: 'stat3.suffix', type: 'text', label: 'Stat 3 — suffix', group: 'Statistics', defaultText: 'min' },
    { key: 'stat3.label', type: 'text', label: 'Stat 3 — label', group: 'Statistics', defaultText: 'Per session, fully clothed' },
    { key: 'stat4.number', type: 'number', label: 'Stat 4 — number', group: 'Statistics', defaultValue: '6' },
    { key: 'stat4.suffix', type: 'text', label: 'Stat 4 — suffix', group: 'Statistics', defaultText: '' },
    { key: 'stat4.label', type: 'text', label: 'Stat 4 — label', group: 'Statistics', defaultText: 'Sessions across three weeks' },
    // Section 2
    { key: 'safety.label', type: 'text', label: 'Section label', group: 'Section 2 — Safety', defaultText: 'Clinical Safety' },
    { key: 'safety.heading', type: 'textarea', label: 'Heading', group: 'Section 2 — Safety', defaultText: 'Advanced therapy. Better outcomes.' },
    { key: 'safety.intro', type: 'textarea', label: 'Intro text', group: 'Section 2 — Safety', defaultText: 'Designed for real bodies and real lives. Safety profiles you (and your physician) can trust.' },
    { key: 'safety.image', type: 'image', label: 'Photo', group: 'Section 2 — Safety', defaultValue: '/images/Section%2002.png' },
    { key: 'safety.footnote', type: 'text', label: 'Footnote', group: 'Section 2 — Safety', defaultText: 'Final eligibility confirmed at your consultation' },
    { key: 'safety1.label', type: 'text', label: 'Point 1 — title', group: 'Safety points', defaultText: 'Metal Implants' },
    { key: 'safety1.body', type: 'textarea', label: 'Point 1 — text', group: 'Safety points', defaultText: 'Safe alongside hip, knee, and other non-pelvic metal implants.' },
    { key: 'safety2.label', type: 'text', label: 'Point 2 — title', group: 'Safety points', defaultText: 'Pregnancy' },
    { key: 'safety2.body', type: 'textarea', label: 'Point 2 — text', group: 'Safety points', defaultText: 'Non-invasive postpartum care, no needles, no downtime.' },
    { key: 'safety3.label', type: 'text', label: 'Point 3 — title', group: 'Safety points', defaultText: 'Tumor' },
    { key: 'safety3.body', type: 'textarea', label: 'Point 3 — text', group: 'Safety points', defaultText: 'Non-thermal, non-radiation, clinically proven technology.' },
    { key: 'safety4.label', type: 'text', label: 'Point 4 — title', group: 'Safety points', defaultText: 'Heart Disorders' },
    { key: 'safety4.body', type: 'textarea', label: 'Point 4 — text', group: 'Safety points', defaultText: 'Suitable for most cardiac patients. We screen for pacemakers at intake.' },
    // Section 3
    { key: 'journey.label', type: 'text', label: 'Section label', group: 'Section 3 — Journey', defaultText: 'Your Journey' },
    { key: 'journey.heading', type: 'textarea', label: 'Heading', group: 'Section 3 — Journey', defaultText: 'Four steps. No surprises.' },
    { key: 'journey.intro', type: 'textarea', label: 'Intro text', group: 'Section 3 — Journey', defaultText: 'Care that runs at the speed of conversation, never the rush of a clinic running behind.' },
    { key: 'journey1.title', type: 'text', label: 'Step 1 — title', group: 'Journey steps', defaultText: 'Listen & Assess' },
    { key: 'journey1.body', type: 'textarea', label: 'Step 1 — text', group: 'Journey steps', defaultText: 'We sit down before we treat. Your history, your goals, your concerns, all the way through. No rushing, no judgement, no pressure.' },
    { key: 'journey2.title', type: 'text', label: 'Step 2 — title', group: 'Journey steps', defaultText: 'Sit & Strengthen' },
    { key: 'journey2.body', type: 'textarea', label: 'Step 2 — text', group: 'Journey steps', defaultText: 'Settle into the Emsella chair, fully clothed. For 28 minutes, focused electromagnetic pulses do the work of thousands of Kegels while you read, scroll, or simply breathe.' },
    { key: 'journey3.title', type: 'text', label: 'Step 3 — title', group: 'Journey steps', defaultText: 'Reassess & Refine' },
    { key: 'journey3.body', type: 'textarea', label: 'Step 3 — text', group: 'Journey steps', defaultText: 'Every session opens with a check in. We track how you are responding and tune the intensity to match how your pelvic floor is rebuilding.' },
    { key: 'journey4.title', type: 'text', label: 'Step 4 — title', group: 'Journey steps', defaultText: 'Live the Difference' },
    { key: 'journey4.body', type: 'textarea', label: 'Step 4 — text', group: 'Journey steps', defaultText: 'Stronger bladder control, less urgency, a quieter relationship with your body. Most patients notice changes within two to four weeks.' },
    // Section 4
    { key: 'conditions.label', type: 'text', label: 'Section label', group: 'Section 4 — Conditions', defaultText: 'Conditions Treated' },
    { key: 'conditions.heading', type: 'textarea', label: 'Heading', group: 'Section 4 — Conditions', defaultText: 'Are you experiencing any of these?' },
    { key: 'conditions.intro', type: 'textarea', label: 'Intro text', group: 'Section 4 — Conditions', defaultText: 'Common, quietly under-treated, and answerable with evidence-based care.' },
    { key: 'conditions.image', type: 'image', label: 'Background photo', group: 'Section 4 — Conditions', defaultValue: '/images/03.png', imageRatio: 'Wide landscape photo (fills the whole section background) — about 1600 × 1000 px works best.' },
    { key: 'condition1.title', type: 'text', label: 'Condition 1 — title', group: 'Conditions list', defaultText: 'Stress Incontinence' },
    { key: 'condition1.body', type: 'textarea', label: 'Condition 1 — text', group: 'Conditions list', defaultText: 'Leaks when you cough, laugh, sneeze, or work out.' },
    { key: 'condition2.title', type: 'text', label: 'Condition 2 — title', group: 'Conditions list', defaultText: 'Urge Incontinence' },
    { key: 'condition2.body', type: 'textarea', label: 'Condition 2 — text', group: 'Conditions list', defaultText: 'Sudden urgency, frequent bathroom trips, the feeling you cannot hold it.' },
    { key: 'condition3.title', type: 'text', label: 'Condition 3 — title', group: 'Conditions list', defaultText: 'Postpartum Weakness' },
    { key: 'condition3.body', type: 'textarea', label: 'Condition 3 — text', group: 'Conditions list', defaultText: 'Core and pelvic floor changes that did not fully bounce back.' },
    { key: 'condition4.title', type: 'text', label: 'Condition 4 — title', group: 'Conditions list', defaultText: 'Mild Prolapse' },
    { key: 'condition4.body', type: 'textarea', label: 'Condition 4 — text', group: 'Conditions list', defaultText: 'Pressure or heaviness that responds to non-surgical strengthening.' },
    { key: 'condition5.title', type: 'text', label: 'Condition 5 — title', group: 'Conditions list', defaultText: 'Intimate Satisfaction' },
    { key: 'condition5.body', type: 'textarea', label: 'Condition 5 — text', group: 'Conditions list', defaultText: 'Reduced sensation or weakened tone affecting intimacy.' },
    { key: 'condition6.title', type: 'text', label: 'Condition 6 — title', group: 'Conditions list', defaultText: 'Menopausal Changes' },
    { key: 'condition6.body', type: 'textarea', label: 'Condition 6 — text', group: 'Conditions list', defaultText: 'Hormonal shifts loosening your pelvic support over time.' },
    // Section 5
    { key: 'fit.label', type: 'text', label: 'Section label', group: 'Section 5 — Is It For Me', defaultText: 'Is It For Me' },
    { key: 'fit.heading', type: 'textarea', label: 'Heading', group: 'Section 5 — Is It For Me', defaultText: 'An honest fit check. No pressure.' },
    { key: 'fit.intro', type: 'textarea', label: 'Intro text', group: 'Section 5 — Is It For Me', defaultText: "We'd rather have a real conversation than a quick booking. Use these as a starting point. Your consultation will get specific to you." },
    { key: 'fit.goodFitLabel', type: 'text', label: 'Good-fit list — label', group: 'Section 5 — Is It For Me', defaultText: 'Likely a good fit if' },
    { key: 'fit.goodFit', type: 'textarea', label: 'Good-fit list', description: 'One per line.', group: 'Section 5 — Is It For Me', defaultText: "You leak when you cough, laugh, sneeze, or work out\nYou're postpartum and your core or pelvic floor still feels weak\nYou feel sudden urgency or run to the bathroom too often\nYou want a non-invasive option before considering surgery\nYou're heading into menopause and noticing pelvic changes\nYour pelvic health is affecting your confidence or intimacy" },
    { key: 'fit.talkFirstLabel', type: 'text', label: 'Talk-first list — label', group: 'Section 5 — Is It For Me', defaultText: 'Talk to us first if' },
    { key: 'fit.talkFirst', type: 'textarea', label: 'Talk-first list', description: 'One per line.', group: 'Section 5 — Is It For Me', defaultText: 'You have a pacemaker or implanted defibrillator\nYou are currently pregnant\nYou have a copper IUD or active implant near the pelvis\nYou have severe (Grade 3+) pelvic organ prolapse\nYou have an active pelvic infection or unhealed surgical site' },
    { key: 'fit.talkFirstNote', type: 'textarea', label: 'Talk-first note', group: 'Section 5 — Is It For Me', defaultText: 'Not automatic disqualifiers. Just a closer conversation first.' },
    // Section 6
    { key: 'faq.label', type: 'text', label: 'Section label', group: 'Section 6 — FAQ', defaultText: 'Frequently Asked' },
    { key: 'faq.heading', type: 'textarea', label: 'Heading', group: 'Section 6 — FAQ', defaultText: 'Questions, answered plainly.' },
    { key: 'faq1.q', type: 'text', label: 'Question 1', group: 'FAQ items', defaultText: 'Does it hurt?' },
    { key: 'faq1.a', type: 'textarea', label: 'Answer 1', group: 'FAQ items', defaultText: 'No. You stay fully clothed and feel a gentle tingling and contracting sensation throughout the session. Most patients describe it as oddly relaxing.' },
    { key: 'faq2.q', type: 'text', label: 'Question 2', group: 'FAQ items', defaultText: 'How many sessions will I need?' },
    { key: 'faq2.a', type: 'textarea', label: 'Answer 2', group: 'FAQ items', defaultText: 'Six sessions, twice a week over three weeks. Most patients notice a difference by session two or three, and results continue to build for weeks afterward.' },
    { key: 'faq3.q', type: 'text', label: 'Question 3', group: 'FAQ items', defaultText: 'When will I see results?' },
    { key: 'faq3.a', type: 'textarea', label: 'Answer 3', group: 'FAQ items', defaultText: 'Most patients see improvements in bladder control and core strength within two to four weeks of starting. Final results typically settle in a few weeks after your last session.' },
    { key: 'faq4.q', type: 'text', label: 'Question 4', group: 'FAQ items', defaultText: 'Is it safe after childbirth?' },
    { key: 'faq4.a', type: 'textarea', label: 'Answer 4', group: 'FAQ items', defaultText: "Yes, once your physician has cleared you. Typically that's around six weeks postpartum, a little longer after a C-section." },
    { key: 'faq5.q', type: 'text', label: 'Question 5', group: 'FAQ items', defaultText: 'Is it covered by insurance?' },
    { key: 'faq5.a', type: 'textarea', label: 'Answer 5', group: 'FAQ items', defaultText: 'Provincial insurance does not cover Emsella, but many private extended health plans reimburse part of the cost. We provide detailed receipts for your provider.' },
    { key: 'faq6.q', type: 'text', label: 'Question 6', group: 'FAQ items', defaultText: 'Do I need a referral?' },
    { key: 'faq6.a', type: 'textarea', label: 'Answer 6', group: 'FAQ items', defaultText: 'No. Most patients self-refer. With your consent, we can also coordinate notes with your family physician.' },
    { key: 'faq7.q', type: 'text', label: 'Question 7', group: 'FAQ items', defaultText: 'What should I wear?' },
    { key: 'faq7.a', type: 'textarea', label: 'Answer 7', group: 'FAQ items', defaultText: "Anything comfortable. We'll ask you to remove metal items like belts and large buckles before the session." },
    { key: 'faq8.q', type: 'text', label: 'Question 8', group: 'FAQ items', defaultText: 'Are both clinics offering Emsella?' },
    { key: 'faq8.a', type: 'textarea', label: 'Answer 8', group: 'FAQ items', defaultText: "Yes. BTL Emsella and pelvic health care are available at our Bay Roberts clinic and our St. John's location at the Bense Clinic." },
  ],
}

export const MEDICAL_AESTHETICS_PAGE: PageDef = {
  slug: 'medical-aesthetics',
  label: 'Medical Aesthetics page',
  description: 'All text and images on the Medical Aesthetics service page.',
  previewPath: '/services/medical-aesthetics',
  fields: [
    { key: 'hero.eyebrow', type: 'text', label: 'Small label (top)', group: 'Top of page', defaultText: 'Medical Aesthetics' },
    {
      key: 'hero.heading',
      type: 'textarea',
      label: 'Page heading',
      description: 'Second line shows in italics.',
      group: 'Top of page',
      defaultText: "Aesthetics,\nwith a physician's hand.",
    },
    {
      key: 'hero.intro',
      type: 'textarea',
      label: 'Intro paragraph',
      group: 'Top of page',
      defaultText:
        "Physician-led aesthetic care across Newfoundland. We listen before we treat, and the plan grows with you season by season. Two clinics: Bay Roberts and the Bense Clinic in St. John's.",
    },
    { key: 'hero.bookLabel', type: 'text', label: 'Booking button text', group: 'Top of page', defaultText: 'Book a Consultation' },
    { key: 'hero.bookUrl', type: 'url', label: 'Booking button link', group: 'Top of page', defaultValue: 'https://spruceridgewellness.janeapp.com' },
    { key: 'hero.secondaryLabel', type: 'text', label: 'Secondary link text', group: 'Top of page', defaultText: 'Our Approach' },
    { key: 'hero.chips', type: 'textarea', label: 'Trust badges', description: 'One per line.', group: 'Top of page', defaultText: "Physician-Led\nHealth Canada Approved\nBay Roberts · St. John's" },
    { key: 'hero.image', type: 'image', label: 'Hero photo', group: 'Top of page', defaultValue: '/images/medical-aesthetics.png' },
    { key: 'hero.statValue', type: 'text', label: 'Hero badge — value', group: 'Top of page', defaultText: '1:1' },
    { key: 'hero.statLabel', type: 'text', label: 'Hero badge — label', group: 'Top of page', defaultText: 'Consultation always one-on-one with a physician' },
    { key: 'ticker', type: 'textarea', label: 'Scrolling banner words', description: 'One per line.', group: 'Scrolling banner', defaultText: 'Botox\nDermal Fillers\nPlexr Skin Tightening\nSkin Rejuvenation\nPreventative Aesthetics\nPersonalized Skin Care\nAnti-Aging Plans\nSubtle Refinement' },
    // Section 1
    { key: 'overview.label', type: 'text', label: 'Section label', group: 'Section 1 — Overview', defaultText: 'Overview' },
    { key: 'overview.beforeImage', type: 'image', label: 'Before/after — first photo', group: 'Section 1 — Overview', defaultValue: '/images/after.png', imageRatio: 'Portrait photo — about 1000 × 1250 px. Use the same shape and zoom for both before/after photos so they line up.' },
    { key: 'overview.afterImage', type: 'image', label: 'Before/after — second photo', group: 'Section 1 — Overview', defaultValue: '/images/before.png', imageRatio: 'Portrait photo — about 1000 × 1250 px. Use the same shape and zoom for both before/after photos so they line up.' },
    { key: 'overview.compareTitle', type: 'text', label: 'Before/after — title', group: 'Section 1 — Overview', defaultText: 'Real results.' },
    { key: 'overview.compareMeta1', type: 'text', label: 'Before/after — tag 1', group: 'Section 1 — Overview', defaultText: '12 Weeks' },
    { key: 'overview.compareMeta2', type: 'text', label: 'Before/after — tag 2', group: 'Section 1 — Overview', defaultText: 'Skin rejuvenation' },
    { key: 'overview.heading', type: 'textarea', label: 'Heading', group: 'Section 1 — Overview', defaultText: 'Look like yourself, only refreshed.' },
    {
      key: 'overview.body',
      type: 'textarea',
      label: 'Body text',
      description: 'Leave a blank line between paragraphs.',
      group: 'Section 1 — Overview',
      defaultText:
        'Medical aesthetics in Newfoundland deserves the same care as any clinical decision. At Spruce Ridge, every Botox, filler, or Plexr treatment begins with a real conversation. We listen. We explain your options. We lay out a plan that fits your face, your timeline, and your life across Bay Roberts and St. John’s.\n\nWe do not chase trends. We do not sell packages. We work with the face you already have, soften what bothers you, and protect what makes you, you. The goal is always refreshed, never "done". You walk out of our Bay Roberts clinic or our St. John’s location at the Bense Clinic looking rested, not retouched.',
    },
    { key: 'stat1.number', type: 'number', label: 'Stat 1 — number', group: 'Statistics', defaultValue: '7' },
    { key: 'stat1.suffix', type: 'text', label: 'Stat 1 — suffix', group: 'Statistics', defaultText: 'days' },
    { key: 'stat1.label', type: 'text', label: 'Stat 1 — label', group: 'Statistics', defaultText: 'Until Botox softens lines' },
    { key: 'stat2.number', type: 'number', label: 'Stat 2 — number', group: 'Statistics', defaultValue: '4' },
    { key: 'stat2.suffix', type: 'text', label: 'Stat 2 — suffix', group: 'Statistics', defaultText: 'months' },
    { key: 'stat2.label', type: 'text', label: 'Stat 2 — label', group: 'Statistics', defaultText: 'Average Botox duration' },
    { key: 'stat3.number', type: 'number', label: 'Stat 3 — number', group: 'Statistics', defaultValue: '8' },
    { key: 'stat3.suffix', type: 'text', label: 'Stat 3 — suffix', group: 'Statistics', defaultText: 'weeks' },
    { key: 'stat3.label', type: 'text', label: 'Stat 3 — label', group: 'Statistics', defaultText: 'Until Plexr fully settles' },
    { key: 'stat4.number', type: 'number', label: 'Stat 4 — number', group: 'Statistics', defaultValue: '2' },
    { key: 'stat4.suffix', type: 'text', label: 'Stat 4 — suffix', group: 'Statistics', defaultText: 'years' },
    { key: 'stat4.label', type: 'text', label: 'Stat 4 — label', group: 'Statistics', defaultText: 'Typical Plexr longevity' },
    // Section 2
    { key: 'approach.label', type: 'text', label: 'Section label', group: 'Section 2 — Approach', defaultText: 'Our Approach' },
    { key: 'approach.heading', type: 'textarea', label: 'Heading', group: 'Section 2 — Approach', defaultText: 'Subtle, considered, physician-led.' },
    { key: 'approach.intro', type: 'textarea', label: 'Intro text', group: 'Section 2 — Approach', defaultText: 'Four principles behind every treatment at Spruce Ridge.' },
    { key: 'approach.image', type: 'image', label: 'Photo', group: 'Section 2 — Approach', defaultValue: '/images/Botox.png' },
    { key: 'approach.footnote', type: 'text', label: 'Footnote', group: 'Section 2 — Approach', defaultText: 'Every plan is built treatment by treatment, never as a package' },
    { key: 'approach1.label', type: 'text', label: 'Point 1 — title', group: 'Approach points', defaultText: 'Subtle First' },
    { key: 'approach1.body', type: 'textarea', label: 'Point 1 — text', group: 'Approach points', defaultText: 'Refresh, never overdo. Results that look like rest, not work.' },
    { key: 'approach2.label', type: 'text', label: 'Point 2 — title', group: 'Approach points', defaultText: 'Plans, Not Pushes' },
    { key: 'approach2.body', type: 'textarea', label: 'Point 2 — text', group: 'Approach points', defaultText: 'Long-term aesthetic strategy, not a one-time treatment to upsell.' },
    { key: 'approach3.label', type: 'text', label: 'Point 3 — title', group: 'Approach points', defaultText: 'Medically Grounded' },
    { key: 'approach3.body', type: 'textarea', label: 'Point 3 — text', group: 'Approach points', defaultText: 'FRCSC surgeon-led, physician-administered. Every visit.' },
    { key: 'approach4.label', type: 'text', label: 'Point 4 — title', group: 'Approach points', defaultText: 'Continuity of Care' },
    { key: 'approach4.body', type: 'textarea', label: 'Point 4 — text', group: 'Approach points', defaultText: 'Same physician, same plan, every visit. We grow with you.' },
    // Section 3
    { key: 'journey.label', type: 'text', label: 'Section label', group: 'Section 3 — Journey', defaultText: 'Your Journey' },
    { key: 'journey.heading', type: 'textarea', label: 'Heading', group: 'Section 3 — Journey', defaultText: 'Four steps. No pressure.' },
    { key: 'journey.intro', type: 'textarea', label: 'Intro text', group: 'Section 3 — Journey', defaultText: 'Aesthetic care that runs at the speed of conversation, never the rush of an appointment slot.' },
    { key: 'journey1.title', type: 'text', label: 'Step 1 — title', group: 'Journey steps', defaultText: 'Consult & Plan' },
    { key: 'journey1.body', type: 'textarea', label: 'Step 1 — text', group: 'Journey steps', defaultText: "We sit down before we treat. Your face, your goals, your timeline, all the way through. A plan that's yours alone." },
    { key: 'journey2.title', type: 'text', label: 'Step 2 — title', group: 'Journey steps', defaultText: 'Treat with Care' },
    { key: 'journey2.body', type: 'textarea', label: 'Step 2 — text', group: 'Journey steps', defaultText: 'Physician hands, micro-doses, and a precise touch. We do the smallest amount needed, never more than that.' },
    { key: 'journey3.title', type: 'text', label: 'Step 3 — title', group: 'Journey steps', defaultText: 'Settle & Soften' },
    { key: 'journey3.body', type: 'textarea', label: 'Step 3 — text', group: 'Journey steps', defaultText: 'Most patients see Botox results in three to seven days. Fillers are immediate. Plexr settles over six to eight weeks.' },
    { key: 'journey4.title', type: 'text', label: 'Step 4 — title', group: 'Journey steps', defaultText: 'Maintain & Refine' },
    { key: 'journey4.body', type: 'textarea', label: 'Step 4 — text', group: 'Journey steps', defaultText: 'Aesthetics is a long game. We adjust gently, season by season, year by year, so you always look like yourself.' },
    // Section 4
    { key: 'treatments.label', type: 'text', label: 'Section label', group: 'Section 4 — Treatments', defaultText: 'Treatments Offered' },
    { key: 'treatments.heading', type: 'textarea', label: 'Heading', group: 'Section 4 — Treatments', defaultText: 'Treatments, tailored to you.' },
    { key: 'treatments.intro', type: 'textarea', label: 'Intro text', group: 'Section 4 — Treatments', defaultText: 'Built treatment by treatment, never as a package. Every plan starts with a conversation.' },
    { key: 'treatments.image', type: 'image', label: 'Background photo', group: 'Section 4 — Treatments', defaultValue: '/images/botox arm .png', imageRatio: 'Wide landscape photo (fills the whole section background) — about 1600 × 1000 px works best.' },
    { key: 'treatment1.title', type: 'text', label: 'Treatment 1 — title', group: 'Treatments list', defaultText: 'Botox & Neuromodulators' },
    { key: 'treatment1.body', type: 'textarea', label: 'Treatment 1 — text', group: 'Treatments list', defaultText: 'Smooth expression lines and prevent new ones, with the lightest hand.' },
    { key: 'treatment2.title', type: 'text', label: 'Treatment 2 — title', group: 'Treatments list', defaultText: 'Dermal Fillers' },
    { key: 'treatment2.body', type: 'textarea', label: 'Treatment 2 — text', group: 'Treatments list', defaultText: 'Restore volume and definition without changing your face.' },
    { key: 'treatment3.title', type: 'text', label: 'Treatment 3 — title', group: 'Treatments list', defaultText: 'Plexr Skin Tightening' },
    { key: 'treatment3.body', type: 'textarea', label: 'Treatment 3 — text', group: 'Treatments list', defaultText: 'Non-surgical lift for hooded eyes, jawline, and fine lines.' },
    { key: 'treatment4.title', type: 'text', label: 'Treatment 4 — title', group: 'Treatments list', defaultText: 'Personalized Skin Care' },
    { key: 'treatment4.body', type: 'textarea', label: 'Treatment 4 — text', group: 'Treatments list', defaultText: "Clinical-grade routines built around your skin, not someone else's." },
    { key: 'treatment5.title', type: 'text', label: 'Treatment 5 — title', group: 'Treatments list', defaultText: 'Skin Rejuvenation' },
    { key: 'treatment5.body', type: 'textarea', label: 'Treatment 5 — text', group: 'Treatments list', defaultText: 'Targeted treatments for tone, texture, and a calmer complexion.' },
    { key: 'treatment6.title', type: 'text', label: 'Treatment 6 — title', group: 'Treatments list', defaultText: 'Preventative Aesthetics' },
    { key: 'treatment6.body', type: 'textarea', label: 'Treatment 6 — text', group: 'Treatments list', defaultText: 'Start gently, before lines settle in. Long-term care, started early.' },
    // Section 5
    { key: 'fit.label', type: 'text', label: 'Section label', group: 'Section 5 — Is It For Me', defaultText: 'Is It For Me' },
    { key: 'fit.heading', type: 'textarea', label: 'Heading', group: 'Section 5 — Is It For Me', defaultText: 'An honest fit check. No pressure.' },
    { key: 'fit.intro', type: 'textarea', label: 'Intro text', group: 'Section 5 — Is It For Me', defaultText: "We'd rather have a real conversation than a quick booking. Use these as a starting point. Your consultation will get specific to you." },
    { key: 'fit.goodFitLabel', type: 'text', label: 'Good-fit list — label', group: 'Section 5 — Is It For Me', defaultText: 'Likely a good fit if' },
    { key: 'fit.goodFit', type: 'textarea', label: 'Good-fit list', description: 'One per line.', group: 'Section 5 — Is It For Me', defaultText: "You want subtle, gradual results that still look like you\nYou're starting to notice fine lines and want a long-term plan\nYou'd rather a physician than an aesthetician do your treatments\nYou're considering preventative care before deeper lines settle in\nYou've had treatments elsewhere and want a steady, considered hand\nYou're tired of being upsold and just want honest, clinical advice" },
    { key: 'fit.talkFirstLabel', type: 'text', label: 'Talk-first list — label', group: 'Section 5 — Is It For Me', defaultText: 'Talk to us first if' },
    { key: 'fit.talkFirst', type: 'textarea', label: 'Talk-first list', description: 'One per line.', group: 'Section 5 — Is It For Me', defaultText: 'You are pregnant or breastfeeding\nYou have an active skin infection at the treatment area\nYou have a known allergy to neuromodulators or dermal fillers\nYou have an autoimmune condition that affects skin healing\nYou take blood thinners or recently had injectables elsewhere' },
    { key: 'fit.talkFirstNote', type: 'textarea', label: 'Talk-first note', group: 'Section 5 — Is It For Me', defaultText: 'Not automatic disqualifiers. Just a closer conversation first.' },
    // Section 6
    { key: 'faq.label', type: 'text', label: 'Section label', group: 'Section 6 — FAQ', defaultText: 'Frequently Asked' },
    { key: 'faq.heading', type: 'textarea', label: 'Heading', group: 'Section 6 — FAQ', defaultText: 'Questions, answered plainly.' },
    { key: 'faq1.q', type: 'text', label: 'Question 1', group: 'FAQ items', defaultText: 'Will I look done?' },
    { key: 'faq1.a', type: 'textarea', label: 'Answer 1', group: 'FAQ items', defaultText: 'No. We treat with micro-doses and physician precision. The goal is refreshed, never frozen or overfilled. If you can tell someone has had something, it has been overdone.' },
    { key: 'faq2.q', type: 'text', label: 'Question 2', group: 'FAQ items', defaultText: 'How long does Botox last?' },
    { key: 'faq2.a', type: 'textarea', label: 'Answer 2', group: 'FAQ items', defaultText: 'Three to four months on average, sometimes longer with consistent treatment. Results soften gradually rather than disappearing all at once.' },
    { key: 'faq3.q', type: 'text', label: 'Question 3', group: 'FAQ items', defaultText: 'When will I see results?' },
    { key: 'faq3.a', type: 'textarea', label: 'Answer 3', group: 'FAQ items', defaultText: 'Botox softens lines in three to seven days. Dermal fillers are immediate. Plexr settles over six to eight weeks, with results that build over time.' },
    { key: 'faq4.q', type: 'text', label: 'Question 4', group: 'FAQ items', defaultText: 'Does it hurt?' },
    { key: 'faq4.a', type: 'textarea', label: 'Answer 4', group: 'FAQ items', defaultText: 'Most patients describe a quick pinch. We use the finest needles and topical numbing where appropriate. Most treatments are over in fifteen to thirty minutes.' },
    { key: 'faq5.q', type: 'text', label: 'Question 5', group: 'FAQ items', defaultText: 'How much does treatment cost?' },
    { key: 'faq5.a', type: 'textarea', label: 'Answer 5', group: 'FAQ items', defaultText: 'Pricing depends on the treatment area and product used. We provide a clear estimate at your consultation, and there is no charge for the initial conversation.' },
    { key: 'faq6.q', type: 'text', label: 'Question 6', group: 'FAQ items', defaultText: 'Is it covered by insurance?' },
    { key: 'faq6.a', type: 'textarea', label: 'Answer 6', group: 'FAQ items', defaultText: 'Cosmetic treatments are generally not covered by provincial insurance, but some private extended health plans reimburse a portion. We provide detailed receipts.' },
    { key: 'faq7.q', type: 'text', label: 'Question 7', group: 'FAQ items', defaultText: 'Do I need a referral?' },
    { key: 'faq7.a', type: 'textarea', label: 'Answer 7', group: 'FAQ items', defaultText: 'No. Most patients self-refer. With your consent, we can also share notes with your family physician.' },
    { key: 'faq8.q', type: 'text', label: 'Question 8', group: 'FAQ items', defaultText: 'Are both clinics offering aesthetics?' },
    { key: 'faq8.a', type: 'textarea', label: 'Answer 8', group: 'FAQ items', defaultText: "Yes. Botox, fillers, Plexr, and personalized skin care are available at our Bay Roberts clinic and our St. John's location at the Bense Clinic." },
  ],
}

export const PAGES: Record<string, PageDef> = {
  home: HOME_PAGE,
  about: ABOUT_PAGE,
  services: SERVICES_PAGE,
  'pelvic-health': PELVIC_HEALTH_PAGE,
  'medical-aesthetics': MEDICAL_AESTHETICS_PAGE,
  contact: CONTACT_PAGE,
}

/** Field definitions for one collection's items. */
export const TESTIMONIALS_FIELDS: FieldDef[] = [
  { key: 'quote', type: 'textarea', label: 'Patient quote' },
  { key: 'name', type: 'text', label: 'Name shown' },
  { key: 'location', type: 'text', label: 'Treatment & location' },
]

export const PROMOTIONS_FIELDS: FieldDef[] = [
  {
    key: 'eyebrow',
    type: 'text',
    label: 'Small label above the title',
    description: 'e.g. "First Visits" or "Now Available"',
  },
  { key: 'label', type: 'text', label: 'Promotion title' },
  { key: 'body', type: 'textarea', label: 'Description' },
  { key: 'image', type: 'image', label: 'Photo' },
  {
    key: 'href',
    type: 'url',
    label: 'Button link',
    description: 'Where the promotion links to, e.g. your booking page.',
  },
]

export interface CollectionDef {
  slug: string
  label: string
  description: string
  /** The public page that shows this collection — used for the editor preview. */
  previewPath: string
  fields: FieldDef[]
}

export const COLLECTIONS: Record<string, CollectionDef> = {
  testimonials: {
    slug: 'testimonials',
    label: 'Patient reviews',
    description: 'The reviews shown in the "What our patients say" section of the home page.',
    previewPath: '/',
    fields: TESTIMONIALS_FIELDS,
  },
  promotions: {
    slug: 'promotions',
    label: 'Promotions',
    description: 'The current offers shown on your Promotions page.',
    previewPath: '/promotions',
    fields: PROMOTIONS_FIELDS,
  },
}

// ─── Public-facing typed shapes ──────────────────────────────────────
export interface HomeHeroContent {
  headline: string
  subhead: string
  image: string
  ctaLabel: string
  ctaHref: string
  treatments: string[]
}

export interface HomeTestimonialsContent {
  heading: string
  practicingLabel: string
  locations: string
  tagline: string
  image: string
}

export interface HomeServiceCard {
  title: string
  description: string
  image: string
  treatments: string[]
}

export interface HomeServicesContent {
  eyebrow: string
  heading: string
  viewAllLabel: string
  cards: HomeServiceCard[]
}

export interface HomePillar {
  title: string
  body: string
  image: string
}

export interface HomeWhyContent {
  eyebrow: string
  heading: string
  pillars: HomePillar[]
  doctor: {
    eyebrow: string
    heading: string
    body: string
    image: string
    name: string
    role: string
    bullets: string[]
    ctaLabel: string
  }
}

export interface HomeMetric {
  value: string
  suffix: string
  label: string
  desc: string
}

export interface HomeNumbersContent {
  eyebrow: string
  heading: string
  intro: string
  featured: { value: string; suffix: string; label: string; desc: string }
  metrics: HomeMetric[]
  signatureName: string
  signatureRole: string
  signatureNote: string
}

export interface HomePageContent {
  hero: HomeHeroContent
  marquee: string[]
  services: HomeServicesContent
  why: HomeWhyContent
  numbers: HomeNumbersContent
  testimonials: HomeTestimonialsContent
}

export interface TestimonialItem {
  id: string
  quote: string
  name: string
  location: string
}

/** Starter reviews — seeded into the database and used as a fallback before seeding. */
export const SEED_TESTIMONIALS: Array<{ quote: string; name: string; location: string }> = [
  {
    quote:
      'I can laugh, sneeze, and jump with my kids without worrying. Dr. Pickard made me feel comfortable from the very first visit.',
    name: 'Spruce Ridge Patient',
    location: 'Pelvic Health · Bay Roberts',
  },
  {
    quote:
      'After two children I had given up hope of feeling like myself again. A few sessions later, I have my confidence back.',
    name: 'Spruce Ridge Patient',
    location: 'Postpartum Care · Bay Roberts',
  },
  {
    quote:
      'Compassionate, professional, and grounded in real surgical expertise. This is exactly what Newfoundland needed.',
    name: 'Spruce Ridge Patient',
    location: "Medical Aesthetics · St. John's",
  },
  {
    quote:
      'Finally a clinic that treats women’s health like real medicine. Clear answers, no judgment, and a plan that actually worked.',
    name: 'Spruce Ridge Patient',
    location: "Women's Wellness · St. John's",
  },
]

/** Starter promotions — the offers currently live on the Promotions page. */
export const SEED_PROMOTIONS: Array<{
  eyebrow: string
  label: string
  body: string
  image: string
  href: string
}> = [
  {
    eyebrow: 'First Visits',
    label: 'Emsella Introductory Package',
    body: 'A six-session course on the Emsella chair. The first assessment is unhurried, and new-patient pricing applies. You sit fully clothed; the chair does the work.',
    image: '/images/pelvic.png',
    href: 'https://spruceridgewellness.janeapp.com',
  },
  {
    eyebrow: 'Now Available',
    label: 'Medical Aesthetics Launch',
    body: 'Botox, Plexr, and clinical skin care are now offered at both clinics. The first visit is a conversation, not a treatment.',
    image: '/images/Botox.png',
    href: 'https://spruceridgewellness.janeapp.com',
  },
]

// ─── Zod schemas for write boundaries ────────────────────────────────
export const fieldTypeSchema = z.enum([
  'text',
  'textarea',
  'richText',
  'image',
  'url',
  'boolean',
  'number',
])

export const pageFieldInputSchema = z.object({
  fieldKey: z.string().min(1),
  fieldType: fieldTypeSchema,
  valueEn: z.string().nullable().optional(),
  valueImage: z.string().nullable().optional(),
  valueUrl: z.string().nullable().optional(),
  valueBool: z.boolean().nullable().optional(),
  valueNum: z.number().int().nullable().optional(),
})

export type PageFieldInput = z.infer<typeof pageFieldInputSchema>

export const savePageInputSchema = z.object({
  pageSlug: z.string().min(1),
  fields: z.array(pageFieldInputSchema),
})

/** A plain text field value. (`en` key kept for storage compatibility.) */
const textValue = z.object({ en: z.string() })
/** A language-neutral field (image, link, etc.). */
const neutralValue = z.object({ value: z.string() })
export const collectionFieldValue = z.union([textValue, neutralValue])

export const collectionItemInputSchema = z.object({
  collectionSlug: z.string().min(1),
  itemId: z.string().uuid().optional(),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  data: z.record(z.string(), collectionFieldValue),
})

export type CollectionItemInput = z.infer<typeof collectionItemInputSchema>

export const siteSettingsInputSchema = z.object({
  siteName: z.string().min(1, 'Business name is required.'),
  about: z.string().optional(),
  contactEmail: z.union([z.string().email(), z.literal('')]).optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  defaultOgImage: z.string().optional(),
  socials: z.record(z.string(), z.string()).optional(),
})

export type SiteSettingsInput = z.infer<typeof siteSettingsInputSchema>

export const announcementInputSchema = z.object({
  announcementText: z.string().optional(),
  announcementLinkLabel: z.string().optional(),
  announcementLink: z.string().optional(),
  announcementEnabled: z.boolean().default(true),
})

export type AnnouncementInput = z.infer<typeof announcementInputSchema>
