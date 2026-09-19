import type { Model } from '../types.ts'

export type ModelDraft = Omit<Model, 'no'>

export function numberFrom(start: number, drafts: ModelDraft[]): Model[] {
  return drafts.map((d, i) => ({ ...d, no: start + i }))
}
