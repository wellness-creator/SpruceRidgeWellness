import Link from 'next/link'
import { FileText, MessageSquareQuote, Settings } from 'lucide-react'

const cards = [
  {
    href: '/dashboard/cms/pages',
    title: 'Pages',
    desc: 'Edit the text and images on your website pages.',
    icon: FileText,
  },
  {
    href: '/dashboard/cms/collections',
    title: 'Promotions, jobs & reviews',
    desc: 'Add or edit promotions, job postings, and patient reviews.',
    icon: MessageSquareQuote,
  },
  {
    href: '/dashboard/settings/site',
    title: 'Business information',
    desc: 'Your clinic name, contact details and social links.',
    icon: Settings,
  },
]

export default function CmsHomePage() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <h1 className='mb-2 font-bold text-3xl tracking-tight'>Website content</h1>
      <p className='mb-8 text-muted-foreground'>
        Edit everything visitors see on your website. Changes go live as soon as you save.
      </p>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className='group rounded-lg border p-6 transition-colors hover:border-primary hover:bg-muted/50'
          >
            <div className='mb-3 flex items-center gap-3'>
              <div className='rounded-lg bg-primary/10 p-2 text-primary'>
                <card.icon className='h-5 w-5' />
              </div>
              <h2 className='font-semibold text-lg group-hover:text-primary'>{card.title}</h2>
            </div>
            <p className='text-muted-foreground text-sm'>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
