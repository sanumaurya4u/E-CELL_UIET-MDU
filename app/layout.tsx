import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { DataProvider } from '@/context/DataProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ecellmdu.vercel.app'),
  title: {
    default: 'E-Cell | UIET MDU Rohtak',
    template: '%s | E-Cell | UIET MDU Rohtak',
  },
  description:
    'Promoting entrepreneurship & innovation at UIET through student-led ventures, events, mentorship, and entrepreneurial opportunities.',
  keywords: [
    'E-Cell',
    'UIET MDU Rohtak',
    'Entrepreneurship Cell of UIET, MDU, Rohtak',
    'Ideas into Impact',
    'Student-led ventures',
    'Maharshi Dayanand University',
  ],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'E-Cell | UIET MDU Rohtak',
    description:
      'Promoting entrepreneurship & innovation at UIET through student-led ventures, events, mentorship, and entrepreneurial opportunities.',
    url: 'https://ecellmdu.vercel.app/',
    siteName: 'E-Cell | UIET MDU Rohtak',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 612,
        height: 292,
        alt: 'E-Cell | UIET MDU Rohtak',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Cell | UIET MDU Rohtak',
    description:
      'Promoting entrepreneurship & innovation at UIET through student-led ventures, events, mentorship, and entrepreneurial opportunities.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-warm-bg text-warm-primary min-h-screen flex flex-col selection:bg-orange-accent selection:text-white`}>
        <DataProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </DataProvider>
      </body>
    </html>
  )
}
