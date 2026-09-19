import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { DOMAINS, RELATION_KINDS } from '../types.ts'
import { A } from '../components/A.tsx'
import {
  difficultyLabel,
  getModel,
  pathsUsing,
  playbooksUsing,
  relatedModels,
  situationsUsing,
} from '../data/index.ts'
import type { DeskState } from '../lib/store.ts'

export function ModelPage({
  id,
  desk,
  setDesk,
  markRead,
}: {
  id: string
  desk: DeskState
  setDesk: Dispatch<SetStateAction<DeskState>>
  markRead: (id: string) => void
}) {
  const m = getModel(id)
  const [note, setNote] = useState(desk.notes[id] ?? '')

  useEffect(() => {
    if (m) markRead(m.id)
  }, [m, markRead])

  useEffect(() => {
    setNote(desk.notes[id] ?? '')
  }, [desk.notes, id])

  if (!m) {
    return (
      <div className="empty">
        找不到这个模型。
        <A to={{ name: 'catalog' }}>回到模型馆</A>
      </div>
    )
  }

  const starred = desk.bookmarks.includes(m.id)
  const related = relatedModels(m.id)
  const usedIn = playbooksUsing(m.id)
  const inPaths = pathsUsing(m.id)
  const inSit = situationsUsing(m.id)
  const compareTarget = related[0]?.model.id

  return (
    <>
      <div className="kicker">
        {DOMAINS[m.domain].name} · {m.origin}
      </div>
      <div className="model-hero">
        <div>
          <h1 className="page-title">
            M.{String(m.no).padStart(2, '0')} {m.name}
          </h1>
          <p className="one-liner">{m.oneLiner}</p>
          <p className="metaphor">{m.metaphor}</p>
          <div className="toolbar">
            <button
              className="btn btn-small"
              onClick={() =>
                setDesk((d) => ({
                  ...d,
                  bookmarks: starred ? d.bookmarks.filter((x) => x !== m.id) : [...d.bookmarks, m.id],
                }))
              }
            >
              {starred ? '取消收藏' : '收藏'}
            </button>
            <A className="btn btn-ghost btn-small" to={{ name: 'apply', id: m.id }}>
              用它处理我的问题
            </A>
            <A className="btn btn-ghost btn-small" to={{ name: 'map', focus: m.id }}>
              在关系图中定位
            </A>
            {compareTarget && (
              <A className="btn btn-ghost btn-small" to={{ name: 'compare', a: m.id, b: compareTarget }}>
                与相邻模型对照
              </A>
            )}
          </div>
          <div className="meta">
            <span className="tag">{m.en}</span>
            <span className="tag">{difficultyLabel(m.difficulty)}</span>
            {m.aka.map((a) => (
              <span key={a} className="tag">
                {a}
              </span>
            ))}
          </div>
        </div>
        <dl className="side-box">
          <dt>一句话</dt>
          <dd>{m.oneLiner}</dd>
          <dt>来源</dt>
          <dd>{m.origin}</dd>
          <dt>标签</dt>
          <dd>{m.tags.join(' · ')}</dd>
        </dl>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>机制</h3>
          <p>{m.essence}</p>
          <h3 style={{ marginTop: 18 }}>运作步骤</h3>
          <ol>
            {m.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
        <div>
          <div className="panel">
            <h3>何时使用</h3>
            <ul>
              {m.when.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="panel warn" style={{ marginTop: 16 }}>
            <h3>何时不用</h3>
            <ul>
              {m.whenNot.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="panel danger" style={{ marginTop: 16 }}>
        <h3>误用与陷阱</h3>
        <ul>
          {m.pitfalls.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h3>运用清单</h3>
          <ol>
            {m.checklist.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
        <div className="panel">
          <h3>自问</h3>
          <ul>
            {m.prompts.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section-head">
        <h2>应用案例</h2>
        <p>统一五段：情境、直觉、模型切入、行动、启示。对照你自己的问题，看卡在哪一段。</p>
      </div>
      {m.cases.map((c) => (
        <article key={c.title} className="case">
          <div className="case-head">
            <h4>{c.title}</h4>
            <span className="scene">{c.scene}</span>
          </div>
          <div className="steps5">
            <div>
              <strong>情境</strong>
              {c.context}
            </div>
            <div>
              <strong>直觉反应</strong>
              {c.instinct}
            </div>
            <div>
              <strong>模型切入</strong>
              {c.apply}
            </div>
            <div>
              <strong>行动</strong>
              {c.action}
            </div>
            <div>
              <strong>启示</strong>
              {c.lesson}
            </div>
          </div>
        </article>
      ))}

      <div className="section-head">
        <h2>相邻模型</h2>
        <p>互补并用、制衡纠偏、延伸加深、对照辨析、先掌握。点过去会换一条路径。</p>
      </div>
      <div className="rel-list">
        {related.map(({ model, link }) => (
          <A key={model.id} className="rel" to={{ name: 'model', id: model.id }}>
            <div className="kind">{RELATION_KINDS[link.kind]}</div>
            <div>
              <h4>
                {model.name} <span className="en">{model.en}</span>
              </h4>
              <p>{link.note}</p>
            </div>
          </A>
        ))}
      </div>
      {related.length > 1 && (
        <p className="note" style={{ marginTop: 10 }}>
          对照阅读：
          {related.slice(0, 4).map((r) => (
            <A key={r.model.id} to={{ name: 'compare', a: m.id, b: r.model.id }} style={{ marginLeft: 10 }}>
              {m.name} × {r.model.name}
            </A>
          ))}
        </p>
      )}

      {(usedIn.length > 0 || inPaths.length > 0 || inSit.length > 0) && (
        <>
          <div className="section-head">
            <h2>出现在</h2>
            <p>从这条模型跳到组合拳、路径或情境，顺着格子走。</p>
          </div>
          <div className="chips">
            {usedIn.map((p) => (
              <A key={p.id} className="chip" to={{ name: 'playbook', id: p.id }}>
                组合拳 · {p.name}
              </A>
            ))}
            {inPaths.map((p) => (
              <A key={p.id} className="chip" to={{ name: 'path', id: p.id }}>
                路径 · {p.name}
              </A>
            ))}
            {inSit.map((s) => (
              <A key={s.id} className="chip" to={{ name: 'situations' }}>
                情境 · {s.question}
              </A>
            ))}
          </div>
        </>
      )}

      <div className="panel" style={{ marginTop: 28 }}>
        <h3>页边笔记</h3>
        <p className="note">只存在本机书桌，不会上传。</p>
        <div className="form">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="把这个问题、反例或你改过的步骤写在这里。"
          />
          <p>
            <button
              className="btn btn-small"
              onClick={() => setDesk((d) => ({ ...d, notes: { ...d.notes, [m.id]: note } }))}
            >
              保存笔记
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
