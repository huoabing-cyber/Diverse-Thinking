import type { DomainId, Model, RelatedLink } from '../types.ts'
import { decisionModels } from './modelsDecision.ts'
import { systemModels } from './modelsSystems.ts'
import { restModels } from './modelsRest.ts'
import { batchDecisionCog } from './batchDecisionCog.ts'
import { batchLearnSys } from './batchLearnSys.ts'
import { batchEconProbSci } from './batchEconProbSci.ts'
import { batchStrategy } from './batchStrategy.ts'
import { numberFrom } from './pack.ts'
import { paths, playbooks, situations } from './extra.ts'

export { paths, playbooks, situations }

const FROM_104_EXISTING = new Set([
  'opportunity-cost',
  'sunk-cost',
  'availability',
  'confirmation-bias',
  'loss-aversion',
  'inversion',
  'circle-of-competence',
  'occams-razor',
  'compounding',
  'diminishing-returns',
  'pareto',
  'fat-tails',
  'survivorship-bias',
  'anchoring',
  'feedback-loops',
  'bayesian',
])

const added = numberFrom(32, [
  ...batchDecisionCog,
  ...batchLearnSys,
  ...batchEconProbSci,
  ...batchStrategy,
]).map((m) => (m.tags.includes('芒格104') ? m : { ...m, tags: [...m.tags, '芒格104'] }))

export const models: Model[] = [...decisionModels, ...systemModels, ...restModels, ...added]
  .map((m) =>
    FROM_104_EXISTING.has(m.id) && !m.tags.includes('芒格104')
      ? { ...m, tags: [...m.tags, '芒格104'] }
      : m,
  )
  .sort((a, b) => a.no - b.no)

const byId = new Map(models.map((m) => [m.id, m]))

export function getModel(id: string): Model | undefined {
  return byId.get(id)
}

export function modelsInDomain(domain: DomainId): Model[] {
  return models.filter((m) => m.domain === domain)
}

export function searchModels(q: string): Model[] {
  const s = q.trim().toLowerCase()
  if (!s) return models
  return models.filter((m) => {
    const blob = [
      m.name,
      m.en,
      m.oneLiner,
      m.essence,
      m.origin,
      ...m.aka,
      ...m.tags,
      ...m.prompts,
      ...m.cases.map((c) => c.title),
    ]
      .join(' ')
      .toLowerCase()
    return blob.includes(s)
  })
}

export type Edge = {
  source: string
  target: string
  kind: RelatedLink['kind']
  note: string
}

export function allEdges(): Edge[] {
  const seen = new Set<string>()
  const edges: Edge[] = []
  for (const m of models) {
    for (const r of m.related) {
      if (!byId.has(r.id)) continue
      const key = [m.id, r.id].sort().join('>')
      if (seen.has(key)) continue
      seen.add(key)
      edges.push({ source: m.id, target: r.id, kind: r.kind, note: r.note })
    }
  }
  return edges
}

export function relatedModels(id: string): { model: Model; link: RelatedLink }[] {
  const m = byId.get(id)
  if (!m) return []
  return m.related
    .map((link) => {
      const model = byId.get(link.id)
      return model ? { model, link } : null
    })
    .filter((x): x is { model: Model; link: RelatedLink } => x !== null)
}

export function incoming(id: string): { model: Model; link: RelatedLink }[] {
  const out: { model: Model; link: RelatedLink }[] = []
  for (const m of models) {
    for (const link of m.related) {
      if (link.id === id) out.push({ model: m, link })
    }
  }
  return out
}

export function playbooksUsing(id: string) {
  return playbooks.filter((p) => p.steps.some((s) => s.modelId === id))
}

export function pathsUsing(id: string) {
  return paths.filter((p) => p.steps.some((s) => s.modelId === id))
}

export function situationsUsing(id: string) {
  return situations.filter((s) => s.models.some((m) => m.id === id))
}

export function difficultyLabel(d: 1 | 2 | 3): string {
  return d === 1 ? '入门' : d === 2 ? '进阶' : '需练习'
}

export function missingRelations(): { from: string; to: string }[] {
  const miss: { from: string; to: string }[] = []
  for (const m of models) {
    for (const r of m.related) {
      if (!byId.has(r.id)) miss.push({ from: m.id, to: r.id })
    }
  }
  return miss
}
