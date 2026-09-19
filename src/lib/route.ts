import { DOMAINS, type DomainId, type Route } from '../types.ts'

function query(qs: string | undefined): URLSearchParams {
  return new URLSearchParams(qs ?? '')
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, '') || '/'
  const [pathPart, qs] = raw.split('?')
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`
  const parts = path.split('/').filter(Boolean)
  const q = query(qs)

  if (parts.length === 0) return { name: 'home' }

  if (parts[0] === 'models') {
    const domain = q.get('domain')
    const valid = domain && domain in DOMAINS ? (domain as DomainId) : undefined
    return { name: 'catalog', domain: valid, q: q.get('q') ?? undefined }
  }
  if (parts[0] === 'model' && parts[1]) return { name: 'model', id: parts[1] }
  if (parts[0] === 'map') return { name: 'map', focus: parts[1] }
  if (parts[0] === 'paths' && parts[1]) return { name: 'path', id: parts[1] }
  if (parts[0] === 'paths') return { name: 'paths' }
  if (parts[0] === 'playbooks' && parts[1]) return { name: 'playbook', id: parts[1] }
  if (parts[0] === 'playbooks') return { name: 'playbooks' }
  if (parts[0] === 'situations') return { name: 'situations' }
  if (parts[0] === 'apply' && parts[1]) return { name: 'apply', id: parts[1] }
  if (parts[0] === 'compare' && parts[1] && parts[2]) {
    return { name: 'compare', a: parts[1], b: parts[2] }
  }
  if (parts[0] === 'desk') return { name: 'desk' }
  return { name: 'home' }
}

export function href(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/'
    case 'catalog': {
      const p = new URLSearchParams()
      if (route.domain) p.set('domain', route.domain)
      if (route.q) p.set('q', route.q)
      const s = p.toString()
      return s ? `#/models?${s}` : '#/models'
    }
    case 'model':
      return `#/model/${route.id}`
    case 'map':
      return route.focus ? `#/map/${route.focus}` : '#/map'
    case 'paths':
      return '#/paths'
    case 'path':
      return `#/paths/${route.id}`
    case 'playbooks':
      return '#/playbooks'
    case 'playbook':
      return `#/playbooks/${route.id}`
    case 'situations':
      return '#/situations'
    case 'apply':
      return `#/apply/${route.id}`
    case 'compare':
      return `#/compare/${route.a}/${route.b}`
    case 'desk':
      return '#/desk'
  }
}

export function go(route: Route) {
  window.location.hash = href(route).slice(1)
}
