import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

import { Button } from '@/components/ui/button'

const bgGrid =
  "radial-gradient(circle at 1px 1px, rgb(37 88 250 / 0.12) 1px, transparent 0)"

interface BlogLayoutProps {
  children: ReactNode
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div
      className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <div className="absolute inset-0 bg-grid-plus-black dark:bg-grid-plus-white opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <Button variant="ghost" asChild className="rounded-md border border-slate-200/60 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/50">
            <Link href="/blog" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Insights
            </Link>
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
