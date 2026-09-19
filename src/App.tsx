import { useCallback, useEffect, useState } from 'react'
import type { Route } from './types.ts'
import { href, parseHash } from './lib/route.ts'
import { loadDesk, saveDesk, type DeskState } from './lib/store.ts'
import { A } from './components/A.tsx'
import { Home } from './views/Home.tsx'
import { Catalog } from './views/Catalog.tsx'
import { ModelPage } from './views/ModelPage.tsx'
import { MapPage } from './views/MapPage.tsx'
import { PathsPage } from './views/PathsPage.tsx'
import { PlaybooksPage } from './views/PlaybooksPage.tsx'
import { SituationsPage } from './views/SituationsPage.tsx'
import { ApplyPage, ComparePage, DeskPage } from './views/ApplyPage.tsx'

function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const sync = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', sync)
    if (!window.location.hash) window.location.hash = '/'
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  return route
}

export default function App() {
  const route = useRoute()
  const [desk, setDesk] = useState<DeskState>(() => loadDesk())

  useEffect(() => {
    saveDesk(desk)
  }, [desk])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  const markRead = useCallback((id: string) => {
    setDesk((d) => (d.read.includes(id) ? d : { ...d, read: [...d.read, id] }))
  }, [])

  return (
    <div className="site">
      <header className="header">
        <div className="wrap header-inner">
          <A to={{ name: 'home' }} className="brand">
            <span className="brand-mark" aria-hidden>
              <span />
            </span>
            <span className="brand-en">Diverse Thinking</span>
            <span className="brand-zh">多元思维</span>
          </A>
          <nav className="nav">
            <A to={{ name: 'catalog' }} className={route.name === 'catalog' || route.name === 'model' ? 'is-on' : ''}>
              模型馆
            </A>
            <A to={{ name: 'map' }} className={route.name === 'map' ? 'is-on' : ''}>
              关系图
            </A>
            <A to={{ name: 'paths' }} className={route.name === 'paths' || route.name === 'path' ? 'is-on' : ''}>
              学习路径
            </A>
            <A to={{ name: 'playbooks' }} className={route.name === 'playbooks' || route.name === 'playbook' ? 'is-on' : ''}>
              组合拳
            </A>
            <A to={{ name: 'situations' }} className={route.name === 'situations' ? 'is-on' : ''}>
              情境入口
            </A>
            <A to={{ name: 'desk' }} className={route.name === 'desk' ? 'is-on' : ''}>
              我的书桌
            </A>
          </nav>
          <form
            className="search"
            onSubmit={(e) => {
              e.preventDefault()
              const box = e.currentTarget.elements.namedItem('q') as HTMLInputElement
              window.location.hash = href({ name: 'catalog', q: box.value }).slice(1)
            }}
          >
            <input name="q" placeholder="搜索模型、案例、问题…" defaultValue={route.name === 'catalog' ? route.q : ''} />
            <button type="submit">检索</button>
          </form>
        </div>
      </header>

      <main className="main">
        <div className="wrap">
          {route.name === 'home' && <Home desk={desk} />}
          {route.name === 'catalog' && <Catalog domain={route.domain} q={route.q} desk={desk} />}
          {route.name === 'model' && (
            <ModelPage id={route.id} desk={desk} setDesk={setDesk} markRead={markRead} />
          )}
          {route.name === 'map' && <MapPage focus={route.focus} />}
          {route.name === 'paths' && <PathsPage />}
          {route.name === 'path' && <PathsPage id={route.id} />}
          {route.name === 'playbooks' && <PlaybooksPage />}
          {route.name === 'playbook' && <PlaybooksPage id={route.id} />}
          {route.name === 'situations' && <SituationsPage />}
          {route.name === 'apply' && <ApplyPage key={route.id} id={route.id} setDesk={setDesk} />}
          {route.name === 'compare' && <ComparePage a={route.a} b={route.b} />}
          {route.name === 'desk' && <DeskPage desk={desk} setDesk={setDesk} />}
        </div>
      </main>

      <footer className="footer">
        <div className="wrap">
          Diverse Thinking · 模型是地图，不是疆域。用来减少愚蠢，不用来装饰确定。内容供学习与辅助运用，不是专业咨询。
        </div>
      </footer>
    </div>
  )
}
