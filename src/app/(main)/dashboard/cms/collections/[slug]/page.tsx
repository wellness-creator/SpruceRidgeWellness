import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { cmsService } from '@/lib/cms/service'
import { deleteCollectionItemAction } from '../../actions'
import { AnnouncementForm } from '../../_components/announcement-form'

export default async function CollectionItemsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const def = cmsService.getCollectionDef(slug)
  if (!def) notFound()

  const items = await cmsService.listCollectionItemsForEditor(slug)
  // The Promotions screen also edits the site-wide announcement bar.
  const settings = slug === 'promotions' ? await cmsService.getSiteSettings() : null
  const labelField =
    ['label', 'title', 'name'].find((k) => def.fields.some((f) => f.key === k)) ??
    def.fields[0]?.key ??
    'name'

  return (
    <div className='container mx-auto max-w-3xl px-4 py-8'>
      <Link
        href='/dashboard/cms/collections'
        className='text-muted-foreground text-sm hover:underline'
      >
        ← Lists
      </Link>
      <div className='mt-3 mb-8 flex items-end justify-between gap-4'>
        <div>
          <h1 className='mb-2 font-bold text-3xl tracking-tight'>{def.label}</h1>
          <p className='text-muted-foreground'>{def.description}</p>
        </div>
        <Button render={<Link href={`/dashboard/cms/collections/${slug}/new`} />}>
          + Add new
        </Button>
      </div>

      {settings ? (
        <div className='mb-8'>
          <AnnouncementForm
            initial={{
              text: settings.announcementText ?? '',
              linkLabel: settings.announcementLinkLabel ?? '',
              link: settings.announcementLink ?? '',
              enabled: settings.announcementEnabled ?? true,
            }}
          />
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className='rounded-lg border border-dashed p-10 text-center text-muted-foreground'>
          Nothing here yet. Click “Add new” to create the first one.
        </div>
      ) : (
        <div className='divide-y rounded-lg border'>
          {items.map((item) => {
            const data = (item.data ?? {}) as Record<string, { en?: string; fr?: string }>
            const label = data[labelField]?.en?.trim() || 'Untitled'
            return (
              <div key={item.id} className='flex items-center justify-between gap-4 p-4'>
                <Link
                  href={`/dashboard/cms/collections/${slug}/${item.id}`}
                  className='min-w-0 flex-1 hover:underline'
                >
                  <span className='line-clamp-1 font-medium'>{label}</span>
                </Link>
                <div className='flex shrink-0 items-center gap-3'>
                  {!item.isPublished ? (
                    <span className='rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs'>
                      Hidden
                    </span>
                  ) : null}
                  <Link
                    href={`/dashboard/cms/collections/${slug}/${item.id}`}
                    className='text-primary text-sm hover:underline'
                  >
                    Edit
                  </Link>
                  <form action={deleteCollectionItemAction}>
                    <input type='hidden' name='collectionSlug' value={slug} />
                    <input type='hidden' name='itemId' value={item.id} />
                    <button
                      type='submit'
                      className='text-destructive text-sm hover:underline'
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
