import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { cmsService } from '@/lib/cms/service'

export default async function CmsCollectionsListPage() {
  const collections = cmsService.listCollections()
  const counts = await Promise.all(
    collections.map((c) => cmsService.listCollectionItemsForEditor(c.slug))
  )

  return (
    <div className='container mx-auto max-w-3xl px-4 py-8'>
      <Link href='/dashboard/cms' className='text-muted-foreground text-sm hover:underline'>
        ← Website content
      </Link>
      <h1 className='mt-3 mb-2 font-bold text-3xl tracking-tight'>Lists</h1>
      <p className='mb-8 text-muted-foreground'>
        Groups of items that share the same layout, such as patient reviews.
      </p>

      <div className='divide-y rounded-lg border'>
        {collections.map((collection, i) => (
          <Link
            key={collection.slug}
            href={`/dashboard/cms/collections/${collection.slug}`}
            className='flex items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/50'
          >
            <div>
              <div className='font-medium'>{collection.label}</div>
              <div className='text-muted-foreground text-sm'>{collection.description}</div>
            </div>
            <div className='flex shrink-0 items-center gap-3 text-muted-foreground text-sm'>
              <span>{counts[i].length} items</span>
              <ChevronRight className='h-5 w-5' />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
