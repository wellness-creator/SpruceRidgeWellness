import { notFound } from 'next/navigation'

import { cmsService } from '@/lib/cms/service'
import { PageFieldsForm, type FieldValue } from '../../_components/page-fields-form'
import { UndoButton } from '../../_components/undo-button'

export default async function CmsPageEditor({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await cmsService.getPageEditorData(slug)
  if (!data) notFound()

  const { def, values, canUndo } = data
  const initial: Record<string, FieldValue> = {}
  for (const f of def.fields) {
    const row = values[f.key]
    initial[f.key] = {
      en: row?.valueEn ?? f.defaultText ?? '',
      image: row?.valueImage ?? f.defaultValue ?? '',
      url: row?.valueUrl ?? f.defaultValue ?? '',
      bool: row?.valueBool ?? false,
      num: row?.valueNum ?? 0,
    }
  }

  return (
    <div className='px-6 py-8 lg:px-10'>
      <div className='mb-6 flex justify-end border-b pb-4'>
        <UndoButton pageSlug={def.slug} canUndo={canUndo} />
      </div>
      <h1 className='mb-2 font-bold text-3xl tracking-tight'>{def.label}</h1>
      <p className='mb-8 text-muted-foreground'>{def.description}</p>
      <PageFieldsForm def={def} initial={initial} />
    </div>
  )
}
