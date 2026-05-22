import Link from "next/link"

import { cmsService } from "@/lib/cms/service"

export async function AnnouncementBar() {
  const s = await cmsService.getSiteSettings()
  const text = s.announcementText?.trim()
  if (!s.announcementEnabled || !text) return null

  const href = s.announcementLink?.trim() || "/promotions"
  const linkLabel = s.announcementLinkLabel?.trim()

  return (
    <div className="bg-deep-forest">
      <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-center gap-3 px-4">
        <span aria-hidden className="h-1 w-1 rounded-full bg-warm-cream/50" />
        <Link
          href={href}
          className="text-[12px] tracking-tight text-warm-cream/90 transition-colors hover:text-warm-cream"
        >
          {text}
          {linkLabel ? (
            <>
              {" — "}
              <span className="underline underline-offset-4 decoration-warm-cream/40">
                {linkLabel}
              </span>
            </>
          ) : null}
        </Link>
      </div>
    </div>
  )
}
