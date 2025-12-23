'use client'

import { useMDXComponent } from 'next-contentlayer/hooks'

import mdxComponents from '@/components/mdx-components'

interface MDXContentProps {
  code: string
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code)

  return <Component components={mdxComponents} />
}
