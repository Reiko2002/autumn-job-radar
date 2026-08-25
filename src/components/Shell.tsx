import type { ReactNode } from 'react'
import type { Page } from '../types'
import { Bell, Bookmark, BriefcaseBusiness, Compass, Radar, Settings2 } from './Icons'

const nav: Array<{ page: Page; label: string; icon: typeof Compass }> = [
  { page: 'jobs', label: '岗位广场', icon: Compass },
  { page: 'saved', label: '我的收藏', icon: Bookmark },
  { page: 'pipeline', label: '投递看板', icon: BriefcaseBusiness },
  { page: 'preferences', label: '求职意向', icon: Settings2 },
]

export function Shell({ page, setPage, children, savedCount }: { page: Page; setPage: (page: Page) => void; children: ReactNode; savedCount: number }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => setPage('jobs')}><span className="brand-mark"><Radar size={21} /></span><span><strong>秋招雷达</strong><small>JOB RADAR</small></span></button>
      <nav aria-label="主导航">
        {nav.map((item) => <button key={item.page} className={`nav-item ${page === item.page ? 'active' : ''}`} onClick={() => setPage(item.page)}><item.icon size={19} /><span>{item.label}</span>{item.page === 'saved' && savedCount > 0 && <em>{savedCount}</em>}</button>)}
      </nav>
      <div className="sidebar-footer">
        <div className="demo-chip"><i /> Demo Mode</div>
        <p>数据仅保存在你的浏览器</p>
        <div className="profile-mini"><span>MX</span><div><strong>马同学</strong><small>2027 届毕业生</small></div><button aria-label="通知"><Bell size={17} /></button></div>
      </div>
    </aside>
    <main className="main">{children}</main>
    <nav className="mobile-nav" aria-label="移动端导航">
      {nav.map((item) => <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => setPage(item.page)}><item.icon size={20} /><span>{item.label.replace('我的', '').replace('求职', '')}</span></button>)}
    </nav>
  </div>
}
