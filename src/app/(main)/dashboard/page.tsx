import { redirect } from 'next/navigation'

export default function DashboardPage() {
  // The dashboard opens straight into the visual editor for the home page.
  redirect('/dashboard/cms/pages/home')
}
