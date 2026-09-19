import { DOMAINS, type DomainId } from '../types.ts'
import { A } from '../components/A.tsx'
import { models, paths, playbooks, situations } from '../data/index.ts'
import type { DeskState } from '../lib/store.ts'

export function Home({ desk }: { desk: DeskState }) {
  const nextPath = paths[desk.read.length % paths.length]
  return (
    <>
      <section className="hero">
        <div className="kicker">Latticework Studio</div>
        <h1>
          Diverse <em>Thinking</em>
        </h1>
        <p className="hero-lead">
          查理·芒格说，真正的智慧是一张互相连接的格子，而不是一口袋孤立的招数。这里收入常用模型（含一份 104 条芒格格子清单），写成可检索的条目：每条都有机制、误用边界、固定格式的案例，以及通往相邻模型的跳转。用来学，也用来在具体问题上动手。
        </p>
        <div className="hero-actions">
          <A className="btn" to={{ name: 'catalog' }}>
            进入模型馆
          </A>
          <A className="btn btn-ghost" to={{ name: 'situations' }}>
            我有一个具体问题
          </A>
          <A className="btn btn-ghost" to={{ name: 'map' }}>
            看关系图
          </A>
        </div>
      </section>

      <div className="triad">
        <article>
          <div className="n">01</div>
          <h3>学</h3>
          <p>先读一句话定义与运作步骤，再看何时不该用。模型馆按领域排开，书桌会记下你读过的条目。</p>
        </article>
        <article>
          <div className="n">02</div>
          <h3>连</h3>
          <p>互补、制衡、对照、先修关系都做成跳转。关系图与组合拳让你一次带上三到六个模型，而不是只用最顺口的那一个。</p>
        </article>
        <article>
          <div className="n">03</div>
          <h3>用</h3>
          <p>每个模型有运用清单与自问。工作台把问题填进去，生成一份留在书桌的记录。案例统一为：情境 → 直觉 → 切入 → 行动 → 启示。</p>
        </article>
      </div>

      <div className="section-head">
        <h2>八个领域</h2>
        <p>格子按来源学科分区，但真正的力量在跨区连线。点进去只看该区，或去关系图看全部张力。</p>
      </div>
      <div className="domain-grid">
        {(Object.keys(DOMAINS) as DomainId[]).map((id) => {
          const d = DOMAINS[id]
          const n = models.filter((m) => m.domain === id).length
          return (
            <A key={id} className="domain-card" data-d={id} to={{ name: 'catalog', domain: id }}>
              <div className="en">{d.en}</div>
              <h3>{d.name}</h3>
              <p>{d.blurb}</p>
              <div className="meta">
                <span className="tag">{n} 个模型</span>
              </div>
            </A>
          )
        })}
      </div>

      <div className="section-head">
        <h2>从一条路径走</h2>
        <p>与其随机点开，不如按角色把模型串成几天的功课。</p>
      </div>
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

      <div className="section-head">
        <h2>今日建议</h2>
        <p>根据已读数量轮换一条路径。也可以直接从高频情境进。</p>
      </div>
      <div className="grid-2">
        <div className="panel">
          <h3>{nextPath.name}</h3>
          <p className="note">{nextPath.promise}</p>
          <p>
            <A className="btn btn-small" to={{ name: 'path', id: nextPath.id }}>
              打开路径
            </A>
          </p>
        </div>
        <div className="panel">
          <h3>组合拳</h3>
          <p className="note">重大决策、增长停滞、组织卡住、信息不完整——已经排好模型顺序。</p>
          <div className="chips" style={{ marginTop: 12 }}>
            {playbooks.slice(0, 4).map((p) => (
              <A key={p.id} className="chip" to={{ name: 'playbook', id: p.id }}>
                {p.name}
              </A>
            ))}
            <A className="chip" to={{ name: 'playbooks' }}>
              全部 →
            </A>
          </div>
        </div>
      </div>

      <div className="section-head">
        <h2>若你带着问题来</h2>
        <p>不要先选模型。先选像你的那句话。</p>
      </div>
      <div className="chips">
        {situations.map((s) => (
          <A key={s.id} className="chip" to={{ name: 'situations' }}>
            {s.question}
          </A>
        ))}
      </div>
    </>
  )
}
