import Link from 'next/link'
import { notFound } from 'next/navigation'

import { cmsService } from '@/lib/cms/service'
import { CollectionItemForm } from '../../../_components/collection-item-form'
import { DeleteItemButton } from '../../../_components/delete-item-button'

export default async function EditCollectionItemPage({
  params,
}: {
  params: Promise<{ slug: string; itemId: string }>
}) {
  const { slug, itemId } = await params
  const def = cmsService.getCollectionDef(slug)
  if (!def) notFound()

  const item = await cmsService.getCollectionItemForEditor(itemId)
  if (!item || item.collectionSlug !== slug) notFound()

  const data = (item.data ?? {}) as Record<string, { en?: string; value?: string }>
  const initialData: Record<string, { en: string; value: string }> = {}
  for (const f of def.fields) {
    const d = data[f.key] ?? {}
    initialData[f.key] = { en: d.en ?? '', value: d.value ?? '' }
  }

  return (
    <div className='px-6 py-8 lg:px-10'>
      <Link
        href={`/dashboard/cms/collections/${slug}`}
        className='text-muted-foreground text-sm hover:underline'
      >
        ← {def.label}
      </Link>
      <div className='mt-3 mb-8 flex items-center justify-between gap-4'>
        <h1 className='font-bold text-3xl tracking-tight'>Edit</h1>
        <DeleteItemButton collectionSlug={slug} itemId={item.id} />
      </div>
      <CollectionItemForm
        def={def}
        itemId={item.id}
        isPublished={item.isPublished}
        sortOrder={item.sortOrder}
        initialData={initialData}
      />
    </div>
  )
}
