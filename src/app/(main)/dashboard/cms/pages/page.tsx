import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { cmsService } from '@/lib/cms/service'

export default function CmsPagesListPage() {
  const pages = cmsService.listPages()

  return (
    <div className='container mx-auto max-w-3xl px-4 py-8'>
      <Link href='/dashboard/cms' className='text-muted-foreground text-sm hover:underline'>
        ← Website content
      </Link>
      <h1 className='mt-3 mb-2 font-bold text-3xl tracking-tight'>Pages</h1>
      <p className='mb-8 text-muted-foreground'>Choose a page to edit its text and images.</p>

      <div className='divide-y rounded-lg border'>
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={`/dashboard/cms/pages/${page.slug}`}
            className='flex items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/50'
          >
            <div>
              <div className='font-medium'>{page.label}</div>
              <div className='text-muted-foreground text-sm'>{page.description}</div>
            </div>
            <ChevronRight className='h-5 w-5 shrink-0 text-muted-foreground' />
          </Link>
        ))}
      </div>
    </div>
  )
}
