import type { ApplyRecord } from '../types.ts'

const KEY = 'diverse-thinking.v1'

export type DeskState = {
  bookmarks: string[]
  notes: Record<string, string>
  read: string[]
  applies: ApplyRecord[]
}

const empty: DeskState = { bookmarks: [], notes: {}, read: [], applies: [] }

export function loadDesk(): DeskState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...empty, notes: {} }
    const parsed = JSON.parse(raw) as DeskState
    return {
      bookmarks: parsed.bookmarks ?? [],
      notes: parsed.notes ?? {},
      read: parsed.read ?? [],
      applies: parsed.applies ?? [],
    }
  } catch {
    return { ...empty, notes: {} }
  }
}

export function saveDesk(state: DeskState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
