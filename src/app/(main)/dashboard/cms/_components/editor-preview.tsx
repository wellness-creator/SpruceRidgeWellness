'use client'

export function EditorPreview({ path, reloadKey }: { path: string; reloadKey: number }) {
  return (
    <div>
      <div className='lg:sticky lg:top-6'>
        <div className='mb-2 flex items-center justify-between'>
          <span className='font-medium text-muted-foreground text-xs uppercase tracking-wide'>
            Live preview of your website
          </span>
          <a
            href={path}
            target='_blank'
            rel='noreferrer'
            className='text-primary text-xs hover:underline'
          >
            Open page ↗
          </a>
        </div>
        <div className='overflow-hidden rounded-xl border bg-white shadow-sm'>
          <iframe
            key={reloadKey}
            src={path}
            title='Website preview'
            className='h-[80vh] min-h-[560px] w-full'
          />
        </div>
        <p className='mt-2 text-muted-foreground text-xs'>
          This is your live website. It refreshes each time you save.
        </p>
      </div>
    </div>
  )
}
