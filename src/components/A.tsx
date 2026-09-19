import type { CSSProperties, ReactNode } from 'react'
import type { Route } from '../types.ts'
import { href } from '../lib/route.ts'

export function A({
  to,
  className,
  children,
  style,
}: {
  to: Route
  className?: string
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <a href={href(to)} className={className} style={style}>
      {children}
    </a>
  )
}
