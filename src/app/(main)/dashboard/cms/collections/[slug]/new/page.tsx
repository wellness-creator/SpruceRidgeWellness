import Link from 'next/link'
import { notFound } from 'next/navigation'

import { cmsService } from '@/lib/cms/service'
import { CollectionItemForm } from '../../../_components/collection-item-form'

export default async function NewCollectionItemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const def = cmsService.getCollectionDef(slug)
  if (!def) notFound()

  const existing = await cmsService.listCollectionItemsForEditor(slug)

  return (
    <div className='px-6 py-8 lg:px-10'>
      <Link
        href={`/dashboard/cms/collections/${slug}`}
        className='text-muted-foreground text-sm hover:underline'
      >
        ← {def.label}
      </Link>
      <h1 className='mt-3 mb-8 font-bold text-3xl tracking-tight'>Add new</h1>
      <CollectionItemForm
        def={def}
        isPublished
        sortOrder={existing.length}
        initialData={{}}
      />
    </div>
  )
}
