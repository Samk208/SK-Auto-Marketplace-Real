import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const plusGrid =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232558fa' fill-opacity='.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"

const components = {
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="mt-12 scroll-m-20 border-b border-primary/20 pb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-5xl">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="mt-10 scroll-m-20 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
      {children}
    </h3>
  ),
  h4: ({ children }: { children: ReactNode }) => (
    <h4 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
      {children}
    </h4>
  ),
  p: ({ children }: { children: ReactNode }) => (
    <p className="leading-7 text-slate-600 dark:text-slate-300 [&:not(:first-child)]:mt-6">
      {children}
    </p>
  ),
  a: ({ href, children }: { href: string; children: ReactNode }) => (
    <Link
      href={href}
      className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition hover:text-primary/90"
    >
      {children}
    </Link>
  ),
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="my-6 ml-4 list-disc space-y-2 text-slate-600 dark:text-slate-300">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className="my-6 ml-4 list-decimal space-y-2 text-slate-600 dark:text-slate-300">
      {children}
    </ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="pl-2">
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote
      className="my-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 text-lg font-medium text-primary"
      style={{ backgroundImage: plusGrid, backgroundSize: '140px 140px' }}
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-dashed border-slate-200 dark:border-slate-700" />,
  img: ({ src, alt }: { src: string; alt: string }) => (
    <div className="my-8 overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={600}
        className="h-full w-full object-cover"
      />
      {alt && <p className="bg-slate-50 px-4 py-2 text-sm text-muted-foreground">{alt}</p>}
    </div>
  ),
  table: ({ children }: { children: ReactNode }) => (
    <div className="my-8 overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: ReactNode }) => (
    <thead className="bg-primary/5 text-xs uppercase tracking-widest text-primary">
      {children}
    </thead>
  ),
  tbody: ({ children }: { children: ReactNode }) => (
    <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
      {children}
    </tbody>
  ),
  tr: ({ children }: { children: ReactNode }) => <tr className="hover:bg-primary/5">{children}</tr>,
  th: ({ children }: { children: ReactNode }) => (
    <th className="px-4 py-3 font-semibold">{children}</th>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <td className="px-4 py-3 align-top">{children}</td>
  ),
  code: ({ children }: { children: ReactNode }) => (
    <code className="rounded-md bg-slate-900/90 px-1.5 py-0.5 font-mono text-sm text-slate-100">
      {children}
    </code>
  ),
  pre: ({ children }: { children: ReactNode }) => (
    <pre className="my-6 overflow-x-auto rounded-2xl border border-slate-900/10 bg-slate-900/95 p-6 text-sm text-slate-100 shadow-lg">
      {children}
    </pre>
  ),
  Image,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Alert,
  AlertTitle,
  AlertDescription,
  Badge,
}

export default components
