'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Building2, ExternalLink, FileText, LogOut, MessageSquareQuote, Tag } from 'lucide-react'

import { signOut } from '@/lib/auth/auth-client'
import { PAGES } from '@/lib/cms/schema'
import { cn } from '@/lib/utils'

const NAV = [
  ...Object.values(PAGES).map((page) => ({
    href: `/dashboard/cms/pages/${page.slug}`,
    label: page.label,
    icon: FileText,
  })),
  { href: '/dashboard/cms/collections/promotions', label: 'Promotions', icon: Tag },
  {
    href: '/dashboard/cms/collections/testimonials',
    label: 'Patient reviews',
    icon: MessageSquareQuote,
  },
  { href: '/dashboard/settings/site', label: 'Footer settings', icon: Building2 },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  async function handleLogout() {
    await signOut()
    router.push('/login')
  }

  const linkClass = (active: boolean) =>
    cn(
      'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-sm transition-colors',
      active
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    )

  return (
    <aside className='shrink-0 border-b bg-muted/30 md:w-60 md:border-r md:border-b-0'>
      <div className='flex h-full flex-col'>
        <div className='border-b px-5 py-5'>
          <div className='font-semibold'>Spruce Ridge Wellness</div>
          <div className='text-muted-foreground text-xs'>Content dashboard</div>
        </div>

        <nav className='flex gap-1 overflow-x-auto p-3 md:flex-col md:overflow-visible'>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(isActive(item.href))}
            >
              <item.icon className='h-4 w-4 shrink-0' />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className='flex flex-col gap-1 border-t p-3 md:mt-auto'>
          <a
            href='/'
            target='_blank'
            rel='noreferrer'
            className={linkClass(false)}
          >
            <ExternalLink className='h-4 w-4 shrink-0' />
            View website
          </a>
          <button type='button' onClick={handleLogout} className={cn(linkClass(false), 'text-left')}>
            <LogOut className='h-4 w-4 shrink-0' />
            Log out
          </button>
        </div>
      </div>
    </aside>
  )
}
