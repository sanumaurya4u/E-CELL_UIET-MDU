import { redirect } from 'next/navigation'

export default function LegacyNewStartupRedirect() {
  redirect('/startups/new')
}
