import { useMemo, useState } from 'react'
import { DOMAINS, type DomainId } from '../types.ts'
import { allEdges, getModel, models } from '../data/index.ts'
import { href } from '../lib/route.ts'

const DOMAIN_XY: Record<DomainId, { x: number; y: number }> = {
  decision: { x: 200, y: 145 },
  systems: { x: 560, y: 125 },
  science: { x: 900, y: 155 },
  cognition: { x: 170, y: 380 },
  probability: { x: 540, y: 355 },
  economics: { x: 910, y: 400 },
  learning: { x: 280, y: 590 },
  strategy: { x: 740, y: 590 },
}

const DOMAIN_COLOR: Record<DomainId, string> = {
  decision: '#9b2a1a',
  systems: '#1e5854',
  probability: '#8a6b24',
  economics: '#3f4a2e',
  cognition: '#5c3558',
  learning: '#3d352c',
  strategy: '#2c4a6e',
  science: '#6a4a2a',
}

function layout() {
  const pos = new Map<string, { x: number; y: number }>()
  const grouped = new Map<DomainId, typeof models>()
  for (const m of models) {
    const arr = grouped.get(m.domain) ?? []
    arr.push(m)
    grouped.set(m.domain, arr)
  }
  for (const [domain, arr] of grouped) {
    const c = DOMAIN_XY[domain]
    const n = arr.length
    const rings = n > 10 ? 2 : 1
    const inner = rings === 1 ? n : Math.ceil(n / 2)
    arr.forEach((m, i) => {
      const ring = i < inner ? 0 : 1
      const idx = ring === 0 ? i : i - inner
      const onRing = ring === 0 ? inner : n - inner
      const r = (n > 10 ? 56 : 80) + ring * 54
      const ang = (Math.PI * 2 * idx) / Math.max(onRing, 1) - Math.PI / 2
      pos.set(m.id, { x: c.x + Math.cos(ang) * r, y: c.y + Math.sin(ang) * r * 0.78 })
    })
  }
  return pos
}

export function MapPage({ focus }: { focus?: string }) {
  const pos = useMemo(layout, [])
  const edges = useMemo(() => allEdges(), [])
  const [hover, setHover] = useState<string | null>(focus ?? null)
  const [filter, setFilter] = useState<DomainId | undefined>(undefined)
  const active = hover ?? focus

  const visible = filter ? models.filter((m) => m.domain === filter) : models
  const visibleIds = new Set(visible.map((m) => m.id))

  const neighbor = new Set<string>()
  if (active) {
    neighbor.add(active)
    for (const e of edges) {
      if (e.source === active) neighbor.add(e.target)
      if (e.target === active) neighbor.add(e.source)
    }
  }

  const showLabel = (id: string) => Boolean(filter) || !active || neighbor.has(id) || hover === id

  return (
    <>
      <div className="kicker">Lattice</div>
      <h1 className="page-title">关系图</h1>
      <p className="lede">
        节点按八个领域成簇。模型多时请先筛一个领域，或从条目页跳入以点亮邻边。点击节点进入说明。
      </p>
      <div className="chips" style={{ marginBottom: 12 }}>
        <button type="button" className={!filter ? 'chip is-on' : 'chip'} onClick={() => setFilter(undefined)}>
          全部 {models.length}
        </button>
        {(Object.keys(DOMAINS) as DomainId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={filter === id ? 'chip is-on' : 'chip'}
            onClick={() => setFilter(id)}
          >
            {DOMAINS[id].name}
          </button>
        ))}
      </div>
      <div className="map-legend">
        {(Object.keys(DOMAINS) as DomainId[]).map((id) => (
          <span key={id}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                background: DOMAIN_COLOR[id],
                marginRight: 6,
              }}
            />
            {DOMAINS[id].name}
          </span>
        ))}
      </div>
      <div className="map-frame">
        <svg className="map-svg" viewBox="0 0 1080 720">
          {edges.map((e) => {
            if (!visibleIds.has(e.source) || !visibleIds.has(e.target)) return null
            const a = pos.get(e.source)
            const b = pos.get(e.target)
            if (!a || !b) return null
            const lit = !active || (neighbor.has(e.source) && neighbor.has(e.target))
            return (
              <line
                key={`${e.source}-${e.target}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={lit ? '#9b2a1a' : '#d2c4ad'}
                strokeOpacity={lit ? 0.55 : 0.18}
                strokeWidth={lit ? 1.4 : 1}
              />
            )
          })}
          {visible.map((m) => {
            const p = pos.get(m.id)
            if (!p) return null
            const on = !active || neighbor.has(m.id)
            return (
              <g
                key={m.id}
                className="map-node"
                opacity={on ? 1 : 0.22}
                onMouseEnter={() => setHover(m.id)}
                onMouseLeave={() => setHover(focus ?? null)}
                onClick={() => {
                  window.location.hash = href({ name: 'model', id: m.id })
                }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active === m.id ? 8 : 5}
                  fill={DOMAIN_COLOR[m.domain]}
                  stroke="#fffaf1"
                  strokeWidth="2"
                />
                {showLabel(m.id) && (
                  <text x={p.x + 9} y={p.y + 4}>
                    {m.name}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      {active && getModel(active) && (
        <p className="note" style={{ marginTop: 12 }}>
          当前：{getModel(active)?.name} · 连出 {Math.max(neighbor.size - 1, 0)} 条邻边。
          <a href={href({ name: 'model', id: active })} style={{ marginLeft: 8 }}>
            打开说明
          </a>
        </p>
      )}
    </>
  )
}
