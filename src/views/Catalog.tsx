import { DOMAINS, type DomainId } from '../types.ts'
import { A } from '../components/A.tsx'
import { difficultyLabel, models, searchModels } from '../data/index.ts'
import type { DeskState } from '../lib/store.ts'

export function Catalog({
  domain,
  q,
  desk,
}: {
  domain?: DomainId
  q?: string
  desk: DeskState
}) {
  const list = (q ? searchModels(q) : models).filter((m) => (domain ? m.domain === domain : true))
  return (
    <>
      <div className="kicker">Catalog</div>
      <h1 className="page-title">模型馆</h1>
      <p className="lede">
        {q ? `检索 “${q}” · ` : ''}
        共 {list.length} 条。点进条目看机制、边界、案例与跳转；星标与笔记在书桌。
      </p>
      <div className="chips" style={{ marginBottom: 22 }}>
        <A className={!domain ? 'chip is-on' : 'chip'} to={{ name: 'catalog', q }}>
          全部
        </A>
        {(Object.keys(DOMAINS) as DomainId[]).map((id) => (
          <A
            key={id}
            className={domain === id ? 'chip is-on' : 'chip'}
            to={{ name: 'catalog', domain: id, q }}
          >
            {DOMAINS[id].name}
          </A>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="empty">没有命中。试试更短的词，或从情境入口描述问题。</div>
      ) : (
        <div className="model-grid">
          {list.map((m) => (
            <A key={m.id} className="model-card" to={{ name: 'model', id: m.id }}>
              <div className="model-no">M.{String(m.no).padStart(2, '0')}</div>
              <div>
                <h3>
                  {m.name}
                  <span className="en">{m.en}</span>
                </h3>
                <p>{m.oneLiner}</p>
                <div className="meta">
                  <span className="tag">{DOMAINS[m.domain].name}</span>
                  <span className="tag">{difficultyLabel(m.difficulty)}</span>
                  {desk.read.includes(m.id) && <span className="tag">已读</span>}
                  {desk.bookmarks.includes(m.id) && <span className="tag">已收藏</span>}
                </div>
              </div>
            </A>
          ))}
        </div>
      )}
    </>
  )
}
