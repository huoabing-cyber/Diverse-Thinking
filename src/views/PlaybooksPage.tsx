import { A } from '../components/A.tsx'
import { getModel, playbooks } from '../data/index.ts'

export function PlaybooksPage({ id }: { id?: string }) {
  const current = id ? playbooks.find((p) => p.id === id) : undefined
  if (id && !current) {
    return (
      <div className="empty">
        组合拳不存在。<A to={{ name: 'playbooks' }}>返回</A>
      </div>
    )
  }
  if (current) {
    return (
      <>
        <div className="kicker">{current.en}</div>
        <h1 className="page-title">{current.name}</h1>
        <p className="lede">
          <strong>何时：</strong>
          {current.when}
        </p>
        <p className="lede">
          <strong>产出：</strong>
          {current.outcome}
        </p>
        <div className="path-steps">
          {current.steps.map((s, i) => {
            const m = getModel(s.modelId)
            if (!m) return null
            return (
              <A key={`${m.id}-${i}`} className="path-step" to={{ name: 'model', id: m.id }}>
                <div className="n">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h3>
                    {m.name}
                    <span className="en"> · {s.role}</span>
                  </h3>
                  <p>{s.instruction}</p>
                </div>
              </A>
            )
          })}
        </div>
        <p style={{ marginTop: 18 }}>
          <A className="btn" to={{ name: 'apply', id: current.steps[0].modelId }}>
            从第一步开始运用
          </A>
        </p>
      </>
    )
  }
  return (
    <>
      <div className="kicker">Playbooks</div>
      <h1 className="page-title">组合拳</h1>
      <p className="lede">
        单个模型像工具。真正的判断往往要按顺序带上三到六个。每套组合拳写清何时用、每步角色、以及你该拿到的产出。
      </p>
      <div className="model-grid">
        {playbooks.map((p) => (
          <A key={p.id} className="model-card" to={{ name: 'playbook', id: p.id }}>
            <div className="model-no">{p.steps.length}</div>
            <div>
              <h3>{p.name}</h3>
              <p>{p.when}</p>
            </div>
          </A>
        ))}
      </div>
    </>
  )
}
