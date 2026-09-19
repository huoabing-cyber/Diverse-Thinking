import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { A } from '../components/A.tsx'
import { getModel } from '../data/index.ts'
import { uid, type DeskState } from '../lib/store.ts'

export function ApplyPage({
  id,
  setDesk,
}: {
  id: string
  setDesk: Dispatch<SetStateAction<DeskState>>
}) {
  const m = getModel(id)
  const [situation, setSituation] = useState('')
  const [answers, setAnswers] = useState<string[]>(() => m?.checklist.map(() => '') ?? [])
  const [saved, setSaved] = useState(false)

  if (!m) {
    return (
      <div className="empty">
        模型不存在。<A to={{ name: 'catalog' }}>返回</A>
      </div>
    )
  }

  const submit = () => {
    const rec = {
      id: uid(),
      modelId: m.id,
      situation,
      answers,
      createdAt: new Date().toISOString(),
    }
    setDesk((d) => ({ ...d, applies: [rec, ...d.applies] }))
    setSaved(true)
  }

  return (
    <>
      <div className="kicker">Workshop</div>
      <h1 className="page-title">运用工作台 · {m.name}</h1>
      <p className="lede">
        把真实问题放进来，按清单逐条回答。这不是测验，是把模型从词变成一次具体判断。完成后会存到书桌。
      </p>
      <p>
        <A to={{ name: 'model', id: m.id }}>← 返回说明</A>
      </p>
      <div className="form panel">
        <label>我的情境（尽量写可观察的事实，少写形容词）</label>
        <textarea value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="发生了什么、谁在场、什么资源会被锁住、什么时候必须决定。" />
        {m.checklist.map((q, i) => (
          <div key={q}>
            <label>
              {i + 1}. {q}
            </label>
            <textarea
              value={answers[i] ?? ''}
              onChange={(e) => {
              const next = answers.slice()
              next[i] = e.target.value
              setAnswers(next)
              }}
            />
          </div>
        ))}
        <div className="panel" style={{ marginTop: 16, background: 'var(--card-2)' }}>
          <h3>建议再问</h3>
          <ul>
            {m.prompts.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <p style={{ marginTop: 16 }}>
          <button className="btn" onClick={submit} disabled={!situation.trim()}>
            存入书桌
          </button>
        </p>
        {saved && (
          <p className="note">
            已保存。<A to={{ name: 'desk' }}>去书桌查看</A>
          </p>
        )}
      </div>
    </>
  )
}

export function ComparePage({ a, b }: { a: string; b: string }) {
  const left = getModel(a)
  const right = getModel(b)
  const options = useMemo(() => {
    const seed = left?.related.map((r) => r.id) ?? []
    return seed
  }, [left])

  if (!left || !right) {
    return (
      <div className="empty">
        对照需要两个有效模型。<A to={{ name: 'catalog' }}>回模型馆</A>
      </div>
    )
  }

  const Block = ({
    title,
    items,
  }: {
    title: string
    items: string[]
  }) => (
    <>
      <h3 style={{ marginTop: 16, fontSize: 18 }}>{title}</h3>
      <ul>
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </>
  )

  return (
    <>
      <div className="kicker">Contrast</div>
      <h1 className="page-title">对照阅读</h1>
      <p className="lede">并排放机制与边界。换右侧模型可从左侧的相邻关系里挑。</p>
      {options.length > 0 && (
        <p className="chips">
          {options.map((id) => {
            const m = getModel(id)
            if (!m) return null
            return (
              <A key={id} className={id === b ? 'chip is-on' : 'chip'} to={{ name: 'compare', a, b: id }}>
                {m.name}
              </A>
            )
          })}
        </p>
      )}
      <div className="compare" style={{ marginTop: 16 }}>
        {[left, right].map((m) => (
          <article key={m.id} className="panel">
            <div className="kicker">M.{String(m.no).padStart(2, '0')}</div>
            <h2>{m.name}</h2>
            <p className="note">{m.en}</p>
            <p>{m.oneLiner}</p>
            <p className="metaphor">{m.metaphor}</p>
            <Block title="运作步骤" items={m.steps} />
            <Block title="何时用" items={m.when} />
            <Block title="何时不用" items={m.whenNot} />
            <p>
              <A to={{ name: 'model', id: m.id }}>打开完整说明</A>
            </p>
          </article>
        ))}
      </div>
    </>
  )
}

export function DeskPage({
  desk,
  setDesk,
}: {
  desk: DeskState
  setDesk: Dispatch<SetStateAction<DeskState>>
}) {
  const [q, setQ] = useState('')
  return (
    <>
      <div className="kicker">Desk</div>
      <h1 className="page-title">我的书桌</h1>
      <p className="lede">收藏、笔记、运用记录与已读都存在这台浏览器里。换设备不会同步。</p>
      <div className="grid-2">
        <div className="panel">
          <h3>收藏 {desk.bookmarks.length}</h3>
          {desk.bookmarks.length === 0 ? (
            <p className="note">在模型页点收藏。</p>
          ) : (
            <div className="rel-list">
              {desk.bookmarks.map((id) => {
                const m = getModel(id)
                if (!m) return null
                return (
                  <A key={id} className="rel" to={{ name: 'model', id }}>
                    <div className="kind">M.{String(m.no).padStart(2, '0')}</div>
                    <div>
                      <h4>{m.name}</h4>
                      <p>{m.oneLiner}</p>
                    </div>
                  </A>
                )
              })}
            </div>
          )}
        </div>
        <div className="panel">
          <h3>已读 {desk.read.length}</h3>
          <p className="note">打开过说明页的模型会记在这里，首页会据此轮换路径建议。</p>
          <div className="chips" style={{ marginTop: 10 }}>
            {desk.read.map((id) => {
              const m = getModel(id)
              if (!m) return null
              return (
                <A key={id} className="chip" to={{ name: 'model', id }}>
                  {m.name}
                </A>
              )
            })}
          </div>
        </div>
      </div>

      <div className="section-head">
        <h2>运用记录</h2>
        <p>工作台提交的判断稿。</p>
      </div>
      {desk.applies.length === 0 ? (
        <div className="empty">还没有记录。从任一模型进入“用它处理我的问题”。</div>
      ) : (
        desk.applies.map((rec) => {
          const m = getModel(rec.modelId)
          if (!m) return null
          return (
            <article key={rec.id} className="case">
              <div className="case-head">
                <h4>
                  {m.name} · {new Date(rec.createdAt).toLocaleString()}
                </h4>
                <button
                  className="btn btn-ghost btn-small"
                  onClick={() => setDesk((d) => ({ ...d, applies: d.applies.filter((x) => x.id !== rec.id) }))}
                >
                  删除
                </button>
              </div>
              <div style={{ padding: 16 }}>
                <p>
                  <strong>情境</strong> {rec.situation}
                </p>
                <ol>
                  {rec.answers.map((a, i) => (
                    <li key={i}>
                      <span className="note">{m.checklist[i]}</span>
                      <div>{a || '（未填）'}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          )
        })
      )}

      <div className="section-head">
        <h2>笔记</h2>
        <p>按模型保存的页边字。</p>
      </div>
      <input
        className="filter-input"
        placeholder="筛选笔记…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {Object.entries(desk.notes)
        .filter(([, text]) => text.trim())
        .filter(([id, text]) => {
          if (!q.trim()) return true
          const m = getModel(id)
          return `${m?.name ?? ''} ${text}`.includes(q)
        })
        .map(([id, text]) => {
          const m = getModel(id)
          return (
            <div key={id} className="panel" style={{ marginBottom: 10 }}>
              <h3>
                <A to={{ name: 'model', id }}>{m?.name ?? id}</A>
              </h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{text}</p>
            </div>
          )
        })}
    </>
  )
}
