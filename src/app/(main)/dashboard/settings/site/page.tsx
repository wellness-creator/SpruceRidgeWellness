import { cmsService } from '@/lib/cms/service'
import { SiteSettingsForm, type SiteSettingsValues } from './site-settings-form'

export default async function SiteSettingsPage() {
  const settings = await cmsService.getSiteSettings()
  const socials = (settings.socials ?? {}) as Record<string, string>

  const initial: SiteSettingsValues = {
    siteName: settings.siteName ?? '',
    about: settings.about ?? '',
    contactEmail: settings.contactEmail ?? '',
    contactPhone: settings.contactPhone ?? '',
    address: settings.address ?? '',
    defaultOgImage: settings.defaultOgImage ?? '',
    socials,
  }

  return (
    <div className='px-6 py-8 lg:px-10'>
      <h1 className='mb-2 font-bold text-3xl tracking-tight'>Footer settings</h1>
      <p className='mb-8 text-muted-foreground'>
        Your clinic name, contact details and social links — these appear in the website footer.
      </p>
      <SiteSettingsForm initial={initial} />
    </div>
  )
}
