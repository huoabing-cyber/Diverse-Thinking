import { A } from '../components/A.tsx'
import { getModel, situations } from '../data/index.ts'

export function SituationsPage() {
  return (
    <>
      <div className="kicker">Situation Index</div>
      <h1 className="page-title">情境入口</h1>
      <p className="lede">
        从问题出发，而不是从模型名出发。每个情境给出症状、推荐模型（附原因），以及一套可跟做的组合拳。
      </p>
      <div className="model-grid">
        {situations.map((s) => (
          <article key={s.id} className="panel">
            <h3>{s.question}</h3>
            <p className="note">若你正在：{s.symptoms.join(' · ')}</p>
            <div className="rel-list" style={{ marginTop: 12 }}>
              {s.models.map((item) => {
                const m = getModel(item.id)
                if (!m) return null
                return (
                  <A key={m.id} className="rel" to={{ name: 'model', id: m.id }}>
                    <div className="kind">推荐</div>
                    <div>
                      <h4>{m.name}</h4>
                      <p>{item.why}</p>
                    </div>
                  </A>
                )
              })}
            </div>
            {s.playbookId && (
              <p style={{ marginTop: 12 }}>
                <A className="btn btn-small" to={{ name: 'playbook', id: s.playbookId }}>
                  打开对应组合拳
                </A>
              </p>
            )}
          </article>
        ))}
      </div>
    </>
  )
}
