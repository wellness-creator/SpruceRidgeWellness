import { AnnouncementBar } from "@/components/wellness/layout/announcement-bar"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      {children}
    </>
  )
}
