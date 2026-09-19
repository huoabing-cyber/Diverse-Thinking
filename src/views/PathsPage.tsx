import { A } from '../components/A.tsx'
import { getModel, paths } from '../data/index.ts'

export function PathsPage({ id }: { id?: string }) {
  const current = id ? paths.find((p) => p.id === id) : undefined
  if (id && !current) {
    return (
      <div className="empty">
        路径不存在。<A to={{ name: 'paths' }}>返回列表</A>
      </div>
    )
  }
  if (current) {
    return (
      <>
        <div className="kicker">{current.audience}</div>
        <h1 className="page-title">{current.name}</h1>
        <p className="lede">
          {current.duration}。{current.promise} 按顺序读，每条用工作台做一道自己的题。
        </p>
        <p>
          <A className="btn btn-ghost btn-small" to={{ name: 'paths' }}>
            全部路径
          </A>
        </p>
        <div className="path-steps" style={{ marginTop: 18 }}>
          {current.steps.map((s, i) => {
            const m = getModel(s.modelId)
            if (!m) return null
            return (
              <A key={m.id} className="path-step" to={{ name: 'model', id: m.id }}>
                <div className="n">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h3>
                    {m.name}
                    <span className="en"> {m.en}</span>
                  </h3>
                  <p>{s.why}</p>
                </div>
              </A>
            )
          })}
        </div>
      </>
    )
  }
  return (
    <>
      <div className="kicker">Curriculum</div>
      <h1 className="page-title">学习路径</h1>
      <p className="lede">按角色把模型排成序列。顺序有用意：先边界与地图，再概率与激励，最后才是更难的更新。</p>
      <div className="model-grid">
        {paths.map((p) => (
          <A key={p.id} className="model-card" to={{ name: 'path', id: p.id }}>
            <div className="model-no">{p.steps.length}</div>
            <div>
              <h3>{p.name}</h3>
              <p>
                {p.audience} · {p.duration}
              </p>
              <p>{p.promise}</p>
            </div>
          </A>
        ))}
      </div>
    </>
  )
}
