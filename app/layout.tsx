import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UIET E-CELL | Entrepreneurship Cell, UIET MDU Rohtak',
  description: 'The central hub for student entrepreneurs, alumni mentors, and startup resources at UIET MDU.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-warm-bg text-warm-primary min-h-screen flex flex-col selection:bg-orange-accent selection:text-white`}>
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
